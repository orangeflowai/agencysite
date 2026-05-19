/**
 * Script to enrich GoldenRomeTour tours in Sanity with complete data
 * This adds missing itinerary, includes, excludes, and other details
 */

const sanityClient = require('@sanity/client');

const client = sanityClient.default({
  projectId: 'gycprksj',
  dataset: 'production',
  token: 'skxMygHyPvOtvJ09PlCYpaqDmx6jFStRyF5VsKOKFLmIGTQO0TMo6XlOHfCHcnCslGJfkCNQIjCyKway6H2uEvxMV9tnF0659Zj7zluXg6C6UdK5UxbrXPF5d6UwIys88dxEsmPPuCCFuL0LYICf7yaQrwnD40q6K7plxqQflqH5YevcVHA1',
  apiVersion: '2024-01-01',
  useCdn: false,
});

// Complete tour data templates
const tourEnrichments = {
  'vatican-museums-and-sistine-chapel-skip-the-line-ticket-only-premium': {
    itinerary: [
      {
        _key: 'stop1',
        _type: 'itineraryStop',
        title: 'Vatican Museums Entrance',
        duration: '15 minutes',
        description: 'Meet at our office, collect your skip-the-line tickets, and receive orientation about the museums layout and must-see highlights.'
      },
      {
        _key: 'stop2',
        _type: 'itineraryStop',
        title: 'Gallery of Maps & Tapestries',
        duration: '30 minutes',
        description: 'Explore the stunning Gallery of Maps with 40 topographical maps of Italy, and the Gallery of Tapestries featuring magnificent 16th-century woven artworks.'
      },
      {
        _key: 'stop3',
        _type: 'itineraryStop',
        title: 'Raphael Rooms',
        duration: '30 minutes',
        description: 'Marvel at Raphael\'s masterpieces including The School of Athens, one of the most celebrated frescoes of the Renaissance.'
      },
      {
        _key: 'stop4',
        _type: 'itineraryStop',
        title: 'Sistine Chapel',
        duration: '45 minutes',
        description: 'Stand beneath Michelangelo\'s legendary ceiling frescoes, including The Creation of Adam, and the powerful Last Judgment. Take your time to absorb this sacred masterpiece.'
      },
      {
        _key: 'stop5',
        _type: 'itineraryStop',
        title: 'Additional Galleries (Optional)',
        duration: 'Flexible',
        description: 'Continue exploring at your own pace through the Egyptian Museum, Etruscan Museum, or modern religious art collections.'
      }
    ],
    includes: [
      { _key: 'inc1', _type: 'listItem', item: 'Skip-the-line entry ticket to Vatican Museums and Sistine Chapel' },
      { _key: 'inc2', _type: 'listItem', item: 'Access to all permanent collections' },
      { _key: 'inc3', _type: 'listItem', item: 'Booking and handling fee' },
      { _key: 'inc4', _type: 'listItem', item: 'Host at meeting point for ticket collection' },
      { _key: 'inc5', _type: 'listItem', item: 'Vatican Museums reservation fee' },
      { _key: 'inc6', _type: 'listItem', item: 'Guest relations assistance' },
      { _key: 'inc7', _type: 'listItem', item: 'Instant confirmation' },
      { _key: 'inc8', _type: 'listItem', item: 'Detailed museum map and guide' }
    ],
    excludes: [
      { _key: 'exc1', _type: 'listItem', item: 'Guided tour or live commentary' },
      { _key: 'exc2', _type: 'listItem', item: 'Hotel pickup and drop-off' },
      { _key: 'exc3', _type: 'listItem', item: 'Food and drinks' },
      { _key: 'exc4', _type: 'listItem', item: 'Audio guide (available for rent on-site)' },
      { _key: 'exc5', _type: 'listItem', item: 'Gratuities' }
    ],
    importantInfo: [
      { _key: 'info1', _type: 'listItem', item: 'Dress code: Knees and shoulders must be covered' },
      { _key: 'info2', _type: 'listItem', item: 'Security screening required at entrance' },
      { _key: 'info3', _type: 'listItem', item: 'Large bags and backpacks not permitted' },
      { _key: 'info4', _type: 'listItem', item: 'Photography allowed (no flash in Sistine Chapel)' },
      { _key: 'info5', _type: 'listItem', item: 'Silence required in Sistine Chapel' },
      { _key: 'info6', _type: 'listItem', item: 'Allow 2-4 hours for full visit' },
      { _key: 'info7', _type: 'listItem', item: 'Tickets are time-specific and non-refundable' }
    ]
  },
  'vatican-museums-sistine-chapel-skip-the-line-premium': {
    itinerary: [
      {
        _key: 'stop1',
        _type: 'itineraryStop',
        title: 'Meeting Point & Introduction',
        duration: '10 minutes',
        description: 'Meet your licensed guide at the designated meeting point. Receive wireless headsets and brief introduction to Vatican history.'
      },
      {
        _key: 'stop2',
        _type: 'itineraryStop',
        title: 'Courtyard & Ancient Sculptures',
        duration: '20 minutes',
        description: 'Begin in the Belvedere Courtyard viewing the Laocoön Group and Apollo Belvedere, masterpieces of classical sculpture.'
      },
      {
        _key: 'stop3',
        _type: 'itineraryStop',
        title: 'Gallery of Maps',
        duration: '15 minutes',
        description: 'Walk through the 120-meter Gallery of Maps with your guide explaining the historical significance of these 16th-century cartographic masterpieces.'
      },
      {
        _key: 'stop4',
        _type: 'itineraryStop',
        title: 'Raphael Rooms',
        duration: '25 minutes',
        description: 'Explore the four Raphael Rooms with expert commentary on The School of Athens, The Disputation of the Holy Sacrament, and other Renaissance masterworks.'
      },
      {
        _key: 'stop5',
        _type: 'itineraryStop',
        title: 'Sistine Chapel',
        duration: '30 minutes',
        description: 'Culminate your tour in the Sistine Chapel where your guide will have explained the ceiling and Last Judgment before entry. Enjoy time for personal reflection.'
      }
    ],
    includes: [
      { _key: 'inc1', _type: 'listItem', item: 'Skip-the-line Vatican Museums ticket' },
      { _key: 'inc2', _type: 'listItem', item: 'Licensed English-speaking expert guide' },
      { _key: 'inc3', _type: 'listItem', item: 'Wireless headset for clear audio' },
      { _key: 'inc4', _type: 'listItem', item: 'Small group experience (max 15 people)' },
      { _key: 'inc5', _type: 'listItem', item: 'All entrance fees and reservations' },
      { _key: 'inc6', _type: 'listItem', item: 'Instant confirmation' }
    ],
    excludes: [
      { _key: 'exc1', _type: 'listItem', item: 'St. Peter\'s Basilica entry (optional add-on)' },
      { _key: 'exc2', _type: 'listItem', item: 'Gratuities for guide' },
      { _key: 'exc3', _type: 'listItem', item: 'Hotel pickup and drop-off' },
      { _key: 'exc4', _type: 'listItem', item: 'Food and beverages' }
    ],
    importantInfo: [
      { _key: 'info1', _type: 'listItem', item: 'Modest dress code strictly enforced: shoulders and knees covered' },
      { _key: 'info2', _type: 'listItem', item: 'Arrive 15 minutes before tour start time' },
      { _key: 'info3', _type: 'listItem', item: 'Tour operates rain or shine' },
      { _key: 'info4', _type: 'listItem', item: 'Not wheelchair accessible due to stairs' },
      { _key: 'info5', _type: 'listItem', item: 'Children must be accompanied by adult' },
      { _key: 'info6', _type: 'listItem', item: 'No talking allowed in Sistine Chapel' }
    ]
  }
};

