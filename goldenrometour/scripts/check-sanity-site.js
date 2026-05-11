
const { createClient } = require('@sanity/client');

const client = createClient({
    projectId: 'aknmkkwd',
    dataset: 'production',
    apiVersion: '2024-01-01',
    useCdn: false,
});

async function checkSanitySite() {
    console.log('🔍 Checking Sanity site assignment...\n');
    
    const siteQuery = `*[_type == "site" && slug.current == "goldenrometour"][0]{ _id, title }`;
    const site = await client.fetch(siteQuery);
    
    if (!site) {
        console.log('❌ Site "goldenrometour" NOT found in Sanity');
        return;
    }
    
    console.log(`✅ Site found: ${site.title} (${site._id})`);
    
    const toursQuery = `*[_type == "tour" && category == "vatican" && $siteId in sites[]._ref]{
        _id,
        title,
        slug
    }`;
    
    const tours = await client.fetch(toursQuery, { siteId: site._id });
    console.log(`Total Vatican tours assigned to ${site.title} in Sanity: ${tours.length}`);
    tours.forEach(t => console.log(`- ${t.title}`));
}

checkSanitySite();
