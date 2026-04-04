'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, Check, ChevronRight, ChevronLeft, Shield, Lock, Star,
    Mail, User, Phone, Sparkles, AlertTriangle, Loader2,
    Calendar, Clock, Users, MapPin, Info, CreditCard, CheckCircle
} from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import PhoneInput from './PhoneInput';
import { format } from 'date-fns';
import { useSite } from './SiteProvider';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import Image from 'next/image';
import Link from 'next/link';

// ─── Types ──────────────────────────────────────────────────────────────────

interface GuestType {
    name: string;
    price: number;
    description?: string;
}

interface Tour {
    _id: string;
    title: string;
    slug: { current: string };
    price: number;
    duration?: string;
    mainImage?: any;
    category?: string;
    meetingPoint?: string;
    guestTypes?: GuestType[];
    maxParticipants?: number;
}

interface TimeSlot {
    time: string;
    available_slots: number;
}

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    tour: Tour;
    preSelectedDate?: string;
    preSelectedTime?: string;
    preGuestCounts?: Record<string, number>;
}

// ─── Stripe inner form ───────────────────────────────────────────────────────

function PaymentForm({ onSuccess, onBack, total }: { onSuccess: () => void; onBack: () => void; total: number }) {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState('');
    const [processing, setProcessing] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!stripe || !elements) return;
        setProcessing(true);
        setError('');
        const { error: submitError } = await stripe.confirmPayment({
            elements,
            confirmParams: { return_url: `${window.location.origin}/booking/success` },
        });
        if (submitError) {
            setError(submitError.message || 'Payment failed');
            setProcessing(false);
        } else {
            onSuccess();
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <PaymentElement />
            {error && (
                <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                    <AlertTriangle size={16} /> {error}
                </div>
            )}
            <div className="flex items-center justify-between gap-3 pt-2">
                <button type="button" onClick={onBack}
                    className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 transition-colors">
                    <ChevronLeft size={16} /> Back
                </button>
                <button
                    type="submit"
                    disabled={!stripe || processing}
                    className="flex-1 py-4 bg-[#1A1210] text-white font-black uppercase tracking-[0.2em] text-sm rounded-sm shadow-xl hover:bg-[#C9A84C] transition-colors duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    {processing ? <Loader2 className="animate-spin" size={18} /> : (
                        <><Lock size={16} /> Pay €{total}</>
                    )}
                </button>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                <Shield size={12} /> 256-bit SSL encryption · Powered by Stripe
            </div>
        </form>
    );
}

// ─── Main Modal ──────────────────────────────────────────────────────────────

