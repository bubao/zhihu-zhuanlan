/**
 * @author bubao
 * @description
 * @date: 2018-05-15 17:59:47
 * @Last Modified by: bubao
 * @Last Modified time: 2019-04-07 23:17:05
 */

const fs = require("fs");
const url = require("url");
const path = require("path");
const mkdirp = require("mkdirp");
const assign = require("lodash/assign");
const forEach = require("lodash/forEach");
const template = require("lodash/template");
const { request } = require("self-promise-request");

const MAX_SAFE_INTEGER = 9007199254740991;

function isLength(value) {
	return (
		typeof value == "number" &&
		value > -1 &&
		value % 1 == 0 &&
		value <= MAX_SAFE_INTEGER
	);
}

function isArrayLike(value) {
	return (
		value != null && typeof value != "function" && isLength(value.length)
	);
}
/**
 * mkdir
 * @param {Array|String} filePath dir路径
 */
const mkdir = (...filePath) => {
	if (isArrayLike(filePath)) {
		filePath = path.resolve(...filePath);
	}
	return new Promise((resolve, reject) => {
		const isExists = fs.existsSync(`${filePath}`);
		if (isExists) {
			console.log(`⚓  ${path.basename(filePath)} 文件夹已经存在`);
		}
		mkdirp(`${filePath}`, error => {
			if (error) {
				reject(error);
			} else {
				if (isExists) {
					console.log(`🤖 创建 ${path.basename(filePath)}文件夹成功`);
				}
				resolve();
			}
		});
	});
};

module.exports = {
	url,
	path,
	mkdir,
	assign,
	forEach,
	request,
	template
};
