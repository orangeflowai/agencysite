#!/usr/bin/env node

/**
 * Export Tour Variations to JSON
 * 
 * Creates 3 JSON files for manual import into Sanity:
 * - tours-premium-vip.json (for Golden Rome Tour)
 * - tours-value-budget.json (for RomeWander)
 * - tours-educational-expert.json (for RomanVaticanTour)
 */

const fs = require('fs');

// Payload CMS Configuration
const PAYLOAD_URL = process.env.PAYLOAD_API_URL || 'https://admin.wondersofrome.com';
const EMAIL = process.env.PAYLOAD_API_EMAIL || 'superadmin@romeagency.com';
const PASSWORD = process.env.PAYLOAD_API_PASSWORD || 'SuperAdmin2025!';
const SITE_ID = 'wondersofrome';

const BADGE_TYPES = {
  premium: 'VIP',
  value: 'BEST VALUE',
  educational: 'EXPERT GUIDE',
};

/**
 * Convert Payload tour to Sanity-compatible format
 */
function convertToSanityFormat(payloadTour) {
  // Convert arrays
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

  return {
    _type: 'tour',
    title: payloadTour.title,
    slug: payloadTour.slug,
    price: payloadTour.price,
    guestTypes: payloadTour.guestTypes || [],
    duration: payloadTour.duration || null,
    category: payloadTour.category || null,
    tourType: payloadTour.tourType || 'Guided Tour',
    badge: payloadTour.badge || null,
    rating: payloadTour.rating || null,
    reviewCount: payloadTour.reviewCount || null,
    description: payloadTour.description || null,
    highlights: highlights.length > 0 ? highlights : null,
    includes: includes.length > 0 ? includes : null,
    excludes: excludes.length > 0 ? excludes : null,
    meetingPoint: payloadTour.meetingPoint || null,
    importantInfo: importantInfo.length > 0 ? importantInfo : null,
    groupSize: payloadTour.groupSize || null,
    maxParticipants: payloadTour.maxParticipants || null,
    location: 'Rome, Italy',
    tags: payloadTour.tags || null,
    seoTitle: payloadTour.seo?.title || payloadTour.title,
    seoDescription: payloadTour.seo?.description || payloadTour.description?.substring(0, 160),
    keywords: payloadTour.seo?.keywords || null,
    imageUrl: payloadTour.imageUrl || null,
    mainImage: payloadTour.mainImage || null,
    gallery: payloadTour.gallery || null,
  };
}

/**
 * Export tours to JSON files
 */
async function exportToursToJSON() {
  console.log('📦 Exporting Tour Variations to JSON...\n');

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

    const exports = {};

    for (const [type, badge] of Object.entries(BADGE_TYPES)) {
      console.log(`   Fetching ${badge} tours...`);
      const toursRes = await fetch(
        `${PAYLOAD_URL}/api/tours?where[tenant][equals]=${SITE_ID}&where[badge][equals]=${badge}&limit=100&depth=0`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!toursRes.ok) {
        throw new Error(`Failed to fetch ${type} tours: ${toursRes.status}`);
      }

      const toursData = await toursRes.json();
      const tours = toursData.docs || [];
      console.log(`   ✓ Found ${tours.length} ${badge} tours`);

      // Convert to Sanity format
      exports[type] = tours.map(tour => convertToSanityFormat(tour));
    }

    console.log('');

    // Step 3: Write JSON files
    console.log('3️⃣ Writing JSON files...\n');

    const files = {
      premium: 'tours-premium-vip.json',
      value: 'tours-value-budget.json',
      educational: 'tours-educational-expert.json',
    };

    for (const [type, filename] of Object.entries(files)) {
      const data = {
        _meta: {
          exportDate: new Date().toISOString(),
          source: 'Payload CMS',
          targetProject: type === 'premium' ? 'Golden Rome Tour (gycprksj)' :
                         type === 'value' ? 'RomeWander (s9wuvaa8)' :
                         'RomanVaticanTour (etutpkdi)',
          badge: BADGE_TYPES[type],
          count: exports[type].length,
        },
        tours: exports[type],
      };

      fs.writeFileSync(filename, JSON.stringify(data, null, 2));
      console.log(`   ✅ ${filename} (${exports[type].length} tours)`);
    }

    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ EXPORT COMPLETE');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('📊 Summary:');
    console.log(`   • Premium (VIP): ${exports.premium.length} tours → tours-premium-vip.json`);
    console.log(`   • Value (BEST VALUE): ${exports.value.length} tours → tours-value-budget.json`);
    console.log(`   • Educational (EXPERT GUIDE): ${exports.educational.length} tours → tours-educational-expert.json\n`);

    console.log('📝 Next Steps:');
    console.log('   1. Review the JSON files');
    console.log('   2. Import into Sanity Studio manually or using Sanity CLI');
    console.log('   3. See SANITY-SYNC-GUIDE.md for import instructions\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run the script
exportToursToJSON();
