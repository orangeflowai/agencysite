
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load env from .env file
dotenv.config({ path: '.env' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error("Missing Supabase credentials in .env");
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const BUCKET_NAME = 'images';

async function main() {
    console.log(`Listing files in bucket: ${BUCKET_NAME}...`);

    const { data, error } = await supabase
        .storage
        .from(BUCKET_NAME)
        .list();

    if (error) {
        console.error("Error listing files:", error);
        return;
    }

    const fs = await import('fs');
    const path = await import('path');

    if (!data || data.length === 0) {
        console.log("Bucket is empty.");
        return;
    }

    const assets = data.map(file => {
        const publicUrl = supabase.storage.from(BUCKET_NAME).getPublicUrl(file.name).data.publicUrl;
        return { name: file.name, url: publicUrl };
    });

    fs.writeFileSync(path.join(process.cwd(), 'assets.json'), JSON.stringify(assets, null, 2));
    console.log("Assets saved to assets.json");
}

main();
