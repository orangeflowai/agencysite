#!/usr/bin/env node

/**
 * Test Status Field - Find valid status values
 */

const PAYLOAD_URL = process.env.PAYLOAD_API_URL || 'https://admin.wondersofrome.com';
const EMAIL = process.env.PAYLOAD_API_EMAIL || 'superadmin@romeagency.com';
const PASSWORD = process.env.PAYLOAD_API_PASSWORD || 'SuperAdmin2025!';
const SITE_ID = 'wondersofrome';

async function testStatusField() {
  console.log('🔍 Testing Status Field Values...\n');

  try {
    // Login
    const loginRes = await fetch(`${PAYLOAD_URL}/api/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
    });

    const { token } = await loginRes.json();
    console.log('✅ Authenticated\n');

    // Test different status values
    const statusValues = [
      null,           // no status field
      'draft',        // common value
      'published',    // what we tried
      'active',       // alternative
      true,           // boolean
      'Draft',        // capitalized
      'Published',    // capitalized
    ];

    for (const statusValue of statusValues) {
      const payload = {
        tenant: SITE_ID,
        title: `Status Test: ${statusValue}`,
        slug: `status-test-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        description: 'Testing status field',
        price: 50,
        category: 'vatican',
        duration: '3 hours',
      };

      if (statusValue !== null) {
        payload.status = statusValue;
      }

      console.log(`📝 Testing status: ${JSON.stringify(statusValue)}`);

      const createRes = await fetch(`${PAYLOAD_URL}/api/tours`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (createRes.ok) {
        const result = await createRes.json();
        console.log(`   ✅ SUCCESS - Created with status: ${result.doc.status}`);
      } else {
        const errorText = await createRes.text();
        console.log(`   ❌ FAILED (${createRes.status})`);
        try {
          const errorJson = JSON.parse(errorText);
          if (errorJson.errors && errorJson.errors[0]) {
            console.log(`   Error: ${errorJson.errors[0].message}`);
          }
        } catch (e) {
          console.log(`   Error: ${errorText.substring(0, 100)}`);
        }
      }
      console.log('');

      await new Promise(resolve => setTimeout(resolve, 300));
    }

    console.log('✅ Test complete\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

testStatusField();
