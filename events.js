const EventEmitter = require('events');
const emitter = new EventEmitter();

const dataArray = ['Dữ liệu 1', 'Dữ liệu 2', 'Dữ liệu 3'];

emitter.on('start', () => console.log("🔁 Bắt đầu xử lý..."));
emitter.on('process', (data) => console.log(`⚙️ Đang xử lý: ${data}`));
emitter.on('end', () => console.log("✅ Hoàn tất xử lý."));

emitter.emit('start');
dataArray.forEach(item => emitter.emit('process', item));
emitter.emit('end');
