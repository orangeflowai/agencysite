
import { createClient } from 'next-sanity';
import { projectId, dataset, apiVersion } from '../sanity/env';
import dotenv from 'dotenv';
dotenv.config();

const client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    token: process.env.SANITY_API_TOKEN,
});

async function checkTours() {
    const siteId = process.env.NEXT_PUBLIC_SITE_ID || 'rome-tour-tickets';
    console.log(`Checking tours for Site ID: ${siteId}`);

    // 1. Fetch ALL tours and see what 'sites' they have
    const allTours = await client.fetch(`*[_type == "tour"]{title, slug, "sites": sites[]->slug.current}`);
    console.log(`\nFound ${allTours.length} total tours in Sanity.`);

    // 2. Check for tours matching the site
    const matchingTours = allTours.filter((t: any) => t.sites?.includes(siteId));
    console.log(`Found ${matchingTours.length} tours linked to '${siteId}'.`);

    if (matchingTours.length === 0) {
        console.log("\n⚠️ CRITICAL: No tours are linked to this site!");
        console.log("Sample tour sites:");
        allTours.slice(0, 3).forEach((t: any) => console.log(`- ${t.title}: ${JSON.stringify(t.sites)}`));
    } else {
        console.log("\nSample matching tours:");
        matchingTours.slice(0, 3).forEach((t: any) => console.log(`- ${t.title} (${t.slug.current})`));
    }
}

checkTours();
