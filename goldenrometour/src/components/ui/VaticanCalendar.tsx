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

        if (isPast) {
            return <span className="text-muted-foreground/30 text-xs">{format(props.date, 'd')}</span>;
        }

        let bgClass = '';
        let textClass = 'text-foreground';

        if (data) {
            if (data.spots === 0) {
                bgClass = 'bg-destructive/10';
                textClass = 'text-destructive';
            } else if (data.spots < 10) {
                bgClass = 'bg-accent/20';
                textClass = 'text-accent';
            } else {
                bgClass = 'bg-primary/10';
                textClass = 'text-primary';
            }
        }

        return (
            <div className={`flex flex-col items-center justify-center p-1 w-full h-full rounded-md transition-colors ${bgClass} ${!data ? 'hover:bg-accent/10' : ''}`}>
                <span className={`text-sm font-bold ${textClass}`}>{format(props.date, 'd')}</span>
                {data ? (
                    <div className="flex flex-col items-center -mt-0.5">
                        {data.spots > 0 ? (
                            <>
                                <span className={`text-[8px] font-bold ${textClass}`}>€{data.price || basePrice}</span>
                                {data.spots < 10 && (
                                    <span className="text-[8px] font-bold text-white bg-accent px-1 py-0.5 rounded mt-0.5 shadow-sm uppercase tracking-tight">
                                        {data.spots} left
                                    </span>
                                )}
                            </>
                        ) : (
                            <span className="text-[8px] font-bold text-destructive uppercase tracking-tight">Full</span>
                        )}
                    </div>
                ) : (
                    <span className="text-[8px] text-muted-foreground/30 font-medium">—</span>
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
                    selected: 'vatican-selected',
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
            <div className="flex flex-wrap items-center gap-4 mt-6 pt-4 border-t border-border/50 justify-center">
                <span className="flex items-center gap-2 text-[8px] font-bold uppercase tracking-wider text-foreground/70">
                    <span className="w-3 h-3 rounded border-2 border-primary/30 bg-primary/10 inline-block" />
                    Available
                </span>
                <span className="flex items-center gap-2 text-[8px] font-bold uppercase tracking-wider text-foreground/70">
                    <span className="w-3 h-3 rounded border-2 border-accent/30 bg-accent/20 inline-block" />
                    Limited
                </span>
                <span className="flex items-center gap-2 text-[8px] font-bold uppercase tracking-wider text-destructive/70">
                    <span className="w-3 h-3 rounded border-2 border-destructive/30 bg-destructive/10 inline-block" />
                    Full
                </span>
            </div>

            <style jsx global>{`
                .vatican-calendar { 
                    --rdp-cell-size: 56px; 
                    --rdp-accent-color: hsl(var(--accent)); 
                    margin: 0; 
                    width: 100%;
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
                .vatican-calendar .rdp-button {
                    border: 2px solid transparent;
                    border-radius: 0.375rem;
                }
                .vatican-calendar .rdp-button:hover:not([disabled]):not(.vatican-selected) { 
                    background-color: transparent !important; 
                    border: 2px solid oklch(0.72 0.12 75);
                    transform: scale(1.02);
                }
                .vatican-calendar .vatican-selected { 
                    background-color: oklch(0.72 0.12 75) !important; 
                    color: white !important; 
                    border: 2px solid oklch(0.72 0.12 75) !important;
                    transform: scale(1.05);
                    box-shadow: 0 10px 25px -5px rgba(201, 168, 76, 0.3), 0 8px 10px -6px rgba(201, 168, 76, 0.2);
                }
                .vatican-calendar .vatican-selected span { 
                    color: white !important; 
                }
                .vatican-calendar .vatican-selected div { 
                    color: white !important; 
                }
                .vatican-calendar .rdp-head_cell { 
                    font-size: 0.65rem; 
                    font-weight: 900; 
                    text-transform: uppercase; 
                    color: oklch(0.72 0.12 75); 
                    letter-spacing: 0.15em; 
                }
                .vatican-calendar .rdp-nav_button { 
                    color: oklch(0.72 0.12 75); 
                    border: 1px solid oklch(0.90 0.015 80);
                    border-radius: 0.5rem;
                    width: 2rem;
                    height: 2rem;
                }
                .vatican-calendar .rdp-nav_button:hover { 
                    background-color: oklch(0.72 0.12 75);
                    color: white;
                }
                .vatican-calendar .rdp-caption_label {
                    font-size: 0.875rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    color: oklch(0.22 0.02 50);
                }
            `}</style>
        </div>
    );
}
