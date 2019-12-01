# 知乎专栏爬虫(zhihu-zhuanlan)

> by: bubao
>
> Created: 2017 年 04 月 28 日 20:00:44
>
> Modified : 2019-12-1 14:20:40

知乎是一个好地方，最近有空，想把知乎上的文章爬下来，放在本地有空慢慢看。项目模仿 [zhangolve 的项目](https://github.com/zhangolve/zhihu-answer-convert-to-md-by-node)。

## 怎么用

### 获取

```shell
cnpm i https://github.com/bubao/GetZhiHuZhuanLan.git --save
```

### 使用

`https://zhuanlan.zhihu.com/study-fe`的 `postID` 值是 `study-fe`：

```js
import zhuanlan from 'zhihu-zhuanlan';

zhuanlan('study-fe').then(res => {
    res.forEach(element => {
        const { title, // 标题
				filename, // 文件名，由title转为符合系统命名的文件名
				header, // 文章头信息
				content, // 文章内容
				copyRight, // 版权声明
				time, // 文章创建时间
                json // 文章的源信息
            } = element;
    })
});
```

## 使用的模块

`lodash`：最好用的工具

`turndown`：用于将HTML转成Markdown

`filenamify`: 解决 windows 文件命名错误问题

[`zhihu-api`](https://github.com/bubao/zhihu-api): 自己封装和维护的知乎api模块

## History

### 2019-4-9 2:29:32

将模块迁移到知乎api，只剩下知乎专栏爬虫，添加完整的demo

### 2019-1-6 22:39:57

知乎API更新，重写部分代码。

### 2018-11-22 22:21:40

重构代码，只保留模块，代码的测试在`test`文件夹下。

### 2018-09-13 16:59:46

这次封装为模块，可二次开发。

### 2018-5-15 18:21:05

如今因为知乎api和知乎专栏的网页布局有所改变，现在重写了这个爬虫，api模块使用的是[zhihu](https://www.npmjs.com/package/zhihu)的重构代码，模块中的request模块再次二次封装。
