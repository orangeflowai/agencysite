#!/usr/bin/env node
/**
 * Create Golden Rome Tour Site Document in Sanity
 */

const { createClient } = require('@sanity/client')

const client = createClient({
  projectId: 'aknmkkwd',
  dataset: 'production',
  token: 'skFBTe2s38Bz1MltanZf6ftSHyH3gVcK5EFRVuy3TOnzurb3ZyUQqip51aJWHC6cMfIkZu7F0u1J1iUii479jJLXzBgyQUODLzXISOD5RRuM94D99H6C4vPsNbAdmMTPcL0JhJbFhBO9NNl8WLGabR4NXpEWQETI2iKTi5gFDtXD65gcBw1e',
  apiVersion: '2024-01-01',
  useCdn: false
})

const goldenrometourSite = {
  _type: 'site',
  _id: 'site-goldenrometour',
  name: 'Golden Rome Tour',
  slug: { _type: 'slug', current: 'goldenrometour' },
  tenant: 'goldenrometour',
  domain: 'goldenrometour.com',
  url: 'https://goldenrometour.com',
  description: 'Experience the best of Rome with Golden Rome Tour. Vatican, Colosseum, Roman Forum, and hidden gems. Expert guides and unforgettable experiences.',
  tagline: 'Discover Rome\'s Golden Treasures',
  email: 'info@goldenrometour.com',
  phone: '+39 351 419 9425',
  whatsappNumber: '3514199425',
  address: 'Rome, Italy',
  socialMedia: {
    facebook: 'https://facebook.com/goldenrometour',
    instagram: 'https://instagram.com/goldenrometour',
    twitter: 'https://twitter.com/goldenrometour',
  },
  seo: {
    metaTitle: 'Golden Rome Tour - Vatican, Colosseum & Rome Tours',
    metaDescription: 'Book the best Rome tours with Golden Rome Tour. Vatican Museums, Colosseum, Roman Forum, and more. Skip-the-line access and expert local guides.',
    keywords: ['rome tours', 'vatican tours', 'colosseum tours', 'roman forum', 'golden rome tour', 'rome experiences'],
  },
  branding: {
    primaryColor: { hex: '#D4AF37' }, // Gold
    secondaryColor: { hex: '#8B0000' }, // Dark red
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
  console.log('🏛️  Creating Golden Rome Tour Site Document in Sanity...\n')
  
  try {
    const existing = await client.fetch(
      `*[_type == "site" && slug.current == "goldenrometour"][0]`
    )
    
    if (existing) {
      console.log('⚠️  Site already exists. Updating...\n')
      
      const updated = await client
        .patch(existing._id)
        .set(goldenrometourSite)
        .commit()
      
      console.log('✅ Site Updated!')
      console.log(`   ID: ${updated._id}`)
      console.log(`   Name: ${updated.name}`)
      console.log(`   Slug: ${updated.slug.current}`)
    } else {
      const created = await client.create(goldenrometourSite)
      
      console.log('✅ Site Created!')
      console.log(`   ID: ${created._id}`)
      console.log(`   Name: ${created.name}`)
      console.log(`   Slug: ${created.slug.current}`)
    }
    
    console.log('\n✅ Golden Rome Tour site is ready!')
    
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

createSite()
