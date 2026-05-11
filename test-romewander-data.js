const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'aknmkkwd',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: 'skFBTe2s38Bz1MltanZf6ftSHyH3gVcK5EFRVuy3TOnzurb3ZyUQqip51aJWHC6cMfIkZu7F0u1J1iUii479jJLXzBgyQUODLzXISOD5RRuM94D99H6C4vPsNbAdmMTPcL0JhJbFhBO9NNl8WLGabR4NXpEWQETI2iKTi5gFDtXD65gcBw1e',
  useCdn: false
});

async function testRomeWanderData() {
  console.log('🧪 Testing Rome Wander Data Fetching\n');
  console.log('=' .repeat(60) + '\n');
  
  // Test 1: Get site by slug (exactly as the app does)
  console.log('TEST 1: Get site by slug "romewander"');
  console.log('-'.repeat(60));
  const siteQuery = `*[_type == "site" && slug.current == $siteId && isActive == true][0]{
    _id,
    title,
    slug,
    domain,
    isActive
  }`;
  const site = await client.fetch(siteQuery, { siteId: 'romewander' });
  console.log('Result:', site);
  console.log(site ? '✅ PASS' : '❌ FAIL');
  console.log('');
  
  if (!site) {
    console.log('❌ Site not found! Cannot continue tests.');
    return;
  }
  
  // Test 2: Get tours for this site (exactly as the app does)
  console.log('TEST 2: Get tours for Rome Wander');
  console.log('-'.repeat(60));
  const toursQuery = `*[_type == "tour" && $siteRef in sites[]._ref]{
    _id,
    title,
    slug,
    price,
    duration,
    category,
    badge
  }`;
  const tours = await client.fetch(toursQuery, { siteRef: site._id });
  console.log(`Found ${tours.length} tours`);
  if (tours.length > 0) {
    console.log('\nFirst 5 tours:');
    tours.slice(0, 5).forEach((t, i) => {
      console.log(`  ${i + 1}. ${t.title}`);
      console.log(`     Price: €${t.price} | Duration: ${t.duration} | Category: ${t.category}`);
    });
  }
  console.log(tours.length > 0 ? '✅ PASS' : '❌ FAIL');
  console.log('');
  
  // Test 3: Get a specific tour by slug
  console.log('TEST 3: Get specific tour by slug');
  console.log('-'.repeat(60));
  if (tours.length > 0) {
    const firstTourSlug = tours[0].slug.current;
    const tourQuery = `*[_type == "tour" && slug.current == $slug && $siteRef in sites[]._ref][0]{
      _id,
      title,
      slug,
      price,
      duration,
      category,
      "description": pt::text(description)
    }`;
    const tour = await client.fetch(tourQuery, { slug: firstTourSlug, siteRef: site._id });
    console.log(`Fetching tour: ${firstTourSlug}`);
    console.log('Result:', tour ? `Found: ${tour.title}` : 'Not found');
    console.log(tour ? '✅ PASS' : '❌ FAIL');
  } else {
    console.log('⏭️  SKIP (no tours to test)');
  }
  console.log('');
  
  // Summary
  console.log('=' .repeat(60));
  console.log('📊 SUMMARY');
  console.log('=' .repeat(60));
  console.log(`✅ Site found: ${site ? 'YES' : 'NO'}`);
  console.log(`✅ Tours found: ${tours.length}`);
  console.log(`✅ Data fetching: ${site && tours.length > 0 ? 'WORKING' : 'BROKEN'}`);
  console.log('');
  console.log('🚀 Next step: Start dev server and test in browser');
  console.log('   cd romewander && npm run dev');
}

testRomeWanderData().catch(console.error);
