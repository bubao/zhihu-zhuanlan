/**
 * @author bubao 
 * @description html内容转markdown
 * @date: 2018-05-15 17:56:12
 * @Last Modified by: bubao
 * @Last Modified time: 2018-06-09 20:42:19
 */
const fs = require('fs');
const times = require('lodash/times');
const compact = require('lodash/compact');
const console = require('better-console');
const TurndownService = require('turndown');

const imgsrc = '![](https://pic1.zhimg.com/';
const Turndown = new TurndownService();

Turndown.addRule('indentedCodeBlock', {
	filter: function (node, options) {
		return (
			options.codeBlockStyle === 'indented' &&
			node.nodeName === 'PRE' &&
			node.firstChild &&
			node.firstChild.nodeName === 'CODE'
		)
	},
	replacement: function (content, node, options) {
		return (
			'\n```' + node.firstChild.getAttribute('class') + '\n' +
			content +
			'\n```\n'
		)
	}
});
Turndown.addRule('fencedCodeBlock', {
	filter: function (node, options) {

		return (
			options.codeBlockStyle === 'fenced' &&
			node.nodeName === 'PRE' &&
			node.firstChild &&
			node.firstChild.nodeName === 'CODE'
		)
	},

	replacement: function (content, node, options) {
		return (
			'\n```' + node.firstChild.getAttribute('class') + '\n' +
			content +
			'\n```\n'
		)
	}
});

/**
 * markdown(path, dirname, res)
 * @param {string} path 下载地址
 * @param {string} dirname 知乎专栏ID
 * @param {string} res 数据
 */
const markdown = async (path, dirname, res) => {
	const jsonObj = res;
	times(Object.getOwnPropertyNames(jsonObj).length, (i) => {
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
		const Ti = T.split(',')[0];

		const postId = jsonObj[i].url;
		const copyRight = `\n\n知乎原文: [${title}](https://zhuanlan.zhihu.com${postId})\n\n\n`;
		const header = `# ${title}\n\ndate: ${T.replace(",", " ")} \n\n\n`;
		if (!fs.existsSync(`${path}/${dirname}`)) {
			fs.mkdirSync(`${path}/${dirname}`);
		}
		// 如果没有指定目录，创建之
		fs.writeFileSync(`${path}/${dirname}/${Ti};${rs}.md`, header, 'utf8', (err) => {
			if (err) throw err;
			console.log(`❌ ${Ti};${rs}.md`);
		});
		fs.writeFileSync(`${path}/${dirname}/${Ti};${rs}.json`, JSON.stringify(jsonObj[i]), 'utf8', (err) => {
			if (err) throw err;
			console.log(`❌ ${Ti};${rs}.json`);
		});
		fs.appendFile(`${path}/${dirname}/${Ti};${rs}.md`, content + copyRight, 'utf8', (err) => {
			if (err) throw err;
			console.log(`🍅  ${Ti};${rs}.md`);
		});
	});
};

module.exports = markdown;