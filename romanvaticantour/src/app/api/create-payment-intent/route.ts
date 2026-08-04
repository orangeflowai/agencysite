import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { getTour } from '@/lib/sanityService'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export const dynamic = 'force-dynamic'

function generateBookingRef(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let ref = ''
  for (let i = 0; i < 8; i++) ref += chars.charAt(Math.floor(Math.random() * chars.length))
  return ref
}

export async function POST(req: Request) {
  const body = await req.json()
  const defaultSiteId = process.env.NEXT_PUBLIC_SITE_ID || 'romanvaticantour'

  try {
    const headersList = await headers()
    const siteId = headersList.get('x-site-id') || defaultSiteId
    const { tourTitle, tourSlug, meetingPoint, date, time, guests, guestCounts = {}, bookingDetails, addOns = [] } = body

    const { getStripe } = await import('@/lib/stripe')
    const stripe = getStripe(siteId)

    // Server-side price calculation: fetch tour price from Sanity, never trust client amount
    const tour = await getTour(tourSlug, siteId)
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
    const bookingRef = generateBookingRef()

    const leadFirstName = bookingDetails?.leadTraveler?.firstName || 'Guest'
    const leadLastName = bookingDetails?.leadTraveler?.lastName || ''
    const leadEmail = bookingDetails?.leadTraveler?.email || ''
    const leadPhone = bookingDetails?.leadTraveler?.phone || null

    // Flatten addOns into individual metadata keys to avoid truncation
    const addOnMetadata: Record<string, string> = {}
    addOns.forEach((a: any, i: number) => {
      addOnMetadata[`addOn_${i}_name`] = (a.name || '').slice(0, 490)
      addOnMetadata[`addOn_${i}_price`] = String(a.price || 0)
      addOnMetadata[`addOn_${i}_qty`] = String(a.quantity || 0)
    })

    // ── 1. INSERT PENDING BOOKING IN DB BEFORE STRIPE ──
    // This ensures the booking is visible in admin immediately,
    // even if the webhook is delayed or fails.
    let bookingId: string | null = null
    try {
      const { data: booking, error: dbError } = await supabaseAdmin
        .from('bookings')
        .insert({
          tour_title: tourTitle || tour.title,
          date,
          time: time || '09:00',
          lead_first_name: leadFirstName,
          lead_last_name: leadLastName,
          lead_email: leadEmail,
          lead_phone: leadPhone,
          guests,
          total_amount: total,
          currency: 'eur',
          status: 'pending',
          tenant: siteId,
          booking_ref: bookingRef,
          guest_counts: guestCounts,
          source: 'website',
          notes: bookingDetails?.notes || null,
          pickup_location: bookingDetails?.pickupLocation || null,
        })
        .select('id')
        .single()

      if (dbError) {
        console.error('[create-payment-intent] DB insert failed:', dbError.message)
      } else {
        bookingId = booking?.id || null
        console.log(`[create-payment-intent] Pending booking ${bookingId} created for ${siteId}`)
      }
    } catch (dbErr: any) {
      console.error('[create-payment-intent] DB error:', dbErr.message)
      // Continue — the webhook will create the booking as fallback
    }

    // ── 2. CREATE STRIPE PAYMENT INTENT ──
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
        siteId,
        leadEmail: (leadEmail || '').slice(0, 490),
        leadName: (`${leadFirstName} ${leadLastName}`.trim() || 'Guest').slice(0, 490),
        leadPhone: (leadPhone || '').slice(0, 100),
        meetingPoint: (meetingPoint || '').slice(0, 490),
        bookingRef,
        bookingId: bookingId || '',
        ...addOnMetadata,
      },
      description: `${tourTitle || tour.title} - ${date} at ${time} (${guests} guests)`,
      receipt_email: leadEmail || undefined,
    })

    // ── 3. UPDATE BOOKING WITH STRIPE PI ID ──
    if (bookingId) {
      try {
        await supabaseAdmin
          .from('bookings')
          .update({ stripe_payment_intent_id: pi.id, booking_ref: bookingRef })
          .eq('id', bookingId)
      } catch (updateErr: any) {
        console.error('[create-payment-intent] Failed to update booking with PI:', updateErr.message)
      }
    }

    return NextResponse.json({
      clientSecret: pi.client_secret,
      paymentIntentId: pi.id,
      bookingRef,
      bookingId,
    })
  } catch (err: any) {
    console.error('[create-payment-intent] Fatal error:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
