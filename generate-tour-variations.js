#!/usr/bin/env node

/**
 * Generate Tour Variations Script
 * 
 * Creates 3 unique versions of Vatican tours:
 * - Version 1: Premium/Luxury
 * - Version 2: Value/Budget
 * - Version 3: Educational/Cultural
 */

const PAYLOAD_URL = process.env.PAYLOAD_API_URL || 'https://admin.wondersofrome.com';
const EMAIL = process.env.PAYLOAD_API_EMAIL || 'superadmin@romeagency.com';
const PASSWORD = process.env.PAYLOAD_API_PASSWORD || 'SuperAdmin2025!';
const SITE_ID = 'wondersofrome';

// Tour variation templates
const VARIATIONS = {
  premium: {
    suffix: 'Exclusive VIP Experience',
    priceMultiplier: 1.3,
    descriptionPrefix: 'Experience the ultimate luxury with our exclusive',
    highlights: [
      'Exclusive early morning access before crowds',
      'Private small group (max 12 people)',
      'VIP skip-the-line entrance',
      'Priority access to St. Peter\'s Basilica',
      'Premium audio headsets included',
      'Extra time for photos in Sistine Chapel',
      'Complimentary refreshments',
    ],
    keywords: ['exclusive', 'VIP', 'luxury', 'private', 'premium', 'early access'],
  },
  value: {
    suffix: 'Skip-the-Line Tour',
    priceMultiplier: 0.8,
    descriptionPrefix: 'Discover the best value with our affordable',
    highlights: [
      'Skip-the-line fast-track entry',
      'All essential highlights covered',
      'Small group tour (max 20 people)',
      'St. Peter\'s Basilica included',
      'Audio headsets provided',
      'Efficient 3-hour tour',
      'Best value for money',
    ],
    keywords: ['affordable', 'budget', 'skip-the-line', 'value', 'cheap', 'best price'],
  },
  educational: {
    suffix: 'Art History Masterclass',
    priceMultiplier: 1.1,
    descriptionPrefix: 'Immerse yourself in art history with our expert-led',
    highlights: [
      'Expert art historian guide',
      'In-depth art history commentary',
      'Comprehensive museum tour',
      'Historical context and fascinating stories',
      'Clear audio headsets for every guest',
      'Interactive Q&A with your guide',
      'Photo opportunities with expert tips',
    ],
    keywords: ['art history', 'expert guide', 'educational', 'cultural', 'historian', 'masterclass'],
  },
};

function generateVariationContent(originalTour, variationType) {
  const variation = VARIATIONS[variationType];
  const basePrice = originalTour.price || 69;
  const newPrice = Math.round(basePrice * variation.priceMultiplier);

  // Generate unique title
  const baseTitle = originalTour.title
    .replace(/Early Morning /gi, '')
    .replace(/With Sistine Chapel And Direct Access To Saint Peters Basilica Church Without Line/gi, '')
    .replace(/Vatican Tour/gi, 'Vatican Museums')
    .trim();

  const newTitle = `${baseTitle} ${variation.suffix}`;

  // Generate unique slug
  const baseSlug = originalTour.slug?.current || originalTour.slug || 'vatican-tour';
  const newSlug = `${baseSlug}-${variationType}`;

  // Generate unique description
  const newDescription = `${variation.descriptionPrefix} ${baseTitle.toLowerCase()}. ${originalTour.description || 'Explore the Vatican Museums and Sistine Chapel with expert guidance.'}

This ${variationType} tour is perfect for travelers seeking ${variationType === 'premium' ? 'luxury and exclusivity' : variationType === 'value' ? 'the best value and efficiency' : 'in-depth knowledge and cultural immersion'}.`;

  return {
    title: newTitle,
    slug: newSlug,
    description: newDescription,
    price: newPrice,
    highlights: variation.highlights,
    seoTitle: `${newTitle} | WondersOfRome`,
    seoDescription: `${newDescription.substring(0, 155)}...`,
    tags: variation.keywords,
  };
}

