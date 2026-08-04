export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { requireAdmin } from '@/lib/apiAuth';

// GET - fetch slots: by tour/date (single day) OR by date range with tenant
export async function GET(request: Request) {
    const auth = await requireAdmin();
    if (!auth.authorized) return auth.errorResponse;
    const { searchParams } = new URL(request.url);
    const tourSlug = searchParams.get('tourSlug');
    const date = searchParams.get('date');
    const start = searchParams.get('start');
    const end = searchParams.get('end');
    const tenant = searchParams.get('tenant') || process.env.NEXT_PUBLIC_SITE_ID || 'romanvaticantour';

    // Month-range query (calendar view)
    if (start && end) {
        let query = supabaseAdmin
            .from('inventory')
            .select('*')
            .gte('date', start)
            .lte('date', end)
            .eq('tenant', tenant);

        if (tourSlug) {
            query = query.eq('tour_slug', tourSlug);
        }

        const { data, error } = await query.order('date').order('time');
        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json({ slots: data });
    }

    // Single-day query (ManageSlotsModal)
    if (!tourSlug || !date) {
        return NextResponse.json({ error: 'Missing tourSlug or date (or start/end for range)' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
        .from('inventory')
        .select('*')
        .eq('tour_slug', tourSlug)
        .eq('date', date)
        .order('time');

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ slots: data });
}

// POST - add or update a slot (upsert by tour_slug + date + time)
export async function POST(request: Request) {
    const auth = await requireAdmin();
    if (!auth.authorized) return auth.errorResponse;
    const body = await request.json();
    const { tour_slug, date, time, available_slots, price_override } = body;

    if (!tour_slug || !date || !time || available_slots == null) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const tenant = body.tenant || process.env.NEXT_PUBLIC_SITE_ID || 'romanvaticantour';
    const total_slots = body.total_slots ?? available_slots;
    const payload: any = { tour_slug, date, time, available_slots, total_slots, tenant };
    if (price_override != null && price_override !== '') payload.price_override = price_override;

    // Upsert — update if slot already exists, insert if not
    const { data, error } = await supabaseAdmin
        .from('inventory')
        .upsert(payload, { onConflict: 'tour_slug, date, time' })
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ slot: data });
}

// PATCH - update a slot (available_slots, price_override)
export async function PATCH(request: Request) {
    const auth = await requireAdmin();
    if (!auth.authorized) return auth.errorResponse;
    const body = await request.json();
    const { id, available_slots, price_override } = body;

    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    const updates: any = {};
    if (available_slots != null) updates.available_slots = available_slots;
    if (price_override !== undefined) updates.price_override = price_override;

    const { data, error } = await supabaseAdmin
        .from('inventory')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ slot: data });
}

// DELETE - delete one slot or all slots for a tour/date
export async function DELETE(request: Request) {
    const auth = await requireAdmin();
    if (!auth.authorized) return auth.errorResponse;
    const body = await request.json();
    const { id, tour_slug, date } = body;

    if (id) {
        // Delete single slot
        const { error } = await supabaseAdmin
            .from('inventory')
            .delete()
            .eq('id', id);

        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json({ success: true });
    }

    if (tour_slug && date) {
        // Delete all slots for this tour/date
        const { error } = await supabaseAdmin
            .from('inventory')
            .delete()
            .eq('tour_slug', tour_slug)
            .eq('date', date);

        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Provide id OR tour_slug+date' }, { status: 400 });
}
