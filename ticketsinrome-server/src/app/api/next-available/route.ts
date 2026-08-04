export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

/**
 * GET /api/next-available?slugs=slug1,slug2,slug3
 *
 * Returns the earliest future date with available (non-paused) slots
 * for each requested tour slug.
 *
 * Response: { "colosseum-tour": "2026-06-20", "vatican-tour": null }
 */
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const slugsParam = searchParams.get('slugs');

    if (!slugsParam) {
        return NextResponse.json({ error: 'Missing slugs param' }, { status: 400 });
    }

    const slugs = slugsParam.split(',').map(s => s.trim()).filter(Boolean);
    if (slugs.length === 0) {
        return NextResponse.json({});
    }

    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    try {
        const { data, error } = await supabaseAdmin
            .from('tour_slots')
            .select('tour_slug, date')
            .in('tour_slug', slugs)
            .gte('date', today)
            .eq('is_paused', false)
            .gt('available_slots', 0)
            .order('date', { ascending: true });

        if (error) throw error;

        // Pick earliest date per slug
        const result: Record<string, string | null> = {};
        slugs.forEach(slug => { result[slug] = null; });
        (data || []).forEach(row => {
            if (result[row.tour_slug] === null) {
                result[row.tour_slug] = row.date;
            }
        });

        return NextResponse.json(result);
    } catch (err: any) {
        console.error('[next-available] error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
