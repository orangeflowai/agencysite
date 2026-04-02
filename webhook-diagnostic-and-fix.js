const https = require('https');
const crypto = require('crypto');

console.log('🔍 COMPREHENSIVE WEBHOOK DIAGNOSTIC');
console.log('=====================================');

// Test 1: Check if webhook endpoint is accessible
console.log('\n1️⃣ Testing webhook endpoint accessibility...');

const testEndpoint = () => {
  return new Promise((resolve) => {
    const req = https.request({
      hostname: 'ticketsinrome.com',
      port: 443,
      path: '/api/webhooks/stripe',
      method: 'GET'
    }, (res) => {
      console.log(`   Status: ${res.statusCode} (405 expected for GET)`);
      console.log(`   ✅ Endpoint is accessible`);
      resolve(true);
    });
    
    req.on('error', (e) => {
      console.log(`   ❌ Endpoint not accessible: ${e.message}`);
      resolve(false);
    });
    
    req.end();
  });
};

// Test 2: Simulate a real Stripe webhook
console.log('\n2️⃣ Testing webhook with simulated Stripe payload...');

const testWebhook = () => {
  return new Promise((resolve) => {
    // Create a realistic payment_intent.succeeded payload
    const mockPayload = {
      id: 'evt_test_webhook_' + Date.now(),
      object: 'event',
      api_version: '2020-08-27',
      created: Math.floor(Date.now() / 1000),
      data: {
        object: {
          id: 'pi_test_' + Date.now(),
          object: 'payment_intent',
          amount: 8900, // €89.00
          currency: 'eur',
          status: 'succeeded',
          receipt_email: 'abiileshofficial@gmail.com',
          metadata: {
            tourTitle: 'Vatican Museums & Sistine Chapel Guided Tour',
            tourSlug: 'vatican-museums-sistine-chapel-guided-tour',
            date: '2026-03-15',
            time: '10:00 AM',
            guests: '2',
            adults: '2',
            students: '0',
            youths: '0',
            leadName: 'Test Customer',
            leadEmail: 'abiileshofficial@gmail.com',
            leadPhone: '+1234567890'
          }
        }
      },
      livemode: false,
      pending_webhooks: 1,
      request: {
        id: 'req_test',
        idempotency_key: null
      },
      type: 'payment_intent.succeeded'
    };

    const payload = JSON.stringify(mockPayload);
    const webhookSecret = 'whsec_aBF43dJtxyQKRPKCNu2SrEYwL7vUMSRk';

    // Generate proper Stripe signature
    const timestamp = Math.floor(Date.now() / 1000);
    const signedPayload = timestamp + '.' + payload;
    const signature = crypto
      .createHmac('sha256', webhookSecret)
      .update(signedPayload, 'utf8')
      .digest('hex');

    const stripeSignature = `t=${timestamp},v1=${signature}`;

    const options = {
      hostname: 'ticketsinrome.com',
      port: 443,
      path: '/api/webhooks/stripe',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
        'Stripe-Signature': stripeSignature
      }
    };

    console.log(`   📧 Test email: ${mockPayload.data.object.metadata.leadEmail}`);
    console.log(`   🎫 Test tour: ${mockPayload.data.object.metadata.tourTitle}`);
    console.log(`   💰 Test amount: €${mockPayload.data.object.amount / 100}`);

    const req = https.request(options, (res) => {
      console.log(`   Status: ${res.statusCode}`);

      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        console.log(`   Response: ${data}`);
        try {
          const response = JSON.parse(data);
          if (response.received) {
            console.log(`   ✅ Webhook processed successfully`);
            console.log(`   📧 Check email: abiileshofficial@gmail.com`);
            console.log(`   🗄️ Check admin panel for new booking`);
          } else {
            console.log(`   ❌ Webhook failed: ${response.error || 'Unknown error'}`);
          }
        } catch (e) {
          console.log(`   ❌ Invalid response format`);
        }
        resolve(true);
      });
    });

    req.on('error', (e) => {
      console.log(`   ❌ Request failed: ${e.message}`);
      resolve(false);
    });

    req.write(payload);
    req.end();
  });
};

// Test 3: Check database connection
console.log('\n3️⃣ Testing database connectivity...');

const testDatabase = () => {
  return new Promise((resolve) => {
    // Test the debug endpoint to check database
    const req = https.request({
      hostname: 'ticketsinrome.com',
      port: 443,
      path: '/api/debug/supabase',
      method: 'GET'
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        console.log(`   Status: ${res.statusCode}`);
        if (res.statusCode === 200) {
          console.log(`   ✅ Database connection working`);
        } else {
          console.log(`   ❌ Database connection issue`);
        }
        resolve(true);
      });
    });
    
    req.on('error', (e) => {
      console.log(`   ❌ Database test failed: ${e.message}`);
      resolve(false);
    });
    
    req.end();
  });
};

// Run all tests
async function runDiagnostics() {
  await testEndpoint();
  await testDatabase();
  await testWebhook();
  
  console.log('\n🎯 DIAGNOSIS COMPLETE');
  console.log('====================');
  console.log('If webhook test succeeded:');
  console.log('- ✅ Check your email for confirmation');
  console.log('- ✅ Check admin panel for new booking');
  console.log('- ✅ Webhook system is working');
  console.log('');
  console.log('If webhook test failed:');
  console.log('- ❌ Check Stripe dashboard webhook configuration');
  console.log('- ❌ Verify webhook secret matches');
  console.log('- ❌ Check server logs for errors');
}

runDiagnostics();