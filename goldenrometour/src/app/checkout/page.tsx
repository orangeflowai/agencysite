'use client';

import { useState, useEffect, Suspense, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import {
    Calendar, Clock, Users, MapPin, Briefcase, Mail, User, Phone,
    Check, ChevronRight, Shield, Star, AlertTriangle,
    Info, CreditCard, Lock, ArrowLeft, Sparkles, Utensils,
    Camera, Gift, Wifi, Wine
} from 'lucide-react';
import PhoneInput from '@/components/PhoneInput';
import Image from 'next/image';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import { useSite } from '@/components/SiteProvider';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/lib/dataAdapter';
import PaymentLogos from '@/components/PaymentLogos';
import LoadingWithFacts from '@/components/LoadingWithFacts';
import TrustBadges from '@/components/TrustBadges';

// Site-specific Stripe keys
const getStripeKey = (siteId: string) => {
    const suffix = siteId.toUpperCase().replace(/-/g, '_');
    return (
        process.env[`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_${suffix}`] ||
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
        ''
    );
};

interface Tour {
    _id: string;
    title: string;
    slug: { current: string };
    price: number;
    duration: string;
    mainImage?: any;
    category?: string;
    meetingPoint?: string;
    guestTypes?: Array<{ name: string; price: number; description?: string }>;
}

interface GuestDetail {
    name: string;
    type: string;
}

interface BookingData {
    tour: Tour;
    date: string;
    time: string;
    guestCounts: Record<string, number>;
    totalPrice: number;
    guestDetails?: GuestDetail[];
}

function CheckoutContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const site = useSite();
    const siteId = site?.slug?.current || process.env.NEXT_PUBLIC_SITE_ID || 'goldenrometour';

    const [bookingData, setBookingData] = useState<BookingData | null>(null);
    const [clientSecret, setClientSecret] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [step, setStep] = useState(1);

    const [leadTraveler, setLeadTraveler] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        confirmEmail: '',
    });

    const [guests, setGuests] = useState<Array<{ name: string; type: string }>>([]);
    const [marketing, setMarketing] = useState({
        source: '',
        emailOptIn: true,
        smsOptIn: false,
        specialRequests: '',
    });

    useEffect(() => {
        const data = searchParams.get('data');
        if (!data) {
            setError('No booking data found');
            setLoading(false);
            return;
        }

        try {
            const parsed = JSON.parse(decodeURIComponent(data));
            setBookingData(parsed);

            if (parsed.guestDetails) {
                const { leadTraveler: lt, guests: gs, marketing: mk } = parsed.guestDetails;
                if (lt) setLeadTraveler(prev => ({ ...prev, ...lt }));
                if (gs) setGuests(gs);
                if (mk) setMarketing(prev => ({ ...prev, ...mk }));
            } else {
                const newGuests: Array<{ name: string; type: string }> = [];
                Object.entries(parsed.guestCounts).forEach(([type, count]) => {
                    for (let i = 0; i < (count as number); i++) {
                        newGuests.push({ name: '', type });
                    }
                });
                setGuests(newGuests);
            }
        } catch {
            setError('Invalid booking data');
            setLoading(false);
        }
    }, [searchParams]);

    const createPaymentIntent = useCallback(async () => {
        try {
            const response = await fetch('/api/create-payment-intent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-site-id': siteId,
                },
                body: JSON.stringify({
                    amount: bookingData!.totalPrice,
                    tourTitle: bookingData!.tour.title,
                    tourSlug: bookingData!.tour.slug.current,
                    meetingPoint: bookingData!.tour.meetingPoint || '',
                    date: bookingData!.date,
                    time: bookingData!.time,
                    guests: Object.values(bookingData!.guestCounts).reduce((a, b) => a + (b || 0), 0),
                    guestCounts: bookingData!.guestCounts,
                    bookingDetails: {
                        leadTraveler,
                        guests,
                        marketing,
                    },
                }),
            });

            if (!response.ok) throw new Error('Failed to initialize payment');
            const data = await response.json();
            setClientSecret(data.clientSecret);
        } catch (e: any) {
            setError(e.message || 'Payment initialization failed');
        }
    }, [bookingData, siteId, leadTraveler, guests, marketing]);

    useEffect(() => {
        if (step === 3 && bookingData && !clientSecret) {
            createPaymentIntent();
        }
    }, [step, bookingData, clientSecret, createPaymentIntent]);

    if (error || !bookingData) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4 font-sans">
                <div className="bg-card rounded-3xl shadow-xl p-8 max-w-md w-full text-center border border-border">
                    <AlertTriangle className="w-16 h-16 text-accent mx-auto mb-4" />
                    <h2 className="text-xl font-serif font-bold text-foreground mb-2">Something went wrong</h2>
                    <p className="text-muted-foreground mb-6">{error || 'Booking data not found'}</p>
                    <Link href="/" className="inline-flex items-center gap-2 text-primary font-bold hover:underline">
                        <ArrowLeft className="w-4 h-4" /> Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    const totalGuests = Object.values(bookingData.guestCounts).reduce((a, b) => a + (b || 0), 0);
    const stripeKey = getStripeKey(siteId);
    const stripePromise = loadStripe(stripeKey);

    return (
        <div className="min-h-screen bg-background font-sans">
            {/* Header */}
            <header className="bg-card border-b border-border sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                            <span className="text-primary-foreground font-serif text-lg font-bold">G</span>
                        </div>
                        <span className="font-serif text-xl text-foreground font-bold">Golden Rome</span>
                    </Link>
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-full border border-border">
                        <Lock className="w-3 h-3 text-primary" />
                        <span>Secure Checkout</span>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-8">
                        {/* Progress Steps */}
                        <div className="flex items-center justify-between bg-card rounded-2xl p-6 border border-border shadow-sm">
                            {[
                                { num: 1, label: 'Guests' },
                                { num: 2, label: 'Add-ons' },
                                { num: 3, label: 'Payment' },
                            ].map((s, i) => (
                                <div key={s.num} className="flex items-center">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                                        step >= s.num ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'
                                    }`}>
                                        {step > s.num ? <Check className="w-4 h-4" /> : s.num}
                                    </div>
                                    <span className={`ml-3 text-xs font-bold uppercase tracking-widest ${
                                        step >= s.num ? 'text-foreground' : 'text-muted-foreground'
                                    }`}>
                                        {s.label}
                                    </span>
                                    {i < 2 && <div className={`w-12 h-px mx-4 ${step > s.num ? 'bg-primary' : 'bg-border'}`} />}
                                </div>
                            ))}
                        </div>

                        {step === 1 && (
                            <div className="space-y-8">
                                <div className="bg-card rounded-3xl p-8 border border-border shadow-sm">
                                    <h2 className="text-xl font-serif font-bold text-foreground mb-8 flex items-center gap-3 uppercase tracking-widest">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                            <User className="w-5 h-5 text-primary" />
                                        </div>
                                        Lead Traveler Details
                                    </h2>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">First Name</label>
                                            <input
                                                type="text"
                                                className="w-full px-5 py-4 bg-background border border-border rounded-2xl focus:ring-2 focus:ring-primary outline-none text-sm transition-all"
                                                value={leadTraveler.firstName}
                                                onChange={e => setLeadTraveler({ ...leadTraveler, firstName: e.target.value })}
                                                placeholder="John"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Last Name</label>
                                            <input
                                                type="text"
                                                className="w-full px-5 py-4 bg-background border border-border rounded-2xl focus:ring-2 focus:ring-primary outline-none text-sm transition-all"
                                                value={leadTraveler.lastName}
                                                onChange={e => setLeadTraveler({ ...leadTraveler, lastName: e.target.value })}
                                                placeholder="Doe"
                                            />
                                        </div>
                                        <div className="space-y-2 md:col-span-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Email Address</label>
                                            <input
                                                type="email"
                                                className="w-full px-5 py-4 bg-background border border-border rounded-2xl focus:ring-2 focus:ring-primary outline-none text-sm transition-all"
                                                value={leadTraveler.email}
                                                onChange={e => setLeadTraveler({ ...leadTraveler, email: e.target.value })}
                                                placeholder="john@example.com"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <PhoneInput
                                                label="Phone Number"
                                                value={leadTraveler.phone}
                                                onChange={(val) => setLeadTraveler({ ...leadTraveler, phone: val })}
                                                className="w-full"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-card rounded-3xl p-8 border border-border shadow-sm">
                                    <h2 className="text-xl font-serif font-bold text-foreground mb-8 flex items-center gap-3 uppercase tracking-widest">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                            <Users className="w-5 h-5 text-primary" />
                                        </div>
                                        Guest List
                                    </h2>
                                    <div className="space-y-4">
                                        {guests.map((guest, idx) => (
                                            <div key={idx} className="flex items-center gap-4 p-4 bg-secondary/30 rounded-2xl border border-border">
                                                <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs shrink-0">
                                                    {idx + 1}
                                                </div>
                                                <input
                                                    type="text"
                                                    className="flex-1 px-4 py-3 bg-background border border-border rounded-xl outline-none text-sm focus:ring-1 focus:ring-primary transition-all"
                                                    value={guest.name}
                                                    onChange={e => {
                                                        const newGuests = [...guests];
                                                        newGuests[idx].name = e.target.value;
                                                        setGuests(newGuests);
                                                    }}
                                                    placeholder={`${guest.type} Name`}
                                                />
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-accent bg-accent/10 px-3 py-1.5 rounded-full shrink-0">
                                                    {guest.type}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="bg-card rounded-3xl p-8 border border-border shadow-sm">
                                <h2 className="text-xl font-serif font-bold text-foreground mb-8 flex items-center gap-3 uppercase tracking-widest">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                        <CreditCard className="w-5 h-5 text-primary" />
                                    </div>
                                    Secure Payment
                                </h2>
                                {!clientSecret ? (
                                    <div className="flex flex-col items-center justify-center py-20 bg-secondary/20 rounded-2xl border-2 border-dashed border-border">
                                        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                                        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Initializing Security Protocol...</span>
                                    </div>
                                ) : (
                                    <Elements stripe={stripePromise} options={{ clientSecret }}>
                                        <PaymentForm totalAmount={bookingData.totalPrice} />
                                    </Elements>
                                )}
                            </div>
                        )}

                        <div className="flex items-center justify-between pt-4">
                            <button 
                                onClick={() => step > 1 ? setStep(step - 1) : router.back()}
                                className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all"
                            >
                                <ArrowLeft className="w-4 h-4" /> Back
                            </button>
                            {step < 3 && (
                                <button 
                                    onClick={() => setStep(step + 1)}
                                    className="px-10 py-5 bg-primary text-primary-foreground rounded-full font-bold uppercase tracking-widest text-xs shadow-xl shadow-primary/20 hover:opacity-90 transition-all flex items-center gap-3"
                                >
                                    Proceed to {step === 1 ? 'Add-ons' : 'Payment'}
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Sidebar Summary */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-32 space-y-6">
                            <div className="bg-secondary/40 backdrop-blur-md rounded-3xl p-8 border border-border shadow-xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl" />
                                
                                <h3 className="text-lg font-serif font-bold text-foreground mb-6 uppercase tracking-widest flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-primary" />
                                    Order Evaluation
                                </h3>

                                <div className="space-y-6">
                                    <div className="flex gap-4">
                                        <div className="w-20 h-20 rounded-2xl overflow-hidden bg-card border border-border shrink-0">
                                            {bookingData.tour.mainImage && (
                                                <img 
                                                    src={urlFor(bookingData.tour.mainImage).width(200).height(200).url()} 
                                                    alt={bookingData.tour.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm text-foreground line-clamp-2 uppercase leading-tight mb-2">{bookingData.tour.title}</h4>
                                            <div className="space-y-1.5">
                                                <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase">
                                                    <Calendar className="w-3 h-3" /> {format(parseISO(bookingData.date), 'MMM dd, yyyy')}
                                                </div>
                                                <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase">
                                                    <Clock className="w-3 h-3" /> {bookingData.time}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3 pt-6 border-t border-border">
                                        {Object.entries(bookingData.guestCounts).map(([type, count]) => (
                                            count > 0 && (
                                                <div key={type} className="flex justify-between text-xs font-bold uppercase tracking-widest">
                                                    <span className="text-muted-foreground">{count} × {type}</span>
                                                    <span className="text-foreground">€{(count * (bookingData.tour.guestTypes?.find(gt => gt.name === type)?.price || bookingData.tour.price)).toFixed(2)}</span>
                                                </div>
                                            )
                                        ))}
                                    </div>

                                    <div className="pt-6 border-t-2 border-border flex justify-between items-end">
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Total Valuation</span>
                                            <div className="text-4xl font-serif font-bold text-foreground tracking-tighter">€{bookingData.totalPrice.toFixed(2)}</div>
                                        </div>
                                        <div className="text-[10px] font-bold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-widest mb-2">EUR</div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-card rounded-2xl p-6 border border-border shadow-sm space-y-4">
                                <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                    <Shield className="w-5 h-5 text-accent" />
                                    <span>24h Revocation Protocol</span>
                                </div>
                                <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                    <Star className="w-5 h-5 text-primary" />
                                    <span>Verified Guest Archive</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function PaymentForm({ totalAmount }: { totalAmount: number }) {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);
    const [policyAccepted, setPolicyAccepted] = useState(false);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (!stripe || !elements || !policyAccepted) return;
        setIsProcessing(true);
        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: { return_url: `${window.location.origin}/success` },
        });
        if (error) setIsProcessing(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <PaymentElement options={{ layout: 'tabs' }} />
            
            <div className="p-5 bg-secondary/30 rounded-2xl border border-border flex items-start gap-4">
                <input 
                    type="checkbox" 
                    id="policy" 
                    className="mt-1 w-4 h-4 rounded text-primary focus:ring-primary cursor-pointer"
                    checked={policyAccepted}
                    onChange={e => setPolicyAccepted(e.target.checked)}
                />
                <label htmlFor="policy" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground leading-relaxed cursor-pointer select-none">
                    I acknowledge and agree to the <span className="text-foreground underline">Protocol Terms</span>, <span className="text-foreground underline">Privacy Directives</span>, and <span className="text-foreground underline">Revocation Policy</span>.
                </label>
            </div>

            <button
                type="submit"
                disabled={!stripe || isProcessing || !policyAccepted}
                className={`w-full py-6 rounded-full font-bold uppercase tracking-widest text-xs transition-all shadow-xl flex items-center justify-center gap-3 ${
                    !stripe || isProcessing || !policyAccepted 
                        ? 'bg-secondary text-muted-foreground cursor-not-allowed border border-border' 
                        : 'bg-primary text-primary-foreground hover:opacity-90 shadow-primary/20'
                }`}
            >
                {isProcessing ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : (
                    <>
                        <Lock className="w-4 h-4" />
                        Authorize Payment • €{totalAmount.toFixed(2)}
                    </>
                )}
            </button>
        </form>
    );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={<LoadingWithFacts />}>
            <CheckoutContent />
        </Suspense>
    );
}
