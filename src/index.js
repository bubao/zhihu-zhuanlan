/**
 * @author bubao 
 * @description 专栏
 * @date: 2018-05-15 17:55:58
 * @Last Modified by: bubao
 * @Last Modified time: 2018-06-09 20:17:13
 */
const mkdirp = require('mkdirp');
const console = require('better-console');
const path = require('path');
const Posts = require('./Post');
const markdown = require('./markdown');
const fs = require('fs');

/**
 * mkdir
 * @param {string} filePath dir路径
 */
function mkdir(filePath) {
	if (fs.existsSync(`${filePath}`)) {
		console.log(`⚓  ${path.basename(filePath)} 文件夹已经存在`);
	} else {
		mkdirp(`${filePath}`, (err) => {
			if (err) {
				console.error(err);
			} else {
				console.log(`🤖 创建 ${path.basename(filePath)}文件夹成功`);
			}
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
	mkdir(path.resolve(localPath, postID));
	markdown(localPath, postID, await Posts(postID));
};

module.exports = Post;