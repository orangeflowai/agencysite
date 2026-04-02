
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

async function check() {
    const tours = await client.fetch(`*[_type == "tour"][0...5]{title, mainImage}`);
    console.log("Checking first 5 tours:");
    tours.forEach((t: any) => {
        console.log(`- ${t.title}: Has Image? ${!!t.mainImage}`);
    });
}
check();
