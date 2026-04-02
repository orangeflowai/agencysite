import { NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';

export const dynamic = 'force-dynamic';

// GET /api/admin/addons?site=siteId
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const siteId = searchParams.get('site') || 'rome-tour-tickets';

        // First get the site document ID
        const siteQuery = `*[_type == "site" && slug.current == $siteId][0]._id`;
        const siteDocId = await client.fetch(siteQuery, { siteId });

        let addOns;
        if (siteDocId) {
            // Fetch add-ons for this site
            addOns = await client.fetch(`
                *[_type == "addon" && $siteId in sites[]._ref] | order(sortOrder asc, price asc) {
                    _id,
                    _type,
                    name,
                    id,
                    description,
                    longDescription,
                    price,
                    pricingType,
                    minHours,
                    maxHours,
                    icon,
                    category,
                    popular,
                    available,
                    sortOrder,
                    sites
                }
            `, { siteId: siteDocId });
        } else {
            // If no site document, get all add-ons
            console.log(`Site ${siteId} not found, returning all add-ons`);
            addOns = await client.fetch(`
                *[_type == "addon"] | order(sortOrder asc, price asc) {
                    _id,
                    _type,
                    name,
                    id,
                    description,
                    longDescription,
                    price,
                    pricingType,
                    minHours,
                    maxHours,
                    icon,
                    category,
                    popular,
                    available,
                    sortOrder,
                    sites
                }
            `);
        }

        return NextResponse.json({ 
            addOns,
            siteFound: !!siteDocId,
            message: siteDocId ? 'Site found' : 'Site not found - showing all add-ons'
        });
    } catch (err: any) {
        console.error('Error fetching add-ons:', err);
        return NextResponse.json(
            { error: err.message || 'Failed to fetch add-ons' },
            { status: 500 }
        );
    }
}

// POST /api/admin/addons
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { sites, id, ...addOnData } = body;

        // Ensure id is properly formatted as a slug
        const slugId = typeof id === 'string' 
            ? { current: id } 
            : id?.current 
                ? id 
                : { current: addOnData.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'addon-' + Date.now() };

        // Create the add-on in Sanity
        const doc = {
            _type: 'addon',
            ...addOnData,
            id: slugId,
            sites: sites?.map((siteId: string) => ({ _type: 'reference', _ref: siteId })) || [],
        };

        console.log('Creating add-on:', JSON.stringify(doc, null, 2));
        const result = await client.create(doc);

        return NextResponse.json({ success: true, addOn: result });
    } catch (err: any) {
        console.error('Error creating add-on:', err);
        return NextResponse.json(
            { error: err.message || 'Failed to create add-on' },
            { status: 500 }
        );
    }
}
