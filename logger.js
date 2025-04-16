const fs = require('fs');

const logPath = './log.txt';
const configPath = './config.json';

fs.appendFile(logPath, `Ứng dụng chạy lúc ${new Date().toLocaleString()}\n`, err => {
  if (err) throw err;
  console.log("✅ Đã ghi log.");
});

fs.readFile(configPath, 'utf8', (err, data) => {
  if (err) throw err;
  console.log("🔧 Nội dung cấu hình:");
  console.log(data);
});
