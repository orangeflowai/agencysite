#!/usr/bin/env node

const PAYLOAD_URL = 'https://admin.wondersofrome.com';
const API_KEY = 'g3UDzJOPpj-_EOLcFzyy2mhVp75H62zHwNrJL5Kb-hU';
const TENANT = 'goldenrometour';

async function fetchTours() {
  console.log('🔍 Fetching tours from Payload CMS...\n');
  
  try {
    const url = `${PAYLOAD_URL}/api/tours?where[tenant][equals]=${TENANT}&limit=100&depth=0`;
    const response = await fetch(url, {
      headers: {
        'Authorization': `users API-Key ${API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`❌ API Error: ${response.status} ${response.statusText}`);
      return;
    }

    const data = await response.json();
    const tours = data.docs || [];

    console.log(`✅ Found ${tours.length} tours for tenant: ${TENANT}\n`);
    console.log('=' .repeat(80));

    if (tours.length === 0) {
      console.log('\n⚠️  NO TOURS FOUND!');
      console.log('\nPossible reasons:');
      console.log('1. No tours created for goldenrometour tenant');
      console.log('2. All tours are inactive');
      console.log('3. Wrong tenant name\n');
      return;
    }

    tours.forEach((tour, index) => {
      console.log(`\n${index + 1}. ${tour.title}`);
      console.log(`   ID: ${tour.id}`);
      console.log(`   Slug: ${tour.slug}`);
      console.log(`   Category: ${tour.category || '❌ MISSING'}`);
      console.log(`   Active: ${tour.active ? '✅ Yes' : '❌ No'}`);
      console.log(`   URL: http://localhost:3000/tour/${tour.slug}`);
      
      // Check for Vatican category
      if (tour.category !== 'vatican') {
        console.log(`   ⚠️  WARNING: Category is "${tour.category}", not "vatican"`);
      }
      
      // Check if active
      if (!tour.active) {
        console.log(`   ⚠️  WARNING: Tour is inactive`);
      }
    });

    console.log('\n' + '='.repeat(80));
    console.log('\n📊 Summary:');
    console.log(`   Total tours: ${tours.length}`);
    console.log(`   Active tours: ${tours.filter(t => t.active).length}`);
    console.log(`   Vatican tours: ${tours.filter(t => t.category === 'vatican').length}`);
    console.log(`   Missing category: ${tours.filter(t => !t.category).length}`);
    console.log(`   Wrong category: ${tours.filter(t => t.category && t.category !== 'vatican').length}`);

    // List tours that will work
    const workingTours = tours.filter(t => t.active && (!t.category || t.category === 'vatican'));
    console.log(`\n✅ Tours that should work (${workingTours.length}):`);
    workingTours.forEach(t => {
      console.log(`   - http://localhost:3000/tour/${t.slug}`);
    });

    // List tours that won't work
    const brokenTours = tours.filter(t => !t.active || (t.category && t.category !== 'vatican'));
    if (brokenTours.length > 0) {
      console.log(`\n❌ Tours that won't work (${brokenTours.length}):`);
      brokenTours.forEach(t => {
        const reason = !t.active ? 'inactive' : `wrong category (${t.category})`;
        console.log(`   - ${t.slug} (${reason})`);
      });
    }

  } catch (error) {
    console.error('❌ Error fetching tours:', error.message);
  }
}

fetchTours();
