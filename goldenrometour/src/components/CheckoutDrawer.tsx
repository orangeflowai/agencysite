'use client'

import { useState, useEffect, useMemo } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import {
  X, Lock, Check, Mail, Phone,
  MapPin, Calendar, Clock, Users, Shield,
  AlertTriangle, ArrowLeft, Loader2, Timer
} from 'lucide-react'
import Image from 'next/image'
import { format } from 'date-fns'
import { useSite } from '@/components/SiteProvider'
import { urlFor } from '@/lib/dataAdapter'

interface GuestType { name: string; price: number; description?: string }
interface BookingData {
  tour: {
    _id: string; title: string; slug: { current: string }
    price: number; mainImage?: any; category?: string
    meetingPoint?: string; guestTypes?: GuestType[]
  }
  date: string; time: string
  guestCounts: Record<string, number>
  totalPrice: number
}
interface CheckoutDrawerProps {
  bookingData: BookingData | null
  onClose: () => void
}

function CountdownTimer() {
  const [seconds, setSeconds] = useState(29 * 60 + 48)
  useEffect(() => {
    const t = setInterval(() => setSeconds(s => Math.max(0, s - 1)), 1000)
    return () => clearInterval(t)
  }, [])
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return (
    <div className="flex items-center gap-1.5 text-sm font-bold text-orange-600">
      <Timer className="w-4 h-4" />
      <span>{String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}</span>
    </div>
  )
}

function PaymentForm({ totalAmount, onSuccess }: { totalAmount: number; onSuccess: () => void }) {
  const stripe = useStripe()
  const elements = useElements()
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return
    setProcessing(true); setError('')
    const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: `${window.location.origin}/success` },
      redirect: 'if_required',
    })
    if (stripeError) { setError(stripeError.message || 'Payment failed'); setProcessing(false) }
    else if (paymentIntent?.status === 'succeeded') onSuccess()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement options={{ layout: 'tabs' }} />
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}
      <button type="submit" disabled={!stripe || processing}
        className="w-full py-4 bg-gray-950 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg text-sm">
        {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
        {processing ? 'Processing...' : `Pay €${totalAmount.toFixed(2)}`}
      </button>
      <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1">
        <Shield className="w-3 h-3" /> Secured by Stripe · 256-bit SSL
      </p>
    </form>
  )
}

