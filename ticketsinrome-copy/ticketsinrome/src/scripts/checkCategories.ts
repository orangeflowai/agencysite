
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

async function checkCategories() {
    const tours = await client.fetch(`*[_type == "tour"]{title, category}`);

    console.log(`Total Tours: ${tours.length}`);

    const categories = new Set(tours.map((t: any) => t.category));
    console.log('\nDistinct Categories Found:');
    categories.forEach(c => console.log(`'${c}'`));

    console.log('\nSample mapping:');
    tours.slice(0, 5).forEach((t: any) => console.log(`${t.title} -> ${t.category}`));
}

checkCategories();
