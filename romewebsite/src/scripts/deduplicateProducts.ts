
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

// Simple Levenshtein distance for fuzzy matching
function levenshtein(a: string, b: string): number {
    const matrix = [];
    for (let i = 0; i <= b.length; i++) { matrix[i] = [i]; }
    for (let j = 0; j <= a.length; j++) { matrix[0][j] = j; }
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) == a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
                );
            }
        }
    }
    return matrix[b.length][a.length];
}

function normalize(str: string) {
    return str.toLowerCase()
        .replace(/['’]/g, "") // remove quotes first
        .replace(/[^\w\s]/g, "") // remove other punctuation
        .replace(/\s+/g, " ") // collapse spaces
        .replace(/\b(tour|guided|skip the line|rome|tickets|experience)\b/g, "") // remove common fillers
        .trim();
}

async function deduplicate() {
    console.log("🧹 Starting Smart Deduplication...\n");

    const jsonPath = path.resolve(__dirname, "../../products.json");
    const productsJSON = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

    // Fetch all tours from Sanity
    const allTours = await client.fetch(`*[_type == "tour"]{
        _id, 
        title, 
        slug, 
        mainImage, 
        gallery, 
        "descriptionLen": count(description) 
    }`);

    console.log(`Analyzing ${allTours.length} tours in database against ${productsJSON.length} master records.\n`);

    let deletedCount = 0;
    let mergedCount = 0;

    for (const master of productsJSON) {
        // The "correct" tour is the one matching the current slug from JSON
        const masterSlug = master.slug;
        const masterTitle = master.tour_title;

        const dbMaster = allTours.find((t: any) => t.slug.current === masterSlug);

        if (!dbMaster) {
            console.warn(`⚠️  Master product not found in DB: ${masterTitle} (${masterSlug}) - Skipping`);
            continue;
        }

        // Find Candidates for deletion
        const duplicates = allTours.filter((t: any) => {
            if (t._id === dbMaster._id) return false; // Don't compare with self

            // 1. Strict Slug Match (Rare, but possible if duplicate slugs exist? Sanity blocks this usually)

            // 2. Title Fuzzy Match
            const normMaster = normalize(masterTitle);
            const normCand = normalize(t.title);

            // Check for very high similarity
            const dist = levenshtein(normMaster, normCand);
            const similarity = 1 - (dist / Math.max(normMaster.length, normCand.length));

            // Threshold: > 80% similarity on normalized string
            return similarity > 0.80;
        });

        if (duplicates.length > 0) {
            console.log(`\n🎯 MASTER: ${masterTitle} (ID: ${dbMaster._id})`);

            for (const dupe of duplicates) {
                console.log(`   Found DUPLICATE: ${dupe.title} (ID: ${dupe._id})`);

                // --- IMAGE MIGRATION LOGIC ---
                let patch = client.patch(dbMaster._id);
                let neededPatch = false;

                // Move Main Image if Master is missing it
                if (!dbMaster.mainImage && dupe.mainImage) {
                    console.log(`   📸 Migrating Main Image from Duplicate -> Master`);
                    patch = patch.set({ mainImage: dupe.mainImage });
                    neededPatch = true;
                }

                // Move Gallery if Master is missing it
                if ((!dbMaster.gallery || dbMaster.gallery.length === 0) && (dupe.gallery && dupe.gallery.length > 0)) {
                    console.log(`   📸 Migrating Gallery from Duplicate -> Master`);
                    patch = patch.set({ gallery: dupe.gallery });
                    neededPatch = true;
                }

                if (neededPatch) {
                    await patch.commit();
                    mergedCount++;
                }

                // CHECK: Only delete if the duplicate has LESS or EQUAL info?
                // Actually, user said delete duplicates. We trust the JSON master is "Supreme".
                // But let's be safe: If Description length of duplicate is huge and Master is small, warn?
                // User said "one which has all the info" (Master) so we trust Master.

                console.log(`   🗑️  Deleting Duplicate...`);
                await client.delete(dupe._id);
                deletedCount++;
            }
        }
    }

    console.log("\n" + "=".repeat(30));
    console.log(`CLEANUP SUMMARY:`);
    console.log(`🔄 Merged Images: ${mergedCount}`);
    console.log(`🗑️  Deleted Duplicates: ${deletedCount}`);
    console.log("=".repeat(30));
}

deduplicate().catch(console.error);
