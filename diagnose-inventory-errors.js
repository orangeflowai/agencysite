#!/usr/bin/env node

/**
 * Diagnose Inventory Errors Script
 * 
 * This script checks which inventory slots failed to close and why
 */

const PAYLOAD_URL = process.env.PAYLOAD_API_URL || 'https://admin.wondersofrome.com';
const EMAIL = process.env.PAYLOAD_API_EMAIL || 'superadmin@romeagency.com';
const PASSWORD = process.env.PAYLOAD_API_PASSWORD || 'SuperAdmin2025!';
const SITE_ID = 'wondersofrome';

async function diagnoseErrors() {
  console.log('🔍 Diagnosing inventory errors...\n');

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

    // Step 2: Get all inventory slots
    console.log('2️⃣ Fetching all inventory slots...');
    const inventoryRes = await fetch(
      `${PAYLOAD_URL}/api/inventory?where[tenant][equals]=${SITE_ID}&limit=1000&depth=1`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!inventoryRes.ok) {
      throw new Error(`Failed to fetch inventory: ${inventoryRes.status}`);
    }

    const inventoryData = await inventoryRes.json();
    const slots = inventoryData.docs || [];
    
    console.log(`✅ Found ${slots.length} slots\n`);

    // Step 3: Analyze slots
    console.log('3️⃣ Analyzing slots...\n');

    const openSlots = slots.filter(s => s.availableSlots > 0);
    const closedSlots = slots.filter(s => s.availableSlots === 0);
    const invalidSlots = slots.filter(s => !s.id || !s.tour);
    const missingTourSlots = slots.filter(s => !s.tour);
    const missingDateSlots = slots.filter(s => !s.date);

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 INVENTORY ANALYSIS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Total slots:              ${slots.length}`);
    console.log(`✅ Closed (available=0):  ${closedSlots.length}`);
    console.log(`🔓 Open (available>0):    ${openSlots.length}`);
    console.log(`❌ Invalid slots:         ${invalidSlots.length}`);
    console.log(`⚠️  Missing tour:         ${missingTourSlots.length}`);
    console.log(`⚠️  Missing date:         ${missingDateSlots.length}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Step 4: Show problematic slots
    if (openSlots.length > 0) {
      console.log('🔓 OPEN SLOTS (Still have availability):');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      openSlots.slice(0, 10).forEach(slot => {
        const tourTitle = slot.tour?.title || 'Unknown Tour';
        const date = slot.date ? new Date(slot.date).toISOString().split('T')[0] : 'No date';
        console.log(`ID: ${slot.id}`);
        console.log(`  Tour: ${tourTitle}`);
        console.log(`  Date: ${date}`);
        console.log(`  Time: ${slot.time || 'No time'}`);
        console.log(`  Available: ${slot.availableSlots}/${slot.totalSlots || 'N/A'}`);
        console.log('');
      });
      if (openSlots.length > 10) {
        console.log(`... and ${openSlots.length - 10} more open slots\n`);
      }
    }

    if (missingTourSlots.length > 0) {
      console.log('⚠️  SLOTS WITH MISSING TOUR:');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      missingTourSlots.slice(0, 5).forEach(slot => {
        const date = slot.date ? new Date(slot.date).toISOString().split('T')[0] : 'No date';
        console.log(`ID: ${slot.id}`);
        console.log(`  Tour: NULL/MISSING`);
        console.log(`  Date: ${date}`);
        console.log(`  Time: ${slot.time || 'No time'}`);
        console.log(`  Available: ${slot.availableSlots}/${slot.totalSlots || 'N/A'}`);
        console.log('');
      });
      if (missingTourSlots.length > 5) {
        console.log(`... and ${missingTourSlots.length - 5} more slots with missing tour\n`);
      }
    }

    // Step 5: Try to close open slots again
    if (openSlots.length > 0) {
      console.log('🔧 ATTEMPTING TO CLOSE OPEN SLOTS...\n');
      
      let successCount = 0;
      let failCount = 0;
      const errors = [];

      for (const slot of openSlots) {
        try {
          const updateRes = await fetch(`${PAYLOAD_URL}/api/inventory/${slot.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ availableSlots: 0 }),
          });

          if (updateRes.ok) {
            successCount++;
            process.stdout.write('✓');
          } else {
            failCount++;
            const errorText = await updateRes.text();
            errors.push({
              id: slot.id,
              status: updateRes.status,
              error: errorText.substring(0, 100),
            });
            process.stdout.write('✗');
          }
        } catch (err) {
          failCount++;
          errors.push({
            id: slot.id,
            error: err.message,
          });
          process.stdout.write('✗');
        }
      }

      console.log('\n');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📊 RETRY RESULTS');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`✅ Successfully closed: ${successCount}`);
      console.log(`❌ Failed to close:     ${failCount}`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

      if (errors.length > 0) {
        console.log('❌ ERROR DETAILS:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        errors.slice(0, 5).forEach(err => {
          console.log(`Slot ID: ${err.id}`);
          console.log(`Status: ${err.status || 'N/A'}`);
          console.log(`Error: ${err.error}`);
          console.log('');
        });
        if (errors.length > 5) {
          console.log(`... and ${errors.length - 5} more errors\n`);
        }
      }
    }

    // Step 6: Final summary
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ DIAGNOSIS COMPLETE');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    if (openSlots.length === 0) {
      console.log('✅ All slots are now closed!');
    } else {
      console.log(`⚠️  ${openSlots.length} slots still open`);
      console.log('\nPossible reasons:');
      console.log('1. Slots have missing tour reference');
      console.log('2. Slots are locked/protected');
      console.log('3. Permission issues');
      console.log('4. Database constraints');
    }
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

// Run the script
diagnoseErrors();
