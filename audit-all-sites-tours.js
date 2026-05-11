#!/usr/bin/env node
/**
 * Complete Tour & Image Audit for All Websites
 * Checks: wondersofrome, ticketsinrome, goldenrometour, romanvaticantour, romewander
 */

const https = require('https')
const http = require('http')

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
}

const PAYLOAD_API = 'https://admin.wondersofrome.com/api'

// All websites to check
const SITES = [
  { id: 'wondersofrome', name: 'Wonders of Rome', url: 'https://wondersofrome.com' },
  { id: 'ticketsinrome', name: 'Tickets in Rome', url: 'https://ticketsinrome.com' },
  { id: 'goldenrometour', name: 'Golden Rome Tour', url: 'https://goldenrometour.com' },
  { id: 'romanvaticantour', name: 'Roman Vatican Tour', url: 'https://romanvaticantour.com' },
  { id: 'romewander', name: 'Rome Wander', url: 'https://romewander.com' },
]

// Fetch data from URL
function fetchData(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http
    protocol.get(url, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => {
        try {
          resolve(JSON.parse(data))
        } catch (e) {
          resolve({ error: 'Invalid JSON', raw: data.substring(0, 200) })
        }
      })
    }).on('error', reject)
  })
}

// Check if image URL is accessible
function checkImageUrl(url) {
  return new Promise((resolve) => {
    if (!url) {
      resolve({ accessible: false, reason: 'No URL provided' })
      return
    }
    
    const protocol = url.startsWith('https') ? https : http
    const req = protocol.request(url, { method: 'HEAD' }, (res) => {
      resolve({ 
        accessible: res.statusCode === 200, 
        status: res.statusCode,
        contentType: res.headers['content-type']
      })
    })
    req.on('error', (e) => {
      resolve({ accessible: false, reason: e.message })
    })
    req.setTimeout(5000, () => {
      req.destroy()
      resolve({ accessible: false, reason: 'Timeout' })
    })
    req.end()
  })
}

// Audit a single tour
async function auditTour(tour, siteId) {
  const issues = []
  const warnings = []
  
  // Check basic fields
  if (!tour.title) issues.push('Missing title')
  if (!tour.slug) issues.push('Missing slug')
  if (!tour.description) warnings.push('Missing description')
  if (!tour.price || tour.price === 0) issues.push('Missing or zero price')
  
  // Check status
  if (tour.status !== 'live') {
    warnings.push(`Status is '${tour.status}' (not live)`)
  }
  
  // Check tenant
  if (tour.tenant !== siteId) {
    issues.push(`Wrong tenant: '${tour.tenant}' (expected '${siteId}')`)
  }
  
  // Check images
  let mainImageStatus = { accessible: false }
  if (tour.mainImage) {
    if (typeof tour.mainImage === 'object' && tour.mainImage.url) {
      mainImageStatus = await checkImageUrl(tour.mainImage.url)
      if (!mainImageStatus.accessible) {
        issues.push(`Main image not accessible: ${mainImageStatus.reason || mainImageStatus.status}`)
      }
    } else if (typeof tour.mainImage === 'string') {
      mainImageStatus = await checkImageUrl(tour.mainImage)
      if (!mainImageStatus.accessible) {
        issues.push(`Main image not accessible: ${mainImageStatus.reason || mainImageStatus.status}`)
      }
    }
  } else if (tour.imageUrl) {
    mainImageStatus = await checkImageUrl(tour.imageUrl)
    if (!mainImageStatus.accessible) {
      warnings.push(`Legacy imageUrl not accessible: ${mainImageStatus.reason || mainImageStatus.status}`)
    }
  } else {
    issues.push('No main image (mainImage or imageUrl)')
  }
  
  // Check itinerary
  if (!tour.itinerary || tour.itinerary.length === 0) {
    warnings.push('No itinerary items')
  }
  
  // Check highlights
  if (!tour.highlights || tour.highlights.length === 0) {
    warnings.push('No highlights')
  }
  
  // Check duration
  if (!tour.duration) warnings.push('Missing duration')
  
  // Check meeting point
  if (!tour.meetingPoint) warnings.push('Missing meeting point')
  
  return {
    id: tour.id,
    title: tour.title,
    slug: tour.slug,
    status: tour.status,
    tenant: tour.tenant,
    price: tour.price,
    hasMainImage: !!tour.mainImage,
    mainImageAccessible: mainImageStatus.accessible,
    issues,
    warnings,
    score: issues.length === 0 && warnings.length <= 2 ? 'GOOD' : 
           issues.length === 0 ? 'OK' : 'NEEDS_FIX'
  }
}

