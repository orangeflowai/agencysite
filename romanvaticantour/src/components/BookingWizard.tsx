'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import {
  Calendar, Clock, Users, ChevronRight, ChevronLeft, Check, Lock, Shield,
  Star, MapPin, CheckCircle, XCircle, Info, Loader2, AlertTriangle,
  Mail, Phone, ArrowLeft, Zap, Award, Timer,
} from 'lucide-react';
import SmartCalendar from '@/components/ui/SmartCalendar';
import { getStripeKey } from '@/lib/stripeKeys';
import { useSite } from '@/components/SiteProvider';

/* ── Types ─────────────────────────────────────────── */
interface GuestType {
  name: string;
  price: number;
  description?: string;
}

interface TourData {
  _id: string;
  title: string;
  slug: { current: string };
  price: number;
  duration?: string;
  category?: string;
  rating?: number;
  reviewCount?: number;
  guestTypes?: GuestType[];
  meetingPoint?: string;
  itinerary?: Array<{ title: string; duration: string; description: string }>;
}

interface TimeSlot {
  time: string;
  available_slots: number;
}

interface BookingWizardProps {
  tour: TourData;
  imageUrl: string;
  description: string;
  features: string[];
  includes: string[];
  meetingPoint: string;
}

/* ── Sub-components ────────────────────────────────── */

function CountdownTimer({ onExpired }: { onExpired: () => void }) {
  const [s, setS] = useState(14 * 60 + 59);
  useEffect(() => {
    const t = setInterval(() => setS(prev => {
      if (prev <= 1) { clearInterval(t); onExpired(); return 0; }
      return prev - 1;
    }), 1000);
    return () => clearInterval(t);
  }, [onExpired]);
  const m = Math.floor(s / 60), sec = s % 60;
  return (
    <span className={`flex items-center gap-1.5 text-xs font-bold ${s < 120 ? 'text-red-500 animate-pulse' : 'text-amber-600'}`}>
      <Timer className="w-3.5 h-3.5" />
      {String(m).padStart(2, '0')}:{String(sec).padStart(2, '0')}
    </span>
  );
}

function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map(i => (
          <Star key={i} size={14} className={i <= Math.round(rating) ? 'fill-accent text-accent' : 'text-muted-foreground/30'} />
        ))}
      </div>
      <span className="text-sm font-bold text-foreground">{rating}</span>
      <span className="text-xs text-muted-foreground">({count} reviews)</span>
    </div>
  );
}

function PaymentForm({ totalAmount, onSuccess }: { totalAmount: number; onSuccess: (id: string) => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setProcessing(true); setError('');
    const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.origin + '/success' },
      redirect: 'if_required',
    });
    if (stripeError) { setError(stripeError.message || 'Payment failed'); setProcessing(false); }
    else if (paymentIntent?.status === 'succeeded') onSuccess(paymentIntent.id);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <PaymentElement options={{ layout: 'tabs' }} />
      {error && (
        <div className="flex items-center gap-2 p-4 bg-destructive/5 border border-destructive/20 rounded-xl text-sm text-destructive">
          <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}
      <button type="submit" disabled={!stripe || processing}
        className="w-full py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-primary/20 text-sm">
        {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
        {processing ? 'Processing...' : `Pay €${totalAmount.toFixed(2)}`}
      </button>
      <p className="text-center text-[10px] text-muted-foreground flex items-center justify-center gap-1 font-bold tracking-widest">
        <Shield className="w-3 h-3" /> SECURED BY STRIPE · 256-BIT SSL
      </p>
    </form>
  );
}

/* ── Main Component ────────────────────────────────── */

