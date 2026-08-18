import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { getTour } from '@/lib/tourService'

export const dynamic = 'force-dynamic'

const TENANT = process.env.NEXT_PUBLIC_SITE_ID || 'goldenrometour'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug') || ''
  const date = searchParams.get('date') || ''
  const mode = searchParams.get('mode') || 'day'

  if (!slug) return NextResponse.json(mode === 'month' ? {} : { slots: [] })

  try {
    const tour = await getTour(slug)
    const basePrice = tour?.price || 0
    if (mode === 'month') return NextResponse.json(await getMonthAvailability(slug, basePrice, date))
    return NextResponse.json(await getDayAvailability(slug, basePrice, date))
  } catch (err) {
    console.error('[availability] Error:', err)
    return NextResponse.json(mode === 'month' ? {} : { slots: [] })
  }
}

async function getDayAvailability(slug: string, basePrice: number, date: string) {
  const { data, error } = await supabaseAdmin
    .from('inventory')
    .select('*')
    .eq('tenant', TENANT)
    .eq('tour_slug', slug)
    .eq('date', date)
    .order('time')

  if (error) return { slots: [] }

  const slots = (data || [])
    .filter((s: any) => (s.available_slots ?? 0) > 0)
    .map((s: any) => ({
      time: s.time,
      available: s.available_slots,
      available_slots: s.available_slots,
      total_slots: s.total_slots,
      price: s.price_override || basePrice,
    }))

  return { slots }
}

async function getMonthAvailability(slug: string, basePrice: number, monthStr: string) {
  const [year, month] = monthStr.split('-').map(Number)
  const lastDay = new Date(year, month, 0).getDate()
  const monthStart = `${monthStr}-01`
  const monthEnd = `${monthStr}-${String(lastDay).padStart(2, '0')}`

  const { data, error } = await supabaseAdmin
    .from('inventory')
    .select('*')
    .eq('tenant', TENANT)
    .eq('tour_slug', slug)
    .gte('date', monthStart)
    .lte('date', monthEnd)

  if (error) return {}

  const byDate: Record<string, { spots: number; price: number }> = {}
  for (const slot of data || []) {
    const dateKey = String(slot.date).slice(0, 10)
    if (!dateKey) continue
    if (!byDate[dateKey]) byDate[dateKey] = { spots: 0, price: slot.price_override || basePrice }
    byDate[dateKey].spots += slot.available_slots || 0
    if (slot.price_override && slot.price_override < byDate[dateKey].price) {
      byDate[dateKey].price = slot.price_override
    }
  }
  return byDate
}
