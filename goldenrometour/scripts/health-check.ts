import { createClient } from '@sanity/client';
import { supabaseAdmin } from '../src/lib/supabaseAdmin';
import dotenv from 'dotenv';
import path from 'path';

// Load from goldenrometour
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: 'production',
  token: process.env.SANITY_API_TOKEN!,
  apiVersion: '2025-01-01',
  useCdn: false,
});

async function runHealthCheck() {
  console.log('🚀 INITIALIZING 5K HEALTH CHECK...\n');

  // 1. Fetch ALL active tours from Sanity
  const tours = await client.fetch(`*[_type == "tour" && isActive != false]{
    title,
    "slug": slug.current,
    "site": sites[0]->slug.current
  }`);

  console.log(`🔍 Found ${tours.length} active tours in Sanity.\n`);

  let errors = 0;
  let success = 0;

  for (const tour of tours) {
    const site = tour.site || 'unknown';
    console.log(`[${site.toUpperCase()}] Checking: ${tour.title}`);

    // 2. CHECK BACKEND INVENTORY (Supabase)
    const { data: inventory, error: invError } = await supabaseAdmin
      .from('inventory')
      .select('count')
      .eq('tour_slug', tour.slug);

    if (invError) {
      console.error(`  ❌ BACKEND ERROR: ${invError.message}`);
      errors++;
    } else if (!inventory || inventory.length === 0) {
      console.warn(`  ⚠️  INVENTORY MISSING: No slots defined for this tour slug.`);
      errors++;
    } else {
      console.log(`  ✅ Inventory Connected: ${inventory.length} dates available.`);
      success++;
    }
    
    console.log('---');
  }

  console.log(`\n🏁 FINAL STATUS:`);
  console.log(`✅ Healthy: ${success}`);
  console.log(`❌ Issues: ${errors}`);

  if (errors > 0) {
    process.exit(1);
  }
}

runHealthCheck().catch(err => {
  console.error('CRITICAL HEALTH CHECK FAILURE:', err);
  process.exit(1);
});
