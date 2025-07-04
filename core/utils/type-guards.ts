import type { FileItem } from "../data/file-item";
import type { FolderItem } from "../data/folder-item";


export function isFolderItem(item: unknown): item is FolderItem {
    return (
        typeof item === "object" &&
        item !== null &&
        "name" in item &&
        "parentPath" in item &&
        "hasChildren" in item
    );
}

export function isFileItem(item: unknown): item is FileItem {
    return (
        typeof item === "object" &&
        item !== null &&
        "uniqueId" in item &&
        "name" in item &&
        "path" in item &&
        "url" in item
    );
}
