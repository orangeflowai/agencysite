#!/usr/bin/env node

/**
 * Test Tour Creation - Debug Script
 * Tests creating a single tour to see what fields are required
 */

const PAYLOAD_URL = process.env.PAYLOAD_API_URL || 'https://admin.wondersofrome.com';
const EMAIL = process.env.PAYLOAD_API_EMAIL || 'superadmin@romeagency.com';
const PASSWORD = process.env.PAYLOAD_API_PASSWORD || 'SuperAdmin2025!';
const SITE_ID = 'wondersofrome';

async function testTourCreation() {
  console.log('🧪 Testing Tour Creation...\n');

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

    // Step 2: Get one existing tour to see its structure
    console.log('2️⃣ Fetching existing tour...');
    const toursRes = await fetch(
      `${PAYLOAD_URL}/api/tours?where[tenant][equals]=${SITE_ID}&limit=1&depth=0`,
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

    console.log('✅ Found existing tour\n');
    console.log('📋 Existing tour structure:');
    console.log(JSON.stringify(existingTour, null, 2));
    console.log('\n');

    // Step 3: Try to create a minimal test tour
    console.log('3️⃣ Creating test tour...');
    
    const testTour = {
      tenant: SITE_ID,
      title: 'TEST Tour - Delete Me',
      slug: 'test-tour-delete-me-' + Date.now(),
      description: 'This is a test tour. Please delete.',
      price: 50,
      category: 'vatican',
      duration: '3 hours',
    };

    console.log('📤 Sending payload:');
    console.log(JSON.stringify(testTour, null, 2));
    console.log('\n');

    const createRes = await fetch(`${PAYLOAD_URL}/api/tours`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(testTour),
    });

    console.log(`📥 Response status: ${createRes.status}\n`);

    const responseText = await createRes.text();
    
    if (createRes.ok) {
      console.log('✅ SUCCESS! Tour created:');
      const result = JSON.parse(responseText);
      console.log(JSON.stringify(result, null, 2));
      console.log('\n');
      console.log('🗑️  Please delete this test tour from admin panel');
    } else {
      console.log('❌ FAILED! Error response:');
      console.log(responseText);
      console.log('\n');
      
      try {
        const errorJson = JSON.parse(responseText);
        console.log('📋 Parsed error:');
        console.log(JSON.stringify(errorJson, null, 2));
        
        if (errorJson.errors) {
          console.log('\n🔍 Error details:');
          errorJson.errors.forEach((err, idx) => {
            console.log(`\nError ${idx + 1}:`);
            console.log(`  Message: ${err.message}`);
            console.log(`  Field: ${err.field || 'N/A'}`);
            console.log(`  Data: ${JSON.stringify(err.data || {})}`);
          });
        }
      } catch (e) {
        console.log('(Could not parse error as JSON)');
      }
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run the script
testTourCreation();
