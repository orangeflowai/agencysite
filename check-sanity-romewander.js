#!/usr/bin/env node
/**
 * Check if Rome Wander has tours in Sanity
 */

const https = require('https')

const PROJECT_ID = 'aknmkkwd'
const DATASET = 'production'
const TOKEN = 'skFBTe2s38Bz1MltanZf6ftSHyH3gVcK5EFRVuy3TOnzurb3ZyUQqip51aJWHC6cMfIkZu7F0u1J1iUii479jJLXzBgyQUODLzXISOD5RRuM94D99H6C4vPsNbAdmMTPcL0JhJbFhBO9NNl8WLGabR4NXpEWQETI2iKTi5gFDtXD65gcBw1e'

// Query for Rome Wander tours
const query = encodeURIComponent(`*[_type == "tour" && tenant == "romewander"] | order(_createdAt desc) {
  _id,
  title,
  slug,
  category,
  status,
  active,
  price,
  "imageUrl": mainImage.asset->url
}`)

const url = `https://${PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${DATASET}?query=${query}`

console.log('🔍 Checking Sanity for Rome Wander tours...')
console.log('=' .repeat(60))
console.log('')

https.get(url, {
  headers: {
    'Authorization': `Bearer ${TOKEN}`
  }
}, (res) => {
  let data = ''
  
  res.on('data', (chunk) => data += chunk)
  
  res.on('end', () => {
    try {
      const result = JSON.parse(data)
      
      if (result.error) {
        console.error('❌ Error:', result.error.description)
        return
      }
      
      const tours = result.result || []
      
      console.log(`📊 Found ${tours.length} tours in Sanity for Rome Wander\n`)
      
      if (tours.length === 0) {
        console.log('⚠️  No tours found in Sanity!')
        console.log('')
        console.log('Options:')
        console.log('1. Create tours manually in Sanity Studio')
        console.log('2. Export from Payload and import to Sanity')
        console.log('3. Use Payload as data source (current setup)')
        console.log('')
      } else {
        // Group by category
        const byCategory = {}
        tours.forEach(tour => {
          const cat = tour.category || 'uncategorized'
          if (!byCategory[cat]) byCategory[cat] = []
          byCategory[cat].push(tour)
        })
        
        console.log('📋 Tours by Category:')
        Object.keys(byCategory).sort().forEach(cat => {
          console.log(`\n   ${cat.toUpperCase()} (${byCategory[cat].length} tours):`)
          byCategory[cat].slice(0, 5).forEach((tour, i) => {
            const statusIcon = tour.status === 'live' ? '🟢' : '🟡'
            console.log(`   ${statusIcon} ${tour.title}`)
            console.log(`      Status: ${tour.status || 'draft'} | Active: ${tour.active ? 'Yes' : 'No'}`)
          })
          if (byCategory[cat].length > 5) {
            console.log(`   ... and ${byCategory[cat].length - 5} more`)
          }
        })
        
        console.log('')
        console.log('✅ Rome Wander can use Sanity as data source!')
        console.log('')
        console.log('Next steps:')
        console.log('1. Ensure DATA_SOURCE=sanity in .env')
        console.log('2. Deploy to Vercel')
        console.log('3. No backend server needed!')
      }
      
    } catch (error) {
      console.error('❌ Parse error:', error.message)
    }
  })
}).on('error', (error) => {
  console.error('❌ Request error:', error.message)
})
