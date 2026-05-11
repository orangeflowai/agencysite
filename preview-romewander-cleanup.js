#!/usr/bin/env node
/**
 * Preview Rome Wander Tours Cleanup
 * Shows what will be kept vs deleted (no changes made)
 */

const https = require('https')

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

async function main() {
  console.log('👀 Rome Wander Tours Cleanup Preview')
  console.log('=' .repeat(70))
  console.log('(No changes will be made - this is just a preview)')
  console.log('')

  const response = await getTours()
  const tours = response.docs || []
  
  console.log(`📊 Total tours: ${tours.length}\n`)

  // Identify Vatican tours
  const vaticanTours = tours.filter(t => 
    t.category === 'vatican' || 
    t.title.toLowerCase().includes('vatican') ||
    t.title.toLowerCase().includes('sistine') ||
    t.title.toLowerCase().includes('st. peter') ||
    t.title.toLowerCase().includes('st peter')
  )
  
  const nonVaticanTours = tours.filter(t => !vaticanTours.includes(t))

  // Show Vatican tours (will be kept)
  console.log(`✅ VATICAN TOURS (${vaticanTours.length}) - Will be set to LIVE:`)
  console.log('─'.repeat(70))
  vaticanTours.forEach((t, i) => {
    const hasImage = t.mainImage || t.imageUrl ? '🖼️' : '❌'
    const statusIcon = t.status === 'live' ? '🟢' : '🟡'
    console.log(`${i + 1}. ${t.title}`)
    console.log(`   ${statusIcon} Status: ${t.status} | ${hasImage} Image: ${t.mainImage ? 'Yes' : 'No'} | Price: €${t.price || 0}`)
  })

  console.log('')
  console.log(`❌ NON-VATICAN TOURS (${nonVaticanTours.length}) - Will be DELETED:`)
  console.log('─'.repeat(70))
  
  // Group by category
  const byCategory = {}
  nonVaticanTours.forEach(t => {
    const cat = t.category || 'uncategorized'
    if (!byCategory[cat]) byCategory[cat] = []
    byCategory[cat].push(t)
  })

  Object.keys(byCategory).forEach(cat => {
    console.log(`\n📂 ${cat.toUpperCase()} (${byCategory[cat].length} tours):`)
    byCategory[cat].slice(0, 5).forEach((t, i) => {
      console.log(`   ${i + 1}. ${t.title}`)
    })
    if (byCategory[cat].length > 5) {
      console.log(`   ... and ${byCategory[cat].length - 5} more`)
    }
  })

  console.log('')
  console.log('=' .repeat(70))
  console.log('📊 SUMMARY:')
  console.log(`   ✅ Vatican tours to keep: ${vaticanTours.length}`)
  console.log(`   ❌ Non-Vatican tours to delete: ${nonVaticanTours.length}`)
  console.log('')
  console.log('💡 To proceed with cleanup, run:')
  console.log('   node cleanup-romewander-tours.js')
}

main().catch(console.error)
