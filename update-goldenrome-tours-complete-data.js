#!/usr/bin/env node

/**
 * Update existing Golden Rome Tour tours in Sanity with complete data
 * This script updates tours that already exist but have incomplete data
 */

const { createClient } = require('@sanity/client');
const fs = require('fs');

// Sanity Configuration for Golden Rome Tour
const client = createClient({
  projectId: 'gycprksj',
  dataset: 'production',
  token: 'skeQSaMgbnAImmtbn3XohXCsci4IyxcqABssnVLxL2Ky0Guw3pXKy6ZixI5p5VXEDqR4cZinHiNysAz7nULL5fWYrd6WZBp83NFcZHa5bvV2pRjZhIhrDcIVTXBX3Ogty24R5Fs2CovJFneD0KR1Ugl24D4ZlQrtv0Ra8tVqtj9oxNGchPfD',
  apiVersion: '2024-01-01',
  useCdn: false,
});

// Load the generated tours with complete data
const toursData = JSON.parse(fs.readFileSync('tours-premium-vip.json', 'utf8'));
const completeTours = toursData.tours;

console.log('🔄 Updating Golden Rome Tour tours with complete data...\n');
console.log(`📦 Loaded ${completeTours.length} tours from tours-premium-vip.json\n`);

async function updateTours() {
  let updated = 0;
  let skipped = 0;
  let errors = 0;

  for (const tour of completeTours) {
    try {
      // Find existing tour by slug
      const existing = await client.fetch(
        `*[_type == "tour" && slug.current == $slug][0]{_id, title, includes, excludes, importantInfo}`,
        { slug: tour.slug }
      );

      if (!existing) {
        console.log(`⏭️  Skipping "${tour.title}" - not found in Sanity`);
        skipped++;
        continue;
      }

      // Check if tour needs updating
      const needsUpdate = 
        !existing.includes || existing.includes.length === 0 ||
        !existing.excludes || existing.excludes.length === 0 ||
        !existing.importantInfo || existing.importantInfo.length === 0;

      if (!needsUpdate) {
        console.log(`✅ "${tour.title}" - already complete`);
        skipped++;
        continue;
      }

      // Prepare update data
      const updates = {};
      
      if (!existing.includes || existing.includes.length === 0) {
        updates.includes = tour.includes.map((item, idx) => ({
          _key: `inc${idx + 1}`,
          _type: 'listItem',
          item: item
        }));
      }

      if (!existing.excludes || existing.excludes.length === 0) {
        updates.excludes = tour.excludes.map((item, idx) => ({
          _key: `exc${idx + 1}`,
          _type: 'listItem',
          item: item
        }));
      }

      if (!existing.importantInfo || existing.importantInfo.length === 0) {
        updates.importantInfo = tour.importantInfo.map((item, idx) => ({
          _key: `info${idx + 1}`,
          _type: 'listItem',
          item: item
        }));
      }

      if (Object.keys(updates).length === 0) {
        console.log(`✅ "${tour.title}" - already complete`);
        skipped++;
        continue;
      }

      // Update the tour
      console.log(`📝 Updating "${tour.title}"...`);
      console.log(`   Adding: ${Object.keys(updates).join(', ')}`);
      
      await client
        .patch(existing._id)
        .set(updates)
        .commit();

      console.log(`   ✅ Updated successfully\n`);
      updated++;

    } catch (error) {
      console.error(`❌ Error updating "${tour.title}":`, error.message);
      errors++;
    }
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 Update Summary');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`✅ Updated: ${updated} tours`);
  console.log(`⏭️  Skipped: ${skipped} tours`);
  console.log(`❌ Errors: ${errors} tours`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  if (updated > 0) {
    console.log('🎉 Tours updated successfully!');
    console.log('🌐 Verify in Sanity Studio: https://goldenrometour.sanity.studio/');
  }
}

updateTours().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
