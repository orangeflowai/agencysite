const fetch = require('node-fetch');

const PAYLOAD_URL = 'https://admin.wondersofrome.com';
const EMAIL = 'superadmin@romeagency.com';
const PASSWORD = 'SuperAdmin2025!';

async function checkPayloadMedia() {
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

    // Check media library
    console.log('Checking media library...');
    const mediaRes = await fetch(
      `${PAYLOAD_URL}/api/media?limit=5`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    const mediaData = await mediaRes.json();
    console.log(`Found ${mediaData.totalDocs} media files\n`);
    
    if (mediaData.docs?.length > 0) {
      console.log('First 3 media files:');
      mediaData.docs.slice(0, 3).forEach((media, i) => {
        console.log(`\n${i + 1}. ${media.filename}`);
        console.log(`   ID: ${media.id}`);
        console.log(`   URL: ${media.url || 'not set'}`);
        console.log(`   Alt: ${media.alt || 'not set'}`);
      });
    }

    // Check a specific tour's raw data
    console.log('\n\nChecking raw tour data...');
    const tourRes = await fetch(
      `${PAYLOAD_URL}/api/tours?where[slug][equals]=golden-pantheon-guided-tour&limit=1&depth=0`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    const tourData = await tourRes.json();
    
    if (tourData.docs?.[0]) {
      const tour = tourData.docs[0];
      console.log(`\nTour: ${tour.title}`);
      console.log(`mainImage field (raw):`, tour.mainImage);
      console.log(`mainImage type:`, typeof tour.mainImage);
      console.log(`imageUrl:`, tour.imageUrl);
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkPayloadMedia();
