# 知乎专栏

> by: bubao
>
> Created: 2017 年 04 月 28 日 20:00:44
>
> Modified : 2018-9-13 16:59:46

知乎是一个好地方，最近有空，想把知乎上的文章爬下来，放在本地有空慢慢看。项目模仿 [zhangolve 的项目](https://github.com/zhangolve/zhihu-answer-convert-to-md-by-node)。

## 怎么用

**获取**

```shell
git clone https://github.com/bubao/GetZhiHuZhuanLan.git
```

**安装依赖模块**

```shell
npm install
```

**配置**

修改 config.js 文件，`ID` 值为专栏路径名，例如`https://zhuanlan.zhihu.com/study-fe`的 `ID` 值是 `study-fe`，那么就可以改成下面这样：

```js
ID: 'study-fe'
```

**运行**

```shell
npm start
```

也可以作为模块使用

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
post= (columnsID: string) => Promise<any>
```

- `columnsID`:知乎专栏的专栏ID

### zhuanlan

```js
zhuanlan = (postID: string) => Promise<void>
```

- `postID`:知乎专栏的专栏ID

## 待改进

- ~~`code` 标签转 MD 有点缺陷~~
- windows文件命名

## 使用的模块

`lodash`：最好用的工具

`request`：用于请求网络

`turndown`：用于将HTML转成Markdown

`zhihu`：没有直接使用，部分代码是这个模块的，由于这个项目只使用了知乎专栏的API，所以只引用了部分的代码。

## History

### 2018-09-13 16:59:46

这次封装为模块，可二次开发。

### 2018-5-15 18:21:05

如今因为知乎api和知乎专栏的网页布局有所改变，现在重写了这个爬虫，api模块使用的是[zhihu](https://www.npmjs.com/package/zhihu)的重构代码，模块中的request模块再次二次封装。
