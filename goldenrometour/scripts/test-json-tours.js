#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Testing JSON tour files...\n');

const tour1Path = path.join(__dirname, '..', 'tour-data-tour1.json');
const tour2Path = path.join(__dirname, '..', 'tour-data-tour2.json');

console.log('Tour 1 path:', tour1Path);
console.log('Tour 1 exists:', fs.existsSync(tour1Path));

console.log('\nTour 2 path:', tour2Path);
console.log('Tour 2 exists:', fs.existsSync(tour2Path));

if (fs.existsSync(tour1Path)) {
  const tour1 = JSON.parse(fs.readFileSync(tour1Path, 'utf8'));
  console.log('\n📦 Tour 1:');
  console.log('  Title:', tour1.title);
  console.log('  Slug:', tour1.slug);
  console.log('  Price:', tour1.price);
  console.log('  Duration:', tour1.duration);
  console.log('  Highlights:', tour1.highlights?.length || 0);
}

if (fs.existsSync(tour2Path)) {
  const tour2 = JSON.parse(fs.readFileSync(tour2Path, 'utf8'));
  console.log('\n📦 Tour 2:');
  console.log('  Title:', tour2.title);
  console.log('  Slug:', tour2.slug);
  console.log('  Price:', tour2.price);
  console.log('  Duration:', tour2.duration);
  console.log('  Highlights:', tour2.highlights?.length || 0);
}

console.log('\n✅ Test complete!');
