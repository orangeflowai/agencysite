/**
 * Seeds goldenrometour tours into Sanity CMS
 * Run: npx tsx scripts/seed-sanity-tours.ts
 *
 * Uses the provided API token to create/update all 6 tours.
 */

import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'gycprksj',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: 'skBy2n8wkubUQPIkFzEV4lTm16KzdJCT1c7bwzudOCsXrYRkzWzhI8RppFqgbxG7uoEw0nQDML9kud1VViPMHubFQtPXkEoCOoq5028hPv3s0snnKa40Gx4KTLnlorromo2xFKGYl8WnEIraFc9otONH7Tj9WHnSACCNwTTfVLRQaohsaT5e',
  useCdn: false,
})

// Tour data to seed
const tours = [
  {
    _type: 'tour',
    title: 'Complete Guided Tour: Vatican Museums & Sistine Chapel',
    slug: { _type: 'slug', current: 'vatican-museums-and-sistine-chapel-guided-tour' },
    price: 65,
    duration: '3 Hours',
    groupSize: 'Up to 24 participants',
    category: 'vatican',
    badge: 'Best Seller',
    rating: 4.8,
    reviewCount: 2850,
    meetingPoint: 'Via Germanico, 40, 00192 Roma, RM, Italy',
    description: [{ _type: 'block', children: [{ _type: 'span', text: "Bring history to life with an expert guide on this comprehensive tour of the Vatican Museums and the Sistine Chapel. Bypass the legendary crowds with exclusive skip-the-line access and dive deep into the world's largest collection of outstanding Renaissance masterpieces." }], markDefs: [], style: 'normal' }],
    highlights: [
      'Exclusive Skip-the-Line Entry: Save hours of waiting with fast-track access',
      'Expert Storytelling: Learn the history and secrets from a professional guide',
      'Iconic Masterpieces: Witness the genius of Michelangelo, Raphael, and Bernini',
      'Comprehensive Route: Explore Raphael\'s Rooms, Gallery of the Maps, Pinecone Courtyard',
      'Small Group Experience: Capped group size for a more personal experience'
    ],
    includes: [
      'Guided tour of the Vatican Museums',
      'Guided tour of the Sistine Chapel',
      'Fast-track, skip-the-line entry to all included sites',
      'Professional expert tour guide'
    ],
    excludes: [
      'Guided tour inside St. Peter\'s Basilica',
      'Hotel pick-up and drop-off',
      'Gratuities',
      'Food and beverages'
    ],
    importantInfo: [
      'Availability: Monday – Saturday (Closed on Sundays)',
      'Duration: 3 Hours',
      'Please arrive 25 minutes prior to your scheduled start time',
      'Security screening is mandatory at the Vatican',
      'Dress code: shoulders and knees must be covered',
      'Large bags, suitcases, and sharp objects are not allowed',
      'Photography is prohibited inside the Sistine Chapel'
    ],
    mainImageUrl: 'https://images.pexels.com/photos/3874600/pexels-photo-3874600.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    _type: 'tour',
    title: 'Skip-the-Line: Vatican Museums & Sistine Chapel Ticket',
    slug: { _type: 'slug', current: 'vatican-museums-sistine-chapel-skip-the-line' },
    price: 45,
    duration: 'Flexible',
    groupSize: 'Self-Guided',
    category: 'vatican',
    badge: 'Popular',
    rating: 4.7,
    reviewCount: 1850,
    meetingPoint: 'Via Germanico, 40, 00192 Roma, RM, Italy',
    description: [{ _type: 'block', children: [{ _type: 'span', text: "Bypass the crowds and maximize your time inside one of the world's most incredible art collections. This fast-track entry ticket lets you skip the notorious Vatican queues, giving you the freedom to explore at your own pace." }], markDefs: [], style: 'normal' }],
    highlights: [
      'Fast-Track Access: Breeze past the long lines with priority entry',
      'Independent Exploration: Explore the vast collections at your own pace',
      'Michelangelo\'s Masterpieces: Stand beneath the world-famous Sistine Chapel frescoes',
      'Self-Guided Map: Navigate with a complimentary Vatican map'
    ],
    includes: [
      'Priority Skip-the-Line Entry Ticket',
      'Instant ticket delivery with Mobile Voucher',
      'Detailed map of the Vatican Museums',
      'All reservation and service fees'
    ],
    excludes: [
      'Hotel pick-up and drop-off',
      'Gratuities',
      'Food and beverages'
    ],
    importantInfo: [
      'Availability: Monday – Saturday (Closed on Sundays)',
      'Duration: Flexible',
      'Security screening is mandatory at the Vatican',
      'Dress code: shoulders and knees must be covered',
      'Photography is prohibited inside the Sistine Chapel'
    ],
    mainImageUrl: 'https://images.pexels.com/photos/2064827/pexels-photo-2064827.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    _type: 'tour',
    title: "Vatican Museums, Sistine Chapel & St. Peter's Basilica Tour",
    slug: { _type: 'slug', current: 'vatican-museums-sistine-chapel-st-peters-guided-tour' },
    price: 89,
    duration: '4 Hours',
    groupSize: 'Up to 15 participants',
    category: 'vatican',
    badge: 'Premium',
    rating: 4.9,
    reviewCount: 1240,
    meetingPoint: 'Via Germanico, 40, 00192 Roma, RM, Italy',
    description: [{ _type: 'block', children: [{ _type: 'span', text: "Experience the ultimate Vatican tour — from the breathtaking galleries of the Vatican Museums through the awe-inspiring Sistine Chapel and into the grandeur of St. Peter's Basilica. A fully guided, all-access Vatican experience." }], markDefs: [], style: 'normal' }],
    highlights: [
      'Complete Vatican experience in a single tour',
      'Skip-the-line access to all three sites',
      "Expert art historian guide with specialized Vatican accreditation",
      "St. Peter's Basilica rooftop access included",
      'Small private group — max 15 participants',
    ],
    includes: [
      'Skip-the-line entry to Vatican Museums',
      'Guided tour of the Sistine Chapel',
      "Entry to St. Peter's Basilica",
      "Climb to St. Peter's dome (lift + stairs)",
      'Professional licensed art historian guide',
      'Complimentary audio headsets'
    ],
    excludes: [
      'Hotel pick-up and drop-off',
      'Lunch or beverages',
      'Gratuities'
    ],
    importantInfo: [
      'Availability: Tuesday – Saturday',
      'Duration: Approximately 4 hours',
      'Dress code strictly enforced: covered knees and shoulders',
      'Vatican security screening is mandatory',
      'Photography is prohibited inside the Sistine Chapel'
    ],
    mainImageUrl: 'https://images.pexels.com/photos/2422461/pexels-photo-2422461.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    _type: 'tour',
    title: 'Early Morning Vatican Museums — Before the Crowds',
    slug: { _type: 'slug', current: 'early-morning-vatican-tour' },
    price: 110,
    duration: '2.5 Hours',
    groupSize: 'Up to 8 participants',
    category: 'vatican',
    badge: 'Exclusive',
    rating: 5.0,
    reviewCount: 412,
    meetingPoint: 'Piazza del Risorgimento, 00192 Roma — look for the Golden Rome Tour guide',
    description: [{ _type: 'block', children: [{ _type: 'span', text: "Experience the Vatican like very few visitors ever do — in near-total silence before the museum opens to the public. Walk through the Gallery of Maps, the Raphael Rooms, and the Sistine Chapel with almost no one else around." }], markDefs: [], style: 'normal' }],
    highlights: [
      'Pre-opening exclusive access — 90 minutes before the general public',
      'Walk the Sistine Chapel in near-complete silence',
      'Maximum 8 guests for an intimate experience',
      'Expert art historian guide fully dedicated to your group',
      'Complimentary Roman espresso before entry'
    ],
    includes: [
      'Exclusive early morning skip-the-line entry',
      'Private small-group guided tour (max 8)',
      'Expert art historian guide',
      'Complimentary coffee at a nearby Roman bar',
      'Audio headsets'
    ],
    excludes: [
      'Hotel transfers',
      'Gratuities',
      'Additional breakfast'
    ],
    importantInfo: [
      'Available: Select Wednesdays and Fridays only',
      'Start Time: 7:00 AM sharp — late arrivals cannot be accommodated',
      'Duration: 2.5 hours',
      'Group Size: Maximum 8 participants',
      'Dress code strictly enforced: covered knees and shoulders',
      'Advance booking required — minimum 48 hours notice'
    ],
    mainImageUrl: 'https://images.pexels.com/photos/1174136/pexels-photo-1174136.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    _type: 'tour',
    title: 'Colosseum, Roman Forum & Palatine Hill Guided Tour',
    slug: { _type: 'slug', current: 'colosseum-forum-palatine-guided-tour' },
    price: 55,
    duration: '3 Hours',
    groupSize: 'Up to 20 participants',
    category: 'colosseum',
    badge: 'Top Rated',
    rating: 4.8,
    reviewCount: 3420,
    meetingPoint: 'Via Sacra, near the Arch of Titus, Roman Forum entrance — look for the Golden Rome Tour sign',
    description: [{ _type: 'block', children: [{ _type: 'span', text: "Step inside the most iconic monument of the ancient world. Our expert-guided tour takes you on a journey through 2,000 years of Roman history — from gladiatorial combat to imperial splendour. Skip-the-line entry included." }], markDefs: [], style: 'normal' }],
    highlights: [
      'Skip-the-line entry to the Colosseum, Roman Forum, and Palatine Hill',
      'Hear the stories of gladiators, emperors, and the Roman Republic',
      'See the arena floor where battles once took place',
      'Explore the ancient heart of Rome — the Roman Forum',
      'Panoramic views of the Eternal City from Palatine Hill'
    ],
    includes: [
      'Skip-the-line entry to all three sites',
      'Expert licensed guide',
      'Audio headsets',
      'All entrance fees'
    ],
    excludes: [
      'Hotel pick-up',
      'Food and drinks',
      'Gratuities'
    ],
    importantInfo: [
      'Availability: Daily (subject to site closures)',
      'Duration: 3 Hours',
      'Wear comfortable walking shoes — the Forum has uneven terrain',
      'Bring water, especially in summer',
      'The site is outdoors — sunscreen and hat recommended in summer'
    ],
    mainImageUrl: 'https://images.pexels.com/photos/532263/pexels-photo-532263.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    _type: 'tour',
    title: "Rome Highlights Walking Tour — Trevi, Pantheon & Piazzas",
    slug: { _type: 'slug', current: 'rome-highlights-walking-tour' },
    price: 35,
    duration: '3 Hours',
    groupSize: 'Up to 25 participants',
    category: 'city',
    badge: 'Great Value',
    rating: 4.7,
    reviewCount: 2100,
    meetingPoint: "Piazza di Trevi (at the fountain), 00187 Roma",
    description: [{ _type: 'block', children: [{ _type: 'span', text: "Walk Rome like a local. This expertly curated walking tour takes you through the most beautiful piazzas, fountains, and monuments — from the Trevi Fountain to the Pantheon, Piazza Navona, and the Campo de' Fiori." }], markDefs: [], style: 'normal' }],
    highlights: [
      'Iconic Trevi Fountain — best photography tips from your guide',
      'The Pantheon — 2,000-year-old architectural marvel',
      'Piazza Navona — the liveliest square in Rome',
      "Campo de' Fiori — Rome's famous morning market square",
      'Hidden alleyways, local secrets, and the best gelato spots'
    ],
    includes: [
      'Expert local guide',
      'Audio headsets',
      'Walking tour map',
      'Gelato stop at a local gelateria'
    ],
    excludes: [
      'Museum entries (exterior views only)',
      'Transportation',
      'Gratuities'
    ],
    importantInfo: [
      'Availability: Daily',
      'Duration: 3 Hours (approximately 4km of walking)',
      'Suitable for all fitness levels — mostly flat cobblestone streets',
      'Comfortable shoes strongly recommended',
      'Morning tours offer better light and fewer crowds'
    ],
    mainImageUrl: 'https://images.pexels.com/photos/1797158/pexels-photo-1797158.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
]

async function getSiteId(): Promise<string | null> {
  try {
    const result = await client.fetch(
      `*[_type == "site" && slug.current == "goldenrometour"][0]{ _id }`
    )
    if (result?._id) {
      console.log('✅ Found goldenrometour site:', result._id)
      return result._id
    }
    // Create the site document if it doesn't exist
    console.log('⚠️  Site not found, creating goldenrometour site document...')
    const newSite = await client.create({
      _type: 'site',
      title: 'Golden Rome Tour',
      slug: { _type: 'slug', current: 'goldenrometour' },
      domain: 'https://goldenrometour.com',
      isActive: true,
      contactEmail: 'info@goldenrometour.com',
      contactPhone: '+39 351 419 9425',
    })
    console.log('✅ Created site:', newSite._id)
    return newSite._id
  } catch (e) {
    console.error('Failed to get/create site:', e)
    return null
  }
}

async function seedTours() {
  console.log('🚀 Seeding goldenrometour tours into Sanity...\n')

  const siteId = await getSiteId()

  for (const tour of tours) {
    try {
      // Check if tour already exists by slug
      const existing = await client.fetch(
        `*[_type == "tour" && slug.current == $slug][0]{ _id }`,
        { slug: tour.slug.current }
      )

      const doc: any = {
        _type: 'tour',
        title: tour.title,
        slug: tour.slug,
        price: tour.price,
        duration: tour.duration,
        groupSize: tour.groupSize,
        category: tour.category,
        badge: tour.badge,
        rating: tour.rating,
        reviewCount: tour.reviewCount,
        meetingPoint: tour.meetingPoint,
        description: tour.description,
        highlights: tour.highlights,
        includes: tour.includes,
        excludes: tour.excludes,
        importantInfo: tour.importantInfo,
        // Link to goldenrometour site
        ...(siteId ? { sites: [{ _type: 'reference', _ref: siteId }] } : {}),
      }

      if (existing?._id) {
        await client.patch(existing._id).set(doc).commit()
        console.log(`✅ Updated: ${tour.title}`)
      } else {
        await client.create(doc)
        console.log(`✅ Created: ${tour.title}`)
      }
    } catch (e) {
      console.error(`❌ Failed: ${tour.title}`, e)
    }
  }

  console.log('\n✅ Done! All tours seeded.')
  console.log('\nNote: Images are served from Pexels URLs via the static fallback in toursData.ts')
  console.log('To add images in Sanity, upload them in the Sanity Studio at /studio')
}

seedTours()
