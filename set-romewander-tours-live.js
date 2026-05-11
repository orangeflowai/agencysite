#!/usr/bin/env node
/**
 * Set All Rome Wander Tours to Live Status
 */

const https = require('https')

const PAYLOAD_URL = 'https://admin.wondersofrome.com'
const API_KEY = 'oUXeNps-QPX_IA292tCbtHRFgi1oyuiGfd5WemTNeRE'

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
          reject(new Error(`Failed: ${res.statusCode} - ${responseData}`))
        }
      })
    })

    req.on('error', reject)
    req.write(data)
    req.end()
  })
}

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

async function main() {
  console.log('🎯 Setting All Rome Wander Tours to Live...\n')

  // Get all tours
  const response = await getTours()
  const tours = response.docs || []
  
  console.log(`Found ${tours.length} tours for Rome Wander\n`)

  // Filter draft tours
  const draftTours = tours.filter(t => t.status !== 'live')
  console.log(`${draftTours.length} tours are currently in draft status\n`)

  if (draftTours.length === 0) {
    console.log('✅ All tours are already live!')
    return
  }

  // Update each tour
  let updated = 0
  let failed = 0

  for (let i = 0; i < draftTours.length; i++) {
    const tour = draftTours[i]
    try {
      console.log(`${i + 1}/${draftTours.length} Updating: ${tour.title}...`)
      await updateTour(tour.id, { 
        status: 'live',
        active: true 
      })
      console.log(`   ✅ Set to live`)
      updated++
    } catch (error) {
      console.log(`   ❌ Failed: ${error.message}`)
      failed++
    }
  }

  console.log(`\n✅ Done!`)
  console.log(`   Updated: ${updated}`)
  console.log(`   Failed: ${failed}`)
  console.log(`\nAll Rome Wander tours are now live!`)
  console.log(`Visit https://romewander.com to see them.`)
}

main().catch(console.error)
