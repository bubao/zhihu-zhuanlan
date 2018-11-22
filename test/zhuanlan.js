const { zhuanlan } = require('../index.js');
const fs = require('fs');
const writeFile = (path, filename, data, format) => {
	fs.writeFile(`${path}.${format}`, data, 'utf8', (err) => {
		if (err) throw err;
		console.log(`${format === "json" ? "🍅" : "✅"}  ${filename}.${format}`);
	});
}
const run = async (path, postId) => {
	const arrJson = await zhuanlan(postId);
	arrJson.MarkDown.forEach(element => {
		const {
			filename,
			header,
			content,
			copyRight,
			json } = element;
		writeFile(path, filename, header + content + copyRight, "md");
		writeFile(path, filename, json, "json");
	});
}

run("./", "oh-hard");