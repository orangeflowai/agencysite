#!/usr/bin/env node

/**
 * Script to update incomplete tours in Sanity CMS for Golden Rome Tour
 * Adds missing itinerary, includes, excludes, and other details
 */

const sanityClient = require('@sanity/client');

const client = sanityClient.default({
  projectId: 'gycprksj',
  dataset: 'production',
  token: 'skxMygHyPvOtvJ09PlCYpaqDmx6jFStRyF5VsKOKFLmIGTQO0TMo6XlOHfCHcnCslGJfkCNQIjCyKway6H2uEvxMV9tnF0659Zj7zluXg6C6UdK5UxbrXPF5d6UwIys88dxEsmPPuCCFuL0LYICf7yaQrwnD40q6K7plxqQflqH5YevcVHA1',
  apiVersion: '2024-01-01',
  useCdn: false,
});

// Standard Vatican tour itinerary template
const vaticanItinerary = [
  {
    _key: 'stop1',
    _type: 'itineraryStop',
    title: 'Vatican Museums Entrance',
    duration: '15 minutes',
    description: 'Meet your guide and skip the long entrance lines with priority access. Brief introduction to the Vatican Museums history and what to expect.'
  },
  {
    _key: 'stop2',
    _type: 'itineraryStop',
    title: 'Gallery of Maps & Tapestries',
    duration: '30 minutes',
    description: 'Walk through the stunning Gallery of Maps featuring 40 topographical maps of Italy, and the Gallery of Tapestries with magnificent 16th-century woven artworks.'
  },
  {
    _key: 'stop3',
    _type: 'itineraryStop',
    title: 'Raphael Rooms',
    duration: '25 minutes',
    description: 'Explore the four rooms decorated by Raphael and his students, including the famous School of Athens fresco.'
  },
  {
    _key: 'stop4',
    _type: 'itineraryStop',
    title: 'Sistine Chapel',
    duration: '30 minutes',
    description: 'Marvel at Michelangelo\'s masterpiece ceiling frescoes and The Last Judgment. Your guide will explain the symbolism and history before you enter this sacred space.'
  },
  {
    _key: 'stop5',
    _type: 'itineraryStop',
    title: 'St. Peter\'s Basilica (if included)',
    duration: '30 minutes',
    description: 'Visit the world\'s largest church, see Michelangelo\'s Pietà, and learn about the basilica\'s incredible architecture and history.'
  }
];

// Standard includes for Vatican tours
const standardIncludes = [
  { _key: 'inc1', _type: 'listItem', item: 'Skip-the-line entry ticket to Vatican Museums' },
  { _key: 'inc2', _type: 'listItem', item: 'Access to Sistine Chapel' },
  { _key: 'inc3', _type: 'listItem', item: 'Professional licensed guide (for guided tours)' },
  { _key: 'inc4', _type: 'listItem', item: 'Wireless headset for groups over 6 people' },
  { _key: 'inc5', _type: 'listItem', item: 'Booking and reservation fees' },
  { _key: 'inc6', _type: 'listItem', item: 'All taxes and handling charges' }
];

// Standard excludes
const standardExcludes = [
  { _key: 'exc1', _type: 'listItem', item: 'Hotel pickup and drop-off' },
  { _key: 'exc2', _type: 'listItem', item: 'Food and drinks' },
  { _key: 'exc3', _type: 'listItem', item: 'Gratuities (optional)' },
  { _key: 'exc4', _type: 'listItem', item: 'Audio guide (available for separate purchase)' }
];

// Standard important info
const standardImportantInfo = [
  { _key: 'info1', _type: 'listItem', item: 'Dress code: Knees and shoulders must be covered to enter religious sites' },
  { _key: 'info2', _type: 'listItem', item: 'Large bags and backpacks are not permitted inside' },
  { _key: 'info3', _type: 'listItem', item: 'Photography is not allowed in the Sistine Chapel' },
  { _key: 'info4', _type: 'listItem', item: 'The tour involves walking and standing for extended periods' },
  { _key: 'info5', _type: 'listItem', item: 'Please arrive 15 minutes before your scheduled start time' }
];

async function updateTours() {
  try {
    console.log('🔍 Fetching all Vatican tours from Sanity...\n');
    
    // Fetch all tours
    const tours = await client.fetch(`*[_type == "tour" && category == "vatican"]{
      _id,
      title,
      slug,
      itinerary,
      includes,
      excludes,
      importantInfo,
      meetingPoint
    }`);

    console.log(`Found ${tours.length} Vatican tours\n`);

    let updatedCount = 0;

    for (const tour of tours) {
      const updates = {};
      let needsUpdate = false;

      // Check and add itinerary if missing
      if (!tour.itinerary || tour.itinerary.length === 0) {
        updates.itinerary = vaticanItinerary;
        needsUpdate = true;
        console.log(`  ✓ Adding itinerary to: ${tour.title}`);
      }

      // Check and add includes if missing
      if (!tour.includes || tour.includes.length === 0) {
        updates.includes = standardIncludes;
        needsUpdate = true;
        console.log(`  ✓ Adding includes to: ${tour.title}`);
      }

      // Check and add excludes if missing
      if (!tour.excludes || tour.excludes.length === 0) {
        updates.excludes = standardExcludes;
        needsUpdate = true;
        console.log(`  ✓ Adding excludes to: ${tour.title}`);
      }

      // Check and add important info if missing
      if (!tour.importantInfo || tour.importantInfo.length === 0) {
        updates.importantInfo = standardImportantInfo;
        needsUpdate = true;
        console.log(`  ✓ Adding important info to: ${tour.title}`);
      }

      // Check and add meeting point if missing
      if (!tour.meetingPoint) {
        updates.meetingPoint = 'Via Tunisi 43, Rome - Just a short walk from the Vatican Museums entrance. Nearest metro: Cipro (Line A), 5-minute walk.';
        needsUpdate = true;
        console.log(`  ✓ Adding meeting point to: ${tour.title}`);
      }

      // Update the tour if needed
      if (needsUpdate) {
        await client
          .patch(tour._id)
          .set(updates)
          .commit();
        
        updatedCount++;
        console.log(`  ✅ Updated: ${tour.title}\n`);
      } else {
        console.log(`  ⏭️  Skipped (already complete): ${tour.title}\n`);
      }
    }

    console.log(`\n✅ Complete! Updated ${updatedCount} out of ${tours.length} tours`);
    
  } catch (error) {
    console.error('❌ Error updating tours:', error);
    process.exit(1);
  }
}

// Run the script
updateTours();
