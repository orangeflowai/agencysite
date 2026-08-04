'use client';

import { useState, useEffect, useMemo } from 'react';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import { enGB } from 'date-fns/locale';
import { Loader2, Minus, Plus, ChevronRight, AlertTriangle, Shield, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import 'react-day-picker/dist/style.css';

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
    mainImage?: any;
    category?: string;
    meetingPoint?: string;
    maxParticipants?: number;
    guestTypes?: GuestType[];
}

interface AvailabilityData {
    spots: number;
    price?: number;
}

interface TimeSlot {
    time: string;
    available_slots: number;
    price?: number;
}

export default function TourBookingWidget({ tour }: { tour: Tour }) {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>();
    const [selectedTime, setSelectedTime] = useState('');
    const [month, setMonth] = useState(new Date());
    const [monthAvailability, setMonthAvailability] = useState<Record<string, AvailabilityData>>({});
    const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
    const [loadingMonth, setLoadingMonth] = useState(false);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [counts, setCounts] = useState<Record<string, number>>({});
    const [error, setError] = useState('');

    const slug = tour.slug?.current || '';

    // Guest types — use tour's guestTypes or default
    const guestTypes = useMemo<GuestType[]>(() => {
        if (tour.guestTypes && tour.guestTypes.length > 0) return tour.guestTypes;
        return [
            { name: 'Adult',   price: tour.price,                        description: 'Age 18+' },
            { name: 'Student', price: Math.round(tour.price * 0.85),     description: 'ID Required' },
            { name: 'Youth',   price: Math.round(tour.price * 0.70),     description: 'Under 18' },
            { name: 'Child',   price: Math.round(tour.price * 0.50),     description: 'Under 8' },
        ];
    }, [tour]);

    // Init counts
    useEffect(() => {
        const init: Record<string, number> = {};
        guestTypes.forEach((g) => { init[g.name] = 0; });
        setCounts(init);
    }, [guestTypes]);

    // Fetch month availability
    useEffect(() => {
        if (!slug) return;
        setLoadingMonth(true);
        const monthStr = format(month, 'yyyy-MM');
        fetch(`/api/availability?slug=${slug}&mode=month&date=${monthStr}`)
            .then(r => r.ok ? r.json() : {})
            .then(data => setMonthAvailability(data))
            .catch(() => setMonthAvailability({}))
            .finally(() => setLoadingMonth(false));
    }, [slug, month]);

    // Fetch time slots when date selected
    useEffect(() => {
        if (!selectedDate || !slug) { setTimeSlots([]); return; }
        setLoadingSlots(true);
        setSelectedTime('');
        const dateStr = format(selectedDate, 'yyyy-MM-dd');
        fetch(`/api/availability?slug=${slug}&date=${dateStr}`)
            .then(r => r.ok ? r.json() : { slots: [] })
            .then(data => setTimeSlots(data.slots || []))
            .catch(() => setTimeSlots([]))
            .finally(() => setLoadingSlots(false));
    }, [selectedDate, slug]);

    const totalGuests = Object.values(counts).reduce((s, c) => s + c, 0);
    const totalPrice  = guestTypes.reduce((s, g) => s + (counts[g.name] || 0) * g.price, 0);
    const activeSlot  = timeSlots.find(s => s.time === selectedTime);

    // Calendar day content
    const DayContent = (props: any) => {
        const dateStr = format(props.date, 'yyyy-MM-dd');
        const data = monthAvailability[dateStr];
        const isPast = props.date < new Date(new Date().setHours(0, 0, 0, 0));

        if (isPast) return <span className="text-muted-foreground opacity-40">{format(props.date, 'd')}</span>;

        let bgClass = '';
        let textClass = 'text-foreground';

        if (data) {
            if (data.spots === 0) {
                bgClass = 'bg-red-100 dark:bg-red-900/30';
                textClass = 'text-red-600';
            } else if (data.spots < 10) {
                bgClass = 'bg-amber-50 dark:bg-amber-900/20';
                textClass = 'text-amber-700';
            } else {
                bgClass = 'bg-green-50 dark:bg-green-900/20';
                textClass = 'text-green-700';
            }
        }

        return (
            <div className={`flex flex-col items-center justify-center p-0.5 w-full h-full rounded-md ${bgClass}`}>
                <span className={`text-sm font-semibold ${textClass}`}>{format(props.date, 'd')}</span>
                {data && data.spots > 0 && (
                    <span className={`text-[9px] font-bold ${textClass}`}>€{data.price || tour.price}</span>
                )}
                {data && data.spots === 0 && (
                    <span className="text-[8px] text-red-500 font-bold">Full</span>
                )}
            </div>
        );
    };

    const handleBook = () => {
        if (!selectedDate) { setError('Please select a date'); return; }
        if (!selectedTime) { setError('Please select a time'); return; }
        if (totalGuests === 0) { setError('Please add at least 1 guest'); return; }
        setError('');

        const params = new URLSearchParams({
            tour: tour.slug?.current || '',
            date: format(selectedDate, 'yyyy-MM-dd'),
            time: selectedTime,
        });

        // Add guest counts to params
        Object.entries(counts).forEach(([name, count]) => {
            if (count > 0) params.append(`guests_${name.toLowerCase()}`, count.toString());
        });

        window.location.href = `/booking?${params.toString()}`;
    };
    };

    return (
        <div className="bg-card border border-border rounded-2xl shadow-lg overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-border">
                <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold tracking-widest text-muted-foreground uppercase">From</span>
                    <span className="text-xs bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full">Free cancellation</span>
                </div>
                <div className="flex items-end gap-1">
                    <span className="text-3xl font-bold">€{tour.price}</span>
                    <span className="text-muted-foreground text-sm mb-1">/ person</span>
                </div>
                <div className="flex items-center gap-1 mt-1">
                    {[1,2,3,4,5].map(i => <Star key={i} size={12} className="fill-amber-400 text-amber-400" />)}
                    <span className="text-xs text-muted-foreground ml-1">4.9 · Verified reviews</span>
                </div>
            </div>

            <div className="p-6 space-y-6">
                {/* Calendar */}
                <div>
                    <p className="text-sm font-bold tracking-widest text-muted-foreground mb-3">1. SELECT DATE</p>
                    <div className="relative">
                        {loadingMonth && (
                            <div className="absolute top-2 right-2 z-10">
                                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                            </div>
                        )}
                        <DayPicker
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            month={month}
                            onMonthChange={setMonth}
                            locale={enGB}
                            components={{ DayContent: DayContent } as any}
                            disabled={[
                                { before: new Date() },
                                (date) => {
                                    const d = monthAvailability[format(date, 'yyyy-MM-dd')];
                                    return !!d && d.spots === 0;
                                },
                            ]}
                            modifiersClassNames={{
                                selected: '!bg-foreground !text-background rounded-md scale-105',
                            }}
                            className="w-full"
                            style={{ '--rdp-cell-size': '40px' } as any}
                        />
                    </div>
                    {/* Legend */}
                    <div className="flex items-center gap-3 mt-2 justify-center">
                        <span className="flex items-center gap-1 text-[10px] text-green-700 font-bold"><span className="w-2 h-2 rounded-sm bg-green-100 inline-block" />Available</span>
                        <span className="flex items-center gap-1 text-[10px] text-amber-700 font-bold"><span className="w-2 h-2 rounded-sm bg-amber-50 inline-block" />Limited</span>
                        <span className="flex items-center gap-1 text-[10px] text-red-500 font-bold"><span className="w-2 h-2 rounded-sm bg-red-100 inline-block" />Sold out</span>
                    </div>
                </div>

                {/* Time Slots */}
                {selectedDate && (
                    <div>
                        <p className="text-sm font-bold tracking-widest text-muted-foreground mb-3">2. SELECT TIME</p>
                        {loadingSlots ? (
                            <div className="flex items-center justify-center py-6">
                                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                            </div>
                        ) : timeSlots.length > 0 ? (
                            <div className="grid grid-cols-3 gap-2">
                                {timeSlots.map(slot => (
                                    <button
                                        key={slot.time}
                                        onClick={() => setSelectedTime(slot.time)}
                                        disabled={slot.available_slots === 0}
                                        className={`py-3 px-2 text-sm font-bold rounded-xl border-2 transition-all text-center flex flex-col items-center gap-0.5
                                            ${selectedTime === slot.time
                                                ? 'bg-foreground text-background border-foreground'
                                                : 'bg-card text-foreground border-border hover:border-foreground'
                                            }
                                            ${slot.available_slots === 0 ? 'opacity-30 cursor-not-allowed' : ''}
                                        `}
                                    >
                                        <span>{slot.time}</span>
                                        {slot.available_slots < 5 && slot.available_slots > 0 && (
                                            <span className="text-[9px] text-red-500 font-bold">{slot.available_slots} left</span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-4 bg-muted rounded-xl">
                                <p className="text-sm text-muted-foreground">No availability for this date</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Guests */}
                <div>
                    <p className="text-sm font-bold tracking-widest text-muted-foreground mb-3">3. GUESTS</p>
                    <div className="space-y-3">
                        {guestTypes.map(gt => (
                            <div key={gt.name} className="flex items-center justify-between p-3 bg-muted rounded-xl">
                                <div>
                                    <p className="text-sm font-semibold">{gt.name}</p>
                                    {gt.description && <p className="text-xs text-muted-foreground">{gt.description}</p>}
                                    <p className="text-xs font-bold text-foreground mt-0.5">€{gt.price}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setCounts(p => ({ ...p, [gt.name]: Math.max(0, (p[gt.name] || 0) - 1) }))}
                                        disabled={(counts[gt.name] || 0) <= 0}
                                        className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-background disabled:opacity-30 transition-all"
                                    >
                                        <Minus size={14} />
                                    </button>
                                    <span className="w-5 text-center font-bold">{counts[gt.name] || 0}</span>
                                    <button
                                        onClick={() => setCounts(p => ({ ...p, [gt.name]: (p[gt.name] || 0) + 1 }))}
                                        className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-background transition-all"
                                    >
                                        <Plus size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                        <AlertTriangle size={14} />
                        {error}
                    </div>
                )}

                {/* Total + CTA */}
                <div>
                    <div className="flex justify-between items-center mb-4 py-3 border-t border-border">
                        <span className="font-semibold">Total</span>
                        <span className="text-2xl font-bold">€{totalPrice}</span>
                    </div>
                    <Button
                        onClick={handleBook}
                        disabled={!selectedDate || !selectedTime || totalGuests === 0}
                        className={`w-full py-6 text-sm font-bold tracking-widest rounded-xl transition-all ${
                            (!selectedDate || !selectedTime || totalGuests === 0) 
                            ? 'opacity-50 grayscale cursor-not-allowed bg-muted text-muted-foreground' 
                            : 'bg-foreground text-background'
                        }`}
                        size="lg"
                    >
                        {!selectedDate || !selectedTime || totalGuests === 0 
                            ? "Select date & guests to continue" 
                            : `Book Now — €${totalPrice}`}
                        <ChevronRight size={16} className="ml-1" />
                    </Button>
                    <div className="flex items-center justify-center gap-2 mt-3 text-xs text-muted-foreground">
                        <Shield size={12} />
                        <span>Free cancellation up to 24h before</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
