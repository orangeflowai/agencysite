
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

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

async function uploadFile(filePath: string, fileName: string) {
    try {
        const fileContent = fs.readFileSync(filePath);
        const { data, error } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(fileName, fileContent, {
                contentType: fileName.endsWith('.png') ? 'image/png' : 'video/mp4',
                upsert: true
            });

        if (error) {
            console.error(`Error uploading ${fileName}:`, error.message);
        } else {
            console.log(`Success: Uploaded ${fileName}`);
            const { data: { publicUrl } } = supabase.storage.from(BUCKET_NAME).getPublicUrl(fileName);
            console.log(`URL: ${publicUrl}`);
        }
    } catch (err) {
        console.error(`Failed to read/upload ${fileName}:`, err);
    }
}

async function main() {
    console.log(`Checking bucket: ${BUCKET_NAME}...`);
    const { data: buckets, error } = await supabase.storage.listBuckets();

    if (error) {
        console.error("Error listing buckets:", error);
        return;
    }

    const bucket = buckets.find(b => b.name === BUCKET_NAME);
    if (!bucket) {
        console.log(`Bucket '${BUCKET_NAME}' not found. Creating...`);
        const { error: createError } = await supabase.storage.createBucket(BUCKET_NAME, { public: true });
        if (createError) {
            console.error("Failed to create bucket:", createError);
            return;
        }
        console.log("Bucket created.");
    } else {
        console.log(`Bucket '${BUCKET_NAME}' exists.`);
    }

    // Upload Logo
    await uploadFile(path.join(process.cwd(), 'public', 'logo.png'), 'logo.png');

    // Upload TripAdvisor
    await uploadFile(path.join(process.cwd(), 'public', 'tripAdvisor.png'), 'tripAdvisor.png');

    // Check for hero video
    const videoPath = path.join(process.cwd(), 'public', 'images', '15199954-hd_1920_1080_25fps.mp4');
    if (fs.existsSync(videoPath)) {
        await uploadFile(videoPath, 'hero-video.mp4');
    }
}

main();
