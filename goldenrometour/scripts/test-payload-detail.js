
const PAYLOAD_URL = 'https://admin.wondersofrome.com';
const ADMIN_BYPASS_KEY = 'g3UDzJOPpj-_EOLcFzyy2mhVp75H62zHwNrJL5Kb-hU';
const SITE_ID = 'goldenrometour';

async function checkPayloadDetail() {
  const url = `${PAYLOAD_URL}/api/tours?where[tenant][equals]=${SITE_ID}&where[active][equals]=true&limit=1&depth=2`;
  console.log(`Fetching detail for one tour: ${url}`);
  
  try {
    const res = await fetch(url, {
      headers: {
        'Authorization': `users API-Key ${ADMIN_BYPASS_KEY}`,
      },
    });
    
    const data = await res.json();
    if (data.docs && data.docs.length > 0) {
      const tour = data.docs[0];
      console.log('--- TOUR DETAIL ---');
      console.log(`Title: ${tour.title}`);
      console.log(`Slug: ${tour.slug}`);
      console.log(`Price: ${tour.price}`);
      console.log(`Category: ${tour.category}`);
      console.log(`Main Image URL: ${tour.imageUrl}`);
      console.log(`Main Image Object:`, JSON.stringify(tour.mainImage, null, 2));
      console.log(`Highlights:`, tour.highlights?.length);
      console.log(`Description length: ${tour.description?.length}`);
      
      // Check image resolution
      const PAYLOAD_URL_RESOLVED = 'https://admin.wondersofrome.com';
      function resolveImageUrl(doc) {
        if (doc.imageUrl) return doc.imageUrl
        if (doc.mainImage?.url) return doc.mainImage.url
        if (doc.mainImage?.filename) return `${PAYLOAD_URL_RESOLVED}/media/${doc.mainImage.filename}`
        return undefined
      }
      console.log(`Resolved URL: ${resolveImageUrl(tour)}`);
    }
  } catch (e) {
    console.error('Fetch failed:', e);
  }
}

checkPayloadDetail();
