#!/usr/bin/env node
/**
 * Add Vatican Tours to Rome Wander in Sanity
 */

const { createClient } = require('@sanity/client')

const client = createClient({
  projectId: 'aknmkkwd',
  dataset: 'production',
  token: 'skFBTe2s38Bz1MltanZf6ftSHyH3gVcK5EFRVuy3TOnzurb3ZyUQqip51aJWHC6cMfIkZu7F0u1J1iUii479jJLXzBgyQUODLzXISOD5RRuM94D99H6C4vPsNbAdmMTPcL0JhJbFhBO9NNl8WLGabR4NXpEWQETI2iKTi5gFDtXD65gcBw1e',
  apiVersion: '2024-01-01',
  useCdn: false
})

const vaticanTours = [
  {
    _type: 'tour',
    title: 'Vatican Museums & Sistine Chapel Skip-the-Line Tour',
    slug: { _type: 'slug', current: 'vatican-museums-sistine-chapel-skip-line' },
    tenant: 'romewander',
    category: 'vatican',
    status: 'live',
    active: true,
    featured: true,
    description: 'Skip the long lines and explore the Vatican Museums and Sistine Chapel with an expert guide. Marvel at Michelangelo\'s masterpiece and discover the world\'s greatest art collection.',
    shortDescription: 'Skip-the-line access to Vatican Museums and Sistine Chapel with expert guide',
    duration: 180, // 3 hours in minutes
    price: 65,
    currency: 'EUR',
    maxParticipants: 25,
    minParticipants: 1,
    meetingPoint: 'Vatican Museums entrance, Viale Vaticano',
    highlights: [
      'Skip-the-line entrance to Vatican Museums',
      'Sistine Chapel with Michelangelo\'s frescoes',
      'Raphael Rooms',
      'Gallery of Maps',
      'Expert English-speaking guide',
      'Small group tour (max 25 people)'
    ],
    included: [
      'Skip-the-line entrance tickets',
      'Professional tour guide',
      'Headsets for groups over 10',
      'All taxes and fees'
    ],
    notIncluded: [
      'Hotel pickup and drop-off',
      'Food and drinks',
      'Gratuities (optional)'
    ],
    cancellationPolicy: 'Free cancellation up to 24 hours before the tour starts',
    importantInfo: [
      'Dress code: Knees and shoulders must be covered',
      'Large bags and backpacks not allowed',
      'Security checks may cause delays',
      'Tour operates in all weather conditions'
    ],
    languages: ['English', 'Spanish', 'French', 'German'],
    accessibility: 'Wheelchair accessible',
    ageRestriction: 'All ages welcome',
    difficulty: 'Easy',
    tags: ['vatican', 'museums', 'sistine-chapel', 'skip-the-line', 'art', 'history']
  },
  {
    _type: 'tour',
    title: 'Early Morning Vatican Tour - Before the Crowds',
    slug: { _type: 'slug', current: 'early-morning-vatican-tour' },
    tenant: 'romewander',
    category: 'vatican',
    status: 'live',
    active: true,
    featured: true,
    description: 'Experience the Vatican Museums and Sistine Chapel in peaceful tranquility before the crowds arrive. Enjoy exclusive early access and intimate viewing of the world\'s greatest masterpieces.',
    shortDescription: 'Exclusive early access to Vatican Museums before opening hours',
    duration: 180,
    price: 89,
    currency: 'EUR',
    maxParticipants: 20,
    minParticipants: 1,
    meetingPoint: 'Vatican Museums entrance, Viale Vaticano',
    highlights: [
      'Exclusive early morning access',
      'Sistine Chapel with minimal crowds',
      'Raphael Rooms in peace',
      'Gallery of Maps',
      'Expert guide with art history background',
      'Small group (max 20 people)'
    ],
    included: [
      'Early entrance tickets',
      'Professional art historian guide',
      'Headsets',
      'All fees and taxes'
    ],
    notIncluded: [
      'Hotel pickup',
      'Breakfast',
      'Gratuities'
    ],
    cancellationPolicy: 'Free cancellation up to 48 hours before the tour',
    importantInfo: [
      'Tour starts at 7:30 AM',
      'Dress code strictly enforced',
      'No large bags allowed',
      'Must arrive 15 minutes early'
    ],
    languages: ['English'],
    accessibility: 'Wheelchair accessible',
    ageRestriction: 'Recommended for ages 12+',
    difficulty: 'Easy',
    tags: ['vatican', 'early-access', 'exclusive', 'sistine-chapel', 'museums']
  },
  {
    _type: 'tour',
    title: 'Vatican & St. Peter\'s Basilica Complete Tour',
    slug: { _type: 'slug', current: 'vatican-st-peters-basilica-complete' },
    tenant: 'romewander',
    category: 'vatican',
    status: 'live',
    active: true,
    featured: false,
    description: 'Comprehensive tour of Vatican Museums, Sistine Chapel, and St. Peter\'s Basilica. Discover the complete Vatican experience with skip-the-line access and expert commentary.',
    shortDescription: 'Complete Vatican experience including Museums, Sistine Chapel, and Basilica',
    duration: 240, // 4 hours
    price: 79,
    currency: 'EUR',
    maxParticipants: 25,
    minParticipants: 1,
    meetingPoint: 'Vatican Museums entrance, Viale Vaticano',
    highlights: [
      'Vatican Museums with skip-the-line',
      'Sistine Chapel',
      'St. Peter\'s Basilica',
      'Michelangelo\'s Pietà',
      'Bernini\'s Baldachin',
      'Expert guide throughout'
    ],
    included: [
      'Skip-the-line tickets',
      'Professional guide',
      'Headsets',
      'Basilica entrance',
      'All taxes'
    ],
    notIncluded: [
      'Hotel transfer',
      'Food and drinks',
      'Dome climb (optional extra)',
      'Tips'
    ],
    cancellationPolicy: 'Free cancellation up to 24 hours in advance',
    importantInfo: [
      'Modest dress required',
      'No shorts or sleeveless tops',
      'Security screening required',
      'Basilica may close for religious ceremonies'
    ],
    languages: ['English', 'Spanish', 'Italian'],
    accessibility: 'Partially wheelchair accessible',
    ageRestriction: 'All ages',
    difficulty: 'Moderate',
    tags: ['vatican', 'st-peters', 'basilica', 'complete-tour', 'skip-the-line']
  },
  {
    _type: 'tour',
    title: 'Vatican Gardens Private Walking Tour',
    slug: { _type: 'slug', current: 'vatican-gardens-private-tour' },
    tenant: 'romewander',
    category: 'vatican',
    status: 'live',
    active: true,
    featured: false,
    description: 'Exclusive access to the Vatican Gardens, a hidden oasis in the heart of Rome. Explore beautifully manicured gardens, fountains, and monuments with a private guide.',
    shortDescription: 'Private guided tour of the exclusive Vatican Gardens',
    duration: 120,
    price: 45,
    currency: 'EUR',
    maxParticipants: 10,
    minParticipants: 1,
    meetingPoint: 'Vatican Gardens entrance',
    highlights: [
      'Exclusive Vatican Gardens access',
      'Beautiful Renaissance gardens',
      'Fountains and grottos',
      'Papal monuments',
      'Private guide',
      'Small group experience'
    ],
    included: [
      'Vatican Gardens entrance',
      'Private guide',
      'All fees'
    ],
    notIncluded: [
      'Vatican Museums entrance',
      'Hotel pickup',
      'Food and drinks'
    ],
    cancellationPolicy: 'Free cancellation up to 72 hours before',
    importantInfo: [
      'Advance booking required',
      'Limited availability',
      'Comfortable walking shoes recommended',
      'Weather dependent'
    ],
    languages: ['English', 'Italian'],
    accessibility: 'Wheelchair accessible',
    ageRestriction: 'All ages',
    difficulty: 'Easy',
    tags: ['vatican', 'gardens', 'private-tour', 'exclusive', 'nature']
  },
  {
    _type: 'tour',
    title: 'St. Peter\'s Basilica Dome Climb & Crypt',
    slug: { _type: 'slug', current: 'st-peters-dome-climb-crypt' },
    tenant: 'romewander',
    category: 'vatican',
    status: 'live',
    active: true,
    featured: false,
    description: 'Climb to the top of St. Peter\'s Dome for breathtaking views of Rome, then descend to explore the ancient crypts beneath the Basilica where popes are buried.',
    shortDescription: 'Climb St. Peter\'s Dome and explore the papal crypts',
    duration: 150,
    price: 35,
    currency: 'EUR',
    maxParticipants: 15,
    minParticipants: 1,
    meetingPoint: 'St. Peter\'s Square, near the obelisk',
    highlights: [
      'Climb to St. Peter\'s Dome',
      'Panoramic views of Rome',
      'Explore the Basilica',
      'Visit the papal crypts',
      'See St. Peter\'s tomb',
      'Expert guide'
    ],
    included: [
      'Dome entrance ticket',
      'Crypt access',
      'Professional guide',
      'All fees'
    ],
    notIncluded: [
      'Elevator to first level (optional)',
      'Hotel pickup',
      'Food and drinks'
    ],
    cancellationPolicy: 'Free cancellation up to 24 hours before',
    importantInfo: [
      '551 steps to the top (320 if using elevator)',
      'Not suitable for claustrophobia',
      'Moderate fitness required',
      'No large bags allowed'
    ],
    languages: ['English', 'Italian', 'Spanish'],
    accessibility: 'Not wheelchair accessible',
    ageRestriction: 'Minimum age 8 years',
    difficulty: 'Moderate to Challenging',
    tags: ['st-peters', 'dome', 'climb', 'views', 'crypt', 'vatican']
  }
]

