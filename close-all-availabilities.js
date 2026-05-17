#!/usr/bin/env node

/**
 * Close All Availabilities Script
 * 
 * This script sets all inventory slots to 0 available slots for WondersOfRome
 * 
 * Usage:
 *   node close-all-availabilities.js
 */

const PAYLOAD_URL = process.env.PAYLOAD_API_URL || 'https://admin.wondersofrome.com';
const EMAIL = process.env.PAYLOAD_API_EMAIL || 'superadmin@romeagency.com';
const PASSWORD = process.env.PAYLOAD_API_PASSWORD || 'SuperAdmin2025!';
const SITE_ID = 'wondersofrome';

async function closeAllAvailabilities() {
  console.log('🔒 Closing all availabilities for WondersOfRome...\n');

  try {
    // Step 1: Login to Payload
    console.log('1️⃣ Authenticating with Payload CMS...');
    const loginRes = await fetch(`${PAYLOAD_URL}/api/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
    });

    if (!loginRes.ok) {
      throw new Error(`Login failed: ${loginRes.status} ${loginRes.statusText}`);
    }

    const { token } = await loginRes.json();
    console.log('✅ Authenticated successfully\n');

    // Step 2: Get all inventory slots for wondersofrome
    console.log('2️⃣ Fetching all inventory slots...');
    const inventoryRes = await fetch(
      `${PAYLOAD_URL}/api/inventory?where[tenant][equals]=${SITE_ID}&limit=1000&depth=0`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!inventoryRes.ok) {
      throw new Error(`Failed to fetch inventory: ${inventoryRes.status}`);
    }

    const inventoryData = await inventoryRes.json();
    const slots = inventoryData.docs || [];
    
    console.log(`✅ Found ${slots.length} inventory slots\n`);

    if (slots.length === 0) {
      console.log('ℹ️  No inventory slots found. Nothing to close.');
      return;
    }

    // Step 3: Close all slots (set availableSlots to 0)
    console.log('3️⃣ Closing all slots...');
    let closedCount = 0;
    let alreadyClosedCount = 0;
    let errorCount = 0;

    for (const slot of slots) {
      try {
        if (slot.availableSlots === 0) {
          alreadyClosedCount++;
          process.stdout.write('.');
          continue;
        }

        const updateRes = await fetch(`${PAYLOAD_URL}/api/inventory/${slot.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ availableSlots: 0 }),
        });

        if (updateRes.ok) {
          closedCount++;
          process.stdout.write('✓');
        } else {
          errorCount++;
          process.stdout.write('✗');
        }
      } catch (err) {
        errorCount++;
        process.stdout.write('✗');
      }
    }

    console.log('\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 SUMMARY');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Total slots:          ${slots.length}`);
    console.log(`✅ Closed:            ${closedCount}`);
    console.log(`ℹ️  Already closed:   ${alreadyClosedCount}`);
    console.log(`❌ Errors:            ${errorCount}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    if (closedCount > 0) {
      console.log('✅ All availabilities have been closed successfully!');
      console.log('ℹ️  No new bookings can be made until you reopen slots.\n');
    } else if (alreadyClosedCount === slots.length) {
      console.log('ℹ️  All slots were already closed. No changes made.\n');
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('\nPlease check:');
    console.error('1. Payload CMS is accessible at:', PAYLOAD_URL);
    console.error('2. Credentials are correct');
    console.error('3. Network connection is stable\n');
    process.exit(1);
  }
}

// Run the script
closeAllAvailabilities();
