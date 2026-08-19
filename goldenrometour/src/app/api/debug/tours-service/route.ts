import { NextResponse } from 'next/server';
import { getTours } from '@/lib/tourService';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

export async function GET() {
  const out: any = {};

  // Direct DB read (same as admin API)
  const { data, error } = await supabaseAdmin.from('tours').select('*').order('sort_order');
  out.directData = (data || []).map((r: any) => ({ slug: r.slug, price: r.price, active: r.active }));
  out.directError = error?.message || null;

  // getTours() result
  const tours = await getTours();
  out.getTours = tours.map((t: any) => ({ slug: t.slug?.current, price: t.price, image: t.mainImage?.asset?.url }));

  return NextResponse.json(out);
}
