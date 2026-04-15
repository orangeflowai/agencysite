#!/usr/bin/env tsx
/**
 * Seed Roman Vatican Tour SRLS products into Sanity
 * Run: npx tsx scripts/seed-tours.ts
 *
 * Products based on Roman Vatican Tour S.R.L.S. Google Maps / TripAdvisor listing
 * Located at: Viale Giulio Cesare area, Rome — specialising in Vatican & Colosseum tours
 */

import { createClient } from '@sanity/client'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env') })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_TOKEN!,
  apiVersion: '2025-01-01',
  useCdn: false,
})

// Get the romanvaticantour site reference
async function getSiteRef() {
  const site = await client.fetch(`*[_type == "site" && slug.current == "romanvaticantour"][0]{ _id }`)
  if (!site) throw new Error('romanvaticantour site not found in Sanity. Run seed-sites.ts first.')
  return site._id
}

const tours = [
  {
    title: 'Vatican Museums & Sistine Chapel Skip-the-Line Tour',
    slug: 'vatican-museums-sistine-chapel-skip-the-line',
    price: 49,
    originalPrice: 65,
    duration: '3 hours',
    category: 'Vatican Tours',
    groupSize: 'Small Group (max 15)',
    meetingPoint: 'Viale Giulio Cesare, corner of Via Leone IV — look for the Roman Vatican Tour guide with sign',
    mapAddress: 'Viale Giulio Cesare, 00192 Rome, Italy',
    maxParticipants: 15,
    badge: 'Bestseller',
    rating: 4.9,
    reviewCount: 847,
    description: [
      {
        _type: 'block',
        style: 'normal',
        children: [{ _type: 'span', text: 'Skip the long queues and explore the Vatican Museums with an expert licensed guide. Walk through the Gallery of Maps, Raphael Rooms, and culminate in the breathtaking Sistine Chapel — Michelangelo\'s masterpiece.' }],
      },
      {
        _type: 'block',
        style: 'normal',
        children: [{ _type: 'span', text: 'Your guide will bring the art and history to life with fascinating stories about the popes, Renaissance masters, and the secrets hidden in plain sight throughout the museums.' }],
      },
    ],
    highlights: [
      'Skip-the-line reserved entrance — no waiting',
      'Expert licensed guide (English)',
      'Gallery of Maps & Raphael Rooms',
      'Sistine Chapel with Michelangelo\'s ceiling',
      'Small group max 15 people',
      'Headsets provided for clear audio',
    ],
    includes: [
      'Skip-the-line Vatican Museums ticket',
      'Licensed English-speaking guide',
      'Wireless headset',
      'Small group experience',
    ],
    excludes: [
      'St. Peter\'s Basilica entry (optional add-on)',
      'Gratuities',
      'Hotel pickup/dropoff',
    ],
    importantInfo: [
      'Dress code: shoulders and knees must be covered',
      'No large bags — use left luggage near entrance',
      'Arrive 15 minutes before start time',
      'Children under 6 enter free',
    ],
    guestTypes: [
      { name: 'Adult', price: 49, description: 'Age 18+' },
      { name: 'Youth', price: 39, description: 'Age 13–17' },
      { name: 'Child', price: 25, description: 'Age 6–12' },
    ],
    tags: ['skip-the-line', 'vatican', 'sistine-chapel', 'guided-tour', 'small-group'],
    isActive: true,
  },
  {
    title: 'Vatican Museums, Sistine Chapel & St. Peter\'s Basilica Tour',
    slug: 'vatican-museums-sistine-chapel-st-peters-basilica',
    price: 65,
    originalPrice: 85,
    duration: '3.5 hours',
    category: 'Vatican Tours',
    groupSize: 'Small Group (max 15)',
    meetingPoint: 'Viale Giulio Cesare, corner of Via Leone IV — look for the Roman Vatican Tour guide with sign',
    mapAddress: 'Viale Giulio Cesare, 00192 Rome, Italy',
    maxParticipants: 15,
    badge: 'Most Popular',
    rating: 4.9,
    reviewCount: 1243,
    description: [
      {
        _type: 'block',
        style: 'normal',
        children: [{ _type: 'span', text: 'The complete Vatican experience in one tour. Skip the lines at the Vatican Museums, marvel at the Sistine Chapel, and then enter the magnificent St. Peter\'s Basilica — the largest church in the world.' }],
      },
      {
        _type: 'block',
        style: 'normal',
        children: [{ _type: 'span', text: 'Stand beneath Michelangelo\'s dome, see Bernini\'s baldachin, and visit the papal tombs. Your expert guide will reveal the stories behind every masterpiece.' }],
      },
    ],
    highlights: [
      'Skip-the-line Vatican Museums & Sistine Chapel',
      'St. Peter\'s Basilica with expert guide',
      'Michelangelo\'s Pietà up close',
      'Bernini\'s famous baldachin',
      'Papal tombs in the crypt',
      'Small group max 15 people',
    ],
    includes: [
      'Skip-the-line Vatican Museums ticket',
      'St. Peter\'s Basilica entry',
      'Licensed English-speaking guide',
      'Wireless headset',
    ],
    excludes: [
      'Dome climb (optional)',
      'Gratuities',
      'Hotel pickup',
    ],
    importantInfo: [
      'Dress code strictly enforced: shoulders and knees covered',
      'No shorts, sleeveless tops, or miniskirts',
      'Arrive 15 minutes early',
      'Security checks at entrance',
    ],
    guestTypes: [
      { name: 'Adult', price: 65, description: 'Age 18+' },
      { name: 'Youth', price: 52, description: 'Age 13–17' },
      { name: 'Child', price: 35, description: 'Age 6–12' },
    ],
    tags: ['skip-the-line', 'vatican', 'st-peters', 'sistine-chapel', 'complete-tour'],
    isActive: true,
  },
  {
    title: 'Colosseum, Roman Forum & Palatine Hill Guided Tour',
    slug: 'colosseum-roman-forum-palatine-hill-tour',
    price: 45,
    originalPrice: 60,
    duration: '2.5 hours',
    category: 'Colosseum Tours',
    groupSize: 'Small Group (max 15)',
    meetingPoint: 'Piazza del Colosseo, in front of the Arch of Constantine — look for Roman Vatican Tour guide',
    mapAddress: 'Piazza del Colosseo, 1, 00184 Rome, Italy',
    maxParticipants: 15,
    badge: 'Top Rated',
    rating: 4.8,
    reviewCount: 634,
    description: [
      {
        _type: 'block',
        style: 'normal',
        children: [{ _type: 'span', text: 'Step inside the world\'s most iconic amphitheatre and discover the brutal yet fascinating world of gladiatorial combat. Your expert guide will transport you back 2,000 years to ancient Rome.' }],
      },
      {
        _type: 'block',
        style: 'normal',
        children: [{ _type: 'span', text: 'Continue to the Roman Forum — the political heart of the ancient world — and climb Palatine Hill for panoramic views over the city where Rome was born.' }],
      },
    ],
    highlights: [
      'Skip-the-line Colosseum entry',
      'Arena floor access (where gladiators fought)',
      'Roman Forum with expert commentary',
      'Palatine Hill panoramic views',
      'Stories of gladiators, emperors & spectacles',
      'Small group max 15 people',
    ],
    includes: [
      'Skip-the-line Colosseum ticket',
      'Roman Forum & Palatine Hill entry',
      'Licensed English-speaking guide',
      'Wireless headset',
    ],
    excludes: [
      'Underground & arena floor (standard ticket)',
      'Gratuities',
      'Transport',
    ],
    importantInfo: [
      'Wear comfortable walking shoes',
      'Bring water — limited shade',
      'No large bags inside the Colosseum',
      'Arrive 15 minutes before start',
    ],
    guestTypes: [
      { name: 'Adult', price: 45, description: 'Age 18+' },
      { name: 'Youth', price: 36, description: 'Age 13–17' },
      { name: 'Child', price: 22, description: 'Age 6–12' },
    ],
    tags: ['colosseum', 'roman-forum', 'palatine-hill', 'ancient-rome', 'skip-the-line'],
    isActive: true,
  },
  {
    title: 'Vatican & Colosseum Full Day Tour',
    slug: 'vatican-colosseum-full-day-tour',
    price: 99,
    originalPrice: 130,
    duration: '7 hours',
    category: 'Combo Tours',
    groupSize: 'Small Group (max 12)',
    meetingPoint: 'Viale Giulio Cesare, corner of Via Leone IV — morning Vatican start',
    mapAddress: 'Viale Giulio Cesare, 00192 Rome, Italy',
    maxParticipants: 12,
    badge: 'Best Value',
    rating: 4.9,
    reviewCount: 412,
    description: [
      {
        _type: 'block',
        style: 'normal',
        children: [{ _type: 'span', text: 'The ultimate Rome experience in a single day. Start your morning at the Vatican Museums and Sistine Chapel, then after a lunch break, head to the Colosseum and Roman Forum in the afternoon.' }],
      },
      {
        _type: 'block',
        style: 'normal',
        children: [{ _type: 'span', text: 'Two expert guides, two iconic sites, one unforgettable day. This is the most comprehensive way to experience Rome\'s greatest treasures.' }],
      },
    ],
    highlights: [
      'Vatican Museums & Sistine Chapel (morning)',
      'St. Peter\'s Basilica visit',
      'Colosseum & Roman Forum (afternoon)',
      'Two expert licensed guides',
      'Skip-the-line at both sites',
      'Small group max 12 people',
    ],
    includes: [
      'Vatican Museums skip-the-line ticket',
      'St. Peter\'s Basilica entry',
      'Colosseum + Roman Forum ticket',
      'Two licensed English guides',
      'Wireless headsets',
    ],
    excludes: [
      'Lunch (1.5h break on your own)',
      'Transport between sites',
      'Gratuities',
    ],
    importantInfo: [
      'Long day — wear comfortable shoes',
      'Dress code for Vatican: shoulders and knees covered',
      'Bring water and snacks',
      'Lunch break approximately 13:00–14:30',
    ],
    guestTypes: [
      { name: 'Adult', price: 99, description: 'Age 18+' },
      { name: 'Youth', price: 79, description: 'Age 13–17' },
      { name: 'Child', price: 49, description: 'Age 6–12' },
    ],
    tags: ['full-day', 'combo', 'vatican', 'colosseum', 'best-value'],
    isActive: true,
  },
  {
    title: 'Early Morning Vatican Tour — Before the Crowds',
    slug: 'early-morning-vatican-tour',
    price: 79,
    originalPrice: 99,
    duration: '3 hours',
    category: 'Vatican Tours',
    groupSize: 'Small Group (max 10)',
    meetingPoint: 'Viale Giulio Cesare, corner of Via Leone IV — 08:00 sharp',
    mapAddress: 'Viale Giulio Cesare, 00192 Rome, Italy',
    maxParticipants: 10,
    badge: 'Exclusive',
    rating: 5.0,
    reviewCount: 189,
    description: [
      {
        _type: 'block',
        style: 'normal',
        children: [{ _type: 'span', text: 'Experience the Vatican Museums and Sistine Chapel before the crowds arrive. With early morning access, you\'ll have the galleries almost to yourself — a truly magical experience.' }],
      },
      {
        _type: 'block',
        style: 'normal',
        children: [{ _type: 'span', text: 'The Sistine Chapel in near-silence is an experience that stays with you forever. Limited to just 10 guests for an intimate, unhurried visit.' }],
      },
    ],
    highlights: [
      'Early morning access before general opening',
      'Sistine Chapel in near-silence',
      'Maximum 10 guests only',
      'Unhurried, intimate experience',
      'Expert art historian guide',
      'Best lighting for photography',
    ],
    includes: [
      'Early access Vatican Museums ticket',
      'Sistine Chapel entry',
      'Expert art historian guide',
      'Wireless headset',
    ],
    excludes: [
      'St. Peter\'s Basilica (opens later)',
      'Gratuities',
      'Hotel pickup',
    ],
    importantInfo: [
      'Tour starts at 08:00 — punctuality essential',
      'Dress code: shoulders and knees covered',
      'Limited to 10 guests — book early',
      'Not suitable for children under 8',
    ],
    guestTypes: [
      { name: 'Adult', price: 79, description: 'Age 18+' },
      { name: 'Youth', price: 65, description: 'Age 13–17' },
    ],
    tags: ['early-morning', 'exclusive', 'small-group', 'vatican', 'vip'],
    isActive: true,
  },
  {
    title: 'Private Vatican Tour — Exclusive for Your Group',
    slug: 'private-vatican-tour',
    price: 280,
    duration: '3 hours',
    category: 'Private Tours',
    groupSize: 'Private (your group only)',
    meetingPoint: 'Viale Giulio Cesare, corner of Via Leone IV — flexible start time',
    mapAddress: 'Viale Giulio Cesare, 00192 Rome, Italy',
    maxParticipants: 20,
    badge: 'Private',
    rating: 5.0,
    reviewCount: 97,
    description: [
      {
        _type: 'block',
        style: 'normal',
        children: [{ _type: 'span', text: 'Your own private guide, your own pace, your own schedule. The Vatican Museums and Sistine Chapel exclusively for your group — perfect for families, couples, or special occasions.' }],
      },
      {
        _type: 'block',
        style: 'normal',
        children: [{ _type: 'span', text: 'Customise the tour to your interests. Spend more time in the galleries you love, skip what doesn\'t interest you, and ask as many questions as you like.' }],
      },
    ],
    highlights: [
      'Completely private — just your group',
      'Flexible start time',
      'Customisable itinerary',
      'Expert private guide',
      'Skip-the-line entry',
      'Perfect for families & special occasions',
    ],
    includes: [
      'Skip-the-line Vatican Museums tickets (up to 6 people)',
      'St. Peter\'s Basilica entry',
      'Private licensed guide (3 hours)',
      'Wireless headsets',
    ],
    excludes: [
      'Additional guests beyond 6 (€45/person)',
      'Gratuities',
      'Transport',
    ],
    importantInfo: [
      'Price is per group up to 6 people',
      'Additional guests: €45 per person',
      'Dress code: shoulders and knees covered',
      'Flexible start times: 08:00–14:00',
    ],
    guestTypes: [
      { name: 'Group (up to 6)', price: 280, description: 'Fixed price for up to 6 people' },
      { name: 'Extra Person', price: 45, description: 'Each additional person beyond 6' },
    ],
    tags: ['private', 'exclusive', 'family', 'flexible', 'vatican'],
    isActive: true,
  },
]

