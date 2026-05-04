const fetch = require('node-fetch');

const PAYLOAD_URL = 'https://admin.wondersofrome.com';
const EMAIL = 'superadmin@romeagency.com';
const PASSWORD = 'SuperAdmin2025!';

async function testPayloadImages() {
  try {
    // Login
    console.log('Logging in...');
    const loginRes = await fetch(`${PAYLOAD_URL}/api/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
    });
    const loginData = await loginRes.json();
    const token = loginData.token;
    console.log('✓ Logged in successfully\n');

    // Fetch tours with depth=1
    console.log('Fetching tours with depth=1...');
    const toursRes = await fetch(
      `${PAYLOAD_URL}/api/tours?where[tenant][equals]=wondersofrome&limit=3&depth=1`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    const toursData = await toursRes.json();
    
    console.log(`Found ${toursData.docs?.length || 0} tours\n`);
    
    // Check first 3 tours
    toursData.docs?.slice(0, 3).forEach((tour, i) => {
      console.log(`\n--- Tour ${i + 1}: ${tour.title} ---`);
      console.log(`Slug: ${tour.slug}`);
      console.log(`mainImage type: ${typeof tour.mainImage}`);
      console.log(`mainImage value:`, JSON.stringify(tour.mainImage, null, 2));
      console.log(`imageUrl: ${tour.imageUrl || 'not set'}`);
      
      // Check what URL would be resolved
      let resolvedUrl = undefined;
      if (tour.mainImage?.url) {
        resolvedUrl = tour.mainImage.url;
        console.log(`✓ Would use mainImage.url: ${resolvedUrl}`);
      } else if (tour.mainImage?.filename) {
        resolvedUrl = `${PAYLOAD_URL}/api/media/file/${tour.mainImage.filename}`;
        console.log(`✓ Would use mainImage.filename: ${resolvedUrl}`);
      } else if (tour.imageUrl) {
        resolvedUrl = tour.imageUrl;
        console.log(`✓ Would use imageUrl: ${resolvedUrl}`);
      } else {
        console.log(`✗ No image found!`);
      }
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testPayloadImages();
