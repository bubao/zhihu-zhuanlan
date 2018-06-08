/**
 * @author bubao 
 * @date: 2018-5-13 18:04:05 
 * @Last Modified by: bubao
 * @description 知乎专栏爬虫
 * @Last Modified time: 2018-06-07 14:16:20
 */
// const imgsrc = 'https://pic1.zhimg.com/';
const { request, url } = require('./../commonModules.js');
const { loopMethod, rateMethod } = require('./utils.js');
const assign = require('lodash/assign');
const template = require('lodash/template');
const API = require('./api.js');

/**
 * 通用方法
 * @param {string||number} ID 传入ID
 * @param {string} API 传入api
 * @param {string} countName 传入countName
 * @param {Function} infoMethod 传入方法
 */
const universalMethod = async (ID, API, countName, infoMethod) => {
	const urlTemplate = template(API)({ postID: ID, columnsID: ID });
	const count = (await infoMethod(ID))[countName];
	return new Promise((resolve, reject) => {
		loopMethod(
			assign(
				{
					options: {
						urlTemplate,
					}
				},
				rateMethod(count, 20)
			), resolve);
	});

};

/**
 * 知乎专栏信息
 * @param {string} columnsID //专栏ID
 */
const zhuanlanInfo = async (columnsID) => {
	const urlTemplate = template(API.post.columns)({ columnsID });
	let object = {};
	object = {
		url: urlTemplate,
		gzip: true,
	};
	return JSON.parse((await request(object)).body);
}
/**
 * 专栏所有post
 * @param {string} columnsID 专栏ID
 */
const zhuanlanPosts = (columnsID) => {
	return universalMethod(columnsID, API.post.page, 'postsCount', zhuanlanInfo);
};

module.exports = zhuanlanPosts;