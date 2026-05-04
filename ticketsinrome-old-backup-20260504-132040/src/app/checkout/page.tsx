'use client';

import { useState, useEffect, Suspense } from 'react';
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
import { urlFor } from '@/lib/dataAdapter';
import PaymentLogos from '@/components/PaymentLogos';
import LoadingWithFacts from '@/components/LoadingWithFacts';
import TrustBadges from '@/components/TrustBadges';

// Site-specific Stripe keys
const getStripeKey = (siteId: string) => {
    if (siteId === 'wondersofrome') {
        return process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_WONDERS || process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';
    }
    return process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_ROME || process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';
};

// Icon mapping from Sanity string to Lucide component
const ICON_MAP: Record<string, any> = {
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

// Types
interface BookingData {
    tour: any;
    date: string;
    time: string;
    guestCounts: Record<string, number>;
    guestTypes?: any[];
    totalPrice: number;
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
    image?: any;
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
    const siteId = site?.slug?.current || 'rome-tour-tickets';

    // Get booking data from URL
    const [bookingData, setBookingData] = useState<BookingData | null>(null);
    const [clientSecret, setClientSecret] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Form states
    const [step, setStep] = useState(1);
    const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
    const [relatedTours, setRelatedTours] = useState<any[]>([]);

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

    const [policyAccepted, setPolicyAccepted] = useState(false);

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
                const { leadTraveler, guests: guestDetails, marketing } = parsed.guestDetails;

                if (leadTraveler) setLeadTraveler(prev => ({ ...prev, ...leadTraveler }));

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

                if (marketing) setMarketing(prev => ({ ...prev, ...marketing }));

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
        } catch (e) {
            setError('Invalid booking data');
            setLoading(false);
        }
    }, [searchParams]);

    const fetchRelatedTours = async (category: string, excludeId: string) => {
        try {
            const PAYLOAD_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'https://admin.wondersofrome.com';
            const SITE_ID = process.env.NEXT_PUBLIC_SITE_ID || 'ticketsinrome';
            const res = await fetch(
                `${PAYLOAD_URL}/api/tours?where[category][equals]=${encodeURIComponent(category)}&where[tenant][equals]=${encodeURIComponent(SITE_ID)}&where[active][equals]=true&limit=3&depth=1`,
                { cache: 'no-store' }
            );
            if (!res.ok) return;
            const data = await res.json();
            const tours = (data?.docs || [])
                .filter((t: any) => String(t.id) !== String(excludeId))
                .slice(0, 3)
                .map((t: any) => ({
                    _id: String(t.id),
                    title: t.title,
                    slug: { current: t.slug },
                    price: t.price,
                    duration: t.duration,
                    category: t.category,
                    mainImage: t.mainImage?.url ? { asset: { url: t.mainImage.url } } : undefined,
                }));
            setRelatedTours(tours);
        } catch (e) {
            console.error('Failed to fetch related tours:', e);
        }
    };

    const fetchAddOns = async () => {
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
    };

    // Create payment intent when reaching payment step
    useEffect(() => {
        if (step === 3 && bookingData && !clientSecret) {
            createPaymentIntent();
        }
    }, [step, bookingData]);

    const createPaymentIntent = async () => {
        const selectedAddonsData = addons.filter(a => selectedAddOns.includes(a.id)).map(a => {
            let quantity = 1;
            let price = a.price;

            if (a.pricingType === 'perPerson') {
                quantity = Object.values(bookingData?.guestCounts || {}).reduce((s, c) => s + (c || 0), 0);
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
                    guests: Object.values(bookingData?.guestCounts || {}).reduce((s, c) => s + (c || 0), 0),
                    guestCounts: bookingData!.guestCounts,
                    addOns: selectedAddonsData,
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
    };

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
        if (step === 2) {
            // No specific validation for add-ons yet
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

    const calculateTotal = () => {
        if (!bookingData) return 0;
        const addOnsTotal = addons
            .filter(a => selectedAddOns.includes(a.id))
            .reduce((sum, a) => {
                let price = a.price;
                if (a.pricingType === 'perPerson') {
                    const quantity = Object.values(bookingData?.guestCounts || {}).reduce((s, c) => s + (c || 0), 0);
                    price = a.price * quantity;
                } else if (a.pricingType === 'perHour') {
                    const hours = hourlyAddons[a.id] || a.minHours || 3;
                    price = a.price * hours;
                }
                return sum + price;
            }, 0);
        return bookingData.totalPrice + addOnsTotal;
    };

    const getAddonPrice = (addon: AddOn) => {
        if (addon.pricingType === 'perPerson') {
            const count = Object.values(bookingData?.guestCounts || {}).reduce((s, c) => s + (c || 0), 0);
            return addon.price * count;
        } else if (addon.pricingType === 'perHour') {
            const hours = hourlyAddons[addon.id] || addon.minHours || 3;
            return addon.price * hours;
        }
        return addon.price;
    };

    if (loading && !bookingData) {
        return (
            <div className="min-h-screen bg-muted flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading checkout...</p>
                </div>
            </div>
        );
    }

    if (error || !bookingData) {
        return (
            <div className="min-h-screen bg-muted flex items-center justify-center p-4">
                <div className="bg-card rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
                    <AlertTriangle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-foreground mb-2">Something went wrong</h2>
                    <p className="text-gray-600 mb-6">{error || 'Booking data not found'}</p>
                    <Link href="/" className="inline-flex items-center gap-2 text-primary font-medium hover:underline">
                        <ArrowLeft className="w-4 h-4" /> Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    const totalGuests = Object.values(bookingData?.guestCounts || {}).reduce((s, c) => s + (c || 0), 0);
    const stripeKey = getStripeKey(siteId);
    const stripePromise = loadStripe(stripeKey);

    return (
        <div className="min-h-screen bg-muted">
            {/* Header */}
            <header className="bg-card border-b border-border sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        {site?.logo ? (
                            <Image src={urlFor(site.logo).url()} alt={site.title} width={120} height={40} className="h-8 w-auto" />
                        ) : (
                            <span className="text-xl font-bold text-foreground">{site?.title || 'Rome Tours'}</span>
                        )}
                    </Link>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
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
                        <div className="bg-card rounded-xl p-6 shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between">
                                {[
                                    { num: 1, label: 'Contact & Guests' },
                                    { num: 2, label: 'Add-ons' },
                                    { num: 3, label: 'Payment' },
                                ].map((s, i) => (
                                    <div key={s.num} className="flex items-center">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${step >= s.num ? 'bg-primary text-primary-foreground' : 'bg-gray-100 text-muted-foreground'
                                            }`}>
                                            {step > s.num ? <Check className="w-5 h-5" /> : s.num}
                                        </div>
                                        <span className={`ml-2 text-sm font-medium hidden sm:block ${step >= s.num ? 'text-foreground' : 'text-muted-foreground'
                                            }`}>
                                            {s.label}
                                        </span>
                                        {i < 2 && <div className={`w-16 h-0.5 mx-3 ${step > s.num ? 'bg-primary' : 'bg-gray-200'}`} />}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Step 1: Lead Traveler */}
                        {step === 1 && (
                            <div className="bg-card rounded-xl p-6 shadow-sm border border-gray-100">
                                <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                                    <User className="w-5 h-5 text-primary" />
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
                                            className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary outline-none"
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
                                            className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary outline-none"
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
                                            <Mail className="absolute left-3 top-3.5 text-muted-foreground w-5 h-5" />
                                            <input
                                                type="email"
                                                required
                                                className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary outline-none"
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
                                            <Mail className="absolute left-3 top-3.5 text-muted-foreground w-5 h-5" />
                                            <input
                                                type="email"
                                                required
                                                className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary outline-none"
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
                                        <p className="text-xs text-muted-foreground mt-1">For urgent tour updates or emergencies</p>
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
                            <div className="bg-card rounded-xl p-6 shadow-sm border border-gray-100">
                                <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                                    <Users className="w-5 h-5 text-primary" />
                                    Guest Names ({totalGuests})
                                </h2>

                                <div className="space-y-3">
                                    {guests.map((guest, idx) => (
                                        <div key={idx} className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                                            <div className="w-8 h-8 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold text-sm">
                                                {idx + 1}
                                            </div>
                                            <div className="flex-1">
                                                <input
                                                    type="text"
                                                    required
                                                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary outline-none"
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
                                <div className="bg-card rounded-xl p-6 shadow-sm border border-gray-100">
                                    <h2 className="text-xl font-bold text-foreground mb-2 flex items-center gap-2">
                                        <Sparkles className="w-5 h-5 text-primary" />
                                        Enhance Your Experience
                                    </h2>
                                    <p className="text-muted-foreground text-sm mb-6">Add these optional extras to make your tour even better</p>

                                    {addonsLoading ? (
                                        <div className="flex items-center justify-center py-8">
                                            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                                        </div>
                                    ) : addons.length === 0 ? (
                                        <div className="text-center py-8 text-muted-foreground">
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
                                                            ? 'border-primary bg-emerald-50'
                                                            : 'border-border hover:border-emerald-200'
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
                                                                    <h3 className="font-semibold text-foreground flex items-center gap-2">
                                                                        {addon.name}
                                                                        {addon.popular && (
                                                                            <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">
                                                                                Popular
                                                                            </span>
                                                                        )}
                                                                    </h3>
                                                                    <span className="font-bold text-primary shrink-0">
                                                                        +€{displayPrice.toFixed(2)}
                                                                    </span>
                                                                </div>
                                                                <p className="text-sm text-muted-foreground mt-1">{addon.description}</p>
                                                                <p className="text-xs text-muted-foreground mt-1">
                                                                    {addon.pricingType === 'perPerson' && `€${addon.price} per person × ${Object.values(bookingData?.guestCounts || {}).reduce((s, c) => s + (c || 0), 0)} guests`}
                                                                    {addon.pricingType === 'perHour' && `€${addon.price} per hour`}
                                                                    {addon.pricingType === 'perBooking' && `Flat rate`}
                                                                </p>
                                                            </div>
                                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${isSelected ? 'border-primary bg-emerald-500' : 'border-gray-300'
                                                                }`}>
                                                                {isSelected && <Check className="w-4 h-4 text-white" />}
                                                            </div>
                                                        </div>

                                                        {/* Hourly Pricing Selector *\/}
                                                        {isSelected && addon.pricingType === 'perHour' && (
                                                            <div className="mt-4 pt-4 border-t border-emerald-200" onClick={e => e.stopPropagation()}>
                                                                <div className="flex items-center justify-between mb-2">
                                                                    <span className="text-sm font-medium text-gray-700">Number of hours:</span>
                                                                    <span className="text-lg font-bold text-primary">{selectedHours} hrs</span>
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
                                                                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                                                    <span>{addon.minHours || 1}h</span>
                                                                    <span>{addon.maxHours || 12}h</span>
                                                                </div>
                                                                <div className="mt-3 flex items-center justify-between bg-card rounded-lg p-3 border border-emerald-200">
                                                                    <span className="text-sm text-gray-600">Price for {selectedHours} hours:</span>
                                                                    <span className="text-lg font-bold text-primary">€{(addon.price * selectedHours).toFixed(2)}</span>
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
                                    <div className="bg-card rounded-xl p-6 shadow-sm border border-gray-100">
                                        <h2 className="text-xl font-bold text-foreground mb-2 flex items-center gap-2">
                                            <Star className="w-5 h-5 text-amber-500" />
                                            You Might Also Like
                                        </h2>
                                        <p className="text-muted-foreground text-sm mb-6">Customers who booked this tour also enjoyed these</p>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {relatedTours.map((tour: any) => (
                                                <Link
                                                    key={tour._id}
                                                    href={`/tour/${tour.slug.current}`}
                                                    className="group block border border-border rounded-xl overflow-hidden hover:shadow-md transition-shadow"
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
                                                        <div className="absolute top-2 right-2 bg-card/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold">
                                                            €{tour.price}
                                                        </div>
                                                    </div>
                                                    <div className="p-4">
                                                        <h3 className="font-semibold text-foreground line-clamp-1">{tour.title}</h3>
                                                        <p className="text-xs text-muted-foreground mt-1">{tour.duration}</p>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Marketing Preferences */}
                                <div className="bg-card rounded-xl p-6 shadow-sm border border-gray-100">
                                    <h2 className="text-lg font-bold text-foreground mb-4">Stay Connected</h2>

                                    <div className="space-y-3">
                                        <div className="flex items-start gap-3">
                                            <input
                                                type="checkbox"
                                                id="emailOptIn"
                                                className="mt-1 w-5 h-5 text-primary rounded focus:ring-primary"
                                                checked={marketing.emailOptIn}
                                                onChange={e => setMarketing({ ...marketing, emailOptIn: e.target.checked })}
                                            />
                                            <div>
                                                <label htmlFor="emailOptIn" className="block text-sm font-medium text-foreground">
                                                    Send me exclusive discounts and Rome travel tips
                                                </label>
                                                <p className="text-xs text-muted-foreground">Get 10% off your next booking!</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <input
                                                type="checkbox"
                                                id="smsOptIn"
                                                className="mt-1 w-5 h-5 text-primary rounded focus:ring-primary"
                                                checked={marketing.smsOptIn}
                                                onChange={e => setMarketing({ ...marketing, smsOptIn: e.target.checked })}
                                            />
                                            <div>
                                                <label htmlFor="smsOptIn" className="block text-sm font-medium text-foreground">
                                                    Send me SMS reminders about my tour
                                                </label>
                                                <p className="text-xs text-muted-foreground">24-hour reminder + meeting point details</p>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Special Requests / Notes
                                            </label>
                                            <textarea
                                                rows={3}
                                                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary outline-none"
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
                            <div className="bg-card rounded-xl p-6 shadow-sm border border-gray-100">
                                <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                                    <CreditCard className="w-5 h-5 text-primary" />
                                    Secure Payment
                                </h2>

                                {!clientSecret ? (
                                    <div className="flex items-center justify-center py-12">
                                        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                ) : (
                                    <Elements stripe={stripePromise} options={{ clientSecret }}>
                                        <PaymentForm
                                            bookingData={bookingData}
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
                                    className="px-6 py-3 text-gray-600 font-medium hover:text-foreground transition-colors"
                                >
                                    ← Back
                                </button>
                            ) : (
                                <Link
                                    href={`/tour/${bookingData.tour.slug.current}`}
                                    className="px-6 py-3 text-gray-600 font-medium hover:text-foreground transition-colors"
                                >
                                    ← Cancel
                                </Link>
                            )}

                            {step < 3 && (
                                <button
                                    onClick={nextStep}
                                    className="ml-auto px-8 py-4 bg-primary hover:opacity-90 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
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
                            <div className="bg-muted rounded-xl p-6 shadow-sm border border-border">
                                {/* Tour Header */}
                                <div className="flex gap-4 mb-6 pb-6 border-b border-border">
                                    <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-card shrink-0 border border-border">
                                        {bookingData.tour.mainImage ? (
                                            <Image
                                                src={urlFor(bookingData.tour.mainImage).width(200).height(200).url()}
                                                alt={bookingData.tour.title}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                                <Calendar className="w-8 h-8 text-muted-foreground" />
                                            </div>
                                        )}
                                        <div className="absolute top-1 left-1 bg-emerald-500 text-white text-xs font-bold px-2 py-0.5 rounded">
                                            Tour
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-foreground text-lg leading-tight">{bookingData.tour.title}</h4>
                                        <div className="mt-2 space-y-1">
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                                {format(parseISO(bookingData.date), 'EEEE, MMMM d, yyyy')}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Clock className="w-4 h-4 text-muted-foreground" />
                                                {bookingData.time}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Users className="w-4 h-4 text-muted-foreground" />
                                                {totalGuests} guests ({Object.entries(bookingData.guestCounts)
                                                    .filter(([_, count]) => count > 0)
                                                    .map(([type, count]) => `${count} ${type}`)
                                                    .join(', ')})
                                            </div>
                                            {bookingData.tour.meetingPoint && (
                                                <div className="flex flex-col gap-1 pt-1 mt-1 border-t border-gray-100">
                                                    <div className="flex items-start gap-2 text-sm text-gray-600">
                                                        <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                                                        <span className="leading-tight">{bookingData.tour.meetingPoint}</span>
                                                    </div>
                                                    <a
                                                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(bookingData.tour.meetingPoint + ' Rome')}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-xs text-primary font-bold hover:underline ml-6"
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
                                    <h5 className="text-xs font-bold text-muted-foreground  tracking-wide">Tour Price</h5>

                                    {Object.entries(bookingData.guestCounts).map(([type, count]) => {
                                        if (count === 0) return null;
                                        // Try to find the price for this type if guestTypes exists, otherwise fallback to tour.price
                                        const guestTypeObj = bookingData.guestTypes?.find(gt => gt.name === type);
                                        const unitPrice = guestTypeObj?.price || (type === 'Student' ? (bookingData.tour.studentPrice || bookingData.tour.price) : (type === 'Youth' ? (bookingData.tour.youthPrice || bookingData.tour.price) : bookingData.tour.price));

                                        return (
                                            <div key={type} className="flex justify-between items-center">
                                                <span className="text-sm text-gray-600">
                                                    {type} × {count}
                                                    <span className="text-muted-foreground ml-1">@ €{unitPrice} each</span>
                                                </span>
                                                <span className="text-sm font-medium text-foreground">€{(count * unitPrice).toFixed(2)}</span>
                                            </div>
                                        );
                                    })}

                                    <div className="flex justify-between items-center pt-2 border-t border-border">
                                        <span className="text-sm font-semibold text-gray-700">Subtotal</span>
                                        <span className="text-sm font-semibold text-foreground">€{bookingData.totalPrice.toFixed(2)}</span>
                                    </div>
                                </div>

                                {/* Add-ons Breakdown */}
                                {selectedAddOns.length > 0 && (
                                    <div className="mt-6 pt-6 border-t border-border">
                                        <h5 className="text-xs font-bold text-muted-foreground  tracking-wide mb-3">Add-ons & Extras</h5>
                                        <div className="space-y-3">
                                            {addons.filter(a => selectedAddOns.includes(a.id)).map(addon => {
                                                const price = getAddonPrice(addon);
                                                return (
                                                    <div key={addon.id} className="flex justify-between items-start">
                                                        <div className="flex-1">
                                                            <span className="text-sm text-foreground font-medium">{addon.name}</span>
                                                            <p className="text-xs text-muted-foreground mt-0.5">
                                                                {addon.pricingType === 'perPerson' && `${Object.values(bookingData?.guestCounts || {}).reduce((s, c) => s + (c || 0), 0)} person × €${addon.price}`}
                                                                {addon.pricingType === 'perHour' && `${hourlyAddons[addon.id] || addon.minHours || 3} hours × €${addon.price}/hr`}
                                                                {addon.pricingType === 'perBooking' && 'Flat rate'}
                                                            </p>
                                                        </div>
                                                        <span className="text-sm font-medium text-foreground ml-4">€{price.toFixed(2)}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        <div className="flex justify-between items-center pt-3 mt-3 border-t border-border">
                                            <span className="text-sm font-semibold text-gray-700">Add-ons Subtotal</span>
                                            <span className="text-sm font-semibold text-foreground">
                                                €{(calculateTotal() - bookingData.totalPrice).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Total */}
                                <div className="mt-6 pt-6 border-t-2 border-gray-300">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <span className="text-base font-bold text-foreground">Total</span>
                                            <p className="text-xs text-muted-foreground">Including VAT & fees</p>
                                        </div>
                                        <span className="text-3xl font-bold text-primary">€{calculateTotal().toFixed(2)}</span>
                                    </div>
                                </div>

                                {/* Savings / Info */}
                                <div className="mt-4 p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                                    <div className="flex items-start gap-2">
                                        <Check className="w-4 h-4 text-primary mt-0.5" />
                                        <div>
                                            <p className="text-sm text-emerald-800 font-medium">Free cancellation</p>
                                            <p className="text-xs text-primary">Cancel up to 24 hours before for full refund</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Trust Badges */}
                            <div className="bg-card rounded-xl p-5 shadow-sm border border-border">
                                <h5 className="text-xs font-bold text-muted-foreground  tracking-wide mb-4">Secure Checkout</h5>
                                <div className="space-y-3">
                                    {/* SSL Badge */}
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-2 bg-emerald-50 px-3 py-2 rounded-lg">
                                            <Shield className="w-5 h-5 text-primary" />
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-emerald-900">SSL</span>
                                                <span className="text-[10px] text-primary">SECURE</span>
                                            </div>
                                        </div>
                                        <span className="text-xs text-muted-foreground">256-bit Encrypted</span>
                                    </div>
                                    
                                    {/* PCI Compliant Badge */}
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg">
                                            <Lock className="w-5 h-5 text-blue-600" />
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-blue-900">PCI</span>
                                                <span className="text-[10px] text-blue-600">DSS</span>
                                            </div>
                                        </div>
                                        <span className="text-xs text-muted-foreground">Compliant</span>
                                    </div>

                                    {/* Stripe Badge */}
                                    <div className="flex items-center gap-3">
                                        <div className="bg-indigo-600 px-3 py-2 rounded-lg">
                                            <span className="text-white text-sm font-bold">stripe</span>
                                        </div>
                                        <span className="text-xs text-muted-foreground">Powered by Stripe</span>
                                    </div>
                                </div>

                                {/* Payment Logos */}
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <p className="text-xs text-muted-foreground mb-2">Accepted Payment Methods</p>
                                    <PaymentLogos size="md" />
                                </div>
                            </div>

                            {/* Help Box */}
                            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-5 text-white">
                                <p className="font-bold text-lg">Need help?</p>
                                <p className="text-emerald-100 text-sm mt-1">Our team is available 7 days a week</p>
                                <a href="tel:3517869798" className="flex items-center gap-2 mt-3 text-xl font-bold hover:underline">
                                    <Phone className="w-5 h-5" />
                                    351 786 9798
                                </a>
                                <p className="text-emerald-200 text-xs mt-2">8am - 8pm Rome time (CET)</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

// Payment Form Component
function PaymentForm({ bookingData, totalAmount, onSuccess }: {
    bookingData: BookingData | null;
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
            {/* Payment Methods Info */}
            <div className="bg-muted rounded-lg p-4 border border-border">
                <p className="text-sm font-medium text-gray-700 mb-3">Accepted Payment Methods:</p>
                <div className="flex flex-wrap gap-3">
                    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-card rounded-lg border border-border text-sm">
                        <CreditCard className="w-4 h-4 text-blue-600" />
                        Card
                    </span>
                    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-card rounded-lg border border-border text-sm">
                        <span className="w-4 h-4 rounded-full bg-yellow-400 flex items-center justify-center text-[8px] font-bold">P</span>
                        PayPal
                    </span>
                    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-card rounded-lg border border-border text-sm">
                        <span className="w-4 h-4 rounded bg-purple-600 flex items-center justify-center text-white text-[8px] font-bold">L</span>
                        Link
                    </span>
                    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-card rounded-lg border border-border text-sm">
                        <span className="text-xs">🇪🇺</span>
                        EU Banks
                    </span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Including iDEAL, Bancontact, giropay, EPS, P24, SOFORT</p>
            </div>

            <PaymentElement
                options={{
                    layout: {
                        type: 'tabs',
                        defaultCollapsed: false,
                    },
                    paymentMethodOrder: ['card', 'paypal', 'link', 'ideal', 'bancontact', 'giropay', 'eps', 'p24', 'sofort'],
                }}
            />

            {errorMessage && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {errorMessage}
                </div>
            )}

            {/* Policy Acceptance Checkbox */}
            <div className="p-4 bg-muted rounded-xl border border-border">
                <div className="flex items-start gap-3">
                    <input
                        type="checkbox"
                        id="policy-accept"
                        className="mt-1 w-5 h-5 text-primary rounded focus:ring-primary cursor-pointer"
                        checked={policyAccepted}
                        onChange={(e) => setPolicyAccepted(e.target.checked)}
                        required
                    />
                    <label htmlFor="policy-accept" className="text-sm text-gray-600 leading-relaxed cursor-pointer">
                        I have read and agree to the <Link href="/terms" className="text-primary font-bold hover:underline">Terms & Conditions</Link>, <Link href="/privacy" className="text-primary font-bold hover:underline">Privacy Policy</Link>, and <Link href="/cancellation" className="text-primary font-bold hover:underline">Cancellation Policy</Link>.
                    </label>
                </div>
            </div>

            <button
                type="submit"
                disabled={!stripe || isProcessing || !policyAccepted}
                className="w-full py-4 bg-primary hover:opacity-90 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
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

            {/* Payment Method Logos */}
            <div className="pt-4 border-t border-gray-100">
                <p className="text-xs text-muted-foreground text-center mb-3">Secured by Stripe</p>
                <div className="flex items-center justify-center gap-3 flex-wrap">
                    {/* Card Brands */}
                    <div className="flex items-center gap-2 px-3 py-2 bg-card rounded-lg border border-border">
                        <span className="text-xs font-medium text-gray-600">Cards:</span>
                        <div className="flex gap-1">
                            <div className="w-8 h-5 bg-blue-600 rounded flex items-center justify-center text-white text-[8px] font-bold">VISA</div>
                            <div className="w-8 h-5 bg-red-600 rounded flex items-center justify-center text-white text-[8px] font-bold">MC</div>
                            <div className="w-8 h-5 bg-cyan-600 rounded flex items-center justify-center text-white text-[8px] font-bold">AMEX</div>
                        </div>
                    </div>

                    {/* Digital Wallets */}
                    <div className="flex items-center gap-2 px-3 py-2 bg-card rounded-lg border border-border">
                        <span className="text-xs font-medium text-gray-600">Wallets:</span>
                        <div className="flex gap-1">
                            <div className="w-8 h-5 bg-black rounded flex items-center justify-center text-white text-[8px]">Pay</div>
                            <div className="w-8 h-5 bg-card border border-gray-300 rounded flex items-center justify-center text-gray-800 text-[8px]">GPay</div>
                            <div className="w-8 h-5 bg-blue-500 rounded flex items-center justify-center text-white text-[8px] font-bold">Pay</div>
                        </div>
                    </div>

                    {/* Bank Transfer */}
                    <div className="flex items-center gap-2 px-3 py-2 bg-card rounded-lg border border-border">
                        <span className="text-xs font-medium text-gray-600">Bank:</span>
                        <div className="flex gap-1">
                            <div className="w-6 h-5 bg-pink-500 rounded flex items-center justify-center text-white text-[6px]">iD</div>
                            <div className="w-6 h-5 bg-blue-500 rounded flex items-center justify-center text-white text-[6px]">BC</div>
                            <div className="w-6 h-5 bg-teal-500 rounded flex items-center justify-center text-white text-[6px]">GP</div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}

// Main page with Suspense
export default function CheckoutPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-muted flex items-center justify-center">
                <LoadingWithFacts />
            </div>
        }>
            <CheckoutContent />
        </Suspense>
    );
}
