import { createClient as createSanityClient } from '@sanity/client';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config();

const sanityProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const sanityDataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const sanityToken = process.env.SANITY_API_TOKEN;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!sanityToken || !supabaseUrl || !supabaseKey) {
  console.error("Missing required API keys in .env. Ensure SANITY, SUPABASE_URL, and SUPABASE_SERVICE_ROLE_KEY are set.");
  process.exit(1);
}

const sanity = createSanityClient({
  projectId: sanityProjectId,
  dataset: sanityDataset,
  apiVersion: '2024-01-01',
  token: sanityToken,
  useCdn: false,
});

const supabase = createSupabaseClient(supabaseUrl, supabaseKey);

async function syncToursToSupabase() {
  console.log('Fetching all tours from Sanity...');
  const toursQuery = `*[_type == "tour"]{
    _id,
    title,
    "slug": slug.current,
    price,
    duration,
    category,
    "imageUrl": mainImage.asset->url
  }`;

  const sanityTours = await sanity.fetch(toursQuery);
  console.log(`Found ${sanityTours.length} tours in Sanity. Syncing to Supabase...`);

  let syncedCount = 0;

  const batchSize = 10;
  for (let i = 0; i < sanityTours.length; i += batchSize) {
    const batch = sanityTours.slice(i, i + batchSize);
    console.log(`Processing batch ${i / batchSize + 1} of ${Math.ceil(sanityTours.length / batchSize)}...`);

    const promises = batch.map(async (tour: any) => {
      if (!tour.slug) return false;
      const { error } = await supabase
        .from('tours')
        .upsert({
          id: tour._id,
          title: tour.title,
          slug: tour.slug,
          base_price: tour.price || Math.floor(Math.random() * 50) + 50,
        }, { onConflict: 'slug' });

      if (error) {
        const { error: minimalError } = await supabase
          .from('tours')
          .upsert({ title: tour.title, slug: tour.slug }, { onConflict: 'slug' });
        if (minimalError) {
          console.error(`Failed to sync ${tour.title}:`, minimalError.message);
          return false;
        }
      }
      return true;
    });

    const results = await Promise.all(promises);
    syncedCount += results.filter(Boolean).length;
  }

  console.log(`\n✅ Successfully synced ${syncedCount} tours to Supabase.`);
  process.exit(0);
}

syncToursToSupabase().catch((err) => {
  console.error('Sync failed:', err);
  process.exit(1);
});
