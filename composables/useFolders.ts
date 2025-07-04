import type { FolderItem } from "~/core/data/folder-item";

export const useFolders = async (): Promise<FolderItem[]> => {
    const { data, error } = await useLazyFetch<FolderItem[]>("/api/folders", {
        key: 'folders-global-cache',
        server: true,
        default: () => []
    });

    return data.value;
};