export default function CheckoutDrawer({ bookingData, onClose }: CheckoutDrawerProps) {
  const site = useSite()
  const siteId = site?.slug?.current || process.env.NEXT_PUBLIC_SITE_ID || 'goldenrometour'

  const [step, setStep] = useState<1 | 2>(1)
  const [clientSecret, setClientSecret] = useState('')
  const [creatingIntent, setCreatingIntent] = useState(false)
  const [success, setSuccess] = useState(false)
  const [lead, setLead] = useState({ firstName: '', lastName: '', email: '', phone: '', notes: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const stripePromise = useMemo(() => {
    // Next.js inlines NEXT_PUBLIC_ vars at build time — must reference them explicitly
    const keyMap: Record<string, string> = {
      'wondersofrome': process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_WONDERSOFROME || '',
      'ticketsinrome': process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_ROME || process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_ROME_TOUR_TICKETS || '',
      'rome-tour-tickets': process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_ROME_TOUR_TICKETS || '',
      'goldenrometour': process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_GOLDENROMETOUR || '',
      'romanvaticantour': process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_ROMANVATICANTOUR || '',
      'romewander': process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_ROMEWANDER || '',
    };
    const key = keyMap[siteId] || process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';
    return key ? loadStripe(key) : null;
  }, [siteId])

  const totalGuests = useMemo(() =>
    Object.values(bookingData?.guestCounts || {}).reduce((s, c) => s + c, 0), [bookingData])

  const guestLines = useMemo(() => {
    if (!bookingData) return []
    return Object.entries(bookingData.guestCounts)
      .filter(([, c]) => c > 0)
      .map(([type, count]) => {
        const gt = bookingData.tour.guestTypes?.find(g => g.name === type)
        return { type, count, price: gt?.price ?? bookingData.tour.price }
      })
  }, [bookingData])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const validate = () => {
    const e: Record<string, string> = {}
    if (!lead.firstName.trim()) e.firstName = 'Required'
    if (!lead.lastName.trim()) e.lastName = 'Required'
    if (!lead.email.trim() || !/\S+@\S+\.\S+/.test(lead.email)) e.email = 'Valid email required'
    if (!lead.phone.trim()) e.phone = 'Required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const goToPayment = async () => {
    if (!validate() || !bookingData) return
    setCreatingIntent(true)
    try {
      const res = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-site-id': siteId },
        body: JSON.stringify({
          amount: bookingData.totalPrice,
          tourTitle: bookingData.tour.title,
          tourSlug: bookingData.tour.slug.current,
          meetingPoint: bookingData.tour.meetingPoint || '',
          date: bookingData.date, time: bookingData.time,
          guests: totalGuests, guestCounts: bookingData.guestCounts,
          bookingDetails: {
            leadTraveler: { firstName: lead.firstName, lastName: lead.lastName, email: lead.email, phone: lead.phone },
            marketing: { specialRequests: lead.notes },
          },
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed')
      setClientSecret(data.clientSecret)
      setStep(2)
    } catch (e: any) { setErrors({ submit: e.message }) }
    setCreatingIntent(false)
  }

  if (!bookingData) return null

  if (success) {
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div className="bg-white rounded-2xl p-10 max-w-sm w-full text-center shadow-2xl">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
          <p className="text-gray-500 mb-6">Confirmation sent to <strong>{lead.email}</strong></p>
          <button onClick={onClose} className="w-full py-3 bg-gray-950 text-white font-bold rounded-xl hover:bg-emerald-600 transition-colors">Done</button>
        </div>
      </div>
    )
  }

  const dateLabel = bookingData.date
    ? format(new Date(bookingData.date + 'T12:00:00'), 'EEEE, d MMMM yyyy')
    : ''

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <style>{`@keyframes popIn { from { opacity: 0; transform: scale(0.95) translateY(8px); } to { opacity: 1; transform: scale(1) translateY(0); } }`}</style>

      <div className="absolute inset-0" onClick={onClose} />

      <div
        className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        style={{ maxHeight: '90vh', animation: 'popIn 0.25s ease-out' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3">
            {step === 2 && (
              <button onClick={() => setStep(1)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
            )}
            <div>
              <h2 className="font-bold text-gray-900 text-lg leading-tight">
                {step === 1 ? 'Contact Details' : 'Secure Payment'}
              </h2>
              <p className="text-xs text-gray-400">Step {step} of 2</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <CountdownTimer />
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-0.5 bg-gray-100 shrink-0">
          <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: step === 1 ? '50%' : '100%' }} />
        </div>

        {/* Body */}
        <div className="flex flex-col md:flex-row overflow-y-auto flex-1 min-h-0">

          {/* Left: Form */}
          <div className="flex-1 p-6 space-y-5">

            {step === 1 && (
              <>
                <p className="text-xs font-semibold text-gray-400  tracking-wider">* Required Fields</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">First name *</label>
                    <input type="text" value={lead.firstName}
                      onChange={e => setLead(p => ({ ...p, firstName: e.target.value }))}
                      placeholder="John"
                      className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none ${errors.firstName ? 'border-red-400 bg-red-50' : 'border-gray-200'}`} />
                    {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Last name *</label>
                    <input type="text" value={lead.lastName}
                      onChange={e => setLead(p => ({ ...p, lastName: e.target.value }))}
                      placeholder="Doe"
                      className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none ${errors.lastName ? 'border-red-400 bg-red-50' : 'border-gray-200'}`} />
                    {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>}
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email *</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <input type="email" value={lead.email}
                        onChange={e => setLead(p => ({ ...p, email: e.target.value }))}
                        placeholder="john@example.com"
                        className={`w-full pl-9 pr-3 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none ${errors.email ? 'border-red-400 bg-red-50' : 'border-gray-200'}`} />
                    </div>
                    {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Mobile phone *</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <input type="tel" value={lead.phone}
                        onChange={e => setLead(p => ({ ...p, phone: e.target.value }))}
                        placeholder="+39 123 456 7890"
                        className={`w-full pl-9 pr-3 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none ${errors.phone ? 'border-red-400 bg-red-50' : 'border-gray-200'}`} />
                    </div>
                    {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Notes (optional)</label>
                    <textarea rows={2} value={lead.notes}
                      onChange={e => setLead(p => ({ ...p, notes: e.target.value }))}
                      placeholder="Special requests, accessibility needs..."
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none resize-none" />
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                  <Shield className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900 text-xs">Free cancellation up to 24h before</p>
                    <p className="text-xs text-gray-500 mt-0.5">Full refund if cancelled more than 24 hours before the tour starts.</p>
                  </div>
                </div>

                {errors.submit && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                    <AlertTriangle className="w-4 h-4 shrink-0" /> {errors.submit}
                  </div>
                )}

                <button onClick={goToPayment} disabled={creatingIntent}
                  className="w-full py-3.5 bg-gray-950 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-60 text-sm">
                  {creatingIntent ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {creatingIntent ? 'Preparing payment...' : 'Continue to Payment →'}
                </button>
              </>
            )}

            {step === 2 && (
              <>
                {!clientSecret ? (
                  <div className="flex items-center justify-center py-16">
                    <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
                  </div>
                ) : (
                  <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe', variables: { colorPrimary: '#059669' } } }}>
                    <PaymentForm totalAmount={bookingData.totalPrice} onSuccess={() => setSuccess(true)} />
                  </Elements>
                )}
              </>
            )}
          </div>

          {/* Right: Order Summary */}
          <div className="md:w-64 lg:w-72 bg-gray-50 border-t md:border-t-0 md:border-l border-gray-100 p-5 shrink-0">
            {bookingData.tour.mainImage && (
              <div className="relative w-full h-36 rounded-xl overflow-hidden mb-4">
                <Image src={urlFor(bookingData.tour.mainImage).width(400).height(200).url()}
                  alt={bookingData.tour.title} fill className="object-cover" />
              </div>
            )}

            <h3 className="font-bold text-gray-900 text-sm leading-snug mb-1">{bookingData.tour.title}</h3>
            {bookingData.tour.category && <p className="text-xs text-gray-500 mb-4">{bookingData.tour.category}</p>}

            <div className="space-y-2 mb-4">
              {dateLabel && (
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <span>{dateLabel}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span>{bookingData.time}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Users className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span>{totalGuests} {totalGuests === 1 ? 'guest' : 'guests'}</span>
              </div>
              {bookingData.tour.meetingPoint && (
                <div className="flex items-start gap-2 text-xs text-gray-600">
                  <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                  <span className="line-clamp-2">{bookingData.tour.meetingPoint}</span>
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 pt-3 space-y-1.5">
              {guestLines.map(({ type, count, price }) => (
                <div key={type} className="flex justify-between text-xs text-gray-600">
                  <span>{count}x {type}</span>
                  <span>€{(count * price).toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between font-bold text-gray-900 text-sm pt-2 border-t border-gray-200 mt-2">
                <span>Total Due</span>
                <span>€{bookingData.totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-1.5 mt-4 pt-4 border-t border-gray-100">
              {[
                { icon: Shield, text: 'Free cancellation 24h before' },
                { icon: Lock, text: 'Secure payment by Stripe' },
                { icon: Check, text: 'Instant confirmation email' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-xs text-gray-500">
                  <Icon className="w-3 h-3 text-emerald-500 shrink-0" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
