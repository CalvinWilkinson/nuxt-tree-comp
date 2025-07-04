import { FileObject } from "@supabase/storage-js";
import { createClient } from "@supabase/supabase-js";
import process from "process";
import { FileItem } from "~/core/data/file-item";

const bucketName = "images";

export default defineEventHandler(async (event): Promise<FileItem[]> => {
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
            throw createError({
                statusCode: 500,
                statusMessage: "No buckets exist."
            });
        }

        const files = list.filter((i) => i.metadata !== null && i.name !== ".emptyFolderPlaceholder");

        const result: FileItem[] = [];

        for (const file of files) {
            const filePath = folderPath === undefined ? file.name : `${folderPath}/${file.name}`;

            const { data: urlData } = client.storage.from(bucketName).getPublicUrl(filePath);

            result.push({
                uniqueId: crypto.randomUUID(),
                name: file.name,
                path: filePath,
                url: urlData.publicUrl
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
