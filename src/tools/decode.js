/**
 * @author bubao 
 * @description html内容转markdown
 * @date: 2018-05-15 17:56:12
 * @Last Modified by: bubao
 * @Last Modified time: 2018-11-22 20:25:34
 */
const times = require('lodash/times');
const compact = require('lodash/compact');
const TurndownService = require('turndown');

const imgsrc = '![](https://pic1.zhimg.com/';
const Turndown = new TurndownService();

/**
 * Turndown config start
 */
Turndown.addRule('fencedCodeBlock', {
	filter: (node, options) => (
		options.codeBlockStyle === 'fenced' &&
		node.nodeName === 'PRE' &&
		node.firstChild &&
		node.firstChild.nodeName === 'CODE'
	),
	replacement: (content, node, options) => (
		'\n```' + node.firstChild.getAttribute('class') + '\n' +
		content +
		'\n```\n'
	)
});
/**
 * Turndown config end
 */

/**
 * decode
 * @param {string} res 数据
 */
const decode = (res) => {
	const jsonObj = res;
	let ArrayObj = [];
	const jsonObjLength = Object.getOwnPropertyNames(jsonObj).length;
	return new Promise((resolve) => {
		times(jsonObjLength, (i) => {
			jsonObj[i].content = jsonObj[i].content.replace(/<br>/g, '\n').replace(/<code lang="/g, '<pre><code class="language-').replace(/\n<\/code>/g, '\n<\/code><\/pre>');
			let content = Turndown.turndown(jsonObj[i].content);
			const reg = /<noscript>.*?<\/noscript>/g;
			const reg2 = /src="(.*?)"/;
			let src = content.match(reg);
			const imageList = [];
			src = compact(src); // 使用lodash ，即便是src为null也能够转为空的数组
			times(src.length, (imageNum) => {
				imageList.push(`![](${src[imageNum].match(reg2)[1]})`);
			});
			times(src.length, (imageNum) => {
				content = content.replace(src[imageNum], imageList[imageNum]);
			});
			// const pattern = new RegExp("[`~!@#$^&'*()=|{}':;',\\[\\]<>/?~！@#￥……&*（）&mdash;—|{}【】‘；：”“'。，、？]");
			const pattern = new RegExp("[？、,\\[\\]╲*“”<>|（）]");
			let rs = '';
			let { title } = jsonObj[i];
			times(title.length, (k) => {
				const rs2 = title.substr(k, 1).replace(/"/, ''); // 使用正则表达式单独去除双引号
				rs += rs2.replace(pattern, '');
			});
			rs = rs.replace("\\\\", '');
			content = content.replace(/!\[\]\(/g, imgsrc);

			const time = `${jsonObj[i].publishedTime}`;
			const T = time.replace("T", ",").replace("+08:00", "");
			// const Ti = T.split(',')[0];

			const postId = jsonObj[i].url;
			const copyRight = `知乎原文: [${title}](https://zhuanlan.zhihu.com${postId})`;
			// const header = `# ${title}\n\ndate: ${T.replace(",", " ")} `;
			ArrayObj.push({
				postId,
				copyRight,
				title,
				content,
				time: T
			});
			if (jsonObjLength === ArrayObj.length) {
				resolve({
					MarkDown: ArrayObj,
					json: res
				});
			}
		});
	});
};

module.exports = decode;