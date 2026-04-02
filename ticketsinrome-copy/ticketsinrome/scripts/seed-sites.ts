#!/usr/bin/env tsx
/**
 * Seed script to create initial site documents in Sanity
 * Run with: npx tsx scripts/seed-sites.ts
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
    apiVersion: '2025-01-01',
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

async function seedSites() {
    console.log('🌱 Seeding sites to Sanity...\n')
    
    for (const site of sites) {
        try {
            // Check if site already exists
            const existing = await client.fetch(
                `*[_type == "site" && _id == $id][0]`,
                { id: site._id }
            )
            
            if (existing) {
                console.log(`⚠️  Site "${site.title}" already exists, skipping...`)
                continue
            }
            
            // Create the site
            const result = await client.createOrReplace(site)
            console.log(`✅ Created site: ${site.title} (${result._id})`)
            
        } catch (error) {
            console.error(`❌ Failed to create site "${site.title}":`, error)
        }
    }
    
    console.log('\n🎉 Done! Refresh your Sanity Studio to see the sites.')
    console.log('   Studio URL: http://localhost:3000/studio')
}

seedSites().catch(console.error)
