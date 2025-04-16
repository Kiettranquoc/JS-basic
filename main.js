const { appName, version } = require('./modules/variables');
const sayHi = require('./modules/sayHi');

console.log(`Ứng dụng: ${appName} - Phiên bản: ${version}`);
sayHi("Node.js");
