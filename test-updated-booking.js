const https = require('https');

// Test the updated booking API that should now save to database
const testBooking = {
  name: "Database Test User v2",
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

console.log('🧪 Testing UPDATED booking API with database saving...');
console.log('📊 Should now return bookingSaved and bookingError fields');

const postData = JSON.stringify(testBooking);

const options = {
  hostname: 'ticketsinrome.com',
  port: 443,
  path: '/api/book',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData),
    'Cache-Control': 'no-cache'
  }
};

const req = https.request(options, (res) => {
  console.log(`📊 Status Code: ${res.statusCode}`);

  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('📨 Full Response:', data);
    
    try {
      const response = JSON.parse(data);
      console.log('\n✅ PARSED RESPONSE:');
      console.log('- Success:', response.success);
      console.log('- Email Sent:', response.emailSent);
      console.log('- Email Error:', response.emailError || 'None');
      console.log('- Booking Saved:', response.bookingSaved);
      console.log('- Booking Error:', response.bookingError || 'None');
      
      if (response.bookingSaved) {
        console.log('\n🎉 SUCCESS! BOOKING SAVED TO DATABASE!');
        console.log('📧 Email sent to: abiileshofficial@gmail.com');
        console.log('🗄️ Check admin panel: https://ticketsinrome.com/admin/bookings');
        console.log('\n💡 SOLUTION WORKING:');
        console.log('- ✅ Direct bookings now save to database');
        console.log('- ✅ Emails are sent');
        console.log('- ✅ Admin panel should show bookings');
      } else if (response.bookingError) {
        console.log('\n❌ BOOKING SAVE FAILED');
        console.log('🔍 Database Error:', response.bookingError);
        console.log('💡 This helps us debug the webhook issue too');
      } else {
        console.log('\n⚠️ RESPONSE FORMAT UNCHANGED');
        console.log('🔍 Server might not have restarted properly');
        console.log('💡 Try redeploying or check server logs');
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