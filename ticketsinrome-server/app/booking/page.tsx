'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Header } from '@/components/header';
import { FooterSection } from '@/components/sections/footer-section';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Calendar, Clock, Users, ArrowLeft, ShieldCheck } from 'lucide-react';
import { format, parseISO } from 'date-fns';

export const dynamic = 'force-dynamic';

const bookingSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  specialRequests: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

function BookingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const tourSlug = searchParams.get('tour');
  const date = searchParams.get('date') || '';
  const time = searchParams.get('time') || '';
  
  const [tour, setTour] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Extract guest counts from params
  const guestCounts: Record<string, number> = {};
  searchParams.forEach((val, key) => {
    if (key.startsWith('guests_')) {
      const type = key.replace('guests_', '');
      guestCounts[type.charAt(0).toUpperCase() + type.slice(1)] = parseInt(val);
    }
  });

  const totalGuests = Object.values(guestCounts).reduce((a, b) => a + b, 0);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
  });

  useEffect(() => {
    const fetchTour = async () => {
      if (!tourSlug) {
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(`/api/tours/${tourSlug}`);
        if (response.ok) {
          const data = await response.json();
          setTour(data.tour);
        }
      } catch (err) {
        console.error('Failed to fetch tour:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTour();
  }, [tourSlug]);

  const onSubmit = async (data: BookingFormData) => {
    try {
      setSubmitting(true);
      setError(null);

      const bookingData = {
        tourTitle: tour?.title || 'Tour',
        tourSlug: tourSlug,
        date,
        time,
        guests: totalGuests,
        adults: guestCounts['Adult'] || 0,
        students: guestCounts['Student'] || 0,
        youths: guestCounts['Youth'] || 0,
        bookingDetails: {
          leadTraveler: data,
          guestCounts
        }
      };

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create checkout session');
      }

      if (result.url) {
        window.location.href = result.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Skeleton className="h-12 w-12 rounded-full" /></div>;
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
            <ArrowLeft size={16} />
            Back to tour
          </button>

          <h1 className="text-4xl font-bold mb-8">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left: Form */}
            <div className="lg:col-span-2 space-y-8">
              <Card className="p-8 border-border/60 shadow-sm">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Lead Traveler Details
                </h2>

                {error && (
                  <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-xl mb-6 text-sm">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" {...register('firstName')} placeholder="e.g. John" className="rounded-xl" />
                      {errors.firstName && <p className="text-destructive text-xs mt-1">{errors.firstName.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" {...register('lastName')} placeholder="e.g. Doe" className="rounded-xl" />
                      {errors.lastName && <p className="text-destructive text-xs mt-1">{errors.lastName.message}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" {...register('email')} placeholder="john@example.com" className="rounded-xl" />
                      {errors.email && <p className="text-destructive text-xs mt-1">{errors.email.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" type="tel" {...register('phone')} placeholder="+1 234 567 890" className="rounded-xl" />
                      {errors.phone && <p className="text-destructive text-xs mt-1">{errors.phone.message}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
                    <textarea
                      id="specialRequests"
                      {...register('specialRequests')}
                      placeholder="e.g. Accessibility needs, dietary requirements for food tours..."
                      className="w-full min-h-[100px] p-4 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary outline-none transition-all"
                    />
                  </div>

                  <div className="pt-4">
                    <Button type="submit" size="lg" className="w-full py-7 text-lg font-bold rounded-xl" disabled={submitting}>
                      {submitting ? 'Preparing Checkout...' : 'Secure Checkout with Stripe'}
                    </Button>
                    <p className="text-center text-xs text-muted-foreground mt-4 flex items-center justify-center gap-1">
                      <ShieldCheck size={14} className="text-green-600" />
                      Your payment information is encrypted and secure.
                    </p>
                  </div>
                </form>
              </Card>
            </div>

            {/* Right: Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <Card className="p-6 border-border/60 shadow-sm bg-muted/30">
                  <h3 className="text-lg font-bold mb-4">Booking Summary</h3>
                  
                  {tour && (
                    <div className="space-y-4">
                      <div className="pb-4 border-b border-border/60">
                        <h4 className="font-bold text-foreground leading-tight mb-2">{tour.title}</h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar size={14} />
                            {format(parseISO(date), 'EEEE, MMMM d, yyyy')}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock size={14} />
                            {time}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3 pb-4 border-b border-border/60">
                        {Object.entries(guestCounts).map(([type, count]) => (
                          <div key={type} className="flex justify-between text-sm">
                            <span className="text-muted-foreground">{count}x {type}</span>
                            <span className="font-medium">€{(count * (type === 'Student' ? (tour.studentPrice || tour.price * 0.85) : type === 'Youth' ? (tour.youthPrice || tour.price * 0.7) : tour.price)).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between items-center pt-2">
                        <span className="text-lg font-bold">Total</span>
                        <span className="text-2xl font-black text-primary">
                          €{(Object.entries(guestCounts).reduce((acc, [type, count]) => {
                            const p = type === 'Student' ? (tour.studentPrice || tour.price * 0.85) : type === 'Youth' ? (tour.youthPrice || tour.price * 0.7) : tour.price;
                            return acc + (count * p);
                          }, 0)).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}
                </Card>

                <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-5">
                   <h4 className="text-blue-900 font-bold text-sm mb-2">Flexible Cancellation</h4>
                   <p className="text-blue-800/80 text-xs leading-relaxed">
                     Change of plans? No problem. Cancel up to 24 hours before your tour starts for a full refund.
                   </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FooterSection />
    </main>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading booking details...</div>}>
      <BookingContent />
    </Suspense>
  );
}
