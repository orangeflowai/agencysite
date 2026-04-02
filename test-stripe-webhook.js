const https = require('https');
const crypto = require('crypto');

// Mock Stripe webhook payload for payment_intent.succeeded
const mockPayload = {
  id: 'evt_test_webhook',
  object: 'event',
  api_version: '2020-08-27',
  created: Math.floor(Date.now() / 1000),
  data: {
    object: {
      id: 'pi_test_payment_intent',
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
        leadName: 'John Smith',
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

// Generate Stripe signature
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

console.log('🧪 Testing Stripe webhook functionality...');
console.log('📧 Mock payment data:', mockPayload.data.object.metadata);
console.log('🔐 Stripe signature:', stripeSignature);
console.log('🌐 Making request to: https://ticketsinrome.com/api/webhooks/stripe');

const req = https.request(options, (res) => {
  console.log(`📊 Status Code: ${res.statusCode}`);
  console.log(`📋 Headers:`, res.headers);

  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('📨 Response Body:', data);
    try {
      const response = JSON.parse(data);
      console.log('\n✅ WEBHOOK RESULTS:');
      console.log('- Received:', response.received);
      console.log('- Site:', response.site);
      
      if (response.received) {
        console.log('\n🎉 STRIPE WEBHOOK IS WORKING!');
        console.log('📧 Check email for booking confirmation');
      } else {
        console.log('\n❌ WEBHOOK PROCESSING FAILED');
      }
    } catch (e) {
      console.log('❌ Failed to parse response:', e.message);
      console.log('Raw response:', data);
    }
  });
});

req.on('error', (e) => {
  console.error('❌ Request error:', e.message);
});

req.write(payload);
req.end();