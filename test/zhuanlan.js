/**
 * @description:
 * @author: bubao
 * @Date: 2020-07-08 01:19:44
 * @LastEditors: bubao
 * @LastEditTime: 2020-09-16 17:08:47
 */
const Zhuanlan = require("..");
const fs = require("fs");
const util = require("util");
const FsStat = util.promisify(fs.stat);
const MAX_SAFE_INTEGER = 9007199254740991;

function isLength(value) {
	return (
		typeof value === "number" &&
		value > -1 &&
		value % 1 === 0 &&
		value <= MAX_SAFE_INTEGER
	);
}

function isArrayLike(value) {
	return (
		value != null && typeof value !== "function" && isLength(value.length)
	);
}

const mkdir = async (...filePath) => {
	if (isArrayLike(filePath)) {
		filePath = require("path").resolve(...filePath);
	}
	await FsStat(`${filePath}`).then(() => {
		console.log(
			`⚓  ${require("path").basename(filePath)} 文件夹已经存在`
		);
	}).catch(() => {
		fs.mkdir(`${filePath}`, () => {
			console.log(
				`🤖 创建 ${require("path").basename(
					filePath
				)}文件夹成功`
			);
		});
	});
};

const writeFile = (path, data, format) => {
	fs.writeFile(`${path}.${format}`, data, "utf8", err => {
		if (err) throw err;
	});
};
const run = (path, columnsID) => {
	const zhihu = Zhuanlan.init({ columnsID });
	let dir;
	zhihu.once("info", (data) => {
		dir = data.title;
		mkdir(`${path}/${data.title}`);
	});
	let write_count = 0;
	zhihu.on("batch_data", (element) => {
		// console.log((element.now_count / element.articles_count * 100).toFixed(2) + "%");
		element.data.map(({ filenameTime, header, content, copyRight, json }) => {
			writeFile(
				`${path}/${dir}/${filenameTime}`,
				header + content + copyRight,
				"md"
			);
			writeFile(
				`${path}/${dir}/${filenameTime}`,
				JSON.stringify(json),
				"json"
			);
			write_count++;
			console.log((write_count / element.articles_count * 100).toFixed(2) + "%");
		});
	});
	zhihu.getAll();
};

run("./", "YJango");
