const http = require('http');
const fs = require('fs');
const path = require('path');
const querystring = require('querystring');
const WebSocket = require('ws');

let persons = [
  { name: 'Nam', age: 22 },
  { name: 'Lan', age: 20 }
];

const server = http.createServer((req, res) => {
  if (req.method === 'GET') {
    const filePath = path.join(__dirname, 'public', 'index.html');
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500);
        return res.end('Lỗi server');
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
  } else if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
      const parsed = querystring.parse(body);
      const newPerson = { name: parsed.name, age: parseInt(parsed.age) };
      persons.push(newPerson);
      broadcast({ type: 'new', data: newPerson });
      res.writeHead(302, { 'Location': '/' });
      res.end();
    });
  }
});

const wss = new WebSocket.Server({ server });

function broadcast(message) {
  const data = JSON.stringify(message);
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
}

wss.on('connection', (ws) => {
  ws.send(JSON.stringify({ type: 'init', data: persons }));
});

server.listen(5000, () => {
  console.log('🚀 Server HTTP/WebSocket đang chạy tại http://localhost:5000');
});
