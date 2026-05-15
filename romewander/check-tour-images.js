const { createClient } = require('next-sanity');

const client = createClient({
  projectId: 'siu133x5',
  dataset: 'tours',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: 'skKwRBbCf5jMSEP7T5ll31b7TmZNMQhFH7LkRh7xNQCwKTsU6OmE975ulyM9EgwQEdgupnJJsze27giLK86x9EFm0hNrF4PwEIPlM1xFlPUmLFxEQ036PBQ9Ho0YT75HTmqVdQcgRCuFLVnQrSNkDL8uHgFq9OYFDwDnmRobVdwir16QCvIb'
});

async function checkImages() {
  const siteId = 'romewander';
  
  // Get site ref
  const site = await client.fetch(`*[_type == "site" && slug.current == $slug][0]{ _id }`, { slug: siteId });
  
  if (!site) {
    console.log('Site not found!');
    return;
  }
  
  // Fetch all tours with image info
  const tours = await client.fetch(`*[_type == "tour" && $siteRef in sites[]._ref]{
    _id,
    title,
    slug,
    mainImage {
      asset -> {
        _id,
        url
      }
    },
    gallery[] {
      asset -> {
        _id,
        url
      }
    }
  }`, { siteRef: site._id });
  
  console.log(`Found ${tours.length} tours for romewander\n`);
  
  tours.forEach(tour => {
    console.log(`\n${tour.title} (${tour.slug.current})`);
    console.log(`  mainImage: ${tour.mainImage ? (tour.mainImage.asset?.url ? 'YES' : 'NO URL') : 'MISSING'}`);
    console.log(`  gallery: ${tour.gallery?.length || 0} images`);
    if (tour.mainImage?.asset?.url) {
      console.log(`  URL: ${tour.mainImage.asset.url}`);
    }
  });
}

checkImages().catch(console.error);
