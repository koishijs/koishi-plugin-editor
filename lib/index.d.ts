import { Context } from 'koishi';
import { scanResultItem } from './scandir';
export declare const name = "spring-festival-ui";
export declare const usage = "\n\u53EA\u9700\u8981\u542F\u7528\u6B64\u63D2\u4EF6\u5373\u53EF\n\n\u8B66\u544A: \u5728\u505C\u7528\u63D2\u4EF6\u540E\u5C06\u4F1A\u5237\u65B0\u63A7\u5236\u53F0(\u5E76\u4E0D\u4F1A\u91CD\u542F Koishi), \u8BF7\u53CA\u65F6\u4FDD\u5B58\n";
declare module '@koishijs/plugin-console' {
    interface Events {
        'editfile-getFileList'(): Promise<Array<scanResultItem>>;
    }
}
export declare function apply(ctx: Context): void;
