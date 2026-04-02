const https = require('https');

// Test booking for Wonders of Rome
const testBooking = {
  name: "Test User - Wonders of Rome",
  email: "abiileshofficial@gmail.com",
  phone: "+1234567890",
  tourTitle: "Vatican Museums & Sistine Chapel Tour",
  tourSlug: "vatican-museums-tour",
  date: "2026-03-20",
  time: "10:00 AM",
  guests: 2,
  adults: 2,
  students: 0,
  youths: 0,
  price: "75.00",
  addOns: []
};

console.log('🧪 Testing Wonders of Rome Email System');
console.log('========================================');
console.log('📧 New Resend API Key: re_4uGgRC4b_MhURchUq42q3NyMcQw7GcJ2J');
console.log('🌐 Testing: https://wondersofrome.com/api/book');
console.log('');

const postData = JSON.stringify(testBooking);

const options = {
  hostname: 'wondersofrome.com',
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
    
    try {
      const response = JSON.parse(data);
      console.log('\n✅ RESULTS:');
      console.log('- Success:', response.success);
      console.log('- Email Sent:', response.emailSent);
      console.log('- Email Error:', response.emailError || 'None');
      console.log('- Booking Saved:', response.bookingSaved);
      console.log('- Booking Error:', response.bookingError || 'None');
      
      if (response.emailSent) {
        console.log('\n🎉 NEW API KEY IS WORKING!');
        console.log('📧 Check email: abiileshofficial@gmail.com');
        console.log('✅ Wonders of Rome email system operational');
      } else {
        console.log('\n❌ EMAIL SENDING FAILED');
        console.log('🔍 Error:', response.emailError);
        console.log('💡 Check:');
        console.log('   1. API key is valid');
        console.log('   2. Domain is verified in Resend');
        console.log('   3. Resend dashboard for errors');
      }
    } catch (e) {
      console.log('❌ Failed to parse response:', e.message);
    }
  });
});

req.on('error', (e) => {
  console.error('❌ Request error:', e.message);
});

req.write(postData);
req.end();