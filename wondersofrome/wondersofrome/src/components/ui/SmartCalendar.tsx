'use client';

import { useState, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import { enGB } from 'date-fns/locale';
import { Loader2 } from 'lucide-react';
import 'react-day-picker/dist/style.css';

interface AvailabilityData {
    spots: number;
    price?: number;
}

interface SmartCalendarProps {
    slug?: string;
    selectedDate: Date | undefined;
    onSelect: (date: Date | undefined) => void;
    basePrice?: number;
}

export default function SmartCalendar({ slug, selectedDate, onSelect, basePrice = 0 }: SmartCalendarProps) {
    const [month, setMonth] = useState<Date>(new Date());
    const [availability, setAvailability] = useState<Record<string, AvailabilityData>>({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!slug) return;
        async function fetchAvailability() {
            setLoading(true);
            try {
                const monthStr = format(month, 'yyyy-MM');
                const res = await fetch(`/api/availability?slug=${slug}&mode=month&date=${monthStr}`);
                if (res.ok) setAvailability(await res.json());
            } catch (e) {
                console.error('SmartCalendar fetch error', e);
            } finally {
                setLoading(false);
            }
        }
        fetchAvailability();
    }, [slug, month]);

    const DayContent = (props: any) => {
        const dateStr = format(props.date, 'yyyy-MM-dd');
        const data = availability[dateStr];
        const isPast = props.date < new Date(new Date().setHours(0, 0, 0, 0));

        if (isPast) return <span className="text-gray-300">{format(props.date, 'd')}</span>;

        let bgClass = '';
        let textClass = 'text-gray-600';

        if (data) {
            if (data.spots === 0) {
                bgClass = 'bg-rose-100';
                textClass = 'text-rose-400';
            } else if (data.spots < 10) {
                bgClass = 'bg-amber-50';
                textClass = 'text-amber-800';
            } else {
                bgClass = 'bg-emerald-50';
                textClass = 'text-emerald-800';
            }
        }

        return (
            <div className={`flex flex-col items-center justify-center p-1 w-full h-full rounded-md transition-colors ${bgClass} ${!data ? 'hover:bg-gray-50' : ''}`}>
                <span className={`text-sm font-bold ${textClass}`}>{format(props.date, 'd')}</span>
                {data ? (
                    <div className="flex flex-col items-center -mt-0.5">
                        {data.spots > 0 ? (
                            <>
                                <span className={`text-[10px] font-bold ${textClass}`}>€{data.price || basePrice}</span>
                                {data.spots < 10 && (
                                    <span className="text-[9px] font-extrabold text-white bg-amber-500 px-1 rounded-sm mt-0.5">
                                        {data.spots} left
                                    </span>
                                )}
                            </>
                        ) : (
                            <span className="text-[9px] font-bold text-rose-400 uppercase tracking-tighter">Sold out</span>
                        )}
                    </div>
                ) : (
                    <span className="text-[10px] text-gray-300 font-medium">-</span>
                )}
            </div>
        );
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 relative notranslate" translate="no">
            {loading && <div className="absolute top-4 right-4"><Loader2 className="w-4 h-4 animate-spin text-sky-600" /></div>}
            <DayPicker
                mode="single"
                selected={selectedDate}
                onSelect={onSelect}
                month={month}
                onMonthChange={setMonth}
                locale={enGB}
                components={{ DayContent: DayContent } as any}
                modifiers={{
                    soldOut: (date) => {
                        const d = availability[format(date, 'yyyy-MM-dd')];
                        return !!d && d.spots === 0;
                    },
                }}
                modifiersClassNames={{
                    selected: 'bg-sky-600 text-white shadow-lg shadow-sky-100 scale-105 z-10',
                    soldOut: 'cursor-not-allowed opacity-60',
                }}
                disabled={[
                    { before: new Date() },
                    (date) => {
                        const d = availability[format(date, 'yyyy-MM-dd')];
                        return !!d && d.spots === 0;
                    },
                ]}
                className="custom-calendar"
            />
            {/* Legend */}
            <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-100 justify-center">
                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-100 inline-block" />Available</span>
                <span className="flex items-center gap-1 text-[10px] font-bold text-amber-700"><span className="w-2.5 h-2.5 rounded-sm bg-amber-100 inline-block" />Limited</span>
                <span className="flex items-center gap-1 text-[10px] font-bold text-rose-400"><span className="w-2.5 h-2.5 rounded-sm bg-rose-100 inline-block" />Sold out</span>
            </div>
            <style jsx global>{`
                .rdp { --rdp-cell-size: 58px; --rdp-accent-color: #0284c7; margin: 0; }
                .rdp-day_selected { background-color: #0284c7 !important; color: white !important; }
                .rdp-day_selected span { color: white !important; }
                .rdp-button:hover:not([disabled]):not(.rdp-day_selected) { background-color: transparent; border: 2px solid #0284c7; }
            `}</style>
        </div>
    );
}
