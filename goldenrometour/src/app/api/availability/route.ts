import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

/**
 * Proxies availability requests to the Payload Unified CMS.
 * Falls back to direct Supabase query if PAYLOAD_API_URL is not set.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug') || searchParams.get('tour')
  const date = searchParams.get('date')
  const mode = searchParams.get('mode') || 'day'

  if (!slug) return NextResponse.json({ error: 'Missing slug' }, { status: 400 })

  const payloadUrl = process.env.PAYLOAD_API_URL
  const tenant = process.env.PAYLOAD_TENANT || process.env.NEXT_PUBLIC_SITE_ID || 'goldenrometour'
  const apiKey = process.env.PAYLOAD_API_KEY

  if (payloadUrl && apiKey) {
    // Forward to Payload
    const params = new URLSearchParams({ tour: slug, tenant, mode })
    if (date) params.set('date', date)
    const res = await fetch(`${payloadUrl}/api/availability?${params}`, {
      headers: { 'x-tenant-id': tenant, Authorization: `Bearer ${apiKey}` },
      cache: 'no-store',
    })
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  }

  // Fallback: direct Supabase (legacy)
  const { supabase } = await import('@/lib/supabase')
  try {
    const { data: tourData } = await supabase.from('tours').select('base_price').eq('slug', slug).single()
    const basePrice = (tourData as any)?.base_price || 0

    if (mode === 'month' && date) {
      const startDate = `${date}-01`
      const endDate = `${date}-31`
      const { data, error } = await supabase.from('inventory').select('date, available_slots, price_override')
        .eq('tour_slug', slug).gte('date', startDate).lte('date', endDate).gt('available_slots', 0)
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
    const slots = data?.map((s: any) => ({ ...s, price: s.price_override || basePrice })) || []
    return NextResponse.json({ slots })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
