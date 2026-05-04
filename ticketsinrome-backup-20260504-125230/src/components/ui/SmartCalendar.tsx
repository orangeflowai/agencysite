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

        if (isPast) return <span className="text-muted-foreground/40">{format(props.date, 'd')}</span>;

        let bgClass = '';
        let textClass = 'text-foreground';

        if (data) {
            if (data.spots === 0) {
                bgClass = 'bg-destructive/10';
                textClass = 'text-destructive';
            } else if (data.spots < 10) {
                bgClass = 'bg-accent/50';
                textClass = 'text-foreground';
            } else {
                bgClass = 'bg-primary/5';
                textClass = 'text-primary';
            }
        }

        return (
            <div className={`flex flex-col items-center justify-center p-1 w-full h-full rounded-md transition-colors ${bgClass} ${!data ? 'hover:bg-accent/50' : ''}`}>
                <span className={`text-sm font-bold ${textClass}`}>{format(props.date, 'd')}</span>
                {data ? (
                    <div className="flex flex-col items-center -mt-0.5">
                        {data.spots > 0 ? (
                            <>
                                <span className={`text-[9px] font-bold ${textClass}`}>€{data.price || basePrice}</span>
                                {data.spots < 10 && (
                                    <span className="text-[8px] font-bold text-white bg-primary px-1 rounded-sm mt-0.5 shadow-sm  tracking-tighter">
                                        {data.spots} left
                                    </span>
                                )}
                            </>
                        ) : (
                            <span className="text-[8px] font-bold text-destructive  tracking-tighter">Sold out</span>
                        )}
                    </div>
                ) : (
                    <span className="text-[9px] text-muted-foreground/30 font-medium">-</span>
                )}
            </div>
        );
    };

    return (
        <div className="bg-card rounded-xl shadow-sm border border-border p-4 relative notranslate" translate="no">
            {loading && <div className="absolute top-4 right-4"><Loader2 className="w-4 h-4 animate-spin text-primary" /></div>}
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
                    selected: 'bg-primary text-white shadow-lg shadow-primary/20 scale-105 z-10',
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
            <div className="flex items-center gap-3 mt-3 pt-3 border-t border-border justify-center">
                <span className="flex items-center gap-1 text-[9px] font-bold  tracking-widest text-foreground/60"><span className="w-2.5 h-2.5 rounded-sm bg-primary/20 inline-block" />Available</span>
                <span className="flex items-center gap-1 text-[9px] font-bold  tracking-widest text-foreground/60"><span className="w-2.5 h-2.5 rounded-sm bg-accent inline-block" />Limited</span>
                <span className="flex items-center gap-1 text-[9px] font-bold  tracking-widest text-destructive"><span className="w-2.5 h-2.5 rounded-sm bg-destructive/20 inline-block" />Sold out</span>
            </div>
            <style jsx global>{`
                .rdp { --rdp-cell-size: 52px; --rdp-accent-color: var(--primary); margin: 0; }
                .rdp-day_selected { background-color: var(--primary) !important; color: white !important; }
                .rdp-day_selected span { color: white !important; }
                .rdp-button:hover:not([disabled]):not(.rdp-day_selected) { background-color: transparent; border: 2px solid var(--primary); }
                .rdp-head_cell { font-size: 0.7rem; font-weight: 900; text-transform: ; color: var(--muted-foreground); tracking: 0.1em; }
                .rdp-nav_button { color: var(--primary); }
            `}</style>
        </div>
    );
}
