# 知乎专栏

> by: bubao
>
> Created: 2017 年 04 月 28 日 20:00:44
>
> Modified : 2018-5-15 18:21:05

知乎是一个好地方，最近有空，想把知乎上的文章爬下来有空慢慢看。项目模仿 [zhangolve 的项目](https://github.com/zhangolve/zhihu-answer-convert-to-md-by-node)。

如今因为知乎api和知乎专栏的网页布局有所改变，现在重写了这个爬虫，api模块使用的是[zhihu](https://www.npmjs.com/package/zhihu)的重构代码，模块中的request模块再次二次封装。

## 怎么用

**获取**

```shell
git clone https://github.com/bubao/GetZhiHuZhuanLan.git
```

**安装**

```shell
npm install
```

**配置**

修改 config.js 文件，`zhihuId` 值为专栏路径名，如

```js
ID: 'study-fe'
```

**使用**

```shell
npm start
```

也可以作为模块使用

```js
const zhuanlan = require('./src');
zhuanlan('study-fe','./');
```

## 待改进

`code` 标签转 MD 有点缺陷