// Audit all tours for a site
async function auditSite(site) {
  console.log(`\n${colors.cyan}${'='.repeat(70)}${colors.reset}`)
  console.log(`${colors.cyan}${site.name.toUpperCase()} (${site.id})${colors.reset}`)
  console.log(`${colors.cyan}${'='.repeat(70)}${colors.reset}\n`)
  
  try {
    // Fetch tours from Payload for this tenant
    const url = `${PAYLOAD_API}/tours?where[tenant][equals]=${site.id}&limit=100`
    console.log(`${colors.blue}→ Fetching tours from Payload...${colors.reset}`)
    const data = await fetchData(url)
    
    if (data.error) {
      console.log(`${colors.red}✗ Error fetching tours: ${data.error}${colors.reset}`)
      return { site: site.id, error: data.error, tours: [] }
    }
    
    const tours = data.docs || []
    console.log(`${colors.green}✓ Found ${tours.length} tours${colors.reset}\n`)
    
    if (tours.length === 0) {
      console.log(`${colors.yellow}⚠️  No tours found for ${site.id}${colors.reset}\n`)
      return { site: site.id, tours: [], summary: { total: 0, good: 0, ok: 0, needsFix: 0 } }
    }
    
    // Audit each tour
    const results = []
    for (let i = 0; i < tours.length; i++) {
      const tour = tours[i]
      process.stdout.write(`${colors.blue}→ Auditing tour ${i + 1}/${tours.length}: ${tour.title}...${colors.reset}\r`)
      const result = await auditTour(tour, site.id)
      results.push(result)
    }
    console.log('') // New line after progress
    
    // Print results
    console.log(`\n${colors.magenta}TOUR AUDIT RESULTS:${colors.reset}\n`)
    
    results.forEach((result, idx) => {
      const scoreColor = result.score === 'GOOD' ? colors.green :
                        result.score === 'OK' ? colors.yellow : colors.red
      const scoreIcon = result.score === 'GOOD' ? '✓' :
                       result.score === 'OK' ? '⚠' : '✗'
      
      console.log(`${scoreColor}${scoreIcon} ${idx + 1}. ${result.title}${colors.reset}`)
      console.log(`   Slug: ${result.slug} | Status: ${result.status} | Price: €${result.price}`)
      console.log(`   Image: ${result.mainImageAccessible ? colors.green + '✓ Accessible' : colors.red + '✗ Not accessible'}${colors.reset}`)
      
      if (result.issues.length > 0) {
        console.log(`   ${colors.red}Issues: ${result.issues.join(', ')}${colors.reset}`)
      }
      if (result.warnings.length > 0) {
        console.log(`   ${colors.yellow}Warnings: ${result.warnings.join(', ')}${colors.reset}`)
      }
      console.log('')
    })
    
    // Summary
    const summary = {
      total: results.length,
      good: results.filter(r => r.score === 'GOOD').length,
      ok: results.filter(r => r.score === 'OK').length,
      needsFix: results.filter(r => r.score === 'NEEDS_FIX').length,
      imagesAccessible: results.filter(r => r.mainImageAccessible).length,
      imagesNotAccessible: results.filter(r => !r.mainImageAccessible).length,
    }
    
    console.log(`${colors.magenta}SUMMARY:${colors.reset}`)
    console.log(`  Total tours: ${summary.total}`)
    console.log(`  ${colors.green}✓ Good: ${summary.good}${colors.reset}`)
    console.log(`  ${colors.yellow}⚠ OK: ${summary.ok}${colors.reset}`)
    console.log(`  ${colors.red}✗ Needs Fix: ${summary.needsFix}${colors.reset}`)
    console.log(`  Images accessible: ${summary.imagesAccessible}/${summary.total}`)
    
    return { site: site.id, tours: results, summary }
    
  } catch (error) {
    console.log(`${colors.red}✗ Error: ${error.message}${colors.reset}`)
    return { site: site.id, error: error.message, tours: [] }
  }
}

