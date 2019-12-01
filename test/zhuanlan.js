const Zhuanlan = require("..");
const fs = require("fs");

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

const mkdir = (...filePath) => {
	if (isArrayLike(filePath)) {
		filePath = require("path").resolve(...filePath);
	}
	return new Promise((resolve, reject) => {
		const isExists = fs.existsSync(`${filePath}`);
		if (isExists) {
			console.log(
				`⚓  ${require("path").basename(filePath)} 文件夹已经存在`
			);
		} else {
			fs.mkdir(`${filePath}`, error => {
				if (error) {
					reject(error);
				} else {
					console.log(
						`🤖 创建 ${require("path").basename(
							filePath
						)}文件夹成功`
					);
					resolve();
				}
			});
		}
	});
};

const writeFile = (path, filename, data, format) => {
	fs.writeFile(`${path}.${format}`, data, "utf8", err => {
		if (err) throw err;
		console.log(
			`${format === "json" ? "🍅" : "✅"}  ${filename}.${format}`
		);
	});
};
const run = async (path, columnsID) => {
	const zhihu = Zhuanlan.init({columnsID})
	let title
	zhihu.once('info',(data)=>{
		title = data.title
		mkdir(`${path}/${data.title}`);
	})
	zhihu.on('single_data',(element)=>{
		const { filename, header, content, copyRight, json } = element;
		writeFile(
			`${path}/${title}/${filename}`,
			filename,
			header + content + copyRight,
			"md"
		);
		writeFile(
			`${path}/${title}/${filename}`,
			filename,
			JSON.stringify(json),
			"json"
		);
	})
	zhihu.getAll()
};

run("./", "YJango");
