'use client';

import { useState, useEffect } from 'react';
import {
    format,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    addMonths,
    subMonths,
    startOfWeek,
    endOfWeek
} from 'date-fns';
import { supabase } from '@/lib/supabase';
import { Tour } from '@/lib/sanityService';
import { ChevronLeft, ChevronRight, Filter, Loader2 } from 'lucide-react';
import ManageSlotsModal, { InventorySlot } from './ManageSlotsModal';

interface InventoryCalendarProps {
    tours: Tour[];
}

export default function InventoryCalendar({ tours }: InventoryCalendarProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [inventory, setInventory] = useState<InventorySlot[]>([]);
    const [loading, setLoading] = useState(false);

    // Filter
    const [selectedTourSlug, setSelectedTourSlug] = useState<string>('all');

    // Modal State
    const [activeSlotData, setActiveSlotData] = useState<{
        tour: Tour;
        date: string;
        currentSlots: InventorySlot[];
    } | null>(null);

    useEffect(() => {
        fetchMonthData();
    }, [currentMonth]);

    async function fetchMonthData() {
        setLoading(true);
        const start = format(startOfMonth(currentMonth), 'yyyy-MM-dd');
        const end = format(endOfMonth(currentMonth), 'yyyy-MM-dd');

        try {
            const { data, error } = await supabase
                .from('inventory')
                .select('*')
                .gte('date', start)
                .lte('date', end);

            if (error) throw error;
            setInventory(data || []);
        } catch (error) {
            console.error("Error fetching month inventory:", error);
        } finally {
            setLoading(false);
        }
    }

    const days = eachDayOfInterval({
        start: startOfWeek(startOfMonth(currentMonth)),
        end: endOfWeek(endOfMonth(currentMonth))
    });

    const toursToDisplay = selectedTourSlug === 'all'
        ? tours
        : tours.filter(t => t.slug.current === selectedTourSlug);

    const handleProductClick = (tour: Tour, dateStr: string) => {
        // Find existing slots for this tour/date
        const relevantSlots = inventory.filter(s =>
            s.tour_slug === tour.slug.current &&
            s.date === dateStr // Database returns YYYY-MM-DD
        );

        setActiveSlotData({
            tour,
            date: dateStr,
            currentSlots: relevantSlots.map(s => ({
                id: s.id,
                tour_slug: s.tour_slug,
                date: s.date,
                time: s.time,
                available_slots: s.available_slots,
                price_override: s.price_override
            })).sort((a, b) => a.time.localeCompare(b.time))
        });
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-[calc(100vh-140px)]">
            {/* Header / Toolbar */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white z-10">
                <div className="flex items-center gap-4">
                    <h2 className="text-xl font-bold text-gray-800 w-48">
                        {format(currentMonth, 'MMMM yyyy')}
                    </h2>
                    <div className="flex bg-gray-100 rounded-lg p-1">
                        <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-1 hover:bg-white rounded-md transition-shadow shadow-sm hover:shadow">
                            <ChevronLeft size={20} className="text-gray-600" />
                        </button>
                        <button onClick={() => setCurrentMonth(new Date())} className="px-3 text-xs font-bold text-gray-600 hover:bg-white rounded-md transition-shadow">
                            Today
                        </button>
                        <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-1 hover:bg-white rounded-md transition-shadow shadow-sm hover:shadow">
                            <ChevronRight size={20} className="text-gray-600" />
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-2">
                    <Filter size={16} className="text-gray-400" />
                    <select
                        className="bg-gray-50 border border-gray-200 text-sm rounded-lg p-2 font-medium text-gray-700 outline-none focus:ring-2 focus:ring-emerald-500"
                        value={selectedTourSlug}
                        onChange={(e) => setSelectedTourSlug(e.target.value)}
                    >
                        <option value="all">All Products</option>
                        {tours.map(t => (
                            <option key={t._id} value={t.slug.current}>{t.title}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 flex-1 overflow-auto bg-gray-100 gap-px border-l border-gray-200">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="bg-gray-50 p-2 text-center text-xs font-bold text-gray-400 uppercase tracking-wider sticky top-0 z-10 border-b border-gray-200">
                        {day}
                    </div>
                ))}

                {days.map((day, dayIdx) => {
                    const dateStr = format(day, 'yyyy-MM-dd');
                    const isCurrentMonth = isSameMonth(day, currentMonth);
                    const isToday = isSameDay(day, new Date());

                    // Filter inventory for this day
                    // We only want to show summaries?
                    // "0/12", "0/20"

                    return (
                        <div
                            key={day.toString()}
                            className={`min-h-[140px] bg-white p-2 relative group flex flex-col gap-1 transition-colors
                                ${!isCurrentMonth ? 'bg-gray-50/50 text-gray-400' : ''}
                                ${isToday ? 'bg-emerald-50/30' : ''}
                            `}
                        >
                            <span className={`text-sm font-bold mb-2 ml-1 ${isToday ? 'text-emerald-600' : 'text-gray-700'}`}>
                                {format(day, 'd')}
                            </span>

                            {/* Products List */}
                            <div className="flex-1 overflow-y-auto space-y-1 custom-scrollbar">
                                {toursToDisplay.map(tour => {
                                    // Get slots for this tour/day
                                    const slots = inventory.filter(s => s.tour_slug === tour.slug.current && s.date === dateStr);
                                    const totalSpots = slots.reduce((acc, s) => acc + s.available_slots, 0);
                                    const hasSlots = slots.length > 0;
                                    const isSoldOut = hasSlots && totalSpots === 0;

                                    // If no slots, show distinct "Not Configured" state? 
                                    // Or just show grey "0 slots"?
                                    // User ref shows "0/30".
                                    // Calculating "Total Capacity" is hard if we don't know the max.
                                    // We only know current `available_slots`.
                                    // We can just show available sum.

                                    // Design: Pill with Tour Name (truncated) and Availability
                                    return (
                                        <button
                                            key={tour._id}
                                            onClick={() => handleProductClick(tour, dateStr)}
                                            className={`w-full text-left px-2 py-1.5 rounded text-[10px] font-medium border flex items-center justify-between gap-2 transition-all hover:scale-[1.02]
                                                ${!hasSlots
                                                    ? 'bg-gray-50 border-transparent text-gray-400 hover:bg-gray-100 hover:border-gray-200'
                                                    : isSoldOut
                                                        ? 'bg-red-50 border-red-100 text-red-600 hover:border-red-300'
                                                        : 'bg-emerald-50 border-emerald-100 text-emerald-700 hover:border-emerald-300'
                                                }
                                            `}
                                        >
                                            <span className="truncate">{tour.title}</span>
                                            <span className="shrink-0 font-bold bg-white/50 px-1 rounded">
                                                {hasSlots ? totalSpots : '-'}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>

            {loading && (
                <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-50">
                    <Loader2 className="animate-spin text-emerald-600" />
                </div>
            )}

            {/* Modal */}
            {activeSlotData && (
                <ManageSlotsModal
                    tourTitle={activeSlotData.tour.title}
                    tourSlug={activeSlotData.tour.slug.current}
                    date={activeSlotData.date}
                    initialSlots={activeSlotData.currentSlots}
                    onClose={() => {
                        setActiveSlotData(null);
                        fetchMonthData(); // Turn off local update optimization for safety
                    }}
                />
            )}

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #d1d5db; }
            `}</style>
        </div>
    );
}
