'use client';

import { useState, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import { enGB } from 'date-fns/locale';
import { Loader2 } from 'lucide-react';
import 'react-day-picker/dist/style.css';

interface AvailabilityData {
    votes?: number; // repurposed for slots
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
        if (!slug) {
            console.log("SmartCalendar: No slug provided, skipping fetch.");
            return;
        }

        async function fetchAvailability() {
            setLoading(true);
            try {
                const monthStr = format(month, 'yyyy-MM');
                console.log(`SmartCalendar: Fetching for ${slug} / ${monthStr}`);
                const res = await fetch(`/api/availability?slug=${slug}&mode=month&date=${monthStr}`);
                if (res.ok) {
                    const data = await res.json();
                    console.log("SmartCalendar: Data received:", Object.keys(data).length, "days");
                    setAvailability(data);
                } else {
                    console.error("SmartCalendar: Fetch failed", res.status);
                }
            } catch (error) {
                console.error("SmartCalendar: Error fetching data", error);
            } finally {
                setLoading(false);
            }
        }
        fetchAvailability();
    }, [slug, month]);

    // Custom Day Renderer
    const DayContent = (props: any) => {
        const dateStr = format(props.date, 'yyyy-MM-dd');
        const data = availability[dateStr];
        const isPast = props.date < new Date(new Date().setHours(0, 0, 0, 0));

        if (isPast) return <span className="text-gray-300">{format(props.date, 'd')}</span>;

        // Color Logic
        let bgClass = '';
        let textClass = 'text-gray-600';

        if (data) {
            if (data.spots === 0) {
                bgClass = 'bg-rose-100 hover:bg-rose-200'; // Sold Out - Red
                textClass = 'text-rose-700';
            } else if (data.spots < 10) {
                bgClass = 'bg-amber-100 hover:bg-amber-200'; // Low Availability - Yellow
                textClass = 'text-amber-800';
            } else {
                bgClass = 'bg-emerald-100 hover:bg-emerald-200'; // High Availability - Green
                textClass = 'text-emerald-800';
            }
        }

        return (
            <div className={`flex flex-col items-center justify-center p-1 w-full h-full relative group rounded-md transition-colors ${bgClass} ${!data ? 'hover:bg-gray-50' : ''}`}>
                <span className={`text-sm font-bold ${textClass}`}>
                    {format(props.date, 'd')}
                </span>
                {data ? (
                    <div className="flex flex-col items-center -mt-1 scale-[0.85]">
                        {data.spots > 0 ? (
                            <>
                                <span className={`text-[10px] font-bold ${textClass}`}>
                                    €{data.price || basePrice}
                                </span>
                                {data.spots < 10 && (
                                    <span className="text-[9px] font-extrabold text-white bg-amber-500 px-1 rounded-sm mt-0.5 shadow-sm">
                                        {data.spots} left
                                    </span>
                                )}
                            </>
                        ) : (
                            <span className="text-[9px] font-bold text-rose-600 mt-1 uppercase tracking-tighter">
                                Sold Out
                            </span>
                        )}
                    </div>
                ) : (
                    <span className="text-[10px] text-gray-300 mt-1 font-medium">-</span>
                )}
            </div>
        );
    };

    return (
        <div className="bg-white rounded-xl shadow-[0_4px_20px_rgb(0,0,0,0.05)] border border-gray-100 p-4 relative notranslate" translate="no">
            {loading && <div className="absolute top-4 right-4"><Loader2 className="w-4 h-4 animate-spin text-emerald-600" /></div>}
            <DayPicker
                mode="single"
                selected={selectedDate}
                onSelect={onSelect}
                month={month}
                onMonthChange={setMonth}
                locale={enGB}
                components={{
                    DayContent: DayContent
                } as any}
                modifiers={{
                    // Disable selection for sold out or past dates
                    disabled: (date) => {
                        const dStr = format(date, 'yyyy-MM-dd');
                        const dayData = availability[dStr];
                        return date < new Date() || (!!dayData && dayData.spots === 0);
                    }
                }}
                modifiersClassNames={{
                    selected: 'bg-emerald-600 text-white shadow-lg shadow-emerald-200 scale-105 z-10',
                }}
                disabled={[
                    { before: new Date() }
                ]}
                className="custom-calendar"
            />
            <style jsx global>{`
                .rdp { --rdp-cell-size: 60px; --rdp-accent-color: #10b981; margin: 0; }
                .rdp-day_selected { background-color: #10b981 !important; color: white !important; }
                .rdp-day_selected span { color: white !important; } 
                .rdp-day:hover:not(.rdp-day_selected):not(.rdp-day_disabled) { background-color: transparent; }
                .rdp-button:hover:not([disabled]):not(.rdp-day_selected) { border: 2px solid #10b981; }
            `}</style>
        </div>
    );
}
