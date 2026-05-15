const { createClient } = require('next-sanity');

const client = createClient({
  projectId: 'siu133x5',
  dataset: 'tours',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: 'skKwRBbCf5jMSEP7T5ll31b7TmZNMQhFH7LkRh7xNQCwKTsU6OmE975ulyM9EgwQEdgupnJJsze27giLK86x9EFm0hNrF4PwEIPlM1xFlPUmLFxEQ036PBQ9Ho0YT75HTmqVdQcgRCuFLVnQrSNkDL8uHgFq9OYFDwDnmRobVdwir16QCvIb'
});

async function checkImages() {
  // Check if there are any images in the Sanity media library
  const images = await client.fetch(`*[_type == "sanity.imageAsset"] | order(_createdAt desc) [0...10] {
    _id,
    url,
    originalFilename,
    metadata {
      dimensions
    }
  }`);
  
  console.log(`Found ${images.length} images in Sanity media library\n`);
  
  if (images.length > 0) {
    console.log('Sample images:');
    images.forEach((img, i) => {
      console.log(`${i + 1}. ${img.originalFilename || 'Unnamed'}`);
      console.log(`   URL: ${img.url}`);
      console.log(`   Dimensions: ${img.metadata?.dimensions?.width}x${img.metadata?.dimensions?.height}\n`);
    });
  } else {
    console.log('No images found in Sanity. You need to upload images first.');
  }
}

checkImages().catch(console.error);
