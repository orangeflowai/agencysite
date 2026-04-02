const https = require('https');

// Test booking data
const testBooking = {
  name: "John Smith",
  email: "test.customer@gmail.com", // Testing with real customer email
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

console.log('🧪 Testing email booking functionality...');
console.log('📧 Test booking data:', testBooking);
console.log('🌐 Making request to: https://ticketsinrome.com/api/book');

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
      console.log('\n✅ RESULTS:');
      console.log('- Success:', response.success);
      console.log('- Email Sent:', response.emailSent);
      console.log('- Email Error:', response.emailError || 'None');
      
      if (response.emailSent) {
        console.log('\n🎉 EMAIL FUNCTIONALITY IS WORKING!');
        console.log('📧 Check the test email address for confirmation email');
      } else {
        console.log('\n❌ EMAIL SENDING FAILED');
        console.log('🔍 Error:', response.emailError);
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