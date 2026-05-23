const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'gycprksj',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: 'skWZJMIJsNv4VnwRqoEuorNTCBey7wu0ey6inmeP6k7iQ1exf49h0wPfA8lBz8DT5ePHxQzotXprGu2yRjUodDtdl4NmuxTBaEGaCXHCaEWawAyx4TzEQKxQLkQKRhmR6djjUzhIXFeEYbzjdD357hDfQbrxhEucN9hRIgqvx9fY2xXgcNi2',
  useCdn: false,
});

// Tours to KEEP (based on user requirements)
const TOURS_TO_KEEP = [
  '9sbb9mCKcoDYNnVJV7rziN', // Vatican Museums & Sistine Chapel Skip-the-Line Tour
  'VS1dEVGXFEIwDue6f9uS06', // Vatican Museums & Sistine Chapel Guided Tour
];

async function deleteTours() {
  try {
    // Fetch all tours
    const tours = await client.fetch('*[_type == "tour"]{_id, title, "slug": slug.current}');
    console.log(`\nFound ${tours.length} tours total\n`);
    
    // Filter tours to delete (all except the 2 we want to keep)
    const toursToDelete = tours.filter(tour => !TOURS_TO_KEEP.includes(tour._id));
    
    console.log(`Keeping ${TOURS_TO_KEEP.length} tours:`);
    tours.filter(t => TOURS_TO_KEEP.includes(t._id)).forEach(tour => {
      console.log(`  ✓ ${tour.title}`);
    });
    
    console.log(`\nDeleting ${toursToDelete.length} tours:\n`);
    
    // Delete tours one by one
    for (const tour of toursToDelete) {
      try {
        await client.delete(tour._id);
        console.log(`  ✓ Deleted: ${tour.title}`);
      } catch (error) {
        console.error(`  ✗ Failed to delete ${tour.title}:`, error.message);
      }
    }
    
    console.log(`\n✅ Deletion complete! ${toursToDelete.length} tours removed.`);
    console.log(`✅ ${TOURS_TO_KEEP.length} tours remaining.\n`);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

deleteTours();
