/**
 * @author bubao 
 * @description 测试
 * @date: 2017-04-28 20:00:44
 * @Last Modified by: bubao
 * @Last Modified time: 2018-06-10 02:00:43
 */
const { zhuanlan, markdown, post } = require('./index');
const config = require('./config.js');
zhuanlan(config.ID, './');
// markdown()
// zhuanlan()