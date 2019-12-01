/**
 * @author bubao
 * @description 专栏
 * @date: 2018-05-15 17:55:58
 * @Last Modified by: bubao
 * @Last Modified time: 2019-12-02 03:25:13
 */

const { Columns } = require("zhihu-api");
const decode = require("./tools/decode.js");
const EventEmitter = require('events')

class Post extends EventEmitter{
	constructor(props) {
		super();
		this.columnsID = props ? props.columnsID : this.columnsID
		this.next = props ? props.offset / 20 : this.next || 0
		this.instance = null
		this.get = this.getAll.bind(this)
	}

	static init(props){
		if (!this.instance) {
			this.instance = new this(props);
		}
		return this.instance;
	}

	async getAll(columnsID) {
		columnsID = columnsID ||this.columnsID
		if (!columnsID) {
			this.emit('error', 'columnsID of undefined');
			return ;
		}
		let next = 0;
		const limit = 20;
		const columns = Columns.init()
		const Info = await columns.info(columnsID);
		if (Info.error) {
			this.emit('error', Info.error);
			return ;
		}
		const { articles_count } = Info.body;
		this.emit('info', Info.body)
		let data
		columns.on("data", res => {
			if (res.content) {
				data = decode(res.content)
				this.emit('single_data', data)
			}
			if (res.error) {
				this.emit('error', res.error);
			}
		})
		while (next * limit <= articles_count) {
			/**
			 * 获取文章简介
			 */
			const ArticlesInfo = await columns.articlesInfo(columnsID, limit, next);
			if (ArticlesInfo.error) {
				this.emit('error', ArticlesInfo.error);
			}
			/**
			 * 获取专栏文章内容
			 */
			await columns.articles(ArticlesInfo.body.data);
			next += 1;
		}
	}
}

module.exports = Post;
