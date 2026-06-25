'use client';

import { useState, useEffect, useCallback } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { format, addMonths, isSameDay, isBefore, startOfDay } from 'date-fns';
import { Minus, Plus, Clock, Users, ChevronLeft, ChevronRight, ShieldCheck, Loader2 } from 'lucide-react';
import clsx from 'clsx';
import Button from '@/components/ui/Button';

const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_GOLDENROMETOUR || '';
const stripePromise = stripeKey ? loadStripe(stripeKey) : null;

/* ── Types ────────────────────────────────────────────────── */
interface GuestType {
  name: string;
  price: number;
  description?: string;
}

interface TimeSlot {
  time: string;
  available: number;
}

interface BookingPanelProps {
  tourId: string;
  tourTitle: string;
  tourSlug: string;
  basePrice: number;
  guestTypes: GuestType[];
}

/* ── Step 1: Date + Guests + Time ─────────────────────────── */
function BookingForm({ tourId, tourTitle, tourSlug, basePrice, guestTypes, onComplete }
  : BookingPanelProps & { onComplete: (data: any) => void }) {

  const today = startOfDay(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [counts, setCounts] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    guestTypes.forEach(g => { init[g.name] = g.name === 'Adult' ? 1 : 0; });
    return init;
  });
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [selectedTime, setSelectedTime] = useState('');
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const totalGuests = Object.values(counts).reduce((a, b) => a + b, 0);
  const totalPrice = guestTypes.reduce((sum, g) => sum + (counts[g.name] || 0) * g.price, 0);

  // Fetch slots when date changes
  const fetchSlots = useCallback(async (date: Date) => {
    setLoadingSlots(true);
    setError('');
    try {
      const res = await fetch(`/api/availability?slug=${tourSlug}&date=${format(date, 'yyyy-MM-dd')}&mode=day`);
      const data = await res.json();
      setSlots(data.slots || []);
    } catch {
      setError('Failed to load availability');
      setSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  }, [tourSlug]);

  useEffect(() => {
    if (selectedDate) {
      fetchSlots(selectedDate);
    }
  }, [selectedDate, fetchSlots]);

  // Calendar generation
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

  const handleBook = async () => {
    if (!selectedDate || !selectedTime || totalGuests === 0) return;
    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: totalPrice,
          tourTitle,
          tourSlug,
          date: format(selectedDate, 'yyyy-MM-dd'),
          time: selectedTime,
          guests: totalGuests,
          guestCounts: counts,
        }),
      });
      const data = await res.json();
      if (data.clientSecret) {
        onComplete({ clientSecret: data.clientSecret, paymentIntentId: data.paymentIntentId, date: selectedDate, time: selectedTime, totalPrice, guestCounts: counts });
      } else {
        setError(data.error || 'Payment setup failed');
      }
    } catch {
      setError('Payment setup failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="font-heading text-xl font-bold text-foreground">Book Your Tour</h3>

      {/* Date Picker */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">Select Date</label>
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          {/* Month nav */}
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => setCurrentMonth(m => new Date(m.getFullYear(), m.getMonth() - 1))} className="p-1 hover:bg-muted rounded"><ChevronLeft className="w-5 h-5" /></button>
            <span className="font-heading font-bold text-lg">{format(currentMonth, 'MMMM yyyy')}</span>
            <button onClick={() => setCurrentMonth(m => new Date(m.getFullYear(), m.getMonth() + 1))} className="p-1 hover:bg-muted rounded"><ChevronRight className="w-5 h-5" /></button>
          </div>
          {/* Day names */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-muted-foreground mb-2">
            {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(d => <div key={d}>{d}</div>)}
          </div>
          {/* Days */}
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: (firstDay + 6) % 7 }).map((_, i) => <div key={`e-${i}`} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
              const isPast = isBefore(date, today) && !isSameDay(date, today);
              const isSelected = selectedDate && isSameDay(date, selectedDate);
              const isSunday = date.getDay() === 0;
              return (
                <button
                  key={day}
                  disabled={isPast || isSunday}
                  onClick={() => setSelectedDate(date)}
                  className={clsx(
                    'p-2 rounded-lg text-sm font-medium transition-all',
                    isSelected && 'bg-primary text-white',
                    !isSelected && !isPast && !isSunday && 'hover:bg-muted text-foreground',
                    (isPast || isSunday) && 'text-muted-foreground/30 cursor-not-allowed',
                  )}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
        {selectedDate && (
          <p className="mt-2 text-sm text-muted-foreground">
            Selected: <span className="font-semibold text-foreground">{format(selectedDate, 'EEEE, MMMM d, yyyy')}</span>
          </p>
        )}
      </div>

      {/* Guest Selector */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
          <Users className="w-4 h-4 text-primary" /> Guests
        </label>
        <div className="space-y-3">
          {guestTypes.map((g) => (
            <div key={g.name} className="flex items-center justify-between bg-card border border-border rounded-lg p-3">
              <div>
                <p className="font-medium text-foreground text-sm">{g.name}</p>
                <p className="text-xs text-muted-foreground">€{g.price} each{g.description ? ` — ${g.description}` : ''}</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCounts(c => ({ ...c, [g.name]: Math.max(0, (c[g.name] || 0) - 1) }))}
                  className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
                  aria-label={`Decrease ${g.name}`}
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-6 text-center font-semibold text-sm">{counts[g.name] || 0}</span>
                <button
                  onClick={() => setCounts(c => ({ ...c, [g.name]: (c[g.name] || 0) + 1 }))}
                  className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
                  aria-label={`Increase ${g.name}`}
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Time Slots */}
      {selectedDate && (
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" /> Available Times
          </label>
          {loadingSlots ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading times...
            </div>
          ) : slots.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {slots.map((s) => (
                <button
                  key={s.time}
                  disabled={s.available === 0}
                  onClick={() => setSelectedTime(s.time)}
                  className={clsx(
                    'py-2.5 px-3 rounded-lg text-sm font-medium border transition-all',
                    selectedTime === s.time
                      ? 'bg-primary text-white border-primary'
                      : s.available > 0
                      ? 'bg-card border-border hover:border-primary text-foreground'
                      : 'bg-muted border-border text-muted-foreground opacity-40 cursor-not-allowed'
                  )}
                >
                  <div>{s.time}</div>
                  {s.available > 0 && (
                    <div className="text-[10px] text-muted-foreground mt-0.5">{s.available} left</div>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground py-4">No time slots available for this date.</p>
          )}
        </div>
      )}

      {/* Summary + CTA */}
      {totalGuests > 0 && selectedDate && selectedTime && (
        <div className="bg-secondary rounded-xl p-5 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-foreground font-medium">Total ({totalGuests} guest{totalGuests !== 1 ? 's' : ''})</span>
            <span className="text-2xl font-bold text-foreground font-heading">€{totalPrice}</span>
          </div>
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            onClick={handleBook}
            loading={submitting}
            disabled={submitting}
          >
            <ShieldCheck className="w-5 h-5" />
            Book Now — €{totalPrice}
          </Button>
          {error && <p className="text-destructive text-sm text-center">{error}</p>}
        </div>
      )}
    </div>
  );
}

/* ── Step 2: Stripe Payment ───────────────────────────────── */
function StripeCheckout({ clientSecret, onSuccess }: { clientSecret: string; onSuccess: (id: string) => void }) {
  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm onSuccess={onSuccess} />
    </Elements>
  );
}

function CheckoutForm({ onSuccess }: { onSuccess: (id: string) => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setError('');

    const { error: paymentError, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
      confirmParams: {
        return_url: `${window.location.origin}/success`,
      },
    });

    if (paymentError) {
      setError(paymentError.message || 'Payment failed');
      setProcessing(false);
    } else if (paymentIntent?.status === 'succeeded') {
      onSuccess(paymentIntent.id);
    } else {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h3 className="font-heading text-xl font-bold text-foreground">Payment</h3>
      <PaymentElement />
      {error && <p className="text-destructive text-sm">{error}</p>}
      <Button type="submit" variant="primary" size="lg" className="w-full" loading={processing} disabled={!stripe || processing}>
        <ShieldCheck className="w-5 h-5" />
        Pay Securely
      </Button>
      <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1">
        <ShieldCheck className="w-3 h-3" /> Secured by Stripe · Your data is encrypted
      </p>
    </form>
  );
}

/* ── Main BookingPanel ─────────────────────────────────────── */
export default function BookingPanel(props: BookingPanelProps) {
  const [step, setStep] = useState<'form' | 'payment' | 'done'>('form');
  const [paymentData, setPaymentData] = useState<any>(null);

  const handleFormComplete = (data: any) => {
    setPaymentData(data);
    setStep('payment');
  };

  const handlePaymentSuccess = async (paymentIntentId: string) => {
    // Send booking confirmation
    try {
      await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tourTitle: props.tourTitle,
          tourSlug: props.tourSlug,
          date: paymentData?.date ? format(paymentData.date, 'yyyy-MM-dd') : '',
          time: paymentData?.time || '',
          guests: paymentData?.totalPrice ? Math.round(paymentData.totalPrice / props.basePrice) : 1,
          guestCounts: paymentData?.guestCounts || {},
          price: paymentData?.totalPrice || 0,
          paymentIntentId,
          name: 'Traveler',
          email: '',
        }),
      });
    } catch { /* non-blocking */ }
    setStep('done');
  };

  if (step === 'done') {
    return (
      <div className="bg-card border border-border rounded-xl p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShieldCheck className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="font-heading text-2xl font-bold text-foreground mb-2">Booking Confirmed!</h3>
        <p className="text-muted-foreground mb-6">Check your email for your confirmation and tickets.</p>
        <a href="/success" className="text-primary font-semibold hover:underline">View booking details →</a>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-lg sticky top-24">
      {step === 'form' && <BookingForm {...props} onComplete={handleFormComplete} />}
      {step === 'payment' && paymentData && (
        <StripeCheckout clientSecret={paymentData.clientSecret} onSuccess={handlePaymentSuccess} />
      )}
    </div>
  );
}
