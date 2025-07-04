import { FileObject } from "@supabase/storage-js";
import { createClient } from "@supabase/supabase-js";
import process from "process";

const bucketName = "images";

export default defineEventHandler(async (event): Promise<FileObject[]> => {
    const _supabaseUrl = process.env.SUPABASE_URL ?? "";
    const _anonKey = process.env.SUPABASE_ANON_KEY ?? "";

    try {
        const query = getQuery(event);
        const folderPath = query.folderPath as string;
        console.log(`Folder Path: ${folderPath}`);

        const client = createClient(_supabaseUrl, _anonKey);
        const { data: list, error: listError } = await client.storage.from(bucketName).list(folderPath);

        console.log("LIST OF FILES:");
        console.log(list);
        list?.forEach((item) => {
            console.log(item.name);
        });

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

        const files = list.filter((i) => i.metadata !== null);

        // Set appropriate content type based on file extension
        const contentType = "application/json";

        // Set headers
        setHeader(event, "Content-Type", contentType);
        setHeader(event, "Cache-Control", "no-cache, no-store, must-revalidate");
        setHeader(event, "Pragma", "no-cache");
        setHeader(event, "Expires", "0");

        return files;
    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: "Something went wrong while fetching the image."
        });
    }
});
