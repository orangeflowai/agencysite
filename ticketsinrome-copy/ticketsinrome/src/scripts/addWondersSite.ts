
import { createClient } from 'next-sanity';
import dotenv from 'dotenv';
dotenv.config();

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2024-01-01', // ISO date string
    useCdn: false,
    token: process.env.SANITY_API_TOKEN,
});

async function migrate() {
    console.log("Fetching 'wondersofrome' site ID...");
    const wonderSite = await client.fetch(`*[_type == "site" && slug.current == "wondersofrome"][0]{_id}`);

    if (!wonderSite) {
        console.error("Could not find 'wondersofrome' site!");
        return;
    }

    console.log("Found site:", wonderSite._id);

    console.log("Fetching all tours...");
    const tours = await client.fetch(`*[_type == "tour"]{_id, title, sites}`);

    console.log(`Found ${tours.length} tours. Updating...`);

    const transaction = client.transaction();
    const batchSize = 100; // Safe batch size
    let count = 0;

    for (const tour of tours) {
        // Build array of site IDs currently linked
        const currentSiteIds = tour.sites ? tour.sites.map((s: any) => s._ref) : [];

        // Only append if not already present
        if (!currentSiteIds.includes(wonderSite._id)) {
            transaction.patch(tour._id, p =>
                p.setIfMissing({ sites: [] })
                    .append('sites', [{ _type: 'reference', _ref: wonderSite._id, _key: `wonder-${tour._id}` }])
            );
            count++;
        }
    }

    if (count > 0) {
        await transaction.commit();
        console.log(`Migration complete! Updated ${count} tours to include 'wondersofrome'.`);
    } else {
        console.log("No tours needed updates.");
    }
}

migrate();
