const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'aknmkkwd',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true
});

async function testFetch() {
  console.log('🧪 Testing Rome Wander Data Fetch (as the app does)\n');
  
  const siteId = 'romewander';
  
  // Step 1: Get site ref
  console.log('1️⃣ Getting site reference...');
  const siteQuery = `*[_type == "site" && slug.current == $slug][0]{ _id }`;
  const siteResult = await client.fetch(siteQuery, { slug: siteId });
  
  if (!siteResult) {
    console.log('❌ SITE NOT FOUND!');
    console.log('This is why you see "Site not found" error\n');
    
    // Debug: Check what sites exist
    const allSites = await client.fetch(`*[_type == "site"]{ _id, title, slug, isActive }`);
    console.log('Available sites:');
    allSites.forEach(s => console.log(`  - ${s.title} (${s.slug.current}) [${s.isActive ? 'ACTIVE' : 'INACTIVE'}]`));
    return;
  }
  
  console.log(`✅ Site found: ${siteResult._id}\n`);
  
  // Step 2: Get tours
  console.log('2️⃣ Getting tours...');
  const toursQuery = `*[_type == "tour" && $siteRef in sites[]._ref]{
    _id,
    title,
    slug,
    price,
    duration,
    category
  }`;
  
  const tours = await client.fetch(toursQuery, { siteRef: siteResult._id });
  console.log(`✅ Found ${tours.length} tours\n`);
  
  if (tours.length > 0) {
    console.log('Sample tours:');
    tours.slice(0, 5).forEach(t => console.log(`  - ${t.title} (€${t.price})`));
  }
}

testFetch().catch(console.error);
