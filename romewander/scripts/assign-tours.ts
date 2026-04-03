import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config();

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_API_TOKEN;

if (!token) {
  console.error("Missing SANITY_API_TOKEN. Make sure it's set in your .env or .env.local file.");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
});

async function assignToursToSite() {
  // Target site SLUG is what's used in the config (e.g. 'vatican' for RomeWander).
  // Some other sites might be 'rome-tour-tickets', etc.
  const targetSiteSlug = process.env.NEXT_PUBLIC_SITE_ID || 'vatican';

  console.log(`Fetching site reference for slug: ${targetSiteSlug}...`);
  const siteQuery = `*[_type == "site" && slug.current == $slug][0]{ _id, title }`;
  const site = await client.fetch(siteQuery, { slug: targetSiteSlug });

  let siteId;
  let siteTitle;
  if (!site) {
    console.log(`Site with slug '${targetSiteSlug}' not found. Creating it now...`);
    const newSite = await client.create({
      _type: 'site',
      title: 'RomeWander',
      slug: { _type: 'slug', current: targetSiteSlug },
      domain: 'romewander.com',
      isActive: true,
      logoText: 'ROME',
      logoTextAccent: 'WANDER',
    });
    siteId = newSite._id;
    siteTitle = newSite.title;
    console.log(`Created site: ${siteTitle} (${siteId})`);
  } else {
    siteId = site._id;
    siteTitle = site.title;
    console.log(`Found site: ${siteTitle} (${siteId})`);
  }

  console.log('Fetching all tours...');
  const toursQuery = `*[_type == "tour"]{ _id, title, sites }`;
  const tours = await client.fetch(toursQuery);

  console.log(`Found ${tours.length} total tours.`);

  let updatedCount = 0;

  for (const tour of tours) {
    const sites = tour.sites || [];
    const hasSite = sites.some((s: any) => s._ref === siteId);

    if (!hasSite) {
      console.log(`Assigning tour "${tour.title}" to ${siteTitle}...`);
      await client
        .patch(tour._id)
        .setIfMissing({ sites: [] })
        .append('sites', [{ _ref: siteId, _type: 'reference' }])
        .commit();
      updatedCount++;
    } else {
      console.log(`Tour "${tour.title}" is already assigned to ${siteTitle}.`);
    }
  }

  console.log(`\n✅ Successfully updated ${updatedCount} tours.`);
}

assignToursToSite().catch((err) => {
  console.error('Failed to assign tours:', err);
  process.exit(1);
});
