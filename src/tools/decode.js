/**
 * @author bubao
 * @description html内容转markdown
 * @date: 2018-05-15 17:56:12
 * @Last Modified by: bubao
 * @Last Modified time: 2019-04-09 02:46:47
 */
const times = require("lodash/times");
const compact = require("lodash/compact");
const TurndownService = require("turndown");
const filenamify = require("filenamify");
const Turndown = new TurndownService();
const formatDate = require("./formatDate");

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
		)}\n${content}\n\`\`\`\n`;
	}
});

/**
 * 转换内容，将部分不适合转换的标签改为合适转换的标签
 * @param {string} content 知乎专栏的Markdown内容
 */
const replaceContent = content => {
	return content
		.replace(/<br>/g, "\n")
		.replace(/<code lang="/g, '<pre><code class="language-')
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
	let ArrayObj = [];
	return new Promise(resolve => {
		times(results.length, i => {
			results[i].content = replaceContent(results[i].content);
			results[i].content = replaceImage(results[i].content);
			let content = Turndown.turndown(results[i].content);
			const { title } = results[i];
			const time = formatDate(results[i].updated * 1000, "yyyy-MM-dd");
			const filename = `${time};${filenamify(title)}`;

			const postUrl = results[i].url;
			const copyRight = `\n\n知乎原文: [${title}](https://zhuanlan.zhihu.com${postUrl})\n\n\n`;
			const header = `# ${title}\n\ndate: ${time} \n\n\n`;
			ArrayObj.push({
				title,
				filename,
				header,
				content,
				copyRight,
				time: time,
				json: results[i]
			});
			if (results.length === ArrayObj.length) {
				resolve(ArrayObj);
			}
		});
	});
};

module.exports = decode;
