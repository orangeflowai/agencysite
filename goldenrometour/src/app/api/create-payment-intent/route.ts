import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const body = await req.json()
  const siteId = (await headers()).get('x-site-id')
    || process.env.NEXT_PUBLIC_SITE_ID
    || 'goldenrometour'

  try {
    const { getStripe } = await import('@/lib/stripe')
    const stripe = getStripe(siteId)
    const { amount, tourTitle, tourSlug, date, time, guests, guestCounts = {}, bookingDetails, addOns = [] } = body

    const adults = guestCounts.Adult ?? guestCounts.Adults ?? body.adults ?? 0
    const students = guestCounts.Student ?? guestCounts.Students ?? body.students ?? 0
    const youths = guestCounts.Youth ?? guestCounts.Youths ?? body.youths ?? 0
    const addOnsTotal = (addOns as any[]).reduce((s, a) => s + a.price * a.quantity, 0)
    const safeJson = (v: any, max = 490) => { const s = JSON.stringify(v); return s.length > max ? s.slice(0, max) : s }
    const lead = bookingDetails?.leadTraveler || {}

    const pi = await stripe.paymentIntents.create({
      amount: Math.round((Number(amount) + addOnsTotal) * 100),
      currency: 'eur',
      automatic_payment_methods: { enabled: true },
      metadata: {
        tourSlug: (tourSlug || '').slice(0, 490),
        tourTitle: (tourTitle || '').slice(0, 490),
        date: (date || '').slice(0, 100),
        time: (time || '').slice(0, 100),
        guests: String(guests),
        adults: String(adults),
        students: String(students),
        youths: String(youths),
        guestCounts: safeJson(guestCounts),
        siteId,
        leadEmail: (lead.email || '').slice(0, 490),
        leadName: (`${lead.firstName || ''} ${lead.lastName || ''}`.trim()).slice(0, 490),
        leadPhone: (lead.phone || '').slice(0, 100),
        addOns: safeJson((addOns as any[]).map((a) => ({ name: a.name, price: a.price, quantity: a.quantity }))),
      },
      description: `${tourTitle} - ${date} at ${time} (${guests} guests)`,
      receipt_email: lead.email || undefined,
    })

    return NextResponse.json({ clientSecret: pi.client_secret, paymentIntentId: pi.id })
  } catch (err) {
    console.error('[create-payment-intent] Error:', err instanceof Error ? err.message : String(err))
    return NextResponse.json({ error: 'Payment processing failed. Please try again.' }, { status: 500 })
  }
}
