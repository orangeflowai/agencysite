
import { createClient } from "next-sanity";
import dotenv from "dotenv";
import path from "path";
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

async function checkDescriptions() {
    console.log("🔍 Checking for products with missing descriptions...\n");

    try {
        // Query for tours where description is not defined OR has 0 blocks
        const products = await client.fetch(`*[_type == "tour" && (!defined(description) || count(description) == 0)]{
            title,
            slug
        }`);

        if (products.length === 0) {
            console.log("✅ All products have descriptions!");
        } else {
            console.log(`⚠️  Found ${products.length} products MISSING descriptions:\n`);
            products.forEach((p: any) => {
                console.log(`   ❌ ${p.title} (${p.slug.current})`);
            });
        }

    } catch (error) {
        console.error("Error checking descriptions:", error);
    }
}

checkDescriptions();
