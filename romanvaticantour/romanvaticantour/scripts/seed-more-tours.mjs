import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'aknmkkwd',
  dataset: 'production',
  token: 'skZuVqFxy5UDG0uol7abxfDksH7TV3W9cc6VYHvPOocXnOPUbJGKMnZNDcC1hQMr37lRJGz0ufQbWwNUtgy4UjMp3omPFOgTl4Fim28sBW32WaRR1Yd166DD10XcqQGueN302CBWs5L71QpkFfwIFJN2juWdgdr77kDUbE4S8FD2Xsk2p9E1',
  apiVersion: '2024-01-01',
  useCdn: false,
})

const SITE_ID = 'iOvifNJOn8K24O0839uibh' // romanvaticantour

const newTours = [
  {
    title: 'Vatican Museums Skip-the-Line + Sistine Chapel Audio Guide',
    slug: 'vatican-museums-skip-line-audio-guide',
    category: 'vatican',
    price: 39,
    duration: '3 hours',
    rating: 4.9,
    reviewCount: 847,
    badge: 'Best Seller',
    meetingPoint: 'Via dei Musei Vaticani, 00120 Vatican City',
    description: 'Skip the 3-hour queue and explore the Vatican Museums with a professional audio guide. Includes Sistine Chapel access.',
    highlights: ['Skip the line entrance', 'Professional audio guide', 'Sistine Chapel included', 'Raphael Rooms access'],
    includes: ['Skip-the-line ticket', 'Audio guide device', 'Headphones', 'Map of Vatican Museums'],
    maxParticipants: 20,
  },
  {
    title: 'St. Peter\'s Basilica Dome Climb & Crypt Tour',
    slug: 'st-peters-basilica-dome-crypt',
    category: 'vatican',
    price: 45,
    duration: '2.5 hours',
    rating: 4.8,
    reviewCount: 523,
    badge: 'Popular',
    meetingPoint: 'St. Peter\'s Square, Vatican City',
    description: 'Climb to the top of St. Peter\'s Dome for panoramic views of Rome, then descend to the sacred Papal Crypt.',
    highlights: ['Dome climb included', 'Papal Crypt access', 'Panoramic Rome views', 'Expert guide'],
    includes: ['Dome entrance', 'Crypt access', 'Licensed guide', 'Small group max 12'],
    maxParticipants: 12,
  },
  {
    title: 'Vatican Gardens Private Walking Tour',
    slug: 'vatican-gardens-private-tour',
    category: 'vatican',
    price: 89,
    duration: '2 hours',
    rating: 5.0,
    reviewCount: 189,
    badge: 'Exclusive',
    meetingPoint: 'Vatican Museums Entrance, Viale Vaticano',
    description: 'Exclusive access to the Vatican Gardens — 23 hectares of Renaissance and Baroque gardens rarely seen by tourists.',
    highlights: ['Exclusive garden access', 'Private guide', 'Rarely visited areas', 'Photography permitted'],
    includes: ['Garden entrance ticket', 'Private licensed guide', 'Max 8 guests'],
    maxParticipants: 8,
  },
  {
    title: 'Colosseum Arena Floor + Underground Tour',
    slug: 'colosseum-arena-floor-underground',
    category: 'colosseum',
    price: 65,
    duration: '3 hours',
    rating: 4.9,
    reviewCount: 1204,
    badge: 'Top Rated',
    meetingPoint: 'Colosseum Metro Station, Piazza del Colosseo',
    description: 'Walk on the actual arena floor where gladiators fought, then descend underground to see the hypogeum — the hidden world beneath the Colosseum.',
    highlights: ['Arena floor access', 'Underground hypogeum', 'Roman Forum included', 'Expert archaeologist guide'],
    includes: ['Skip-the-line ticket', 'Arena floor access', 'Underground access', 'Roman Forum & Palatine Hill'],
    maxParticipants: 15,
  },
  {
    title: 'Rome in a Day: Vatican + Colosseum Combo',
    slug: 'rome-in-a-day-vatican-colosseum-combo',
    category: 'city',
    price: 119,
    duration: '8 hours',
    rating: 4.9,
    reviewCount: 678,
    badge: 'Best Value',
    meetingPoint: 'Piazza Risorgimento, near Vatican',
    description: 'The ultimate Rome experience — Vatican Museums, Sistine Chapel, and Colosseum all in one unforgettable day with skip-the-line access.',
    highlights: ['Vatican Museums & Sistine Chapel', 'Colosseum & Roman Forum', 'Skip-the-line both sites', 'Lunch break included'],
    includes: ['All entrance tickets', 'Expert guide all day', 'Lunch break (own expense)', 'Hotel pickup available'],
    maxParticipants: 12,
  },
  {
    title: 'Borghese Gallery Skip-the-Line Tour',
    slug: 'borghese-gallery-skip-line-tour',
    category: 'city',
    price: 55,
    duration: '2 hours',
    rating: 4.9,
    reviewCount: 412,
    badge: 'Must See',
    meetingPoint: 'Borghese Gallery Entrance, Piazzale Scipione Borghese 5',
    description: 'The Borghese Gallery limits visitors to 360 at a time — our skip-the-line tickets guarantee your entry to see Bernini\'s masterpieces.',
    highlights: ['Guaranteed entry', 'Bernini sculptures', 'Caravaggio paintings', 'Expert art historian guide'],
    includes: ['Skip-the-line ticket', 'Licensed art historian guide', 'Max 10 guests'],
    maxParticipants: 10,
  },
  {
    title: 'Trastevere & Jewish Ghetto Food Tour',
    slug: 'trastevere-jewish-ghetto-food-tour',
    category: 'city',
    price: 75,
    duration: '3.5 hours',
    rating: 4.8,
    reviewCount: 334,
    badge: 'Foodie Favourite',
    meetingPoint: 'Campo de\' Fiori, Rome',
    description: 'Explore Rome\'s most authentic neighbourhoods with tastings of supplì, cacio e pepe, Jewish artichokes, and gelato.',
    highlights: ['6+ food tastings', 'Trastevere neighbourhood', 'Jewish Ghetto history', 'Local market visit'],
    includes: ['All food tastings', 'Local guide', 'Wine tasting', 'Recipe card'],
    maxParticipants: 12,
  },
  {
    title: 'Pantheon & Piazzas Walking Tour',
    slug: 'pantheon-piazzas-walking-tour',
    category: 'city',
    price: 35,
    duration: '2.5 hours',
    rating: 4.7,
    reviewCount: 891,
    badge: 'Great Value',
    meetingPoint: 'Piazza della Rotonda (Pantheon), Rome',
    description: 'Discover the Pantheon, Piazza Navona, Campo de\' Fiori and the Trevi Fountain with an expert local guide.',
    highlights: ['Pantheon interior', 'Piazza Navona', 'Trevi Fountain', 'Campo de\' Fiori'],
    includes: ['Pantheon entrance', 'Licensed guide', 'Walking tour map'],
    maxParticipants: 20,
  },
]

async function seedTours() {
  console.log(`Seeding ${newTours.length} tours for romanvaticantour...`)
  
  for (const tour of newTours) {
    // Check if already exists
    const existing = await client.fetch(
      `*[_type == "tour" && slug.current == $slug][0]._id`,
      { slug: tour.slug }
    )
    
    if (existing) {
      console.log(`  ↩ Skip (exists): ${tour.slug}`)
      continue
    }
    
    const doc = {
      _type: 'tour',
      title: tour.title,
      slug: { _type: 'slug', current: tour.slug },
      category: tour.category,
      price: tour.price,
      duration: tour.duration,
      rating: tour.rating,
      reviewCount: tour.reviewCount,
      badge: tour.badge,
      meetingPoint: tour.meetingPoint,
      description: tour.description,
      highlights: tour.highlights,
      includes: tour.includes,
      maxParticipants: tour.maxParticipants,
      isActive: true,
      sites: [{ _type: 'reference', _ref: SITE_ID }],
    }
    
    const created = await client.create(doc)
    console.log(`  ✓ Created: ${tour.title}`)
  }
  
  console.log('Done!')
}

seedTours().catch(console.error)
