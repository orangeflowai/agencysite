const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'gycprksj',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true, // Use CDN for public read access
});

async function listTours() {
  try {
    const tours = await client.fetch('*[_type == "tour"]{_id, title, "slug": slug.current, category} | order(title asc)');
    console.log(`\nFound ${tours.length} tours:\n`);
    tours.forEach((tour, index) => {
      console.log(`${index + 1}. ${tour.title}`);
      console.log(`   ID: ${tour._id}`);
      console.log(`   Slug: ${tour.slug}`);
      console.log(`   Category: ${tour.category || 'N/A'}`);
      console.log('');
    });
  } catch (error) {
    console.error('Error fetching tours:', error);
  }
}

listTours();
