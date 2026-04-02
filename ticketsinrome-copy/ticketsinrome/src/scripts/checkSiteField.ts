
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

async function checkSiteFields() {
    const tours = await client.fetch(`*[_type == "tour"]{title, site, sites}`);
    console.log(`Total Tours: ${tours.length}`);

    let withSite = 0;
    let withSites = 0;
    let withoutAny = 0;

    tours.forEach((t: any) => {
        if (t.site) withSite++;
        if (t.sites && t.sites.length > 0) withSites++;
        if (!t.site && (!t.sites || t.sites.length === 0)) withoutAny++;
    });

    console.log(`With 'site' (Old): ${withSite}`);
    console.log(`With 'sites' (New): ${withSites}`);
    console.log(`Orphans (No Site): ${withoutAny}`);

    if (withoutAny > 0) {
        console.log('\nOrphans Samples:');
        tours.filter((t: any) => !t.site && (!t.sites || t.sites.length === 0))
            .slice(0, 5)
            .forEach((t: any) => console.log(`- ${t.title}`));
    }
}

checkSiteFields();