export default function BookingWizard({
  tour, imageUrl, description, features, includes, meetingPoint,
}: BookingWizardProps) {
  const router = useRouter();
  const site = useSite();
  const siteId = site?.slug?.current || process.env.NEXT_PUBLIC_SITE_ID || 'romanvaticantour';

  const stripePromise = useMemo(() => {
    const key = getStripeKey(siteId);
    return key ? loadStripe(key) : null;
  }, [siteId]);

  /* Guest types */
  const guestTypes: GuestType[] = useMemo(() => {
    if (tour.guestTypes?.length) return tour.guestTypes;
    return [
      { name: 'Adult', price: tour.price, description: 'Age 18+' },
      { name: 'Student', price: Math.round(tour.price * 0.85), description: 'ID Required' },
      { name: 'Youth', price: Math.round(tour.price * 0.7), description: 'Under 18' },
      { name: 'Child', price: Math.round(tour.price * 0.5), description: 'Under 8' },
    ];
  }, [tour]);

  /* State */
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [lead, setLead] = useState({ firstName: '', lastName: '', email: '', phone: '', notes: '' });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [clientSecret, setClientSecret] = useState('');
  const [creatingIntent, setCreatingIntent] = useState(false);
  const [globalError, setGlobalError] = useState('');

  /* Init guest counts */
  useEffect(() => {
    const initial: Record<string, number> = {};
    guestTypes.forEach((gt, i) => { initial[gt.name] = i === 0 ? 1 : 0; });
    setCounts(initial);
  }, [guestTypes]);

  /* Derived */
  const totalGuests = Object.values(counts).reduce((a, b) => a + b, 0);
  const totalPrice = guestTypes.reduce((s, gt) => s + (counts[gt.name] || 0) * gt.price, 0);
  const activeSlot = timeSlots.find(s => s.time === selectedTime);
  const maxSelectable = Math.min(activeSlot?.available_slots ?? Infinity, 50);
  const dateLabel = selectedDate ? format(new Date(selectedDate + 'T12:00:00'), 'EEEE, d MMMM yyyy') : '';

  /* Fetch time slots when date changes */
  useEffect(() => {
    if (!selectedDate) { setTimeSlots([]); return; }
    setLoadingSlots(true);
    setTimeSlots([]);
    setSelectedTime('');
    fetch(`/api/availability?slug=${tour.slug.current}&date=${selectedDate}`)
      .then(r => r.json())
      .then(d => setTimeSlots(d.slots || []))
      .catch(() => {})
      .finally(() => setLoadingSlots(false));
  }, [selectedDate, tour.slug.current]);

  /* Filter past slots for today */
  const visibleSlots = useMemo(() => {
    if (!selectedDate) return [];
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    if (selectedDate !== todayStr) return timeSlots;
    const now = new Date();
    return timeSlots.filter(slot => {
      const [h, m] = (slot.time || '').split(':').map(Number);
      if (isNaN(h)) return true;
      const slotDate = new Date(); slotDate.setHours(h, m || 0, 0, 0);
      return slotDate >= now;
    });
  }, [timeSlots, selectedDate]);

  /* Validation */
  const canProceedStep1 = selectedDate && selectedTime && totalGuests > 0;
  const canProceedStep2 = lead.firstName.trim() && lead.lastName.trim() && lead.email.trim() && /\S+@\S+\.\S+/.test(lead.email) && lead.phone.trim();

  const validateStep2 = () => {
    const e: Record<string, string> = {};
    if (!lead.firstName.trim()) e.firstName = 'Required';
    if (!lead.lastName.trim()) e.lastName = 'Required';
    if (!lead.email.trim() || !/\S+@\S+\.\S+/.test(lead.email)) e.email = 'Valid email required';
    if (!lead.phone.trim()) e.phone = 'Required';
    setFormErrors(e);
    return Object.keys(e).length === 0;
  };

  const goToPayment = async () => {
    if (!validateStep2()) return;
    setCreatingIntent(true); setGlobalError('');
    try {
      const res = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-site-id': siteId },
        body: JSON.stringify({
          amount: totalPrice,
          tourTitle: tour.title,
          tourSlug: tour.slug.current,
          meetingPoint: meetingPoint,
          date: selectedDate, time: selectedTime,
          guests: totalGuests, guestCounts: counts,
          bookingDetails: {
            leadTraveler: { firstName: lead.firstName, lastName: lead.lastName, email: lead.email, phone: lead.phone },
            marketing: { specialRequests: lead.notes },
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      setClientSecret(data.clientSecret);
      setStep(3);
    } catch (e: any) { setGlobalError(e.message); }
    setCreatingIntent(false);
  };

  const Stepper = ({ name, value, min = 0 }: { name: string; value: number; min?: number }) => (
    <div className="flex items-center gap-2">
      <button onClick={() => setCounts(p => ({ ...p, [name]: Math.max(min, (p[name] || 0) - 1) }))}
        disabled={value <= min}
        className="w-9 h-9 rounded-xl border-2 border-border/30 flex items-center justify-center text-muted-foreground hover:border-primary/50 hover:text-primary disabled:opacity-20 disabled:cursor-not-allowed transition-all active:scale-90">
        <span className="text-lg font-light">−</span>
      </button>
      <span className="w-5 text-center font-bold text-foreground text-lg">{value}</span>
      <button onClick={() => {
        const nextTotal = Object.values(counts).reduce((s, c) => s + c, 0) + 1;
        if (nextTotal > maxSelectable) return;
        setCounts(p => ({ ...p, [name]: Math.min(50, (p[name] || 0) + 1) }));
      }}
        disabled={Object.values(counts).reduce((s, c) => s + c, 0) >= maxSelectable}
        className="w-9 h-9 rounded-xl border-2 border-primary/30 flex items-center justify-center text-primary hover:bg-primary hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all active:scale-90">
        <span className="text-lg font-light">+</span>
      </button>
    </div>
  );

  return (
    <div className="min-h-[80vh]">
      {/* ── Hero Banner ── */}
      <div className="relative h-[40vh] md:h-[50vh] min-h-[320px] overflow-hidden">
        <Image src={imageUrl} alt={tour.title} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/60 via-foreground/30 to-background" />
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-6xl mx-auto w-full px-6 pb-8 md:pb-12">
            <button onClick={() => router.back()} className="inline-flex items-center gap-1.5 text-white/80 hover:text-white text-xs font-bold tracking-widest mb-4 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /> BACK
            </button>
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-white drop-shadow-lg leading-tight mb-3">
              Book {tour.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-white/90">
              {tour.rating && tour.reviewCount && <StarRating rating={tour.rating} count={tour.reviewCount} />}
              {tour.duration && <span className="flex items-center gap-1.5 text-xs font-bold tracking-widest"><Clock className="w-4 h-4" /> {tour.duration}</span>}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-20 -mt-6 relative z-10">
        {/* ── Progress Bar ── */}
        <div className="bg-card rounded-2xl shadow-xl border border-border/20 p-6 mb-8">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {[
              { num: 1, label: 'Date & Time', icon: Calendar },
              { num: 2, label: 'Your Details', icon: Users },
              { num: 3, label: 'Payment', icon: Lock },
            ].map((s, i) => (
              <div key={s.num} className="flex items-center">
                <div className="flex flex-col items-center gap-1">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    step > s.num ? 'bg-primary text-white' :
                    step === s.num ? 'bg-primary text-white shadow-lg shadow-primary/20' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    <s.icon size={18} />
                  </div>
                  <span className={`text-[10px] font-bold tracking-widest hidden sm:block ${
                    step >= s.num ? 'text-foreground' : 'text-muted-foreground'
                  }`}>{s.label}</span>
                </div>
                {i < 2 && (
                  <div className={`w-12 sm:w-24 h-0.5 mx-2 sm:mx-4 rounded-full transition-colors duration-300 ${
                    step > s.num ? 'bg-primary' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── Main Content ── */}
          <div className="lg:col-span-2 space-y-6">
            {globalError && (
              <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-xl text-sm text-destructive flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" /> {globalError}
              </div>
            )}

            {/* STEP 1: Date & Time */}
            {step === 1 && (
              <div className="bg-card rounded-2xl shadow-sm border border-border/20 p-6 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div>
                  <h2 className="text-xl font-serif font-bold text-foreground mb-1">Select Date & Time</h2>
                  <p className="text-xs text-muted-foreground font-medium">Choose your preferred date and available time slot</p>
                </div>

                <SmartCalendar
                  slug={tour.slug.current}
                  selectedDate={selectedDate ? new Date(selectedDate) : undefined}
                  onSelect={(d) => setSelectedDate(d ? format(d, 'yyyy-MM-dd') : '')}
                  basePrice={tour.price}
                />

                {selectedDate && (
                  <div className="animate-in fade-in duration-300">
                    <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary" /> Available Times · {dateLabel}
                    </h3>
                    {loadingSlots ? (
                      <div className="flex items-center justify-center py-10 bg-muted/30 rounded-2xl">
                        <Loader2 className="w-6 h-6 animate-spin text-primary" />
                      </div>
                    ) : visibleSlots.length > 0 ? (
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                        {visibleSlots.map(slot => (
                          <button key={slot.time}
                            onClick={() => setSelectedTime(slot.time)}
                            disabled={slot.available_slots === 0}
                            className={`py-4 px-3 text-sm font-bold rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-1
                              ${selectedTime === slot.time
                                ? 'bg-primary text-white border-primary shadow-lg shadow-primary/10 scale-[1.03]'
                                : 'bg-card hover:border-primary/30 border-border/20'
                              }
                              ${slot.available_slots === 0 ? 'opacity-25 cursor-not-allowed' : ''}`}
                          >
                            <span className="text-base font-serif">{slot.time}</span>
                            {slot.available_slots < 5 && slot.available_slots > 0 && (
                              <span className={`text-[10px] font-bold ${selectedTime === slot.time ? 'text-white/70' : 'text-accent'}`}>
                                {slot.available_slots} left
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-10 bg-muted/30 rounded-2xl">
                        <AlertTriangle className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground font-medium">No available slots for this date</p>
                      </div>
                    )}
                  </div>
                )}

                <button onClick={() => { if (canProceedStep1) setStep(2); else setGlobalError('Please select a date, time, and at least 1 guest.'); }}
                  className="w-full py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/10 text-sm">
                  Continue <ChevronRight size={18} />
                </button>
              </div>
            )}

            {/* STEP 2: Guests & Details */}
            {step === 2 && (
              <div className="bg-card rounded-2xl shadow-sm border border-border/20 p-6 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="flex items-center gap-3">
                  <button onClick={() => setStep(1)} className="p-2 hover:bg-muted rounded-xl transition-colors">
                    <ChevronLeft className="w-5 h-5 text-muted-foreground" />
                  </button>
                  <div>
                    <h2 className="text-xl font-serif font-bold text-foreground">Guests & Contact</h2>
                    <p className="text-xs text-muted-foreground font-medium">{dateLabel} at {selectedTime} · {totalGuests} guest{totalGuests !== 1 ? 's' : ''}</p>
                  </div>
                  <div className="ml-auto">
                    <CountdownTimer onExpired={() => setGlobalError('Session expired. Please restart.')} />
                  </div>
                </div>

                {/* Guest Selection */}
                <div>
                  <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" /> Guests
                  </h3>
                  <div className="space-y-3">
                    {guestTypes.map(gt => (
                      <div key={gt.name} className="flex items-center justify-between p-4 bg-muted/20 rounded-2xl border border-border/10 hover:border-primary/20 transition-colors">
                        <div>
                          <span className="text-sm font-bold text-foreground">{gt.name}</span>
                          {gt.description && <span className="text-[10px] text-muted-foreground block mt-0.5">{gt.description}</span>}
                          <span className="text-xs font-bold text-primary mt-1 block">€{gt.price} / person</span>
                        </div>
                        <Stepper name={gt.name} value={counts[gt.name] || 0} min={gt.name === 'Adult' ? 1 : 0} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact Form */}
                <div>
                  <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-primary" /> Contact Details
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-foreground mb-1.5">First Name *</label>
                      <input type="text" value={lead.firstName}
                        onChange={e => setLead(p => ({ ...p, firstName: e.target.value }))}
                        placeholder="John"
                        className={`w-full px-4 py-3 rounded-xl border-2 text-sm focus:outline-none transition-colors ${
                          formErrors.firstName ? 'border-destructive bg-destructive/5' : 'border-border/30 focus:border-primary'
                        }`} />
                      {formErrors.firstName && <p className="text-xs text-destructive mt-1">{formErrors.firstName}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-foreground mb-1.5">Last Name *</label>
                      <input type="text" value={lead.lastName}
                        onChange={e => setLead(p => ({ ...p, lastName: e.target.value }))}
                        placeholder="Doe"
                        className={`w-full px-4 py-3 rounded-xl border-2 text-sm focus:outline-none transition-colors ${
                          formErrors.lastName ? 'border-destructive bg-destructive/5' : 'border-border/30 focus:border-primary'
                        }`} />
                      {formErrors.lastName && <p className="text-xs text-destructive mt-1">{formErrors.lastName}</p>}
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-bold text-foreground mb-1.5">Email *</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-3.5 w-4 h-4 text-muted-foreground" />
                        <input type="email" value={lead.email}
                          onChange={e => setLead(p => ({ ...p, email: e.target.value }))}
                          placeholder="john@example.com"
                          className={`w-full pl-11 pr-4 py-3 rounded-xl border-2 text-sm focus:outline-none transition-colors ${
                            formErrors.email ? 'border-destructive bg-destructive/5' : 'border-border/30 focus:border-primary'
                          }`} />
                      </div>
                      {formErrors.email && <p className="text-xs text-destructive mt-1">{formErrors.email}</p>}
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-bold text-foreground mb-1.5">Mobile Phone *</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-3.5 w-4 h-4 text-muted-foreground" />
                        <input type="tel" value={lead.phone}
                          onChange={e => setLead(p => ({ ...p, phone: e.target.value }))}
                          placeholder="+39 123 456 7890"
                          className={`w-full pl-11 pr-4 py-3 rounded-xl border-2 text-sm focus:outline-none transition-colors ${
                            formErrors.phone ? 'border-destructive bg-destructive/5' : 'border-border/30 focus:border-primary'
                          }`} />
                      </div>
                      {formErrors.phone && <p className="text-xs text-destructive mt-1">{formErrors.phone}</p>}
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-bold text-foreground mb-1.5">Special Requests (optional)</label>
                      <textarea rows={3} value={lead.notes}
                        onChange={e => setLead(p => ({ ...p, notes: e.target.value }))}
                        placeholder="Accessibility needs, dietary requirements, special occasions..."
                        className="w-full px-4 py-3 rounded-xl border-2 border-border/30 text-sm focus:outline-none focus:border-primary transition-colors resize-none" />
                    </div>
                  </div>
                </div>

                <button onClick={goToPayment} disabled={creatingIntent || !canProceedStep2}
                  className="w-full py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/10 text-sm disabled:opacity-50">
                  {creatingIntent ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                  {creatingIntent ? 'Preparing Payment...' : 'Continue to Payment'}
                </button>
              </div>
            )}

            {/* STEP 3: Payment */}
            {step === 3 && (
              <div className="bg-card rounded-2xl shadow-sm border border-border/20 p-6 md:p-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="flex items-center gap-3">
                  <button onClick={() => setStep(2)} className="p-2 hover:bg-muted rounded-xl transition-colors">
                    <ChevronLeft className="w-5 h-5 text-muted-foreground" />
                  </button>
                  <div>
                    <h2 className="text-xl font-serif font-bold text-foreground">Secure Payment</h2>
                    <p className="text-xs text-muted-foreground font-medium">Your payment is encrypted and secure</p>
                  </div>
                  <div className="ml-auto">
                    <CountdownTimer onExpired={() => setGlobalError('Session expired. Please restart.')} />
                  </div>
                </div>

                {!clientSecret ? (
                  <div className="flex items-center justify-center py-16">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe', variables: { colorPrimary: '#8B1A1A' } } }}>
                    <PaymentForm totalAmount={totalPrice} onSuccess={(piId) => router.push(`/success?payment_intent=${piId}`)} />
                  </Elements>
                )}
              </div>
            )}
          </div>

          {/* ── Sidebar ── */}
          <div className="space-y-6">
            {/* Tour Summary Card */}
            <div className="bg-card rounded-2xl shadow-sm border border-border/20 overflow-hidden sticky top-24">
              <div className="relative h-48">
                <Image src={imageUrl} alt={tour.title} fill className="object-cover" />
                <div className="absolute top-3 left-3">
                  <span className="bg-primary text-white text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-full">
                    {tour.category?.toUpperCase() || 'ROME'}
                  </span>
                </div>
              </div>

              <div className="p-5 space-y-4">
                <h3 className="font-serif font-bold text-foreground leading-snug">{tour.title}</h3>

                {/* Price */}
                <div className="bg-muted/30 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-bold text-muted-foreground tracking-widest">PRICE BREAKDOWN</span>
                    <span className="text-2xl font-serif font-bold text-foreground">€{totalPrice}</span>
                  </div>
                  {guestTypes.filter(gt => (counts[gt.name] || 0) > 0).map(gt => (
                    <div key={gt.name} className="flex justify-between text-sm py-1.5 border-t border-border/10">
                      <span className="text-muted-foreground">{counts[gt.name]}× {gt.name}</span>
                      <span className="font-medium text-foreground">€{gt.price * (counts[gt.name] || 0)}</span>
                    </div>
                  ))}
                </div>

                {/* Booking Details */}
                {selectedDate && (
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4 text-primary shrink-0" />
                      <span>{dateLabel}</span>
                    </div>
                    {selectedTime && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="w-4 h-4 text-primary shrink-0" />
                        <span>{selectedTime} · {tour.duration}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="w-4 h-4 text-primary shrink-0" />
                      <span>{totalGuests} Guest{totalGuests !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                )}

                {/* What's Included */}
                {includes.length > 0 && (
                  <div className="border-t border-border/10 pt-4">
                    <h4 className="text-xs font-bold text-foreground tracking-widest mb-2 flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-primary" /> WHAT&apos;S INCLUDED
                    </h4>
                    <ul className="space-y-1.5">
                      {includes.slice(0, 5).map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                          <Check className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Features */}
                {features.length > 0 && (
                  <div className="border-t border-border/10 pt-4">
                    <h4 className="text-xs font-bold text-foreground tracking-widest mb-2 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-accent" /> HIGHLIGHTS
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {features.slice(0, 4).map((f, i) => (
                        <span key={i} className="text-[10px] font-medium px-2 py-1 rounded-full bg-primary/5 text-primary border border-primary/10">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Meeting Point */}
                {meetingPoint && (
                  <div className="border-t border-border/10 pt-4">
                    <h4 className="text-xs font-bold text-foreground tracking-widest mb-2 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-primary" /> MEETING POINT
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{meetingPoint}</p>
                    <a href={`https://maps.google.com/?q=${encodeURIComponent(meetingPoint + ' Rome')}`}
                      target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[10px] font-bold text-primary tracking-widest mt-2 hover:underline">
                      View on Map →
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Zap, label: 'Skip the Line', sub: 'Priority Access' },
                { icon: Shield, label: 'Free Cancellation', sub: 'Up to 24h before' },
                { icon: Award, label: 'Expert Guides', sub: 'Licensed & Certified' },
                { icon: Lock, label: 'Secure Booking', sub: 'SSL Encrypted' },
              ].map(b => (
                <div key={b.label} className="bg-card rounded-xl border border-border/10 p-3 text-center">
                  <b.icon size={16} className="text-primary mx-auto mb-1" />
                  <p className="text-[10px] font-bold text-foreground tracking-widest">{b.label}</p>
                  <p className="text-[8px] text-muted-foreground mt-0.5">{b.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
