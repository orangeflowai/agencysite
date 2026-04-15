import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug') || searchParams.get('tour')
  const date = searchParams.get('date')
  const mode = searchParams.get('mode') || 'day'

  if (!slug) return NextResponse.json({ error: 'Missing slug' }, { status: 400 })

  const payloadUrl = process.env.PAYLOAD_API_URL
  const tenant = process.env.PAYLOAD_TENANT || process.env.NEXT_PUBLIC_SITE_ID || 'romanvaticantour'
  const apiKey = process.env.PAYLOAD_API_KEY

  if (payloadUrl && apiKey) {
    const params = new URLSearchParams({ tour: slug, tenant, mode })
    if (date) params.set('date', date)
    const res = await fetch(`${payloadUrl}/api/availability?${params}`, {
      headers: { 'x-tenant-id': tenant, Authorization: `Bearer ${apiKey}` },
      cache: 'no-store',
    })
    return NextResponse.json(await res.json(), { status: res.status })
  }

  // Supabase fallback
  const { supabase } = await import('@/lib/supabase')
  try {
    const { data: tourData } = await supabase.from('tours').select('base_price').eq('slug', slug).single()
    const basePrice = (tourData as any)?.base_price || 0
    if (mode === 'month' && date) {
      const { data, error } = await supabase.from('inventory').select('date, available_slots, price_override')
        .eq('tour_slug', slug).gte('date', `${date}-01`).lte('date', `${date}-31`).gt('available_slots', 0)
      if (error) throw error
      const map: Record<string, { spots: number; price?: number }> = {}
      data?.forEach((row: any) => {
        const cur = map[row.date] || { spots: 0 }
        cur.spots += row.available_slots
        cur.price = row.price_override || basePrice
        map[row.date] = cur
      })
      return NextResponse.json(map)
    }
    if (!date) return NextResponse.json({ error: 'Missing date' }, { status: 400 })
    const { data, error } = await supabase.from('inventory').select('time, available_slots, price_override')
      .eq('tour_slug', slug).eq('date', date).gt('available_slots', 0).order('time')
    if (error) throw error
    return NextResponse.json({ slots: data?.map((s: any) => ({ ...s, price: s.price_override || basePrice })) || [] })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
