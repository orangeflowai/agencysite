const https = require('https');

// Test Resend API directly
const testEmail = {
  from: 'Tickets in Rome <bookings@ticketsinrome.com>',
  to: ['test.customer@gmail.com'],
  subject: 'Test Email from Tickets in Rome',
  html: '<h1>Test Email</h1><p>This is a test email to verify Resend API is working.</p>'
};

const postData = JSON.stringify(testEmail);

const options = {
  hostname: 'api.resend.com',
  port: 443,
  path: '/emails',
  method: 'POST',
  headers: {
    'Authorization': 'Bearer re_GtXjh56Y_5m8EnUQyA8T5mGA3m8epSVyS',
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

console.log('🧪 Testing Resend API directly...');
console.log('📧 Test email data:', testEmail);

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
      console.log('\n✅ RESEND API RESULTS:');
      if (res.statusCode === 200) {
        console.log('- Email ID:', response.id);
        console.log('🎉 RESEND API IS WORKING!');
      } else {
        console.log('❌ RESEND API ERROR:', response);
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

req.write(postData);
req.end();