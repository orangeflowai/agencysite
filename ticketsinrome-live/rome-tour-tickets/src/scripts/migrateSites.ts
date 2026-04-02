
import { createClient } from 'next-sanity'
import * as dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env') })

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    token: process.env.SANITY_API_TOKEN,
    useCdn: false,
    apiVersion: '2024-01-01',
})

async function migrateSites() {
    console.log("🚀 Starting Site Migration (Fixing Orphans)...");

    const SITE_ID = 'tickets-in-rome-site'; // The ID we just created

    // Fetch ALL tours to ensure compliance
    const tours = await client.fetch(`*[_type == "tour"]`);

    console.log(`Found ${tours.length} tours.`);

    for (const tour of tours) {
        // Check if already linked correctly
        const isLinked = tour.sites && tour.sites.some((s: any) => s._ref === SITE_ID);

        if (!isLinked) {
            console.log(`Linking: ${tour.title}...`);
            try {
                // If sites array exists, push to it; otherwise create it
                const newSites = tour.sites ? [...tour.sites, { _type: 'reference', _ref: SITE_ID }] : [{ _type: 'reference', _ref: SITE_ID }];

                await client.patch(tour._id)
                    .set({ sites: newSites })
                    .unset(['site']) // Cleanup old field
                    .commit();

                console.log(`✅ Linked ${tour.title}`);
            } catch (err) {
                console.error(`❌ Failed to link ${tour.title}:`, err);
            }
        } else {
            console.log(`Skipping ${tour.title} (Already Sent)`);
        }
    }

    console.log("🎉 Migration Complete!");
}

migrateSites();
