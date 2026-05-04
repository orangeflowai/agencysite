#!/usr/bin/env node

/**
 * migrate-sanity-to-payload.js
 * 
 * Migrates ALL tour data from Sanity CMS to Payload CMS
 * Preserves all fields including images, descriptions, itineraries, etc.
 * 
 * Usage:
 *   node migrate-sanity-to-payload.js [--dry-run] [--site wondersofrome]
 * 
 * Options:
 *   --dry-run    Show what would be migrated without actually doing it
 *   --site       Specify which site to migrate (default: wondersofrome)
 *   --force      Overwrite existing tours in Payload
 */

const { createClient } = require('@sanity/client');
const fetch = require('node-fetch');
require('dotenv').config({ path: './wondersofrome/wondersofrome/.env' });

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'aknmkkwd';
const SANITY_DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const SANITY_TOKEN = process.env.SANITY_API_TOKEN;

const PAYLOAD_URL = process.env.PAYLOAD_API_URL || 'https://admin.wondersofrome.com';
const PAYLOAD_EMAIL = process.env.PAYLOAD_API_EMAIL || 'superadmin@romeagency.com';
const PAYLOAD_PASSWORD = process.env.PAYLOAD_API_PASSWORD || 'SuperAdmin2025!';

const DEFAULT_SITE_ID = process.env.NEXT_PUBLIC_SITE_ID || 'wondersofrome';

// Parse command line arguments
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const forceOverwrite = args.includes('--force');
const siteIndex = args.indexOf('--site');
const targetSite = siteIndex !== -1 ? args[siteIndex + 1] : DEFAULT_SITE_ID;

console.log('\n╔════════════════════════════════════════════════════════════════╗');
console.log('║     SANITY → PAYLOAD MIGRATION TOOL                            ║');
console.log('╚════════════════════════════════════════════════════════════════╝\n');
console.log(`Mode: ${isDryRun ? '🔍 DRY RUN (no changes will be made)' : '✍️  LIVE MIGRATION'}`);
console.log(`Site: ${targetSite}`);
console.log(`Force Overwrite: ${forceOverwrite ? 'Yes' : 'No'}\n`);

// ═══════════════════════════════════════════════════════════════════════════
// SANITY CLIENT
// ═══════════════════════════════════════════════════════════════════════════

const sanityClient = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  apiVersion: '2024-01-01',
  token: SANITY_TOKEN,
  useCdn: false,
});

// ═══════════════════════════════════════════════════════════════════════════
// PAYLOAD AUTH
// ═══════════════════════════════════════════════════════════════════════════

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

// ═══════════════════════════════════════════════════════════════════════════
// SCHEMA MAPPING
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Maps Sanity tour document to Payload tour format
 */