// Main audit function
async function auditAllSites() {
  console.log(`${colors.blue}`)
  console.log(`╔════════════════════════════════════════════════════════════════════╗`)
  console.log(`║                                                                    ║`)
  console.log(`║           COMPLETE TOUR & IMAGE AUDIT - ALL WEBSITES              ║`)
  console.log(`║                                                                    ║`)
  console.log(`╚════════════════════════════════════════════════════════════════════╝`)
  console.log(`${colors.reset}`)
  
  const allResults = []
  
  for (const site of SITES) {
    const result = await auditSite(site)
    allResults.push(result)
  }
  
  // Overall summary
  console.log(`\n${colors.blue}${'='.repeat(70)}${colors.reset}`)
  console.log(`${colors.blue}OVERALL SUMMARY - ALL WEBSITES${colors.reset}`)
  console.log(`${colors.blue}${'='.repeat(70)}${colors.reset}\n`)
  
  const overallStats = {
    totalTours: 0,
    totalGood: 0,
    totalOk: 0,
    totalNeedsFix: 0,
    totalImagesAccessible: 0,
    totalImagesNotAccessible: 0,
  }
  
  allResults.forEach(result => {
    if (result.summary) {
      overallStats.totalTours += result.summary.total
      overallStats.totalGood += result.summary.good
      overallStats.totalOk += result.summary.ok
      overallStats.totalNeedsFix += result.summary.needsFix
      overallStats.totalImagesAccessible += result.summary.imagesAccessible
      overallStats.totalImagesNotAccessible += result.summary.imagesNotAccessible
    }
  })
  
  console.log(`${colors.magenta}All Websites Combined:${colors.reset}`)
  console.log(`  Total tours across all sites: ${overallStats.totalTours}`)
  console.log(`  ${colors.green}✓ Good: ${overallStats.totalGood}${colors.reset}`)
  console.log(`  ${colors.yellow}⚠ OK: ${overallStats.totalOk}${colors.reset}`)
  console.log(`  ${colors.red}✗ Needs Fix: ${overallStats.totalNeedsFix}${colors.reset}`)
  console.log(`  Images accessible: ${overallStats.totalImagesAccessible}/${overallStats.totalTours}`)
  
  // Health score
  const healthScore = overallStats.totalTours > 0 
    ? Math.round((overallStats.totalGood / overallStats.totalTours) * 100)
    : 0
  
  const healthColor = healthScore >= 80 ? colors.green :
                     healthScore >= 60 ? colors.yellow : colors.red
  
  console.log(`\n${healthColor}Overall Health Score: ${healthScore}%${colors.reset}`)
  
  // Recommendations
  console.log(`\n${colors.cyan}RECOMMENDATIONS:${colors.reset}`)
  if (overallStats.totalNeedsFix > 0) {
    console.log(`  ${colors.red}• Fix ${overallStats.totalNeedsFix} tours with critical issues${colors.reset}`)
  }
  if (overallStats.totalImagesNotAccessible > 0) {
    console.log(`  ${colors.yellow}• Fix ${overallStats.totalImagesNotAccessible} inaccessible images${colors.reset}`)
  }
  if (overallStats.totalOk > 0) {
    console.log(`  ${colors.yellow}• Improve ${overallStats.totalOk} tours with warnings${colors.reset}`)
  }
  if (healthScore === 100) {
    console.log(`  ${colors.green}• All tours are in excellent condition! 🎉${colors.reset}`)
  }
  
  console.log('')
}

// Run audit
auditAllSites().catch(console.error)
