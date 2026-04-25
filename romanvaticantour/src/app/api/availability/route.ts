import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const PAYLOAD_URL = process.env.PAYLOAD_API_URL || process.env.NEXT_PUBLIC_PAYLOAD_URL || 'https://admin.wondersofrome.com';
const SITE_ID = process.env.NEXT_PUBLIC_SITE_ID || 'romanvaticantour';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug') || '';
  const date = searchParams.get('date') || '';
  const mode = searchParams.get('mode') || 'day';

  if (!slug) return NextResponse.json(mode === 'month' ? {} : { slots: [] });

  try {
    // Step 1: find the tour by slug + tenant in Payload
    const tourRes = await fetch(
      `${PAYLOAD_URL}/api/tours?where[slug][equals]=${encodeURIComponent(slug)}&where[tenant][equals]=${encodeURIComponent(SITE_ID)}&limit=1&depth=0`,
      { cache: 'no-store' }
    );

    let tourId: string | null = null;
    let basePrice = 0;

    if (tourRes.ok) {
      const tourData = await tourRes.json();
      const tour = tourData?.docs?.[0];
      if (tour) {
        tourId = tour.id;
        basePrice = tour.price || 0;
      }
    }

    // Fallback: try slug suffixes used during migration
    if (!tourId) {
      for (const suffix of ['-rvt', '-wor', '-tir', '-grt', '-rwd']) {
        const fallbackRes = await fetch(
          `${PAYLOAD_URL}/api/tours?where[slug][equals]=${encodeURIComponent(slug + suffix)}&where[tenant][equals]=${encodeURIComponent(SITE_ID)}&limit=1&depth=0`,
          { cache: 'no-store' }
        );
        if (fallbackRes.ok) {
          const fallbackData = await fallbackRes.json();
          const tour = fallbackData?.docs?.[0];
          if (tour) { tourId = tour.id; basePrice = tour.price || 0; break; }
        }
      }
    }

    if (!tourId) {
      return NextResponse.json(mode === 'month' ? {} : { slots: [] });
    }

    if (mode === 'month') {
      return await getMonthAvailability(tourId, basePrice, date);
    }

    return await getDayAvailability(tourId, basePrice, date);

  } catch (err) {
    console.error('[availability] Error:', err);
    return NextResponse.json(mode === 'month' ? {} : { slots: [] });
  }
}

async function getDayAvailability(tourId: string, basePrice: number, date: string) {
  const dateStart = `${date}T00:00:00.000Z`;
  const dateEnd = `${date}T23:59:59.999Z`;

  const res = await fetch(
    `${PAYLOAD_URL}/api/inventory?where[tour][equals]=${tourId}&where[date][greater_than_equal]=${encodeURIComponent(dateStart)}&where[date][less_than_equal]=${encodeURIComponent(dateEnd)}&limit=50&sort=time&depth=0`,
    { cache: 'no-store' }
  );

  if (!res.ok) return NextResponse.json({ slots: [] });

  const data = await res.json();
  const docs = data?.docs || [];

  const slots = docs
    .filter((s: any) => (s.availableSlots ?? 0) > 0)
    .map((s: any) => ({
      time: s.time,
      available_slots: s.availableSlots,
      total_slots: s.totalSlots,
      price: s.priceOverride || basePrice,
    }));

  return NextResponse.json({ slots });
}

async function getMonthAvailability(tourId: string, basePrice: number, monthStr: string) {
  const [year, month] = monthStr.split('-').map(Number);
  const lastDay = new Date(year, month, 0).getDate();
  const monthStart = `${monthStr}-01T00:00:00.000Z`;
  const monthEnd = `${monthStr}-${String(lastDay).padStart(2, '0')}T23:59:59.999Z`;

  const res = await fetch(
    `${PAYLOAD_URL}/api/inventory?where[tour][equals]=${tourId}&where[date][greater_than_equal]=${encodeURIComponent(monthStart)}&where[date][less_than_equal]=${encodeURIComponent(monthEnd)}&limit=500&depth=0`,
    { cache: 'no-store' }
  );

  if (!res.ok) return NextResponse.json({});

  const data = await res.json();
  const docs = data?.docs || [];

  const byDate: Record<string, { spots: number; price: number }> = {};
  for (const slot of docs) {
    const dateKey = typeof slot.date === 'string' ? slot.date.slice(0, 10) : '';
    if (!dateKey) continue;
    if (!byDate[dateKey]) {
      byDate[dateKey] = { spots: 0, price: slot.priceOverride || basePrice };
    }
    byDate[dateKey].spots += slot.availableSlots || 0;
    if (slot.priceOverride && slot.priceOverride < byDate[dateKey].price) {
      byDate[dateKey].price = slot.priceOverride;
    }
  }

  return NextResponse.json(byDate);
}
