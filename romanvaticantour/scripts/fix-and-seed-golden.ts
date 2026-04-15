#!/usr/bin/env tsx
/**
 * 1. Fix romanvaticantour issues (duplicate tour, category names)
 * 2. Create goldenrometour site + seed products
 */
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

// ─── Fix romanvaticantour ─────────────────────────────────────────────────────

async function fixRomanVatican() {
  console.log('\n🔧 Fixing romanvaticantour tours...')

  // Fix category names to match the standard slugs
  const categoryMap: Record<string, string> = {
    'Vatican Tours': 'vatican',
    'Colosseum Tours': 'colosseum',
    'Combo Tours': 'city',
    'Private Tours': 'city',
  }

  const tours = await client.fetch(`*[_type == "tour" && "romanvaticantour" in sites[]->slug.current]{_id, title, category}`)
  
  for (const t of tours) {
    const fixedCategory = categoryMap[t.category] || t.category
    if (fixedCategory !== t.category) {
      await client.patch(t._id).set({ category: fixedCategory }).commit()
      console.log(`  ✅ Fixed category: "${t.title}" → ${fixedCategory}`)
    }
  }

  // Remove duplicate "Private Vatican Tour" (keep the one with "Exclusive for Your Group")
  const duplicates = await client.fetch(`*[_type == "tour" && slug.current == "private-vatican-tour"]{_id, title}`)
  if (duplicates.length > 1) {
    // Delete the one without "Exclusive"
    const toDelete = duplicates.find((t: any) => !t.title.includes('Exclusive'))
    if (toDelete) {
      await client.delete(toDelete._id)
      console.log(`  🗑️  Deleted duplicate: "${toDelete.title}"`)
    }
  }

  console.log('  ✅ romanvaticantour fixed')
}

// ─── Seed goldenrometour ──────────────────────────────────────────────────────

