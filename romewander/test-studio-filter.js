const { createClient } = require('next-sanity');

const client = createClient({
  projectId: 'siu133x5',
  dataset: 'tours',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: 'skKwRBbCf5jMSEP7T5ll31b7TmZNMQhFH7LkRh7xNQCwKTsU6OmE975ulyM9EgwQEdgupnJJsze27giLK86x9EFm0hNrF4PwEIPlM1xFlPUmLFxEQ036PBQ9Ho0YT75HTmqVdQcgRCuFLVnQrSNkDL8uHgFq9OYFDwDnmRobVdwir16QCvIb'
});

async function testFilters() {
  console.log('Testing different filter variations...\n');
  
  // Filter 1: Studio filter
  try {
    const filter1 = `*[_type == "tour" && $siteId in sites[]._ref]`;
    const tours1 = await client.fetch(filter1, { siteId: 'romewander' });
    console.log('1. Studio filter ($siteId in sites[]._ref):', tours1?.length || 0, 'tours');
  } catch (e) {
    console.log('1. Studio filter ERROR:', e.message);
  }
  
  // Filter 2: Service filter
  try {
    const filter2 = `*[_type == "tour" && $siteRef in sites[]._ref]`;
    const tours2 = await client.fetch(filter2, { siteRef: 'romewander' });
    console.log('2. Service filter ($siteRef in sites[]._ref):', tours2?.length || 0, 'tours');
  } catch (e) {
    console.log('2. Service filter ERROR:', e.message);
  }
  
  // Filter 3: Check actual structure
  try {
    const filter3 = `*[_type == "tour"][0...3]{_id, title, sites}`;
    const tours3 = await client.fetch(filter3);
    console.log('\n3. Sample tour structures:');
    tours3.forEach(tour => {
      console.log(`\n   ${tour.title}`);
      console.log('   sites:', JSON.stringify(tour.sites, null, 6));
    });
  } catch (e) {
    console.log('3. Structure check ERROR:', e.message);
  }
}

testFilters().catch(console.error);