async function enrichTours() {
  console.log('🎨 Starting tour enrichment for GoldenRomeTour...\n');

  try {
    // Fetch all tours
    const tours = await client.fetch(`*[_type == "tour" && category == "vatican"]{_id, title, slug, itinerary, includes, excludes, importantInfo}`);
    
    console.log(`Found ${tours.length} Vatican tours\n`);

    let enrichedCount = 0;

    for (const tour of tours) {
      const slug = tour.slug?.current;
      if (!slug) continue;

      const enrichment = tourEnrichments[slug];
      if (!enrichment) {
        console.log(`⏭️  Skipping ${tour.title} - no enrichment data`);
        continue;
      }

      // Check what's missing
      const needsItinerary = !tour.itinerary || tour.itinerary.length === 0;
      const needsIncludes = !tour.includes || tour.includes.length === 0;
      const needsExcludes = !tour.excludes || tour.excludes.length === 0;
      const needsImportantInfo = !tour.importantInfo || tour.importantInfo.length === 0;

      if (!needsItinerary && !needsIncludes && !needsExcludes && !needsImportantInfo) {
        console.log(`✅ ${tour.title} - already complete`);
        continue;
      }

      // Build update object
      const updates = {};
      if (needsItinerary) updates.itinerary = enrichment.itinerary;
      if (needsIncludes) updates.includes = enrichment.includes;
      if (needsExcludes) updates.excludes = enrichment.excludes;
      if (needsImportantInfo) updates.importantInfo = enrichment.importantInfo;

      console.log(`📝 Enriching: ${tour.title}`);
      console.log(`   Adding: ${Object.keys(updates).join(', ')}`);

      // Update tour
      await client
        .patch(tour._id)
        .set(updates)
        .commit();

      enrichedCount++;
      console.log(`   ✅ Updated successfully\n`);
    }

    console.log(`\n🎉 Enrichment complete!`);
    console.log(`   Total tours: ${tours.length}`);
    console.log(`   Enriched: ${enrichedCount}`);
    console.log(`   Skipped: ${tours.length - enrichedCount}`);

  } catch (error) {
    console.error('❌ Error enriching tours:', error);
    process.exit(1);
  }
}

enrichTours();
