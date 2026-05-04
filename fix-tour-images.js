#!/usr/bin/env node

/**
 * fix-tour-images.js
 * 
 * Links existing Payload media files to tours based on filename matching
 * Fixes the issue where tours have imageUrl but no mainImage relationship
 */

const fetch = require('node-fetch');

const PAYLOAD_URL = 'https://admin.wondersofrome.com';
const PAYLOAD_EMAIL = 'superadmin@romeagency.com';
const PAYLOAD_PASSWORD = 'SuperAdmin2025!';
const SITE_ID = 'wondersofrome';

let payloadToken = null;

async function getPayloadToken() {
  if (payloadToken) return payloadToken;

  console.log('🔐 Authenticating with Payload CMS...');
  const res = await fetch(`${PAYLOAD_URL}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: PAYLOAD_EMAIL, password: PAYLOAD_PASSWORD }),
  });

  if (!res.ok) {
    throw new Error(`Payload auth failed: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  payloadToken = data.token;
  console.log('✅ Authenticated successfully\n');
  return payloadToken;
}

async function getAllMedia() {
  const token = await getPayloadToken();
  
  console.log('📥 Fetching all media files...');
  const res = await fetch(`${PAYLOAD_URL}/api/media?limit=200`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch media: ${res.status}`);
  }

  const data = await res.json();
  console.log(`✅ Found ${data.totalDocs} media files\n`);
  return data.docs;
}

async function getAllTours() {
  const token = await getPayloadToken();
  
  console.log('📥 Fetching all tours...');
  const res = await fetch(
    `${PAYLOAD_URL}/api/tours?where[tenant][equals]=${SITE_ID}&limit=200&depth=0`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch tours: ${res.status}`);
  }

  const data = await res.json();
  console.log(`✅ Found ${data.docs.length} tours\n`);
  return data.docs;
}

async function updateTourImage(tourId, mediaId) {
  const token = await getPayloadToken();
  
  const res = await fetch(`${PAYLOAD_URL}/api/tours/${tourId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ mainImage: mediaId }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Failed to update tour: ${res.status} - ${error}`);
  }

  return res.json();
}

async function fixTourImages() {
  try {
    console.log('\n╔════════════════════════════════════════════════════════════════╗');
    console.log('║     FIX TOUR IMAGES - Link Media to Tours                     ║');
    console.log('╚════════════════════════════════════════════════════════════════╝\n');

    // Fetch all media and tours
    const mediaFiles = await getAllMedia();
    const tours = await getAllTours();

    // Create a map of media files by filename (without extension)
    const mediaMap = new Map();
    mediaFiles.forEach(media => {
      // Extract slug from filename (e.g., "vatican-museums-skip-line-audio-guide-main.jpg" -> "vatican-museums-skip-line-audio-guide")
      const filename = media.filename.replace(/-main\.(jpg|jpeg|png|webp)$/i, '');
      mediaMap.set(filename, media);
    });

    console.log('🔗 Linking tours to media files...\n');

    let updated = 0;
    let notFound = 0;
    let alreadyLinked = 0;
    let errors = 0;

    for (const tour of tours) {
      console.log(`\n📍 ${tour.title}`);
      console.log(`   Slug: ${tour.slug}`);
      console.log(`   Current mainImage: ${tour.mainImage || 'null'}`);

      try {
        // Skip if already has mainImage
        if (tour.mainImage) {
          console.log(`   ✓ Already has mainImage`);
          alreadyLinked++;
          continue;
        }

        // Try to find matching media file
        const media = mediaMap.get(tour.slug);

        if (media) {
          console.log(`   ✓ Found matching media: ${media.filename} (ID: ${media.id})`);
          
          // Update tour with mainImage
          await updateTourImage(tour.id, media.id);
          console.log(`   ✅ Updated tour with mainImage`);
          updated++;
        } else {
          console.log(`   ⚠️  No matching media file found`);
          notFound++;
        }
      } catch (error) {
        console.error(`   ❌ Error: ${error.message}`);
        errors++;
      }
    }

    console.log('\n╔════════════════════════════════════════════════════════════════╗');
    console.log('║  RESULTS                                                       ║');
    console.log('╚════════════════════════════════════════════════════════════════╝\n');
    console.log(`✅ Updated:           ${updated}`);
    console.log(`✓  Already Linked:    ${alreadyLinked}`);
    console.log(`⚠️  Not Found:         ${notFound}`);
    console.log(`❌ Errors:            ${errors}`);
    console.log(`📊 Total Tours:       ${tours.length}\n`);

    if (updated > 0) {
      console.log('✅ Tour images have been linked successfully!');
      console.log('   The website should now display Payload images.\n');
    }

  } catch (error) {
    console.error('\n❌ Failed:', error.message);
    process.exit(1);
  }
}

fixTourImages();
