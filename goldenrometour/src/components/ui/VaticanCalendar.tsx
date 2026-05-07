'use client';

import { useState, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import { enGB } from 'date-fns/locale';
import { Loader2, Calendar as CalendarIcon } from 'lucide-react';
import 'react-day-picker/dist/style.css';

interface AvailabilityData {
    spots: number;
    price?: number;
}

interface VaticanCalendarProps {
    slug?: string;
    selectedDate: Date | undefined;
    onSelect: (date: Date | undefined) => void;
    basePrice?: number;
}

export default function VaticanCalendar({ slug, selectedDate, onSelect, basePrice = 0 }: VaticanCalendarProps) {
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
                console.error('VaticanCalendar fetch error', e);
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

        if (isPast) return <span className="text-muted-foreground/30 text-xs">{format(props.date, 'd')}</span>;

        let bgClass = 'bg-card hover:bg-accent/10';
        let textClass = 'text-foreground';
        let borderClass = 'border border-border/50';

        if (data) {
            if (data.spots === 0) {
                bgClass = 'bg-destructive/5';
                textClass = 'text-destructive/60';
                borderClass = 'border border-destructive/20';
            } else if (data.spots < 10) {
                bgClass = 'bg-accent/10';
                textClass = 'text-accent';
                borderClass = 'border border-accent/30';
            } else {
                bgClass = 'bg-primary/5';
                textClass = 'text-primary';
                borderClass = 'border border-primary/20';
            }
        }

        return (
            <div className={`flex flex-col items-center justify-center p-2 w-full h-full rounded-lg transition-all duration-200 ${bgClass} ${borderClass} ${!data ? 'hover:border-accent' : ''}`}>
                <span className={`text-sm font-bold ${textClass}`}>{format(props.date, 'd')}</span>
                {data ? (
                    <div className="flex flex-col items-center mt-1">
                        {data.spots > 0 ? (
                            <>
                                <span className={`text-[10px] font-bold ${textClass}`}>€{data.price || basePrice}</span>
                                {data.spots < 10 && (
                                    <span className="text-[8px] font-bold text-white bg-accent px-1.5 py-0.5 rounded mt-1 shadow-sm uppercase tracking-tight">
                                        {data.spots} left
                                    </span>
                                )}
                            </>
                        ) : (
                            <span className="text-[8px] font-bold text-destructive uppercase tracking-tight mt-1">Full</span>
                        )}
                    </div>
                ) : (
                    <span className="text-[9px] text-muted-foreground/40 font-medium mt-1">—</span>
                )}
            </div>
        );
    };

    return (
        <div className="bg-gradient-to-br from-card to-secondary/5 rounded-2xl shadow-lg border-2 border-border/50 p-6 relative notranslate" translate="no">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-border/50">
                <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-accent" />
                    <span className="text-xs font-bold uppercase tracking-widest text-foreground">Vatican Access Calendar</span>
                </div>
                {loading && <Loader2 className="w-4 h-4 animate-spin text-accent" />}
            </div>

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
                    selected: 'bg-accent text-white shadow-xl shadow-accent/30 scale-110 z-10 border-2 border-accent',
                    soldOut: 'cursor-not-allowed opacity-50',
                }}
                disabled={[
                    { before: new Date() },
                    (date) => {
                        const d = availability[format(date, 'yyyy-MM-dd')];
                        return !!d && d.spots === 0;
                    },
                ]}
                className="vatican-calendar"
            />

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-4 mt-6 pt-4 border-t border-border/50">
                <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-foreground/70">
                    <span className="w-3 h-3 rounded border-2 border-primary/30 bg-primary/10 inline-block" />
                    Available
                </span>
                <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-foreground/70">
                    <span className="w-3 h-3 rounded border-2 border-accent/30 bg-accent/10 inline-block" />
                    Limited
                </span>
                <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-destructive/70">
                    <span className="w-3 h-3 rounded border-2 border-destructive/30 bg-destructive/10 inline-block" />
                    Full
                </span>
            </div>

            <style jsx global>{`
                .vatican-calendar { 
                    --rdp-cell-size: 56px; 
                    --rdp-accent-color: var(--accent); 
                    margin: 0; 
                    width: 100%;
                }
                .vatican-calendar .rdp-day_selected { 
                    background-color: var(--accent) !important; 
                    color: white !important; 
                    border: 2px solid var(--accent) !important;
                    transform: scale(1.1);
                }
                .vatican-calendar .rdp-day_selected span { 
                    color: white !important; 
                }
                .vatican-calendar .rdp-button:hover:not([disabled]):not(.rdp-day_selected) { 
                    background-color: transparent; 
                    border: 2px solid var(--accent); 
                    transform: scale(1.05);
                }
                .vatican-calendar .rdp-head_cell { 
                    font-size: 0.65rem; 
                    font-weight: 900; 
                    text-transform: uppercase; 
                    color: var(--accent); 
                    letter-spacing: 0.15em; 
                }
                .vatican-calendar .rdp-nav_button { 
                    color: var(--accent); 
                    border: 1px solid var(--border);
                    border-radius: 0.5rem;
                }
                .vatican-calendar .rdp-nav_button:hover { 
                    background-color: var(--accent);
                    color: white;
                }
                .vatican-calendar .rdp-caption_label {
                    font-size: 0.875rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    color: var(--foreground);
                }
                .vatican-calendar .rdp-months {
                    width: 100%;
                }
                .vatican-calendar .rdp-month {
                    width: 100%;
                }
                .vatican-calendar .rdp-table {
                    width: 100%;
                    max-width: none;
                }
            `}</style>
        </div>
    );
}
