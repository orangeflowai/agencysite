const { createClient } = require('next-sanity');
const { randomUUID } = require('crypto');

const client = createClient({
  projectId: 'siu133x5',
  dataset: 'tours',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: 'skKwRBbCf5jMSEP7T5ll31b7TmZNMQhFH7LkRh7xNQCwKTsU6OmE975ulyM9EgwQEdgupnJJsze27giLK86x9EFm0hNrF4PwEIPlM1xFlPUmLFxEQ036PBQ9Ho0YT75HTmqVdQcgRCuFLVnQrSNkDL8uHgFq9OYFDwDnmRobVdwir16QCvIb'
});

// Generate a short unique key
function generateKey() {
  return randomUUID().substring(0, 8);
}

// Add _key to array items that don't have it
function addKeysToArray(arr) {
  if (!Array.isArray(arr)) return arr;
  return arr.map(item => {
    if (typeof item === 'string') {
      return { _key: generateKey(), item };
    }
    if (typeof item === 'object' && !item._key) {
      return { ...item, _key: generateKey() };
    }
    return item;
  });
}

async function fixMissingKeys() {
  console.log('Fetching all romewander tours...\n');
  
  // Get all tours for romewander
  const tours = await client.fetch(`*[_type == "tour" && "romewander" in sites[]._ref]{
    _id,
    _rev,
    title,
    highlights,
    includes,
    excludes,
    importantInfo,
    tags,
    itinerary,
    guestTypes
  }`);
  
  console.log(`Found ${tours.length} tours to fix\n`);
  
  for (const tour of tours) {
    console.log(`Fixing: ${tour.title}`);
    
    const patches = [];
    let needsUpdate = false;
    
    // Check and fix each array field
    const arrayFields = ['highlights', 'includes', 'excludes', 'importantInfo', 'tags', 'itinerary', 'guestTypes'];
    
    for (const field of arrayFields) {
      if (Array.isArray(tour[field]) && tour[field].length > 0) {
        // Check if any items are missing _key
        const hasMissingKeys = tour[field].some(item => {
          if (typeof item === 'string') return true;
          if (typeof item === 'object' && !item._key) return true;
          return false;
        });
        
        if (hasMissingKeys) {
          console.log(`  - Fixing ${field} (${tour[field].length} items)`);
          patches.push({
            set: { [field]: addKeysToArray(tour[field]) }
          });
          needsUpdate = true;
        }
      }
    }
    
    if (needsUpdate) {
      try {
        // Apply all patches at once
        let transaction = client.transaction();
        patches.forEach(patch => {
          transaction = transaction.patch(tour._id, patch);
        });
        await transaction.commit();
        console.log(`  ✅ Fixed successfully\n`);
      } catch (error) {
        console.log(`  ❌ Error: ${error.message}\n`);
      }
    } else {
      console.log(`  ✓ No fixes needed\n`);
    }
  }
  
  console.log('Done! All tours have been fixed.');
  console.log('Refresh your Sanity Studio to see the changes.');
}

fixMissingKeys().catch(console.error);
