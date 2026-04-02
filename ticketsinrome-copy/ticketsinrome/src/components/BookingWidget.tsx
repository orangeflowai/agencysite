'use client';

import { useState, useEffect, useMemo } from 'react';
import { Calendar, User, CheckCircle, Loader2, Info, Users, Clock, AlertTriangle, Star, Minus, Plus, ChevronRight, ShoppingCart, Shield } from 'lucide-react';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import GuestDetailsModal, { GuestDetail } from './GuestDetailsModal';
import Image from 'next/image';
import SmartCalendar from './ui/SmartCalendar';
import { format } from 'date-fns';
import { useSite } from '@/components/SiteProvider';
import { useCart } from '@/context/CartContext';

// Site-specific Stripe publishable keys
const PUBLISHABLE_KEYS: Record<string, string> = {
    'rome-tour-tickets': process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_ROME || process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
    'wondersofrome': process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_WONDERS || process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
};

interface GuestType {
    name: string;
    price: number;
    description?: string;
}

interface BookingWidgetProps {
    tour: {
        _id?: string;
        title: string;
        price: number;
        slug: { current: string }; // We need slug for API
        mainImage?: any;
        category?: string;
        guestTypes?: GuestType[];
    };
}

interface TimeSlot {
    time: string;
    available_slots: number;
}

