
const PAYLOAD_URL = 'https://admin.wondersofrome.com';
const ADMIN_BYPASS_KEY = 'g3UDzJOPpj-_EOLcFzyy2mhVp75H62zHwNrJL5Kb-hU';
const SITE_ID = 'goldenrometour';

async function checkPayloadSettings() {
  const url = `${PAYLOAD_URL}/api/site-settings?where[tenant][equals]=${SITE_ID}&limit=1`;
  console.log(`Fetching settings for ${SITE_ID}: ${url}`);
  
  try {
    const res = await fetch(url, {
      headers: {
        'Authorization': `users API-Key ${ADMIN_BYPASS_KEY}`,
      },
    });
    
    const data = await res.json();
    if (data.docs && data.docs.length > 0) {
      const settings = data.docs[0];
      console.log('--- SITE SETTINGS ---');
      console.log(`Site Name: ${settings.siteName}`);
      console.log(`Tenant: ${settings.tenant}`);
      console.log(`Hero Title: ${settings.heroTitle}`);
      console.log(`Hero Subtitle: ${settings.heroSubtitle}`);
      console.log(`Brand Colors:`, JSON.stringify(settings.brandColors, null, 2));
    } else {
      console.log('No settings found in Payload for this tenant.');
    }
  } catch (e) {
    console.error('Fetch failed:', e);
  }
}

checkPayloadSettings();
