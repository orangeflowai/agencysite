
import { createClient } from "next-sanity";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    token: process.env.SANITY_API_TOKEN,
    useCdn: false,
    apiVersion: "2024-01-01",
});

async function reportMissingImages() {
    const products = await client.fetch(`*[_type == "tour" && !defined(mainImage)]{
        title,
        slug
    }`);

    if (products.length === 0) {
        console.log("✅ All products have images!");
    } else {
        console.log(`⚠️  The following ${products.length} products MISSING images:`);
        products.forEach((p: any) => console.log(`   ❌ ${p.title}`));
    }
}

reportMissingImages();
