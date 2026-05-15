#!/usr/bin/env node

/**
 * Upload tours from JSON files to Payload CMS
 */

const fs = require('fs');
const path = require('path');

const PAYLOAD_URL = process.env.PAYLOAD_API_URL || 'https://admin.wondersofrome.com';
const API_KEY = process.env.PAYLOAD_API_KEY || 'g3UDzJOPpj-_EOLcFzyy2mhVp75H62zHwNrJL5Kb-hU';
const TENANT = 'goldenrometour';

async function uploadTour(tourData) {
  const url = `${PAYLOAD_URL}/api/tours`;
  
  // Transform the tour data to match Payload schema
  const payloadTour = {
    title: tourData.title,
    slug: tourData.slug,
    productCode: tourData.productCode,
    category: tourData.category,
    tenant: tourData.tenant,
    active: tourData.status === 'active',
    rating: tourData.rating,
    reviewCount: tourData.reviewCount,
    price: tourData.price,
    duration: tourData.duration,
    groupSize: tourData.groupSize,
    badge: tourData.badge,
    description: tourData.description,
    highlights: tourData.highlights.map(h => ({ item: h })),
    includes: tourData.includes.map(i => ({ item: i })),
    excludes: tourData.excludes.map(e => ({ item: e })),
    importantInfo: tourData.importantInfo.map(i => ({ item: i })),
    meetingPoint: tourData.meetingPoint,
    itinerary: tourData.itinerary,
    guestTypes: tourData.guestTypes,
    maxParticipants: tourData.maxParticipants,
    tags: tourData.tags.map(t => ({ tag: t })),
    location: tourData.location,
    cancellationPolicy: tourData.cancellationPolicy,
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `users API-Key ${API_KEY}`,
      },
      body: JSON.stringify(payloadTour),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to upload tour "${tourData.title}":`, response.status, errorText);
      return false;
    }

    const result = await response.json();
    console.log(`✅ Successfully uploaded: ${tourData.title} (ID: ${result.doc.id})`);
    return true;
  } catch (error) {
    console.error(`Error uploading tour "${tourData.title}":`, error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Starting tour upload to Payload CMS...\n');
  console.log(`Payload URL: ${PAYLOAD_URL}`);
  console.log(`Tenant: ${TENANT}\n`);

  // Read tour JSON files
  const tour1Path = path.join(__dirname, '..', 'tour-data-tour1.json');
  const tour2Path = path.join(__dirname, '..', 'tour-data-tour2.json');

  if (!fs.existsSync(tour1Path) || !fs.existsSync(tour2Path)) {
    console.error('❌ Tour JSON files not found!');
    process.exit(1);
  }

  const tour1 = JSON.parse(fs.readFileSync(tour1Path, 'utf8'));
  const tour2 = JSON.parse(fs.readFileSync(tour2Path, 'utf8'));

  console.log('📦 Found 2 tours to upload:\n');
  console.log(`1. ${tour1.title}`);
  console.log(`2. ${tour2.title}\n`);

  // Upload tours
  const results = await Promise.all([
    uploadTour(tour1),
    uploadTour(tour2),
  ]);

  const successCount = results.filter(r => r).length;
  
  console.log('\n' + '='.repeat(50));
  console.log(`✨ Upload complete: ${successCount}/2 tours uploaded successfully`);
  console.log('='.repeat(50));

  if (successCount < 2) {
    process.exit(1);
  }
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
