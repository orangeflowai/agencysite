
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const { data, error, count } = await supabase
            .from('inventory')
            .select('*', { count: 'exact' });

        if (error) {
            return NextResponse.json({ error: error.message });
        }

        // Get summary by tour
        const byTour = data?.reduce((acc: any, item) => {
            acc[item.tour_slug] = (acc[item.tour_slug] || 0) + 1;
            return acc;
        }, {});

        return NextResponse.json({
            count: count || 0,
            byTour: byTour || {},
            sample: data?.slice(0, 3) || []
        });
    } catch (err: any) {
        return NextResponse.json({ error: err.message });
    }
}
