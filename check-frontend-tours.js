#!/usr/bin/env node
/**
 * Frontend Tour Display Verification
 * Checks if tours are properly displayed on each website's homepage
 */

const https = require('https')

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
}

const SITES = [
  { 
    id: 'wondersofrome', 
    name: 'Wonders of Rome', 
    url: 'https://wondersofrome.com',
    apiEndpoint: 'https://wondersofrome.com/api/tours'
  },
  { 
    id: 'ticketsinrome', 
    name: 'Tickets in Rome', 
    url: 'https://ticketsinrome.com',
    apiEndpoint: 'https://ticketsinrome.com/api/tours'
  },
  { 
    id: 'goldenrometour', 
    name: 'Golden Rome Tour', 
    url: 'https://goldenrometour.com',
    apiEndpoint: 'https://goldenrometour.com/api/tours'
  },
  { 
    id: 'romanvaticantour', 
    name: 'Roman Vatican Tour', 
    url: 'https://romanvaticantour.com',
    apiEndpoint: 'https://romanvaticantour.com/api/tours'
  },
  { 
    id: 'romewander', 
    name: 'Rome Wander', 
    url: 'https://romewander.com',
    apiEndpoint: 'https://romewander.com/api/tours'
  },
]

function fetchData(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => {
        try {
          resolve({ success: true, data: JSON.parse(data), status: res.statusCode })
        } catch (e) {
          resolve({ success: false, error: 'Invalid JSON', raw: data.substring(0, 200), status: res.statusCode })
        }
      })
    }).on('error', (e) => {
      resolve({ success: false, error: e.message })
    })
  })
}

function fetchHTML(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => {
        resolve({ success: true, html: data, status: res.statusCode })
      })
    }).on('error', (e) => {
      resolve({ success: false, error: e.message })
    })
  })
}

async function checkSiteFrontend(site) {
  console.log(`\n${colors.cyan}${'='.repeat(70)}${colors.reset}`)
  console.log(`${colors.cyan}${site.name.toUpperCase()} (${site.id})${colors.reset}`)
  console.log(`${colors.cyan}${'='.repeat(70)}${colors.reset}\n`)
  
  const results = {
    site: site.id,
    homepage: { accessible: false },
    api: { accessible: false, tours: [] },
    issues: [],
    warnings: []
  }
  
  // 1. Check homepage accessibility
  console.log(`${colors.blue}→ Checking homepage: ${site.url}${colors.reset}`)
  const homepageResult = await fetchHTML(site.url)
  
  if (homepageResult.success) {
    results.homepage.accessible = true
    results.homepage.status = homepageResult.status
    
    // Check for common elements
    const html = homepageResult.html
    const hasTourSection = html.includes('tour') || html.includes('Tour')
    const hasBooking = html.includes('book') || html.includes('Book')
    const hasImages = (html.match(/<img/g) || []).length
    
    console.log(`  ${colors.green}✓ Homepage accessible (${homepageResult.status})${colors.reset}`)
    console.log(`  ${hasTourSection ? colors.green + '✓' : colors.yellow + '⚠'} Tour section: ${hasTourSection ? 'Found' : 'Not found'}${colors.reset}`)
    console.log(`  ${hasBooking ? colors.green + '✓' : colors.yellow + '⚠'} Booking elements: ${hasBooking ? 'Found' : 'Not found'}${colors.reset}`)
    console.log(`  Images on page: ${hasImages}`)
    
    if (!hasTourSection) results.warnings.push('No tour section found on homepage')
    if (!hasBooking) results.warnings.push('No booking elements found')
    if (hasImages < 5) results.warnings.push('Few images on homepage')
    
  } else {
    results.issues.push(`Homepage not accessible: ${homepageResult.error}`)
    console.log(`  ${colors.red}✗ Homepage not accessible: ${homepageResult.error}${colors.reset}`)
  }
  
  // 2. Check API endpoint
  console.log(`\n${colors.blue}→ Checking API: ${site.apiEndpoint}${colors.reset}`)
  const apiResult = await fetchData(site.apiEndpoint)
  
  if (apiResult.success) {
    results.api.accessible = true
    results.api.status = apiResult.status
    
    const tours = apiResult.data.tours || apiResult.data.docs || apiResult.data || []
    results.api.tours = tours
    
    console.log(`  ${colors.green}✓ API accessible (${apiResult.status})${colors.reset}`)
    console.log(`  ${colors.green}✓ Found ${tours.length} tours${colors.reset}`)
    
    if (tours.length === 0) {
      results.issues.push('API returns 0 tours')
    } else {
      // Check tour data quality
      const toursWithImages = tours.filter(t => t.mainImage || t.imageUrl).length
      const toursWithPrice = tours.filter(t => t.price && t.price > 0).length
      const liveTours = tours.filter(t => t.status === 'live').length
      
      console.log(`  Tours with images: ${toursWithImages}/${tours.length}`)
      console.log(`  Tours with price: ${toursWithPrice}/${tours.length}`)
      console.log(`  Live tours: ${liveTours}/${tours.length}`)
      
      if (toursWithImages < tours.length) {
        results.warnings.push(`${tours.length - toursWithImages} tours missing images`)
      }
      if (toursWithPrice < tours.length) {
        results.warnings.push(`${tours.length - toursWithPrice} tours missing price`)
      }
      if (liveTours === 0) {
        results.issues.push('No live tours (all are draft/archived)')
      }
      
      // Show sample tours
      console.log(`\n  ${colors.magenta}Sample Tours:${colors.reset}`)
      tours.slice(0, 3).forEach((tour, idx) => {
        const statusColor = tour.status === 'live' ? colors.green : colors.yellow
        console.log(`    ${idx + 1}. ${tour.title}`)
        console.log(`       Status: ${statusColor}${tour.status}${colors.reset} | Price: €${tour.price} | Image: ${tour.mainImage || tour.imageUrl ? '✓' : '✗'}`)
      })
    }
    
  } else {
    results.issues.push(`API not accessible: ${apiResult.error}`)
    console.log(`  ${colors.red}✗ API not accessible: ${apiResult.error}${colors.reset}`)
  }
  
  // 3. Summary for this site
  console.log(`\n${colors.magenta}Site Summary:${colors.reset}`)
  const score = results.issues.length === 0 && results.warnings.length <= 1 ? 'GOOD' :
                results.issues.length === 0 ? 'OK' : 'NEEDS_FIX'
  const scoreColor = score === 'GOOD' ? colors.green :
                    score === 'OK' ? colors.yellow : colors.red
  
  console.log(`  Status: ${scoreColor}${score}${colors.reset}`)
  
  if (results.issues.length > 0) {
    console.log(`  ${colors.red}Issues:${colors.reset}`)
    results.issues.forEach(issue => console.log(`    • ${issue}`))
  }
  
  if (results.warnings.length > 0) {
    console.log(`  ${colors.yellow}Warnings:${colors.reset}`)
    results.warnings.forEach(warning => console.log(`    • ${warning}`))
  }
  
  if (score === 'GOOD') {
    console.log(`  ${colors.green}✓ Everything looks good!${colors.reset}`)
  }
  
  return results
}

