import { NextResponse } from 'next/server';
import { createClient } from 'next-sanity';

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2024-01-01',
    useCdn: false,
    token: process.env.SANITY_API_TOKEN,
});
export const dynamic = 'force-dynamic';

const DEFAULT_ADDONS = [
    {
        name: 'Hotel Pickup Service',
        id: 'pickup',
        description: 'Private Mercedes transfer from your hotel to meeting point. Includes professional English-speaking driver.',
        price: 45,
        pricingType: 'perBooking',
        icon: 'MapPin',
        category: 'transport',
        popular: true,
        available: true,
        sortOrder: 0,
    },
    {
        name: 'Hotel Drop-off Service',
        id: 'dropoff',
        description: 'Return transfer to your hotel after the tour. Perfect after a long day of walking!',
        price: 45,
        pricingType: 'perBooking',
        icon: 'MapPin',
        category: 'transport',
        popular: false,
        available: true,
        sortOrder: 1,
    },
    {
        name: 'Luggage Storage',
        id: 'luggage',
        description: 'Secure, insured storage for your bags during the tour. Store near Vatican/Colosseum.',
        price: 12,
        pricingType: 'perBooking',
        icon: 'Briefcase',
        category: 'services',
        popular: true,
        available: true,
        sortOrder: 2,
    },
    {
        name: 'VIP Priority Access',
        id: 'priority',
        description: 'Skip ALL lines including security. Direct entry with escort. Save 30+ minutes!',
        price: 35,
        pricingType: 'perBooking',
        icon: 'Star',
        category: 'experience',
        popular: true,
        available: true,
        sortOrder: 3,
    },
    {
        name: 'Ultimate Rome Digital Guide',
        id: 'guidebook',
        description: 'Interactive digital guide with offline maps, audio commentary, restaurant recommendations, and hidden gems.',
        price: 19,
        pricingType: 'perBooking',
        icon: 'Sparkles',
        category: 'experience',
        popular: false,
        available: true,
        sortOrder: 4,
    },
    {
        name: 'Premium Audio Guide Rental',
        id: 'audioguide',
        description: 'Professional audio guide with 3+ hours of commentary. Available in 8 languages.',
        price: 15,
        pricingType: 'perPerson',
        icon: 'Utensils',
        category: 'experience',
        popular: false,
        available: true,
        sortOrder: 5,
    },
    {
        name: 'Authentic Roman Lunch',
        id: 'lunch',
        description: '3-course lunch at a traditional Roman trattoria near the tour site. Includes wine!',
        price: 55,
        pricingType: 'perPerson',
        icon: 'Utensils',
        category: 'food',
        popular: true,
        available: true,
        sortOrder: 6,
    },
    {
        name: 'Gelato Tasting Experience',
        id: 'gelato',
        description: "Guided tasting of 5 artisanal gelato flavors at Rome's oldest gelateria.",
        price: 25,
        pricingType: 'perPerson',
        icon: 'Utensils',
        category: 'food',
        popular: false,
        available: true,
        sortOrder: 7,
    },
    {
        name: 'Professional Photo Package',
        id: 'photography',
        description: 'Professional photographer follows your tour, captures moments. 50+ edited photos delivered within 24h.',
        price: 149,
        pricingType: 'perBooking',
        icon: 'Camera',
        category: 'experience',
        popular: false,
        available: true,
        sortOrder: 8,
    },
    {
        name: 'Travel Protection Plan',
        id: 'insurance',
        description: 'Full refund for cancellations up to 2 hours before tour. Medical coverage included.',
        price: 15,
        pricingType: 'perBooking',
        icon: 'Shield',
        category: 'insurance',
        popular: false,
        available: true,
        sortOrder: 9,
    },
    {
        name: 'Upgrade to Private Guide',
        id: 'privateguide',
        description: 'Transform your group tour into a private experience just for your party. Subject to availability.',
        price: 199,
        pricingType: 'perBooking',
        icon: 'User',
        category: 'experience',
        popular: false,
        available: true,
        sortOrder: 10,
    },
    {
        name: 'Kids Activity Kit',
        id: 'kidskit',
        description: 'Treasure hunt book, colored pencils, stickers, and souvenir for children under 12.',
        price: 18,
        pricingType: 'perBooking',
        icon: 'Gift',
        category: 'services',
        popular: false,
        available: true,
        sortOrder: 11,
    },
    {
        name: 'Sunset Champagne Toast',
        id: 'champagne',
        description: 'Celebrate with Italian prosecco at a panoramic terrace after your tour. Couples or groups.',
        price: 45,
        pricingType: 'perBooking',
        icon: 'Wine',
        category: 'food',
        popular: true,
        available: true,
        sortOrder: 12,
    },
    {
        name: 'Pocket WiFi Rental',
        id: 'wifi',
        description: 'Unlimited 4G WiFi device for your entire stay in Rome. Pick up at meeting point.',
        price: 12,
        pricingType: 'perBooking',
        icon: 'Wifi',
        category: 'services',
        popular: false,
        available: true,
        sortOrder: 13,
    },
];

