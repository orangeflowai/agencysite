
import { createClient } from "next-sanity";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !dataset || !token) {
    console.error("Missing Sanity configuration. Check .env file.");
    process.exit(1);
}

const client = createClient({
    projectId,
    dataset,
    token,
    useCdn: false,
    apiVersion: "2024-01-01",
});

async function inventoryReport() {
    console.log("📊 Generating Inventory Report...\n");

    // 1. Load JSON Master List
    const jsonPath = path.resolve(__dirname, "../../products.json");
    const jsonProducts = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
    console.log(`📋 JSON Master List: ${jsonProducts.length} items.`);

    // 2. Fetch DB Products
    const dbProducts = await client.fetch(`*[_type == "tour"]{
        _id,
        title,
        slug,
        price,
        "descLen": count(description)
    }`);
    console.log(`🗄️  Database Total:  ${dbProducts.length} items.\n`);

    // 3. Analyze Matches
    let fullySynced = 0;
    let partialMatch = 0; // Exists but maybe price/title mismatch?
    let orphans = 0; // In DB but NOT in JSON

    const jsonSlugs = new Set(jsonProducts.map((p: any) => p.slug));

    // Check DB items against JSON
    const syncedItems = [];
    const orphanItems = [];

    for (const dbItem of dbProducts) {
        // Find matching JSON item
        const jsonItem = jsonProducts.find((p: any) => p.slug === dbItem.slug.current);

        if (jsonItem) {
            // Check for data equality (Title & Price as proxy)
            // Fuzzy match title just in case of minor encoding diffs
            const titleMatch = dbItem.title.trim() === jsonItem.tour_title.trim();
            const priceMatch = dbItem.price === jsonItem.adult_price_eur;

            if (titleMatch && priceMatch) {
                fullySynced++;
                syncedItems.push(dbItem.title);
            } else {
                partialMatch++;
                console.log(`⚠️  Mismatch: ${dbItem.title}`);
                if (!titleMatch) console.log(`    Title: '${dbItem.title}' vs '${jsonItem.tour_title}'`);
                if (!priceMatch) console.log(`    Price: ${dbItem.price} vs ${jsonItem.adult_price_eur}`);
            }
        } else {
            orphans++;
            orphanItems.push(dbItem.title);
        }
    }

    console.log("-".repeat(40));
    console.log(`MATCH RESULTS:`);
    console.log(`✅ Fully Synced (Data matches JSON): ${fullySynced}`);
    if (partialMatch > 0) console.log(`⚠️  Partial Match (Slug exists, data differs): ${partialMatch}`);
    console.log(`👻 Orphans (In DB but NOT in JSON):  ${orphans}`);

    if (orphans > 0) {
        console.log("\nOrphaned Items (Legacy?):");
        orphanItems.forEach(t => console.log(` - ${t}`));
    }
    console.log("-".repeat(40));
}

inventoryReport().catch(console.error);
