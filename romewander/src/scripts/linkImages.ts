
import { createClient } from 'next-sanity';
import * as dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || !process.env.SANITY_API_TOKEN) {
    console.error("Missing SANITY_PROJECT_ID or SANITY_API_TOKEN in .env");
    process.exit(1);
}

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    token: process.env.SANITY_API_TOKEN,
    useCdn: false,
    apiVersion: '2024-01-01',
});

const IMAGES_DIR = path.join(process.cwd(), 'public', 'images');
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Map Folder Name -> Sanity Slug(s)
const MAPPING: Record<string, string | string[]> = {
    'Appian Way & Catacombs': 'appian-way-catacombs',
    'Castel sant\'Angelo': 'castel-santangelo-guided-tour',
    'Castel sant\'Angelo Private': 'castel-santangelo-guided-tour', // Fallback to standard
    'Colosseum Underground & Arena Private Tour': [
        'colosseum-underground-arena-private',
        'best-pompeii-tour-from-rome-in-a-day-with-professional-archeologist-guide' // Fallback for Pompeii
    ],
    'DOMUS AUREA': 'domus-aurea-nero-golden-house',
    'Golf Cart Tours': [
        'ancient-rome-golf-cart',
        'rome-highlights-golf-cart',
        'vatican-baroque-golf-cart'
    ],
    'Hidden Churches': 'hidden-churches-rome-walking',
    'Hidden Gems': 'hidden-gems-rome-walking',
    'Palatine Hill': 'palatine-hill-sunrise-private',
    'Pantheon': 'pantheon-guided-tour',
    'Pantheon Private': 'pantheon-guided-tour', // Fallback
    'Roman Forum': 'colosseum-arena-roman-forum',
    'Saint Peter Dome': [
        'st-peters-basilica-dome-climb',
        'saint-peters-basilica-tours-with-live-guide'
    ],
    'Santa Maria Maggiore': 'santa-maria-maggiore-underground',
    'Stadium of Domitian': 'stadium-domitian-underground',
    'Vatican & Castel Sant\'Angelo': 'vatican-castel-santangelo-combo',
    'Vatican Gardens': 'complete-vatican-museums-sistine-chapel', // Best match available
    'Vatican Gardens & Museum': [
        'early-morning-vatican-tour-with-sistine-chapel-and-direct-access-to-saint-peters-basilica-church-without-line',
        'private-vatican-evening-tour'
    ],
    'rome city walking tour': 'rome-walking-tour-pantheon-squares',
    'Rome in a Day': 'fast-track-combo-vatican-museum-rome-sightseeing-hop-on-hop-off-bus-tickets' // Approximate match
};

function isValidImage(filename: string, folderPath: string) {
    if (!/\.(jpg|jpeg|png|webp)$/i.test(filename) || filename.startsWith('.')) return false;
    const stats = fs.statSync(path.join(folderPath, filename));
    return stats.size <= MAX_FILE_SIZE;
}

async function linkImages() {
    if (!fs.existsSync(IMAGES_DIR)) {
        console.error(`Directory not found: ${IMAGES_DIR}`);
        return;
    }

    const entries = fs.readdirSync(IMAGES_DIR, { withFileTypes: true });

    console.log("Starting Image Link Process...");

    for (const entry of entries) {
        if (!entry.isDirectory()) continue;

        const folderName = entry.name;
        const mapping = MAPPING[folderName];

        if (!mapping) {
            console.log(`[SKIP] Unmapped folder: "${folderName}"`);
            continue;
        }

        const slugs = Array.isArray(mapping) ? mapping : [mapping];
        const folderPath = path.join(IMAGES_DIR, folderName);

        const files = fs.readdirSync(folderPath).filter(f => isValidImage(f, folderPath));
        if (files.length === 0) {
            console.warn(`  [WARN] No matching images in "${folderName}"`);
            continue;
        }

        console.log(`\nProcessing folder: "${folderName}" -> Targets: ${slugs.join(', ')}`);

        // Upload images ONCE per folder, then link to multiple tours
        const uploadedAssets: string[] = [];

        // Upload up to 6 images
        for (const filename of files.slice(0, 6)) {
            try {
                const filePath = path.join(folderPath, filename);
                console.log(`  Uploading: ${filename}...`);
                const asset = await client.assets.upload('image', fs.createReadStream(filePath), {
                    filename: filename
                });
                uploadedAssets.push(asset._id);
            } catch (err) {
                console.error(`    [ERROR] Upload failed for ${filename}:`, err);
            }
        }

        if (uploadedAssets.length === 0) continue;

        // Link to each mapped slug
        for (const slug of slugs) {
            const tour = await client.fetch(`*[_type == "tour" && slug.current == $slug][0]`, { slug });

            if (!tour) {
                console.warn(`  [MISSING] Target tour not found for slug: ${slug}`);
                continue;
            }

            const mainImageId = uploadedAssets[0];
            const galleryIds = uploadedAssets.map(id => ({
                _key: Math.random().toString(36).substring(2, 11),
                _type: 'image',
                asset: { _type: 'reference', _ref: id }
            }));

            await client
                .patch(tour._id)
                .set({
                    mainImage: {
                        _type: 'image',
                        asset: { _type: 'reference', _ref: mainImageId }
                    },
                    gallery: galleryIds
                })
                .commit();

            console.log(`  [LINKED] ${uploadedAssets.length} images to "${tour.title}"`);
        }
    }

    console.log("\nImage linking process completed.");
}

linkImages();
