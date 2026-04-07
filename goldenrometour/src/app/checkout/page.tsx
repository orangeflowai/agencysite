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
import { urlFor } from '@/sanity/lib/image';
import PaymentLogos from '@/components/PaymentLogos';
import LoadingWithFacts from '@/components/LoadingWithFacts';
import TrustBadges from '@/components/TrustBadges';

// Site-specific Stripe keys
const getStripeKey = (siteId: string) => {
    if (siteId) { // use site-specific key if configured
        return process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_WONDERS || process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';
    }
    return process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_ROME || process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';
};

import { LucideIcon } from 'lucide-react';

// Icon mapping from Sanity string to Lucide component
const ICON_MAP: Record<string, LucideIcon> = {
    MapPin,
    Briefcase,
    Star,
    Sparkles,
    Utensils,
    Camera,
    Shield,
    User,
    Gift,
    Wifi,
    Wine,
};

interface Tour {
    _id: string;
    title: string;
    slug: { current: string };
    price: number;
    duration: string;
    mainImage?: { asset: { _ref: string; _type: string } };
    category?: string;
    meetingPoint?: string;
    guestTypes?: Array<{ name: string; price: number; description?: string }>;
}

interface GuestDetail {
    name: string;
    type: string;
}

// Types
interface BookingData {
    tour: Tour;
    date: string;
    time: string;
    guestCounts: Record<string, number>;
    totalPrice: number;
    guestDetails?: GuestDetail[];
}

interface AddOn {
    id: string;
    name: string;
    description: string;
    longDescription?: string;
    price: number;
    icon: string;
    pricingType: 'perPerson' | 'perBooking' | 'perHour';
    popular?: boolean;
    category?: string;
    image?: { asset: { _ref: string; _type: string } };
    minHours?: number;
    maxHours?: number;
}

const DEFAULT_ADDONS: AddOn[] = [
    {
        id: 'pickup',
        name: 'Hotel Pickup Service',
        description: 'Private transfer from your hotel to the meeting point. English-speaking driver.',
        price: 45,
        pricingType: 'perBooking',
        icon: 'MapPin',
        category: 'transport',
        popular: true,
    },
    {
        id: 'luggage',
        name: 'Luggage Storage',
        description: 'Secure, insured storage for your bags during the tour near the meeting point.',
        price: 12,
        pricingType: 'perBooking',
        icon: 'Briefcase',
        category: 'services',
        popular: true,
    },
    {
        id: 'priority',
        name: 'VIP Priority Access',
        description: 'Skip ALL lines including security. Direct entry with escort. Save 30+ minutes!',
        price: 35,
        pricingType: 'perBooking',
        icon: 'Star',
        category: 'experience',
        popular: true,
    },
    {
        id: 'lunch',
        name: 'Authentic Roman Lunch',
        description: '3-course lunch at a traditional Roman trattoria near the tour site. Includes wine!',
        price: 55,
        pricingType: 'perPerson',
        icon: 'Utensils',
        category: 'food',
        popular: true,
    },
    {
        id: 'photography',
        name: 'Professional Photo Package',
        description: 'Professional photographer captures your tour — 50+ edited photos delivered in 24h.',
        price: 149,
        pricingType: 'perBooking',
        icon: 'Camera',
        category: 'experience',
        popular: false,
    },
];

