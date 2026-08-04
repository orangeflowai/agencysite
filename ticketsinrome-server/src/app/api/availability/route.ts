import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tourSlug = searchParams.get('slug');
  const date = searchParams.get('date');
  const mode = searchParams.get('mode'); // 'day' or 'month'

  if (!tourSlug || !date) {
    return NextResponse.json({ error: 'Missing slug or date' }, { status: 400 });
  }

  try {
    if (mode === 'month') {
      return await getMonthAvailability(tourSlug, date);
    } else if (mode === 'next') {
      return await getNextAvailableDates(tourSlug, date);
    } else {
      return await getDayAvailability(tourSlug, date);
    }
  } catch (err) {
    console.error('[availability] Error:', err);
    return NextResponse.json(mode === 'month' ? {} : mode === 'next' ? { dates: [] } : { slots: [] });
  }
}

async function getNextAvailableDates(tourSlug: string, startDate: string) {
  // Find the next 3 dates that have at least one non-paused slot with capacity
  // We fetch a larger range and filter specifically for "available in the future"
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const currentTime = now.getHours() * 60 + now.getMinutes();

  const { data, error } = await supabaseAdmin
    .from('tour_slots')
    .select('date, time, available_slots, is_paused')
    .eq('tour_slug', tourSlug)
    .gte('date', startDate) // Start from current selected or today
    .gt('available_slots', 0)
    .eq('is_paused', false)
    .order('date', { ascending: true })
    .order('time', { ascending: true })
    .limit(300);

  if (error) throw error;

  const validDates: string[] = [];
  const dateSet = new Set<string>();

  for (const slot of (data || [])) {
    if (dateSet.size >= 3) break;

    // If it's today, check if time has passed
    if (slot.date === todayStr) {
      const [h, m] = (slot.time || '00:00').split(':').map(Number);
      const slotTime = h * 60 + m;
      if (slotTime < currentTime) continue;
    }

    // If it's the current selected date (which we already know is fully booked or passed), skip it
    if (slot.date === startDate && slot.date !== todayStr) continue;

    if (!dateSet.has(slot.date)) {
      dateSet.add(slot.date);
      validDates.push(slot.date);
    }
  }

  // If we found the "current" date but it was fully booked (which is why this was called), 
  // ensure we return dates STRICTLY after it.
  const finalDates = validDates.filter(d => d !== startDate).slice(0, 3);

  return NextResponse.json({ dates: finalDates });
}

async function getDayAvailability(tourSlug: string, date: string) {
  // Query Supabase for this tour + date
  const { data: docs, error } = await supabaseAdmin
    .from('tour_slots')
    .select('*')
    .eq('tour_slug', tourSlug)
    .eq('date', date)
    .order('time', { ascending: true });

  if (error) throw error;

  // Only return slots with available capacity that are not paused
  const slots = (docs || [])
    .filter((s: any) => (s.available_slots ?? 0) > 0 && !s.is_paused)
    .map((s: any) => ({
      time: s.time,
      available_slots: s.available_slots,
      total_slots: s.total_slots || 20,
      price: s.price_override,
    }));

  return NextResponse.json({ slots });
}

async function getMonthAvailability(tourSlug: string, monthStr: string) {
  // monthStr = "2026-04"
  const [year, month] = monthStr.split('-').map(Number);
  const lastDay = new Date(year, month, 0).getDate();
  const startDate = `${monthStr}-01`;
  const endDate = `${monthStr}-${String(lastDay).padStart(2, '0')}`;

  const { data: docs, error } = await supabaseAdmin
    .from('tour_slots')
    .select('*')
    .eq('tour_slug', tourSlug)
    .gte('date', startDate)
    .lte('date', endDate);

  if (error) throw error;

  // Aggregate by date — exclude paused slots
  const byDate: Record<string, { spots: number; price: number | null }> = {};
  for (const slot of (docs || [])) {
    if (slot.is_paused) continue; // skip paused slots
    const dateKey = slot.date;
    if (!byDate[dateKey]) {
      byDate[dateKey] = { spots: 0, price: slot.price_override };
    }
    byDate[dateKey].spots += slot.available_slots || 0;
    
    if (slot.price_override && (byDate[dateKey].price === null || slot.price_override < (byDate[dateKey].price || 9999))) {
      byDate[dateKey].price = slot.price_override;
    }
  }

  return NextResponse.json(byDate);
}