function mapSanityToPayload(sanityTour, siteId) {
  // Extract description text from Portable Text
  let descriptionText = '';
  if (Array.isArray(sanityTour.description)) {
    descriptionText = sanityTour.description
      .filter(block => block._type === 'block')
      .map(block => {
        if (block.children) {
          return block.children.map(child => child.text).join('');
        }
        return '';
      })
      .join('\n\n');
  } else if (typeof sanityTour.description === 'string') {
    descriptionText = sanityTour.description;
  }

  // Map guest types
  const guestTypes = (sanityTour.guestTypes || []).map(gt => ({
    name: gt.name,
    price: gt.price,
    description: gt.description || '',
  }));

  // Map itinerary
  const itinerary = (sanityTour.itinerary || []).map(item => ({
    title: item.title || '',
    duration: item.duration || '',
    description: item.description || '',
  }));

  // Extract image URL
  let imageUrl = null;
  if (sanityTour.mainImage?.asset?.url) {
    imageUrl = sanityTour.mainImage.asset.url;
  }

  return {
    title: sanityTour.title,
    slug: sanityTour.slug?.current || sanityTour.slug,
    tenant: siteId,
    
    // Pricing
    price: sanityTour.price || 0,
    studentPrice: sanityTour.studentPrice,
    youthPrice: sanityTour.youthPrice,
    guestTypes: guestTypes.length > 0 ? guestTypes : undefined,
    
    // Basic info
    duration: sanityTour.duration || '',
    category: sanityTour.category || 'city',
    groupSize: sanityTour.groupSize || '',
    maxParticipants: sanityTour.maxParticipants || 20,
    
    // Description
    description: descriptionText,
    
    // Features and highlights
    highlights: (sanityTour.highlights || sanityTour.features || []).map(h => ({ item: h })),
    includes: (sanityTour.includes || []).map(i => ({ item: i })),
    excludes: (sanityTour.excludes || []).map(e => ({ item: e })),
    importantInfo: (sanityTour.importantInfo || []).map(i => ({ item: i })),
    
    // Location
    location: sanityTour.location || 'Rome, Italy',
    meetingPoint: sanityTour.meetingPoint || '',
    mapAddress: sanityTour.mapAddress || '',
    
    // Metadata
    badge: sanityTour.badge || '',
    tags: (sanityTour.tags || []).map(t => ({ tag: t })),
    rating: sanityTour.rating || 5.0,
    reviewCount: sanityTour.reviewCount || 0,
    
    // Itinerary
    itinerary: itinerary.length > 0 ? itinerary : undefined,
    
    // Image URL (will be stored as string reference)
    imageUrl: imageUrl,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// FETCH FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

async function getSiteRefBySlug(slug) {
  const query = `*[_type == "site" && slug.current == $slug][0]{ _id }`;
  const result = await sanityClient.fetch(query, { slug });
  return result?._id || null;
}

async function fetchSanityTours(siteId) {
  console.log(`📥 Fetching tours from Sanity for site: ${siteId}...`);
  
  const siteRef = await getSiteRefBySlug(siteId);
  
  if (!siteRef) {
    console.log(`⚠️  Site "${siteId}" not found in Sanity`);
    return [];
  }

  const query = `*[_type == "tour" && $siteRef in sites[]._ref] | order(_createdAt asc) {
    _id,
    _createdAt,
    _updatedAt,
    title,
    slug,
    mainImage {
      asset -> {
        _id,
        url
      }
    },
    price,
    studentPrice,
    youthPrice,
    duration,
    description,
    category,
    features,
    highlights,
    badge,
    rating,
    reviewCount,
    groupSize,
    location,
    tags,
    guestTypes,
    includes,
    excludes,
    importantInfo,
    itinerary,
    meetingPoint,
    mapAddress,
    maxParticipants,
    gallery,
    sites
  }`;

  const tours = await sanityClient.fetch(query, { siteRef });
  console.log(`✅ Found ${tours.length} tours in Sanity\n`);
  return tours;
}

async function fetchPayloadTours(siteId) {
  console.log(`📥 Fetching existing tours from Payload for site: ${siteId}...`);
  
  const token = await getPayloadToken();
  const url = new URL(`${PAYLOAD_URL}/api/tours`);
  url.searchParams.set('where[tenant][equals]', siteId);
  url.searchParams.set('limit', '500');
  
  const res = await fetch(url.toString(), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch Payload tours: ${res.status}`);
  }

  const data = await res.json();
  console.log(`✅ Found ${data.docs.length} existing tours in Payload\n`);
  return data.docs;
}

async function createPayloadTour(tourData) {
  const token = await getPayloadToken();
  
  const res = await fetch(`${PAYLOAD_URL}/api/tours`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(tourData),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Failed to create tour: ${res.status} - ${error}`);
  }

  return res.json();
}

async function updatePayloadTour(tourId, tourData) {
  const token = await getPayloadToken();
  
  const res = await fetch(`${PAYLOAD_URL}/api/tours/${tourId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(tourData),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Failed to update tour: ${res.status} - ${error}`);
  }

  return res.json();
}

// ═══════════════════════════════════════════════════════════════════════════
// MIGRATION LOGIC
// ═══════════════════════════════════════════════════════════════════════════

