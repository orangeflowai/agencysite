const { createClient } = require('@sanity/client');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config({ path: '.env' });

if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    throw new Error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID");
}

if (!process.env.SANITY_API_TOKEN) {
    throw new Error("Missing SANITY_API_TOKEN");
}

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    token: process.env.SANITY_API_TOKEN,
    useCdn: false,
    apiVersion: '2024-01-01',
});

const VIDEO_PATH = path.join(process.cwd(), 'public', 'images', '15199954-hd_1920_1080_25fps.mp4');

async function seedSettings() {
    console.log("🚀 Starting Settings Seed...");

    try {
        let videoAssetId = null;

        // 1. Upload Video
        if (fs.existsSync(VIDEO_PATH)) {
            console.log("Generatring backup of Hero Video from local file...", VIDEO_PATH);
            const videoBuffer = fs.readFileSync(VIDEO_PATH);
            const videoAsset = await client.assets.upload('file', videoBuffer, {
                filename: 'hero-video.mp4'
            });
            videoAssetId = videoAsset._id;
            console.log("✅ Video uploaded:", videoAssetId);
        } else {
            console.warn("⚠️ Local video file not found, skipping upload.");
        }

        // 2. Create/Update Settings Document
        const doc = {
            _id: 'settings',
            _type: 'settings',
            heroTitle: 'THE ETERNAL CITY, UNLOCKED.',
            heroSubtitle: 'Private access to the Colosseum, Vatican, and hidden gems. Experience Rome without the crowds.',
            ...(videoAssetId && {
                heroVideo: {
                    _type: 'file',
                    asset: {
                        _type: 'reference',
                        _ref: videoAssetId
                    }
                }
            })
        };

        const res = await client.createOrReplace(doc);
        console.log("✅ Settings document created!", res);

    } catch (error) {
        console.error("❌ Seeding failed:", error);
    }
}

seedSettings();
