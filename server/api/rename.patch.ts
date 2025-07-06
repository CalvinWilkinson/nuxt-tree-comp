import { createClient } from "@supabase/supabase-js";
import type { FileObject } from "@supabase/storage-js";

const bucketName = "images";

export default defineEventHandler(async (event): Promise<void> => {
    const _supabaseUrl = process.env.SUPABASE_URL ?? "";
    const _anonKey = process.env.SUPABASE_ANON_KEY ?? "";

    try {
        const query = getQuery(event);
        const oldPath = query.oldPath as string;
        const newName = query.newName as string;

        if (!oldPath) {
            throw createError({
                statusCode: 400,
                statusMessage: "Old path is required."
            });
        }

        if (!newName) {
            throw createError({
                statusCode: 400,
                statusMessage: "New name is required."
            });
        }

        const client = createClient(_supabaseUrl, _anonKey);

        // Calculate the new path
        const pathParts = oldPath.split("/");
        pathParts[pathParts.length - 1] = newName;
        const newPath = pathParts.join("/");

        // First, check if the item exists and determine if it's a file or folder
        const parentPath = pathParts.slice(0, -1).join("/");
        const { data: parentItems, error: listError } = await client.storage.from(bucketName).list(parentPath);

        if (listError) {
            throw createError({
                statusCode: 500,
                statusMessage: "Failed to check if item exists."
            });
        }

        const itemName = oldPath.split("/").pop();
        const existingItem = parentItems?.find((item: FileObject) => item.name === itemName);

        if (!existingItem) {
            throw createError({
                statusCode: 404,
                statusMessage: "Item not found."
            });
        }

        // Check if an item with the new name already exists
        const conflictingItem = parentItems?.find((item: FileObject) => item.name === newName);
        if (conflictingItem) {
            throw createError({
                statusCode: 409,
                statusMessage: "An item with this name already exists."
            });
        }

        // If it's a file (has metadata), use the simple move operation
        if (existingItem.metadata !== null) {
            const { error: moveError } = await client.storage.from(bucketName).move(oldPath, newPath);

            if (moveError) {
                throw createError({
                    statusCode: 500,
                    statusMessage: "Failed to rename the file."
                });
            }
        } else {
            // If it's a folder (no metadata), we need to rename all files within it
            // Get all files in the folder recursively
            const getAllFilesInFolder = async (folderPath: string): Promise<string[]> => {
                const allFiles: string[] = [];
                
                const processFolder = async (currentPath: string) => {
                    const { data: items, error } = await client.storage.from(bucketName).list(currentPath);
                    
                    if (error || !items) return;
                    
                    for (const item of items) {
                        const itemPath = currentPath ? `${currentPath}/${item.name}` : item.name;
                        
                        if (item.metadata !== null) {
                            // It's a file
                            allFiles.push(itemPath);
                        } else {
                            // It's a folder, recurse into it
                            await processFolder(itemPath);
                        }
                    }
                };
                
                await processFolder(folderPath);
                return allFiles;
            };

            const filesToMove = await getAllFilesInFolder(oldPath);

            // Move all files to the new folder path
            for (const filePath of filesToMove) {
                const relativePath = filePath.substring(oldPath.length);
                const newFilePath = `${newPath}${relativePath}`;
                
                const { error: moveError } = await client.storage.from(bucketName).move(filePath, newFilePath);
                
                if (moveError) {
                    throw createError({
                        statusCode: 500,
                        statusMessage: `Failed to move file: ${filePath}`
                    });
                }
            }
        }

        // Set appropriate content type and headers
        setHeader(event, "Content-Type", "application/json");
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