// Main Checkout Page Component
function CheckoutContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const site = useSite();
    const siteId = site?.slug?.current || process.env.NEXT_PUBLIC_SITE_ID || 'goldenrometour';

    // Get booking data from URL
    const [bookingData, setBookingData] = useState<BookingData | null>(null);
    const [clientSecret, setClientSecret] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Form states
    const [step, setStep] = useState(1);
    const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
    const [relatedTours, setRelatedTours] = useState<Tour[]>([]);

    // Add-ons from Sanity
    const [addons, setAddons] = useState<AddOn[]>([]);
    const [addonsLoading, setAddonsLoading] = useState(true);

    // Lead traveler
    const [leadTraveler, setLeadTraveler] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        confirmEmail: '',
    });

    // Guest details
    const [guests, setGuests] = useState<Array<{ name: string; type: string }>>([]);

    // Hourly add-ons configuration
    const [hourlyAddons, setHourlyAddons] = useState<Record<string, number>>({});

    // Marketing
    const [marketing, setMarketing] = useState({
        source: '',
        emailOptIn: true,
        smsOptIn: false,
        specialRequests: '',
    });

    // Helper functions
    const calculateTotal = useCallback(() => {
        if (!bookingData) return 0;
        const totalGuestsCount = Object.values(bookingData?.guestCounts || {}).reduce((sum, count) => sum + (count || 0), 0);
        const addOnsTotal = addons
            .filter(a => selectedAddOns.includes(a.id))
            .reduce((sum, a) => {
                let price = a.price;
                if (a.pricingType === 'perPerson') {
                    price = a.price * totalGuestsCount;
                } else if (a.pricingType === 'perHour') {
                    const hours = hourlyAddons[a.id] || a.minHours || 3;
                    price = a.price * hours;
                }
                return sum + price;
            }, 0);
        return bookingData.totalPrice + addOnsTotal;
    }, [bookingData, addons, selectedAddOns, hourlyAddons]);

    const getAddonPrice = useCallback((addon: AddOn) => {
        const totalGuestsCount = Object.values(bookingData?.guestCounts || {}).reduce((sum, count) => sum + (count || 0), 0);
        if (addon.pricingType === 'perPerson') {
            return addon.price * totalGuestsCount;
        } else if (addon.pricingType === 'perHour') {
            const hours = hourlyAddons[addon.id] || addon.minHours || 3;
            return addon.price * hours;
        }
        return addon.price;
    }, [bookingData, hourlyAddons]);

    const fetchRelatedTours = useCallback(async (category: string, excludeId: string) => {
        try {
            const query = `*[_type == "tour" && category == $category && _id != $excludeId && isActive == true][0...3] {
                _id, title, slug, price, duration, mainImage, category
            }`;
            const tours = await client.fetch(query, { category, excludeId });
            setRelatedTours(tours);
        } catch (e) {
            console.error('Failed to fetch related tours:', e);
        }
    }, []);

    const fetchAddOns = useCallback(async () => {
        try {
            setAddonsLoading(true);
            const response = await fetch(`/api/addons?site=${siteId}`);
            if (!response.ok) throw new Error('Failed to fetch add-ons');
            const data = await response.json();
            const fetchedAddons = data.addons || [];
            // Use defaults if API returned empty
            if (fetchedAddons.length === 0) {
                setAddons(DEFAULT_ADDONS);
            } else {
                // Ensure luggage is present
                if (!fetchedAddons.find((a: AddOn) => a.id === 'luggage')) {
                    fetchedAddons.push(DEFAULT_ADDONS.find(a => a.id === 'luggage')!);
                }
                setAddons(fetchedAddons);
            }
        } catch (e) {
            console.error('Failed to fetch add-ons:', e);
            // Fallback to defaults
            setAddons(DEFAULT_ADDONS);
        } finally {
            setAddonsLoading(false);
        }
    }, [siteId]);

    // Load booking data from URL and fetch related tours
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

            // Hydrate state from previous step (BookingWidget Modal)
            if (parsed.guestDetails) {
                const { leadTraveler: leadTravelerData, guests: guestDetails, marketing: marketingData } = parsed.guestDetails;

                if (leadTravelerData) setLeadTraveler(prev => ({ ...prev, ...leadTravelerData }));

                if (guestDetails) {
                    const mappedGuests = guestDetails.map((g: any) => ({
                        name: g.name,
                        type: g.type
                    }));
                    setGuests(mappedGuests);
                } else {
                    const newGuests: Array<{ name: string; type: string }> = [];
                    Object.entries(parsed.guestCounts).forEach(([type, count]) => {
                        for (let i = 0; i < (count as number); i++) {
                            newGuests.push({ name: '', type });
                        }
                    });
                    setGuests(newGuests);
                }

                if (marketingData) setMarketing(prev => ({ ...prev, ...marketingData }));

            } else {
                const newGuests: Array<{ name: string; type: string }> = [];
                Object.entries(parsed.guestCounts).forEach(([type, count]) => {
                    for (let i = 0; i < (count as number); i++) {
                        newGuests.push({ name: '', type });
                    }
                });
                setGuests(newGuests);
            }

            // Fetch related tours for upsell
            fetchRelatedTours(parsed.tour?.category, parsed.tour?._id);

            // Fetch add-ons from Sanity
            fetchAddOns();
        } catch {
            setError('Invalid booking data');
            setLoading(false);
        }
    }, [searchParams, fetchRelatedTours, fetchAddOns]);

    const createPaymentIntent = useCallback(async () => {
        const totalGuestsCount = Object.values(bookingData?.guestCounts || {}).reduce((sum, count) => sum + (count || 0), 0);

        const addOns = addons.filter(a => selectedAddOns.includes(a.id)).map(a => {
            let price = a.price;
            let quantity = 1;

            if (a.pricingType === 'perPerson') {
                quantity = totalGuestsCount;
                price = a.price * quantity;
            } else if (a.pricingType === 'perHour') {
                quantity = hourlyAddons[a.id] || a.minHours || 3;
                price = a.price * quantity;
            }

            return {
                name: a.name,
                price,
                quantity,
                pricingType: a.pricingType,
            };
        });

        try {
            const response = await fetch('/api/create-payment-intent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-site-id': siteId,
                },
                body: JSON.stringify({
                    amount: calculateTotal(),
                    tourTitle: bookingData!.tour.title,
                    tourSlug: bookingData!.tour.slug.current,
                    meetingPoint: bookingData!.tour.meetingPoint || '',
                    date: bookingData!.date,
                    time: bookingData!.time,
                    guests: totalGuestsCount,
                    guestCounts: bookingData!.guestCounts,
                    addOns,
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
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : 'Payment initialization failed');
        }
    }, [bookingData, addons, selectedAddOns, hourlyAddons, siteId, leadTraveler, guests, marketing, calculateTotal]);

    // Create payment intent when reaching payment step
    useEffect(() => {
        if (step === 3 && bookingData && !clientSecret) {
            createPaymentIntent();
        }
    }, [step, bookingData, clientSecret, createPaymentIntent]);

    const validateStep = () => {
        if (step === 1) {
            if (!leadTraveler.firstName || !leadTraveler.lastName || !leadTraveler.email || !leadTraveler.phone) {
                alert('Please fill in all lead traveler details');
                return false;
            }
            if (leadTraveler.email !== leadTraveler.confirmEmail) {
                alert('Email addresses do not match');
                return false;
            }
            const missingNames = guests.some(g => !g.name.trim());
            if (missingNames) {
                alert('Please provide names for all guests');
                return false;
            }
        }
        return true;
    };

    const nextStep = () => {
        if (validateStep()) setStep(s => Math.min(s + 1, 3));
    };

    const prevStep = () => setStep(s => Math.max(s - 1, 1));

    const toggleAddOn = (id: string) => {
        setSelectedAddOns(prev =>
            prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
        );
    };

    if (loading && !bookingData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading checkout...</p>
                </div>
            </div>
        );
    }

    if (error || !bookingData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
                    <AlertTriangle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h2>
                    <p className="text-gray-600 mb-6">{error || 'Booking data not found'}</p>
                    <Link href="/" className="inline-flex items-center gap-2 text-emerald-600 font-medium hover:underline">
                        <ArrowLeft className="w-4 h-4" /> Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    const totalGuests = Object.values(bookingData?.guestCounts || {}).reduce((sum, count) => sum + (count || 0), 0);
    const stripeKey = getStripeKey(siteId);
    const stripePromise = loadStripe(stripeKey);

    return (
        <div className="min-h-screen bg-gray-50 checkout-scope">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        {site?.logo ? (
                            <Image src={urlFor(site.logo).url()} alt={site.title} width={120} height={40} className="h-8 w-auto" />
                        ) : (
                            <span className="text-xl font-bold text-gray-900">{site?.title || 'Rome Tours'}</span>
                        )}
                    </Link>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Lock className="w-4 h-4" />
                        <span>Secure Checkout</span>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Forms */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Progress Steps */}
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between">
                                {[
                                    { num: 1, label: 'Contact & Guests' },
                                    { num: 2, label: 'Add-ons' },
                                    { num: 3, label: 'Payment' },
                                ].map((s, i) => (
                                    <div key={s.num} className="flex items-center">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${step >= s.num ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-400'
                                            }`}>
                                            {step > s.num ? <Check className="w-5 h-5" /> : s.num}
                                        </div>
                                        <span className={`ml-2 text-sm font-medium hidden sm:block ${step >= s.num ? 'text-gray-900' : 'text-gray-400'
                                            }`}>
                                            {s.label}
                                        </span>
                                        {i < 2 && <div className={`w-16 h-0.5 mx-3 ${step > s.num ? 'bg-emerald-600' : 'bg-gray-200'}`} />}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Step 1: Lead Traveler */}
                        {step === 1 && (
                            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <User className="w-5 h-5 text-emerald-600" />
                                    Lead Traveler Details
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            First Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                                            value={leadTraveler.firstName}
                                            onChange={e => setLeadTraveler({ ...leadTraveler, firstName: e.target.value })}
                                            placeholder="As shown on ID"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Last Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                                            value={leadTraveler.lastName}
                                            onChange={e => setLeadTraveler({ ...leadTraveler, lastName: e.target.value })}
                                            placeholder="As shown on ID"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Email Address <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                                            <input
                                                type="email"
                                                required
                                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                                                value={leadTraveler.email}
                                                onChange={e => setLeadTraveler({ ...leadTraveler, email: e.target.value })}
                                                placeholder="your@email.com"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Confirm Email <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                                            <input
                                                type="email"
                                                required
                                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                                                value={leadTraveler.confirmEmail || ''}
                                                onChange={e => setLeadTraveler({ ...leadTraveler, confirmEmail: e.target.value })}
                                                placeholder="Repeat email"
                                            />
                                        </div>
                                    </div>
                                    <div className="md:col-span-2">
                                        <PhoneInput
                                            label="Phone Number"
                                            value={leadTraveler.phone}
                                            onChange={(value) => setLeadTraveler({ ...leadTraveler, phone: value })}
                                            placeholder="234 567 890"
                                            required
                                            className="w-full"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">For urgent tour updates or emergencies</p>
                                    </div>
                                </div>

                                <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-100">
                                    <div className="flex items-start gap-3">
                                        <Info className="w-5 h-5 text-amber-600 mt-0.5" />
                                        <div>
                                            <p className="text-sm text-amber-800 font-medium">Important</p>
                                            <p className="text-sm text-amber-700">Names must match your ID/Passport exactly. Security checks are strict at Vatican and Colosseum.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Guest Names (merged into Step 1) */}
                        {step === 1 && guests.length > 0 && (
                            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <Users className="w-5 h-5 text-emerald-600" />
                                    Guest Names ({totalGuests})
                                </h2>

                                <div className="space-y-3">
                                    {guests.map((guest, idx) => (
                                        <div key={idx} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                            <div className="w-8 h-8 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold text-sm">
                                                {idx + 1}
                                            </div>
                                            <div className="flex-1">
                                                <input
                                                    type="text"
                                                    required
                                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                                                    value={guest.name}
                                                    onChange={e => {
                                                        const newGuests = [...guests];
                                                        newGuests[idx].name = e.target.value;
                                                        setGuests(newGuests);
                                                    }}
                                                    placeholder={`${guest.type} name as on ID`}
                                                />
                                            </div>
                                            <span className={`text-xs font-bold px-2 py-1 rounded ${guest.type === 'Adult' ? 'bg-blue-100 text-blue-700' :
                                                guest.type === 'Student' ? 'bg-orange-100 text-orange-700' :
                                                    'bg-purple-100 text-purple-700'
                                                }`}>
                                                {guest.type}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Step 3: Add-ons + Related Tours */}
                        {step === 2 && (
                            <div className="space-y-6">
                                {/* Add-ons - DISABLED: You can add your own add-ons through Sanity Studio */}
                                {/*
                                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                                    <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                                        <Sparkles className="w-5 h-5 text-emerald-600" />
                                        Enhance Your Experience
                                    </h2>
                                    <p className="text-gray-500 text-sm mb-6">Add these optional extras to make your tour even better</p>

                                    {addonsLoading ? (
                                        <div className="flex items-center justify-center py-8">
                                            <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                                        </div>
                                    ) : addons.length === 0 ? (
                                        <div className="text-center py-8 text-gray-500">
                                            <p>No add-ons available for this tour.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {addons.filter(a => a.id !== 'luggage').map(addon => {
                                                const Icon = ICON_MAP[addon.icon] || Sparkles;
                                                const isSelected = selectedAddOns.includes(addon.id);
                                                const displayPrice = getAddonPrice(addon);
                                                const selectedHours = hourlyAddons[addon.id] || addon.minHours || 3;

                                                return (
                                                    <div
                                                        key={addon.id}
                                                        className={`p-4 rounded-xl border-2 transition-all ${isSelected
                                                            ? 'border-emerald-500 bg-emerald-50'
                                                            : 'border-gray-200 hover:border-emerald-200'
                                                            }`}
                                                    >
                                                        <div
                                                            onClick={() => toggleAddOn(addon.id)}
                                                            className="flex items-start gap-4 cursor-pointer"
                                                        >
                                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${isSelected ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-600'
                                                                }`}>
                                                                {addon.image ? (
                                                                    <Image
                                                                        src={urlFor(addon.image).width(48).height(48).url()}
                                                                        alt={addon.name}
                                                                        width={48}
                                                                        height={48}
                                                                        className="w-full h-full object-cover rounded-xl"
                                                                    />
                                                                ) : (
                                                                    <Icon className="w-6 h-6" />
                                                                )}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center justify-between gap-2">
                                                                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                                                        {addon.name}
                                                                        {addon.popular && (
                                                                            <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">
                                                                                Popular
                                                                            </span>
                                                                        )}
                                                                    </h3>
                                                                    <span className="font-bold text-emerald-600 shrink-0">
                                                                        +€{displayPrice.toFixed(2)}
                                                                    </span>
                                                                </div>
                                                                <p className="text-sm text-gray-500 mt-1">{addon.description}</p>
                                                                <p className="text-xs text-gray-400 mt-1">
                                                                    {addon.pricingType === 'perPerson' && `€${addon.price} per person × ${totalGuests} guests`}
                                                                    {addon.pricingType === 'perHour' && `€${addon.price} per hour`}
                                                                    {addon.pricingType === 'perBooking' && `Flat rate`}
                                                                </p>
                                                            </div>
                                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${isSelected ? 'border-emerald-500 bg-emerald-500' : 'border-gray-300'
                                                                }`}>
                                                                {isSelected && <Check className="w-4 h-4 text-white" />}
                                                            </div>
                                                        </div>

                                                        {/* Hourly Pricing Selector *\/}
                                                        {isSelected && addon.pricingType === 'perHour' && (
                                                            <div className="mt-4 pt-4 border-t border-emerald-200" onClick={e => e.stopPropagation()}>
                                                                <div className="flex items-center justify-between mb-2">
                                                                    <span className="text-sm font-medium text-gray-700">Number of hours:</span>
                                                                    <span className="text-lg font-bold text-emerald-600">{selectedHours} hrs</span>
                                                                </div>
                                                                <input
                                                                    type="range"
                                                                    min={addon.minHours || 1}
                                                                    max={addon.maxHours || 12}
                                                                    step={1}
                                                                    value={selectedHours}
                                                                    onChange={(e) => {
                                                                        const hours = parseInt(e.target.value);
                                                                        setHourlyAddons(prev => ({ ...prev, [addon.id]: hours }));
                                                                    }}
                                                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                                                                />
                                                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                                                    <span>{addon.minHours || 1}h</span>
                                                                    <span>{addon.maxHours || 12}h</span>
                                                                </div>
                                                                <div className="mt-3 flex items-center justify-between bg-white rounded-lg p-3 border border-emerald-200">
                                                                    <span className="text-sm text-gray-600">Price for {selectedHours} hours:</span>
                                                                    <span className="text-lg font-bold text-emerald-600">€{(addon.price * selectedHours).toFixed(2)}</span>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                                */}

                                {/* Related Tours / Upsell */}
                                {relatedTours.length > 0 && (
                                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                                        <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                                            <Star className="w-5 h-5 text-amber-500" />
                                            You Might Also Like
                                        </h2>
                                        <p className="text-gray-500 text-sm mb-6">Customers who booked this tour also enjoyed these</p>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {relatedTours.map((tour: Tour) => (
                                                <Link
                                                    key={tour._id}
                                                    href={`/tour/${tour.slug.current}`}
                                                    className="group block border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                                                >
                                                    <div className="relative h-32 bg-gray-100">
                                                        {tour.mainImage && (
                                                            <Image
                                                                src={urlFor(tour.mainImage).width(400).height(200).url()}
                                                                alt={tour.title}
                                                                fill
                                                                className="object-cover group-hover:scale-105 transition-transform"
                                                            />
                                                        )}
                                                        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold">
                                                            €{tour.price}
                                                        </div>
                                                    </div>
                                                    <div className="p-4">
                                                        <h3 className="font-semibold text-gray-900 line-clamp-1">{tour.title}</h3>
                                                        <p className="text-xs text-gray-500 mt-1">{tour.duration}</p>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Marketing Preferences */}
                                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                                    <h2 className="text-lg font-bold text-gray-900 mb-4">Stay Connected</h2>

                                    <div className="space-y-3">
                                        <div className="flex items-start gap-3">
                                            <input
                                                type="checkbox"
                                                id="emailOptIn"
                                                className="mt-1 w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                                                checked={marketing.emailOptIn}
                                                onChange={e => setMarketing({ ...marketing, emailOptIn: e.target.checked })}
                                            />
                                            <div>
                                                <label htmlFor="emailOptIn" className="block text-sm font-medium text-gray-900">
                                                    Send me exclusive discounts and Rome travel tips
                                                </label>
                                                <p className="text-xs text-gray-500">Get 10% off your next booking!</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <input
                                                type="checkbox"
                                                id="smsOptIn"
                                                className="mt-1 w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                                                checked={marketing.smsOptIn}
                                                onChange={e => setMarketing({ ...marketing, smsOptIn: e.target.checked })}
                                            />
                                            <div>
                                                <label htmlFor="smsOptIn" className="block text-sm font-medium text-gray-900">
                                                    Send me SMS reminders about my tour
                                                </label>
                                                <p className="text-xs text-gray-500">24-hour reminder + meeting point details</p>
                                            </div>
                                        </div>


                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Special Requests / Notes
                                            </label>
                                            <textarea
                                                rows={3}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                                                value={marketing.specialRequests}
                                                onChange={e => setMarketing({ ...marketing, specialRequests: e.target.value })}
                                                placeholder="Any special requirements or questions for your guide..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Payment */}
                        {step === 3 && (
                            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <CreditCard className="w-5 h-5 text-emerald-600" />
                                    Secure Payment
                                </h2>

                                {!clientSecret ? (
                                    <div className="flex items-center justify-center py-12">
                                        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                ) : (
                                    <Elements stripe={stripePromise} options={{
                                        clientSecret,
                                        appearance: { theme: 'stripe' },
                                    }}>
                                        <PaymentForm
                                            totalAmount={calculateTotal()}
                                            onSuccess={(paymentIntentId) => router.push(`/success?payment_intent=${paymentIntentId}`)}
                                        />
                                    </Elements>
                                )}
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex items-center justify-between">
                            {step > 1 ? (
                                <button
                                    onClick={prevStep}
                                    className="px-6 py-3 text-gray-600 font-medium hover:text-gray-900 transition-colors"
                                >
                                    ← Back
                                </button>
                            ) : (
                                <Link
                                    href={`/tour/${bookingData.tour.slug.current}`}
                                    className="px-6 py-3 text-gray-600 font-medium hover:text-gray-900 transition-colors"
                                >
                                    ← Cancel
                                </Link>
                            )}

                            {step < 3 && (
                                <button
                                    onClick={nextStep}
                                    className="ml-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                                >
                                    Continue
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Enhanced Order Summary (Stripe-style) */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-4">
                            {/* Main Order Summary Card */}
                            <div className="bg-gray-50 rounded-xl p-6 shadow-sm border border-gray-200">
                                {/* Tour Header */}
                                <div className="flex gap-4 mb-6 pb-6 border-b border-gray-200">
                                    <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-white shrink-0 border border-gray-200">
                                        {bookingData.tour.mainImage ? (
                                            <Image
                                                src={urlFor(bookingData.tour.mainImage).width(200).height(200).url()}
                                                alt={bookingData.tour.title}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                                <Calendar className="w-8 h-8 text-gray-400" />
                                            </div>
                                        )}
                                        <div className="absolute top-1 left-1 bg-gray-900 text-white text-xs font-bold px-2 py-0.5 rounded">
                                            Tour
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-gray-900 text-lg leading-tight">{bookingData.tour.title}</h4>
                                        <div className="mt-2 space-y-1">
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Calendar className="w-4 h-4 text-gray-400" />
                                                {format(parseISO(bookingData.date), 'EEEE, MMMM d, yyyy')}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Clock className="w-4 h-4 text-gray-400" />
                                                {bookingData.time}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Users className="w-4 h-4 text-gray-400" />
                                                {totalGuests} guests ({Object.entries(bookingData.guestCounts)
                                                    .filter(([, count]) => count > 0)
                                                    .map(([type, count]) => `${count} ${type}`)
                                                    .join(', ')})
                                            </div>
                                            {bookingData.tour.meetingPoint && (
                                                <div className="flex flex-col gap-1 pt-1 mt-1 border-t border-gray-100">
                                                    <div className="flex items-start gap-2 text-sm text-gray-600">
                                                        <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                                                        <span className="leading-tight">{bookingData.tour.meetingPoint}</span>
                                                    </div>
                                                    <a
                                                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(bookingData.tour.meetingPoint + ' Rome')}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-xs text-emerald-600 font-bold hover:underline ml-6"
                                                    >
                                                        View on Map
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Pricing Breakdown */}
                                <div className="space-y-3">
                                    <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wide">Tour Price</h5>

                                    {Object.entries(bookingData.guestCounts).map(([type, count]) => {
                                        if (count <= 0) return null;
                                        const guestType = (bookingData.tour.guestTypes || []).find((gt: { name: string; price: number }) => gt.name === type);
                                        const typePrice = guestType?.price || bookingData.tour.price;

                                        return (
                                            <div key={type} className="flex justify-between items-center">
                                                <span className="text-sm text-gray-600">
                                                    {type} × {count}
                                                    <span className="text-gray-400 ml-1">@ €{typePrice} each</span>
                                                </span>
                                                <span className="text-sm font-medium text-gray-900">€{(count * typePrice).toFixed(2)}</span>
                                            </div>
                                        );
                                    })}

                                    <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                                        <span className="text-sm font-semibold text-gray-700">Subtotal</span>
                                        <span className="text-sm font-semibold text-gray-900">€{bookingData.totalPrice.toFixed(2)}</span>
                                    </div>
                                </div>

                                {/* Add-ons Breakdown */}
                                {selectedAddOns.length > 0 && (
                                    <div className="mt-6 pt-6 border-t border-gray-200">
                                        <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Add-ons & Extras</h5>
                                        <div className="space-y-3">
                                            {addons.filter(a => selectedAddOns.includes(a.id)).map(addon => {
                                                const price = getAddonPrice(addon);
                                                return (
                                                    <div key={addon.id} className="flex justify-between items-start">
                                                        <div className="flex-1">
                                                            <span className="text-sm text-gray-900 font-medium">{addon.name}</span>
                                                            <p className="text-xs text-gray-500 mt-0.5">
                                                                {addon.pricingType === 'perPerson' && `${totalGuests} person × €${addon.price}`}
                                                                {addon.pricingType === 'perHour' && `${hourlyAddons[addon.id] || addon.minHours || 3} hours × €${addon.price}/hr`}
                                                                {addon.pricingType === 'perBooking' && 'Flat rate'}
                                                            </p>
                                                        </div>
                                                        <span className="text-sm font-medium text-gray-900 ml-4">€{price.toFixed(2)}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        <div className="flex justify-between items-center pt-3 mt-3 border-t border-gray-200">
                                            <span className="text-sm font-semibold text-gray-700">Add-ons Subtotal</span>
                                            <span className="text-sm font-semibold text-gray-900">
                                                €{(calculateTotal() - bookingData.totalPrice).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Total */}
                                <div className="mt-6 pt-6 border-t-2 border-gray-300">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <span className="text-base font-bold text-gray-900">Total</span>
                                            <p className="text-xs text-gray-500">Including VAT & fees</p>
                                        </div>
                                        <span className="text-3xl font-bold text-emerald-600">€{calculateTotal().toFixed(2)}</span>
                                    </div>
                                </div>

                                {/* Cancellation info */}
                                <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                    <div className="flex items-start gap-2">
                                        <Check className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
                                        <div>
                                            <p className="text-sm text-gray-800 font-medium">Free cancellation</p>
                                            <p className="text-xs text-gray-500">Cancel up to 24 hours before for full refund</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Trust Badges */}
                            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-4">Secure Checkout</p>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                                            <Shield className="w-4 h-4 text-gray-600" />
                                            <span className="text-xs font-bold text-gray-700">SSL 256-bit</span>
                                        </div>
                                        <span className="text-xs text-gray-500">Encrypted</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                                            <Lock className="w-4 h-4 text-gray-600" />
                                            <span className="text-xs font-bold text-gray-700">PCI DSS</span>
                                        </div>
                                        <span className="text-xs text-gray-500">Compliant</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="bg-gray-900 px-3 py-2 rounded-lg">
                                            <span className="text-white text-xs font-bold tracking-wide">stripe</span>
                                        </div>
                                        <span className="text-xs text-gray-500">Powered by Stripe</span>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <p className="text-xs text-gray-400 mb-2">Accepted payments</p>
                                    <PaymentLogos size="sm" />
                                </div>
                            </div>

                            {/* Help Box */}
                            <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl p-5 text-white">
                                <p className="text-base font-bold">Need help?</p>
                                <p className="text-emerald-100 text-sm mt-1">Our team is available 7 days a week</p>
                                <a href={`tel:${(site?.contactPhone || '{process.env.NEXT_PUBLIC_SUPPORT_PHONE || ""}').replace(/\s/g, '')}`} className="flex items-center gap-2 mt-3 text-lg font-bold hover:underline">
                                    <Phone className="w-5 h-5" />
                                    {site?.contactPhone || '{process.env.NEXT_PUBLIC_SUPPORT_PHONE || ""}'}
                                </a>
                                <p className="text-emerald-200 text-xs mt-2">8am – 8pm Rome time (CET)</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

// Payment Form Component
function PaymentForm({ totalAmount, onSuccess }: {
    totalAmount: number;
    onSuccess: (paymentIntentId: string) => void;
}) {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [policyAccepted, setPolicyAccepted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) return;
        if (!policyAccepted) {
            setErrorMessage('Please accept our policies to continue.');
            return;
        }

        setIsProcessing(true);
        setErrorMessage('');

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/success`,
            },
            redirect: 'if_required',
        });

        if (error) {
            setErrorMessage(error.message || 'Payment failed');
            setIsProcessing(false);
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
            onSuccess(paymentIntent.id);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Policy Checkbox */}
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
                <div className="flex items-start gap-3">
                    <input
                        type="checkbox"
                        id="policyAcceptance"
                        className="mt-1 w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500 cursor-pointer"
                        checked={policyAccepted}
                        onChange={(e) => setPolicyAccepted(e.target.checked)}
                    />
                    <label htmlFor="policyAcceptance" className="text-sm text-gray-600 leading-relaxed cursor-pointer select-none">
                        I agree to the{' '}
                        <Link href="/terms-and-conditions" target="_blank" className="text-gray-900 font-semibold hover:underline">Terms & Conditions</Link>,{' '}
                        <Link href="/privacy-policy" target="_blank" className="text-gray-900 font-semibold hover:underline">Privacy Policy</Link>, and{' '}
                        <Link href="/cancellation-policy" target="_blank" className="text-gray-900 font-semibold hover:underline">Cancellation Policy</Link>.
                    </label>
                </div>
            </div>

            <PaymentElement
                options={{
                    layout: { type: 'tabs', defaultCollapsed: false },
                    paymentMethodOrder: ['card', 'paypal', 'apple_pay', 'revolut_pay', 'google_pay', 'klarna', 'link'],
                }}
            />

            {errorMessage && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    {errorMessage}
                </div>
            )}

            <button
                type="submit"
                disabled={!stripe || isProcessing || !policyAccepted}
                className={`w-full py-4 rounded-xl transition-all flex items-center justify-center gap-2 font-bold text-base ${
                    !stripe || isProcessing || !policyAccepted
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-200 active:scale-95'
                }`}
            >
                {isProcessing ? (
                    <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing...
                    </>
                ) : (
                    <>
                        <Lock className="w-5 h-5" />
                        Pay €{totalAmount.toFixed(2)} Securely
                    </>
                )}
            </button>

            <div className="flex items-center justify-center gap-2 text-gray-400 text-xs pt-2">
                <Lock className="w-3 h-3" />
                <span>Secured by Stripe · SSL encrypted · PCI DSS compliant</span>
            </div>
        </form>
    );
}

// Main page with Suspense
export default function CheckoutPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <LoadingWithFacts />
            </div>
        }>
            <CheckoutContent />
        </Suspense>
    );
}
