
const PAYLOAD_URL = 'https://admin.wondersofrome.com';
const ADMIN_BYPASS_KEY = 'g3UDzJOPpj-_EOLcFzyy2mhVp75H62zHwNrJL5Kb-hU';
const SITE_ID = 'goldenrometour';

async function checkPayload() {
  const url = `${PAYLOAD_URL}/api/tours?where[tenant][equals]=${SITE_ID}&where[active][equals]=true&depth=1`;
  console.log(`Fetching: ${url}`);
  
  try {
    const res = await fetch(url, {
      headers: {
        'Authorization': `users API-Key ${ADMIN_BYPASS_KEY}`,
      },
    });
    
    if (!res.ok) {
      console.error(`HTTP Error: ${res.status}`);
      return;
    }
    
    const data = await res.json();
    console.log(`Total tours found for ${SITE_ID}: ${data.totalDocs}`);
    if (data.docs && data.docs.length > 0) {
      data.docs.forEach(doc => {
        console.log(`- ${doc.title} (Slug: ${doc.slug})`);
      });
    } else {
      console.log('No tours found in Payload for this tenant.');
    }
  } catch (e) {
    console.error('Fetch failed:', e);
  }
}

checkPayload();
