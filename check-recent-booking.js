const https = require('https');

// Let's test with your actual email to see if the webhook would work
const testBooking = {
  name: "Test User",
  email: "abiileshofficial@gmail.com", // Your verified email
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

console.log('🧪 Testing with your verified email address...');
console.log('📧 Test booking data:', testBooking);

const req = https.request(options, (res) => {
  console.log(`📊 Status Code: ${res.statusCode}`);

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
        console.log('\n🎉 EMAIL SENT TO YOUR VERIFIED ADDRESS!');
        console.log('📧 Check abiileshofficial@gmail.com for the confirmation email');
        console.log('\n💡 DIAGNOSIS:');
        console.log('- Direct booking API: ✅ Working');
        console.log('- Email templates: ✅ Working');
        console.log('- Resend API: ✅ Working');
        console.log('- Issue likely: Stripe webhook not triggering properly');
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