export default function CheckoutModal({
    isOpen,
    onClose,
    tour,
    preSelectedDate = '',
    preSelectedTime = '',
    preGuestCounts = {},
}: CheckoutModalProps) {
    const site = useSite();
    const siteId = site?.slug?.current || 'rome-tour-tickets';
    const scrollRef = useRef<HTMLDivElement>(null);

    // ── Steps: 1=Contact, 2=Addons/Upsell, 3=Payment, 4=Success ──
    const [step, setStep] = useState(1);

    // ── Lead Traveler ──
    const [leadTraveler, setLeadTraveler] = useState({
        firstName: '', lastName: '', email: '', confirmEmail: '', phone: ''
    });

    // ── Guests ──
    const currentGuestTypes = useMemo(() => {
        if (tour.guestTypes && tour.guestTypes.length > 0) return tour.guestTypes;
        return [
            { name: 'Adult', price: tour.price, description: 'Age 18+' },
            { name: 'Student', price: Math.round(tour.price * 0.85), description: 'ID Required' },
            { name: 'Youth', price: Math.round(tour.price * 0.70), description: 'Under 18' },
            { name: 'Child', price: Math.round(tour.price * 0.50), description: 'Under 8' },
        ];
    }, [tour]);

    const [guests, setGuests] = useState<Array<{ name: string; type: string }>>([]);

    const totalGuests = Object.values(preGuestCounts).reduce((s, c) => s + (c || 0), 0);
    const baseTourTotal = currentGuestTypes.reduce(
        (sum, gt) => sum + (preGuestCounts[gt.name] || 0) * gt.price, 0
    );

    // Build guest list from preGuestCounts on open
    useEffect(() => {
        if (isOpen) {
            const list: { name: string; type: string }[] = [];
            Object.entries(preGuestCounts).forEach(([type, count]) => {
                for (let i = 0; i < (count as number); i++) list.push({ name: '', type });
            });
            setGuests(list);
            setStep(1);
        }
    }, [isOpen]);

    // ── Marketing ──
    const [marketing, setMarketing] = useState({ emailOptIn: true, specialRequests: '' });

    // ── Stripe ──
    const [clientSecret, setClientSecret] = useState('');
    const [stripePromise] = useState(() => {
        const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';
        return key ? loadStripe(key) : null;
    });

    // ── Related tours (upsell) ──
    const [relatedTours, setRelatedTours] = useState<Tour[]>([]);

    useEffect(() => {
        if (isOpen && tour.category) {
            client.fetch(
                `*[_type == "tour" && category == $cat && _id != $id && isActive == true][0...3]{_id,title,slug,price,duration,mainImage,category}`,
                { cat: tour.category, id: tour._id }
            ).then(setRelatedTours).catch(() => {});
        }
    }, [isOpen, tour]);

    // ── Validation ──
    const [validationError, setValidationError] = useState('');

    const validateStep1 = () => {
        if (!leadTraveler.firstName.trim() || !leadTraveler.lastName.trim()) {
            setValidationError('Please enter your full name'); return false;
        }
        if (!leadTraveler.email.trim()) {
            setValidationError('Please enter your email address'); return false;
        }
        if (leadTraveler.email !== leadTraveler.confirmEmail) {
            setValidationError('Email addresses do not match'); return false;
        }
        if (!leadTraveler.phone.trim()) {
            setValidationError('Please enter your phone number'); return false;
        }
        const missingNames = guests.some(g => !g.name.trim());
        if (missingNames) {
            setValidationError('Please provide names for all guests'); return false;
        }
        return true;
    };

    const createPaymentIntent = useCallback(async () => {
        try {
            const response = await fetch('/api/create-payment-intent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-site-id': siteId },
                body: JSON.stringify({
                    amount: baseTourTotal,
                    tourTitle: tour.title,
                    tourSlug: tour.slug.current,
                    meetingPoint: tour.meetingPoint || '',
                    date: preSelectedDate,
                    time: preSelectedTime,
                    guests: totalGuests,
                    guestCounts: preGuestCounts,
                    addOns: [],
                    bookingDetails: { leadTraveler, guests, marketing },
                }),
            });
            if (!response.ok) throw new Error('Failed to initialize payment');
            const data = await response.json();
            setClientSecret(data.clientSecret);
        } catch (e: any) {
            setValidationError(e.message || 'Payment initialization failed');
        }
    }, [tour, preSelectedDate, preSelectedTime, preGuestCounts, leadTraveler, guests, marketing, siteId, baseTourTotal, totalGuests]);

    const goToNext = () => {
        setValidationError('');
        if (step === 1) {
            if (!validateStep1()) return;
            setStep(2);
        } else if (step === 2) {
            setStep(3);
            createPaymentIntent();
        }
        // Scroll modal back to top
        setTimeout(() => scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' }), 50);
    };

    // Lock body scroll when modal open
    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    const STEPS = [
        { num: 1, label: 'Your Details' },
        { num: 2, label: 'Review' },
        { num: 3, label: 'Payment' },
    ];

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/70 backdrop-blur-md"
                />

                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 24 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 24 }}
                    transition={{ type: 'spring', damping: 28, stiffness: 380 }}
                    className="relative bg-[#F5F0E8] w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
                >
                    {/* ── Header ── */}
                    <div className="shrink-0 flex items-center justify-between px-6 py-5 bg-[#1A1210] text-white">
                        <div>
                            <p className="text-[10px] uppercase tracking-[0.3em] text-[#C9A84C] font-bold">Secure Booking</p>
                            <h2 className="text-lg font-serif font-bold leading-tight mt-0.5 line-clamp-1">{tour.title}</h2>
                        </div>
                        <button onClick={onClose}
                            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                            <X size={18} />
                        </button>
                    </div>

                    {/* ── Progress ── */}
                    {step < 4 && (
                        <div className="shrink-0 px-6 pt-5 pb-0 bg-[#F5F0E8]">
                            <div className="flex items-center gap-0">
                                {STEPS.map((s, i) => (
                                    <div key={s.num} className="flex items-center flex-1 last:flex-none">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-all ${step > s.num ? 'bg-[#C9A84C] text-white' : step === s.num ? 'bg-[#1A1210] text-white' : 'bg-gray-200 text-gray-400'}`}>
                                            {step > s.num ? <Check size={14} /> : s.num}
                                        </div>
                                        <span className={`ml-2 text-xs font-bold uppercase tracking-wide whitespace-nowrap transition-colors ${step >= s.num ? 'text-[#1A1210]' : 'text-gray-400'}`}>
                                            {s.label}
                                        </span>
                                        {i < STEPS.length - 1 && (
                                            <div className={`flex-1 h-0.5 mx-3 transition-colors ${step > s.num ? 'bg-[#C9A84C]' : 'bg-gray-200'}`} />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ── Booking Summary Strip ── */}
                    {step < 4 && (
                        <div className="shrink-0 mx-6 mt-4 bg-white rounded-xl p-4 flex items-center gap-4 border border-gray-100 shadow-sm">
                            {tour.mainImage ? (
                                <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0">
                                    <Image
                                        src={urlFor(tour.mainImage).width(112).height(112).url()}
                                        alt={tour.title}
                                        width={56} height={56}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="w-14 h-14 rounded-lg bg-gray-100 shrink-0 flex items-center justify-center">
                                    <MapPin size={20} className="text-gray-400" />
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-black text-gray-900 line-clamp-1">{tour.title}</p>
                                <div className="flex items-center gap-3 mt-1 flex-wrap">
                                    {preSelectedDate && (
                                        <span className="text-[11px] text-gray-500 flex items-center gap-1">
                                            <Calendar size={11} />
                                            {format(new Date(preSelectedDate), 'dd MMM yyyy')}
                                        </span>
                                    )}
                                    {preSelectedTime && (
                                        <span className="text-[11px] text-gray-500 flex items-center gap-1">
                                            <Clock size={11} /> {preSelectedTime}
                                        </span>
                                    )}
                                    {totalGuests > 0 && (
                                        <span className="text-[11px] text-gray-500 flex items-center gap-1">
                                            <Users size={11} /> {totalGuests} {totalGuests === 1 ? 'guest' : 'guests'}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="shrink-0 text-right">
                                <p className="text-[10px] text-gray-400 uppercase tracking-wide">Total</p>
                                <p className="text-xl font-black text-[#1A1210]">€{baseTourTotal}</p>
                            </div>
                        </div>
                    )}

                    {/* ── Body (scrollable) ── */}
                    <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 pb-6 space-y-5 mt-5">
                        {/* ── Step 1: Contact ── */}
                        {step === 1 && (
                            <div className="space-y-5">
                                {/* Lead Traveler */}
                                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                                    <h3 className="font-serif font-bold text-lg text-[#1A1210] mb-4 flex items-center gap-2">
                                        <User size={18} className="text-[#C9A84C]" /> Lead Traveler
                                    </h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1">First Name *</label>
                                            <input type="text" required placeholder="As on ID"
                                                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] outline-none transition-colors"
                                                value={leadTraveler.firstName}
                                                onChange={e => setLeadTraveler({ ...leadTraveler, firstName: e.target.value })} />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1">Last Name *</label>
                                            <input type="text" required placeholder="As on ID"
                                                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] outline-none transition-colors"
                                                value={leadTraveler.lastName}
                                                onChange={e => setLeadTraveler({ ...leadTraveler, lastName: e.target.value })} />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1">Email Address *</label>
                                            <div className="relative">
                                                <Mail size={15} className="absolute left-3 top-3 text-gray-400" />
                                                <input type="email" required placeholder="your@email.com"
                                                    className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] outline-none transition-colors"
                                                    value={leadTraveler.email}
                                                    onChange={e => setLeadTraveler({ ...leadTraveler, email: e.target.value })} />
                                            </div>
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1">Confirm Email *</label>
                                            <div className="relative">
                                                <Mail size={15} className="absolute left-3 top-3 text-gray-400" />
                                                <input type="email" required placeholder="Repeat email"
                                                    className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] outline-none transition-colors"
                                                    value={leadTraveler.confirmEmail}
                                                    onChange={e => setLeadTraveler({ ...leadTraveler, confirmEmail: e.target.value })} />
                                            </div>
                                        </div>
                                        <div className="col-span-2">
                                            <PhoneInput
                                                label="Phone Number *"
                                                value={leadTraveler.phone}
                                                onChange={val => setLeadTraveler({ ...leadTraveler, phone: val })}
                                                placeholder="234 567 890"
                                                required
                                                className="w-full"
                                            />
                                            <p className="text-xs text-gray-400 mt-1">For urgent tour updates only</p>
                                        </div>
                                    </div>

                                    <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-100 flex items-start gap-2">
                                        <Info size={14} className="text-amber-600 shrink-0 mt-0.5" />
                                        <p className="text-xs text-amber-700">Names must match your ID/Passport exactly for Vatican & Colosseum security checks.</p>
                                    </div>
                                </div>

                                {/* Guest Names */}
                                {guests.length > 0 && (
                                    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                                        <h3 className="font-serif font-bold text-lg text-[#1A1210] mb-4 flex items-center gap-2">
                                            <Users size={18} className="text-[#C9A84C]" /> Guest Names
                                        </h3>
                                        <div className="space-y-3">
                                            {guests.map((g, i) => (
                                                <div key={i} className="flex items-center gap-3">
                                                    <div className="w-7 h-7 rounded-full bg-[#F5F0E8] border border-[#C9A84C]/30 flex items-center justify-center text-xs font-black text-[#1A1210] shrink-0">
                                                        {i + 1}
                                                    </div>
                                                    <input type="text" required
                                                        placeholder={`${g.type} name as on ID`}
                                                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] outline-none transition-colors"
                                                        value={g.name}
                                                        onChange={e => {
                                                            const ng = [...guests];
                                                            ng[i].name = e.target.value;
                                                            setGuests(ng);
                                                        }} />
                                                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0 ${g.type === 'Adult' ? 'bg-blue-100 text-blue-700' : g.type === 'Student' ? 'bg-orange-100 text-orange-700' : 'bg-purple-100 text-purple-700'}`}>
                                                        {g.type}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Marketing */}
                                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                                    <div className="flex items-start gap-3">
                                        <input type="checkbox" id="emailOptIn"
                                            className="mt-0.5 w-4 h-4 accent-[#C9A84C]"
                                            checked={marketing.emailOptIn}
                                            onChange={e => setMarketing({ ...marketing, emailOptIn: e.target.checked })} />
                                        <div>
                                            <label htmlFor="emailOptIn" className="text-sm font-bold text-gray-900 cursor-pointer">
                                                Send me exclusive Rome travel tips & discounts
                                            </label>
                                            <p className="text-xs text-gray-500">Get 10% off your next booking!</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── Step 2: Review & Upsell ── */}
                        {step === 2 && (
                            <div className="space-y-5">
                                {/* Order Summary */}
                                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                                    <h3 className="font-serif font-bold text-lg text-[#1A1210] mb-4">Order Summary</h3>
                                    <div className="space-y-2">
                                        {currentGuestTypes.filter(gt => (preGuestCounts[gt.name] || 0) > 0).map(gt => (
                                            <div key={gt.name} className="flex justify-between text-sm">
                                                <span className="text-gray-700">{gt.name} × {preGuestCounts[gt.name]}</span>
                                                <span className="font-bold text-gray-900">€{gt.price * (preGuestCounts[gt.name] || 0)}</span>
                                            </div>
                                        ))}
                                        <div className="border-t border-gray-100 pt-3 mt-3 flex justify-between">
                                            <span className="font-black text-gray-900 uppercase tracking-wide text-sm">Total</span>
                                            <span className="font-black text-2xl text-[#1A1210]">€{baseTourTotal}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Special Requests */}
                                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                                    <h3 className="font-serif font-bold text-base text-[#1A1210] mb-3">Special Requests (Optional)</h3>
                                    <textarea
                                        rows={3}
                                        placeholder="Any dietary requirements, accessibility needs, or special occasions?"
                                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] outline-none transition-colors resize-none"
                                        value={marketing.specialRequests}
                                        onChange={e => setMarketing({ ...marketing, specialRequests: e.target.value })}
                                    />
                                </div>

                                {/* Related Tours Upsell */}
                                {relatedTours.length > 0 && (
                                    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                                        <h3 className="font-serif font-bold text-base text-[#1A1210] mb-1 flex items-center gap-2">
                                            <Sparkles size={16} className="text-[#C9A84C]" /> You Might Also Like
                                        </h3>
                                        <p className="text-xs text-gray-500 mb-4">Customers who booked this tour also loved:</p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {relatedTours.slice(0, 2).map((t: any) => (
                                                <Link key={t._id} href={`/tour/${t.slug.current}`} target="_blank"
                                                    className="flex items-center gap-3 p-3 bg-[#F5F0E8] rounded-lg hover:bg-[#F5F0E8]/80 transition group">
                                                    {t.mainImage ? (
                                                        <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0">
                                                            <Image src={urlFor(t.mainImage).width(96).height(96).url()} alt={t.title}
                                                                width={48} height={48} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                                        </div>
                                                    ) : (
                                                        <div className="w-12 h-12 rounded-lg bg-gray-100 shrink-0" />
                                                    )}
                                                    <div className="min-w-0">
                                                        <p className="text-xs font-black text-[#1A1210] line-clamp-2 leading-tight">{t.title}</p>
                                                        <p className="text-xs text-[#C9A84C] font-bold mt-1">From €{t.price}</p>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Free Cancellation */}
                                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-100">
                                    <CheckCircle size={20} className="text-green-600 shrink-0" />
                                    <div>
                                        <p className="text-sm font-black text-green-900">Free Cancellation</p>
                                        <p className="text-xs text-green-700">Full refund up to 24 hours before the tour</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── Step 3: Payment ── */}
                        {step === 3 && (
                            <div className="space-y-5">
                                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                                    <h3 className="font-serif font-bold text-lg text-[#1A1210] mb-4 flex items-center gap-2">
                                        <CreditCard size={18} className="text-[#C9A84C]" /> Payment Details
                                    </h3>
                                    {clientSecret && stripePromise ? (
                                        <Elements stripe={stripePromise} options={{
                                            clientSecret,
                                            appearance: {
                                                theme: 'stripe',
                                                variables: {
                                                    colorPrimary: '#C9A84C',
                                                    colorBackground: '#ffffff',
                                                    borderRadius: '8px',
                                                }
                                            }
                                        }}>
                                            <PaymentForm
                                                total={baseTourTotal}
                                                onSuccess={() => setStep(4)}
                                                onBack={() => setStep(2)}
                                            />
                                        </Elements>
                                    ) : (
                                        <div className="flex flex-col items-center py-10 gap-3">
                                            <Loader2 className="animate-spin text-[#C9A84C]" size={32} />
                                            <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">Initializing secure payment...</p>
                                        </div>
                                    )}
                                </div>

                                {/* Trust badges */}
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { icon: Lock, label: 'SSL Secured' },
                                        { icon: Shield, label: 'Stripe Protected' },
                                        { icon: Star, label: '4.9★ Rated' },
                                    ].map(({ icon: Icon, label }) => (
                                        <div key={label} className="bg-white rounded-xl p-3 flex flex-col items-center gap-1 border border-gray-100 shadow-sm">
                                            <Icon size={16} className="text-[#C9A84C]" />
                                            <p className="text-[10px] font-bold text-gray-600 text-center">{label}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ── Step 4: Success ── */}
                        {step === 4 && (
                            <div className="flex flex-col items-center py-10 text-center space-y-6">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                    className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center"
                                >
                                    <CheckCircle size={48} className="text-green-600" />
                                </motion.div>
                                <div>
                                    <h3 className="font-serif font-bold text-2xl text-[#1A1210] mb-2">Booking Confirmed!</h3>
                                    <p className="text-gray-600 text-sm">
                                        Thank you, {leadTraveler.firstName}! A confirmation email has been sent to {leadTraveler.email}.
                                    </p>
                                </div>
                                <div className="bg-[#F5F0E8] rounded-xl p-5 w-full text-left space-y-2">
                                    <p className="text-xs font-black uppercase tracking-wide text-gray-400">Booking Summary</p>
                                    <p className="font-bold text-[#1A1210]">{tour.title}</p>
                                    {preSelectedDate && <p className="text-sm text-gray-600">{format(new Date(preSelectedDate), 'EEEE, dd MMMM yyyy')} · {preSelectedTime}</p>}
                                    <p className="text-sm text-gray-600">{totalGuests} {totalGuests === 1 ? 'guest' : 'guests'} · €{baseTourTotal}</p>
                                </div>
                                <div className="flex gap-3 w-full">
                                    <button onClick={onClose}
                                        className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors">
                                        Close
                                    </button>
                                    <Link href="/" className="flex-1 py-3 bg-[#1A1210] text-white rounded-xl text-sm font-bold text-center hover:bg-[#C9A84C] transition-colors">
                                        Browse More Tours
                                    </Link>
                                </div>
                            </div>
                        )}

                        {/* ── Validation Error ── */}
                        {validationError && (
                            <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-100">
                                <AlertTriangle size={16} className="shrink-0" />
                                <span>{validationError}</span>
                            </div>
                        )}
                    </div>

                    {/* ── Footer CTA ── */}
                    {step < 3 && (
                        <div className="shrink-0 px-6 py-4 bg-white border-t border-gray-100">
                            <div className="flex items-center gap-3">
                                {step > 1 && (
                                    <button onClick={() => setStep(s => s - 1)}
                                        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 transition-colors px-4 py-3 rounded-xl border border-gray-200 hover:border-gray-300">
                                        <ChevronLeft size={16} /> Back
                                    </button>
                                )}
                                <button
                                    onClick={goToNext}
                                    className="flex-1 py-4 bg-[#1A1210] text-white font-black uppercase tracking-[0.2em] text-sm rounded-xl shadow-lg hover:bg-[#C9A84C] transition-colors duration-300 flex items-center justify-center gap-2"
                                >
                                    {step === 1 ? 'Continue' : step === 2 ? <>Proceed to Payment · €{baseTourTotal}</> : null}
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
