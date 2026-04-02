
import { createClient } from "next-sanity";
import dotenv from "dotenv";
import path from "path";

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

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

async function audit() {
    console.log("🔍 Starting Content Audit...\n");

    const tours = await client.fetch(`*[_type == "tour"]{
        _id,
        title,
        price,
        mainImage,
        "descriptionLength": count(description),
        "hasGallery": count(gallery) > 0
    }`);

    const complete = [];
    const missingImages = [];
    const missingPrice = [];
    const missindDesc = [];

    console.log(`Found ${tours.length} total tours.`);
    console.log("-".repeat(50));

    for (const tour of tours) {
        let issues = [];

        if (!tour.mainImage) issues.push("Missing Main Image");
        if (!tour.price) issues.push("Missing Price");
        if (!tour.descriptionLength) issues.push("Missing Description");

        if (issues.length === 0) {
            complete.push(tour.title);
        } else {
            console.log(`❌ [NEEDS UPDATE] ${tour.title}`);
            issues.forEach(issue => console.log(`   - ${issue}`));

            if (issues.includes("Missing Main Image")) missingImages.push(tour.title);
            if (issues.includes("Missing Price")) missingPrice.push(tour.title);
        }
    }

    console.log("-".repeat(50));
    console.log(`✅ COMPLETE PRODUCTS (${complete.length}):`);
    complete.forEach(t => console.log(`   • ${t}`));

    console.log("\n⚠️  SUMMARY OF ACTIONS NEEDED:");
    if (missingImages.length > 0) {
        console.log(`\n📸 UPLOAD IMAGES FOR (${missingImages.length}):`);
        missingImages.forEach(t => console.log(`   • ${t}`));
    }
}

audit().catch(console.error);
