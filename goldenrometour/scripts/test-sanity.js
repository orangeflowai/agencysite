
const { createClient } = require('@sanity/client');

const client = createClient({
    projectId: 'aknmkkwd',
    dataset: 'production',
    apiVersion: '2024-01-01',
    useCdn: false,
});

async function checkSanity() {
    console.log('🔍 Checking Sanity Vatican tours...\n');
    
    const query = `*[_type == "tour" && category == "vatican"]{
        _id,
        title,
        slug,
        "mainImageUrl": mainImage.asset->url,
        price,
        duration,
        category,
        highlights,
        "description": pt::text(description)
    }`;

    try {
        const tours = await client.fetch(query);
        console.log(`Total Vatican tours in Sanity: ${tours.length}`);
        if (tours.length > 0) {
            tours.slice(0, 3).forEach(tour => {
                console.log(`- ${tour.title} (Slug: ${tour.slug?.current})`);
                console.log(`  Price: ${tour.price}`);
                console.log(`  Main Image: ${tour.mainImageUrl}`);
                console.log(`  Description: ${tour.description?.substring(0, 100)}...`);
            });
        }
    } catch (e) {
        console.error('Sanity fetch failed:', e);
    }
}

checkSanity();
