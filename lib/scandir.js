"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = require("fs/promises");
// *异步 使用递归扫描目录 path代表当前扫描到的路径
const scaner = async (path, ignore) => {
    var now = await (0, promises_1.readdir)(path);
    const result = [];
    // 要把文件放在下面, 前端懒得写了
    const files = [];
    if (now.length == 0) {
        result.push({
            label: "",
            path,
            type: "empty"
        });
        return result;
    }
    for (const item of now) {
        if (ignore.indexOf(item) != -1)
            continue;
        // 当前正在扫描的文件/文件夹的路径
        const now_path = `${path}/${item}`;
        const i_stat = await (0, promises_1.stat)(now_path);
        // 是个文件直接压到 result 里面
        if (i_stat.isFile()) {
            files.push({
                label: item,
                path: now_path,
                type: "file"
            });
            // 不是文件扫描完再压进去
        }
        else {
            result.push({
                label: item,
                path: now_path,
                type: "folder",
                children: await scaner(now_path, ignore)
            });
        }
    }
    files.map((item) => {
        result.push(item);
    });
    return result;
};
// 这是一个文件夹扫描的默认导出 目前项目只需要从根目录开始扫描即可
exports.default = async (ignore) => {
    return await scaner(".", ignore);
};
