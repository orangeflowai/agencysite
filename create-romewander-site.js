#!/usr/bin/env node
/**
 * Create Rome Wander Site Document in Sanity
 */

const { createClient } = require('@sanity/client')

const client = createClient({
  projectId: 'aknmkkwd',
  dataset: 'production',
  token: 'skFBTe2s38Bz1MltanZf6ftSHyH3gVcK5EFRVuy3TOnzurb3ZyUQqip51aJWHC6cMfIkZu7F0u1J1iUii479jJLXzBgyQUODLzXISOD5RRuM94D99H6C4vPsNbAdmMTPcL0JhJbFhBO9NNl8WLGabR4NXpEWQETI2iKTi5gFDtXD65gcBw1e',
  apiVersion: '2024-01-01',
  useCdn: false
})

const romewanderSite = {
  _type: 'site',
  _id: 'site-romewander', // Fixed ID for easy reference
  name: 'Rome Wander',
  slug: { _type: 'slug', current: 'romewander' },
  tenant: 'romewander',
  domain: 'romewander.com',
  url: 'https://romewander.com',
  description: 'Discover the Vatican with Rome Wander. Expert-guided tours of Vatican Museums, Sistine Chapel, St. Peter\'s Basilica, and more. Skip-the-line access and small group experiences.',
  tagline: 'Your Gateway to Vatican Wonders',
  email: 'info@romewander.com',
  phone: '+39 351 419 9425',
  whatsappNumber: '3514199425',
  address: 'Rome, Italy',
  socialMedia: {
    facebook: 'https://facebook.com/romewander',
    instagram: 'https://instagram.com/romewander',
    twitter: 'https://twitter.com/romewander',
  },
  seo: {
    metaTitle: 'Rome Wander - Vatican Tours & Experiences',
    metaDescription: 'Book Vatican Museums, Sistine Chapel, and St. Peter\'s Basilica tours with Rome Wander. Skip-the-line access, expert guides, and unforgettable experiences.',
    keywords: ['vatican tours', 'rome tours', 'sistine chapel', 'vatican museums', 'st peters basilica', 'rome wander'],
  },
  branding: {
    primaryColor: { hex: '#8B4513' }, // Vatican brown
    secondaryColor: { hex: '#FFD700' }, // Gold
    accentColor: { hex: '#4A90E2' }, // Blue
  },
  settings: {
    currency: 'EUR',
    timezone: 'Europe/Rome',
    language: 'en',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
  },
  features: {
    bookingEnabled: true,
    blogEnabled: true,
    reviewsEnabled: true,
    newsletterEnabled: true,
    multiLanguage: false,
  },
  active: true,
  status: 'live',
}

async function createSite() {
  console.log('🏛️  Creating Rome Wander Site Document in Sanity...\n')
  
  try {
    // Check if site already exists
    const existing = await client.fetch(
      `*[_type == "site" && slug.current == "romewander"][0]`
    )
    
    if (existing) {
      console.log('⚠️  Site already exists. Updating...\n')
      
      const updated = await client
        .patch(existing._id)
        .set(romewanderSite)
        .commit()
      
      console.log('✅ Site Updated!')
      console.log(`   ID: ${updated._id}`)
      console.log(`   Name: ${updated.name}`)
      console.log(`   Slug: ${updated.slug.current}`)
      console.log(`   Domain: ${updated.domain}`)
    } else {
      const created = await client.create(romewanderSite)
      
      console.log('✅ Site Created!')
      console.log(`   ID: ${created._id}`)
      console.log(`   Name: ${created.name}`)
      console.log(`   Slug: ${created.slug.current}`)
      console.log(`   Domain: ${created.domain}`)
    }
    
    console.log('')
    console.log('🔍 Verifying site...')
    
    const site = await client.fetch(
      `*[_type == "site" && slug.current == "romewander"][0] {
        _id,
        name,
        "slug": slug.current,
        tenant,
        domain,
        email,
        phone,
        active,
        status
      }`
    )
    
    if (site) {
      console.log('\n✅ Site verification successful!')
      console.log(JSON.stringify(site, null, 2))
      
      // Now verify tours can be fetched
      console.log('\n🎫 Verifying tours for this site...')
      
      const tours = await client.fetch(
        `*[_type == "tour" && tenant == "romewander" && status == "live"] {
          _id,
          title,
          "slug": slug.current,
          price
        }`
      )
      
      console.log(`\n✅ Found ${tours.length} tours for Rome Wander`)
      tours.forEach((tour, i) => {
        console.log(`   ${i + 1}. ${tour.title} (€${tour.price})`)
      })
      
      console.log('\n🎉 Rome Wander site is ready!')
      console.log('\nNext steps:')
      console.log('1. Restart your dev server: npm run dev')
      console.log('2. Visit: http://localhost:3000')
      console.log('3. Tours should now appear on homepage')
      
    } else {
      console.error('❌ Site verification failed')
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

createSite()
