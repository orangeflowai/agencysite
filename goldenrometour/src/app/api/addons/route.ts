import { NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const siteId = searchParams.get('site') || process.env.NEXT_PUBLIC_SITE_ID || 'goldenrometour';
        
        // Fetch add-ons for the specific site
        const addons = await client.fetch(`
            *[_type == "addon" && available == true && $siteId in sites[]._ref] | order(sortOrder asc, price asc) {
                _id,
                name,
                "id": id.current,
                description,
                longDescription,
                price,
                pricingType,
                icon,
                category,
                popular,
                image
            }
        `, { siteId });

        return NextResponse.json({ addons });
    } catch (err: any) {
        console.error('Error fetching add-ons:', err);
        return NextResponse.json(
            { error: err.message || 'Failed to fetch add-ons' },
            { status: 500 }
        );
    }
}
