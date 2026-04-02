
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

async function createSite() {
    console.log("🚀 Creating 'Tickets in Rome' Site Document...");

    const siteId = 'tickets-in-rome-site'; // Stable ID
    const siteDoc = {
        _id: siteId,
        _type: 'site',
        title: 'Tickets in Rome',
        slug: { _type: 'slug', current: 'ticketsinrome' },
        isActive: true,
        domain: 'https://ticketsinrome.com'
    };

    try {
        const result = await client.createOrReplace(siteDoc);
        console.log(`✅ Site Created: ${result.title} [ID: ${result._id}]`);
    } catch (err) {
        console.error("❌ Failed to create site:", err);
    }
}

createSite();
