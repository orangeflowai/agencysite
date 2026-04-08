const { createClient } = require('@sanity/client');
const { createClient: createSupabase } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config({ path: '.env' });

// Config Check
if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || !process.env.SANITY_API_TOKEN) {
    throw new Error("Missing Sanity Config");
}
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Missing Supabase Service Role Config");
}

// Clients
const sanity = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    token: process.env.SANITY_API_TOKEN,
    useCdn: false,
    apiVersion: '2024-01-01',
});

const supabase = createSupabase(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function syncTours() {
    console.log("🚀 Starting Tours Sync (Sanity -> Supabase)...");

    try {
        // 1. Fetch All Tours from Sanity
        // Only fetch valid tours with slugs
        const tours = await sanity.fetch(`*[_type == "tour" && defined(slug.current)]{
            "slug": slug.current,
            title,
            price,
            "category": categories[0]->title
        }`);

        console.log(`📡 Found ${tours.length} tours in Sanity.`);

        // 2. Upsert into Supabase
        for (const tour of tours) {
            const payload = {
                slug: tour.slug,
                title: tour.title,
                base_price: tour.price || 0,
                category: tour.category || 'Uncategorized'
            };

            const { error } = await supabase
                .from('tours')
                .upsert(payload, { onConflict: 'slug' });

            if (error) {
                console.error(`❌ Failed to sync ${tour.slug}:`, error.message);
            } else {
                console.log(`✅ Synced: ${tour.title} (€${tour.price})`);
            }
        }

        console.log("🎉 Sync Complete!");

    } catch (err) {
        console.error("Sync Failed:", err);
    }
}

syncTours();
