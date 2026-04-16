'use client';

import { useState, useEffect, useMemo } from 'react';
import { Calendar, User, CheckCircle, Loader2, Info, Users, Clock, AlertTriangle, Star, Minus, Plus, ChevronRight, ShoppingCart } from 'lucide-react';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import GuestDetailsModal, { GuestDetail } from './GuestDetailsModal';
import Image from 'next/image';
import SmartCalendar from './ui/SmartCalendar';
import { format } from 'date-fns';
import { useSite } from '@/components/SiteProvider';
import { useCart } from '@/context/CartContext';
import CheckoutDrawer from './CheckoutDrawer';

// Site-specific Stripe publishable keys
// Stripe publishable key — resolved from env by site ID suffix
// e.g. NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_ROMANVATICANTOUR for romanvaticantour

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
    const siteId = site?.slug?.current || process.env.NEXT_PUBLIC_SITE_ID || 'romanvaticantour';

    // Initialize Stripe with site-specific key
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
            console.error('Stripe publishable key not configured for site:', siteId);
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
            image: tour.mainImage ? urlFor(tour.mainImage).url() : undefined,
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
                _id: tour._id, title: tour.title, slug: tour.slug,
                price: tour.price, guestTypes: tour.guestTypes,
                mainImage: tour.mainImage, category: tour.category,
                meetingPoint: tour['meetingPoint'],
            },
            date: selectedDate, time: selectedTime,
            guestCounts: counts, totalPrice,
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
                className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95 shadow-sm"
            >
                <Minus size={16} />
            </button>
            <span className="w-6 text-center font-black text-gray-900 text-lg">{value}</span>
            <button
                onClick={() => {
                    const nextTotal = Object.values(counts || {}).reduce((sum, c) => sum + (c || 0), 0) + 1;
                    if (Number.isFinite(maxSelectable) && nextTotal > maxSelectable) return;
                    setCounts(prev => ({ ...prev, [name]: Math.min(max, (prev[name] || 0) + 1) }));
                }}
                disabled={value >= max || (Number.isFinite(maxSelectable) && (Object.values(counts || {}).reduce((s, c) => s + (c || 0), 0) >= maxSelectable))}
                className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-sky-600 hover:bg-sky-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95 shadow-sm"
            >
                <Plus size={16} />
            </button>
        </div>
    );

    return (
        <>
        <div className="space-y-4">
            <div className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden">


                {/* Header: Title */}
                <div className="px-8 pt-8 pb-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-sky-600 bg-sky-50 px-3 py-1 rounded-full">Secure Booking</span>
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map(i => (
                                <div key={i} className={`w-6 h-6 rounded-full border-2 border-white bg-gray-200 overflow-hidden`}>
                                    <Image src={`https://i.pravatar.cc/100?img=${i + 10}`} width={24} height={24} alt="User" />
                                </div>
                            ))}
                        </div>
                    </div>
                    <h3 className="text-2xl font-black text-gray-950 flex items-center gap-2">
                        Book Your Experience
                    </h3>
                </div>

                {/* Date Selection */}
                <div className="p-8 pt-4 space-y-8">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-black uppercase tracking-widest text-gray-400">1. Select Date</span>
                            {selectedDate && <span className="text-xs font-bold text-sky-600 flex items-center gap-1"><CheckCircle size={12} /> {format(new Date(selectedDate), 'MMM dd, yyyy')}</span>}
                        </div>
                        <SmartCalendar
                            slug={tour.slug.current}
                            selectedDate={selectedDate ? new Date(selectedDate) : undefined}
                            onSelect={(d) => setSelectedDate(d ? format(d, 'yyyy-MM-dd') : '')}
                            basePrice={tour.price}
                        />
                    </div>

                    {selectedDate && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pt-2">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm font-black uppercase tracking-widest text-gray-400">2. Select Time</span>
                                {selectedTime && <span className="text-xs font-bold text-sky-600 flex items-center gap-1"><CheckCircle size={12} /> {selectedTime}</span>}
                            </div>

                            {loadingAvailability ? (
                                <div className="flex flex-col items-center justify-center py-10 bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-100">
                                    <Loader2 className="w-8 h-8 animate-spin text-sky-600 mb-3" />
                                    <span className="text-sm text-gray-500 font-bold uppercase tracking-widest">Scanning local times...</span>
                                </div>
                            ) : visibleSlots.length > 0 ? (
                                <div className="grid grid-cols-3 gap-3">
                                    {visibleSlots.map(slot => (
                                        <button
                                            key={slot.time}
                                            onClick={() => setSelectedTime(slot.time)}
                                            disabled={slot.available_slots === 0}
                                            className={`
                                                relative py-4 px-2 text-sm font-black rounded-2xl border-2 transition-all duration-300 text-center flex flex-col items-center justify-center gap-1
                                                ${selectedTime === slot.time
                                                    ? 'bg-sky-600 text-white border-sky-600 shadow-xl shadow-sky-100 scale-[1.05] z-10'
                                                    : 'bg-white text-gray-900 border-gray-100 hover:border-sky-300 hover:bg-sky-50/30'
                                                }
                                                ${slot.available_slots === 0 ? 'opacity-30 cursor-not-allowed bg-gray-50 grayscale' : ''}
                                            `}
                                        >
                                            <span className="text-base">{slot.time}</span>
                                            {slot.available_slots < 5 && slot.available_slots > 0 &&
                                                <span className={`text-[9px] font-bold uppercase ${selectedTime === slot.time ? 'text-sky-100' : 'text-rose-600'}`}>
                                                    {slot.available_slots} Left
                                                </span>
                                            }
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-sm text-rose-600 font-black py-6 px-4 bg-rose-50/50 rounded-2xl border-2 border-rose-100 flex flex-col items-center justify-center gap-3">
                                    <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center">
                                        <AlertTriangle size={24} className="text-rose-600" />
                                    </div>
                                    <span className="uppercase tracking-widest text-[10px]">Fully booked for this date</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Participants Selection */}
                <div className="px-8 py-8 bg-gray-50/50 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <Users size={18} className="text-sky-600" />
                            <span className="text-sm font-black uppercase tracking-widest text-gray-900">3. Select Participants</span>
                        </div>
                        <div className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-xl border border-gray-100 shadow-sm">
                            <span className="text-xs font-black text-gray-900">{totalGuests} Total</span>
                        </div>
                    </div>

                    <div className="grid gap-4">
                        {currentGuestTypes.map(gt => (
                            <div key={gt.name} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                                <div className="flex flex-col">
                                    <span className="text-sm font-black text-gray-950 group-hover:text-sky-600 transition-colors uppercase tracking-wide">{gt.name}</span>
                                    {gt.description && <span className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-tight">{gt.description}</span>}
                                    <span className="text-xs font-black text-sky-600 mt-1.5 flex items-center gap-1">
                                        €{gt.price} <span className="text-[9px] text-gray-400 font-bold uppercase">/ Person</span>
                                    </span>
                                </div>
                                <Stepper name={gt.name} value={counts[gt.name] || 0} min={gt.name === 'Adult' ? 1 : 0} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Price Breakdown Preview */}
                <div className="px-8 py-4 bg-gray-50/80 border-t border-gray-100">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                        <span>Currency</span>
                        <span>Official Price</span>
                    </div>
                    <div className="flex justify-between items-end mt-1">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-white rounded-lg border border-gray-200 flex items-center justify-center font-black text-[10px] text-gray-900 shadow-sm">€</div>
                            <span className="text-xs font-black text-gray-900 italic">Euro (Official)</span>
                        </div>
                        <span className="text-2xl font-black text-gray-950 tracking-tighter">€{totalPrice}</span>
                    </div>
                </div>

                <div className="p-8 pt-2">
                    {/* Inline validation error */}
                    {validationError && (
                        <div className="mb-4 px-4 py-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-bold text-rose-600 flex items-center gap-2">
                            <AlertTriangle size={14} />
                            {validationError}
                        </div>
                    )}

                    {/* Primary CTA */}
                    <button
                        onClick={handleInitialClick}
                        disabled={checkingOut || !selectedDate || !selectedTime || totalGuests === 0}
                        className={`w-full py-5 rounded-2xl font-black text-sm uppercase tracking-[0.3em] shadow-2xl transition-all duration-300 transform active:scale-[0.97] flex items-center justify-center gap-3 ${checkingOut || !selectedDate || !selectedTime || totalGuests === 0
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-gray-950 text-white hover:bg-sky-600 shadow-sky-100 hover:shadow-sky-300'
                            }`}
                    >
                        {checkingOut ? <Loader2 className="animate-spin" /> : (
                            <>
                                <span>Book Now{totalPrice > 0 ? ` — €${totalPrice}` : ''}</span>
                                <ChevronRight size={18} />
                            </>
                        )}
                    </button>

                    {/* Secondary: Add to cart */}
                    <button
                        onClick={handleAddToCart}
                        disabled={!selectedDate || !selectedTime || totalGuests === 0}
                        className="w-full mt-3 py-3 rounded-2xl font-bold text-xs uppercase tracking-[0.2em] transition-all duration-300 text-gray-400 hover:text-sky-600 disabled:opacity-30 flex items-center justify-center gap-2"
                    >
                        <ShoppingCart size={14} />
                        Add to cart instead
                    </button>

                    <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map(i => <Star key={i} size={10} className="fill-amber-400 text-amber-400" />)}
                            </div>
                            <span className="text-[10px] font-black text-gray-900 border-l border-gray-200 pl-3">4.9 / 5.0 Rating</span>
                        </div>
                        <div className="flex items-center gap-1.5 grayscale opacity-50">
                            <div className="w-5 h-3 bg-gray-200 rounded-sm"></div>
                            <div className="w-5 h-3 bg-gray-200 rounded-sm"></div>
                            <div className="w-5 h-3 bg-gray-200 rounded-sm"></div>
                        </div>
                    </div>
                </div>

            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/50 flex items-center gap-4 group cursor-default">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <CheckCircle size={20} />
                </div>
                <div>
                    <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest">Free Cancellation</h4>
                    <p className="text-[10px] font-bold text-gray-400 mt-0.5 tracking-tight uppercase">Full refund up to 24h before</p>
                </div>
            </div>
        </div>

        {showDrawer && (
            <CheckoutDrawer bookingData={drawerData} onClose={() => setShowDrawer(false)} />
        )}
        </>
    );
}

// Import urlFor for images
import { urlFor } from '@/sanity/lib/image';
