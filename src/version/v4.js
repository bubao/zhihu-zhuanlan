/**
 * @Description:
 * @Author: bubao
 * @Date: 2022-08-25 10:30:38
 * @LastEditors: bubao
 * @LastEditTime: 2022-08-25 14:18:26
 */

const { Post } = require("zhihu-api");
const Items = Post.Items;
const decode = require("../tools/decode.js");
const EventEmitter = require("events").EventEmitter;

class Zhuanlan extends EventEmitter {
	constructor(props) {
		super();
		this.columnsID = props ? props.columnsID : this.columnsID;
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
	 * @memberof Zhuanlan
	 */
	onInfo(cb = () => { }) {
		this.once("info", cb);
	}

	/**
	 * @description 监听完成
	 * @author bubao
	 * @date 2021-01-13
	 * @param {function} [cb=() => {}]
	 * @memberof Zhuanlan
	 */
	onDone(cb = () => { }) {
		this.once("done", () => {
			this.removeListener("info", () => { });
			this.removeListener("batch_data", () => { });
			cb();
		});
	}

	/**
	 * @description 监听数据
	 * @author bubao
	 * @date 2021-01-13
	 * @param {function} [cb=() => {}]
	 * @memberof Zhuanlan
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

		const columns = Items.init(columnsID);
		const Info = await columns.info();
		if (Info.error) {
			this.emit("error", Info.error);
			return;
		}
		this.emit("info", Info);
		const items_count = Info.items_count;
		if (!Info.items_count) {
			this.emit("error", "Info items is 0");
			return;
		}
		let isEnd = false;
		let now_count = 0;
		while (!isEnd) {
			const res = await columns.next();
			const batch_data = res.data.map(decode);
			now_count = now_count + batch_data.length;
			this.emit("batch_data", {
				items_count,
				now_count,
				data: batch_data
			});
			isEnd = columns.isEnd;
		}

		this.emit("done");
	}
}

module.exports = Zhuanlan;
