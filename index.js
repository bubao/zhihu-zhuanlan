/**
 * @author bubao 
 * @description module
 * @date: 2017-04-28 20:00:44
 * @Last Modified by: bubao
 * @Last Modified time: 2018-09-13 16:50:31
 */
const zhuanlan = require('./src');
const post = require("./src/Post");
const markdown = require('./src/decode');

// module.exports = { post, markdown, zhuanlan };
module.exports = {
	zhuanlan,
	post
}