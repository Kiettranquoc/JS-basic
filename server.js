const http = require('http');
const fs = require('fs');
const path = require('path');
const querystring = require('querystring');
const WebSocket = require('ws');
const { MongoClient } = require('mongodb');

// MongoDB connection
const mongoURL = 'mongodb://localhost:27017';
const dbName = 'myApp';
const collectionName = 'persons';

let db, personsCollection;

// Kết nối MongoDB
MongoClient.connect(mongoURL, { useUnifiedTopology: true })
  .then(client => {
    console.log("✅ Đã kết nối MongoDB");
    db = client.db(dbName);
    personsCollection = db.collection(collectionName);

    // Khi có MongoDB rồi → chạy server
    startServer();
  })
  .catch(err => console.error("❌ Lỗi kết nối MongoDB:", err));

// Tạo WebSocket server khi HTTP server đã sẵn sàng
function startServer() {
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
      req.on('end', async () => {
        const parsed = querystring.parse(body);
        const newPerson = { name: parsed.name, age: parseInt(parsed.age) };

        await personsCollection.insertOne(newPerson);
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

  wss.on('connection', async (ws) => {
    console.log("🟢 WebSocket client kết nối");

    const persons = await personsCollection.find({}).toArray();
    ws.send(JSON.stringify({ type: 'init', data: persons }));
  });

  server.listen(5000, () => {
    console.log("🚀 Server chạy tại http://localhost:5000");
  });
}
