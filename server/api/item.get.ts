import type { FileObject } from "@supabase/storage-js";
import { createClient } from "@supabase/supabase-js";
import process from "process";
import { FolderItem } from "~/core/data/folder-item";
import { FileItem } from "~/core/data/file-item";

const bucketName = "images";

export default defineEventHandler(async (event): Promise<FolderItem | FileItem | null> => {
    const _supabaseUrl = process.env.SUPABASE_URL ?? "";
    const _anonKey = process.env.SUPABASE_ANON_KEY ?? "";

    try {
        const query = getQuery(event);
        const itemPath = query.itemPath as string;

        if (!itemPath) {
            throw createError({
                statusCode: 400,
                statusMessage: "Item path is required."
            });
        }

        const client = createClient(_supabaseUrl, _anonKey);
        
        // First, try to get the item directly
        const { data: itemData, error: itemError } = await client.storage.from(bucketName).list(itemPath);

        if (itemError) {
            // If direct access fails, try to get parent folder and look for the item
            const pathParts = itemPath.split("/");
            const itemName = pathParts[pathParts.length - 1];
            const parentPath = pathParts.slice(0, -1).join("/");

            const { data: parentData, error: parentError } = await client.storage.from(bucketName).list(parentPath);

            if (parentError || !parentData) {
                return null;
            }

            const foundItem = parentData.find((item: FileObject) => item.name === itemName);
            if (!foundItem) {
                return null;
            }

            // Check if it's a file or folder
            if (foundItem.metadata !== null) {
                // It's a file
                const { data: urlData } = client.storage.from(bucketName).getPublicUrl(itemPath);
                
                return {
                    uniqueId: foundItem.id || itemPath,
                    name: foundItem.name,
                    path: itemPath,
                    url: urlData.publicUrl,
                } as FileItem;
            } else {
                // It's a folder - check if it has children
                const { data: folderContents, error: folderError } = await client.storage.from(bucketName).list(itemPath);
                const hasChildren = !folderError && folderContents && folderContents.length > 0;

                return {
                    name: foundItem.name,
                    path: itemPath,
                    hasChildren: hasChildren,
                } as FolderItem;
            }
        }

        // If we got here, the item exists but we need to determine if it's a file or folder
        // This case handles when itemPath is a folder that exists
        const hasChildren = itemData && itemData.length > 0;

        return {
            name: itemPath.split("/").pop() || itemPath,
            path: itemPath,
            hasChildren: hasChildren,
        } as FolderItem;

    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: "Something went wrong while fetching the item."
        });
    }
});
