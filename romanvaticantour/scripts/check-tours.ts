#!/usr/bin/env tsx
import { createClient } from '@sanity/client'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env') })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: 'production',
  token: process.env.SANITY_API_TOKEN!,
  apiVersion: '2025-01-01',
  useCdn: false,
})

async function run() {
  const tours = await client.fetch(`*[_type == "tour"] | order(title asc) {
    title, "slug": slug.current, price, category, isActive,
    "sites": sites[]->{title, "slug": slug.current}
  }`)
  
  console.log(`\nTotal tours: ${tours.length}\n`)
  
  // Group by site
  const bySite: Record<string, any[]> = {}
  for (const t of tours) {
    const siteNames = t.sites?.map((s: any) => s.slug).join(', ') || 'NO SITE'
    if (!bySite[siteNames]) bySite[siteNames] = []
    bySite[siteNames].push(t)
  }
  
  for (const [site, siteTours] of Object.entries(bySite)) {
    console.log(`\n=== ${site} (${siteTours.length} tours) ===`)
    for (const t of siteTours) {
      console.log(`  ${t.isActive !== false ? '✅' : '❌'} ${t.title} — €${t.price} [${t.category || 'no category'}]`)
    }
  }
}

run().catch(console.error)