async function generateVariations() {
  console.log('🎨 Generating Tour Variations...\n');

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

    // Step 2: Get Vatican tours
    console.log('2️⃣ Fetching Vatican tours...');
    const toursRes = await fetch(
      `${PAYLOAD_URL}/api/tours?where[tenant][equals]=${SITE_ID}&where[category][equals]=vatican&limit=100&depth=0`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!toursRes.ok) {
      throw new Error(`Failed to fetch tours: ${toursRes.status}`);
    }

    const toursData = await toursRes.json();
    const tours = toursData.docs || [];

    console.log(`✅ Found ${tours.length} Vatican tours\n`);

    if (tours.length === 0) {
      console.log('ℹ️  No Vatican tours found.');
      return;
    }

    // Step 3: Generate variations for each tour
    console.log('3️⃣ Generating variations...\n');

    // Filter out test/debug tours
    const realTours = tours.filter(tour => 
      !tour.title.toLowerCase().includes('test') &&
      !tour.title.toLowerCase().includes('debug') &&
      !tour.slug.includes('test-') &&
      !tour.slug.includes('debug-') &&
      !tour.slug.includes('status-test')
    );

    console.log(`📊 Processing ${realTours.length} real tours (filtered out ${tours.length - realTours.length} test tours)\n`);

    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;

    for (const tour of realTours) {
      console.log(`📝 Processing: ${tour.title}`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

      for (const [type, variation] of Object.entries(VARIATIONS)) {
        try {
          const newTourData = generateVariationContent(tour, type);

          // Check if variation already exists
          const checkRes = await fetch(
            `${PAYLOAD_URL}/api/tours?where[slug][equals]=${newTourData.slug}&limit=1`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (checkRes.ok) {
            const checkData = await checkRes.json();
            if (checkData.docs && checkData.docs.length > 0) {
              console.log(`⏭️  ${type.toUpperCase()}: Already exists (${newTourData.slug})`);
              skipCount++;
              continue;
            }
          }

          // Create new tour variation - use minimal payload that works
          const tourPayload = {
            tenant: SITE_ID,
            title: newTourData.title,
            slug: newTourData.slug,
            description: newTourData.description,
            price: newTourData.price,
            category: 'vatican',
            duration: tour.duration || '3 hours',
            // status defaults to 'draft' - can be changed in admin panel
          };

          // Add optional fields only if they have valid values
          if (type === 'premium') tourPayload.groupSize = 'Small Group (max 12)';
          else if (type === 'value') tourPayload.groupSize = 'Small Group (max 20)';
          else tourPayload.groupSize = 'Small Group (max 15)';

          if (newTourData.highlights && newTourData.highlights.length > 0) {
            tourPayload.highlights = newTourData.highlights.map(item => ({ item }));
          }

          // Helper function to remove id fields from nested objects
          const removeIds = (obj) => {
            if (Array.isArray(obj)) {
              return obj.map(item => removeIds(item));
            } else if (obj && typeof obj === 'object') {
              const { id, ...rest } = obj;
              const cleaned = {};
              for (const [key, value] of Object.entries(rest)) {
                cleaned[key] = removeIds(value);
              }
              return cleaned;
            }
            return obj;
          };

          if (tour.includes && tour.includes.length > 0) {
            tourPayload.includes = removeIds(tour.includes);
          }

          if (tour.excludes && tour.excludes.length > 0) {
            tourPayload.excludes = removeIds(tour.excludes);
          }

          if (tour.meetingPoint) {
            tourPayload.meetingPoint = tour.meetingPoint;
          }

          if (tour.importantInfo && tour.importantInfo.length > 0) {
            tourPayload.importantInfo = removeIds(tour.importantInfo);
          }

          // Don't copy mainImage - it has complex nested structure with IDs
          // if (tour.mainImage) {
          //   tourPayload.mainImage = tour.mainImage;
          // }

          if (tour.imageUrl) {
            tourPayload.imageUrl = tour.imageUrl;
          }

          if (tour.rating) {
            tourPayload.rating = tour.rating;
          }

          if (tour.reviewCount) {
            tourPayload.reviewCount = tour.reviewCount;
          }

          if (type === 'premium') tourPayload.badge = 'VIP';
          else if (type === 'value') tourPayload.badge = 'BEST VALUE';
          else tourPayload.badge = 'EXPERT GUIDE';

          // SKIP tags field - it causes 500 errors
          // if (newTourData.tags && newTourData.tags.length > 0) {
          //   tourPayload.tags = newTourData.tags;
          // }

          // Add SEO fields in nested structure
          tourPayload.seo = {
            title: newTourData.seoTitle,
            description: newTourData.seoDescription,
          };

          if (type === 'premium') tourPayload.maxParticipants = 12;
          else if (type === 'value') tourPayload.maxParticipants = 20;
          else tourPayload.maxParticipants = 15;

          if (tour.guestTypes && tour.guestTypes.length > 0) {
            // Copy existing guest types with updated prices, removing IDs
            tourPayload.guestTypes = removeIds(tour.guestTypes).map(gt => ({
              ...gt,
              price: gt.name === 'Adult' ? newTourData.price : 
                     gt.name === 'Youth' ? Math.round(newTourData.price * 0.8) :
                     Math.round(newTourData.price * 0.5),
            }));
          }

          console.log(`   Creating with slug: ${tourPayload.slug}`);

          const createRes = await fetch(`${PAYLOAD_URL}/api/tours`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(tourPayload),
          });

          if (createRes.ok) {
            const result = await createRes.json();
            console.log(`✅ ${type.toUpperCase()}: Created (€${newTourData.price})`);
            console.log(`   Slug: ${newTourData.slug}`);
            successCount++;
          } else {
            const errorText = await createRes.text();
            console.log(`❌ ${type.toUpperCase()}: Failed (${createRes.status})`);
            console.log(`   Error: ${errorText}`);
            errorCount++;
            
            // Try to parse and show detailed error
            try {
              const errorJson = JSON.parse(errorText);
              if (errorJson.errors && errorJson.errors[0]) {
                console.log(`   Details: ${JSON.stringify(errorJson.errors[0], null, 2)}`);
              }
            } catch (e) {
              // Error text is not JSON
            }
          }
        } catch (err) {
          console.log(`❌ ${type.toUpperCase()}: Error - ${err.message}`);
          errorCount++;
        }
      }

      console.log('');
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ GENERATION COMPLETE');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('📊 Final Summary:');
    console.log(`   ✅ Successfully created: ${successCount} variations`);
    console.log(`   ⏭️  Skipped (already exist): ${skipCount} variations`);
    console.log(`   ❌ Errors: ${errorCount} variations`);
    console.log(`   📝 Processed: ${realTours.length} tours\n`);

    console.log('🔍 Verify at: https://admin.wondersofrome.com\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

// Run the script
generateVariations();
