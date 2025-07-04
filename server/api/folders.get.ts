import type { FileObject, FileObjectV2 } from "@supabase/storage-js";
import { createClient } from "@supabase/supabase-js";
import process from "process";
import { FolderItem } from "~/core/data/folder-item";

const bucketName = "images";

// Recursive function to check if a folder has any content (files or folders with content) at any depth
async function hasAnyContent(client: any, folderPath: string): Promise<boolean> {
    const { data: items, error } = await client.storage.from(bucketName).list(folderPath);

    if (error || !items || items.length === 0) {
        return false;
    }

    // Check if there are any files (items with metadata)
    const files = items.filter((item: FileObject) => item.metadata !== null && item.name !== ".emptyFolderPlaceholder");
    if (files.length > 0) {
        return true;
    }

    // Check subfolders recursively
    const folders = items.filter((item: FileObject) => item.metadata === null);
    for (const folder of folders) {
        const subFolderPath = `${folderPath}/${folder.name}`;
        const hasContent = await hasAnyContent(client, subFolderPath);
        if (hasContent) {
            return true;
        }
    }

    return false;
}

export default defineEventHandler(async (event): Promise<FolderItem[]> => {
    const _supabaseUrl = process.env.SUPABASE_URL ?? "";
    const _anonKey = process.env.SUPABASE_ANON_KEY ?? "";

    try {
        const query = getQuery(event);
        const folderPath = query.folderPath as string;

        const client = createClient(_supabaseUrl, _anonKey);
        const { data: list, error: listError } = await client.storage.from(bucketName).list(folderPath);

        if (listError) {
            throw createError({
                statusCode: 500,
                statusMessage: "Failed to get the list buckets."
            });
        }

        if (list.length === 0) {
            return [];
        }

        const folders = list.filter((i) => i.metadata === null);

        const result: FolderItem[] = [];

        for (const folder of folders) {
            const currentPath = folderPath === undefined ? folder.name : `${folderPath}/${folder.name}`;

            // Use the recursive function to check for any content at any depth
            const hasContent = await hasAnyContent(client, currentPath);

            result.push({
                name: folder.name,
                parentPath: folderPath,
                hasChildren: hasContent,
            });
        }

        // Set appropriate content type based on file extension
        const contentType = "application/json";

        // Set headers
        setHeader(event, "Content-Type", contentType);
        setHeader(event, "Cache-Control", "no-cache, no-store, must-revalidate");
        setHeader(event, "Pragma", "no-cache");
        setHeader(event, "Expires", "0");

        return result;
    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: "Something went wrong while fetching the image."
        });
    }
});
