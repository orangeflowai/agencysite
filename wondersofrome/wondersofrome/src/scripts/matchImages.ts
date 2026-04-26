
import { createClient } from "next-sanity";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { basename } from "path";

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
        .replace(/['’]/g, "")
        .replace(/[^\w\s]/g, "")
        .replace(/\s+/g, " ")
        .trim();
}

async function uploadImage(filePath: string) {
    try {
        const fileBuffer = fs.readFileSync(filePath);
        const filename = basename(filePath);
        const asset = await client.assets.upload('image', fileBuffer, {
            filename: filename
        });
        return {
            _type: 'image',
            asset: {
                _type: "reference",
                _ref: asset._id
            }
        };
    } catch (err) {
        console.error(`Error uploading ${filePath}:`, err);
        return null;
    }
}

async function matchImages() {
    console.log("📸 Starting Intelligent Image Matching...\n");

    const imagesDir = path.resolve(__dirname, "../../public/images");
    if (!fs.existsSync(imagesDir)) {
        console.error("Images directory not found at:", imagesDir);
        process.exit(1);
    }

    // Get all image subdirectories
    const imageFolders = fs.readdirSync(imagesDir).filter(file => {
        return fs.statSync(path.join(imagesDir, file)).isDirectory();
    });

    console.log(`Found ${imageFolders.length} image source folders.`);

    // Fetch products missing images
    const products = await client.fetch(`*[_type == "tour" && (!defined(mainImage) || count(gallery) == 0)]{
        _id,
        title,
        slug
    }`);

    console.log(`Found ${products.length} products needing images.\n`);

    let updatedCount = 0;

    for (const product of products) {
        console.log(`Processing: ${product.title}`);

        // Fuzzy Match Product Title vs Folder Names
        let bestMatch = null;
        let bestScore = 0;

        const normTitle = normalize(product.title);

        for (const folder of imageFolders) {
            const normFolder = normalize(folder);

            // Check for containment (e.g. "Colosseum" in "Colosseum Tour")
            if (normTitle.includes(normFolder) || normFolder.includes(normTitle)) {
                // High confidence boost for substring match
                bestMatch = folder;
                bestScore = 0.9;
                break;
            }

            // Fallback to Levenshtein
            const dist = levenshtein(normTitle, normFolder);
            const similarity = 1 - (dist / Math.max(normTitle.length, normFolder.length));

            if (similarity > bestScore) {
                bestScore = similarity;
                bestMatch = folder;
            }
        }

        // Threshold 0.4 implies loose matching (user said "partially")
        if (bestMatch && bestScore > 0.4) {
            console.log(`   ✅ Matched with folder: "${bestMatch}" (Score: ${bestScore.toFixed(2)})`);

            const folderPath = path.join(imagesDir, bestMatch);
            const files = fs.readdirSync(folderPath).filter(f =>
                !f.startsWith("._") &&
                (f.endsWith(".jpg") || f.endsWith(".jpeg") || f.endsWith(".png") || f.endsWith(".webp"))
            );

            if (files.length > 0) {
                console.log(`   Found ${files.length} images. Uploading match...`);

                // PICK MAIN IMAGE (First valid image)
                const mainImagePayload = await uploadImage(path.join(folderPath, files[0]));

                // PICK GALLERY (Next 5 images)
                const galleryPayloads = [];
                for (let i = 1; i < Math.min(files.length, 6); i++) {
                    const img = await uploadImage(path.join(folderPath, files[i]));
                    if (img) galleryPayloads.push(img);
                }

                if (mainImagePayload) {
                    await client.patch(product._id)
                        .set({
                            mainImage: mainImagePayload,
                            gallery: galleryPayloads
                        })
                        .commit();
                    console.log(`   ✨ Successfully updated product!`);
                    updatedCount++;
                }
            } else {
                console.log(`   ⚠️  Folder found but contains no valid images.`);
            }

        } else {
            console.log(`   ❌ No matching image folder found.`);
        }
    }

    console.log("\n" + "=".repeat(30));
    console.log(`Updated ${updatedCount} products with images.`);
    console.log("=".repeat(30));
}

matchImages().catch(console.error);
