#!/usr/bin/env node

/**
 * Migrate RomeWander from shared Sanity project (aknmkkwd) 
 * to dedicated project (siu133x5)
 * 
 * This script:
 * 1. Creates the Rome Wander site document in siu133x5
 * 2. Copies all tours linked to Rome Wander
 * 3. Copies all posts linked to Rome Wander
 * 4. Copies all settings linked to Rome Wander
 */

const { createClient } = require('@sanity/client');

// Source: Shared project (wondersofrome + romewander)
const sourceClient = createClient({
  projectId: 'aknmkkwd',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: 'skFBTe2s38Bz1MltanZf6ftSHyH3gVcK5EFRVuy3TOnzurb3ZyUQqip51aJWHC6cMfIkZu7F0u1J1iUii479jJLXzBgyQUODLzXISOD5RRuM94D99H6C4vPsNbAdmMTPcL0JhJbFhBO9NNl8WLGabR4NXpEWQETI2iKTi5gFDtXD65gcBw1e',
  useCdn: false
});

// Target: New dedicated RomeWander project
const targetClient = createClient({
  projectId: 'siu133x5',
  dataset: 'tours', // Using 'tours' dataset (as configured in tourguide)
  apiVersion: '2024-01-01',
  token: 'skKwRBbCf5jMSEP7T5ll31b7TmZNMQhFH7LkRh7xNQCwKTsU6OmE975ulyM9EgwQEdgupnJJsze27giLK86x9EFm0hNrF4PwEIPlM1xFlPUmLFxEQ036PBQ9Ho0YT75HTmqVdQcgRCuFLVnQrSNkDL8uHgFq9OYFDwDnmRobVdwir16QCvIb',
  useCdn: false
});

const ROME_WANDER_SITE_ID = 'site-romewander';
const NEW_SITE_ID = 'romewander'; // Simpler ID for new project

async function migrateSite() {
  console.log('📋 Step 1: Fetching Rome Wander site document...');
  
  const site = await sourceClient.fetch(
    `*[_type == "site" && _id == $siteId][0]`,
    { siteId: ROME_WANDER_SITE_ID }
  );

  if (!site) {
    console.error('❌ Rome Wander site not found in source project!');
    return null;
  }

  console.log(`✅ Found site: ${site.title}`);

  // Create new site document with cleaner ID
  const newSite = {
    ...site,
    _id: NEW_SITE_ID,
    _type: 'site',
  };

  delete newSite._rev;
  delete newSite._createdAt;
  delete newSite._updatedAt;

  console.log('📤 Creating site in new project...');
  await targetClient.createOrReplace(newSite);
  console.log('✅ Site created!');

  return NEW_SITE_ID;
}

async function migrateTours(newSiteId) {
  console.log('\n📋 Step 2: Fetching tours linked to Rome Wander...');

  const tours = await sourceClient.fetch(
    `*[_type == "tour" && $siteId in sites[]._ref]{
      ...,
      "mainImageAsset": mainImage.asset->,
      "galleryAssets": gallery[].asset->
    }`,
    { siteId: ROME_WANDER_SITE_ID }
  );

  console.log(`✅ Found ${tours.length} tours`);

  for (const tour of tours) {
    console.log(`  → Migrating: ${tour.title}`);

    // Clean up the tour document
    const newTour = {
      ...tour,
      _type: 'tour',
      sites: [{ _type: 'reference', _ref: newSiteId }], // Link to new site
    };

    // Remove system fields
    delete newTour._rev;
    delete newTour._createdAt;
    delete newTour._updatedAt;
    delete newTour.mainImageAsset;
    delete newTour.galleryAssets;

    try {
      await targetClient.createOrReplace(newTour);
      console.log(`     ✅ Migrated: ${tour.title}`);
    } catch (err) {
      console.error(`     ❌ Failed: ${tour.title}`, err.message);
    }
  }

  console.log(`\n✅ Migrated ${tours.length} tours`);
}

async function migratePosts(newSiteId) {
  console.log('\n📋 Step 3: Fetching blog posts...');

  const posts = await sourceClient.fetch(
    `*[_type == "post" && site._ref == $siteId]`,
    { siteId: ROME_WANDER_SITE_ID }
  );

  console.log(`✅ Found ${posts.length} posts`);

  for (const post of posts) {
    console.log(`  → Migrating: ${post.title}`);

    const newPost = {
      ...post,
      _type: 'post',
      site: { _type: 'reference', _ref: newSiteId },
    };

    delete newPost._rev;
    delete newPost._createdAt;
    delete newPost._updatedAt;

    try {
      await targetClient.createOrReplace(newPost);
      console.log(`     ✅ Migrated: ${post.title}`);
    } catch (err) {
      console.error(`     ❌ Failed: ${post.title}`, err.message);
    }
  }

  console.log(`\n✅ Migrated ${posts.length} posts`);
}

async function migrateSettings(newSiteId) {
  console.log('\n📋 Step 4: Fetching settings...');

  const settings = await sourceClient.fetch(
    `*[_type == "settings" && site._ref == $siteId][0]`,
    { siteId: ROME_WANDER_SITE_ID }
  );

  if (!settings) {
    console.log('⚠️  No settings found');
    return;
  }

  console.log(`✅ Found settings`);

  const newSettings = {
    ...settings,
    _type: 'settings',
    site: { _type: 'reference', _ref: newSiteId },
  };

  delete newSettings._rev;
  delete newSettings._createdAt;
  delete newSettings._updatedAt;

  await targetClient.createOrReplace(newSettings);
  console.log('✅ Settings migrated!');
}

async function main() {
  console.log('🚀 Starting RomeWander Migration');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`Source: aknmkkwd (shared project)`);
  console.log(`Target: siu133x5 (dedicated RomeWander)`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  try {
    // Step 1: Migrate site
    const newSiteId = await migrateSite();
    if (!newSiteId) return;

    // Step 2: Migrate tours
    await migrateTours(newSiteId);

    // Step 3: Migrate posts
    await migratePosts(newSiteId);

    // Step 4: Migrate settings
    await migrateSettings(newSiteId);

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Migration Complete!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n📝 Next Steps:');
    console.log('1. Update romewander/.env:');
    console.log('   NEXT_PUBLIC_SANITY_PROJECT_ID=siu133x5');
    console.log('   SANITY_API_TOKEN=<your_new_token>');
    console.log('2. Restart the romewander dev server');
    console.log('3. Verify tours appear on the website');

  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.error(error);
  }
}

main();
