/**
 * @author bubao 
 * @description 测试
 * @date: 2017-04-28 20:00:44
 * @Last Modified by: bubao
 * @Last Modified time: 2018-06-09 22:06:32
 */
import post, { markdown, zhuanlan } from './src';
const config = require('./config.js');
post(config.ID, './');
// markdown()
// zhuanlan()