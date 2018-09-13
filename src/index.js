/**
 * @author bubao 
 * @description 专栏
 * @date: 2018-05-15 17:55:58
 * @Last Modified by: bubao
 * @Last Modified time: 2018-09-13 16:56:56
 */

// const console = require('better-console');
const Posts = require('./Post');
const decode = require('./decode');

/**
 *  知乎专栏抓取器
 * @param {string} postID 知乎专栏的ID
 */
async function Post(postID) {
	return await decode(await Posts(postID));
};

module.exports = Post;