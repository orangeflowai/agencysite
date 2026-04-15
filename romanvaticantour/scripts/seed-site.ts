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
  // Check if site exists
  const existing = await client.fetch('*[_type == "site" && slug.current == "romanvaticantour"][0]{_id}')
  
  let siteId: string
  if (existing?._id) {
    console.log('✅ Site already exists:', existing._id)
    siteId = existing._id
  } else {
    const site = await client.create({
      _type: 'site',
      title: 'Roman Vatican Tour',
      slug: { _type: 'slug', current: 'romanvaticantour' },
      domain: 'https://romanvaticantour.com',
      isActive: true,
      brandColors: {
        primary: { hex: '#8B0000' },
        secondary: { hex: '#FFF8F0' },
        accent: { hex: '#C9A84C' },
      },
      seo: {
        metaTitle: 'Roman Vatican Tour — Expert Vatican & Colosseum Tours Rome',
        metaDescription: 'Skip-the-line Vatican Museums, Sistine Chapel, Colosseum tours with expert licensed guides. Small groups, best prices.',
      },
      contactEmail: 'info@romanvaticantour.com',
      logoText: 'Roman Vatican',
      logoTextAccent: 'Tour',
    })
    console.log('✅ Created site:', site._id)
    siteId = site._id
  }

  // Update all romanvaticantour tours to reference this site
  const tours = await client.fetch(`*[_type == "tour" && slug.current in [
    "vatican-museums-sistine-chapel-skip-the-line",
    "vatican-museums-sistine-chapel-st-peters-basilica",
    "colosseum-roman-forum-palatine-hill-tour",
    "vatican-colosseum-full-day-tour",
    "early-morning-vatican-tour",
    "private-vatican-tour"
  ]]{_id, title}`)
  
  console.log(`\nUpdating ${tours.length} tours to reference romanvaticantour site...`)
  for (const t of tours) {
    await client.patch(t._id).set({ sites: [{ _type: 'reference', _ref: siteId }] }).commit()
    console.log(`  ✅ ${t.title}`)
  }
  
  console.log('\n🎉 Done!')
}

run().catch(console.error)
