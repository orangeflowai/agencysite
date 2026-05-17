#!/usr/bin/env node

/**
 * Sync Tour Variations to Sanity CMS
 * 
 * Distribution Strategy:
 * - Premium (VIP) tours → Golden Rome Tour (gycprksj)
 * - Value (BEST VALUE) tours → RomeWander (s9wuvaa8)
 * - Educational (EXPERT GUIDE) tours → RomanVaticanTour (etutpkdi)
 */

const { createClient } = require('@sanity/client');

// Payload CMS Configuration
const PAYLOAD_URL = process.env.PAYLOAD_API_URL || 'https://admin.wondersofrome.com';
const EMAIL = process.env.PAYLOAD_API_EMAIL || 'superadmin@romeagency.com';
const PASSWORD = process.env.PAYLOAD_API_PASSWORD || 'SuperAdmin2025!';
const SITE_ID = 'wondersofrome';

// Sanity Configuration with correct API tokens
const SANITY_CONFIGS = {
  premium: {
    name: 'Golden Rome Tour',
    projectId: 'gycprksj',
    dataset: 'production',
    token: process.env.SANITY_TOKEN_GOLDENROMETOUR || 'skeQSaMgbnAImmtbn3XohXCsci4IyxcqABssnVLxL2Ky0Guw3pXKy6ZixI5p5VXEDqR4cZinHiNysAz7nULL5fWYrd6WZBp83NFcZHa5bvV2pRjZhIhrDcIVTXBX3Ogty24R5Fs2CovJFneD0KR1Ugl24D4ZlQrtv0Ra8tVqtj9oxNGchPfD',
    badge: 'VIP',
  },
  value: {
    name: 'RomeWander',
    projectId: 's9wuvaa8',
    dataset: 'production',
    token: process.env.SANITY_TOKEN_ROMEWANDER || 'skr2lk2iTTKJVo0zqPMyzTkekwFu1Hya2e71h97w41L2XqbmbpkbYQG8akUTFSKbMuyleigI5eDgPlBZ5cM2W6lysqldyKi1M9yB6gDPy4DNYBFChkPUAVc1sCR0JTUu17KWYG3D3b270KBX8W58Ir0yZoWmH24YHH6AYBL09ItTgyCKtIUP',
    badge: 'BEST VALUE',
  },
  educational: {
    name: 'RomanVaticanTour',
    projectId: 'etutpkdi',
    dataset: 'production',
    token: process.env.SANITY_TOKEN_ROMANVATICANTOUR || 'skLzD0BfvZV2FdlKWhbRLZcSAjkxdKrZkh8zKh9BIgaINRjdCdGdRCmF7laAMZyzyAshM2zpR6w6DSFUdxjqDtOhdzygySg0ABt3Fp0lqHGvCvPAj1PDETrFCSuTCr8h0kvPu1QHUERlWfgfPIbrqVXWpT0FAewFTHIJ47F06y6oG73HoK8d',
    badge: 'EXPERT GUIDE',
  },
};

// Create Sanity clients
const sanityClients = {
  premium: createClient({
    projectId: SANITY_CONFIGS.premium.projectId,
    dataset: SANITY_CONFIGS.premium.dataset,
    token: SANITY_CONFIGS.premium.token,
    apiVersion: '2024-01-01',
    useCdn: false,
  }),
  value: createClient({
    projectId: SANITY_CONFIGS.value.projectId,
    dataset: SANITY_CONFIGS.value.dataset,
    token: SANITY_CONFIGS.value.token,
    apiVersion: '2024-01-01',
    useCdn: false,
  }),
  educational: createClient({
    projectId: SANITY_CONFIGS.educational.projectId,
    dataset: SANITY_CONFIGS.educational.dataset,
    token: SANITY_CONFIGS.educational.token,
    apiVersion: '2024-01-01',
    useCdn: false,
  }),
};

/**
 * Convert Payload tour to Sanity format
 */
function convertToSanityFormat(payloadTour, siteRef) {
  // Convert description to Sanity block content
  const descriptionBlocks = payloadTour.description ? [
    {
      _type: 'block',
      _key: 'desc1',
      style: 'normal',
      children: [
        {
          _type: 'span',
          text: payloadTour.description,
          marks: [],
        }
      ],
      markDefs: [],
    }
  ] : [];

  // Convert arrays to simple string arrays
  const highlights = (payloadTour.highlights || []).map(h => 
    typeof h === 'string' ? h : h.item
  ).filter(Boolean);

  const includes = (payloadTour.includes || []).map(i => 
    typeof i === 'string' ? i : i.item
  ).filter(Boolean);

  const excludes = (payloadTour.excludes || []).map(e => 
    typeof e === 'string' ? e : e.item
  ).filter(Boolean);

  const importantInfo = (payloadTour.importantInfo || []).map(info => 
    typeof info === 'string' ? info : info.item
  ).filter(Boolean);

  // Convert guest types
  const guestTypes = (payloadTour.guestTypes || []).map(gt => ({
    _type: 'object',
    _key: `guest-${gt.name.toLowerCase().replace(/\s+/g, '-')}`,
    name: gt.name,
    price: gt.price,
    description: gt.description || null,
  }));

  return {
    _type: 'tour',
    title: payloadTour.title,
    slug: {
      _type: 'slug',
      current: payloadTour.slug,
    },
    sites: [siteRef], // Reference to the site document
    price: payloadTour.price,
    guestTypes: guestTypes.length > 0 ? guestTypes : undefined,
    duration: payloadTour.duration || undefined,
    category: payloadTour.category || undefined,
    tourType: payloadTour.tourType || 'Guided Tour',
    badge: payloadTour.badge || undefined,
    rating: payloadTour.rating || undefined,
    reviewCount: payloadTour.reviewCount || undefined,
    description: descriptionBlocks.length > 0 ? descriptionBlocks : undefined,
    highlights: highlights.length > 0 ? highlights : undefined,
    includes: includes.length > 0 ? includes : undefined,
    excludes: excludes.length > 0 ? excludes : undefined,
    meetingPoint: payloadTour.meetingPoint || undefined,
    importantInfo: importantInfo.length > 0 ? importantInfo : undefined,
    groupSize: payloadTour.groupSize || undefined,
    maxParticipants: payloadTour.maxParticipants || undefined,
    location: 'Rome, Italy',
    tags: payloadTour.tags || undefined,
    seoTitle: payloadTour.seo?.title || payloadTour.title,
    seoDescription: payloadTour.seo?.description || payloadTour.description?.substring(0, 160),
    keywords: payloadTour.seo?.keywords || undefined,
  };
}

