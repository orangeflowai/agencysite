#!/usr/bin/env node
/**
 * Comprehensive Image Verification Script
 * Checks all images in Payload and verifies they're accessible
 */

const https = require('https')
const http = require('http')

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
}

const PAYLOAD_API = 'https://admin.wondersofrome.com/api'

function fetchData(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => {
        try {
          resolve(JSON.parse(data))
        } catch (e) {
          resolve({ error: 'Invalid JSON' })
        }
      })
    }).on('error', reject)
  })
}

function checkImageUrl(url, timeout = 5000) {
  return new Promise((resolve) => {
    if (!url) {
      resolve({ accessible: false, reason: 'No URL' })
      return
    }
    
    const protocol = url.startsWith('https') ? https : http
    const req = protocol.request(url, { method: 'HEAD' }, (res) => {
      resolve({ 
        accessible: res.statusCode === 200, 
        status: res.statusCode,
        contentType: res.headers['content-type'],
        size: res.headers['content-length']
      })
    })
    req.on('error', (e) => {
      resolve({ accessible: false, reason: e.message })
    })
    req.setTimeout(timeout, () => {
      req.destroy()
      resolve({ accessible: false, reason: 'Timeout' })
    })
    req.end()
  })
}

async function verifyAllImages() {
  console.log(`${colors.blue}`)
  console.log(`╔════════════════════════════════════════════════════════════════════╗`)
  console.log(`║                                                                    ║`)
  console.log(`║              COMPLETE IMAGE VERIFICATION - ALL SITES               ║`)
  console.log(`║                                                                    ║`)
  console.log(`╚════════════════════════════════════════════════════════════════════╝`)
  console.log(`${colors.reset}\n`)
  
  // 1. Check Media collection
  console.log(`${colors.cyan}1. Checking Media Collection...${colors.reset}\n`)
  const mediaData = await fetchData(`${PAYLOAD_API}/media?limit=1000`)
  
  if (mediaData.error) {
    console.log(`${colors.red}✗ Error fetching media: ${mediaData.error}${colors.reset}\n`)
  } else {
    const mediaFiles = mediaData.docs || []
    console.log(`${colors.green}✓ Found ${mediaFiles.length} media files${colors.reset}\n`)
    
    let accessible = 0
    let notAccessible = 0
    const broken = []
    
    for (let i = 0; i < mediaFiles.length; i++) {
      const media = mediaFiles[i]
      process.stdout.write(`${colors.blue}→ Checking ${i + 1}/${mediaFiles.length}: ${media.filename}...${colors.reset}\r`)
      
      const result = await checkImageUrl(media.url)
      if (result.accessible) {
        accessible++
      } else {
        notAccessible++
        broken.push({
          id: media.id,
          filename: media.filename,
          url: media.url,
          reason: result.reason || result.status
        })
      }
    }
    
    console.log('') // New line
    console.log(`\n${colors.magenta}Media Collection Summary:${colors.reset}`)
    console.log(`  ${colors.green}✓ Accessible: ${accessible}${colors.reset}`)
    console.log(`  ${colors.red}✗ Not accessible: ${notAccessible}${colors.reset}`)
    
    if (broken.length > 0) {
      console.log(`\n${colors.red}Broken Media Files:${colors.reset}`)
      broken.slice(0, 10).forEach(item => {
        console.log(`  • ${item.filename}`)
        console.log(`    URL: ${item.url}`)
        console.log(`    Reason: ${item.reason}`)
      })
      if (broken.length > 10) {
        console.log(`  ... and ${broken.length - 10} more`)
      }
    }
  }
  
  // 2. Check Tour Images
  console.log(`\n${colors.cyan}2. Checking Tour Images...${colors.reset}\n`)
  const toursData = await fetchData(`${PAYLOAD_API}/tours?limit=1000`)
  
  if (toursData.error) {
    console.log(`${colors.red}✗ Error fetching tours: ${toursData.error}${colors.reset}\n`)
  } else {
    const tours = toursData.docs || []
    console.log(`${colors.green}✓ Found ${tours.length} tours${colors.reset}\n`)
    
    let toursWithImages = 0
    let toursWithoutImages = 0
    let accessibleImages = 0
    let brokenImages = 0
    const brokenTours = []
    
    for (let i = 0; i < tours.length; i++) {
      const tour = tours[i]
      process.stdout.write(`${colors.blue}→ Checking ${i + 1}/${tours.length}: ${tour.title}...${colors.reset}\r`)
      
      let imageUrl = null
      if (tour.mainImage && typeof tour.mainImage === 'object' && tour.mainImage.url) {
        imageUrl = tour.mainImage.url
      } else if (tour.mainImage && typeof tour.mainImage === 'string') {
        imageUrl = tour.mainImage
      } else if (tour.imageUrl) {
        imageUrl = tour.imageUrl
      }
      
      if (imageUrl) {
        toursWithImages++
        const result = await checkImageUrl(imageUrl)
        if (result.accessible) {
          accessibleImages++
        } else {
          brokenImages++
          brokenTours.push({
            id: tour.id,
            title: tour.title,
            slug: tour.slug,
            tenant: tour.tenant,
            imageUrl,
            reason: result.reason || result.status
          })
        }
      } else {
        toursWithoutImages++
        brokenTours.push({
          id: tour.id,
          title: tour.title,
          slug: tour.slug,
          tenant: tour.tenant,
          imageUrl: null,
          reason: 'No image URL'
        })
      }
    }
    
    console.log('') // New line
    console.log(`\n${colors.magenta}Tour Images Summary:${colors.reset}`)
    console.log(`  Tours with images: ${toursWithImages}`)
    console.log(`  Tours without images: ${toursWithoutImages}`)
    console.log(`  ${colors.green}✓ Accessible images: ${accessibleImages}${colors.reset}`)
    console.log(`  ${colors.red}✗ Broken images: ${brokenImages}${colors.reset}`)
    
    if (brokenTours.length > 0) {
      console.log(`\n${colors.red}Tours with Image Issues:${colors.reset}`)
      brokenTours.forEach(tour => {
        console.log(`  • ${tour.title} (${tour.tenant})`)
        console.log(`    Slug: ${tour.slug}`)
        if (tour.imageUrl) {
          console.log(`    URL: ${tour.imageUrl}`)
          console.log(`    Issue: ${tour.reason}`)
        } else {
          console.log(`    Issue: No image URL`)
        }
        console.log('')
      })
    }
  }
  
  // 3. Check Image Sources
  console.log(`${colors.cyan}3. Analyzing Image Sources...${colors.reset}\n`)
  
  const sources = {
    r2: 0,
    sanity: 0,
    other: 0,
    none: 0
  }
  
  if (toursData.docs) {
    toursData.docs.forEach(tour => {
      let imageUrl = null
      if (tour.mainImage && typeof tour.mainImage === 'object' && tour.mainImage.url) {
        imageUrl = tour.mainImage.url
      } else if (tour.mainImage && typeof tour.mainImage === 'string') {
        imageUrl = tour.mainImage
      } else if (tour.imageUrl) {
        imageUrl = tour.imageUrl
      }
      
      if (!imageUrl) {
        sources.none++
      } else if (imageUrl.includes('r2.dev') || imageUrl.includes('r2.cloudflarestorage.com')) {
        sources.r2++
      } else if (imageUrl.includes('sanity.io') || imageUrl.includes('cdn.sanity.io')) {
        sources.sanity++
      } else {
        sources.other++
      }
    })
  }
  
  console.log(`${colors.magenta}Image Sources:${colors.reset}`)
  console.log(`  Cloudflare R2: ${sources.r2}`)
  console.log(`  Sanity CDN: ${sources.sanity}`)
  console.log(`  Other: ${sources.other}`)
  console.log(`  No image: ${sources.none}`)
  
  // Overall health
  console.log(`\n${colors.blue}${'='.repeat(70)}${colors.reset}`)
  console.log(`${colors.blue}OVERALL IMAGE HEALTH${colors.reset}`)
  console.log(`${colors.blue}${'='.repeat(70)}${colors.reset}\n`)
  
  const totalImages = (mediaData.docs?.length || 0) + (toursData.docs?.length || 0)
  const totalAccessible = accessible + accessibleImages
  const totalBroken = notAccessible + brokenImages + toursWithoutImages
  
  const healthScore = totalImages > 0 
    ? Math.round((totalAccessible / totalImages) * 100)
    : 0
  
  const healthColor = healthScore >= 90 ? colors.green :
                     healthScore >= 70 ? colors.yellow : colors.red
  
  console.log(`${healthColor}Image Health Score: ${healthScore}%${colors.reset}`)
  console.log(`  Total images checked: ${totalImages}`)
  console.log(`  ${colors.green}✓ Working: ${totalAccessible}${colors.reset}`)
  console.log(`  ${colors.red}✗ Issues: ${totalBroken}${colors.reset}`)
  
  // Recommendations
  console.log(`\n${colors.cyan}RECOMMENDATIONS:${colors.reset}`)
  if (sources.sanity > 0) {
    console.log(`  ${colors.yellow}• Migrate ${sources.sanity} Sanity images to Cloudflare R2${colors.reset}`)
  }
  if (toursWithoutImages > 0) {
    console.log(`  ${colors.red}• Add images to ${toursWithoutImages} tours without images${colors.reset}`)
  }
  if (brokenImages > 0) {
    console.log(`  ${colors.red}• Fix ${brokenImages} broken tour images${colors.reset}`)
  }
  if (notAccessible > 0) {
    console.log(`  ${colors.red}• Fix ${notAccessible} broken media files${colors.reset}`)
  }
  if (healthScore === 100) {
    console.log(`  ${colors.green}• All images are working perfectly! 🎉${colors.reset}`)
  }
  
  console.log('')
}

verifyAllImages().catch(console.error)
