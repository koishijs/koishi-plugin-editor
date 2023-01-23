import { Context, Schema } from 'koishi';
import { scanResultItem } from './scandir';
export declare const name = "editor";
export declare const usage = "\n\u53EA\u9700\u8981\u542F\u7528\u6B64\u63D2\u4EF6\u5373\u53EF \u63D0\u4F9B\u4E86\u4E00\u4E2A\u5D4C\u5165\u5728\u63A7\u5236\u53F0 Manaco Editor(Vscode)\n";
interface saveFileEventsArg {
    path: string;
    content: string;
}
interface addFolderEventsArg {
    path: string;
    name: string;
}
interface renameEventsArg {
    path: string;
    from: string;
    to: string;
}
interface unsafeRequest {
    message: string;
}
declare module '@koishijs/plugin-console' {
    interface Events {
        'editfile-getFileList'(): Promise<Array<scanResultItem>>;
        'editfile-getFile'(path: string): Promise<string | unsafeRequest>;
        'editfile-saveFile'(arg: saveFileEventsArg): Promise<undefined | unsafeRequest>;
        'editfile-addFolder'(arg: addFolderEventsArg): Promise<undefined | unsafeRequest>;
        'editfile-rename'(arg: renameEventsArg): Promise<undefined | unsafeRequest>;
    }
}
export interface Config {
    ignoreScan: Array<string>;
}
export declare const Config: Schema<Config>;
export declare function apply(ctx: Context, config: Config): void;
export {};
