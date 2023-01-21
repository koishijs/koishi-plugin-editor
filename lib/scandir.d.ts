export interface scanResultItem {
    name: string;
    path: string;
    type: "file" | "folder";
    childrens?: Array<scanResultItem>;
}
declare const _default: () => Promise<scanResultItem[]>;
export default _default;
