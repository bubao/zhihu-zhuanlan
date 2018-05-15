const config = require('./config.js');
const zhuanlan = require('./src');

zhuanlan(config.ID).then(console.log('ccc'));