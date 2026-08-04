export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { createClient as createSanityClient } from 'next-sanity';
import { createClient } from '@supabase/supabase-js';

const sanityClient = createSanityClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
});

// Anon-key Supabase client — used for public availability reads.
// Relies on RLS policy "inventory_public_read" (SELECT using true).
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

function getSupabaseClient() {
  return createClient(supabaseUrl, supabaseAnonKey);
}

// Fallback slots used when no inventory rows exist yet for a tour/date.
// Admin must seed inventory via /api/seed-inventory or the admin calendar.
const FALLBACK_SLOTS = [
  { time: '09:00', available_slots: 0 },
  { time: '09:30', available_slots: 0 },
  { time: '10:00', available_slots: 0 },
  { time: '10:30', available_slots: 0 },
  { time: '11:00', available_slots: 0 },
  { time: '11:30', available_slots: 0 },
  { time: '12:00', available_slots: 0 },
  { time: '14:00', available_slots: 0 },
  { time: '14:30', available_slots: 0 },
  { time: '15:00', available_slots: 0 },
  { time: '15:30', available_slots: 0 },
  { time: '16:00', available_slots: 0 },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug') || '';
  const date = searchParams.get('date') || '';
  const mode = searchParams.get('mode') || 'day';

  if (!slug) {
    return NextResponse.json(mode === 'month' ? {} : { slots: [] });
  }

  try {
    // 1. Get tour price from Sanity (single source of truth for pricing)
    const tour = await sanityClient.fetch(
      `*[_type == "tour" && slug.current == $slug][0]{ _id, title, price }`,
      { slug }
    );

    const basePrice = tour?.price || 0;

    // 2. Validate date is not in the past
    if (date) {
      const requestedDate = new Date(date + 'T12:00:00');
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (requestedDate < today) {
        return NextResponse.json(mode === 'month' ? {} : { slots: [] });
      }
    }

    // 3. Read real inventory from Supabase
    const supabase = getSupabaseClient();

    if (mode === 'month') {
      // Month mode: return spots summary per day
      const [year, month] = date.split('-').map(Number);
      const lastDay = new Date(year, month, 0).getDate();
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const startDate = `${date}-01`;
      const endDate = `${date}-${String(lastDay).padStart(2, '0')}`;

      const { data: monthInventory, error: monthError } = await supabase
        .from('inventory')
        .select('date, available_slots')
        .eq('tour_slug', slug)
        .gte('date', startDate)
        .lte('date', endDate);

      if (monthError) {
        console.error('[availability] Month query error:', monthError.message);
        return NextResponse.json({});
      }

      // Aggregate spots per date
      const byDate: Record<string, { spots: number; price: number }> = {};
      const now = new Date();
      now.setHours(0, 0, 0, 0);

      for (let d = 1; d <= lastDay; d++) {
        const dateStr = `${date}-${String(d).padStart(2, '0')}`;
        const checkDate = new Date(year, month - 1, d);

        if (checkDate < today) {
          byDate[dateStr] = { spots: 0, price: basePrice };
          continue;
        }

        const dayRows = (monthInventory || []).filter(r => r.date === dateStr);
        const totalSpots = dayRows.reduce((sum, r) => sum + (r.available_slots || 0), 0);
        byDate[dateStr] = { spots: totalSpots, price: basePrice };
      }

      return NextResponse.json(byDate);
    }

    // Day mode: return detailed time slots for the specific date
    const { data: dayInventory, error: dayError } = await supabase
      .from('inventory')
      .select('time, available_slots, price_override')
      .eq('tour_slug', slug)
      .eq('date', date)
      .order('time');

    if (dayError) {
      console.error('[availability] Day query error:', dayError.message);
      return NextResponse.json({ slots: FALLBACK_SLOTS });
    }

    if (!dayInventory || dayInventory.length === 0) {
      // No inventory configured for this date — return fallback (all zero)
      return NextResponse.json({ slots: FALLBACK_SLOTS });
    }

    const slots = dayInventory.map((row) => ({
      time: row.time,
      available_slots: row.available_slots,
      price_override: row.price_override ?? null,
    }));

    return NextResponse.json({ slots, basePrice });

  } catch (err) {
    console.error('[availability] Error:', err);
    return NextResponse.json(mode === 'month' ? {} : { slots: [] });
  }
}
