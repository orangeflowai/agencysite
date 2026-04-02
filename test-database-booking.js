const https = require('https');

// Test creating a booking directly via API to see database errors
const testBooking = {
  name: "Database Test User",
  email: "abiileshofficial@gmail.com",
  phone: "+1234567890",
  tourTitle: "Vatican Museums & Sistine Chapel Guided Tour",
  tourSlug: "vatican-museums-sistine-chapel-guided-tour",
  date: "2026-03-15",
  time: "10:00 AM",
  guests: 2,
  adults: 2,
  students: 0,
  youths: 0,
  price: "89.00",
  addOns: []
};

console.log('🧪 Testing database booking creation...');
console.log('📊 This will help identify database schema issues');

const postData = JSON.stringify(testBooking);

const options = {
  hostname: 'ticketsinrome.com',
  port: 443,
  path: '/api/book',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = https.request(options, (res) => {
  console.log(`📊 Status Code: ${res.statusCode}`);

  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('📨 Response:', data);
    
    if (res.statusCode === 200) {
      console.log('\n✅ DIRECT BOOKING API WORKS');
      console.log('📧 Email should be sent');
      console.log('🔍 Now testing admin panel access...');
      
      // Test admin panel
      setTimeout(() => {
        console.log('\n🔗 Check admin panel at: https://ticketsinrome.com/admin/bookings');
        console.log('📝 If no bookings show, the issue is:');
        console.log('   1. Webhook not being called by Stripe');
        console.log('   2. Database schema mismatch');
        console.log('   3. Supabase permissions issue');
      }, 2000);
    } else {
      console.log('\n❌ BOOKING API FAILED');
      console.log('🔍 This indicates a server or database issue');
    }
  });
});

req.on('error', (e) => {
  console.error('❌ Request error:', e.message);
});

req.write(postData);
req.end();