async function checkAllSites() {
  console.log(`${colors.blue}`)
  console.log(`╔════════════════════════════════════════════════════════════════════╗`)
  console.log(`║                                                                    ║`)
  console.log(`║           FRONTEND TOUR DISPLAY VERIFICATION - ALL SITES           ║`)
  console.log(`║                                                                    ║`)
  console.log(`╚════════════════════════════════════════════════════════════════════╝`)
  console.log(`${colors.reset}`)
  
  const allResults = []
  
  for (const site of SITES) {
    const result = await checkSiteFrontend(site)
    allResults.push(result)
  }
  
  // Overall summary
  console.log(`\n${colors.blue}${'='.repeat(70)}${colors.reset}`)
  console.log(`${colors.blue}OVERALL FRONTEND HEALTH${colors.reset}`)
  console.log(`${colors.blue}${'='.repeat(70)}${colors.reset}\n`)
  
  const stats = {
    totalSites: allResults.length,
    homepageAccessible: allResults.filter(r => r.homepage.accessible).length,
    apiAccessible: allResults.filter(r => r.api.accessible).length,
    totalTours: allResults.reduce((sum, r) => sum + (r.api.tours?.length || 0), 0),
    sitesWithIssues: allResults.filter(r => r.issues.length > 0).length,
    sitesWithWarnings: allResults.filter(r => r.warnings.length > 0).length,
  }
  
  console.log(`${colors.magenta}Statistics:${colors.reset}`)
  console.log(`  Total sites: ${stats.totalSites}`)
  console.log(`  ${colors.green}✓ Homepages accessible: ${stats.homepageAccessible}/${stats.totalSites}${colors.reset}`)
  console.log(`  ${colors.green}✓ APIs accessible: ${stats.apiAccessible}/${stats.totalSites}${colors.reset}`)
  console.log(`  Total tours across all sites: ${stats.totalTours}`)
  console.log(`  ${colors.red}Sites with issues: ${stats.sitesWithIssues}${colors.reset}`)
  console.log(`  ${colors.yellow}Sites with warnings: ${stats.sitesWithWarnings}${colors.reset}`)
  
  const healthScore = stats.totalSites > 0
    ? Math.round(((stats.homepageAccessible + stats.apiAccessible) / (stats.totalSites * 2)) * 100)
    : 0
  
  const healthColor = healthScore >= 90 ? colors.green :
                     healthScore >= 70 ? colors.yellow : colors.red
  
  console.log(`\n${healthColor}Frontend Health Score: ${healthScore}%${colors.reset}`)
  
  // Recommendations
  console.log(`\n${colors.cyan}RECOMMENDATIONS:${colors.reset}`)
  if (stats.sitesWithIssues > 0) {
    console.log(`  ${colors.red}• Fix critical issues on ${stats.sitesWithIssues} sites${colors.reset}`)
  }
  if (stats.sitesWithWarnings > 0) {
    console.log(`  ${colors.yellow}• Address warnings on ${stats.sitesWithWarnings} sites${colors.reset}`)
  }
  if (stats.totalTours === 0) {
    console.log(`  ${colors.red}• No tours found across any site - check Payload backend${colors.reset}`)
  }
  if (healthScore === 100) {
    console.log(`  ${colors.green}• All sites are working perfectly! 🎉${colors.reset}`)
  }
  
  console.log('')
}

checkAllSites().catch(console.error)
