import { mkdir, readdir, rename, stat } from 'fs/promises';
const rn = async (path: string,to: string) => {
    
    if((await stat(path)).isFile()) {
        await rename(path,to)
        return;
    }
    
    const children = await readdir(path)
    if(children.length == 0) {
        await rename(path,to)
    } else {
        await mkdir(to)

        for (const item of children) {
            await rn(path+"/"+item,to+"/"+item)
        }
        // await rename(path,to)
    }
}
export default rn;