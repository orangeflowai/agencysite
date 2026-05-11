
const { createClient } = require('@sanity/client');

const client = createClient({
    projectId: 'aknmkkwd',
    dataset: 'production',
    apiVersion: '2024-01-01',
    useCdn: false,
});

async function checkSanitySettings() {
    console.log('🔍 Checking Sanity site settings...\n');
    
    const query = `*[_type == "site" && slug.current == "goldenrometour"][0]{
        _id,
        title,
        slug,
        "metaTitle": seo.metaTitle,
        "metaDescription": seo.metaDescription,
        brandColors,
        logo { asset -> { url } }
    }`;
    
    const site = await client.fetch(query);
    if (site) {
        console.log('--- SANITY SITE SETTINGS ---');
        console.log(`Title: ${site.title}`);
        console.log(`Meta Title: ${site.metaTitle}`);
        console.log(`Meta Description: ${site.metaDescription}`);
        console.log(`Brand Colors:`, JSON.stringify(site.brandColors, null, 2));
        console.log(`Logo URL: ${site.logo?.asset?.url}`);
    } else {
        console.log('No site settings found in Sanity for goldenrometour.');
    }
}

checkSanitySettings();
