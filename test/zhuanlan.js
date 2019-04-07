const { zhuanlan } = require("..");
const fs = require("fs");
const writeFile = (path, filename, data, format) => {
	fs.writeFile(`${path}.${format}`, data, "utf8", err => {
		if (err) throw err;
		console.log(
			`${format === "json" ? "🍅" : "✅"}  ${filename}.${format}`
		);
	});
};
const run = async (path, postId) => {
	if (!fs.existsSync(`${path}/${postId}`)) {
		fs.mkdir(`${path}/${postId}`, () => {});
	}
	const arrJson = await zhuanlan(postId);
	arrJson.MarkDown.forEach(element => {
		const { filename, header, content, copyRight, json } = element;
		writeFile(
			`${path}/${postId}/${filename}`,
			filename,
			header + content + copyRight,
			"md"
		);
		writeFile(
			`${path}/${postId}/${filename}`,
			filename,
			JSON.stringify(json),
			"json"
		);
	});
};

run("./", "oh-hard");
