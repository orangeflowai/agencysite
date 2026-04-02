
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

async function listSites() {
    console.log("Listing all sites...");
    const sites = await client.fetch(`*[_type == "site"]{_id, title, "slug": slug.current}`);
    console.log(JSON.stringify(sites, null, 2));
}

listSites();
