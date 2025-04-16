const fs = require('fs');
const os = require('os');

const systemInfo = {
  freemem: os.freemem(),
  totalmem: os.totalmem(),
  uptime: os.uptime(),
  timestamp: new Date()
};

fs.writeFile('cache.json', JSON.stringify(systemInfo, null, 2), err => {
  if (err) throw err;
  console.log("📦 Đã lưu cache hệ thống.");
});
