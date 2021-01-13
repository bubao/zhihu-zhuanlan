/**
 * @description: 使用监听函数
 * @author: bubao
 * @date: 2021-01-13 20:10:14
 * @last author: bubao
 * @last edit time: 2021-01-13 20:44:29
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
const run = async (path, columnsID) => {
	const zhihu = new Zhuanlan({ columnsID });

	zhihu.on("error", console.error);
	let dir;
	zhihu.onInfo((data) => {
		dir = data.title;
		mkdir(`${path}/${data.title}`);
	});
	zhihu.onDone();
	let write_count = 0;
	zhihu.onData((element) => {
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
