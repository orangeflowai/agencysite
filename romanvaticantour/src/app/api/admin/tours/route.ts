import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/apiAuth';
import { getAllTours } from '@/lib/sanityService';

export const dynamic = 'force-dynamic';

export async function GET() {
    const auth = await requireAdmin();
    if (!auth.authorized) return auth.errorResponse;

    try {
        const tours = await getAllTours();
        return NextResponse.json({ tours, count: tours.length });
    } catch (error: any) {
        console.error('[admin/tours] Failed:', error.message);
        return NextResponse.json({ error: 'Failed to fetch tours', detail: error.message }, { status: 500 });
    }
}
