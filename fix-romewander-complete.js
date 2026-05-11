const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'aknmkkwd',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: 'skFBTe2s38Bz1MltanZf6ftSHyH3gVcK5EFRVuy3TOnzurb3ZyUQqip51aJWHC6cMfIkZu7F0u1J1iUii479jJLXzBgyQUODLzXISOD5RRuM94D99H6C4vPsNbAdmMTPcL0JhJbFhBO9NNl8WLGabR4NXpEWQETI2iKTi5gFDtXD65gcBw1e',
  useCdn: false
});

async function fixRomeWander() {
  console.log('🔧 Fixing Rome Wander site and tours...\n');
  
  // Step 1: Fix the site document - add isActive field
  console.log('1️⃣ Updating site document to add isActive field...');
  await client
    .patch('site-romewander')
    .set({ 
      isActive: true,
      title: 'Rome Wander'  // Also add title field
    })
    .commit();
  console.log('✅ Site document updated\n');
  
  // Step 2: Get all Vatican tours (the 5 we created)
  console.log('2️⃣ Finding Vatican tours to link...');
  const vaticanTours = await client.fetch(`
    *[_type == "tour" && category == "vatican"]{
      _id,
      title,
      sites
    }
  `);
  
  console.log(`Found ${vaticanTours.length} Vatican tours\n`);
  
  // Step 3: Link tours to Rome Wander site
  console.log('3️⃣ Linking tours to Rome Wander...');
  for (const tour of vaticanTours) {
    // Check if already linked
    const alreadyLinked = tour.sites && tour.sites.some(s => s._ref === 'site-romewander');
    
    if (!alreadyLinked) {
      const existingSites = tour.sites || [];
      await client
        .patch(tour._id)
        .set({
          sites: [
            ...existingSites,
            { _type: 'reference', _ref: 'site-romewander' }
          ]
        })
        .commit();
      console.log(`  ✅ Linked: ${tour.title}`);
    } else {
      console.log(`  ⏭️  Already linked: ${tour.title}`);
    }
  }
  
  console.log('\n✅ All done! Verifying...\n');
  
  // Verify
  const site = await client.fetch(`*[_type == "site" && slug.current == "romewander"][0]{ _id, title, slug, isActive }`);
  console.log('📋 Site:', site);
  
  const linkedTours = await client.fetch(`
    *[_type == "tour" && "site-romewander" in sites[]._ref]{
      _id,
      title,
      category,
      price
    }
  `);
  console.log(`\n🎫 Tours linked to Rome Wander: ${linkedTours.length}`);
  linkedTours.forEach(t => console.log(`  - ${t.title} (${t.category}) - €${t.price}`));
}

fixRomeWander().catch(console.error);
