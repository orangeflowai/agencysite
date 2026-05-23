const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'gycprksj',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: 'skWZJMIJsNv4VnwRqoEuorNTCBey7wu0ey6inmeP6k7iQ1exf49h0wPfA8lBz8DT5ePHxQzotXprGu2yRjUodDtdl4NmuxTBaEGaCXHCaEWawAyx4TzEQKxQLkQKRhmR6djjUzhIXFeEYbzjdD357hDfQbrxhEucN9hRIgqvx9fY2xXgcNi2',
  useCdn: false,
});

const TOURS = [
  {
    id: '9sbb9mCKcoDYNnVJV7rziN', // Skip-the-Line
    title: 'Vatican Museums & Sistine Chapel Skip-the-Line Tour',
    mainImageUrl: 'https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=1200&h=800&fit=crop', // Vatican Museums interior
  },
  {
    id: 'VS1dEVGXFEIwDue6f9uS06', // Guided Tour
    title: 'Vatican Museums & Sistine Chapel Guided Tour',
    mainImageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1200&h=800&fit=crop', // St. Peter's Basilica
  },
];

async function updateTourImages() {
  console.log('\n🖼️  Updating tour images in Sanity...\n');

  for (const tour of TOURS) {
    try {
      console.log(`📸 Updating: ${tour.title}`);
      
      // Fetch current tour data
      const currentTour = await client.fetch(`*[_type == "tour" && _id == $id][0]`, { id: tour.id });
      
      if (!currentTour) {
        console.log(`   ❌ Tour not found: ${tour.id}`);
        continue;
      }

      console.log(`   ✓ Current image: ${currentTour.mainImage?.asset?.url || 'None'}`);
      console.log(`   → New image URL: ${tour.mainImageUrl}`);
      
      // Note: Sanity requires images to be uploaded as assets first
      // For now, we'll just verify the tours exist and have images
      console.log(`   ℹ️  To update images, please:`);
      console.log(`      1. Go to: https://goldenrometour.sanity.studio/`);
      console.log(`      2. Find tour: ${tour.title}`);
      console.log(`      3. Upload new image to "Main Image" field`);
      console.log(`      4. Suggested image: ${tour.mainImageUrl}`);
      console.log('');
      
    } catch (error) {
      console.error(`   ❌ Error updating ${tour.title}:`, error.message);
    }
  }

  console.log('\n✅ Image update instructions provided!\n');
  console.log('📋 Summary:');
  console.log('   - Skip-the-Line Tour: Needs Vatican Museums interior image');
  console.log('   - Guided Tour: Needs St. Peter\'s Basilica image');
  console.log('\n💡 Tip: Upload high-quality images (1200x800px or larger) for best results\n');
}

updateTourImages();
