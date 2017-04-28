const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio')
const config = require('./config.js');
const server = require('./download.js');
const zhihuId = config.zhihuId;
const dir = `${zhihuId}`;
const url = `https://zhuanlan.zhihu.com/${zhihuId}`;


// const urlp = `https://zhuanlan.zhihu.com/api/columns/${zhihuId}/posts?limit=20&amp;offset=0`;

console.log('---------start----------------');
fs.exists(dir, function(exists) {
	if (exists)
		console.log(dir + '文件夹存在');
	else {
		fs.mkdir(dir, function(err) {
			if (err)
				console.error(err);
			console.log('创建' + dir + '文件夹成功');
		})
	}

});
server.download(url, function(data) {
	if (data) {
		//console.log(data);

		var $ = cheerio.load(data);

		var postsCount = JSON.parse($("textarea#preloadedState").text()).columns[`${zhihuId}`].postsCount
			//console.log(postsCount)
			//console.log("done");

		loopdown(postsCount)
	}
});

function loopdown(postsCount) {
	// body...
	var posts = postsCount % 20;
	var times = (postsCount - posts) / 20

	for (var i = 0; i <= times; i++) {
		var urlp = `https://zhuanlan.zhihu.com/api/columns/${zhihuId}/posts?limit=20&amp;offset=${i*20}`

		request
			.get(urlp, function(err, res, body) {
				// console.log(err);
				// console.log(res);
				//console.log(body);
			})
			.pipe(fs.createWriteStream(`${dir}/${i}.json`))
		console.log(`${dir}/${i}.json`)
	}
}