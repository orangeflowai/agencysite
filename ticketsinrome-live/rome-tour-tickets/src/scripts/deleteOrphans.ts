
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

async function deleteOrphans() {
    console.log("🗑️  Starting Orphan Deletion Process...\n");

    // 1. Load JSON Master List
    const jsonPath = path.resolve(__dirname, "../../products.json");
    if (!fs.existsSync(jsonPath)) {
        console.error("❌ products.json not found!");
        process.exit(1);
    }
    const jsonProducts = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
    const masterSlugs = new Set(jsonProducts.map((p: any) => p.slug));

    console.log(`📋 JSON Master List: ${masterSlugs.size} unique slugs.`);

    // 2. Fetch DB Products
    const dbProducts = await client.fetch(`*[_type == "tour"]{
        _id,
        title,
        slug
    }`);
    console.log(`🗄️  Database Total:  ${dbProducts.length} items.\n`);

    // 3. Identify Orphans
    const orphans = dbProducts.filter((p: any) => !masterSlugs.has(p.slug.current));

    if (orphans.length === 0) {
        console.log("✅ No orphans found. Database is clean!");
        return;
    }

    console.log(`⚠️  Found ${orphans.length} Orphans to DELETE:`);
    orphans.forEach((p: any) => console.log(`   - ${p.title} (${p.slug.current})`));

    // 4. Delete Orphans
    console.log("\n⚡ Deleting...");

    // Create a transaction to delete them all in one go (or batches if too many)
    const transaction = client.transaction();
    orphans.forEach((p: any) => {
        transaction.delete(p._id);
    });

    try {
        await transaction.commit();
        console.log(`✅ Successfully deleted ${orphans.length} orphan products.`);
    } catch (err) {
        console.error("❌ Error deleting orphans:", err);
    }
}

deleteOrphans().catch(console.error);
