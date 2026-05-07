/**
 * Check Vatican tours in Sanity for goldenrometour
 */

const { createClient } = require('@sanity/client');

const client = createClient({
    projectId: 'aknmkkwd',
    dataset: 'production',
    apiVersion: '2024-01-01',
    useCdn: false,
    token: 'skxMygHyPvOtvJ09PlCYpaqDmx6jFStRyF5VsKOKFLmIGTQO0TMo6XlOHfCHcnCslGJfkCNQIjCyKway6H2uEvxMV9tnF0659Zj7zluXg6C6UdK5UxbrXPF5d6UwIys88dxEsmPPuCCFuL0LYICf7yaQrwnD40q6K7plxqQflqH5YevcVHA1'
});

async function checkTours() {
    console.log('🔍 Checking Sanity tours for goldenrometour...\n');

    // 1. Check if goldenrometour site exists
    const siteQuery = `*[_type == "site" && slug.current == "goldenrometour"][0]{ _id, title, slug }`;
    const site = await client.fetch(siteQuery);
    
    if (!site) {
        console.log('❌ goldenrometour site NOT found in Sanity');
        console.log('   You need to create a site document in Sanity with slug "goldenrometour"');
        return;
    }
    
    console.log('✅ Site found:', site.title, `(${site._id})`);
    console.log('');

    // 2. Check all Vatican tours
    const allVaticanQuery = `*[_type == "tour" && category == "vatican"]{ 
        _id, 
        title, 
        slug, 
        category,
        "siteRefs": sites[]._ref
    }`;
    const allVaticanTours = await client.fetch(allVaticanQuery);
    
    console.log(`📊 Total Vatican tours in Sanity: ${allVaticanTours.length}`);
    console.log('');

    // 3. Check which tours are assigned to goldenrometour
    const assignedTours = allVaticanTours.filter(t => 
        t.siteRefs && t.siteRefs.includes(site._id)
    );
    
    console.log(`✅ Vatican tours assigned to goldenrometour: ${assignedTours.length}`);
    if (assignedTours.length > 0) {
        assignedTours.forEach((tour, i) => {
            console.log(`   ${i + 1}. ${tour.title} (${tour.slug.current})`);
        });
    }
    console.log('');

    // 4. Check which tours are NOT assigned
    const unassignedTours = allVaticanTours.filter(t => 
        !t.siteRefs || !t.siteRefs.includes(site._id)
    );
    
    console.log(`⚠️  Vatican tours NOT assigned to goldenrometour: ${unassignedTours.length}`);
    if (unassignedTours.length > 0) {
        console.log('   These tours need to be assigned in Sanity:');
        unassignedTours.slice(0, 10).forEach((tour, i) => {
            console.log(`   ${i + 1}. ${tour.title} (${tour.slug.current})`);
        });
        if (unassignedTours.length > 10) {
            console.log(`   ... and ${unassignedTours.length - 10} more`);
        }
    }
    console.log('');

    // 5. Recommendation
    console.log('💡 RECOMMENDATION:');
    if (assignedTours.length < allVaticanTours.length) {
        console.log('   You need to assign Vatican tours to goldenrometour in Sanity Studio:');
        console.log('   1. Go to Sanity Studio');
        console.log('   2. Edit each Vatican tour');
        console.log('   3. In the "Sites" field, add "goldenrometour"');
        console.log('   4. Publish the changes');
    } else {
        console.log('   ✅ All Vatican tours are assigned to goldenrometour!');
    }
}

checkTours().catch(console.error);
