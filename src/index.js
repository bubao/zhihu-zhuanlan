/**
 * @author bubao 
 * @description 专栏
 * @date: 2018-05-15 17:55:58
 * @Last Modified by: bubao
 * @Last Modified time: 2018-11-22 19:53:01
 */

const Posts = require('./Post');
const decode = require('./tools/decode');

/**
 *  知乎专栏抓取器
 * @param {string} postID 知乎专栏的ID
 */
function Post(postID) {
	return Posts(postID).then(decode);
};

module.exports = Post;