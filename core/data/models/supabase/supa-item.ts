import type { SupaItemMetadata } from "./supa-item-metadata";

/**
 * Complete file object returned by Supabase Storage list() and download() operations
 */
export interface SupaItem {
    /**
     * Unique identifier for the file in Supabase Storage
    */
   id: string;

   /**
    * Original filename as stored in the bucket
    */
   name: string;

    /**
     * ISO timestamp when the file record was last updated
     */
    updated_at: string;

    /**
     * ISO timestamp when the file was initially uploaded
     */
    created_at: string;

    /**
     * ISO timestamp when the file was last accessed/downloaded
     */
    last_accessed_at: string;

    /**
     * Additional file metadata from Supabase Storage
     */
    metadata?: SupaItemMetadata;
}
