const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'gycprksj',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: 'skxMygHyPvOtvJ09PlCYpaqDmx6jFStRyF5VsKOKFLmIGTQO0TMo6XlOHfCHcnCslGJfkCNQIjCyKway6H2uEvxMV9tnF0659Zj7zluXg6C6UdK5UxbrXPF5d6UwIys88dxEsmPPuCCFuL0LYICf7yaQrwnD40q6K7plxqQflqH5YevcVHA1',
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
