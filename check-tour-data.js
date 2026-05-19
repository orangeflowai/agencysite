const fs = require('fs');
const data = JSON.parse(fs.readFileSync('tours-premium-vip.json'));
const tour = data.tours[0];

console.log('Title:', tour.title);
console.log('\nData completeness:');
console.log('  Highlights:', tour.highlights?.length || 0, 'items');
console.log('  Includes:', tour.includes?.length || 0, 'items');
console.log('  Excludes:', tour.excludes?.length || 0, 'items');
console.log('  ImportantInfo:', tour.importantInfo?.length || 0, 'items');

console.log('\nFirst 3 includes:');
tour.includes?.slice(0,3).forEach((i,idx) => console.log(`  ${idx+1}. ${i}`));

console.log('\nFirst 3 important info:');
tour.importantInfo?.slice(0,3).forEach((i,idx) => console.log(`  ${idx+1}. ${i}`));
