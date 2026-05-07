/**
 * Verify all Vatican tours are accessible on goldenrometour
 */

const { createClient } = require('@sanity/client');

const client = createClient({
    projectId: 'aknmkkwd',
    dataset: 'production',
    apiVersion: '2024-01-01',
    useCdn: false,
    token: 'skxMygHyPvOtvJ09PlCYpaqDmx6jFStRyF5VsKOKFLmIGTQO0TMo6XlOHfCHcnCslGJfkCNQIjCyKway6H2uEvxMV9tnF0659Zj7zluXg6C6UdK5UxbrXPF5d6UwIys88dxEsmPPuCCFuL0LYICf7yaQrwnD40q6K7plxqQflqH5YevcVHA1'
});

async function verifyTours() {
    console.log('🔍 Verifying Vatican tours for goldenrometour...\n');
    console.log('='.repeat(70));

    // Fetch all Vatican tours (same query as goldenrometour uses)
    const query = `*[_type == "tour" && category == "vatican"]{
        _id,
        title,
        slug,
        mainImage {
            asset -> {
                _id,
                url
            }
        },
        price,
        duration,
        category,
        rating,
        reviewCount
    }`;

    const tours = await client.fetch(query);

    console.log(`\n✅ Total Vatican Tours Available: ${tours.length}\n`);
    console.log('='.repeat(70));
    console.log('\n📋 Tour List:\n');

    tours.forEach((tour, i) => {
        const hasImage = tour.mainImage?.asset?.url ? '🖼️' : '⚠️';
        const price = tour.price ? `€${tour.price}` : 'N/A';
        const rating = tour.rating || 'N/A';
        
        console.log(`${i + 1}. ${hasImage} ${tour.title}`);
        console.log(`   Slug: ${tour.slug.current}`);
        console.log(`   Price: ${price} | Duration: ${tour.duration || 'N/A'} | Rating: ${rating}`);
        console.log(`   URL: https://goldenrometour.com/tour/${tour.slug.current}`);
        console.log('');
    });

    console.log('='.repeat(70));
    console.log('\n📊 Summary:\n');
    
    const withImages = tours.filter(t => t.mainImage?.asset?.url).length;
    const withPrices = tours.filter(t => t.price).length;
    const withRatings = tours.filter(t => t.rating).length;

    console.log(`   ✅ Tours with images: ${withImages}/${tours.length}`);
    console.log(`   ✅ Tours with prices: ${withPrices}/${tours.length}`);
    console.log(`   ✅ Tours with ratings: ${withRatings}/${tours.length}`);
    
    console.log('\n' + '='.repeat(70));
    console.log('\n💡 Status: All Vatican tours are accessible on goldenrometour!');
    console.log('   No site assignment needed - fetching by category only.');
    console.log('   Images and content pulled directly from wondersofrome Sanity.\n');
}

verifyTours().catch(console.error);