/**
 * Get or create site reference in Sanity
 */
async function getSiteReference(client, siteName) {
  // Query for existing site
  const query = `*[_type == "site" && title == $siteName][0]`;
  const existingSite = await client.fetch(query, { siteName });

  if (existingSite) {
    console.log(`   ✓ Found existing site: ${siteName} (${existingSite._id})`);
    return {
      _type: 'reference',
      _ref: existingSite._id,
    };
  }

  // Create new site if it doesn't exist
  console.log(`   → Creating new site: ${siteName}`);
  const newSite = await client.create({
    _type: 'site',
    title: siteName,
    isActive: true,
  });

  return {
    _type: 'reference',
    _ref: newSite._id,
  };
}

/**
 * Upload image to Sanity
 */
async function uploadImageToSanity(client, imageUrl) {
  if (!imageUrl) return null;

  try {
    // Fetch image from URL
    const response = await fetch(imageUrl);
    if (!response.ok) {
      console.log(`   ⚠️  Failed to fetch image: ${imageUrl}`);
      return null;
    }

    const buffer = await response.arrayBuffer();
    const asset = await client.assets.upload('image', Buffer.from(buffer), {
      filename: imageUrl.split('/').pop() || 'tour-image.jpg',
    });

    return {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: asset._id,
      },
    };
  } catch (error) {
    console.log(`   ⚠️  Error uploading image: ${error.message}`);
    return null;
  }
}

/**
 * Sync tours to Sanity
 */
async function syncToursToSanity() {
  console.log('🔄 Syncing Tour Variations to Sanity CMS...\n');

  try {
    // Step 1: Login to Payload
    console.log('1️⃣ Authenticating with Payload CMS...');
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

    // Step 2: Fetch tours by badge type
    console.log('2️⃣ Fetching tours from Payload CMS...\n');

    const toursByType = {};

    for (const [type, config] of Object.entries(SANITY_CONFIGS)) {
      console.log(`   Fetching ${config.badge} tours...`);
      const toursRes = await fetch(
        `${PAYLOAD_URL}/api/tours?where[tenant][equals]=${SITE_ID}&where[badge][equals]=${config.badge}&limit=100&depth=0`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!toursRes.ok) {
        throw new Error(`Failed to fetch ${type} tours: ${toursRes.status}`);
      }

      const toursData = await toursRes.json();
      toursByType[type] = toursData.docs || [];
      console.log(`   ✓ Found ${toursByType[type].length} ${config.badge} tours`);
    }

    console.log('');

    // Step 3: Sync to each Sanity project
    let totalSynced = 0;
    let totalErrors = 0;
    let totalSkipped = 0;

    for (const [type, tours] of Object.entries(toursByType)) {
      const config = SANITY_CONFIGS[type];
      const client = sanityClients[type];

      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      console.log(`3️⃣ Syncing to ${config.name} (${config.projectId})`);
      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

      // Get or create site reference
      const siteRef = await getSiteReference(client, config.name);

      for (const tour of tours) {
        try {
          // Check if tour already exists
          const existingQuery = `*[_type == "tour" && slug.current == $slug][0]`;
          const existingTour = await client.fetch(existingQuery, { slug: tour.slug });

          if (existingTour) {
            console.log(`⏭️  ${tour.title} (already exists)\n`);
            totalSkipped++;
            continue;
          }

          console.log(`📝 ${tour.title}`);

          // Convert to Sanity format
          const sanityTour = convertToSanityFormat(tour, siteRef);

          // Upload main image if available (skip to save time)
          // if (tour.imageUrl) {
          //   console.log(`   → Uploading main image...`);
          //   const mainImage = await uploadImageToSanity(client, tour.imageUrl);
          //   if (mainImage) {
          //     sanityTour.mainImage = mainImage;
          //   }
          // }

          // Create new tour
          console.log(`   → Creating new tour`);
          await client.create(sanityTour);
          console.log(`   ✅ Created\n`);

          totalSynced++;
        } catch (error) {
          console.log(`   ❌ Error: ${error.message}\n`);
          totalErrors++;
        }
      }
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ SYNC COMPLETE');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('📊 Summary:');
    console.log(`   ✅ Successfully synced: ${totalSynced} tours`);
    console.log(`   ⏭️  Skipped (already exist): ${totalSkipped} tours`);
    console.log(`   ❌ Errors: ${totalErrors} tours\n`);

    console.log('🌐 Verify in Sanity Studio:');
    console.log(`   • Golden Rome Tour: https://goldenrometour.sanity.studio/`);
    console.log(`   • RomeWander: https://romewander.sanity.studio/`);
    console.log(`   • RomanVaticanTour: https://romanvaticantour.sanity.studio/\n`);

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run the script
syncToursToSanity();
