#!/usr/bin/env node

/**
 * Debug Tour Payload - Find the problematic field
 * Tests adding fields one by one to find which one causes the error
 */

const PAYLOAD_URL = process.env.PAYLOAD_API_URL || 'https://admin.wondersofrome.com';
const EMAIL = process.env.PAYLOAD_API_EMAIL || 'superadmin@romeagency.com';
const PASSWORD = process.env.PAYLOAD_API_PASSWORD || 'SuperAdmin2025!';
const SITE_ID = 'wondersofrome';

async function debugTourPayload() {
  console.log('🔍 Debugging Tour Payload...\n');

  try {
    // Step 1: Login
    console.log('1️⃣ Authenticating...');
    const loginRes = await fetch(`${PAYLOAD_URL}/api/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
    });

    if (!loginRes.ok) {
      throw new Error(`Login failed: ${loginRes.status}`);
    }

    const { token } = await loginRes.json();
    console.log('✅ Authenticated\n');

    // Step 2: Get one existing tour
    console.log('2️⃣ Fetching existing tour...');
    const toursRes = await fetch(
      `${PAYLOAD_URL}/api/tours?where[tenant][equals]=${SITE_ID}&where[category][equals]=vatican&limit=1&depth=0`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!toursRes.ok) {
      throw new Error(`Failed to fetch tours: ${toursRes.status}`);
    }

    const toursData = await toursRes.json();
    const existingTour = toursData.docs?.[0];

    if (!existingTour) {
      throw new Error('No existing tours found');
    }

    console.log('✅ Found existing tour:', existingTour.title);
    console.log('');

    // Step 3: Test progressively more complex payloads
    const tests = [
      {
        name: 'Minimal (known working)',
        payload: {
          tenant: SITE_ID,
          title: 'DEBUG Test 1 - Minimal',
          slug: 'debug-test-1-' + Date.now(),
          description: 'Test description',
          price: 50,
          category: 'vatican',
          duration: '3 hours',
        },
      },
      {
        name: 'With status=published',
        payload: {
          tenant: SITE_ID,
          title: 'DEBUG Test 2 - Status',
          slug: 'debug-test-2-' + Date.now(),
          description: 'Test description',
          price: 50,
          category: 'vatican',
          duration: '3 hours',
          status: 'published',
        },
      },
      {
        name: 'With groupSize',
        payload: {
          tenant: SITE_ID,
          title: 'DEBUG Test 3 - GroupSize',
          slug: 'debug-test-3-' + Date.now(),
          description: 'Test description',
          price: 50,
          category: 'vatican',
          duration: '3 hours',
          status: 'published',
          groupSize: 'Small Group (max 12)',
        },
      },
      {
        name: 'With highlights array',
        payload: {
          tenant: SITE_ID,
          title: 'DEBUG Test 4 - Highlights',
          slug: 'debug-test-4-' + Date.now(),
          description: 'Test description',
          price: 50,
          category: 'vatican',
          duration: '3 hours',
          status: 'published',
          highlights: [
            { item: 'Skip-the-line entry' },
            { item: 'Expert guide' },
          ],
        },
      },
      {
        name: 'With SEO nested object',
        payload: {
          tenant: SITE_ID,
          title: 'DEBUG Test 5 - SEO',
          slug: 'debug-test-5-' + Date.now(),
          description: 'Test description',
          price: 50,
          category: 'vatican',
          duration: '3 hours',
          status: 'published',
          seo: {
            title: 'SEO Title Test',
            description: 'SEO Description Test',
          },
        },
      },
      {
        name: 'With badge',
        payload: {
          tenant: SITE_ID,
          title: 'DEBUG Test 6 - Badge',
          slug: 'debug-test-6-' + Date.now(),
          description: 'Test description',
          price: 50,
          category: 'vatican',
          duration: '3 hours',
          status: 'published',
          badge: 'VIP',
        },
      },
      {
        name: 'With tags array',
        payload: {
          tenant: SITE_ID,
          title: 'DEBUG Test 7 - Tags',
          slug: 'debug-test-7-' + Date.now(),
          description: 'Test description',
          price: 50,
          category: 'vatican',
          duration: '3 hours',
          status: 'published',
          tags: ['vip', 'luxury', 'exclusive'],
        },
      },
      {
        name: 'With maxParticipants',
        payload: {
          tenant: SITE_ID,
          title: 'DEBUG Test 8 - MaxParticipants',
          slug: 'debug-test-8-' + Date.now(),
          description: 'Test description',
          price: 50,
          category: 'vatican',
          duration: '3 hours',
          status: 'published',
          maxParticipants: 12,
        },
      },
      {
        name: 'With rating and reviewCount',
        payload: {
          tenant: SITE_ID,
          title: 'DEBUG Test 9 - Rating',
          slug: 'debug-test-9-' + Date.now(),
          description: 'Test description',
          price: 50,
          category: 'vatican',
          duration: '3 hours',
          status: 'published',
          rating: 4.8,
          reviewCount: 120,
        },
      },
      {
        name: 'Full payload (like variation script)',
        payload: {
          tenant: SITE_ID,
          title: 'DEBUG Test 10 - Full',
          slug: 'debug-test-10-' + Date.now(),
          description: 'Test description with more detail',
          price: 89,
          category: 'vatican',
          duration: '3 hours',
          status: 'published',
          groupSize: 'Small Group (max 12)',
          highlights: [
            { item: 'Exclusive early morning access' },
            { item: 'Private small group' },
            { item: 'VIP skip-the-line entrance' },
          ],
          seo: {
            title: 'Full SEO Title',
            description: 'Full SEO Description',
          },
          badge: 'VIP',
          tags: ['vip', 'luxury', 'exclusive'],
          maxParticipants: 12,
          rating: 4.9,
          reviewCount: 150,
        },
      },
    ];

    console.log('3️⃣ Testing payloads...\n');

    for (const test of tests) {
      console.log(`📝 Test: ${test.name}`);
      console.log(`   Slug: ${test.payload.slug}`);

      const createRes = await fetch(`${PAYLOAD_URL}/api/tours`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(test.payload),
      });

      if (createRes.ok) {
        const result = await createRes.json();
        console.log(`   ✅ SUCCESS (ID: ${result.doc.id})`);
      } else {
        const errorText = await createRes.text();
        console.log(`   ❌ FAILED (${createRes.status})`);
        try {
          const errorJson = JSON.parse(errorText);
          if (errorJson.errors && errorJson.errors[0]) {
            console.log(`   Error: ${errorJson.errors[0].message}`);
            if (errorJson.errors[0].data) {
              console.log(`   Data: ${JSON.stringify(errorJson.errors[0].data)}`);
            }
          }
        } catch (e) {
          console.log(`   Error: ${errorText.substring(0, 100)}`);
        }
      }
      console.log('');

      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ DEBUG COMPLETE');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('🗑️  Please delete test tours from admin panel\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run the script
debugTourPayload();
