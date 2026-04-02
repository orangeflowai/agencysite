
import { createClient } from 'next-sanity'
import * as dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'

dotenv.config({ path: path.resolve(process.cwd(), '.env') })

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    token: process.env.SANITY_API_TOKEN,
    useCdn: false,
    apiVersion: '2024-01-01',
})

async function check() {
    // 1. Read local products.json
    const jsonPath = path.resolve(process.cwd(), 'products.json');
    const productsRaw = fs.readFileSync(jsonPath, 'utf8');
    const localProducts = JSON.parse(productsRaw);
    console.log(`\n📦 Local products.json count: ${localProducts.length}`);

    // 2. Fetch from Sanity
    const allTours = await client.fetch(`*[_type == "tour"]{title, _id, "slug": slug.current}`);

    // Filter published and drafts
    const published = allTours.filter((t: any) => !t._id.startsWith('drafts.'));
    const drafts = allTours.filter((t: any) => t._id.startsWith('drafts.'));

    console.log(`\n☁️  Sanity DB Total: ${allTours.length}`);
    console.log(`   ✅ Published: ${published.length}`);
    console.log(`   📝 Drafts: ${drafts.length}`);

    // 3. Compare content
    const localTitles = new Set(localProducts.map((p: any) => p.tour_title));
    const remoteTitles = new Set(published.map((t: any) => t.title));

    console.log(`\n------------- REMOTE TITLES (${published.length}) -------------`);
    published.forEach((t: any) => console.log(`   - ${t.title}`));

    const missingInRemote = [...localTitles].filter(x => !remoteTitles.has(x));
    const extraInRemote = [...remoteTitles].filter(x => !localTitles.has(x));

    if (missingInRemote.length > 0) {
        console.log(`\n❌ Missing in Sanity (Published) - Present locally but not in DB:`);
        missingInRemote.forEach(t => console.log(`   - ${t}`));
    } else {
        console.log(`\n✅ All local products are present in Sanity.`);
    }

    if (extraInRemote.length > 0) {
        console.log(`\n⚠️  Extra in Sanity - Present in DB but not locally:`);
        extraInRemote.forEach(t => console.log(`   - ${t}`));
    }
}

check();
