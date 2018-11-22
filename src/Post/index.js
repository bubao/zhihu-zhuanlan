/**
 * @author bubao 
 * @date: 2018-5-13 18:04:05 
 * @Last Modified by: bubao
 * @description 知乎专栏爬虫
 * @Last Modified time: 2018-11-22 23:35:22
 */

const api = require('./api.js');
const { loopMethod, rateMethod } = require('./utils.js');
const { request, assign, template } = require('../tools/commonModules.js');

/**
 * 通用方法
 * @param {string||number} ID 传入ID
 * @param {string} API 传入api
 * @param {string} countName 传入countName
 * @param {Function} infoMethod 传入方法
 */

const universalMethod = async (ID, API, countName, infoMethod, spinner) => {
	const urlTemplate = template(API)({ postID: ID, columnsID: ID });
	const count = (await infoMethod(ID))[countName];
	if (spinner) spinner.start();
	return new Promise((resolve) => {
		loopMethod(
			assign(
				{
					options: {
						urlTemplate,
					}
				},
				rateMethod(count, 20)
			), resolve, spinner);
	});
};

/**
 * 知乎专栏信息
 * @param {string} columnsID //专栏ID
 */
const zhuanlanInfo = async (columnsID) => {
	const urlTemplate = template(api.post.columns)({ columnsID });
	let object = {};
	object = {
		uri: urlTemplate,
		gzip: true,
	};

	return new Promise((resolve) => {
		request(object).then((data) => {
			resolve(JSON.parse(data.body));
		});
	});
}
/**
 * 专栏所有post
 * @param {string} columnsID 专栏ID
 * @param {object} spinner ora实例
 */
const zhuanlanPosts = (columnsID, spinner) => {
	return universalMethod(columnsID, api.post.page, 'postsCount', zhuanlanInfo, spinner);
};

module.exports = zhuanlanPosts;