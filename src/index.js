/**
 * @author bubao
 * @description 专栏
 * @date: 2018-05-15 17:55:58
 * @Last Modified by: bubao
 * @Last Modified time: 2019-04-09 02:01:47
 */

const { Columns } = require("zhihu-api");
const decode = require("./tools/decode.js");

/**
 *  知乎专栏抓取器
 * @param {string} postID 知乎专栏的ID
 * @param {object} spinner ora实例
 */
function Post(postID, spinner) {
	return Columns(postID, spinner).then(decode);
}

module.exports = Post;
