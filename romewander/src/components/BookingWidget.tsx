'use client';

import { useState, useEffect, useMemo } from 'react';
import {
    Calendar, Users, CheckCircle, Loader2,
    AlertTriangle, Star, Minus, Plus, ChevronRight, ShoppingCart, Clock
} from 'lucide-react';
import Image from 'next/image';
import SmartCalendar from './ui/SmartCalendar';
import { format } from 'date-fns';
import { useSite } from '@/components/SiteProvider';
import { useCart } from '@/context/CartContext';
import CheckoutDrawer from './CheckoutDrawer';
import { urlFor } from '@/lib/dataAdapter';
import dynamic from 'next/dynamic';

// Lazy-load the checkout modal
const CheckoutModal = dynamic(() => import('./CheckoutModal'), { ssr: false });

interface GuestType {
    name: string;
    price: number;
    description?: string;
}

interface BookingWidgetProps {
    tour: {
        _id: string;
        title: string;
        price: number;
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

    // Use dynamic guest types if provided, otherwise fallback
    const currentGuestTypes = useMemo(() => {
        if (tour.guestTypes && tour.guestTypes.length > 0) return tour.guestTypes;
        return [
            { name: 'Adult', price: tour.price, description: 'Age 18+' },
            { name: 'Student', price: Math.round(tour.price * 0.85), description: 'ID Required' },
            { name: 'Youth', price: Math.round(tour.price * 0.70), description: 'Under 18' },
            { name: 'Child', price: Math.round(tour.price * 0.50), description: 'Under 8' },
        ];
    }, [tour]);

    // Ticket Counts
    const [counts, setCounts] = useState<Record<string, number>>({});
    useEffect(() => {
        const init: Record<string, number> = {};
        currentGuestTypes.forEach((gt, idx) => { init[gt.name] = idx === 0 ? 1 : 0; });
        setCounts(init);
    }, [currentGuestTypes]);

    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
    const [loadingAvailability, setLoadingAvailability] = useState(false);
    const [validationError, setValidationError] = useState('');
    const [showDrawer, setShowDrawer] = useState(false);
    const [drawerData, setDrawerData] = useState<any>(null);

    const totalGuests = Object.values(counts || {}).reduce((s, c) => s + (c || 0), 0);
    const totalPrice = useMemo(() =>
        currentGuestTypes.reduce((sum, gt) => sum + (counts[gt.name] || 0) * gt.price, 0),
        [counts, currentGuestTypes]
    );

    const activeSlot = timeSlots.find(s => s.time === selectedTime);
    const maxSelectable = useMemo(() => {
        const byParticipants = typeof tour?.maxParticipants === 'number' ? tour.maxParticipants : Infinity;
        const byAvailability = activeSlot?.available_slots ?? Infinity;
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

    // Fetch availability when date changes
    useEffect(() => {
        if (!selectedDate) { setTimeSlots([]); return; }
        async function check() {
            setLoadingAvailability(true);
            setTimeSlots([]);
            setSelectedTime('');
            try {
                const res = await fetch(`/api/availability?slug=${tour.slug.current}&date=${selectedDate}`);
                const data = await res.json();
                setTimeSlots(data.slots || []);
            } catch { console.error('Availability check failed'); }
            finally { setLoadingAvailability(false); }
        }
        check();
    }, [selectedDate, tour.slug.current]);

    const validate = () => {
        if (!selectedDate) { setValidationError('Please select a date first'); return false; }
        if (!selectedTime) { setValidationError('Please select a time slot'); return false; }
        const available = activeSlot?.available_slots || 0;
        if (available < totalGuests) { setValidationError(`Only ${available} spots left for this time`); return false; }
        if (isFinite(maxSelectable) && totalGuests > maxSelectable) { setValidationError(`Max ${maxSelectable} participants for this slot`); return false; }
        if (totalGuests === 0) { setValidationError('Please select at least 1 guest'); return false; }
        setValidationError('');
        return true;
    };

    const handleAddToCart = () => {
        if (!validate()) return;
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

    const handleBookNow = () => {
        if (!validate()) return;
        const data = {
            tour: {
                _id: tour._id, title: tour.title, slug: tour.slug,
                price: tour.price, guestTypes: tour.guestTypes,
                mainImage: tour.mainImage, category: tour.category,
                meetingPoint: tour.meetingPoint,
            },
            date: selectedDate, time: selectedTime,
            guestCounts: counts, totalPrice,
        };
        setDrawerData(data);
        setShowDrawer(true);
    };

    // Helper Stepper
    const Stepper = ({ name, value, min = 0 }: { name: string; value: number; min?: number }) => (
        <div className="flex items-center gap-2">
            <button
                onClick={() => setCounts(prev => ({ ...prev, [name]: Math.max(min, (prev[name] || 0) - 1) }))}
                disabled={value <= min}
                className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
            >
                <Minus size={14} />
            </button>
            <span className="w-5 text-center font-black text-gray-900 text-base">{value}</span>
            <button
                onClick={() => {
                    const nextTotal = Object.values(counts || {}).reduce((s, c) => s + (c || 0), 0) + 1;
                    if (isFinite(maxSelectable) && nextTotal > maxSelectable) return;
                    setCounts(prev => ({ ...prev, [name]: (prev[name] || 0) + 1 }));
                }}
                disabled={isFinite(maxSelectable) && Object.values(counts || {}).reduce((s, c) => s + (c || 0), 0) >= maxSelectable}
                className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-[#C9A84C] hover:bg-[#C9A84C]/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
            >
                <Plus size={14} />
            </button>
        </div>
    );

    return (
        <>
            <div className="space-y-4 lg:sticky lg:top-28">
                <div className="bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden">

                    {/* Header */}
                    <div className="px-6 pt-6 pb-4 bg-[#1A1210]">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#C9A84C]">✦ Secure Booking ✦</span>
                            <div className="flex -space-x-1.5">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-5 h-5 rounded-full border-2 border-[#1A1210] overflow-hidden">
                                        <Image src={`https://i.pravatar.cc/100?img=${i + 10}`} width={20} height={20} alt="Guest" />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <h3 className="text-xl font-serif font-bold text-white">Book Your Experience</h3>
                        <p className="text-[#C9A84C]/80 text-xs mt-1">From <span className="text-[#C9A84C] font-black text-lg">€{tour.price}</span> per person</p>
                    </div>

                    {/* Date Selection */}
                    <div className="p-6 space-y-6">
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-black uppercase tracking-widest text-gray-500 flex items-center gap-1.5">
                                    <Calendar size={12} className="text-[#C9A84C]" /> 1. Select Date
                                </span>
                                {selectedDate && (
                                    <span className="text-xs font-bold text-[#C9A84C] flex items-center gap-1">
                                        <CheckCircle size={11} /> {format(new Date(selectedDate), 'MMM dd, yyyy')}
                                    </span>
                                )}
                            </div>
                            <SmartCalendar
                                slug={tour.slug.current}
                                selectedDate={selectedDate ? new Date(selectedDate) : undefined}
                                onSelect={(d) => setSelectedDate(d ? format(d, 'yyyy-MM-dd') : '')}
                                basePrice={tour.price}
                            />
                        </div>

                        {/* Time Slots */}
                        {selectedDate && (
                            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-black uppercase tracking-widest text-gray-500 flex items-center gap-1.5">
                                        <Clock size={12} className="text-[#C9A84C]" /> 2. Select Time
                                    </span>
                                    {selectedTime && (
                                        <span className="text-xs font-bold text-[#C9A84C] flex items-center gap-1">
                                            <CheckCircle size={11} /> {selectedTime}
                                        </span>
                                    )}
                                </div>

                                {loadingAvailability ? (
                                    <div className="flex flex-col items-center justify-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-100">
                                        <Loader2 className="w-6 h-6 animate-spin text-[#C9A84C] mb-2" />
                                        <span className="text-xs text-gray-500 font-bold uppercase tracking-widest">Checking availability...</span>
                                    </div>
                                ) : visibleSlots.length > 0 ? (
                                    <div className="grid grid-cols-3 gap-2">
                                        {visibleSlots.map(slot => (
                                            <button
                                                key={slot.time}
                                                onClick={() => setSelectedTime(slot.time)}
                                                disabled={slot.available_slots === 0}
                                                className={`relative py-3 px-2 text-sm font-black rounded-lg border-2 transition-all duration-200 text-center flex flex-col items-center justify-center gap-0.5 ${selectedTime === slot.time
                                                    ? 'bg-[#C9A84C] text-white border-[#C9A84C] shadow-lg shadow-[#C9A84C]/20 scale-[1.03]'
                                                    : 'bg-white text-gray-900 border-gray-100 hover:border-[#C9A84C] hover:bg-[#C9A84C]/5'
                                                    } ${slot.available_slots === 0 ? 'opacity-30 cursor-not-allowed' : ''}`}
                                            >
                                                <span className="text-sm">{slot.time}</span>
                                                {slot.available_slots < 5 && slot.available_slots > 0 && (
                                                    <span className={`text-[9px] font-bold uppercase ${selectedTime === slot.time ? 'text-white/80' : 'text-rose-500'}`}>
                                                        {slot.available_slots} left
                                                    </span>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-6 px-4 bg-rose-50 rounded-xl border-2 border-rose-100">
                                        <AlertTriangle size={20} className="text-rose-500 mx-auto mb-2" />
                                        <p className="text-xs font-bold uppercase tracking-widest text-rose-600">Fully booked for this date</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Participants */}
                    <div className="px-6 py-5 bg-gray-50/50 border-t border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-xs font-black uppercase tracking-widest text-gray-500 flex items-center gap-1.5">
                                <Users size={12} className="text-[#C9A84C]" /> 3. Participants
                            </span>
                            <div className="text-xs font-black text-gray-900 bg-white px-2 py-1 rounded-lg border border-gray-100">
                                {totalGuests} Total
                            </div>
                        </div>
                        <div className="space-y-3">
                            {currentGuestTypes.map(gt => (
                                <div key={gt.name} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100 hover:border-[#C9A84C]/30 transition-colors group">
                                    <div>
                                        <p className="text-xs font-black text-gray-900 uppercase tracking-wide group-hover:text-[#C9A84C] transition-colors">{gt.name}</p>
                                        {gt.description && <p className="text-[10px] text-gray-400 uppercase">{gt.description}</p>}
                                        <p className="text-xs font-black text-[#C9A84C] mt-0.5">€{gt.price}</p>
                                    </div>
                                    <Stepper name={gt.name} value={counts[gt.name] || 0} min={gt.name === 'Adult' ? 1 : 0} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Price + CTA */}
                    <div className="p-6 pt-4">
                        {/* Price */}
                        <div className="flex justify-between items-center mb-4 py-3 border-t border-gray-100">
                            <span className="text-xs font-black uppercase tracking-widest text-gray-400">Total (EUR)</span>
                            <span className="text-2xl font-black text-[#1A1210]">€{totalPrice}</span>
                        </div>

                        {/* Validation Error */}
                        {validationError && (
                            <div className="flex items-center gap-2 text-rose-600 text-xs font-bold bg-rose-50 p-3 rounded-lg border border-rose-100 mb-3">
                                <AlertTriangle size={14} className="shrink-0" />
                                {validationError}
                            </div>
                        )}

                        {/* Book Now */}
                        <button
                            onClick={handleBookNow}
                            disabled={!selectedDate || !selectedTime || totalGuests === 0}
                            className={`w-full py-4 rounded-xl font-black text-sm uppercase tracking-[0.25em] shadow-xl transition-all duration-300 flex items-center justify-center gap-2 ${
                                !selectedDate || !selectedTime || totalGuests === 0
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-[#1A1210] text-white hover:bg-[#C9A84C] shadow-[#1A1210]/20 hover:shadow-[#C9A84C]/30 active:scale-[0.97]'
                            }`}
                        >
                            <span>Book Now{totalPrice > 0 ? ` — €${totalPrice}` : ''}</span>
                            <ChevronRight size={18} />
                        </button>

                        {/* Add to Cart */}
                        <button
                            onClick={handleAddToCart}
                            disabled={!selectedDate || !selectedTime || totalGuests === 0}
                            className="w-full mt-2.5 py-3 rounded-xl font-bold text-xs uppercase tracking-[0.2em] transition-all duration-300 text-gray-400 hover:text-[#C9A84C] disabled:opacity-30 flex items-center justify-center gap-2"
                        >
                            <ShoppingCart size={13} />
                            Add to cart instead
                        </button>

                        {/* Rating */}
                        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="flex gap-0.5">
                                    {[1,2,3,4,5].map(i => <Star key={i} size={10} className="fill-amber-400 text-amber-400" />)}
                                </div>
                                <span className="text-[10px] font-black text-gray-700 border-l border-gray-200 pl-2">4.9 / 5.0</span>
                            </div>
                            <span className="text-[10px] font-bold text-gray-400">Free Cancellation</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Checkout Drawer */}
            {showDrawer && (
                <CheckoutDrawer
                    bookingData={drawerData}
                    onClose={() => setShowDrawer(false)}
                />
            )}
        </>
    );
}
