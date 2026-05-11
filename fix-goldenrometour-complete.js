const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'aknmkkwd',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: 'skFBTe2s38Bz1MltanZf6ftSHyH3gVcK5EFRVuy3TOnzurb3ZyUQqip51aJWHC6cMfIkZu7F0u1J1iUii479jJLXzBgyQUODLzXISOD5RRuM94D99H6C4vPsNbAdmMTPcL0JhJbFhBO9NNl8WLGabR4NXpEWQETI2iKTi5gFDtXD65gcBw1e',
  useCdn: false
});

async function fixGoldenRomeTour() {
  console.log('🔧 Fixing Golden Rome Tour site...\n');
  
  // Step 1: Check current site document
  console.log('1️⃣ Checking current site document...');
  const currentSite = await client.fetch(`*[_type == "site" && slug.current == "goldenrometour"][0]`);
  
  if (currentSite) {
    console.log(`Found site: ${currentSite.title || currentSite.name || 'Unnamed'}`);
    console.log(`Current _id: ${currentSite._id}`);
    console.log(`Has isActive: ${currentSite.isActive !== undefined}`);
    console.log(`Has title: ${currentSite.title !== undefined}`);
  } else {
    console.log('❌ Site not found!');
    return;
  }
  
  // Step 2: Update site document to add missing fields
  console.log('\n2️⃣ Updating site document...');
  await client
    .patch(currentSite._id)
    .set({ 
      isActive: true,
      title: 'Golden Rome Tour'
    })
    .commit();
  console.log('✅ Site document updated\n');
  
  // Step 3: Get all tours (all categories for Golden Rome Tour)
  console.log('3️⃣ Finding tours to link...');
  const allTours = await client.fetch(`
    *[_type == "tour"]{
      _id,
      title,
      category,
      sites
    }
  `);
  
  console.log(`Found ${allTours.length} total tours\n`);
  
  // Step 4: Link tours to Golden Rome Tour site
  console.log('4️⃣ Linking tours to Golden Rome Tour...');
  let linkedCount = 0;
  let skippedCount = 0;
  
  for (const tour of allTours) {
    // Check if already linked
    const alreadyLinked = tour.sites && tour.sites.some(s => s._ref === currentSite._id);
    
    if (!alreadyLinked) {
      const existingSites = tour.sites || [];
      await client
        .patch(tour._id)
        .set({
          sites: [
            ...existingSites,
            { _type: 'reference', _ref: currentSite._id }
          ]
        })
        .commit();
      linkedCount++;
      if (linkedCount <= 10) {
        console.log(`  ✅ Linked: ${tour.title} (${tour.category})`);
      }
    } else {
      skippedCount++;
    }
  }
  
  if (linkedCount > 10) {
    console.log(`  ... and ${linkedCount - 10} more tours`);
  }
  console.log(`\n✅ Linked ${linkedCount} tours, skipped ${skippedCount} already linked\n`);
  
  // Verify
  console.log('5️⃣ Verifying...\n');
  const site = await client.fetch(`*[_type == "site" && slug.current == "goldenrometour"][0]{ _id, title, slug, isActive }`);
  console.log('📋 Site:', site);
  
  const linkedTours = await client.fetch(`
    *[_type == "tour" && $siteRef in sites[]._ref]{
      _id,
      title,
      category,
      price
    }
  `, { siteRef: site._id });
  
  console.log(`\n🎫 Tours linked to Golden Rome Tour: ${linkedTours.length}`);
  
  // Group by category
  const byCategory = {};
  linkedTours.forEach(t => {
    if (!byCategory[t.category]) byCategory[t.category] = [];
    byCategory[t.category].push(t);
  });
  
  console.log('\n📊 Tours by category:');
  Object.keys(byCategory).sort().forEach(cat => {
    console.log(`  ${cat}: ${byCategory[cat].length} tours`);
  });
}

fixGoldenRomeTour().catch(console.error);
