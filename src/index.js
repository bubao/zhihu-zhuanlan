const console = require('better-console');
const path = require('path');
const Posts = require('./Post');
const markdown = require('./markdown');
const fs = require('fs');

/**
 * mkdir
 * @param {string} filePath dir路径
 */
function mkdir(filePath, name) {
	if (fs.existsSync(`${filePath}`)) {
		console.log(`⚓  ${name} 文件夹已经存在`);
	} else {
		fs.mkdir(`${filePath}`, (err) => {
			if (err) {
				console.error(err);
			}
			console.log(`🤖 创建 ${name}文件夹成功`);
		});
	}
}
/**
 *  知乎专栏抓取器
 * @param {string} postID 知乎专栏的ID
 * @param {string} localPath 下载路径
 * @param {string} format 格式，可省略
 */
async function Post(postID, localPath = './') {
	console.log(`-----🐛 ${postID} start -----`);
	mkdir(path.resolve(localPath, postID), postID);
	markdown(localPath, postID, await Posts(postID));
};

module.exports = Post;