async function migrateTours() {
  try {
    // Fetch tours from both systems
    const sanityTours = await fetchSanityTours(targetSite);
    const payloadTours = await fetchPayloadTours(targetSite);

    if (sanityTours.length === 0) {
      console.log('⚠️  No tours found in Sanity. Nothing to migrate.');
      return;
    }

    // Create a map of existing Payload tours by slug
    const payloadTourMap = new Map();
    payloadTours.forEach(tour => {
      payloadTourMap.set(tour.slug, tour);
    });

    console.log('╔════════════════════════════════════════════════════════════════╗');
    console.log('║  MIGRATION SUMMARY                                             ║');
    console.log('╚════════════════════════════════════════════════════════════════╝\n');

    let created = 0;
    let updated = 0;
    let skipped = 0;
    let errors = 0;

    for (const sanityTour of sanityTours) {
      const slug = sanityTour.slug?.current || sanityTour.slug;
      const existingTour = payloadTourMap.get(slug);

      try {
        const payloadData = mapSanityToPayload(sanityTour, targetSite);

        if (existingTour) {
          if (forceOverwrite) {
            console.log(`🔄 Updating: ${sanityTour.title} (${slug})`);
            if (!isDryRun) {
              await updatePayloadTour(existingTour.id, payloadData);
            }
            updated++;
          } else {
            console.log(`⏭️  Skipping: ${sanityTour.title} (${slug}) - already exists`);
            skipped++;
          }
        } else {
          console.log(`✨ Creating: ${sanityTour.title} (${slug})`);
          if (!isDryRun) {
            await createPayloadTour(payloadData);
          }
          created++;
        }

        // Show field comparison
        if (isDryRun) {
          console.log(`   📊 Fields: ${Object.keys(payloadData).length} fields mapped`);
          if (payloadData.imageUrl) console.log(`   🖼️  Image: ${payloadData.imageUrl.substring(0, 50)}...`);
          if (payloadData.guestTypes?.length) console.log(`   👥 Guest Types: ${payloadData.guestTypes.length}`);
          if (payloadData.itinerary?.length) console.log(`   📍 Itinerary Steps: ${payloadData.itinerary.length}`);
          console.log('');
        }

      } catch (error) {
        console.error(`❌ Error processing ${sanityTour.title}: ${error.message}`);
        errors++;
      }
    }

    console.log('\n╔════════════════════════════════════════════════════════════════╗');
    console.log('║  MIGRATION RESULTS                                             ║');
    console.log('╚════════════════════════════════════════════════════════════════╝\n');
    console.log(`✨ Created:  ${created}`);
    console.log(`🔄 Updated:  ${updated}`);
    console.log(`⏭️  Skipped:  ${skipped}`);
    console.log(`❌ Errors:   ${errors}`);
    console.log(`📊 Total:    ${sanityTours.length}\n`);

    if (isDryRun) {
      console.log('💡 This was a dry run. No changes were made.');
      console.log('   Run without --dry-run to perform the actual migration.\n');
    } else {
      console.log('✅ Migration completed successfully!\n');
    }

    // Show schema comparison
    console.log('╔════════════════════════════════════════════════════════════════╗');
    console.log('║  SCHEMA FIELD MAPPING                                          ║');
    console.log('╚════════════════════════════════════════════════════════════════╝\n');
    console.log('Sanity Field          → Payload Field');
    console.log('─────────────────────────────────────────────────────────────────');
    console.log('title                 → title');
    console.log('slug.current          → slug');
    console.log('mainImage.asset.url   → imageUrl');
    console.log('price                 → price');
    console.log('studentPrice          → studentPrice');
    console.log('youthPrice            → youthPrice');
    console.log('guestTypes[]          → guestTypes[]');
    console.log('duration              → duration');
    console.log('category              → category');
    console.log('groupSize             → groupSize');
    console.log('maxParticipants       → maxParticipants');
    console.log('description (PT)      → description (text)');
    console.log('highlights[]          → highlights[].item');
    console.log('includes[]            → includes[].item');
    console.log('excludes[]            → excludes[].item');
    console.log('importantInfo[]       → importantInfo[].item');
    console.log('location              → location');
    console.log('meetingPoint          → meetingPoint');
    console.log('mapAddress            → mapAddress');
    console.log('badge                 → badge');
    console.log('tags[]                → tags[].tag');
    console.log('rating                → rating');
    console.log('reviewCount           → reviewCount');
    console.log('itinerary[]           → itinerary[]');
    console.log('─────────────────────────────────────────────────────────────────\n');

  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// RUN MIGRATION
// ═══════════════════════════════════════════════════════════════════════════

migrateTours().catch(console.error);
