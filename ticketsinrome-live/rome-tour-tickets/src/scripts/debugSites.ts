
import { createClient } from 'next-sanity';
import dotenv from 'dotenv';
dotenv.config();

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2024-01-01',
    useCdn: false,
    token: process.env.SANITY_API_TOKEN,
});

async function debugData() {
    console.log("--- Fetching Sites ---");
    const sites = await client.fetch(`*[_type == "site"]{_id, title, slug}`);
    console.log(JSON.stringify(sites, null, 2));

    console.log("\n--- Fetching First 5 Tours ---");
    const tours = await client.fetch(`*[_type == "tour"][0...5]{
        _id, 
        title, 
        slug, 
        "siteRefs": sites[]->slug.current
    }`);
    console.log(JSON.stringify(tours, null, 2));
}

debugData();
