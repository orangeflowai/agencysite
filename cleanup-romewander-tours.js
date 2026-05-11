#!/usr/bin/env node
/**
 * Rome Wander Tours Cleanup
 * - Set Vatican tours to LIVE
 * - Delete all non-Vatican tours
 */

const https = require('https')

const PAYLOAD_URL = 'https://admin.wondersofrome.com'
const API_KEY = 'oUXeNps-QPX_IA292tCbtHRFgi1oyuiGfd5WemTNeRE'

function getTours() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'admin.wondersofrome.com',
      path: '/api/tours?where[tenant][equals]=romewander&limit=100',
      headers: { 'Authorization': `users API-Key ${API_KEY}` }
    }
    
    https.get(options, (res) => {
      let data = ''
      res.on('data', (chunk) => data += chunk)
      res.on('end', () => resolve(JSON.parse(data)))
    }).on('error', reject)
  })
}

function updateTour(tourId, updates) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(updates)
    
    const options = {
      hostname: 'admin.wondersofrome.com',
      port: 443,
      path: `/api/tours/${tourId}`,
      method: 'PATCH',
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
        if (res.statusCode === 200) {
          resolve(JSON.parse(responseData))
        } else {
          reject(new Error(`Failed: ${res.statusCode}`))
        }
      })
    })

    req.on('error', reject)
    req.write(data)
    req.end()
  })
}

function deleteTour(tourId) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'admin.wondersofrome.com',
      port: 443,
      path: `/api/tours/${tourId}`,
      method: 'DELETE',
      headers: {
        'Authorization': `users API-Key ${API_KEY}`
      }
    }

    const req = https.request(options, (res) => {
      let responseData = ''
      res.on('data', (chunk) => responseData += chunk)
      res.on('end', () => {
        if (res.statusCode === 200 || res.statusCode === 204) {
          resolve(true)
        } else {
          reject(new Error(`Failed: ${res.statusCode}`))
        }
      })
    })

    req.on('error', reject)
    req.end()
  })
}

async function main() {
  console.log('🧹 Rome Wander Tours Cleanup')
  console.log('=' .repeat(60))
  console.log('')

  // Get all tours
  console.log('📋 Fetching all Rome Wander tours...')
  const response = await getTours()
  const tours = response.docs || []
  
  console.log(`   Found ${tours.length} total tours\n`)

  // Separate Vatican and non-Vatican tours
  const vaticanTours = tours.filter(t => 
    t.category === 'vatican' || 
    t.title.toLowerCase().includes('vatican') ||
    t.title.toLowerCase().includes('sistine') ||
    t.title.toLowerCase().includes('st. peter') ||
    t.title.toLowerCase().includes('st peter')
  )
  
  const nonVaticanTours = tours.filter(t => !vaticanTours.includes(t))

  console.log(`   Vatican tours: ${vaticanTours.length}`)
  console.log(`   Non-Vatican tours: ${nonVaticanTours.length}\n`)

  // Show Vatican tours
  console.log('✅ Vatican Tours (will be set to LIVE):')
  vaticanTours.forEach((t, i) => {
    console.log(`   ${i + 1}. ${t.title}`)
    console.log(`      Status: ${t.status} → will change to LIVE`)
  })

  console.log('')
  console.log('❌ Non-Vatican Tours (will be DELETED):')
  nonVaticanTours.slice(0, 10).forEach((t, i) => {
    console.log(`   ${i + 1}. ${t.title}`)
  })
  if (nonVaticanTours.length > 10) {
    console.log(`   ... and ${nonVaticanTours.length - 10} more`)
  }

  console.log('')
  console.log('⚠️  WARNING: This will DELETE ' + nonVaticanTours.length + ' tours!')
  console.log('')

  // Confirm
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  })

  readline.question('Continue? (yes/no): ', async (answer) => {
    readline.close()

    if (answer.toLowerCase() !== 'yes') {
      console.log('Aborted.')
      return
    }

    console.log('')
    console.log('🚀 Starting cleanup...\n')

    // Step 1: Set Vatican tours to live
    console.log('📍 Step 1: Setting Vatican tours to LIVE...')
    let vaticanUpdated = 0
    for (const tour of vaticanTours) {
      try {
        await updateTour(tour.id, { 
          status: 'live',
          active: true 
        })
        console.log(`   ✅ ${tour.title}`)
        vaticanUpdated++
      } catch (error) {
        console.log(`   ❌ Failed: ${tour.title}`)
      }
    }
    console.log(`   Updated ${vaticanUpdated}/${vaticanTours.length} Vatican tours\n`)

    // Step 2: Delete non-Vatican tours
    console.log('🗑️  Step 2: Deleting non-Vatican tours...')
    let deleted = 0
    for (const tour of nonVaticanTours) {
      try {
        await deleteTour(tour.id)
        console.log(`   ✅ Deleted: ${tour.title}`)
        deleted++
      } catch (error) {
        console.log(`   ❌ Failed to delete: ${tour.title}`)
      }
    }
    console.log(`   Deleted ${deleted}/${nonVaticanTours.length} tours\n`)

    console.log('✅ Cleanup complete!')
    console.log('')
    console.log('Summary:')
    console.log(`   Vatican tours set to live: ${vaticanUpdated}`)
    console.log(`   Non-Vatican tours deleted: ${deleted}`)
    console.log('')
    console.log('🌐 Visit https://romewander.com to see the changes')
    console.log('   (May take up to 1 hour for cache to clear)')
  })
}

main().catch(console.error)
