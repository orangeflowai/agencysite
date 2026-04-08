
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

async function checkAll() {
    const tours = await client.fetch(`*[_type == "tour"]{title, _id}`);
    console.log(`Total Tours in DB: ${tours.length}`);
}
checkAll();
