'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Home } from 'lucide-react';
import { Suspense, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

function SuccessContent() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const paymentIntentId = searchParams.get('payment_intent');
    const [booking, setBooking] = useState<any>(null);
    const [loading, setLoading] = useState(true);

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
            if (sessionId) {
                query = query.eq('stripe_session_id', sessionId);
            } else if (paymentIntentId) {
                query = query.eq('stripe_payment_intent_id', paymentIntentId);
            }
            const { data, error } = await query.single();
            if (!error) setBooking(data);
        } catch (err) {
            console.error('Failed to fetch booking:', err);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-muted flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-card rounded-[3rem] shadow-2xl p-12 text-center border border-border">
                <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8">
                    <CheckCircle className="w-12 h-12 text-primary" />
                </div>
                <h1 className="text-4xl font-serif font-bold text-slate-900 mb-4  ">Confirmed!</h1>
                <p className="text-slate-500 mb-10 leading-relaxed font-medium">Your adventure is secured. Check your email for details.</p>
                
                {booking && (
                   <div className="bg-[var(--muted)] p-6 rounded-2xl mb-8 border border-[var(--border)] inline-block text-left w-full max-w-md mx-auto">
                      <p className="text-xs font-bold  tracking-widest text-[var(--primary)] mb-1">Booking Ref</p>
                      <p className="text-xl font-mono font-bold text-[var(--foreground)]">#{booking.id?.slice(-8).toUpperCase()}</p>
                   </div>
                )}

                <Link href="/" className="inline-flex items-center gap-2 px-10 py-5 bg-[var(--primary)] text-white font-bold rounded-full  tracking-widest text-xs transition-all shadow-xl hover:-translate-y-1 active:scale-95">
                    <Home size={18} /> Back to Home
                </Link>
            </div>
        </div>
    );
}

export default function SuccessPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)]"></div></div>}>
            <SuccessContent />
        </Suspense>
    );
}
