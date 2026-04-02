
import { createClient } from 'next-sanity';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    token: process.env.SANITY_API_TOKEN,
    useCdn: false,
    apiVersion: '2024-01-01',
});

async function checkIds() {
    console.log("Fetching all tours...");
    try {
        const tours = await client.fetch(`*[_type == "tour"]{title, _id, "draftId": _id}`);
        const drafts = await client.fetch(`*[_id in path("drafts.**")]`);

        console.log("\n--- TOURS ---");
        tours.forEach((t: any) => {
            console.log(`${t.title}: ${t._id}`);
        });

        console.log("\n--- DRAFTS ---");
        drafts.forEach((d: any) => {
            console.log(`[DRAFT] ${d._id}`);
        });

    } catch (err) {
        console.error("Error fetching data:", err);
    }
}

checkIds();
