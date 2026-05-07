/**
 * Check detailed tour data including images and highlights
 */

const { createClient } = require('@sanity/client');

const client = createClient({
    projectId: 'aknmkkwd',
    dataset: 'production',
    apiVersion: '2024-01-01',
    useCdn: false,
    token: 'skxMygHyPvOtvJ09PlCYpaqDmx6jFStRyF5VsKOKFLmIGTQO0TMo6XlOHfCHcnCslGJfkCNQIjCyKway6H2uEvxMV9tnF0659Zj7zluXg6C6UdK5UxbrXPF5d6UwIys88dxEsmPPuCCFuL0LYICf7yaQrwnD40q6K7plxqQflqH5YevcVHA1'
});

const toursToCheck = [
    'vatican-museums-skip-line-audio-guide',
    'st-peters-basilica-dome-crypt',
    'golden-vatican-museums-sistine-chapel',
    'early-morning-vatican-tour',
    'vatican-gardens-private-tour',
    'golden-vatican-complete-tour'
];

async function checkTourData() {
    console.log('🔍 Checking detailed tour data...\n');
    console.log('='.repeat(80));

    for (const slug of toursToCheck) {
        const query = `*[_type == "tour" && slug.current == $slug && category == "vatican"][0]{
            _id,
            title,
            slug,
            mainImage {
                asset -> {
                    _id,
                    url
                }
            },
            gallery[] {
                asset -> {
                    _id,
                    url
                }
            },
            highlights,
            features,
            price,
            duration,
            category
        }`;

        const tour = await client.fetch(query, { slug });

        if (!tour) {
            console.log(`\n❌ NOT FOUND: ${slug}`);
            console.log('='.repeat(80));
            continue;
        }

        console.log(`\n✅ ${tour.title}`);
        console.log(`   Slug: ${slug}`);
        console.log(`   Price: €${tour.price || 'N/A'}`);
        console.log(`   Duration: ${tour.duration || 'N/A'}`);
        
        // Check main image
        if (tour.mainImage?.asset?.url) {
            console.log(`   🖼️  Main Image: YES`);
            console.log(`      URL: ${tour.mainImage.asset.url.substring(0, 60)}...`);
        } else {
            console.log(`   ⚠️  Main Image: MISSING - will use fallback`);
        }

        // Check gallery
        if (tour.gallery && tour.gallery.length > 0) {
            console.log(`   📸 Gallery: ${tour.gallery.length} images`);
        } else {
            console.log(`   📸 Gallery: None`);
        }

        // Check highlights/features
        const highlights = tour.highlights || tour.features || [];
        if (highlights.length > 0) {
            console.log(`   ✨ Highlights: ${highlights.length} items`);
            highlights.slice(0, 3).forEach((h, i) => {
                const text = typeof h === 'string' ? h : (h?.item || h?.name || 'Unknown');
                console.log(`      ${i + 1}. ${text.substring(0, 60)}${text.length > 60 ? '...' : ''}`);
            });
            if (highlights.length > 3) {
                console.log(`      ... and ${highlights.length - 3} more`);
            }
        } else {
            console.log(`   ⚠️  Highlights: MISSING`);
        }

        console.log('='.repeat(80));
    }

    console.log('\n💡 SUMMARY:');
    console.log('   Tours without main images will use smart fallbacks');
    console.log('   Tours without highlights will show default features');
    console.log('   All tours should display properly on the website\n');
}

checkTourData().catch(console.error);
