/**
 * Copyright (c) 2014 Meizu bigertech, All rights reserved.
 * http://www.bigertech.com/
 * @author liuxing
 * @date  14-11-10
 * @description  zhihu api  url template ，知乎api 接口模板
 *
 */
"use strict";

const zhihu = "https://www.zhihu.com";
const zhuanlan = "https://zhuanlan.zhihu.com";
const zhimg = "https://pic1.zhimg.com";

module.exports = {
	zhihu,
	zhuanlan,
	zhimg,
	post: {
		info: `${zhuanlan}/api/posts/<%= postID%>`,
		columns: `${zhuanlan}/api/columns/<%= columnsID%>`,
		page: `${zhuanlan}/api/columns/<%= columnsID %>/articles`
	}
};
