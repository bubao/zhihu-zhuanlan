/**
 * @description: html内容转markdown
 * @author: bubao
 * @Date: 2018-05-15 17:56:12
 * @LastEditors: bubao
 * @LastEditTime: 2020-09-15 16:56:23
 */

const times = require("lodash/times");
const compact = require("lodash/compact");
const TurndownService = require("turndown");
const filenamify = require("filenamify");

const formatDate = require("./formatDate");

/**
 * 转换内容，将部分不适合转换的标签改为合适转换的标签
 * @param {string} content 知乎专栏的Markdown内容
 */
const replaceContent = content => {
	return content
		.replace(/<br>/g, "\n")
		.replace(/<code lang="/g, "<pre><code class=\"language-")
		.replace(/\n<\/code>/g, "\n</code></pre>");
};

/**
 * 转换内容，连接转换为绝对连接
 * @param {string} content 知乎专栏的Markdown内容
 */
const replaceImage = content => {
	const reg = /<figure><noscript>.*?<\/noscript>.*?<\/figure>/g;
	const reg2 = /src="(.*?)"/;
	let src = content.match(reg);
	const imageList = [];
	src = compact(src); // 使用lodash ，即便是src为null也能够转为空的数组
	times(src.length, imageNum => {
		imageList.push(`\n\n<img src="${src[imageNum].match(reg2)[1]}">\n\n`);
	});
	times(src.length, imageNum => {
		content = content.replace(src[imageNum], imageList[imageNum]);
	});
	return content;
};

/**
 * decode
 * @param {string} res 数据
 */
const decode = results => {
	const Turndown = Decoder.init();
	results.content = replaceContent(results.content);
	results.content = replaceImage(results.content);
	const content = Turndown.turndown(results.content);
	const { title } = results;
	const time = formatDate(results.updated * 1000, "yyyy-MM-dd");
	const filename = `${time};${filenamify(title)}`;
	// console.log(filename)

	const postUrl = results.url;
	const copyRight = `\n\n知乎原文: [${title}](https://zhuanlan.zhihu.com${postUrl})\n\n\n`;
	const header = `# ${title}\n\ndate: ${time} \n\n\n`;
	return {
		title,
		filename,
		header,
		content,
		copyRight,
		time: time,
		json: results
	};
};

class Decoder {
	constructor() {
		this.instance = null;
	}

	static init() {
		let Turndown;
		if (!this.instance) {
			Turndown = new TurndownService();
			Turndown.addRule("indentedCodeBlock", {
				filter(node, options) {
					return (
						options.codeBlockStyle === "indented" &&
						node.nodeName === "PRE" &&
						node.firstChild &&
						node.firstChild.nodeName === "CODE"
					);
				},
				replacement(content, node) {
					return `'\n\`\`\`${node.firstChild.getAttribute(
						"class"
					).replace("language-", "")}\n${content}\n\`\`\`\n`;
				}
			});
			this.instance = Turndown;
		}
		return this.instance;
	}
}

module.exports = decode;