const goldenTours = [
  {
    title: 'Vatican Museums & Sistine Chapel Skip-the-Line Tour',
    slug: 'golden-vatican-museums-sistine-chapel',
    price: 52,
    originalPrice: 70,
    duration: '3 hours',
    category: 'vatican',
    groupSize: 'Small Group (max 15)',
    meetingPoint: 'Viale Giulio Cesare 34, Rome — look for Golden Rome Tour guide with golden sign',
    mapAddress: 'Viale Giulio Cesare 34, 00192 Rome, Italy',
    maxParticipants: 15,
    badge: 'Bestseller',
    rating: 4.9,
    reviewCount: 1124,
    description: [{ _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'Experience the Vatican Museums and Sistine Chapel with a skip-the-line ticket and expert guide. Walk through the Gallery of Maps, Raphael Rooms, and stand beneath Michelangelo\'s breathtaking ceiling in the Sistine Chapel.' }] }],
    highlights: ['Skip-the-line reserved entrance', 'Expert licensed guide (English)', 'Gallery of Maps & Raphael Rooms', 'Sistine Chapel', 'Small group max 15', 'Wireless headsets'],
    includes: ['Skip-the-line Vatican Museums ticket', 'Licensed English guide', 'Wireless headset'],
    excludes: ['St. Peter\'s Basilica (add-on available)', 'Gratuities', 'Hotel pickup'],
    importantInfo: ['Dress code: shoulders and knees covered', 'Arrive 15 minutes early', 'No large bags'],
    guestTypes: [{ name: 'Adult', price: 52 }, { name: 'Youth', price: 42, description: 'Age 13–17' }, { name: 'Child', price: 28, description: 'Age 6–12' }],
    tags: ['skip-the-line', 'vatican', 'sistine-chapel', 'guided'],
  },
  {
    title: 'Vatican Museums, Sistine Chapel & St. Peter\'s Basilica Complete Tour',
    slug: 'golden-vatican-complete-tour',
    price: 69,
    originalPrice: 89,
    duration: '3.5 hours',
    category: 'vatican',
    groupSize: 'Small Group (max 15)',
    meetingPoint: 'Viale Giulio Cesare 34, Rome — look for Golden Rome Tour guide',
    mapAddress: 'Viale Giulio Cesare 34, 00192 Rome, Italy',
    maxParticipants: 15,
    badge: 'Most Popular',
    rating: 4.9,
    reviewCount: 2341,
    description: [{ _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'The complete Vatican experience — Vatican Museums, Sistine Chapel, and St. Peter\'s Basilica in one unforgettable tour. Skip all the lines and explore with an expert guide.' }] }],
    highlights: ['Skip-the-line Vatican Museums', 'Sistine Chapel', 'St. Peter\'s Basilica', 'Michelangelo\'s Pietà', 'Bernini\'s baldachin', 'Small group max 15'],
    includes: ['Skip-the-line Vatican Museums ticket', 'St. Peter\'s Basilica entry', 'Licensed English guide', 'Wireless headset'],
    excludes: ['Dome climb', 'Gratuities', 'Hotel pickup'],
    importantInfo: ['Dress code strictly enforced', 'No shorts or sleeveless tops', 'Arrive 15 minutes early'],
    guestTypes: [{ name: 'Adult', price: 69 }, { name: 'Youth', price: 55, description: 'Age 13–17' }, { name: 'Child', price: 38, description: 'Age 6–12' }],
    tags: ['skip-the-line', 'vatican', 'st-peters', 'complete'],
  },
  {
    title: 'Colosseum, Roman Forum & Palatine Hill Tour',
    slug: 'golden-colosseum-roman-forum-tour',
    price: 48,
    originalPrice: 65,
    duration: '2.5 hours',
    category: 'colosseum',
    groupSize: 'Small Group (max 15)',
    meetingPoint: 'Piazza del Colosseo, in front of the Arch of Constantine — Golden Rome Tour guide',
    mapAddress: 'Piazza del Colosseo, 1, 00184 Rome, Italy',
    maxParticipants: 15,
    badge: 'Top Rated',
    rating: 4.8,
    reviewCount: 876,
    description: [{ _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'Step inside the world\'s most iconic amphitheatre and discover the brutal world of gladiatorial combat. Continue to the Roman Forum and Palatine Hill for panoramic views over ancient Rome.' }] }],
    highlights: ['Skip-the-line Colosseum entry', 'Arena floor access', 'Roman Forum', 'Palatine Hill views', 'Expert guide', 'Small group max 15'],
    includes: ['Skip-the-line Colosseum ticket', 'Roman Forum & Palatine Hill entry', 'Licensed English guide', 'Wireless headset'],
    excludes: ['Underground (upgrade available)', 'Gratuities', 'Transport'],
    importantInfo: ['Wear comfortable shoes', 'Bring water', 'No large bags inside Colosseum'],
    guestTypes: [{ name: 'Adult', price: 48 }, { name: 'Youth', price: 38, description: 'Age 13–17' }, { name: 'Child', price: 24, description: 'Age 6–12' }],
    tags: ['colosseum', 'roman-forum', 'ancient-rome', 'skip-the-line'],
  },
  {
    title: 'Colosseum Underground & Arena Floor VIP Tour',
    slug: 'golden-colosseum-underground-vip',
    price: 89,
    originalPrice: 115,
    duration: '3 hours',
    category: 'colosseum',
    groupSize: 'Small Group (max 12)',
    meetingPoint: 'Piazza del Colosseo, in front of the Arch of Constantine — Golden Rome Tour guide',
    mapAddress: 'Piazza del Colosseo, 1, 00184 Rome, Italy',
    maxParticipants: 12,
    badge: 'VIP',
    rating: 5.0,
    reviewCount: 312,
    description: [{ _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'Go beyond the standard tour and explore the Colosseum\'s underground hypogeum — the network of tunnels where gladiators and animals waited before battle. Walk on the arena floor where history was made.' }] }],
    highlights: ['Underground hypogeum access', 'Arena floor where gladiators fought', 'Roman Forum & Palatine Hill', 'Expert guide', 'Small group max 12', 'Exclusive VIP access'],
    includes: ['VIP Colosseum ticket with underground', 'Arena floor access', 'Roman Forum & Palatine Hill', 'Licensed English guide', 'Wireless headset'],
    excludes: ['Gratuities', 'Transport'],
    importantInfo: ['Underground areas can be cold — bring a layer', 'Not suitable for claustrophobic visitors', 'Arrive 15 minutes early'],
    guestTypes: [{ name: 'Adult', price: 89 }, { name: 'Youth', price: 72, description: 'Age 13–17' }],
    tags: ['colosseum', 'underground', 'vip', 'arena-floor', 'exclusive'],
  },
  {
    title: 'Rome in a Day: Vatican & Colosseum Combo Tour',
    slug: 'golden-rome-in-a-day-combo',
    price: 109,
    originalPrice: 145,
    duration: '7 hours',
    category: 'city',
    groupSize: 'Small Group (max 12)',
    meetingPoint: 'Viale Giulio Cesare 34, Rome — 08:30 start for Vatican',
    mapAddress: 'Viale Giulio Cesare 34, 00192 Rome, Italy',
    maxParticipants: 12,
    badge: 'Best Value',
    rating: 4.9,
    reviewCount: 567,
    description: [{ _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'See Rome\'s two greatest wonders in one day. Morning at the Vatican Museums, Sistine Chapel and St. Peter\'s Basilica, then afternoon at the Colosseum and Roman Forum. Two expert guides, skip-the-line at both.' }] }],
    highlights: ['Vatican Museums & Sistine Chapel (morning)', 'St. Peter\'s Basilica', 'Colosseum & Roman Forum (afternoon)', 'Two expert guides', 'Skip-the-line both sites', 'Small group max 12'],
    includes: ['Vatican Museums skip-the-line ticket', 'St. Peter\'s Basilica entry', 'Colosseum + Roman Forum ticket', 'Two licensed English guides', 'Wireless headsets'],
    excludes: ['Lunch (1.5h break)', 'Transport between sites', 'Gratuities'],
    importantInfo: ['Long day — wear comfortable shoes', 'Dress code for Vatican', 'Bring water and snacks', 'Lunch break ~13:00–14:30'],
    guestTypes: [{ name: 'Adult', price: 109 }, { name: 'Youth', price: 89, description: 'Age 13–17' }, { name: 'Child', price: 55, description: 'Age 6–12' }],
    tags: ['combo', 'full-day', 'vatican', 'colosseum', 'best-value'],
  },
  {
    title: 'Borghese Gallery Skip-the-Line Tour',
    slug: 'golden-borghese-gallery-tour',
    price: 55,
    originalPrice: 72,
    duration: '2 hours',
    category: 'hidden-gems',
    groupSize: 'Small Group (max 10)',
    meetingPoint: 'Piazzale del Museo Borghese, 5 — Golden Rome Tour guide at the entrance',
    mapAddress: 'Piazzale del Museo Borghese, 5, 00197 Rome, Italy',
    maxParticipants: 10,
    badge: 'Hidden Gem',
    rating: 4.9,
    reviewCount: 423,
    description: [{ _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'Discover one of Rome\'s most spectacular art collections — Bernini\'s breathtaking sculptures and Caravaggio\'s dramatic paintings in the stunning Villa Borghese. Entry is strictly limited, making this an intimate and exclusive experience.' }] }],
    highlights: ['Skip-the-line reserved entry', 'Bernini\'s Apollo and Daphne', 'Caravaggio masterpieces', 'Expert art historian guide', 'Strictly limited to 10 guests', 'Stunning villa setting'],
    includes: ['Reserved Borghese Gallery ticket', 'Licensed art historian guide', 'Wireless headset'],
    excludes: ['Gratuities', 'Transport', 'Photography fee'],
    importantInfo: ['Entry strictly timed — no late arrivals', 'Bags must be left in cloakroom', 'No photography with flash', 'Book well in advance — very limited availability'],
    guestTypes: [{ name: 'Adult', price: 55 }, { name: 'Youth', price: 45, description: 'Age 13–17' }],
    tags: ['borghese', 'bernini', 'caravaggio', 'art', 'exclusive'],
  },
  {
    title: 'Pantheon Guided Tour with Priority Entry',
    slug: 'golden-pantheon-guided-tour',
    price: 35,
    originalPrice: 48,
    duration: '1.5 hours',
    category: 'city',
    groupSize: 'Small Group (max 15)',
    meetingPoint: 'Piazza della Rotonda, in front of the Pantheon fountain — Golden Rome Tour guide',
    mapAddress: 'Piazza della Rotonda, 00186 Rome, Italy',
    maxParticipants: 15,
    badge: 'Quick & Easy',
    rating: 4.8,
    reviewCount: 789,
    description: [{ _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'The Pantheon is the best-preserved ancient building in Rome — and the world. Your expert guide will reveal the engineering genius behind its 2,000-year-old dome and the fascinating stories of the gods, emperors, and artists buried within.' }] }],
    highlights: ['Priority entry — skip the queue', 'World\'s largest unreinforced concrete dome', 'Tomb of Raphael', 'Expert guide', 'Small group max 15', 'Perfect for first-time visitors'],
    includes: ['Priority Pantheon entry ticket', 'Licensed English guide', 'Wireless headset'],
    excludes: ['Gratuities', 'Transport'],
    importantInfo: ['Dress code: shoulders and knees covered', 'No large bags', 'Photography allowed'],
    guestTypes: [{ name: 'Adult', price: 35 }, { name: 'Youth', price: 28, description: 'Age 13–17' }, { name: 'Child', price: 18, description: 'Age 6–12' }],
    tags: ['pantheon', 'ancient-rome', 'priority-entry', 'city-tour'],
  },
  {
    title: 'Private Rome Highlights Tour by Car',
    slug: 'golden-private-rome-car-tour',
    price: 320,
    duration: '4 hours',
    category: 'city',
    groupSize: 'Private (your group only)',
    meetingPoint: 'Your hotel or any central Rome location — flexible',
    mapAddress: 'Rome city centre, Italy',
    maxParticipants: 8,
    badge: 'Private',
    rating: 5.0,
    reviewCount: 156,
    description: [{ _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'See all of Rome\'s highlights in comfort and style with your own private car and expert guide. Colosseum, Trevi Fountain, Spanish Steps, Piazza Navona, Vatican — all at your own pace.' }] }],
    highlights: ['Private car with driver', 'Expert private guide', 'Colosseum exterior', 'Trevi Fountain', 'Spanish Steps', 'Piazza Navona', 'Vatican Square', 'Flexible itinerary'],
    includes: ['Private air-conditioned car', 'Licensed English guide (4 hours)', 'Hotel pickup & dropoff'],
    excludes: ['Entry tickets to monuments', 'Gratuities', 'Meals'],
    importantInfo: ['Price is per group up to 4 people', 'Additional guests: €60/person', 'Flexible start time 08:00–14:00'],
    guestTypes: [{ name: 'Group (up to 4)', price: 320, description: 'Fixed price for up to 4 people' }, { name: 'Extra Person', price: 60, description: 'Each additional person' }],
    tags: ['private', 'car-tour', 'highlights', 'flexible', 'luxury'],
  },
]

