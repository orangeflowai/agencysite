const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'gycprksj',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
});

const TOURS_TO_KEEP = [
  '9sbb9mCKcoDYNnVJV7rziN', // Vatican Museums & Sistine Chapel Skip-the-Line Tour
  'VS1dEVGXFEIwDue6f9uS06', // Vatican Museums & Sistine Chapel Guided Tour
];

async function verifyTours() {
  try {
    for (const tourId of TOURS_TO_KEEP) {
      const tour = await client.fetch(`*[_type == "tour" && _id == $tourId][0]{
        _id, title, "slug": slug.current, price, duration, category, description
      }`, { tourId });
      
      if (tour) {
        console.log('\n' + '='.repeat(80));
        console.log(`TOUR: ${tour.title}`);
        console.log('='.repeat(80));
        console.log(`ID: ${tour._id}`);
        console.log(`Slug: ${tour.slug}`);
        console.log(`Category: ${tour.category}`);
        console.log(`Price: €${tour.price}`);
        console.log(`Duration: ${tour.duration}`);
        console.log(`Description: ${tour.description ? 'Available' : 'N/A'}`);
      } else {
        console.log(`\n❌ Tour ${tourId} not found!`);
      }
    }
    console.log('\n');
  } catch (error) {
    console.error('Error:', error);
  }
}

verifyTours();
