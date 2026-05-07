/**
 * Add fallback images for tours missing mainImage in Sanity
 * This script identifies tours without images and suggests Vatican-themed fallback images
 */

const { createClient } = require('@sanity/client');

const client = createClient({
    projectId: 'aknmkkwd',
    dataset: 'production',
    apiVersion: '2024-01-01',
    useCdn: false,
    token: 'skxMygHyPvOtvJ09PlCYpaqDmx6jFStRyF5VsKOKFLmIGTQO0TMo6XlOHfCHcnCslGJfkCNQIjCyKway6H2uEvxMV9tnF0659Zj7zluXg6C6UdK5UxbrXPF5d6UwIys88dxEsmPPuCCFuL0LYICf7yaQrwnD40q6K7plxqQflqH5YevcVHA1'
});

// High-quality Vatican fallback images from Unsplash
const fallbackImages = {
    'vatican-museums': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1920&q=85',
    'sistine-chapel': 'https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=1920&q=85',
    'st-peters': 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=1920&q=85',
    'vatican-gardens': 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=1920&q=85',
    'early-morning': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1920&q=85',
    'complete-tour': 'https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=1920&q=85'
};

async function checkMissingImages() {
    console.log('🔍 Checking for tours without images...\n');

    const query = `*[_type == "tour" && category == "vatican"]{
        _id,
        title,
        slug,
        mainImage {
            asset -> {
                _id,
                url
            }
        }
    }`;

    const tours = await client.fetch(query);
    const toursWithoutImages = tours.filter(t => !t.mainImage?.asset?.url);

    console.log(`📊 Total Vatican tours: ${tours.length}`);
    console.log(`⚠️  Tours without images: ${toursWithoutImages.length}\n`);

    if (toursWithoutImages.length === 0) {
        console.log('✅ All tours have images!');
        return;
    }

    console.log('📋 Tours missing images:\n');
    toursWithoutImages.forEach((tour, i) => {
        console.log(`${i + 1}. ${tour.title}`);
        console.log(`   Slug: ${tour.slug.current}`);
        console.log(`   ID: ${tour._id}`);
        
        // Suggest fallback based on tour type
        let suggestedFallback = fallbackImages['vatican-museums'];
        if (tour.title.toLowerCase().includes('sistine')) {
            suggestedFallback = fallbackImages['sistine-chapel'];
        } else if (tour.title.toLowerCase().includes('peter')) {
            suggestedFallback = fallbackImages['st-peters'];
        } else if (tour.title.toLowerCase().includes('garden')) {
            suggestedFallback = fallbackImages['vatican-gardens'];
        } else if (tour.title.toLowerCase().includes('early morning')) {
            suggestedFallback = fallbackImages['early-morning'];
        } else if (tour.title.toLowerCase().includes('complete')) {
            suggestedFallback = fallbackImages['complete-tour'];
        }
        
        console.log(`   Suggested fallback: ${suggestedFallback}`);
        console.log('');
    });

    console.log('\n💡 SOLUTION:');
    console.log('   Option 1: Add images in Sanity Studio (wondersofrome)');
    console.log('   Option 2: Tours will use fallback images automatically');
    console.log('   Option 3: Update tour component to use better fallbacks\n');
}

checkMissingImages().catch(console.error);
