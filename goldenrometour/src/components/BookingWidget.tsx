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
                        <span className="text-[10px] font-heading font-bold tracking-tight text-primary bg-primary/5 px-4 py-1.5 rounded-full uppercase">Secure Archive Access</span>
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map(i => (
                                <div key={i} className={`w-7 h-7 rounded-full border-2 border-white bg-background overflow-hidden grayscale contrast-[1.1]`}>
                                    <Image src={`https://i.pravatar.cc/100?img=${i + 10}`} width={28} height={28} alt="User" />
                                </div>
                            ))}
                        </div>
                    </div>
                    <h3 className="text-2xl font-heading font-bold text-secondary flex items-center gap-2 uppercase">
                        Protocol Selection
                    </h3>
                </div>

                {/* Date Selection */}
                <div className="p-8 pt-4 space-y-8">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[10px] font-heading font-bold tracking-tight text-secondary/40 uppercase">1. Calendrical Alignment</span>
                            {selectedDate && <span className="text-xs font-heading font-bold text-primary flex items-center gap-1 uppercase"><CheckCircle size={12} /> {format(new Date(selectedDate), 'MMM dd, yyyy')}</span>}
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
                                <span className="text-[10px] font-heading font-bold tracking-tight text-secondary/40 uppercase">2. Slot Reservation</span>
                                {selectedTime && <span className="text-xs font-heading font-bold text-primary flex items-center gap-1 uppercase"><CheckCircle size={12} /> {selectedTime}</span>}
                            </div>

                            {loadingAvailability ? (
                                <div className="flex flex-col items-center justify-center py-10 bg-background/50 rounded-2xl border-2 border-dashed border-primary/20">
                                    <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
                                    <span className="text-[10px] text-secondary/40 font-heading font-bold tracking-tight uppercase">Scanning local records...</span>
                                </div>
                            ) : visibleSlots.length > 0 ? (
                                <div className="grid grid-cols-3 gap-3">
                                    {visibleSlots.map(slot => (
                                        <button
                                            key={slot.time}
                                            onClick={() => setSelectedTime(slot.time)}
                                            disabled={slot.available_slots === 0}
                                            className={`
                                                relative py-4 px-2 text-[11px] font-heading font-bold rounded-2xl border transition-all duration-300 text-center flex flex-col items-center justify-center gap-1 uppercase
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
                                <div className="text-[10px] text-accent font-heading font-bold py-8 px-4 bg-accent/5 rounded-2xl border border-accent/10 flex flex-col items-center justify-center gap-3 uppercase">
                                    <AlertTriangle size={24} className="text-accent" />
                                    <span className="tracking-tight">Archive Full for this Session</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Participants Selection */}
                <div className="px-8 py-8 bg-background/30 border-t border-primary/10">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <Users size={16} className="text-primary" />
                            <span className="text-[10px] font-heading font-bold tracking-tight text-secondary uppercase">3. Guest Registry</span>
                        </div>
                        <div className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-xl border border-primary/10 shadow-sm">
                            <span className="text-[10px] font-heading font-bold text-secondary uppercase">{totalGuests} Units</span>
                        </div>
                    </div>

                    <div className="grid gap-4">
                        {currentGuestTypes.map(gt => (
                            <div key={gt.name} className="flex items-center justify-between p-5 bg-white rounded-2xl border border-primary/5 shadow-sm hover:shadow-md transition-all group">
                                <div className="flex flex-col">
                                    <span className="text-xs font-heading font-bold text-secondary group-hover:text-primary transition-colors tracking-wide uppercase">{gt.name}</span>
                                    {gt.description && <span className="text-[9px] font-heading font-bold text-secondary/40 mt-1 tracking-tight uppercase">{gt.description}</span>}
                                    <span className="text-[10px] font-heading font-bold text-primary mt-2 flex items-center gap-1 uppercase">
                                        €{gt.price} <span className="text-[8px] text-secondary/30">/ Unit</span>
                                    </span>
                                </div>
                                <Stepper name={gt.name} value={counts[gt.name] || 0} min={gt.name === 'Adult' ? 1 : 0} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Price Breakdown Preview */}
                <div className="px-8 py-6 bg-secondary text-white border-t border-primary/10">
                    <div className="flex justify-between items-center text-[9px] font-heading font-bold tracking-tight text-primary/60 uppercase mb-2">
                        <span>Currency: EUR</span>
                        <span>Official Evaluation</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-2xl font-heading font-bold tracking-tighter uppercase">Evaluation</span>
                        <span className="text-4xl font-heading font-bold text-primary tracking-tighter">€{totalPrice}</span>
                    </div>
                </div>

                <div className="p-8 pt-6">
                    {/* Inline validation error */}
                    {validationError && (
                        <div className="mb-4 px-4 py-3 bg-accent/5 border border-accent/20 rounded-xl text-[10px] font-heading font-bold text-accent flex items-center gap-2 uppercase">
                            <AlertTriangle size={14} />
                            {validationError}
                        </div>
                    )}

                    {/* Primary CTA */}
                    <button
                        onClick={handleInitialClick}
                        disabled={checkingOut || !selectedDate || !selectedTime || totalGuests === 0}
                        className={`w-full py-6 rounded-2xl font-heading font-bold text-[10px] tracking-tight shadow-2xl transition-all duration-500 transform active:scale-[0.97] flex items-center justify-center gap-4 uppercase ${checkingOut || !selectedDate || !selectedTime || totalGuests === 0
                            ? 'bg-background text-secondary/30 cursor-not-allowed border border-secondary/5'
                            : 'bg-primary text-secondary hover:bg-white hover:text-secondary shadow-primary/20'
                            }`}
                    >
                        {checkingOut ? <Loader2 className="animate-spin" /> : (
                            <>
                                <span>Validate Booking{totalPrice > 0 ? ` • €${totalPrice}` : ''}</span>
                                <ChevronRight size={14} />
                            </>
                        )}
                    </button>

                    {/* Secondary: Add to cart */}
                    <button
                        onClick={handleAddToCart}
                        disabled={!selectedDate || !selectedTime || totalGuests === 0}
                        className="w-full mt-4 py-4 rounded-2xl font-heading font-bold text-[9px] tracking-tight transition-all duration-300 text-secondary/40 hover:text-primary disabled:opacity-20 flex items-center justify-center gap-2 uppercase"
                    >
                        <ShoppingCart size={12} />
                        Append to Folio
                    </button>

                    <div className="mt-8 pt-8 border-t border-secondary/5 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex gap-0.5">
                                {[1, 2, 3, 4, 5].map(i => <Star key={i} size={10} className="fill-primary text-primary" />)}
                            </div>
                            <span className="text-[8px] font-heading font-bold text-secondary/40 border-l border-secondary/10 pl-4 uppercase">5.0 / 5.0 Dossier Rating</span>
                        </div>
                        <div className="flex items-center gap-2 opacity-20 grayscale">
                            <div className="w-6 h-4 bg-secondary rounded-sm"></div>
                            <div className="w-6 h-4 bg-secondary rounded-sm"></div>
                            <div className="w-6 h-4 bg-secondary rounded-sm"></div>
                        </div>
                    </div>
                </div>

            </div>

            <div className="bg-secondary text-white rounded-2xl p-6 border border-primary/10 flex items-center gap-5 group cursor-default shadow-xl">
                <div className="w-12 h-12 rounded-xl bg-primary text-secondary flex items-center justify-center group-hover:scale-110 transition-transform">
                    <CheckCircle size={24} />
                </div>
                <div>
                    <h4 className="text-[10px] font-heading font-bold tracking-tight uppercase">Revocation Protocol</h4>
                    <p className="text-[9px] font-heading font-bold text-primary mt-1 tracking-tight uppercase">Full reimbursement within 24h</p>
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
