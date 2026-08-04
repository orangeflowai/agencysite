
import { createClient } from 'next-sanity'
import * as dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'

// Load environment variables from .env
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || !process.env.SANITY_API_TOKEN) {
    console.error("Missing SANITY_PROJECT_ID or SANITY_API_TOKEN in .env.local")
    process.exit(1)
}

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    token: process.env.SANITY_API_TOKEN,
    useCdn: false, // We are writing, so no CDN
    apiVersion: '2024-01-01',
})

// Helper to generate a unique key for Sanity arrays
function generateKey() {
    return Math.random().toString(36).substring(2, 11);
}

function slugify(text: string) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
}

// Recursively add keys to objects in arrays (mandatory for Sanity blocks and objects)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function addKeys(val: any): any {
    if (Array.isArray(val)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return val.map((item: any) => {
            if (typeof item === 'object' && item !== null) {
                const newItem = { ...item };
                if (!newItem._key) {
                    newItem._key = generateKey();
                }
                // Recursively add keys to children (e.g. spans in blocks)
                for (const key in newItem) {
                    newItem[key] = addKeys(newItem[key]);
                }
                return newItem;
            }
            return item;
        });
    }
    return val;
}

function stringToBlocks(text: string) {
    if (!text) return [];
    return [
        {
            _type: 'block',
            style: 'normal',
            _key: generateKey(),
            children: [{ _type: 'span', _key: generateKey(), text: text }]
        }
    ]
}

function mapCategory(cat: string): string {
    const map: Record<string, string> = {
        'City Tours': 'city',
        'Vatican': 'vatican',
        'Colosseum': 'colosseum',
        'Hidden Gems': 'hidden-gems',
        'Special': 'special',
        'Bus Tours': 'special', // Assuming bus tours fall under Special
        'Private': 'special' // Or allow a new category? Sticking to schema list.
    };
    // Default to 'city' if not found, or try lowercase
    return map[cat] || cat.toLowerCase().replace(/\s+/g, '-');
}

async function seed() {
    // Read products.json
    const jsonPath = path.resolve(process.cwd(), 'products.json');
    console.log(`Reading products from: ${jsonPath}`);
    const productsRaw = fs.readFileSync(jsonPath, 'utf8');
    const products = JSON.parse(productsRaw);

    console.log(`Starting seed of ${products.length} products...`)

    // CLEAR EXISTING DATA
    console.log("Deleting existing tours to ensure clean state...");
    await client.delete({ query: '*[_type == "tour"]' });
    await client.delete({ query: '*[_id in path("drafts.**")]' });
    console.log("Deletion complete.");

    const transaction = client.transaction()

     
    for (const product of products) {
        const slug = product.slug || slugify(product.tour_title)
        console.log(`Processing: ${product.tour_title} -> ${slug}`)

        const doc = {
            _type: 'tour',
            title: product.tour_title,
            slug: { _type: 'slug', current: slug },
            price: product.adult_price_eur,
            studentPrice: product.student_price_eur,
            youthPrice: product.youth_price_eur,
            duration: product.duration,
            category: mapCategory(product.category),
            tourType: product.tour_type,
            location: product.location,
            groupSize: product.group_size,
            badge: product.badge,
            rating: product.rating,
            reviewCount: product.review_count,

            // Content
            description: stringToBlocks(product.full_description),
            highlights: product.highlights,
            includes: product.whats_included,
            excludes: product.whats_not_included,
            itinerary: addKeys(product.itinerary),
            faqs: addKeys(product.faqs),

            // Logistics
            meetingPoint: product.meeting_point,
            importantInfo: product.important_information ? [product.important_information] : [], // Schema expects array
            knowBeforeYouGo: product.know_before_you_go,

            // SEO
            seoTitle: product.seo_title,
            seoDescription: product.seo_description,
            keywords: product.keywords,
            tags: product.marketing_tags // Mapped to tags
        }

        // Use create instead of create/patch since we deleted all.
        // But to avoid ID collision if we run multiple times (though we delete first), create is fine.
        transaction.create(doc);
    }

    try {
        await transaction.commit()
        console.log('Seed completed successfully!')
    } catch (err) {
        console.error('Seed failed:', err)
    }
}

seed()
