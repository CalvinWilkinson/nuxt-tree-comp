import { createClient } from "@supabase/supabase-js";

const bucketName = "images";

export default defineEventHandler(async (event): Promise<void> => {
    const _supabaseUrl = process.env.SUPABASE_URL ?? "";
    const _anonKey = process.env.SUPABASE_ANON_KEY ?? "";

    try {
        const query = getQuery(event);
        const filePath = query.filePath as string;

        if (!filePath) {
            throw createError({
                statusCode: 400,
                statusMessage: "File path is required."
            });
        }

        const client = createClient(_supabaseUrl, _anonKey);
        const { error: deleteError } = await client.storage.from(bucketName).remove([filePath]);

        if (deleteError) {
            throw createError({
                statusCode: 500,
                statusMessage: "Failed to delete the file."
            });
        }

        // Set appropriate content type based on file extension
        const contentType = "application/json";

        // Set headers
        setHeader(event, "Content-Type", contentType);
        setHeader(event, "Cache-Control", "no-cache, no-store, must-revalidate");
        setHeader(event, "Pragma", "no-cache");
        setHeader(event, "Expires", "0");
    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: error instanceof Error ? error.message : "An unexpected error occurred."
        });
    }
});
