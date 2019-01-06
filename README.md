# 知乎专栏

> by: bubao
>
> Created: 2017 年 04 月 28 日 20:00:44
>
> Modified : 2019-1-6 22:42:48

知乎是一个好地方，最近有空，想把知乎上的文章爬下来，放在本地有空慢慢看。项目模仿 [zhangolve 的项目](https://github.com/zhangolve/zhihu-answer-convert-to-md-by-node)。

## 怎么用

### 获取

```shell
cnpm i https://github.com/bubao/GetZhiHuZhuanLan.git --save
```

### 使用

`https://zhuanlan.zhihu.com/study-fe`的 `postID` 值是 `study-fe`：

```js
import {zhuanlan, post } from './index';

post('study-fe').then( res =>{
    console.log(res);
});

zhuanlan('study-fe').then( res =>{
    console.log(res);
});

```

## API

### post

如果只想得到返回的内容，而不是经过MarkDown模块处理的数据。

```js
post = (postID: string) => Promise<any>
```

- `postID`:知乎专栏的专栏ID，例如`https://zhuanlan.zhihu.com/study-fe`的 `postID` 值是 `study-fe`

### zhuanlan

```js
zhuanlan = (postID: string) => Promise<void>
```

- `postID`:知乎专栏的专栏ID，例如`https://zhuanlan.zhihu.com/study-fe`的 `postID` 值是 `study-fe`

## 待改进

- ~~`code` 标签转 MD 有点缺陷~~
- ~~windows文件命名~~

## 使用的模块

`lodash`：最好用的工具

`self-promise-request`：用于请求网络

`turndown`：用于将HTML转成Markdown

`filenamify`: 解决 windows 文件命名错误问题

`cheerio`: 解析DOM

## History

### 2019-1-6 22:39:57

知乎API更新，重写部分代码。

### 2018-11-22 22:21:40

重构代码，只保留模块，代码的测试在`test`文件夹下。

### 2018-09-13 16:59:46

这次封装为模块，可二次开发。

### 2018-5-15 18:21:05

如今因为知乎api和知乎专栏的网页布局有所改变，现在重写了这个爬虫，api模块使用的是[zhihu](https://www.npmjs.com/package/zhihu)的重构代码，模块中的request模块再次二次封装。
