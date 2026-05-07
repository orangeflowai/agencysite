/**
 * Assign all Vatican tours to goldenrometour in Sanity
 */

const { createClient } = require('@sanity/client');

const client = createClient({
    projectId: 'aknmkkwd',
    dataset: 'production',
    apiVersion: '2024-01-01',
    useCdn: false,
    token: 'skxMygHyPvOtvJ09PlCYpaqDmx6jFStRyF5VsKOKFLmIGTQO0TMo6XlOHfCHcnCslGJfkCNQIjCyKway6H2uEvxMV9tnF0659Zj7zluXg6C6UdK5UxbrXPF5d6UwIys88dxEsmPPuCCFuL0LYICf7yaQrwnD40q6K7plxqQflqH5YevcVHA1'
});

async function assignVaticanTours() {
    console.log('🚀 Starting Vatican tours assignment to goldenrometour...\n');

    // 1. Get goldenrometour site ID
    const siteQuery = `*[_type == "site" && slug.current == "goldenrometour"][0]{ _id, title }`;
    const site = await client.fetch(siteQuery);
    
    if (!site) {
        console.log('❌ ERROR: goldenrometour site not found in Sanity');
        console.log('   Please create the site first in Sanity Studio');
        return;
    }
    
    console.log(`✅ Found site: ${site.title} (${site._id})\n`);

    // 2. Get all Vatican tours
    const toursQuery = `*[_type == "tour" && category == "vatican"]{ 
        _id, 
        title, 
        slug,
        "siteRefs": sites[]._ref
    }`;
    const tours = await client.fetch(toursQuery);
    
    console.log(`📊 Found ${tours.length} Vatican tours\n`);

    // 3. Filter tours that need assignment
    const toursToAssign = tours.filter(t => 
        !t.siteRefs || !t.siteRefs.includes(site._id)
    );

    if (toursToAssign.length === 0) {
        console.log('✅ All Vatican tours are already assigned to goldenrometour!');
        return;
    }

    console.log(`📝 Assigning ${toursToAssign.length} tours to goldenrometour...\n`);

    // 4. Assign tours
    let successCount = 0;
    let errorCount = 0;

    for (const tour of toursToAssign) {
        try {
            // Get current sites array
            const currentSites = tour.siteRefs || [];
            
            // Add goldenrometour site reference if not already present
            const updatedSites = [...currentSites, site._id].filter((v, i, a) => a.indexOf(v) === i);

            // Update the tour
            await client
                .patch(tour._id)
                .set({
                    sites: updatedSites.map(ref => ({
                        _type: 'reference',
                        _ref: ref
                    }))
                })
                .commit();

            console.log(`   ✅ ${tour.title}`);
            successCount++;
        } catch (error) {
            console.log(`   ❌ ${tour.title} - Error: ${error.message}`);
            errorCount++;
        }
    }

    console.log('\n' + '='.repeat(60));
    console.log(`✅ Successfully assigned: ${successCount} tours`);
    if (errorCount > 0) {
        console.log(`❌ Failed: ${errorCount} tours`);
    }
    console.log('='.repeat(60));
    console.log('\n💡 Next steps:');
    console.log('   1. Rebuild goldenrometour: npm run build');
    console.log('   2. All Vatican tours should now appear on the site');
}

assignVaticanTours().catch(console.error);
