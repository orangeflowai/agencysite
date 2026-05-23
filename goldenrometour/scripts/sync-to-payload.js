const { createClient } = require('@sanity/client');

const sanityClient = createClient({
  projectId: 'gycprksj',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
});

const PAYLOAD_URL = 'https://admin.wondersofrome.com';
const PAYLOAD_EMAIL = 'superadmin@romeagency.com';
const PAYLOAD_PASSWORD = 'SuperAdmin2025!';
const TENANT = 'goldenrometour';

async function loginToPayload() {
  const response = await fetch(`${PAYLOAD_URL}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: PAYLOAD_EMAIL,
      password: PAYLOAD_PASSWORD,
    }),
  });

  if (!response.ok) {
    throw new Error(`Login failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data.token;
}

async function syncToursToPayload() {
  try {
    console.log('\n🔐 Logging in to Payload...');
    const token = await loginToPayload();
    console.log('✅ Logged in successfully\n');

    console.log('📥 Fetching tours from Sanity...');
    const tours = await sanityClient.fetch(`
      *[_type == "tour"]{
        _id,
        title,
        "slug": slug.current,
        price,
        duration,
        description,
        category,
        "mainImage": mainImage.asset->url,
        highlights,
        includes,
        excludes,
        importantInfo,
        itinerary,
        meetingPoint,
        groupSize,
        maxParticipants,
        guestTypes,
        rating,
        reviewCount
      }
    `);

    console.log(`✅ Found ${tours.length} tours in Sanity\n`);

    for (const tour of tours) {
      console.log(`📤 Syncing: ${tour.title}`);

      // Check if tour already exists in Payload
      const checkResponse = await fetch(
        `${PAYLOAD_URL}/api/tours?where[slug][equals]=${encodeURIComponent(tour.slug)}&where[tenant][equals]=${TENANT}`,
        {
          headers: {
            'Authorization': `JWT ${token}`,
          },
        }
      );

      const existing = await checkResponse.json();
      const existingTour = existing.docs?.[0];

      const tourData = {
        title: tour.title,
        slug: tour.slug,
        productCode: tour._id,
        price: tour.price || 0,
        duration: tour.duration || '3 hours',
        description: typeof tour.description === 'string' ? tour.description : 'Vatican tour',
        category: tour.category || 'vatican',
        highlights: tour.highlights || [],
        includes: tour.includes || [],
        excludes: tour.excludes || [],
        importantInfo: tour.importantInfo || [],
        itinerary: tour.itinerary || [],
        meetingPoint: tour.meetingPoint || 'Vatican Museums entrance',
        groupSize: tour.groupSize || 'Small group',
        maxParticipants: tour.maxParticipants || 15,
        guestTypes: tour.guestTypes || [
          { name: 'Adult', price: tour.price, description: 'Age 18+' },
          { name: 'Student', price: Math.round(tour.price * 0.85), description: 'ID Required' },
          { name: 'Youth', price: Math.round(tour.price * 0.70), description: 'Under 18' },
          { name: 'Child', price: Math.round(tour.price * 0.50), description: 'Under 8' },
        ],
        rating: tour.rating || 4.9,
        reviewCount: tour.reviewCount || 100,
        tenant: TENANT,
        status: 'active',
      };

      let response;
      if (existingTour) {
        // Update existing tour
        response = await fetch(`${PAYLOAD_URL}/api/tours/${existingTour.id}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `JWT ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(tourData),
        });
        console.log(`   ✅ Updated in Payload`);
      } else {
        // Create new tour
        response = await fetch(`${PAYLOAD_URL}/api/tours`, {
          method: 'POST',
          headers: {
            'Authorization': `JWT ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(tourData),
        });
        console.log(`   ✅ Created in Payload`);
      }

      if (!response.ok) {
        const error = await response.text();
        console.log(`   ❌ Failed: ${error}`);
      }
    }

    console.log('\n✅ Sync complete!\n');
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

syncToursToPayload();
