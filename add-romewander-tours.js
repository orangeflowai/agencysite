#!/usr/bin/env node
/**
 * Add Sample Tours for Rome Wander
 * Duplicates existing tours and assigns them to romewander tenant
 */

const https = require('https')

const PAYLOAD_URL = 'https://admin.wondersofrome.com'
const API_KEY = 'oUXeNps-QPX_IA292tCbtHRFgi1oyuiGfd5WemTNeRE'

// Sample tours to create for Rome Wander
const SAMPLE_TOURS = [
  {
    title: 'Vatican Museums & Sistine Chapel Skip-the-Line',
    slug: 'vatican-museums-sistine-chapel-rwd',
    category: 'vatican',
    price: 79,
    duration: '3 hours',
    description: 'Explore the Vatican Museums and Sistine Chapel with skip-the-line access. Marvel at Michelangelo\'s masterpieces and the world\'s greatest art collection.',
    highlights: [
      'Skip-the-line entrance',
      'Expert licensed guide',
      'Sistine Chapel access',
      'Vatican Museums galleries',
      'Small group experience'
    ],
    includes: [
      'Skip-the-line tickets',
      'Professional guide',
      'Headsets for groups over 6',
      'All entrance fees'
    ],
    meetingPoint: 'Via Germanico 8, 00192 Roma RM, Italy',
    groupSize: 'Small group (max 15)',
    maxParticipants: 15,
    active: true,
    status: 'live',
    tenant: 'romewander'
  },
  {
    title: 'Colosseum Underground & Roman Forum Tour',
    slug: 'colosseum-underground-roman-forum-rwd',
    category: 'colosseum',
    price: 89,
    duration: '3.5 hours',
    description: 'Step into the arena floor and underground chambers of the Colosseum. Walk through ancient Rome at the Roman Forum and Palatine Hill.',
    highlights: [
      'Colosseum arena floor access',
      'Underground chambers',
      'Roman Forum exploration',
      'Palatine Hill views',
      'Skip-the-line entrance'
    ],
    includes: [
      'Skip-the-line tickets',
      'Licensed tour guide',
      'Arena floor access',
      'Underground access',
      'Headsets provided'
    ],
    meetingPoint: 'Piazza del Colosseo, 1, 00184 Roma RM, Italy',
    groupSize: 'Small group (max 20)',
    maxParticipants: 20,
    active: true,
    status: 'live',
    tenant: 'romewander'
  },
  {
    title: 'Rome City Highlights Walking Tour',
    slug: 'rome-city-highlights-walking-tour-rwd',
    category: 'city',
    price: 45,
    duration: '3 hours',
    description: 'Discover Rome\'s iconic landmarks on foot. Visit the Trevi Fountain, Pantheon, Spanish Steps, and Piazza Navona with a local guide.',
    highlights: [
      'Trevi Fountain',
      'Pantheon visit',
      'Spanish Steps',
      'Piazza Navona',
      'Local guide insights'
    ],
    includes: [
      'Professional guide',
      'Walking tour',
      'Gelato tasting',
      'Small group'
    ],
    meetingPoint: 'Piazza di Spagna, 00187 Roma RM, Italy',
    groupSize: 'Small group (max 15)',
    maxParticipants: 15,
    active: true,
    status: 'live',
    tenant: 'romewander'
  },
  {
    title: 'Catacombs & Appian Way Hidden Gems Tour',
    slug: 'catacombs-appian-way-hidden-gems-rwd',
    category: 'hidden-gems',
    price: 65,
    duration: '4 hours',
    description: 'Explore ancient underground burial sites and walk the historic Appian Way. Discover Rome\'s hidden Christian heritage.',
    highlights: [
      'Ancient catacombs',
      'Appian Way walk',
      'Early Christian sites',
      'Off-the-beaten-path',
      'Expert guide'
    ],
    includes: [
      'Catacomb entrance',
      'Licensed guide',
      'Transportation',
      'Small group'
    ],
    meetingPoint: 'Via Appia Antica, 110, 00179 Roma RM, Italy',
    groupSize: 'Small group (max 12)',
    maxParticipants: 12,
    active: true,
    status: 'live',
    tenant: 'romewander'
  }
]

async function createTour(tour) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(tour)
    
    const options = {
      hostname: 'admin.wondersofrome.com',
      port: 443,
      path: '/api/tours',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
        'Authorization': `users API-Key ${API_KEY}`
      }
    }

    const req = https.request(options, (res) => {
      let responseData = ''
      res.on('data', (chunk) => responseData += chunk)
      res.on('end', () => {
        if (res.statusCode === 201 || res.statusCode === 200) {
          resolve(JSON.parse(responseData))
        } else {
          reject(new Error(`Failed to create tour: ${res.statusCode} - ${responseData}`))
        }
      })
    })

    req.on('error', reject)
    req.write(data)
    req.end()
  })
}

async function main() {
  console.log('🎯 Adding Rome Wander Tours to Payload...\n')

  for (let i = 0; i < SAMPLE_TOURS.length; i++) {
    const tour = SAMPLE_TOURS[i]
    try {
      console.log(`${i + 1}/${SAMPLE_TOURS.length} Creating: ${tour.title}...`)
      const result = await createTour(tour)
      console.log(`   ✅ Created with ID: ${result.doc.id}`)
    } catch (error) {
      console.log(`   ❌ Failed: ${error.message}`)
    }
  }

  console.log('\n✅ Done! Tours added to Rome Wander.')
  console.log('\nNext steps:')
  console.log('1. Visit https://admin.wondersofrome.com/admin/collections/tours')
  console.log('2. Verify tours with tenant=romewander')
  console.log('3. Deploy Rome Wander website: ./deploy-romewander.sh')
}

main().catch(console.error)
