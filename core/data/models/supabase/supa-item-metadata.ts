/**
 * Metadata object returned by Supabase Storage for file operations
 */
export interface SupaItemMetadata {
    /**
     * Entity tag for cache validation and conflict detection
     */
    eTag: string;

    /**
     * File size in bytes
     */
    size: number;

    /**
     * MIME type of the file (e.g., "image/png", "image/jpeg")
     */
    mimetype: string;

    /**
     * Cache control header value (e.g., "max-age=3600")
     */
    cacheControl: string;

    /**
     * ISO timestamp when the file was last modified
     */
    lastModified: string;

    /**
     * Content length in bytes (typically same as size)
     */
    contentLength: number;

    /**
     * HTTP status code from the storage operation
     */
    httpStatusCode: number;
}
