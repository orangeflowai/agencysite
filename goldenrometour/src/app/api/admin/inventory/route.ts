import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

// GET - fetch slots for a tour/date
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const tourSlug = searchParams.get('tourSlug');
    const date = searchParams.get('date');

    if (!tourSlug || !date) {
        return NextResponse.json({ error: 'Missing tourSlug or date' }, { status: 400 });
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

// POST - add a new slot
export async function POST(request: Request) {
    const body = await request.json();
    const { tour_slug, date, time, available_slots, price_override } = body;

    if (!tour_slug || !date || !time || available_slots == null) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const payload: any = { tour_slug, date, time, available_slots };
    if (price_override != null && price_override !== '') payload.price_override = price_override;

    const { data, error } = await supabaseAdmin
        .from('inventory')
        .insert(payload)
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ slot: data });
}

// PATCH - update a slot (available_slots, price_override)
export async function PATCH(request: Request) {
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
