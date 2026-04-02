const https = require('https');
const crypto = require('crypto');

console.log('🔍 DEBUGGING WEBHOOK SPECIFIC ISSUE');
console.log('===================================');

// The direct booking API works, but webhook fails
// Let's test with minimal webhook payload to isolate the issue

const minimalPayload = {
  id: 'evt_test_minimal',
  object: 'event',
  api_version: '2020-08-27',
  created: Math.floor(Date.now() / 1000),
  data: {
    object: {
      id: 'pi_test_minimal_' + Date.now(),
      object: 'payment_intent',
      amount: 8900,
      currency: 'eur',
      status: 'succeeded',
      receipt_email: 'abiileshofficial@gmail.com',
      metadata: {
        tourTitle: 'Test Tour',
        tourSlug: 'test-tour',
        date: '2026-03-15',
        time: '10:00 AM',
        guests: '1',
        adults: '1',
        students: '0',
        youths: '0',
        leadName: 'Test User',
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

const payload = JSON.stringify(minimalPayload);
const webhookSecret = 'whsec_aBF43dJtxyQKRPKCNu2SrEYwL7vUMSRk';

// Generate Stripe signature
const timestamp = Math.floor(Date.now() / 1000);
const signedPayload = timestamp + '.' + payload;
const signature = crypto
  .createHmac('sha256', webhookSecret)
  .update(signedPayload, 'utf8')
  .digest('hex');

const stripeSignature = `t=${timestamp},v1=${signature}`;

console.log('📝 Testing with minimal payload...');
console.log('🔐 Webhook secret configured:', webhookSecret.substring(0, 10) + '...');
console.log('📧 Test email:', minimalPayload.data.object.metadata.leadEmail);

const options = {
  hostname: 'ticketsinrome.com',
  port: 443,
  path: '/api/webhooks/stripe',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload),
    'Stripe-Signature': stripeSignature,
    'User-Agent': 'Stripe/1.0 (+https://stripe.com/docs/webhooks)'
  }
};

const req = https.request(options, (res) => {
  console.log(`\n📊 Response Status: ${res.statusCode}`);
  console.log('📋 Response Headers:', res.headers);

  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('📨 Response Body:', data);
    
    try {
      const response = JSON.parse(data);
      
      if (res.statusCode === 200 && response.received) {
        console.log('\n🎉 WEBHOOK SUCCESS!');
        console.log('✅ Webhook processed correctly');
        console.log('📧 Check email: abiileshofficial@gmail.com');
        console.log('🗄️ Check admin panel for new booking');
        console.log('\n💡 SOLUTION: Your webhook is working!');
        console.log('   The issue was likely:');
        console.log('   - Stripe not calling your webhook');
        console.log('   - Wrong webhook URL in Stripe dashboard');
        console.log('   - Webhook events not configured in Stripe');
      } else {
        console.log('\n❌ WEBHOOK FAILED');
        console.log('Error:', response.error || 'Unknown error');
        console.log('\n🔍 POSSIBLE CAUSES:');
        console.log('   - Database schema mismatch');
        console.log('   - Missing required fields');
        console.log('   - Supabase permissions issue');
        console.log('   - Server configuration problem');
      }
    } catch (e) {
      console.log('\n❌ INVALID RESPONSE FORMAT');
      console.log('Raw response:', data);
    }
  });
});

req.on('error', (e) => {
  console.error('\n❌ REQUEST FAILED:', e.message);
});

console.log('\n🚀 Sending webhook test...');
req.write(payload);
req.end();