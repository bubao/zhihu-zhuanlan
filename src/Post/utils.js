/**
 * @author bubao 
 * @description 
 * @date: 2018-05-15 18:13:14 
 * @Last Modified by: bubao
 * @Last Modified time: 2018-11-22 19:35:17
 */

const { url, request, forEach } = require('../tools/commonModules.js');

const requestMethod = (options) => {
	return request(options).then((c) => {
		return JSON.parse(c.body);
	});
};

const cycleMethod = (cycle) => {
	const defaultCycle = 20;
	if (cycle && cycle !== defaultCycle) {
		cycle %= defaultCycle;
	}
	cycle = cycle || defaultCycle;
	return cycle;
}
/**
*
* @param {nubmer} count 总数
* @param {nubmer} cycle 周期
*/
const rateMethod = (count, cycle) => {
	count = count === undefined ? 20 : count;
	cycle = cycleMethod(cycle);
	const posts = count % cycle;
	const times = (count - posts) / cycle;
	return {
		times,
		count,
		cycle,
		writeTimes: 0,
		allObject: {}
	}
}

/**
 *
 * @param {object} config 配置信息
 * @param {function} callback 回调函数
 */
const loopMethod = (config, callback, spinner) => {
	const { urlTemplate, ...options } = config.options;
	const opts = {
		url: url.resolve(urlTemplate, `?limit=${config.cycle}&offset=${config.writeTimes * 20}`),
		...options
	}
	requestMethod(opts).then(c => {
		forEach(c, (item, index) => {
			config.allObject[index + config.writeTimes * 20] = item;
		});
		if (config.writeTimes === config.times) {
			if (spinner) spinner.succeed(`It's OK!`);
			callback(config.allObject);
		} else {
			config.writeTimes += 1;
			loopMethod(config, callback, spinner);
		}
	})
}

module.exports = {
	loopMethod,
	cycleMethod,
	rateMethod,
	requestMethod
}
