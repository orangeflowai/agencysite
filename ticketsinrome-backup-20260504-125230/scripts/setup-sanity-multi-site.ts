#!/usr/bin/env tsx
/**
 * Setup Script for Multi-Site Sanity CMS
 * Run this to create the initial site documents
 * 
 * Usage: npx tsx scripts/setup-sanity-multi-site.ts
 */

import { createClient } from '@sanity/client'
import dotenv from 'dotenv'
import path from 'path'

// Load env from project root
dotenv.config({ path: path.resolve(__dirname, '../.env') })

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    token: process.env.SANITY_API_TOKEN,
    apiVersion: '2024-01-01',
    useCdn: false,
})

const sites = [
    {
        _type: 'site',
        _id: 'rome-tour-tickets',
        title: 'Rome Tour Tickets',
        slug: {
            _type: 'slug',
            current: 'rome-tour-tickets'
        },
        domain: 'https://rome-tour-tickets.com',
        isActive: true,
        brandColors: {
            primary: { hex: '#0f4c3a' },
            secondary: { hex: '#f5f5dc' },
            accent: { hex: '#f59e0b' },
        },
        seo: {
            metaTitle: 'Rome Tour Tickets - Skip the Line Tours & VIP Access',
            metaDescription: 'Book official skip-the-line tickets for Colosseum, Vatican Museums, and Rome attractions. Best prices guaranteed.',
            keywords: ['rome tours', 'colosseum tickets', 'vatican tours', 'skip the line rome']
        }
    },
    {
        _type: 'site',
        _id: 'wondersofrome',
        title: 'Wonders of Rome',
        slug: {
            _type: 'slug',
            current: 'wondersofrome'
        },
        domain: 'https://wondersofrome.com',
        isActive: true,
        brandColors: {
            primary: { hex: '#1e3a8a' },
            secondary: { hex: '#fef3c7' },
            accent: { hex: '#dc2626' },
        },
        seo: {
            metaTitle: 'Wonders of Rome - Exclusive Tours & Hidden Gems',
            metaDescription: 'Discover the wonders of Rome with our exclusive guided tours. VIP access to ancient ruins, hidden gems, and iconic landmarks.',
            keywords: ['wonders of rome', 'rome guided tours', 'ancient rome', 'roman history tours']
        }
    }
]

async function setupSites() {
    console.log('🌐 Setting up multi-site configuration...\n')
    
    for (const site of sites) {
        try {
            // Check if site already exists
            const existing = await client.fetch(
                `*[_type == "site" && _id == $id][0]`,
                { id: site._id }
            )
            
            if (existing) {
                console.log(`⚠️  Site "${site.title}" already exists (ID: ${site._id})`)
                continue
            }
            
            // Create the site
            const result = await client.createOrReplace(site)
            console.log(`✅ Created site: ${site.title}`)
            console.log(`   ID: ${result._id}`)
            console.log(`   Slug: ${site.slug.current}`)
            console.log(`   Domain: ${site.domain}`)
            console.log('')
            
        } catch (error) {
            console.error(`❌ Failed to create site "${site.title}":`, error)
        }
    }
    
    console.log('🎉 Setup complete!')
    console.log('\n📋 Next steps:')
    console.log('   1. Open Sanity Studio: http://localhost:3000/studio')
    console.log('   2. Go to "Website Profiles" to switch between sites')
    console.log('   3. Create tours and assign them to one or both sites')
    console.log('   4. Create settings for each site (hero images, etc.)')
    console.log('\n💡 Tip: When creating a tour, select "Websites" to choose which site(s) display it')
}

setupSites().catch(console.error)