async function addTours() {
  console.log('🎨 Adding Vatican Tours to Rome Wander in Sanity...\n')
  
  try {
    // Check if tours already exist
    const existingTours = await client.fetch(
      `*[_type == "tour" && tenant == "romewander"]`
    )
    
    console.log(`📊 Found ${existingTours.length} existing Rome Wander tours\n`)
    
    // Add tours one by one
    for (const tour of vaticanTours) {
      try {
        // Check if tour with this slug already exists
        const existing = await client.fetch(
          `*[_type == "tour" && slug.current == $slug && tenant == "romewander"][0]`,
          { slug: tour.slug.current }
        )
        
        if (existing) {
          console.log(`⚠️  Tour already exists: ${tour.title}`)
          console.log(`   Updating...`)
          
          const updated = await client
            .patch(existing._id)
            .set(tour)
            .commit()
          
          console.log(`   ✅ Updated: ${tour.title}`)
        } else {
          const created = await client.create(tour)
          console.log(`✅ Created: ${tour.title}`)
          console.log(`   ID: ${created._id}`)
          console.log(`   Slug: ${tour.slug.current}`)
        }
        console.log('')
      } catch (error) {
        console.error(`❌ Error with ${tour.title}:`, error.message)
      }
    }
    
    // Verify all tours
    console.log('\n📋 Verifying all Rome Wander tours...')
    const allTours = await client.fetch(
      `*[_type == "tour" && tenant == "romewander" && status == "live"] | order(title asc) {
        _id,
        title,
        "slug": slug.current,
        category,
        status,
        active,
        price,
        duration
      }`
    )
    
    console.log(`\n✅ Total live tours: ${allTours.length}\n`)
    
    allTours.forEach((tour, i) => {
      console.log(`${i + 1}. ${tour.title}`)
      console.log(`   Slug: ${tour.slug}`)
      console.log(`   Price: €${tour.price}`)
      console.log(`   Duration: ${tour.duration} min`)
      console.log(`   Status: ${tour.status} | Active: ${tour.active}`)
      console.log('')
    })
    
    console.log('🎉 All Vatican tours added successfully!')
    console.log('')
    console.log('Next steps:')
    console.log('1. Start Rome Wander: cd romewander && npm run dev')
    console.log('2. Visit: http://localhost:3000')
    console.log('3. Check tours appear on homepage')
    console.log('4. Test tour detail pages')
    console.log('5. Test booking flow')
    
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

addTours()
