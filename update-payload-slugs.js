#!/usr/bin/env node

/**
 * Update Payload tour slugs to match Sanity
 * Removes the `-wor` suffix from wondersofrome tour slugs
 */

const PAYLOAD_API_URL = 'https://admin.wondersofrome.com';
const PAYLOAD_EMAIL = 'superadmin@romeagency.com';
const PAYLOAD_PASSWORD = 'SuperAdmin2025!';
const TENANT = 'wondersofrome';

async function login() {
  console.log('🔐 Logging in to Payload...');
  const response = await fetch(`${PAYLOAD_API_URL}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: PAYLOAD_EMAIL,
      password: PAYLOAD_PASSWORD
    })
  });

  if (!response.ok) {
    throw new Error(`Login failed: ${response.statusText}`);
  }

  const data = await response.json();
  console.log('✅ Logged in successfully');
  return data.token;
}

async function getTours(token) {
  console.log(`\n📥 Fetching tours for ${TENANT}...`);
  const response = await fetch(
    `${PAYLOAD_API_URL}/api/tours?where[tenant][equals]=${TENANT}&limit=1000`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch tours: ${response.statusText}`);
  }

  const data = await response.json();
  console.log(`✅ Found ${data.docs.length} tours`);
  return data.docs;
}

async function updateTourSlug(token, tourId, oldSlug, newSlug) {
  const response = await fetch(
    `${PAYLOAD_API_URL}/api/tours/${tourId}`,
    {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        slug: newSlug  // Direct slug, not slug.current
      })
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to update tour ${tourId}: ${error}`);
  }

  return await response.json();
}

async function main() {
  try {
    console.log('🚀 Starting Payload slug update...\n');
    
    // Login
    const token = await login();
    
    // Get all tours
    const tours = await getTours(token);
    
    // Filter tours that need updating (have -wor suffix)
    const toursToUpdate = tours.filter(tour => 
      tour.slug?.endsWith('-wor')
    );
    
    console.log(`\n📝 Found ${toursToUpdate.length} tours with -wor suffix to update\n`);
    
    if (toursToUpdate.length === 0) {
      console.log('✅ No tours need updating!');
      return;
    }
    
    // Update each tour
    let updated = 0;
    let failed = 0;
    
    for (const tour of toursToUpdate) {
      const oldSlug = tour.slug;
      const newSlug = oldSlug.replace(/-wor$/, '');
      
      try {
        await updateTourSlug(token, tour.id, oldSlug, newSlug);
        updated++;
        console.log(`✅ ${updated}/${toursToUpdate.length} Updated: ${oldSlug} → ${newSlug}`);
      } catch (error) {
        failed++;
        console.error(`❌ Failed to update ${oldSlug}: ${error.message}`);
      }
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log(`\n📊 Summary:`);
    console.log(`   ✅ Updated: ${updated}`);
    console.log(`   ❌ Failed: ${failed}`);
    console.log(`   📝 Total: ${toursToUpdate.length}`);
    
    if (updated > 0) {
      console.log(`\n🎉 Successfully updated ${updated} tour slugs!`);
      console.log(`\n💡 Next steps:`);
      console.log(`   1. Rebuild the website: npm run build`);
      console.log(`   2. Restart PM2: pm2 restart wondersofrome`);
      console.log(`   3. Clear browser cache and test`);
    }
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

main();