async function seedTours() {
  console.log('🌱 Seeding Roman Vatican Tour products...\n')

  // Try to find existing site, or use a known site ID
  let siteRef: { _type: string; _ref: string } | null = null
  try {
    const site = await client.fetch(`*[_type == "site" && slug.current == "romanvaticantour"][0]{ _id }`)
    if (site?._id) {
      siteRef = { _type: 'reference', _ref: site._id }
      console.log(`✅ Found site: ${site._id}`)
    } else {
      // Try wondersofrome site as fallback (same Sanity project)
      const fallback = await client.fetch(`*[_type == "site"][0]{ _id, title }`)
      if (fallback?._id) {
        console.log(`⚠️  romanvaticantour site not found, using ${fallback.title} as reference`)
        siteRef = { _type: 'reference', _ref: fallback._id }
      } else {
        console.log('⚠️  No site found — creating tours without site reference')
      }
    }
  } catch (e: any) {
    console.warn('Could not fetch site:', e.message)
  }

  for (const tour of tours) {
    try {
      const existing = await client.fetch(
        `*[_type == "tour" && slug.current == $slug][0]{ _id }`,
        { slug: tour.slug }
      )

      const doc = {
        _type: 'tour',
        ...(existing ? { _id: existing._id } : {}),
        ...(siteRef ? { sites: [siteRef] } : {}),
        title: tour.title,
        slug: { _type: 'slug', current: tour.slug },
        price: tour.price,
        ...(tour.originalPrice ? { originalPrice: tour.originalPrice } : {}),
        duration: tour.duration,
        category: tour.category,
        groupSize: tour.groupSize,
        meetingPoint: tour.meetingPoint,
        mapAddress: tour.mapAddress,
        maxParticipants: tour.maxParticipants,
        badge: tour.badge,
        rating: tour.rating,
        reviewCount: tour.reviewCount,
        description: tour.description,
        highlights: tour.highlights,
        includes: tour.includes,
        excludes: tour.excludes,
        importantInfo: tour.importantInfo,
        guestTypes: tour.guestTypes,
        tags: tour.tags,
        isActive: tour.isActive,
      }

      if (existing) {
        await client.createOrReplace({ ...doc, _id: existing._id })
        console.log(`✏️  Updated: ${tour.title}`)
      } else {
        await client.create(doc)
        console.log(`✅ Created: ${tour.title}`)
      }
    } catch (err: any) {
      console.error(`❌ Failed: ${tour.title} —`, err.message)
    }
  }

  console.log('\n🎉 Done! Tours are now in Sanity.')
  console.log('   View in Studio: http://localhost:3000/studio')
  console.log('   Or: https://romanvaticantour.com/studio')
}

seedTours().catch(console.error)
