
import { createClient } from 'next-sanity'
import * as dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'

// Load environment variables from .env
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || !process.env.SANITY_API_TOKEN) {
    console.error("Missing SANITY_PROJECT_ID or SANITY_API_TOKEN in .env")
    process.exit(1)
}

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    token: process.env.SANITY_API_TOKEN,
    useCdn: false,
    apiVersion: '2024-01-01',
})

function slugify(text: string) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

function generateKey() {
    return Math.random().toString(36).substring(2, 11);
}

// Heuristic to guess category from text
function inferCategory(title: string, desc: string): string {
    const text = (title + " " + desc).toLowerCase();
    if (text.includes('vatican') || text.includes('sistine') || text.includes('peter')) return 'vatican';
    if (text.includes('colosseum') || text.includes('forum') || text.includes('palatine')) return 'colosseum';
    if (text.includes('pompeii') || text.includes('amalfi') || text.includes('day trip')) return 'day-trips';
    if (text.includes('domus aurea') || text.includes('catacomb') || text.includes('crypt') || text.includes('underground')) return 'hidden-gems';
    if (text.includes('golf cart')) return 'special';
    return 'city-walking';
}

function parsePrice(priceStr: string | null): number | undefined {
    if (!priceStr) return undefined;
    // Extract first number found. e.g. "35 - 45" -> 35
    const match = priceStr.match(/(\d+)/);
    return match ? parseInt(match[0], 10) : undefined;
}

function parseIncludesExcludes(text: string | null) {
    if (!text) return { includes: [], excludes: [] };

    // Example: "Included: Guide, Ticket. Excluded: Food, Tips."
    // Split by "Excluded:"
    const parts = text.split(/Excluded:/i);

    const includedText = parts[0].replace(/Included:/i, '').trim();
    const excludedText = parts.length > 1 ? parts[1].trim() : '';

    const includes = includedText.split(',').map(s => s.trim()).filter(Boolean);
    const excludes = excludedText.split(',').map(s => s.trim()).filter(Boolean);

    return { includes, excludes };
}

function parseFAQ(text: string | null) {
    if (!text) return [];
    // Simple parser for "Q: ... A: ..."
    // If multiple, might fail, but let's try assuming single or splitting by "Q:"
    const faqs = [];
    const parts = text.split(/Q:/).filter(Boolean); // Split by Q:

    for (const p of parts) {
        const aSplit = p.split(/A:/);
        if (aSplit.length === 2) {
            faqs.push({
                _key: generateKey(),
                question: aSplit[0].trim(),
                answer: aSplit[1].trim()
            });
        }
    }
    return faqs;
}

async function importProducts() {
    const jsonPath = path.resolve(process.cwd(), 'products.json');
    console.log(`Reading products from ${jsonPath}...`);

    const rawData = fs.readFileSync(jsonPath, 'utf-8');
    const products = JSON.parse(rawData);

    console.log(`Found ${products.length} products. Starting import...`);

    const transaction = client.transaction();

    // OPTIONAL: Delete existing? User said "add info... with existing". 
    // We will UPSERT based on Slug. 

    for (const p of products) {
        const title = p["Tour Title"];
        if (!title) continue;

        const slug = slugify(title);
        const category = inferCategory(title, p["Tour Description"] || "");
        const price = parsePrice(p["Adult Price (EUR)"]);
        const studentPrice = parsePrice(p["Student Price (EUR)"]);

        const { includes, excludes } = parseIncludesExcludes(p["Included Excluded"]);
        const faqs = parseFAQ(p["Frequently Asked Questions"]);

        // Highlights
        const highlights = p["Highlights"] ? p["Highlights"].split(',').map((s: string) => s.trim()) : [];

        // Important Info
        const importantInfo = [];
        if (p["Other Information"]) importantInfo.push(p["Other Information"]);
        if (p["Know Before You"]) importantInfo.push(p["Know Before You"]);

        // Description to Portable Text
        const descriptionBlock = {
            _key: generateKey(),
            _type: 'block',
            children: [{ _key: generateKey(), _type: 'span', text: p["Tour Description"] || "" }],
            markDefs: [],
            style: 'normal'
        };

        const doc = {
            _type: 'tour',
            title: title,
            slug: { _type: 'slug', current: slug },

            // Fields directly mapped
            duration: p["Tour Duration"],
            meetingPoint: p["Meeting Place"],
            groupSize: p["Group Size"],
            location: p["Tour Location"],

            // Parsed/Inferred
            category,
            price,
            studentPrice,
            includes,
            excludes,
            highlights,
            importantInfo, // Array of strings
            faqs,

            description: [descriptionBlock],

            // Defaults or Missing
            tourType: 'Guided Tour', // Default
            rating: 5.0, // Default for new import
            reviewCount: 0,
        };

        // Determine ID deterministically so we update if exists
        const id = `tour-${slug}`; // e.g. tour-colosseum-arena-private-tour

        // We use createOrReplace to ensure we overwrite with this new data source
        transaction.createOrReplace({ ...doc, _id: id });
        console.log(`Queued: ${title} (${id})`);
    }

    try {
        console.log("Committing transaction...");
        await transaction.commit();
        console.log("Import successful!");
    } catch (err) {
        console.error("Import failed:", err);
    }
}

importProducts();
