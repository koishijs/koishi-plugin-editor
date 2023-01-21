"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apply = exports.usage = exports.name = void 0;
const path_1 = require("path");
const scandir_1 = __importDefault(require("./scandir"));
exports.name = 'spring-festival-ui';
exports.usage = `
只需要启用此插件即可

警告: 在停用插件后将会刷新控制台(并不会重启 Koishi), 请及时保存
`;
function apply(ctx) {
    ctx.using(['console'], (ctx) => {
        ctx.console.addEntry({
            dev: (0, path_1.resolve)(__dirname, '../client/index.ts'),
            prod: (0, path_1.resolve)(__dirname, '../dist'),
        });
    });
    // 被动返回 扫描文件夹
    ctx.console.addListener('editfile-getFileList', async () => {
        return await (0, scandir_1.default)();
    });
}
exports.apply = apply;
