# 知乎专栏爬虫 (zhihu-zhuanlan)

> by: bubao
>
> Created: 2017 年 04 月 28 日 20:00:44
>
> Modified : 2019-12-2 2:16:40

知乎是一个好地方，最近有空，想把知乎上的文章爬下来，放在本地有空慢慢看。项目模仿 [zhangolve 的项目](https://github.com/zhangolve/zhihu-answer-convert-to-md-by-node)。

## 怎么用

### 获取

```shell
cnpm i https://github.com/bubao/GetZhiHuZhuanLan.git --save
```

### 使用

`https://zhuanlan.zhihu.com/study-fe`的 `postID` 值是 `study-fe`：

```js
const Zhuanlan = require("..");
const fs = require("fs");
const util = require("util");
const FsStat = util.promisify(fs.stat);
const MAX_SAFE_INTEGER = 9007199254740991;

function isLength(value) {
    return (
        typeof value === "number" &&
        value > -1 &&
        value % 1 === 0 &&
        value <= MAX_SAFE_INTEGER
    );
}

function isArrayLike(value) {
    return (
        value != null && typeof value !== "function" && isLength(value.length)
    );
}

const mkdir = async (...filePath) => {
    if (isArrayLike(filePath)) {
        filePath = require("path").resolve(...filePath);
    }
    await FsStat(`${filePath}`).then(() => {
        console.log(
            `⚓  ${require("path").basename(filePath)} 文件夹已经存在`
        );
    }).catch(() => {
        fs.mkdir(`${filePath}`, () => {
            console.log(
                `🤖 创建 ${require("path").basename(
                    filePath
                )}文件夹成功`
            );
        });
    });
};

const writeFile = (path, data, format) => {
    fs.writeFile(`${path}.${format}`, data, "utf8", err => {
        if (err) throw err;
    });
};
const run = (path, columnsID) => {
    const zhihu = Zhuanlan.init({ columnsID });
    let dir;
    zhihu.once("info", (data) => {
        dir = data.title;
        mkdir(`${path}/${data.title}`);
    });
    let write_count = 0;
    zhihu.on("batch_data", (element) => {
        // console.log((element.now_count / element.articles_count * 100).toFixed(2) + "%");
        element.data.map(({ filenameTime, header, content, copyRight, json }) => {
            writeFile(
                `${path}/${dir}/${filenameTime}`,
                header + content + copyRight,
                "md"
            );
            writeFile(
                `${path}/${dir}/${filenameTime}`,
                JSON.stringify(json),
                "json"
            );
            write_count++;
            console.log((write_count / element.articles_count * 100).toFixed(2) + "%");
        });
    });
    zhihu.getAll();
};

run("./", "YJango");
```

## 使用的模块

`lodash`：最好用的工具

`turndown`：用于将 HTML 转成 Markdown

`filenamify`: 解决 windows 文件命名错误问题

[`zhihu-api`](https://github.com/bubao/zhihu-api): 自己封装和维护的知乎 api 模块

## History

## 2020-09-16 17:12:30

- 使用 [zhihu-api v0.1.1](https://github.com/bubao/zhihu-api/tree/v0.1.1)
- 事件监听改为`batch_data`
- 原先的`filename`改为`filenameTime`，`filenameTime`为时间+文件名，原先的`filename`只是文件名

### 2019-12-2 2:13:09

使用 [zhihu-api v0.1.0](https://github.com/bubao/zhihu-api/tree/v0.1.0)，事件监听的方式获取专栏数据

### 2019-4-9 2:29:32

将模块迁移到知乎 api，只剩下知乎专栏爬虫，添加完整的 demo

### 2019-1-6 22:39:57

知乎 API 更新，重写部分代码。

### 2018-11-22 22:21:40

重构代码，只保留模块，代码的测试在`test`文件夹下。

### 2018-09-13 16:59:46

这次封装为模块，可二次开发。

### 2018-5-15 18:21:05

如今因为知乎 api 和知乎专栏的网页布局有所改变，现在重写了这个爬虫，api 模块使用的是 [zhihu](https://www.npmjs.com/package/zhihu) 的重构代码，模块中的 request 模块再次二次封装。
