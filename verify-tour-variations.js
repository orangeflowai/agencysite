#!/usr/bin/env node

/**
 * Verify Tour Variations - Check what was created
 */

const PAYLOAD_URL = process.env.PAYLOAD_API_URL || 'https://admin.wondersofrome.com';
const EMAIL = process.env.PAYLOAD_API_EMAIL || 'superadmin@romeagency.com';
const PASSWORD = process.env.PAYLOAD_API_PASSWORD || 'SuperAdmin2025!';
const SITE_ID = 'wondersofrome';

async function verifyTourVariations() {
  console.log('🔍 Verifying Tour Variations...\n');

  try {
    // Login
    const loginRes = await fetch(`${PAYLOAD_URL}/api/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
    });

    const { token } = await loginRes.json();
    console.log('✅ Authenticated\n');

    // Get all Vatican tours
    const toursRes = await fetch(
      `${PAYLOAD_URL}/api/tours?where[tenant][equals]=${SITE_ID}&where[category][equals]=vatican&limit=200&sort=-createdAt`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const toursData = await toursRes.json();
    const tours = toursData.docs || [];

    console.log(`📊 Total Vatican Tours: ${toursData.totalDocs}\n`);

    // Count by badge
    const premiumTours = tours.filter(t => t.badge === 'VIP');
    const valueTours = tours.filter(t => t.badge === 'BEST VALUE');
    const educationalTours = tours.filter(t => t.badge === 'EXPERT GUIDE');
    const otherTours = tours.filter(t => !t.badge || (t.badge !== 'VIP' && t.badge !== 'BEST VALUE' && t.badge !== 'EXPERT GUIDE'));

    console.log('📈 Tours by Type:');
    console.log(`   🌟 Premium (VIP): ${premiumTours.length}`);
    console.log(`   💰 Value (BEST VALUE): ${valueTours.length}`);
    console.log(`   🎓 Educational (EXPERT GUIDE): ${educationalTours.length}`);
    console.log(`   📝 Other/Original: ${otherTours.length}\n`);

    // Show latest 10 created tours
    console.log('🆕 Latest 10 Created Tours:\n');
    tours.slice(0, 10).forEach((tour, idx) => {
      console.log(`${idx + 1}. ${tour.title}`);
      console.log(`   Price: €${tour.price} | Badge: ${tour.badge || 'None'} | Status: ${tour.status}`);
      console.log(`   Slug: ${tour.slug}`);
      console.log(`   Created: ${new Date(tour.createdAt).toLocaleString()}\n`);
    });

    // Show price distribution
    console.log('💶 Price Distribution:');
    const prices = tours.map(t => t.price).filter(p => p);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const avgPrice = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);
    console.log(`   Min: €${minPrice}`);
    console.log(`   Max: €${maxPrice}`);
    console.log(`   Avg: €${avgPrice}\n`);

    // Show variations for one example tour
    console.log('🔍 Example: Variations of "Vatican Museums & Sistine Chapel":\n');
    const exampleTours = tours.filter(t => 
      t.title.includes('Vatican Museums') && 
      t.title.includes('Sistine Chapel') &&
      !t.title.includes('TEST') &&
      !t.title.includes('DEBUG')
    );
    
    exampleTours.slice(0, 5).forEach(tour => {
      console.log(`   - ${tour.title}`);
      console.log(`     €${tour.price} | ${tour.badge || 'Original'} | ${tour.status}\n`);
    });

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ VERIFICATION COMPLETE');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('🌐 View all tours at:');
    console.log('   https://admin.wondersofrome.com/admin/collections/tours\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

verifyTourVariations();
