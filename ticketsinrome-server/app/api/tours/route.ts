import { NextResponse } from 'next/server';
import { getTours } from '@/lib/sanityService';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const tours = await getTours();
        return NextResponse.json({ success: true, tours }, { status: 200 });
    } catch (error) {
        console.error('[api/tours] Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch tours' }, { status: 500 });
    }
}