async function seedGoldenRomeTour() {
  console.log('\n🌱 Seeding Golden Rome Tour products...')

  // Create or find site
  let siteId: string
  const existing = await client.fetch('*[_type == "site" && slug.current == "goldenrometour"][0]{_id}')
  
  if (existing?._id) {
    console.log(`✅ Site already exists: ${existing._id}`)
    siteId = existing._id
  } else {
    const site = await client.create({
      _type: 'site',
      title: 'Golden Rome Tour',
      slug: { _type: 'slug', current: 'goldenrometour' },
      domain: 'https://goldenrometour.com',
      isActive: true,
      brandColors: {
        primary: { hex: '#C9A84C' },
        secondary: { hex: '#1a1a2e' },
        accent: { hex: '#e8c96d' },
      },
      seo: {
        metaTitle: 'Golden Rome Tour — Premium Vatican & Colosseum Tours',
        metaDescription: 'Premium skip-the-line Vatican, Colosseum & Rome tours. Expert licensed guides, small groups, best prices guaranteed.',
      },
      contactEmail: 'info@goldenrometour.com',
      logoText: 'Golden Rome',
      logoTextAccent: 'Tour',
    })
    siteId = site._id
    console.log(`✅ Created site: ${siteId}`)
  }

  // Seed tours
  for (const tour of goldenTours) {
    try {
      const existingTour = await client.fetch(`*[_type == "tour" && slug.current == $slug][0]{_id}`, { slug: tour.slug })
      
      const doc: any = {
        _type: 'tour',
        sites: [{ _type: 'reference', _ref: siteId }],
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
        isActive: true,
      }

      if (existingTour?._id) {
        await client.createOrReplace({ ...doc, _id: existingTour._id })
        console.log(`  ✏️  Updated: ${tour.title}`)
      } else {
        await client.create(doc)
        console.log(`  ✅ Created: ${tour.title}`)
      }
    } catch (e: any) {
      console.error(`  ❌ Failed: ${tour.title} — ${e.message}`)
    }
  }
}

async function main() {
  await fixRomanVatican()
  await seedGoldenRomeTour()
  
  // Final check
  console.log('\n📊 Final tour count by site:')
  const all = await client.fetch(`*[_type == "tour"]{title, "sites": sites[]->{slug}}`)
  const counts: Record<string, number> = {}
  for (const t of all) {
    const key = t.sites?.map((s: any) => s.slug).sort().join('+') || 'NO SITE'
    counts[key] = (counts[key] || 0) + 1
  }
  for (const [site, count] of Object.entries(counts)) {
    console.log(`  ${site}: ${count} tours`)
  }
  console.log('\n🎉 Done!')
}

main().catch(console.error)
