const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'aknmkkwd',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: 'skFBTe2s38Bz1MltanZf6ftSHyH3gVcK5EFRVuy3TOnzurb3ZyUQqip51aJWHC6cMfIkZu7F0u1J1iUii479jJLXzBgyQUODLzXISOD5RRuM94D99H6C4vPsNbAdmMTPcL0JhJbFhBO9NNl8WLGabR4NXpEWQETI2iKTi5gFDtXD65gcBw1e',
  useCdn: false
});

async function checkSite() {
  console.log('🔍 Checking for Rome Wander site document...\n');
  
  // Check all sites
  const allSites = await client.fetch(`*[_type == "site"]{ _id, title, slug, isActive }`);
  console.log('📋 All sites in Sanity:');
  allSites.forEach(site => {
    console.log(`  - ${site.title} (${site.slug.current}) [${site.isActive ? 'ACTIVE' : 'INACTIVE'}] ID: ${site._id}`);
  });
  
  console.log('\n🔍 Looking for romewander specifically...');
  const romewanderSite = await client.fetch(`*[_type == "site" && slug.current == "romewander"][0]`);
  
  if (romewanderSite) {
    console.log('✅ Found Rome Wander site:');
    console.log(JSON.stringify(romewanderSite, null, 2));
  } else {
    console.log('❌ Rome Wander site NOT found!');
  }
  
  // Check tours with romewander tenant
  console.log('\n🎫 Checking tours...');
  const tours = await client.fetch(`*[_type == "tour"]{ _id, title, sites }`);
  console.log(`Total tours: ${tours.length}`);
  
  if (romewanderSite) {
    const romewanderTours = tours.filter(t => 
      t.sites && t.sites.some(s => s._ref === romewanderSite._id)
    );
    console.log(`Tours linked to Rome Wander: ${romewanderTours.length}`);
    romewanderTours.forEach(t => console.log(`  - ${t.title}`));
  }
}

checkSite().catch(console.error);
