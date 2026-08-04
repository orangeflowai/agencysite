
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

// Helper to convert plain text to Portable Text
function convertToPortableText(text: string | null | undefined): any[] {
    if (!text) return [];
    return text.split('\n\n').filter(Boolean).map(para => ({
        _type: 'block',
        style: 'normal',
        _key: Math.random().toString(36).substring(7),
        children: [{
            _type: 'span',
            marks: [],
            text: para.trim()
        }],
        markDefs: []
    }));
}

async function updateProducts() {
    console.log("🚀 Starting Product Sync (Ignoring Images)...\n");

    const jsonPath = path.resolve(__dirname, "../../products.json");
    if (!fs.existsSync(jsonPath)) {
        console.error("❌ products.json not found!");
        process.exit(1);
    }

    const products = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

    let created = 0;
    let updated = 0;
    let errors = 0;

    // Fetch existing tours
    const existingTours = await client.fetch(`*[_type == "tour"]{_id, slug, title}`);
    const existingSlugMap = new Map(existingTours.map((t: any) => [t.slug.current, t._id]));

    for (const product of products) {
        const title = product.tour_title;
        const slug = product.slug;

        console.log(`Processing: ${title} (${slug})`);

        if (!title || !slug) {
            console.warn("   ⚠️ Skipping invalid product (missing Title or Slug)");
            continue;
        }

        // Map JSON structure to Sanity Schema
        const doc: any = {
            _type: 'tour',
            title: title,
            slug: { _type: 'slug', current: slug },

            // Details
            category: product.category ? product.category.toLowerCase().replace(/\s+/g, '-') : 'city',
            tourType: product.tour_type,
            duration: product.duration,
            location: product.location,
            groupSize: product.group_size,

            // Pricing
            price: product.adult_price_eur,
            studentPrice: product.student_price_eur,
            youthPrice: product.youth_price_eur,

            // Marketing
            badge: product.badge,
            rating: product.rating,
            reviewCount: product.review_count,
            tags: product.marketing_tags,

            // Content
            description: convertToPortableText(product.full_description),
            highlights: product.highlights,
            includes: product.whats_included,
            excludes: product.whats_not_included,

            // Logistics
            meetingPoint: product.meeting_point,
            importantInfo: product.important_information ? [product.important_information] : [],
            knowBeforeYouGo: product.know_before_you_go,

            // FAQs
            faqs: product.faqs?.map((f: any) => ({
                _type: 'object',
                _key: Math.random().toString(36).substring(7),
                question: f.question,
                answer: f.answer
            })) || [],

            // SEO
            seoTitle: product.seo_title,
            seoDescription: product.seo_description,
            keywords: product.keywords,
        };

        try {
            const existingId = existingSlugMap.get(slug);

            if (existingId) {
                // PATCH existing
                console.log(`  -> 🔄 Updating existing tour: ${title}`);
                const { _type, ...updateDoc } = doc;
                await client
                    .patch(existingId as string)
                    .set(updateDoc)
                    .commit();
                updated++;
            } else {
                // CREATE new
                console.log(`  -> ✨ Creating NEW tour`);
                await client.create(doc);
                created++;
            }
        } catch (err) {
            console.error(`  ❌ Error processing ${slug}:`, err);
            errors++;
        }
    }

    console.log("\n" + "=".repeat(30));
    console.log(`REPORT SUMMARY:`);
    console.log(`✨ Created: ${created}`);
    console.log(`🔄 Updated: ${updated}`);
    console.log(`❌ Errors:  ${errors}`);
    console.log("=".repeat(30));
}

updateProducts().catch((err) => {
    console.error("Fatal Error:", err);
    process.exit(1);
});
