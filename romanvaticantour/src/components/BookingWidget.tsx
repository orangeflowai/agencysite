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
import { urlFor } from '@/lib/dataAdapter';

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

    const [checkingOut, setCheckingOut] = useState(false);
    const [validationError, setValidationError] = useState('');
    const [showDrawer, setShowDrawer] = useState(false);
    const [drawerData, setDrawerData] = useState<any>(null);

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
                meetingPoint: (tour as any).meetingPoint,
            },
            date: selectedDate, time: selectedTime,
            guestCounts: counts, totalPrice,
        };
        setDrawerData(data);
        setShowDrawer(true);
    };

    const Stepper = ({ name, value, min = 0, max = 50 }: { name: string, value: number, min?: number, max?: number }) => (
        <div className="flex items-center gap-3">
            <button
                onClick={() => setCounts(prev => ({ ...prev, [name]: Math.max(min, (prev[name] || 0) - 1) }))}
                disabled={value <= min}
                className="w-10 h-10 rounded-xl border border-[#b19681]/20 flex items-center justify-center text-[#85766a] hover:bg-[#e7dbbf] hover:text-[#5c4b3e] disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95 shadow-sm"
            >
                <Minus size={16} />
            </button>
            <span className="w-6 text-center font-serif font-black text-[#5c4b3e] text-lg italic">{value}</span>
            <button
                onClick={() => {
                    const nextTotal = Object.values(counts || {}).reduce((sum, c) => sum + (c || 0), 0) + 1;
                    if (Number.isFinite(maxSelectable) && nextTotal > maxSelectable) return;
                    setCounts(prev => ({ ...prev, [name]: Math.min(max, (prev[name] || 0) + 1) }));
                }}
                disabled={value >= max || (Number.isFinite(maxSelectable) && (Object.values(counts || {}).reduce((s, c) => s + (c || 0), 0) >= maxSelectable))}
                className="w-10 h-10 rounded-xl border border-[#b19681]/20 flex items-center justify-center text-primary hover:bg-[#e7dbbf] disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95 shadow-sm"
            >
                <Plus size={16} />
            </button>
        </div>
    );

    return (
        <>
        <div className="space-y-4 widget-scope">
            <div className="bg-card rounded-3xl shadow-[0_20px_50px_rgba(141,157,79,0.08)] border border-[#b19681]/20 overflow-hidden font-sans">

                {/* Header: Title */}
                <div className="px-8 pt-8 pb-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary bg-primary/10 px-3 py-1 rounded-full">Secure Booking</span>
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map(i => (
                                <div key={i} className={`w-6 h-6 rounded-full border-2 border-card bg-primary/20 overflow-hidden`}>
                                    <Image src={`https://i.pravatar.cc/100?img=${i + 10}`} width={24} height={24} alt="User" />
                                </div>
                            ))}
                        </div>
                    </div>
                    <p className="text-xl font-serif font-black text-[#5c4b3e] leading-tight italic">Book Your Experience</p>
                </div>

                {/* Date Selection */}
                <div className="p-8 pt-4 space-y-8">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#85766a]">1. Select Date</span>
                            {selectedDate && <span className="text-xs font-bold text-primary flex items-center gap-1"><CheckCircle size={12} /> {format(new Date(selectedDate), 'MMM dd, yyyy')}</span>}
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
                                <span className="text-[10px] font-black uppercase tracking-widest text-[#85766a]">2. Select Time</span>
                                {selectedTime && <span className="text-xs font-bold text-primary flex items-center gap-1"><CheckCircle size={12} /> {selectedTime}</span>}
                            </div>

                            {loadingAvailability ? (
                                <div className="flex flex-col items-center justify-center py-10 bg-[#e7dbbf]/30 rounded-2xl border-2 border-dashed border-[#b19681]/20">
                                    <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
                                    <span className="text-[10px] text-[#85766a] font-black uppercase tracking-[0.2em]">Scanning local times...</span>
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
                                                    ? 'bg-primary text-white border-primary shadow-xl shadow-primary/10 scale-[1.05] z-10'
                                                    : 'bg-white/50 text-[#5c4b3e] border-[#b19681]/20 hover:border-primary/30 hover:bg-white/80'
                                                }
                                                ${slot.available_slots === 0 ? 'opacity-30 cursor-not-allowed bg-gray-50 grayscale' : ''}
                                            `}
                                        >
                                            <span className="text-base font-serif italic">{slot.time}</span>
                                            {slot.available_slots < 5 && slot.available_slots > 0 &&
                                                <span className={`text-[9px] font-black uppercase tracking-tight ${selectedTime === slot.time ? 'text-white/80' : 'text-accent'}`}>
                                                    {slot.available_slots} Left
                                                </span>
                                            }
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-sm text-destructive font-black py-6 px-4 bg-destructive/5 rounded-2xl border-2 border-destructive/10 flex flex-col items-center justify-center gap-3">
                                    <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center">
                                        <AlertTriangle size={24} className="text-destructive" />
                                    </div>
                                    <span className="uppercase tracking-widest text-[10px] font-sans">Fully booked for this date</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Participants Selection */}
                <div className="px-8 py-8 bg-[#e7dbbf]/30 border-t border-[#b19681]/20">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <Users size={18} className="text-primary" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#5c4b3e]">3. Select Participants</span>
                        </div>
                        <div className="flex items-center gap-1 bg-white/50 px-3 py-1.5 rounded-xl border border-[#b19681]/20 shadow-sm">
                            <span className="text-[10px] font-black text-[#5c4b3e] uppercase tracking-widest">{totalGuests} Total</span>
                        </div>
                    </div>

                    <div className="grid gap-4">
                        {currentGuestTypes.map(gt => (
                            <div key={gt.name} className="flex items-center justify-between p-4 bg-white/40 backdrop-blur-sm rounded-2xl border border-[#b19681]/20 shadow-sm hover:shadow-md transition-all group">
                                <div className="flex flex-col">
                                    <span className="text-sm font-serif font-black text-[#5c4b3e] group-hover:text-primary transition-colors uppercase tracking-wide italic">{gt.name}</span>
                                    {gt.description && <span className="text-[9px] font-black text-[#85766a] mt-0.5 uppercase tracking-[0.1em]">{gt.description}</span>}
                                    <span className="text-xs font-black text-primary mt-1 flex items-center gap-1">
                                        €{gt.price} <span className="text-[8px] text-[#85766a] font-black uppercase tracking-widest">/ Person</span>
                                    </span>
                                </div>
                                <Stepper name={gt.name} value={counts[gt.name] || 0} min={gt.name === 'Adult' ? 1 : 0} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Price Breakdown Preview */}
                <div className="px-8 py-4 bg-[#e7dbbf]/50 border-t border-[#b19681]/20">
                    <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-[0.2em] text-[#85766a]">
                        <span>Currency</span>
                        <span>Official Price</span>
                    </div>
                    <div className="flex justify-between items-end mt-1">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-white rounded-lg border border-[#b19681]/20 flex items-center justify-center font-serif font-black text-[10px] text-[#5c4b3e] shadow-sm italic">€</div>
                            <span className="text-[10px] font-black text-[#5c4b3e] uppercase tracking-widest">Euro (Official)</span>
                        </div>
                        <span className="text-2xl font-serif font-black text-[#5c4b3e] tracking-tighter italic">€{totalPrice}</span>
                    </div>
                </div>

                <div className="p-8 pt-2">
                    {/* Inline validation error */}
                    {validationError && (
                        <div className="mb-4 px-4 py-3 bg-destructive/5 border border-destructive/20 rounded-xl text-[10px] font-black text-destructive uppercase tracking-widest flex items-center gap-2">
                            <AlertTriangle size={14} />
                            {validationError}
                        </div>
                    )}

                    {/* Primary CTA */}
                    <button
                        onClick={handleInitialClick}
                        disabled={checkingOut || !selectedDate || !selectedTime || totalGuests === 0}
                        className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl transition-all duration-500 transform active:scale-[0.97] flex items-center justify-center gap-3 ${checkingOut || !selectedDate || !selectedTime || totalGuests === 0
                            ? 'bg-[#b19681]/20 text-[#85766a] cursor-not-allowed'
                            : 'bg-[#5c4b3e] text-white hover:bg-primary shadow-primary/10 hover:shadow-primary/30'
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
                        className="w-full mt-4 py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] transition-all duration-300 text-[#85766a] hover:text-primary disabled:opacity-30 flex items-center justify-center gap-2"
                    >
                        <ShoppingCart size={14} />
                        Add to cart instead
                    </button>

                    <div className="mt-6 pt-6 border-t border-[#b19681]/20 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex gap-0.5">
                                {[1, 2, 3, 4, 5].map(i => <Star key={i} size={10} className="fill-accent text-accent" />)}
                            </div>
                            <span className="text-[9px] font-black text-[#5c4b3e] uppercase tracking-widest border-l border-[#b19681]/30 pl-3">4.9 / 5.0 Rating</span>
                        </div>
                        <div className="flex items-center gap-1.5 grayscale opacity-30">
                            <div className="w-5 h-3 bg-primary rounded-sm"></div>
                            <div className="w-5 h-3 bg-primary rounded-sm"></div>
                            <div className="w-5 h-3 bg-primary rounded-sm"></div>
                        </div>
                    </div>
                </div>

            </div>

            <div className="bg-[#e4d7b0]/60 backdrop-blur-sm rounded-2xl p-4 border border-white/20 flex items-center gap-4 group cursor-default shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                    <CheckCircle size={20} />
                </div>
                <div>
                    <p className="text-[10px] font-black text-[#5c4b3e] uppercase tracking-[0.15em] leading-none">Free Cancellation</p>
                    <p className="text-[9px] font-bold text-[#85766a] mt-1 tracking-tight uppercase">Full refund up to 24h before</p>
                </div>
            </div>
        </div>

        {showDrawer && (
            <CheckoutDrawer bookingData={drawerData} onClose={() => setShowDrawer(false)} />
        )}
        </>
    );
}
