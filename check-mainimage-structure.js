const fetch = require('node-fetch');

const PAYLOAD_URL = 'https://admin.wondersofrome.com';
const PAYLOAD_EMAIL = 'superadmin@romeagency.com';
const PAYLOAD_PASSWORD = 'SuperAdmin2025!';

async function checkMainImageStructure() {
  try {
    // Login
    const loginRes = await fetch(`${PAYLOAD_URL}/api/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: PAYLOAD_EMAIL, password: PAYLOAD_PASSWORD }),
    });
    const loginData = await loginRes.json();
    const token = loginData.token;

    // Fetch a tour that has mainImage
    const res = await fetch(
      `${PAYLOAD_URL}/api/tours?where[slug][equals]=appian-way-catacombs&limit=1&depth=1`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    const data = await res.json();
    const tour = data.docs?.[0];

    if (tour) {
      console.log('Tour:', tour.title);
      console.log('\nmainImage structure:');
      console.log(JSON.stringify(tour.mainImage, null, 2));
      
      console.log('\n\nExpected URL resolution:');
      if (tour.mainImage?.url) {
        console.log(`✓ tour.mainImage.url: ${tour.mainImage.url}`);
      }
      if (tour.mainImage?.filename) {
        console.log(`✓ tour.mainImage.filename: ${tour.mainImage.filename}`);
        console.log(`  Full URL: ${PAYLOAD_URL}/api/media/file/${tour.mainImage.filename}`);
      }
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkMainImageStructure();
