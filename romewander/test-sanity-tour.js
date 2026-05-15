const { createClient } = require('next-sanity');

const client = createClient({
  projectId: 'siu133x5',
  dataset: 'tours',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: 'skKwRBbCf5jMSEP7T5ll31b7TmZNMQhFH7LkRh7xNQCwKTsU6OmE975ulyM9EgwQEdgupnJJsze27giLK86x9EFm0hNrF4PwEIPlM1xFlPUmLFxEQ036PBQ9Ho0YT75HTmqVdQcgRCuFLVnQrSNkDL8uHgFq9OYFDwDnmRobVdwir16QCvIb'
});

async function testTourFetch() {
  const slug = 'vatican-museums-sistine-chapel-skip-line';
  const siteId = 'romewander';
  
  // Get site ref
  const siteQuery = `*[_type == "site" && slug.current == $slug][0]{ _id }`;
  const site = await client.fetch(siteQuery, { slug: siteId });
  console.log('Site ref:', site?._id);
  
  if (!site) {
    console.log('Site not found!');
    return;
  }
  
  // Try to fetch the tour
  const tourQuery = `*[_type == "tour" && slug.current == $slug && $siteRef in sites[]._ref][0]{
    ...,
    "features": highlights
  }`;
  
  const tour = await client.fetch(tourQuery, { slug, siteRef: site._id });
  console.log('\nTour found:', !!tour);
  if (tour) {
    console.log('Tour title:', tour.title);
    console.log('Tour has mainImage:', !!tour.mainImage);
    console.log('Tour has description:', !!tour.description);
    console.log('Tour price:', tour.price);
    console.log('Tour duration:', tour.duration);
    console.log('Tour highlights:', tour.highlights?.length || 0);
    console.log('Tour features:', tour.features?.length || 0);
    console.log('Tour itinerary:', tour.itinerary?.length || 0);
    console.log('Tour includes:', tour.includes?.length || 0);
    console.log('Tour meetingPoint:', tour.meetingPoint);
  } else {
    console.log('Tour not found!');
  }
}

testTourFetch().catch(console.error);
