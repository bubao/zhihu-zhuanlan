/**
 * @author bubao 
 * @description 
 * @date: 2018-05-15 18:13:14 
 * @Last Modified by: bubao
 * @Last Modified time: 2018-06-06 15:51:31
 */

const { request, url } = require('../commonModules.js');
const forEach = require('lodash/forEach')
const fs = require('fs');

let requestMethod = (options) => {
	return request(options).then((c) => {
		return JSON.parse(c.body);
	});
};
/**
* 
* @param {nubmer} count 总数
* @param {nubmer} cycle 周期
*/
let rateMethod = (count, cycle) => {
	count = count === undefined ? 20 : count;
	cycle = cycleMethod(cycle);
	let posts = count % cycle;
	let times = (count - posts) / cycle;
	return {
		times,
		count,
		cycle,
		writeTimes: 0,
		allObject: {}
	}
}

let cycleMethod = (cycle) => {
	let defaultCycle = 20;
	if (cycle && cycle !== defaultCycle) {
		cycle = cycle % defaultCycle;
	}
	cycle = cycle || defaultCycle;
	return cycle;
}
/**
 * 
 * @param {object} config 配置信息
 * @param {function} callback 回调函数
 */
let loopMethod = (config, callback) => {
	let { urlTemplate, ...options } = config.options;
	let opts = {
		url: url.resolve(urlTemplate, `?limit=${config.cycle}&offset=${config.writeTimes * 20}`),
		...options
	}
	requestMethod(opts).then(c => {
		forEach(c, (item, index) => {
			config.allObject[index + config.writeTimes * 20] = item;
		});
		if (config.writeTimes === config.times) {
			callback(config.allObject);
		} else {
			config.writeTimes += 1;
			loopMethod(config, callback);
		}
	})
}

module.exports = {
	loopMethod,
	cycleMethod,
	rateMethod,
	requestMethod
}