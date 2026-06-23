'use client';

import { useState, useEffect, useMemo } from 'react';
import { Calendar, User, CheckCircle, Loader2, Info, Users, Clock, AlertTriangle, Star, Minus, Plus, ChevronRight, ShoppingCart } from 'lucide-react';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import GuestDetailsModal, { GuestDetail } from './GuestDetailsModal';
import Image from 'next/image';
import SmartCalendar from './ui/SmartCalendar';
import VaticanCalendar from './ui/VaticanCalendar';
import { format } from 'date-fns';
import { useSite } from '@/components/SiteProvider';
import { useCart } from '@/context/CartContext';
import { urlFor } from '@/lib/dataAdapter';
import CheckoutDrawer from './CheckoutDrawer';

// Stripe publishable key — resolved from env by site ID suffix
// e.g. NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_GOLDENROMETOUR for goldenrometour

interface GuestType {
    name: string;
    price: number;
    description?: string;
}

interface BookingWidgetProps {
    tour: {
        _id: string;
        title: string;
        price: number; // Base price
        slug: { current: string };
        mainImage?: any;
        guestTypes?: GuestType[];
        category?: string;
        meetingPoint?: string;
        maxParticipants?: number;
    };
}

interface TimeSlot {
    time: string;
    available_slots: number;
}

