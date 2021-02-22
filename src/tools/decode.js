/**
 * @description: html内容转markdown
 * @author: bubao
 * @Date: 2018-05-15 17:56:12
 * @last author: bubao
 * @last edit time: 2021-02-23 03:09:40
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
 * 转换内容，链接转换为绝对链接
 * @param {string} content 知乎专栏的Markdown内容
 * @returns {string} content
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
 * @param {string} results 数据
 * @returns {{
		title:string,
		filenameTime:string,
		filename:string,
		header:string,
		content:string,
		copyRight:string,
		time: string,
		json: results
	}}
 */
const decode = results => {
	const Turndown = Decoder.init();
	const content = Turndown.turndown(replaceContent(replaceImage(results.content)));
	const { title } = results;
	const time = formatDate(results.updated * 1000, "yyyy-MM-dd");
	const filename = filenamify(title);
	const filenameTime = `${time};${filename}`;

	const postUrl = results.url;
	const copyRight = `\n\n知乎原文: [${title}](https://zhuanlan.zhihu.com${postUrl.replace("https://zhuanlan.zhihu.com", "")})\n\n\n`;
	const header = `# ${title}\n\ndate: ${time} \n\n\n`;

	return {
		title, // 标题
		filenameTime, // 带时间的文件名
		filename, // 文件名，由title转为符合系统命名的文件名
		header, // 文章头信息
		content, // 文章内容
		copyRight, // 版权声明
		time: time, // 文章创建时间
		json: results // 文章的源信息
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
