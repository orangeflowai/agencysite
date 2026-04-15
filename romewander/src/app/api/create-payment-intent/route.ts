import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const payloadUrl = process.env.PAYLOAD_API_URL
  const tenant = process.env.PAYLOAD_TENANT || process.env.NEXT_PUBLIC_SITE_ID || 'romewander'
  const apiKey = process.env.PAYLOAD_API_KEY
  const body = await req.json()

  if (payloadUrl && apiKey) {
    const res = await fetch(`${payloadUrl}/api/create-payment-intent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-tenant-id': tenant, Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ ...body, tenant }),
    })
    return NextResponse.json(await res.json(), { status: res.status })
  }

  try {
    const headersList = await headers()
    const siteId = headersList.get('x-site-id') || tenant
    const { getStripe } = await import('@/lib/stripe')
    const stripe = getStripe(siteId)
    const { amount, tourTitle, tourSlug, meetingPoint, date, time, guests, guestCounts = {}, bookingDetails, addOns = [] } = body
    const legacyAdults = guestCounts.Adult || guestCounts.Adults || body.adults || 0
    const legacyStudents = guestCounts.Student || guestCounts.Students || body.students || 0
    const legacyYouths = guestCounts.Youth || guestCounts.Youths || body.youths || 0
    const addOnsTotal = addOns.reduce((s: number, a: any) => s + a.price * a.quantity, 0)
    const safeJson = (v: any, max = 490) => { const s = JSON.stringify(v); return s.length > max ? s.slice(0, max) : s }
    const pi = await stripe.paymentIntents.create({
      amount: Math.round((amount + addOnsTotal) * 100), currency: 'eur',
      automatic_payment_methods: { enabled: true },
      metadata: {
        tourSlug: (tourSlug || '').slice(0, 490), tourTitle: (tourTitle || '').slice(0, 490),
        date: (date || '').slice(0, 100), time: (time || '').slice(0, 100),
        guests: guests.toString(), adults: legacyAdults.toString(),
        students: legacyStudents.toString(), youths: legacyYouths.toString(),
        guestCounts: safeJson(guestCounts), siteId,
        leadEmail: (bookingDetails?.leadTraveler?.email || '').slice(0, 490),
        leadName: (bookingDetails?.leadTraveler ? `${bookingDetails.leadTraveler.firstName} ${bookingDetails.leadTraveler.lastName}` : '').slice(0, 490),
        leadPhone: (bookingDetails?.leadTraveler?.phone || '').slice(0, 100),
        addOns: safeJson(addOns.map((a: any) => ({ name: a.name, price: a.price, quantity: a.quantity }))),
        meetingPoint: (meetingPoint || '').slice(0, 490),
      },
      description: `${tourTitle} - ${date} at ${time} (${guests} guests)`,
      receipt_email: bookingDetails?.leadTraveler?.email || undefined,
    })
    return NextResponse.json({ clientSecret: pi.client_secret, paymentIntentId: pi.id })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