export async function POST(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const siteId = searchParams.get('site') || 'rome-tour-tickets';

        // Get the site document - if it doesn't exist, create add-ons without site reference
        const siteQuery = `*[_type == "site" && slug.current == $siteId][0]`;
        const site = await client.fetch(siteQuery, { siteId });

        let siteRef = null;
        if (site) {
            siteRef = site._id;
        } else {
            console.log(`Site ${siteId} not found in Sanity, creating add-ons without site reference`);
        }

        // Check if add-ons already exist
        let existingQuery;
        let existing;
        
        if (siteRef) {
            existingQuery = `*[_type == "addon" && $siteId in sites[]._ref]`;
            existing = await client.fetch(existingQuery, { siteId: siteRef });
        } else {
            // If no site document, check for any add-ons
            existingQuery = `*[_type == "addon"][0...5]`;
            existing = await client.fetch(existingQuery);
        }

        if (existing.length > 0) {
            return NextResponse.json({
                message: 'Add-ons already exist',
                count: existing.length,
                skipped: true,
                addOns: existing.map((a: any) => ({ _id: a._id, name: a.name }))
            });
        }

        // Create all add-ons
        const created = [];
        for (const addon of DEFAULT_ADDONS) {
            const doc = await client.create({
                _type: 'addon',
                ...addon,
                id: { _type: 'slug', current: addon.id },
                sites: siteRef ? [{ _type: 'reference', _ref: siteRef }] : [],
            });
            created.push(doc);
        }

        return NextResponse.json({
            success: true,
            message: `Created ${created.length} add-ons`,
            count: created.length,
            addOns: created.map(a => ({ _id: a._id, name: a.name })),
            note: siteRef ? 'Linked to site' : 'Created without site reference (you can link them later in Sanity Studio)'
        });

    } catch (err: any) {
        console.error('Error seeding add-ons:', err);
        return NextResponse.json(
            { error: err.message || 'Failed to seed add-ons' },
            { status: 500 }
        );
    }
}

// GET to check status
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const siteId = searchParams.get('site') || 'rome-tour-tickets';

        const siteQuery = `*[_type == "site" && slug.current == $siteId][0]`;
        const site = await client.fetch(siteQuery, { siteId });

        let existing;
        if (site) {
            const existingQuery = `*[_type == "addon" && $siteId in sites[]._ref] { name, available }`;
            existing = await client.fetch(existingQuery, { siteId: site._id });
        } else {
            // If no site document, get all add-ons
            const existingQuery = `*[_type == "addon"] { name, available, sites }`;
            existing = await client.fetch(existingQuery);
        }

        return NextResponse.json({
            hasAddOns: existing.length > 0,
            siteFound: !!site,
            count: existing.length,
            addOns: existing,
            message: site ? 'Site found' : 'Site not found - showing all add-ons'
        });

    } catch (err: any) {
        console.error('Error checking add-ons:', err);
        return NextResponse.json(
            { error: err.message || 'Failed to check add-ons' },
            { status: 500 }
        );
    }
}
