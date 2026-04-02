const https = require('https');

console.log('🔍 TESTING DATABASE SCHEMA');
console.log('==========================');

// Let's test what happens when we try to insert a booking with minimal data
// This will help us understand what fields are required vs optional

const testCases = [
  {
    name: "Minimal Required Fields",
    data: {
      tour_title: "Test Tour",
      tour_slug: "test-tour",
      date: "2026-03-15",
      time: "10:00 AM",
      guests: 1,
      total_price: 89.00,
      customer_name: "Test User",
      customer_email: "test@example.com",
      status: "paid",
      stripe_payment_intent_id: "pi_test_123"
    }
  },
  {
    name: "Full Fields (like webhook)",
    data: {
      tour_title: "Test Tour",
      tour_slug: "test-tour", 
      date: "2026-03-15",
      time: "10:00 AM",
      guests: 1,
      total_price: 89.00,
      customer_name: "Test User",
      customer_email: "test@example.com",
      customer_phone: "+1234567890",
      status: "paid",
      stripe_payment_intent_id: "pi_test_456",
      adults: 1,
      students: 0,
      youths: 0,
      guest_details: {
        hotel: null,
        pickup: null,
        luggage: null,
        addOns: [],
        guestCounts: {}
      },
      site_id: "rome-tour-tickets"
    }
  }
];

async function testDatabaseInsert(testCase) {
  return new Promise((resolve) => {
    console.log(`\n🧪 Testing: ${testCase.name}`);
    
    const payload = JSON.stringify({
      action: 'test_insert',
      table: 'bookings',
      data: testCase.data
    });

    // We'll create a debug endpoint to test database inserts
    const options = {
      hostname: 'ticketsinrome.com',
      port: 443,
      path: '/api/debug/supabase',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        console.log(`   Status: ${res.statusCode}`);
        console.log(`   Response: ${data}`);
        
        if (res.statusCode === 200) {
          console.log(`   ✅ ${testCase.name} - SUCCESS`);
        } else {
          console.log(`   ❌ ${testCase.name} - FAILED`);
        }
        resolve();
      });
    });

    req.on('error', (e) => {
      console.log(`   ❌ ${testCase.name} - ERROR: ${e.message}`);
      resolve();
    });

    req.write(payload);
    req.end();
  });
}

// Alternative: Let's check what the actual error is by looking at the webhook response more carefully
console.log('\n🔍 Let\'s also check the exact webhook error...');

const webhookPayload = {
  id: 'evt_debug_schema',
  object: 'event',
  api_version: '2020-08-27',
  created: Math.floor(Date.now() / 1000),
  data: {
    object: {
      id: 'pi_debug_schema',
      object: 'payment_intent',
      amount: 8900,
      currency: 'eur',
      status: 'succeeded',
      receipt_email: 'abiileshofficial@gmail.com',
      metadata: {
        tourTitle: 'Debug Schema Test',
        tourSlug: 'debug-schema-test',
        date: '2026-03-15',
        time: '10:00 AM',
        guests: '1',
        adults: '1',
        students: '0',
        youths: '0',
        leadName: 'Debug User',
        leadEmail: 'abiileshofficial@gmail.com'
      }
    }
  },
  livemode: false,
  pending_webhooks: 1,
  request: {
    id: 'req_debug',
    idempotency_key: null
  },
  type: 'payment_intent.succeeded'
};

console.log('\n💡 DIAGNOSIS APPROACH:');
console.log('1. The direct /api/book works (no database issues there)');
console.log('2. The webhook fails at "Booking creation failed"');
console.log('3. This suggests the webhook is trying to insert different data');
console.log('4. Or the webhook has different database permissions');
console.log('\n🎯 LIKELY CAUSES:');
console.log('- Webhook uses supabaseAdmin, /api/book uses regular supabase');
console.log('- Different field names or data types');
console.log('- Missing site_id or other required fields');
console.log('- JSON field formatting issues (guest_details)');

console.log('\n📋 NEXT STEPS:');
console.log('1. Check if supabaseAdmin has proper permissions');
console.log('2. Compare webhook data vs /api/book data');
console.log('3. Check database table schema in Supabase dashboard');
console.log('4. Add better error logging to webhook');