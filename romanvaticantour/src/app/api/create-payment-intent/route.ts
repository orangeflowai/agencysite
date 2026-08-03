import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { getTour } from '@/lib/sanityService'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const body = await req.json()
  const siteId = process.env.NEXT_PUBLIC_SITE_ID || 'romanvaticantour'

  try {
    const headersList = await headers()
    const reqSiteId = headersList.get('x-site-id') || siteId
    const { tourTitle, tourSlug, meetingPoint, date, time, guests, guestCounts = {}, bookingDetails, addOns = [] } = body

    const { getStripe } = await import('@/lib/stripe')
    const stripe = getStripe(reqSiteId)

    // Server-side price calculation: fetch tour price from Sanity, never trust client amount
    const tour = await getTour(tourSlug, reqSiteId)
    if (!tour) {
      return NextResponse.json({ error: 'Tour not found' }, { status: 404 })
    }

    const guestTypes = tour.guestTypes?.length
      ? tour.guestTypes
      : [
          { name: 'Adult', price: tour.price },
          { name: 'Student', price: Math.round(tour.price * 0.85) },
          { name: 'Youth', price: Math.round(tour.price * 0.7) },
          { name: 'Child', price: Math.round(tour.price * 0.5) },
        ]

    const addOnsTotal = addOns.reduce((s: number, a: any) => s + a.price * a.quantity, 0)
    const guestsTotal = guestTypes.reduce(
      (s: number, gt: any) => s + (guestCounts[gt.name] || 0) * gt.price,
      0
    )
    const total = guestsTotal + addOnsTotal

    if (total <= 0) {
      return NextResponse.json({ error: 'Invalid booking total' }, { status: 400 })
    }

    const adults = guestCounts.Adult || guestCounts.Adults || body.adults || 0
    const students = guestCounts.Student || guestCounts.Students || body.students || 0
    const youths = guestCounts.Youth || guestCounts.Youths || body.youths || 0

    // Flatten addOns into individual metadata keys to avoid truncation
    const addOnMetadata: Record<string, string> = {}
    addOns.forEach((a: any, i: number) => {
      addOnMetadata[`addOn_${i}_name`] = (a.name || '').slice(0, 490)
      addOnMetadata[`addOn_${i}_price`] = String(a.price || 0)
      addOnMetadata[`addOn_${i}_qty`] = String(a.quantity || 0)
    })

    const pi = await stripe.paymentIntents.create({
      amount: Math.round(total * 100), currency: 'eur',
      automatic_payment_methods: { enabled: true },
      metadata: {
        tourSlug: (tourSlug || '').slice(0, 490),
        tourTitle: (tourTitle || tour.title || '').slice(0, 490),
        date: (date || '').slice(0, 100), time: (time || '').slice(0, 100),
        guests: guests.toString(), adults: adults.toString(),
        students: students.toString(), youths: youths.toString(),
        gc_adults: String(adults), gc_students: String(students), gc_youths: String(youths),
        siteId: reqSiteId,
        leadEmail: (bookingDetails?.leadTraveler?.email || '').slice(0, 490),
        leadName: (bookingDetails?.leadTraveler ? `${bookingDetails.leadTraveler.firstName} ${bookingDetails.leadTraveler.lastName}` : '').slice(0, 490),
        leadPhone: (bookingDetails?.leadTraveler?.phone || '').slice(0, 100),
        meetingPoint: (meetingPoint || '').slice(0, 490),
        ...addOnMetadata,
      },
      description: `${tourTitle || tour.title} - ${date} at ${time} (${guests} guests)`,
      receipt_email: bookingDetails?.leadTraveler?.email || undefined,
    })
    return NextResponse.json({ clientSecret: pi.client_secret, paymentIntentId: pi.id })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
