/**
 * @description:
 * @author: bubao
 * @Date: 2020-07-08 01:19:44
 * @LastEditors: bubao
 * @LastEditTime: 2020-09-15 16:55:50
 */
function formatDate(date, fmt) {
	date = new Date(date);
	if (/(y+)/.test(fmt)) {
		fmt = fmt.replace(
			RegExp.$1,
			(date.getFullYear() + "").substr(4 - RegExp.$1.length)
		);
	}
	const o = {
		"M+": date.getMonth() + 1,
		"d+": date.getDate(),
		"h+": date.getHours(),
		"m+": date.getMinutes(),
		"s+": date.getSeconds()
	};

	// 遍历这个对象
	for (const k in o) {
		if (new RegExp(`(${k})`).test(fmt)) {
			const str = o[k] + "";
			fmt = fmt.replace(
				RegExp.$1,
				RegExp.$1.length === 1 ? str : padLeftZero(str)
			);
		}
	}
	return fmt;
}

function padLeftZero(str) {
	return ("00" + str).substr(str.length);
}

module.exports = formatDate;
