"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apply = exports.Config = exports.usage = exports.name = void 0;
const path_1 = require("path");
const koishi_1 = require("koishi");
const scandir_1 = __importDefault(require("./scandir"));
const promises_1 = require("fs/promises");
const is_path_inside_1 = __importDefault(require("is-path-inside"));
const rn_1 = __importDefault(require("./rn"));
exports.name = 'editor';
exports.usage = `
只需要启用此插件即可 提供了一个嵌入在控制台 Manaco Editor(Vscode)
`;
exports.Config = koishi_1.Schema.object({
    ignoreScan: koishi_1.Schema.array(koishi_1.Schema.string()).default(["node_modules", ".git", ".vite", ".github"]).description("目录扫描器忽略文件夹名称")
});
const isSafePath = (path) => {
    return (0, is_path_inside_1.default)((0, path_1.resolve)(path), process.cwd());
};
function apply(ctx, config) {
    ctx.using(['console'], (ctx) => {
        ctx.console.addEntry({
            dev: (0, path_1.resolve)(__dirname, '../client/index.ts'),
            prod: (0, path_1.resolve)(__dirname, '../dist'),
        });
    });
    // 被动返回 扫描文件夹
    ctx.console.addListener('editfile-getFileList', async () => {
        return await (0, scandir_1.default)(config.ignoreScan);
    });
    // 被动返回 文件内容
    ctx.console.addListener('editfile-getFile', async (path) => {
        if (!isSafePath(path))
            return {
                message: "非法请求"
            };
        return (await (0, promises_1.readFile)(path)).toString();
    });
    ctx.console.addListener('editfile-saveFile', async (arg) => {
        if (!isSafePath(arg.path))
            return {
                message: "非法请求"
            };
        await (0, promises_1.writeFile)(arg.path, arg.content);
        return undefined;
    });
    ctx.console.addListener('editfile-addFolder', async (arg) => {
        if (!isSafePath(arg.path + "/" + arg.name))
            return {
                message: "非法请求"
            };
        await (0, promises_1.mkdir)(arg.path + "/" + arg.name);
        return undefined;
    });
    ctx.console.addListener('editfile-rename', async (arg) => {
        var renamedPath = arg.path.split("/");
        renamedPath.length -= 1;
        renamedPath.push(arg.to);
        if (!isSafePath(arg.path) || !isSafePath(renamedPath.join("/")))
            return {
                message: "非法请求"
            };
        await (0, rn_1.default)(arg.path, renamedPath.join("/"));
        await (0, promises_1.rmdir)(arg.path);
        return undefined;
    });
}
exports.apply = apply;
