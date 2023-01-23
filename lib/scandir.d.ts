export interface scanResultItem {
    label: string;
    path: string;
    type: "file" | "folder" | "empty";
    children?: Array<scanResultItem>;
}
declare const _default: (ignore: Array<string>) => Promise<scanResultItem[]>;
export default _default;
