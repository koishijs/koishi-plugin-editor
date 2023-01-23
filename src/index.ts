import { resolve } from 'path'
import { Context, Schema } from 'koishi'
import {} from '@koishijs/plugin-console'
import scandir from './scandir'
import { scanResultItem } from './scandir'
import { mkdir, readFile, rename, rm, rmdir, writeFile } from 'fs/promises'

import isPathInside from "is-path-inside"
import rn from './rn'

export const name = 'spring-festival-ui'
export const usage = `
只需要启用此插件即可

警告: 在停用插件后将会刷新控制台(并不会重启 Koishi), 请及时保存
`

interface saveFileEventsArg {
  path: string,
  content: string
}
interface addFolderEventsArg {
  path: string,
  name: string 
}
interface renameEventsArg {
  path: string,
  from: string 
  to: string 
}
interface unsafeRequest {
  message: string 
}

declare module '@koishijs/plugin-console' {
  interface Events {
    // 扫描文件夹
    // CNM 的 VScode TS类型检查, 凭什么不给我用 scandir.scanResultItem
    'editfile-getFileList'(): Promise<Array<scanResultItem>>
    'editfile-getFile'(path: string): Promise<string | unsafeRequest>
    'editfile-saveFile'(arg: saveFileEventsArg): Promise<undefined | unsafeRequest>
    'editfile-addFolder'(arg: addFolderEventsArg): Promise<undefined | unsafeRequest>
    'editfile-rename'(arg: renameEventsArg): Promise<undefined | unsafeRequest>
  } 
}

export interface Config {
  ignoreScan: Array<string>
}

export const Config: Schema<Config> = Schema.object({
  ignoreScan: Schema.array(Schema.string()).default(["node_modules",".git",".vite",".github"]).description("目录扫描器忽略文件夹名称")
}) 

const isSafePath = (path) => {
  return isPathInside(resolve(path),process.cwd())
}

export function apply(ctx: Context,config: Config) {
  ctx.using(['console'], (ctx) => {
    ctx.console.addEntry({
      dev: resolve(__dirname, '../client/index.ts'),
      prod: resolve(__dirname, '../dist'),
    })
  })
  // 被动返回 扫描文件夹
  ctx.console.addListener('editfile-getFileList',async () => {
    return await scandir(config.ignoreScan); 
  })
  // 被动返回 文件内容
  ctx.console.addListener('editfile-getFile',async (path: string) => {
    if(!isSafePath(path)) return {
      message: "非法请求"
    }

    return (await readFile(path)).toString(); 
  })
  ctx.console.addListener('editfile-saveFile',async (arg) => {
    if(!isSafePath(arg.path)) return {
      message: "非法请求"
    }
    await writeFile(arg.path,arg.content)
    return undefined;
  })
  ctx.console.addListener('editfile-addFolder',async (arg) => {
    if(!isSafePath(arg.path+"/"+arg.name)) return {
      message: "非法请求"
    }
    await mkdir(arg.path+"/"+arg.name);
    return undefined;
  })
  ctx.console.addListener('editfile-rename',async (arg) => {
    var renamedPath = arg.path.split("/");
    renamedPath.length -= 1;
    renamedPath.push(arg.to);
    if(!isSafePath(arg.path) || !isSafePath(renamedPath.join("/"))) return {
      message: "非法请求"
    }
    await rn(arg.path,renamedPath.join("/"));
    await rmdir(arg.path)
    return undefined;
  })
} 