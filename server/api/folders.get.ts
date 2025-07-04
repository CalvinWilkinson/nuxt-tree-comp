import type { FileObject, FileObjectV2 } from "@supabase/storage-js";
import { createClient } from "@supabase/supabase-js";
import process from "process";
import { FolderItem } from "~/core/data/folder-item";
import { sleep } from "~/core/utils/sleep";

const bucketName = "images";

export default defineEventHandler(async (event): Promise<FolderItem[]> => {
    const _supabaseUrl = process.env.SUPABASE_URL ?? "";
    const _anonKey = process.env.SUPABASE_ANON_KEY ?? "";

    try {
        const query = getQuery(event);
        const folderPath = query.path as string;

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

            const { data: childrenItems, error: childrenItemsError } = await client.storage.from(bucketName).list(currentPath);

            if (childrenItemsError) {
                throw createError({
                    statusCode: 500,
                    statusMessage: "Failed to get the list of children items."
                });
            }

            result.push({
                name: folder.name,
                parentPath: folderPath,
                hasChildren: childrenItems && childrenItems.length > 0,
            });
        }

        // Set appropriate content type based on file extension
        const contentType = "application/json";

        // Set headers
        setHeader(event, "Content-Type", contentType);
        setHeader(event, "Cache-Control", "public, max-age=3600"); // Optional caching

        return result;
    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: "Something went wrong while fetching the image."
        });
    }
});
