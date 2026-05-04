#!/usr/bin/env node

/**
 * Script to add mandatory tours to goldenrometour in Payload CMS
 * Using email/password authentication
 */

const PAYLOAD_URL = 'https://admin.wondersofrome.com';
const EMAIL = 'superadmin@romeagency.com';
const PASSWORD = 'SuperAdmin2025!';
const TENANT = 'goldenrometour';

// Mandatory tours with different Unsplash images
const MANDATORY_TOURS = [
  {
    title: 'Skip-The-Line Ticket Vatican Museum And Sistine Chapel Fast Pass',
    description: 'Fast pass entry to Vatican Museums and Sistine Chapel',
    price: 69,
    duration: '3 hours',
    category: 'vatican',
    imageUrl: 'https://images.unsplash.com/photo-1541185933-710f50b90c28?w=800&q=80',
    slug: 'skip-line-vatican-museum-sistine-chapel-fast-pass-grt'
  },
  {
    title: 'Fast Pass Skip The Line Vatican Museums And Sistine Chapel',
    description: 'Skip-the-line access to Vatican Museums and Sistine Chapel',
    price: 65,
    duration: '3 hours',
    category: 'vatican',
    imageUrl: 'https://images.unsplash.com/photo-1525874684015-58379d421a52?w=800&q=80',
    slug: 'fast-pass-skip-line-vatican-museums-sistine-chapel-grt'
  },
  {
    title: 'Vatican Museums, Sistine Chapel & St Peter\'s Basilica Guided Tour',
    description: 'Guided tour covering all three major Vatican sites',
    price: 79,
    duration: '4 hours',
    category: 'vatican',
    imageUrl: 'https://images.unsplash.com/photo-1520556157077-f27357c37c22?w=800&q=80',
    slug: 'vatican-museums-sistine-chapel-st-peters-basilica-guided-tour-grt'
  },
  {
    title: 'Vatican Museum Sistine Chapel Official Tour Entrance St. Basilica',
    description: 'Official tour with entrance to St. Peter\'s Basilica',
    price: 75,
    duration: '3.5 hours',
    category: 'vatican',
    imageUrl: 'https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=800&q=80',
    slug: 'vatican-museum-sistine-chapel-official-tour-st-basilica-grt'
  },
  {
    title: 'Vatican Museums and Sistine Chapel Guided Tour and Skip the line',
    description: 'Guided tour with skip-the-line access',
    price: 72,
    duration: '3.5 hours',
    category: 'vatican',
    imageUrl: 'https://images.unsplash.com/photo-1542027432438-ef349e0efd5e?w=800&q=80',
    slug: 'vatican-museums-sistine-chapel-guided-tour-skip-line-grt'
  },
  {
    title: 'St. Peter\'s Basilica Skip the Line Tickets',
    description: 'Skip-the-line entry to St. Peter\'s Basilica',
    price: 25,
    duration: '2 hours',
    category: 'vatican',
    imageUrl: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800&q=80',
    slug: 'st-peters-basilica-skip-line-tickets-grt'
  },
  {
    title: 'Exclusive Christmas in Vatican',
    description: 'Special Christmas season Vatican experience',
    price: 99,
    duration: '4 hours',
    category: 'vatican',
    imageUrl: 'https://images.unsplash.com/photo-1543429766-99173822d54e?w=800&q=80',
    slug: 'exclusive-christmas-vatican-grt'
  },
  {
    title: 'Easter Mass with Pope Leo XIV at Vatican: Private Tour Experience',
    description: 'Private tour for Easter Mass with the Pope',
    price: 199,
    duration: '5 hours',
    category: 'vatican',
    imageUrl: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&q=80',
    slug: 'easter-mass-pope-leo-xiv-vatican-private-tour-grt'
  },
  {
    title: 'Papal Audience in Rome Private Tour with Pope Leo XIV',
    description: 'Private tour for Papal Audience',
    price: 189,
    duration: '3 hours',
    category: 'vatican',
    imageUrl: 'https://images.unsplash.com/photo-1516528387618-afa90b13e000?w=800&q=80',
    slug: 'papal-audience-rome-private-tour-pope-leo-xiv-grt'
  },
  {
    title: 'Vatican Underground Necropolis tour',
    description: 'Tour of the Vatican Necropolis (Scavi)',
    price: 85,
    duration: '2.5 hours',
    category: 'vatican',
    imageUrl: 'https://images.unsplash.com/photo-1473172707857-f9e276582ab6?w=800&q=80',
    slug: 'vatican-underground-necropolis-tour-grt'
  },
  {
    title: 'Catacombs, Vatican Museums, Sistine Chapel and Roman Basilicas Private Tour',
    description: 'Private combo tour covering multiple sites',
    price: 149,
    duration: '6 hours',
    category: 'vatican',
    imageUrl: 'https://images.unsplash.com/photo-1509024644558-2f56ce76c490?w=800&q=80',
    slug: 'catacombs-vatican-museums-sistine-chapel-roman-basilicas-private-tour-grt'
  }
];

let authToken = null;

async function authenticate() {
  console.log('🔐 Authenticating with Payload CMS...');
  
  try {
    const response = await fetch(`${PAYLOAD_URL}/api/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: EMAIL,
        password: PASSWORD,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('❌ Authentication failed:', error);
      return false;
    }

    const data = await response.json();
    authToken = data.token;
    console.log('✅ Authenticated successfully\n');
    return true;
  } catch (error) {
    console.error('❌ Authentication error:', error.message);
    return false;
  }
}

async function addTourToPayload(tour) {
  const url = new URL(`${PAYLOAD_URL}/api/tours`);
  
  const payload = {
    title: tour.title,
    description: tour.description,
    price: tour.price,
    duration: tour.duration,
    category: tour.category,
    imageUrl: tour.imageUrl,
    slug: tour.slug,
    tenant: TENANT,
    active: true,
    status: 'draft',
    maxParticipants: 20,
  };

  try {
    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `JWT ${authToken}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error(`❌ Failed to add "${tour.title}": ${response.status}`);
      console.error(error);
      return false;
    }

    const result = await response.json();
    console.log(`✅ Added: ${tour.title} (€${tour.price})`);
    return true;
  } catch (error) {
    console.error(`❌ Error adding "${tour.title}":`, error.message);
    return false;
  }
}

async function main() {
  // Authenticate first
  const authenticated = await authenticate();
  if (!authenticated) {
    console.error('Cannot proceed without authentication');
    process.exit(1);
  }

  console.log('🚀 Adding mandatory tours to goldenrometour...\n');
  
  let added = 0;
  let failed = 0;

  for (const tour of MANDATORY_TOURS) {
    const success = await addTourToPayload(tour);
    if (success) {
      added++;
    } else {
      failed++;
    }
    // Add delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log(`\n📊 Summary:`);
  console.log(`✅ Added: ${added}/${MANDATORY_TOURS.length}`);
  console.log(`❌ Failed: ${failed}/${MANDATORY_TOURS.length}`);
  
  if (failed === 0) {
    console.log('\n🎉 All mandatory tours added successfully!');
  }
}

main().catch(console.error);
