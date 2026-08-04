import { NextRequest, NextResponse } from 'next/server';
import { getTour } from '@/lib/sanityService';

export const dynamic = 'force-dynamic';

export async function GET(
    request: NextRequest,
    { params }: { params: { slug: string } }
) {
    try {
        const slug = params.slug;
        const tour = await getTour(slug);

        if (!tour) {
            return NextResponse.json({ success: false, error: 'Tour not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, tour }, { status: 200 });
    } catch (error) {
        console.error('[api/tours/slug] Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch tour' }, { status: 500 });
    }
}
