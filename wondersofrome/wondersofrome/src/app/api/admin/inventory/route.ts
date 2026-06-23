export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

// GET - fetch slots for a date range (used by calendar)
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const start = searchParams.get('start');
    const end = searchParams.get('end');

    if (!start || !end) {
        return NextResponse.json({ error: 'Missing start/end dates' }, { status: 400 });
    }

    try {
        const { data, error } = await supabaseAdmin
            .from('tour_slots')
            .select('*')
            .gte('date', start)
            .lte('date', end);

        if (error) throw error;
        return NextResponse.json(data || []);
    } catch (err: any) {
        console.error('[admin-inventory] GET error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// POST - add a new slot (Handles both create and manual upsert)
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { tour_slug, date, time, available_slots, price_override } = body;

        if (!tour_slug || !date || !time || available_slots == null) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Check if slot already exists to perform manual upsert
        const { data: existing } = await supabaseAdmin
            .from('tour_slots')
            .select('id')
            .eq('tour_slug', tour_slug)
            .eq('date', date)
            .eq('time', time)
            .maybeSingle();

        let result;
        if (existing) {
            // Update
            result = await supabaseAdmin
                .from('tour_slots')
                .update({
                    available_slots,
                    total_slots: available_slots,
                    price_override,
                    updated_at: new Date().toISOString()
                })
                .eq('id', existing.id)
                .select()
                .single();
        } else {
            // Insert
            result = await supabaseAdmin
                .from('tour_slots')
                .insert({
                    tour_slug,
                    date,
                    time,
                    available_slots,
                    total_slots: available_slots,
                    price_override,
                    site_id: process.env.NEXT_PUBLIC_SITE_ID || 'wondersofrome'
                })
                .select()
                .single();
        }

        if (result.error) throw result.error;
        return NextResponse.json({ slot: result.data });
    } catch (err: any) {
        console.error('[admin-inventory] POST error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// PATCH - update a slot by ID (spots, price, or pause toggle)
export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { id, available_slots, price_override, is_paused } = body;

        if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

        const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };

        if (available_slots !== undefined) updates.available_slots = available_slots;
        if (price_override !== undefined) updates.price_override = price_override;
        if (is_paused !== undefined) updates.is_paused = is_paused;

        const { data, error } = await supabaseAdmin
            .from('tour_slots')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return NextResponse.json({ slot: data });
    } catch (err: any) {
        console.error('[admin-inventory] PATCH error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// DELETE - delete one slot OR all slots for a tour/date
export async function DELETE(request: Request) {
    try {
        const body = await request.json();
        const { id, tour_slug, date } = body;

        if (id) {
            // Single slot delete
            const { error } = await supabaseAdmin
                .from('tour_slots')
                .delete()
                .eq('id', id);
            if (error) throw error;
            return NextResponse.json({ success: true });
        }

        if (tour_slug && date) {
            // Delete all slots for this tour/date
            const { error } = await supabaseAdmin
                .from('tour_slots')
                .delete()
                .eq('tour_slug', tour_slug)
                .eq('date', date);
            if (error) throw error;
            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: 'Provide id OR tour_slug+date' }, { status: 400 });
    } catch (err: any) {
        console.error('[admin-inventory] DELETE error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
