'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, Calendar, Clock, MapPin, Printer, ArrowRight, Loader2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

function SuccessContent() {
  const searchParams = useSearchParams();
  const paymentIntentId = searchParams.get('payment_intent');
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (paymentIntentId) {
      fetch(`/api/tickets/${paymentIntentId}`)
        .then((r) => r.json())
        .then((data) => data?.booking && setBooking(data.booking))
        .catch(() => {})
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [paymentIntentId]);

  return (
    <>
      {loading ? (
        <div className="bg-card rounded-2xl border border-border p-8 animate-pulse">
          <div className="h-4 bg-muted rounded w-3/4 mx-auto mb-4" />
          <div className="h-4 bg-muted rounded w-1/2 mx-auto" />
        </div>
      ) : booking ? (
        <div className="bg-card rounded-2xl border border-border p-8 shadow-sm text-left space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <h2 className="font-heading text-xl font-bold text-foreground">{booking.tour_title || 'Vatican Tour'}</h2>
            <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase">
              {booking.status || 'Confirmed'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-primary shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Date</p>
                <p className="font-semibold text-foreground">{booking.date || '-'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-primary shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Time</p>
                <p className="font-semibold text-foreground">{booking.time || '-'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-primary shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Meeting Point</p>
                <p className="font-semibold text-foreground text-sm">Via Germanico, 40, 00192 Roma</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Booking Ref</p>
              <p className="font-mono text-sm font-semibold text-foreground">
                {booking.id ? booking.id.slice(0, 8).toUpperCase() : (booking.payment_intent_id?.slice(0, 8) || 'N/A')}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-card rounded-2xl border border-border p-8 shadow-sm">
          <p className="text-muted-foreground">
            Your booking is being processed. You&apos;ll receive a confirmation email shortly.
          </p>
        </div>
      )}
    </>
  );
}

export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />

      <section className="pt-32 pb-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="w-10 h-10 text-green-600" />
          </div>

          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
            Booking Confirmed!
          </h1>
          <p className="text-muted-foreground text-lg mb-8">
            Your tour is booked and a confirmation email is on its way.
          </p>

          <Suspense fallback={
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          }>
            <SuccessContent />
          </Suspense>

          <div className="mt-8 bg-secondary rounded-xl p-6 text-left max-w-md mx-auto">
            <h3 className="font-semibold text-foreground mb-3">Important Reminders</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>✓ Arrive 25 minutes before your scheduled time</li>
              <li>✓ Bring a valid ID or passport</li>
              <li>✓ Shoulders and knees must be covered</li>
              <li>✓ Large bags and sharp objects are not allowed</li>
              <li>✓ Photography is prohibited inside the Sistine Chapel</li>
            </ul>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-6 py-3 bg-card border border-border rounded-lg font-medium text-foreground hover:bg-muted transition-colors"
            >
              <Printer className="w-4 h-4" /> Print Confirmation
            </button>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Back to Home <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
