import { NextResponse, type NextRequest } from 'next/server';
import { getTours } from '@/lib/tourService';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { isAdmin } from '@/lib/adminAuth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  if (!isAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
