import type { FileObject, FileObjectV2 } from "@supabase/storage-js";
import { createClient } from "@supabase/supabase-js";


const supabaseUrl = (Deno.env.get("SUPABASE_URL") ?? "").trim();
const anonKey = (Deno.env.get("SUPABASE_ANON_KEY") ?? "").trim();
const serviceRoleKey = (Deno.env.get("SUPABASE_SERVICE_ROLE_ANON_KEY") ?? "").trim();

const bucketName = "images";
const folderPath = "";

const client = createClient(supabaseUrl, serviceRoleKey);

const { data: items, error } = await client.storage.from(bucketName).list(folderPath);

if (error) {
    console.error("Error fetching items:", error);
    Deno.exit(1);
}

items.forEach(item => {
    console.log(item.name);
});

debugger;
