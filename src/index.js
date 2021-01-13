/**
 * @description: 专栏
 * @author: bubao
 * @Date: 2018-05-15 17:55:58
 * @last author: bubao
 * @last edit time: 2021-01-13 20:41:51
 */

const { Post } = require("zhihu-api");
const Articles = Post.Articles;
const decode = require("./tools/decode.js");
const EventEmitter = require("events").EventEmitter;

class App extends EventEmitter {
	constructor(props) {
		super();
		this.columnsID = props ? props.columnsID : this.columnsID;
		this.instance = null;
		this.get = this.getAll.bind(this);
	}

	static init(props) {
		if (!this.instance) {
			this.instance = new this(props);
		}
		return this.instance;
	}

	/**
	 * @description 监听Info
	 * @author bubao
	 * @date 2021-01-13
	 * @param {function} [cb=() => {}]
	 * @memberof App
	 */
	onInfo(cb = () => {}) {
		this.once("info", cb);
	}

	/**
	 * @description 监听完成
	 * @author bubao
	 * @date 2021-01-13
	 * @param {function} [cb=() => {}]
	 * @memberof App
	 */
	onDone(cb = () => {}) {
		this.once("done", () => {
			this.removeListener("info", () => {});
			this.removeListener("batch_data", () => {});
			cb();
		});
	}

	/**
	 * @description 监听数据
	 * @author bubao
	 * @date 2021-01-13
	 * @param {function} [cb=() => {}]
	 * @memberof App
	 */
	onData(cb = (data) => data) {
		this.on("batch_data", cb);
	}

	async getAll(columnsID) {
		columnsID = columnsID || this.columnsID;
		if (!this.columnsID) {
			this.emit("error", "columnsID of undefined");
			return;
		}

		const columns = new Articles(columnsID);
		const Info = await columns.info();
		if (Info.error) {
			this.emit("error", Info.error);
			return;
		}
		this.emit("info", Info);
		const articles_count = Info.articles_count;
		if (!Info.articles_count) {
			this.emit("error", "Info articles_count is 0");
			return;
		}
		let isEnd = false;
		let now_count = 0;
		while (!isEnd) {
			const res = await columns.next();
			const batch_data = res.data.map(decode);
			now_count = now_count + batch_data.length;
			this.emit("batch_data", {
				articles_count,
				now_count,
				data: batch_data
			});
			isEnd = columns.isEnd;
		}

		this.emit("done");
	}
}

module.exports = App;
