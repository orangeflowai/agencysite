'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Home, Calendar, Users, Clock, Mail, Download, MapPin, Sparkles, ArrowRight } from 'lucide-react';
import { Suspense, useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';

interface BookingDetails {
    id: string;
    tour_title: string;
    date: string;
    time: string;
    guests: number;
    adults: number;
    students: number;
    youths: number;
    total_price: number;
    customer_name: string;
    customer_email: string;
    status: string;
    stripe_payment_intent_id?: string;
}

function SuccessContent() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const paymentIntentId = searchParams.get('payment_intent');
    const [booking, setBooking] = useState<BookingDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const pollCount = useRef(0);

    useEffect(() => {
        const id = sessionId || paymentIntentId;
        if (id) {
            fetchBookingDetails(id);
        } else {
            setLoading(false);
        }
    }, [sessionId, paymentIntentId]);

    async function fetchBookingDetails(id: string) {
        try {
            let query = supabase.from('bookings').select('*');
            if (sessionId) query = query.eq('stripe_session_id', id);
            else query = query.eq('stripe_payment_intent_id', id);

            const { data, error } = await query.single();

            if (error && error.code === 'PGRST116' && pollCount.current < 10) {
                pollCount.current++;
                setTimeout(() => fetchBookingDetails(id), 2000);
                return;
            }

            if (error) throw error;
            setBooking(data);
        } catch (err) {
            console.error('Failed to fetch booking:', err);
        } finally {
            setLoading(false);
        }
    }

    const bookingRef = booking?.id?.slice(-8).toUpperCase()
        || paymentIntentId?.slice(-8).toUpperCase()
        || sessionId?.slice(-8).toUpperCase()
        || 'OFFICIAL';

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center font-sans">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Validating Authorization...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background py-20 px-4 font-sans">
            <div className="max-w-3xl mx-auto">
                <div className="bg-card rounded-3xl shadow-2xl border border-border overflow-hidden mb-8 relative">
                    {/* Decorative Background */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl" />
                    
                    <div className="bg-primary py-12 px-8 text-center relative overflow-hidden">
                        <div className="absolute inset-0 opacity-10 flex items-center justify-center pointer-events-none">
                            <Sparkles className="w-64 h-64 text-white" />
                        </div>
                        <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-6 border border-white/30">
                            <CheckCircle className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-2">Protocol <span className="italic">Confirmed</span></h1>
                        <p className="text-primary-foreground/80 font-bold uppercase tracking-[0.2em] text-[10px]">Your Archive Access is Secured</p>
                    </div>

                    <div className="p-8 md:p-12">
                        {booking ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-8">
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Access Reference</p>
                                        <p className="text-3xl font-serif font-bold text-foreground tracking-tight">#{bookingRef}</p>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                                            <Calendar className="w-4 h-4" /> Schedule Details
                                        </h3>
                                        <div className="space-y-3">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-bold text-muted-foreground uppercase">Experience</span>
                                                <span className="font-bold text-foreground line-clamp-1">{booking.tour_title}</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-bold text-muted-foreground uppercase">Protocol Date</span>
                                                <span className="font-bold text-foreground">
                                                    {new Date(booking.date).toLocaleDateString('en-US', {
                                                        weekday: 'long',
                                                        month: 'long',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-bold text-muted-foreground uppercase">Confirmed Time</span>
                                                <span className="font-bold text-foreground">{booking.time}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <div className="bg-secondary/30 rounded-2xl p-6 border border-border">
                                        <h3 className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2 mb-4">
                                            <Users className="w-4 h-4" /> Guest Manifest
                                        </h3>
                                        <div className="space-y-2 mb-4">
                                            {(booking as any).guest_details?.guestCounts ? (
                                                Object.entries((booking as any).guest_details.guestCounts).map(([type, count]: [string, any]) => (
                                                    (count as number) > 0 && (
                                                        <div key={type} className="flex justify-between text-xs font-bold uppercase tracking-widest">
                                                            <span className="text-muted-foreground">{count as number} × {type}</span>
                                                            <span className="text-foreground">Secured</span>
                                                        </div>
                                                    )
                                                ))
                                            ) : (
                                                <div className="text-xs font-bold uppercase tracking-widest text-foreground">
                                                    {booking.guests} Total Participants
                                                </div>
                                            )}
                                        </div>
                                        <div className="pt-4 border-t border-border flex justify-between items-end">
                                            <span className="text-[10px] font-bold text-muted-foreground uppercase">Total Contribution</span>
                                            <span className="text-2xl font-serif font-bold text-primary">€{booking.total_price.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                                            <Mail className="w-4 h-4" /> Dispatch info
                                        </h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            A digital ticket and preparation guide have been dispatched to:
                                            <br />
                                            <span className="font-bold text-foreground">{booking.customer_email}</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="md:col-span-2 p-6 bg-accent/5 rounded-2xl border border-accent/20">
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-accent mb-3 flex items-center gap-2">
                                        <Clock className="w-4 h-4" /> Preparation Protocol
                                    </h4>
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                        <li className="flex items-center gap-2">
                                            <div className="w-1 h-1 rounded-full bg-accent" />
                                            Arrive 20m before schedule
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-1 h-1 rounded-full bg-accent" />
                                            Gov Issued ID Mandatory
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-1 h-1 rounded-full bg-accent" />
                                            Shoulders & Knees Covered
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-1 h-1 rounded-full bg-accent" />
                                            Mobile Archive Access OK
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
                                <p className="text-xl font-serif font-bold text-foreground">Your request has been processed.</p>
                                <p className="text-sm text-muted-foreground mt-2">Please check your digital correspondence for further instructions.</p>
                            </div>
                        )}

                        <div className="mt-12 flex flex-col sm:flex-row gap-4">
                            <Link
                                href="/"
                                className="flex-1 flex items-center justify-center gap-3 px-8 py-5 bg-primary text-primary-foreground font-bold uppercase tracking-widest text-[10px] rounded-full shadow-xl shadow-primary/20 hover:opacity-90 transition-all"
                            >
                                <Home size={14} />
                                Return to Gallery
                                <ArrowRight size={14} />
                            </Link>
                            <button
                                onClick={() => window.print()}
                                className="flex items-center justify-center gap-3 px-8 py-5 bg-card border border-border text-foreground font-bold uppercase tracking-widest text-[10px] rounded-full hover:bg-secondary transition-all"
                            >
                                <Download size={14} />
                                Print Certificate
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center gap-8 text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-60">
                    <span className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-primary" />
                        Verified Archive
                    </span>
                    <span className="flex items-center gap-2">
                        <MapPin className="w-3 h-3 text-primary" />
                        Rome HQ Support
                    </span>
                </div>
            </div>
        </div>
    );
}

export default function SuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-background flex flex-col items-center justify-center">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        }>
            <SuccessContent />
        </Suspense>
    );
}