export default function BookingWidget({ tour }: BookingWidgetProps) {
    const site = useSite();
    const { addToCart } = useCart();
    const siteId = site?.slug?.current || process.env.NEXT_PUBLIC_SITE_ID || 'rome-tour-tickets';

    // Initialize Stripe with site-specific key
    const stripePromise = useMemo(() => {
        const key = PUBLISHABLE_KEYS[siteId] || PUBLISHABLE_KEYS['rome-tour-tickets'];
        if (!key) {
            console.error('Stripe publishable key not configured for site:', siteId);
            return null;
        }
        return loadStripe(key);
    }, [siteId]);

    // Use dynamic guest types if provided, otherwise fallback to default
    const guestTypes = useMemo(() => {
        if (tour.guestTypes && tour.guestTypes.length > 0) {
            return tour.guestTypes;
        }
        return [
            { name: 'Adult', price: tour.price, description: 'Age 26+' },
            { name: 'Student', price: tour.price, description: 'ID Required' },
            { name: 'Youth', price: tour.price, description: 'Under 18' },
        ];
    }, [tour]);

    // Ticket Counts state - dynamic based on guest types
    const [counts, setCounts] = useState<Record<string, number>>(() => {
        const initial: Record<string, number> = {};
        guestTypes.forEach((gt, idx) => {
            initial[gt.name] = idx === 0 ? 1 : 0; // Default 1 for first type
        });
        return initial;
    });

    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');

    const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
    const [loadingAvailability, setLoadingAvailability] = useState(false);

    // Checkout State
    const [checkingOut, setCheckingOut] = useState(false);

    // Derived State
    const totalGuests = Object.values(counts || {}).reduce((sum, val) => sum + (val || 0), 0);
    const totalPrice = guestTypes.reduce((sum, gt) => sum + (counts[gt.name] || 0) * gt.price, 0);

    const activeSlot = timeSlots.find(s => s.time === selectedTime);

    const maxSelectable = useMemo(() => {
        const byParticipants = typeof (tour as any)?.maxParticipants === 'number' ? (tour as any).maxParticipants as number : Number.POSITIVE_INFINITY;
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
        if (!selectedDate) {
            alert('Please select a date first');
            return;
        }
        if (!selectedTime) {
            alert('Please select a time');
            return;
        }

        const available = activeSlot?.available_slots || 0;
        if (available < totalGuests) {
            alert(`Sorry, only ${available} spots left for this time.`);
            return;
        }
        if (Number.isFinite(maxSelectable) && totalGuests > maxSelectable) {
            alert(`You can select up to ${maxSelectable} participants for this slot.`);
            return;
        }

        // Add to cart
        addToCart({
            id: `${tour._id || tour.slug.current}-${selectedDate}-${selectedTime}-${Date.now()}`,
            tourId: tour._id || tour.slug.current,
            tourTitle: tour.title,
            tourSlug: tour.slug.current,
            date: selectedDate,
            time: selectedTime,
            guestCounts: counts, // Use expanded object
            price: totalPrice,
            image: tour.mainImage ? urlFor(tour.mainImage).url() : undefined,
        });

        // Reset selection after adding to cart
        alert('Added to cart! You can continue shopping or proceed to checkout.');
    };

    const handleInitialClick = () => {
        if (!selectedDate) {
            alert('Please select a date first');
            return;
        }
        if (!selectedTime) {
            alert('Please select a time');
            return;
        }

        const available = activeSlot?.available_slots || 0;
        if (available < totalGuests) {
            alert(`Sorry, only ${available} spots left for this time.`);
            return;
        }
        if (Number.isFinite(maxSelectable) && totalGuests > maxSelectable) {
            alert(`You can select up to ${maxSelectable} participants for this slot.`);
            return;
        }

        // GO STRAIGHT TO CHECKOUT - No speed bumps!
        processCheckout();
    };

    const processCheckout = async () => {
        const bookingData = {
            tour: {
                _id: tour._id,
                title: tour.title,
                slug: tour.slug,
                price: tour.price,
                mainImage: tour.mainImage,
                category: tour.category,
                guestTypes: guestTypes,
                meetingPoint: (tour as any).meetingPoint,
                maxParticipants: (tour as any).maxParticipants,
            },
            date: selectedDate,
            time: selectedTime,
            guestCounts: counts,
            totalPrice,
            // details will be collected on the checkout page
        };

        const encodedData = encodeURIComponent(JSON.stringify(bookingData));
        window.location.href = `/checkout?data=${encodedData}`;
    };

    // Helper for Stepper
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Stepper = ({ value, setValue, min = 0, max = 20 }: any) => (
        <div className="flex items-center gap-3">
            <button
                onClick={() => setValue(Math.max(min, value - 1))}
                disabled={value <= min}
                className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:border-emerald-500 hover:text-emerald-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
            >
                <Minus size={16} />
            </button>
            <span className="w-6 text-center font-black text-gray-900 text-lg">{value}</span>
            <button
                onClick={() => {
                    const nextTotal = Object.values(counts || {}).reduce((sum, c) => sum + (c || 0), 0) + 1;
                    if (Number.isFinite(maxSelectable) && nextTotal > maxSelectable) return;
                    setValue(Math.min(max, value + 1));
                }}
                disabled={value >= max || (Number.isFinite(maxSelectable) && (Object.values(counts || {}).reduce((s, c) => s + (c || 0), 0) >= maxSelectable))}
                className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-emerald-600 hover:bg-emerald-50 hover:border-emerald-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
            >
                <Plus size={16} />
            </button>
        </div>
    );

    return (
        <div className="space-y-4">
            <div className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100/50 overflow-hidden">


                {/* Header: Title */}
                <div className="px-8 pt-8 pb-2">
                    <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-emerald-600" />
                        </div>
                        Book Your Tour
                    </h3>
                    <p className="text-gray-500 mt-2 font-medium">Secure your preferred date and time.</p>
                </div>

                {/* Date & Time Selection */}
                <div className="p-8 space-y-8">
                    <div>
                        <SmartCalendar
                            slug={tour.slug.current}
                            selectedDate={selectedDate ? new Date(selectedDate) : undefined}
                            onSelect={(d) => setSelectedDate(d ? format(d, 'yyyy-MM-dd') : '')}
                            basePrice={tour.price}
                        />
                    </div>

                    {selectedDate && (
                        <div className="animate-in fade-in slide-in-from-top-4 duration-500 border-t border-gray-100 pt-8">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-emerald-600" />
                                    <span className="text-sm font-black text-gray-900 uppercase tracking-widest">Available Times</span>
                                </div>
                                <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-full uppercase tracking-tighter">Rome Time (CET)</span>
                            </div>

                            {loadingAvailability ? (
                                <div className="flex items-center justify-center py-10 bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-100">
                                    <Loader2 className="w-6 h-6 animate-spin text-emerald-600 mr-3" />
                                    <span className="text-sm text-gray-500 font-bold">Reserving slots...</span>
                                </div>
                            ) : visibleSlots.length > 0 ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {visibleSlots.map(slot => (
                                        <button
                                            key={slot.time}
                                            onClick={() => setSelectedTime(slot.time)}
                                            disabled={slot.available_slots === 0}
                                            className={`
                                                relative py-4 px-2 text-sm font-black rounded-2xl border-2 transition-all duration-300 text-center
                                                ${selectedTime === slot.time
                                                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-[0_10px_20px_rgba(16,185,129,0.3)] scale-[1.05] z-10'
                                                    : 'bg-white text-gray-700 border-gray-100 hover:border-emerald-500 hover:text-emerald-600 hover:shadow-xl hover:-translate-y-1'
                                                }
                                                ${slot.available_slots === 0 ? 'opacity-30 cursor-not-allowed bg-gray-50 text-gray-400 border-gray-100' : ''}
                                            `}
                                        >
                                            {slot.time}
                                            {slot.available_slots < 5 && slot.available_slots > 0 &&
                                                <span className="absolute -top-2 -right-1 bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full shadow-lg font-black z-20 animate-pulse">
                                                    {slot.available_slots} Left
                                                </span>
                                            }
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-sm text-rose-600 font-black py-5 px-6 bg-rose-50 rounded-2xl border-2 border-rose-100 flex items-center justify-center gap-3">
                                    <AlertTriangle size={20} />
                                    No slots available for this date
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Participants Selection */}
                <div className="px-8 py-8 bg-gray-50/50 space-y-6 border-t border-gray-100">
                    <div className="flex items-center gap-2 mb-2">
                        <Users className="w-5 h-5 text-emerald-600" />
                        <span className="text-sm font-black text-gray-900 uppercase tracking-widest">Who is coming?</span>
                    </div>

                    <div className="grid gap-4">
                        {guestTypes.map((gt) => (
                            <div key={gt.name} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="block text-base font-black text-gray-900">{gt.name}</span>
                                        {gt.name !== 'Adult' && (
                                            <span className="text-[10px] font-black bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full uppercase">Special</span>
                                        )}
                                    </div>
                                    <div className="flex items-baseline gap-2 mt-1">
                                        <span className="text-lg font-black text-emerald-600">€{gt.price}</span>
                                        {gt.description && <span className="text-xs text-gray-400 font-medium tracking-tight">/ {gt.description}</span>}
                                    </div>
                                </div>
                                <Stepper
                                    value={counts[gt.name] || 0}
                                    setValue={(v: number) => {
                                        const diff = v - (counts[gt.name] || 0);
                                        const nextTotal = Object.values(counts || {}).reduce((sum, c) => sum + (c || 0), 0) + diff;
                                        if (diff > 0 && Number.isFinite(maxSelectable) && nextTotal > maxSelectable) return;
                                        setCounts({ ...counts, [gt.name]: v });
                                    }}
                                    min={gt.name === 'Adult' ? 1 : 0}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer Action - Sticky Style */}
                <div className="p-8 border-t border-gray-100 bg-white">
                    <div className="flex justify-between items-end mb-6">
                        <div>
                            <span className="block text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-2 leading-none">Estimate Total</span>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-black text-emerald-600 tracking-tighter">€{totalPrice.toFixed(0)}</span>
                                <span className="text-gray-400 text-sm font-bold uppercase tracking-widest">Total</span>
                            </div>
                        </div>
                        {totalGuests > 0 && (
                            <div className="flex flex-col items-end">
                                <div className="flex -space-x-2 mb-2">
                                    {[...Array(Math.min(3, totalGuests))].map((_, i) => (
                                        <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-emerald-100 flex items-center justify-center">
                                            <User size={14} className="text-emerald-600" />
                                        </div>
                                    ))}
                                    {totalGuests > 3 && (
                                        <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] font-black text-gray-500">
                                            +{totalGuests - 3}
                                        </div>
                                    )}
                                </div>
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">{totalGuests} Travel{totalGuests !== 1 ? 'ers' : 'er'}</span>
                            </div>
                        )}
                    </div>

                    <div className="grid gap-3">
                        <button
                            onClick={handleAddToCart}
                            disabled={!selectedDate || !selectedTime || totalGuests === 0}
                            className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-3 border-2 ${(!selectedDate || !selectedTime || totalGuests === 0)
                                ? 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed'
                                : 'bg-white border-emerald-600 text-emerald-600 hover:bg-emerald-50 hover:shadow-xl hover:shadow-emerald-50'
                                }`}
                        >
                            <ShoppingCart size={20} strokeWidth={3} />
                            Add to Cart
                        </button>

                        <button
                            onClick={handleInitialClick}
                            disabled={checkingOut || !selectedDate || !selectedTime || totalGuests === 0}
                            className="group relative w-full py-5 rounded-2xl font-black text-sm shadow-2xl uppercase tracking-[0.3em] transition-all duration-500 overflow-hidden bg-emerald-600 text-white shadow-emerald-200 hover:shadow-emerald-400 hover:-translate-y-1 hover:scale-[1.02] active:scale-95 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed disabled:shadow-none"
                        >
                            <div className="absolute inset-0 bg-linear-to-r from-emerald-400/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                            {checkingOut ?
                                <span className="flex items-center justify-center gap-3"><Loader2 className="animate-spin" /> Finalizing...</span> :
                                <span className="flex items-center justify-center gap-3">Confirm Booking <ChevronRight size={22} strokeWidth={3} /></span>
                            }
                        </button>
                    </div>

                    <div className="mt-6 flex items-center justify-center gap-6">
                        <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            <CheckCircle size={14} className="text-emerald-500" strokeWidth={3} />
                            Instant Confirm
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            <Star size={14} className="text-amber-400 fill-amber-400" />
                            Best Price
                        </div>
                    </div>
                </div>

            </div>

            {/* Social Proof / Security */}
            <div className="px-4 py-3 flex items-center justify-center gap-4 border border-gray-200 rounded-2xl bg-white/50 backdrop-blur-sm">
                <Image src="/images/visa-logo.svg" alt="Visa" width={32} height={10} className="grayscale opacity-50" />
                <Image src="/images/mastercard-logo.svg" alt="Mastercard" width={24} height={15} className="grayscale opacity-50" />
                <div className="w-px h-6 bg-gray-200" />
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter flex items-center gap-1">
                    <Shield size={10} /> 256-Bit SSL Secure
                </span>
            </div>
        </div>
    );
}

// Import urlFor for images
import { urlFor } from '@/sanity/lib/image';
