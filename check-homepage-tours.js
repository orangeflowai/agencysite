const fetch = require('node-fetch');

const PAYLOAD_URL = 'https://admin.wondersofrome.com';
const PAYLOAD_EMAIL = 'superadmin@romeagency.com';
const PAYLOAD_PASSWORD = 'SuperAdmin2025!';

const HOMEPAGE_SLUGS = [
  'vatican-museums-skip-line-audio-guide',
  'colosseum-arena-floor-underground',
  'classic-rome-hop-on-hop-off-bus-vatican-and-colosseum-skip-the-line',
  'classic-rome-hop-on-hop-off-colosseum',
  'golden-colosseum-underground-vip',
  'appian-way-catacombs',
  'colosseum-arena-roman-forum',
  'colosseum-underground-arena-private',
  'domus-aurea-nero-golden-house',
  'palatine-hill-sunrise-private',
];

async function checkHomepageTours() {
  try {
    // Login
    const loginRes = await fetch(`${PAYLOAD_URL}/api/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: PAYLOAD_EMAIL, password: PAYLOAD_PASSWORD }),
    });
    const loginData = await loginRes.json();
    const token = loginData.token;

    console.log('Checking homepage tours...\n');

    for (const slug of HOMEPAGE_SLUGS) {
      const res = await fetch(
        `${PAYLOAD_URL}/api/tours?where[slug][equals]=${slug}&limit=1&depth=1`,
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
        console.log(`${tour.title}`);
        console.log(`  Slug: ${slug}`);
        console.log(`  mainImage: ${tour.mainImage ? `✅ ID ${tour.mainImage}` : '❌ null'}`);
        console.log(`  imageUrl: ${tour.imageUrl ? tour.imageUrl.substring(0, 60) + '...' : 'none'}`);
        console.log('');
      }
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkHomepageTours();