export default function BookingWidget({ tour }: BookingWidgetProps) {
    const site = useSite();
    const { addToCart } = useCart();
    const siteId = site?.slug?.current || process.env.NEXT_PUBLIC_SITE_ID || 'goldenrometour';

    // Initialize Stripe with site-specific key
    // Reads NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_<SITEID_UPPER> then falls back to generic
    const stripePromise = useMemo(() => {
        // Next.js inlines NEXT_PUBLIC_ vars at build time — must reference them explicitly
        const keyMap: Record<string, string> = {
            'wondersofrome': process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_WONDERSOFROME || '',
            'rome-tour-tickets': process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_ROME_TOUR_TICKETS || '',
            'goldenrometour': process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_GOLDENROMETOUR || '',
            'romanvaticantour': process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_ROMANVATICANTOUR || '',
            'romewander': process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_ROMEWANDER || '',
        };
        const key = keyMap[siteId] || process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';
        if (!key) {
            console.warn('Stripe publishable key not configured for site:', siteId);
            return null;
        }
        // Check if it's a mock/test key
        if (key.includes('mock') || key.includes('REPLACE')) {
            console.warn('Using mock Stripe key - payments will not work. Configure real Stripe keys in .env');
            return null;
        }
        return loadStripe(key);
    }, [siteId]);


    // Use dynamic guest types if provided, otherwise fallback to default
    const currentGuestTypes = useMemo(() => {
        if (tour.guestTypes && tour.guestTypes.length > 0) {
            return tour.guestTypes;
        }
        return [
            { name: 'Adult', price: tour.price, description: 'Age 18+' },
            { name: 'Student', price: Math.round(tour.price * 0.85), description: 'ID Required' },
            { name: 'Youth', price: Math.round(tour.price * 0.70), description: 'Under 18' },
            { name: 'Child', price: Math.round(tour.price * 0.50), description: 'Under 8' },
        ];
    }, [tour]);

    // Ticket Counts state - dynamic based on guest types
    const [counts, setCounts] = useState<Record<string, number>>({});

    useEffect(() => {
        const initialCounts: Record<string, number> = {};
        currentGuestTypes.forEach((gt, idx) => {
            initialCounts[gt.name] = idx === 0 ? 1 : 0;
        });
        setCounts(initialCounts);
    }, [currentGuestTypes]);

    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');

    const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
    const [loadingAvailability, setLoadingAvailability] = useState(false);

    // Checkout State
    const [checkingOut, setCheckingOut] = useState(false);
    const [validationError, setValidationError] = useState('');
    const [showDrawer, setShowDrawer] = useState(false);
    const [drawerData, setDrawerData] = useState<any>(null);

    // Derived State
    const totalGuests = Object.values(counts || {}).reduce((sum, count) => sum + (count || 0), 0);

    const totalPrice = useMemo(() => {
        return currentGuestTypes.reduce((sum, gt) => sum + (counts[gt.name] || 0) * gt.price, 0);
    }, [counts, currentGuestTypes]);

    const activeSlot = timeSlots.find(s => s.time === selectedTime);

    const maxSelectable = useMemo(() => {
        const byParticipants = typeof tour?.['maxParticipants'] === 'number' ? tour['maxParticipants'] as number : Number.POSITIVE_INFINITY;
        const byAvailability = activeSlot?.available_slots ?? Number.POSITIVE_INFINITY;
        return Math.min(byParticipants, byAvailability);
    }, [tour, activeSlot]);

    const visibleSlots = useMemo(() => {
        if (!selectedDate) return [];
        const todayStr = format(new Date(), 'yyyy-MM-dd');
        if (selectedDate !== todayStr) return timeSlots;
        const now = new Date();
        return timeSlots.filter(slot => {
            const [h, m] = (slot.time || '').split(':').map(Number);
            if (isNaN(h)) return true;
            const slotDate = new Date();
            slotDate.setHours(h, m || 0, 0, 0);
            return slotDate >= now;
        });
    }, [timeSlots, selectedDate]);
    // Check availability when date changes
    useEffect(() => {
        if (!selectedDate) {
            setTimeSlots([]);
            return;
        }

        async function check() {
            setLoadingAvailability(true);
            setTimeSlots([]);
            setSelectedTime('');
            try {
                const res = await fetch(`/api/availability?slug=${tour.slug.current}&date=${selectedDate}`);
                const data = await res.json();
                setTimeSlots(data.slots || []);
            } catch (error) {
                console.error("Availability check failed", error);
            } finally {
                setLoadingAvailability(false);
            }
        }
        check();
    }, [selectedDate, tour.slug.current]);

    const handleAddToCart = () => {
        if (!selectedDate) { setValidationError('Please select a date first'); return; }
        if (!selectedTime) { setValidationError('Please select a time slot'); return; }
        const available = activeSlot?.available_slots || 0;
        if (available < totalGuests) { setValidationError(`Only ${available} spots left for this time`); return; }
        if (Number.isFinite(maxSelectable) && totalGuests > maxSelectable) { setValidationError(`Max ${maxSelectable} participants for this slot`); return; }
        setValidationError('');
        addToCart({
            id: `${tour._id}-${selectedDate}-${selectedTime}-${Date.now()}`,
            tourId: tour._id,
            tourTitle: tour.title,
            tourSlug: tour.slug.current,
            date: selectedDate,
            time: selectedTime,
            guestCounts: counts,
            price: totalPrice,
            image: tour.mainImage
                ? (typeof tour.mainImage === 'string'
                    ? tour.mainImage
                    : tour.mainImage?.asset?._ref
                    ? urlFor(tour.mainImage).url()
                    : tour.mainImage?.asset?.url || undefined)
                : undefined,
        });
    };

    const handleInitialClick = () => {
        if (!selectedDate) { setValidationError('Please select a date first'); return; }
        if (!selectedTime) { setValidationError('Please select a time slot'); return; }
        const available = activeSlot?.available_slots || 0;
        if (available < totalGuests) { setValidationError(`Only ${available} spots left for this time`); return; }
        if (Number.isFinite(maxSelectable) && totalGuests > maxSelectable) { setValidationError(`Max ${maxSelectable} participants for this slot`); return; }
        setValidationError('');
        processCheckout([]);
    };

    const processCheckout = async (details: GuestDetail[]) => {
        const data = {
            tour: {
                _id: tour._id,
                title: tour.title,
                slug: tour.slug,
                price: tour.price,
                guestTypes: tour.guestTypes,
                mainImage: tour.mainImage,
                category: tour.category,
                meetingPoint: (tour as any).meetingPoint,
            },
            date: selectedDate,
            time: selectedTime,
            guestCounts: counts,
            totalPrice,
        };
        setDrawerData(data);
        setShowDrawer(true);
    };
    // Helper for Stepper
    const Stepper = ({ name, value, min = 0, max = 50 }: { name: string, value: number, min?: number, max?: number }) => (
        <div className="flex items-center gap-3">
            <button
                onClick={() => setCounts(prev => ({ ...prev, [name]: Math.max(min, (prev[name] || 0) - 1) }))}
                disabled={value <= min}
                className="w-10 h-10 rounded-xl border border-primary/10 flex items-center justify-center text-secondary/40 hover:bg-primary/5 hover:text-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95 shadow-sm"
            >
                <Minus size={16} />
            </button>
            <span className="w-6 text-center font-heading font-bold text-secondary text-lg">{value}</span>
            <button
                onClick={() => {
                    const nextTotal = Object.values(counts || {}).reduce((sum, c) => sum + (c || 0), 0) + 1;
                    if (Number.isFinite(maxSelectable) && nextTotal > maxSelectable) return;
                    setCounts(prev => ({ ...prev, [name]: Math.min(max, (prev[name] || 0) + 1) }));
                }}
                disabled={value >= max || (Number.isFinite(maxSelectable) && (Object.values(counts || {}).reduce((s, c) => s + (c || 0), 0) >= maxSelectable))}
                className="w-10 h-10 rounded-xl border border-primary/20 flex items-center justify-center text-primary hover:bg-primary/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95 shadow-sm"
            >
                <Plus size={16} />
            </button>
        </div>
    );

    return (
        <div className="space-y-4">
            <div className="bg-white rounded-3xl shadow-[0_32px_80px_rgba(201,168,76,0.1)] border border-primary/10 overflow-hidden">


                {/* Header: Title */}
                <div className="px-8 pt-8 pb-4">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Official Access</span>
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map(i => (
                                <div key={i} className={`w-7 h-7 rounded-full border-2 border-white bg-background overflow-hidden`}>
                                    <Image src={`https://i.pravatar.cc/100?img=${i + 10}`} width={28} height={28} alt="Traveler" />
                                </div>
                            ))}
                        </div>
                    </div>
                    <h3 className="text-2xl font-heading font-bold text-foreground">
                        Book Your Tour
                    </h3>
                </div>

                {/* Date Selection */}
                <div className="p-8 pt-4 space-y-8">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">1. Select Date</span>
                            {selectedDate && <span className="text-xs font-semibold text-accent flex items-center gap-1"><CheckCircle size={12} /> {format(new Date(selectedDate), 'MMM dd, yyyy')}</span>}
                        </div>
                        <VaticanCalendar
                            slug={tour.slug.current}
                            selectedDate={selectedDate ? new Date(selectedDate) : undefined}
                            onSelect={(d) => setSelectedDate(d ? format(d, 'yyyy-MM-dd') : '')}
                            basePrice={tour.price}
                        />
                    </div>

                    {selectedDate && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pt-2">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">2. Select Time</span>
                                {selectedTime && <span className="text-xs font-semibold text-accent flex items-center gap-1"><CheckCircle size={12} /> {selectedTime}</span>}
                            </div>

                            {loadingAvailability ? (
                                <div className="flex flex-col items-center justify-center py-10 bg-background/50 rounded-2xl border-2 border-dashed border-primary/20">
                                    <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
                                    <span className="text-xs text-muted-foreground">Checking availability...</span>
                                </div>
                            ) : visibleSlots.length > 0 ? (
                                <div className="grid grid-cols-3 gap-3">
                                    {visibleSlots.map(slot => (
                                        <button
                                            key={slot.time}
                                            onClick={() => setSelectedTime(slot.time)}
                                            disabled={slot.available_slots === 0}
                                            className={`
                                                relative py-4 px-2 text-[12px] font-heading font-bold rounded-2xl border transition-all duration-300 text-center flex flex-col items-center justify-center gap-1 uppercase
                                                ${selectedTime === slot.time
                                                    ? 'bg-secondary text-white border-secondary shadow-xl scale-[1.05] z-10'
                                                    : 'bg-white text-secondary border-primary/10 hover:border-primary hover:bg-primary/5'
                                                }
                                                ${slot.available_slots === 0 ? 'opacity-20 cursor-not-allowed bg-background' : ''}
                                            `}
                                        >
                                            <span className="text-sm">{slot.time}</span>
                                            {slot.available_slots < 5 && slot.available_slots > 0 &&
                                                <span className={`text-[8px] font-bold ${selectedTime === slot.time ? 'text-primary' : 'text-accent'}`}>
                                                    {slot.available_slots} Left
                                                </span>
                                            }
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-sm text-muted-foreground py-8 px-4 bg-muted rounded-2xl border border-border flex flex-col items-center justify-center gap-3">
                                    <AlertTriangle size={24} className="text-muted-foreground" />
                                    <span>No availability for this date</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Participants Selection */}
                <div className="px-8 py-8 bg-muted/30 border-t border-border">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <Users size={16} className="text-accent" />
                            <span className="text-xs font-semibold text-foreground uppercase tracking-wide">3. Number of Guests</span>
                        </div>
                        <div className="flex items-center gap-1 bg-card px-3 py-1.5 rounded-xl border border-border shadow-sm">
                            <span className="text-xs font-semibold text-foreground">{totalGuests} {totalGuests === 1 ? 'guest' : 'guests'}</span>
                        </div>
                    </div>

                    <div className="grid gap-4">
                        {currentGuestTypes.map(gt => (
                            <div key={gt.name} className="flex items-center justify-between p-4 bg-card rounded-2xl border border-border hover:shadow-md transition-all group">
                                <div className="flex flex-col">
                                    <span className="text-sm font-semibold text-foreground group-hover:text-accent transition-colors">{gt.name}</span>
                                    {gt.description && <span className="text-xs text-muted-foreground mt-0.5">{gt.description}</span>}
                                    <span className="text-sm font-bold text-accent mt-1">€{gt.price} / person</span>
                                </div>
                                <Stepper name={gt.name} value={counts[gt.name] || 0} min={gt.name === 'Adult' ? 1 : 0} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Price Summary */}
                <div className="px-8 py-6 bg-foreground text-background border-t border-border">
                    <div className="flex justify-between items-center text-xs font-medium text-background/60 uppercase tracking-wide mb-2">
                        <span>Price per person from</span>
                        <span>EUR</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold">Total</span>
                        <span className="text-4xl font-bold text-accent">€{totalPrice}</span>
                    </div>
                </div>

                <div className="p-8 pt-6">
                    {/* Inline validation error */}
                    {validationError && (
                        <div className="mb-4 px-4 py-3 bg-destructive/5 border border-destructive/20 rounded-xl text-sm text-destructive flex items-center gap-2">
                            <AlertTriangle size={14} />
                            {validationError}
                        </div>
                    )}

                    {/* Primary CTA */}
                    <button
                        onClick={handleInitialClick}
                        disabled={checkingOut || !selectedDate || !selectedTime || totalGuests === 0}
                        className={`w-full py-4 rounded-2xl font-bold text-sm shadow-lg transition-all duration-300 transform active:scale-[0.98] flex items-center justify-center gap-3 ${checkingOut || !selectedDate || !selectedTime || totalGuests === 0
                            ? 'bg-muted text-muted-foreground cursor-not-allowed'
                            : 'bg-accent text-foreground hover:bg-accent/90 shadow-accent/20'
                            }`}
                    >
                        {checkingOut ? <Loader2 className="animate-spin" size={18} /> : (
                            <>
                                <span>Book Now{totalPrice > 0 ? ` — €${totalPrice}` : ''}</span>
                                <ChevronRight size={16} />
                            </>
                        )}
                    </button>

                    {/* Secondary: Add to cart */}
                    <button
                        onClick={handleAddToCart}
                        disabled={!selectedDate || !selectedTime || totalGuests === 0}
                        className="w-full mt-3 py-3 rounded-2xl font-semibold text-sm transition-all duration-300 text-muted-foreground hover:text-foreground disabled:opacity-30 flex items-center justify-center gap-2 border border-border hover:border-foreground/20"
                    >
                        <ShoppingCart size={14} />
                        Add to Cart
                    </button>

                    <div className="mt-6 pt-6 border-t border-border flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex gap-0.5">
                                {[1, 2, 3, 4, 5].map(i => <Star key={i} size={10} className="fill-accent text-accent" />)}
                            </div>
                            <span className="text-xs text-muted-foreground">4.9 · 3,000+ reviews</span>
                        </div>
                        <span className="text-xs text-muted-foreground">Secured by Stripe</span>
                    </div>
                </div>

            </div>

            <div className="bg-muted rounded-2xl p-5 border border-border flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                    <CheckCircle size={20} className="text-accent" />
                </div>
                <div>
                    <h4 className="text-sm font-semibold text-foreground">Free cancellation</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">Full refund if cancelled more than 24 hours before</p>
                </div>
            </div>

            {/* Checkout Drawer */}
            {showDrawer && (
                <CheckoutDrawer
                    bookingData={drawerData}
                    onClose={() => setShowDrawer(false)}
                />
            )}
        </div>
    );
}
