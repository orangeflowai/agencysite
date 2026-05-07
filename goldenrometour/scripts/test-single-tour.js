#!/usr/bin/env node

const PAYLOAD_URL = 'https://admin.wondersofrome.com';
const API_KEY = 'g3UDzJOPpj-_EOLcFzyy2mhVp75H62zHwNrJL5Kb-hU';
const TENANT = 'goldenrometour';
const SLUG = 'vatican-gardens-private-tour-grt';

async function testTour() {
  console.log(`🔍 Testing tour: ${SLUG}\n`);
  
  try {
    const url = `${PAYLOAD_URL}/api/tours?where[slug][equals]=${SLUG}&where[tenant][equals]=${TENANT}&limit=1&depth=2`;
    console.log(`📡 Fetching: ${url}\n`);
    
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
    const tour = data.docs?.[0];

    if (!tour) {
      console.log('❌ Tour not found!\n');
      return;
    }

    console.log('✅ Tour found!\n');
    console.log('📋 Tour Details:');
    console.log(`   ID: ${tour.id}`);
    console.log(`   Title: ${tour.title}`);
    console.log(`   Slug: ${tour.slug}`);
    console.log(`   Category: ${tour.category || '❌ MISSING'}`);
    console.log(`   Active: ${tour.active ? '✅ Yes' : '❌ No'}`);
    console.log(`   Tenant: ${tour.tenant}`);
    console.log(`   Price: €${tour.price || 'N/A'}`);
    console.log(`   Duration: ${tour.duration || 'N/A'}`);
    console.log(`   Description: ${tour.description ? 'Present' : 'Missing'}`);
    console.log(`   Main Image: ${tour.mainImage ? 'Present' : 'Missing'}`);
    console.log(`   Highlights: ${tour.highlights?.length || 0} items`);
    
    console.log('\n🔍 Validation Checks:');
    
    if (!tour.active) {
      console.log('   ❌ Tour is INACTIVE - will return 404');
    } else {
      console.log('   ✅ Tour is active');
    }
    
    if (!tour.category) {
      console.log('   ⚠️  No category - will be allowed through');
    } else if (tour.category === 'vatican') {
      console.log('   ✅ Category is "vatican" - will work!');
    } else {
      console.log(`   ❌ Category is "${tour.category}" - will be filtered out!`);
    }
    
    console.log('\n🌐 Test URL:');
    console.log(`   http://localhost:3000/tour/${tour.slug}`);
    
    console.log('\n✅ This tour SHOULD work on goldenrometour!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testTour();
