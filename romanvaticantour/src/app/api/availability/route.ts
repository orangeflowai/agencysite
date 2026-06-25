import { NextResponse } from 'next/server';
import { createClient } from 'next-sanity';

export const dynamic = 'force-dynamic';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
});

// Default time slots per tour — editable via Sanity admin (tour.slots field)
const DEFAULT_SLOTS = [
  { time: '09:00', available_slots: 15 },
  { time: '09:30', available_slots: 15 },
  { time: '10:00', available_slots: 15 },
  { time: '10:30', available_slots: 12 },
  { time: '11:00', available_slots: 12 },
  { time: '11:30', available_slots: 10 },
  { time: '12:00', available_slots: 10 },
  { time: '14:00', available_slots: 15 },
  { time: '14:30', available_slots: 12 },
  { time: '15:00', available_slots: 12 },
  { time: '15:30', available_slots: 10 },
  { time: '16:00', available_slots: 10 },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug') || '';
  const date = searchParams.get('date') || '';
  const mode = searchParams.get('mode') || 'day';

  if (!slug) return NextResponse.json(mode === 'month' ? {} : { slots: [] });

  try {
    // Query Sanity for the tour
    const tour = await client.fetch(
      `*[_type == "tour" && slug.current == $slug][0]{ _id, title, price, slots }`,
      { slug }
    );

    if (!tour) {
      return NextResponse.json(mode === 'month' ? {} : { slots: [] });
    }

    const basePrice = tour.price || 0;

    // Use tour-specific slots if defined in Sanity, otherwise use defaults
    const slots = (tour.slots && tour.slots.length > 0) ? tour.slots : DEFAULT_SLOTS;

    if (mode === 'month') {
      return getMonthAvailability(slots, basePrice, date);
    }

    return getDayAvailability(slots, basePrice, date);

  } catch (err) {
    console.error('[availability] Error:', err);
    return NextResponse.json(mode === 'month' ? {} : { slots: [] });
  }
}

function getDayAvailability(slots: any[], basePrice: number, date: string) {
  const requestedDate = new Date(date + 'T12:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Past dates: return empty
  if (requestedDate < today) {
    return NextResponse.json({ slots: [] });
  }

  // Check if it's Sunday (many Vatican sites closed)
  const dayOfWeek = requestedDate.getDay();
  if (dayOfWeek === 0) {
    return NextResponse.json({
      slots: slots.filter((s: any) => s.time && s.time.startsWith('14')).map((s: any) => ({
        time: s.time,
        available_slots: Math.max(0, (s.available_slots || 10) - 2),
      })),
    });
  }

  // Normal day — return all slots with slight randomization
  const result = slots.map((s: any) => ({
    time: s.time,
    available_slots: Math.max(0, (s.available_slots || 10) - Math.floor(Math.random() * 5)),
  }));

  return NextResponse.json({ slots: result });
}

function getMonthAvailability(slots: any[], basePrice: number, monthStr: string) {
  const [year, month] = monthStr.split('-').map(Number);
  const lastDay = new Date(year, month, 0).getDate();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const byDate: Record<string, { spots: number; price: number }> = {};

  for (let d = 1; d <= lastDay; d++) {
    const dateStr = `${monthStr}-${String(d).padStart(2, '0')}`;
    const checkDate = new Date(year, month - 1, d);

    // Skip past dates
    if (checkDate < today) {
      byDate[dateStr] = { spots: 0, price: basePrice };
      continue;
    }

    // Sundays: limited availability
    if (checkDate.getDay() === 0) {
      byDate[dateStr] = { spots: 4, price: basePrice };
      continue;
    }

    // Normal availability
    const totalSpots = slots.reduce((sum: number, s: any) => sum + (s.available_slots || 10), 0);
    byDate[dateStr] = { spots: Math.max(5, Math.floor(totalSpots / slots.length) * 2), price: basePrice };
  }

  return NextResponse.json(byDate);
}
