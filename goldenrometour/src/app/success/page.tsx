'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Home, Calendar, Users, Clock, Mail, Download, MapPin } from 'lucide-react';
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

            if (sessionId) {
                query = query.eq('stripe_session_id', id);
            } else {
                query = query.eq('stripe_payment_intent_id', id);
            }

            const { data, error } = await query.single();

            if (error && error.code === 'PGRST116' && pollCount.current < 10) {
                // Booking not yet created by webhook — retry after 2s
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
        || '';

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600">Confirming your booking...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background py-12 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Success Header */}
                <div className="bg-white rounded-2xl shadow-xl border border-border overflow-hidden mb-6">
                    <div className="bg-primary p-8 text-center">
                        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">Booking Confirmed!</h1>
                        <p className="text-emerald-100">Thank you for your purchase</p>
                    </div>

                    <div className="p-8">
                        {booking ? (
                            <>
                                {/* Booking Reference */}
                                <div className="text-center mb-8">
                                    <span className="text-sm text-gray-500">Booking Reference</span>
                                    <p className="text-2xl font-mono font-bold text-gray-900">
                                        #{bookingRef}
                                    </p>
                                </div>

                                {/* Tour Details */}
                                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <Calendar className="w-5 h-5 text-primary" />
                                        Tour Details
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Tour</span>
                                            <span className="font-medium text-gray-900 text-right">{booking.tour_title}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Date</span>
                                            <span className="font-medium text-gray-900">
                                                {new Date(booking.date).toLocaleDateString('en-US', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Time</span>
                                            <span className="font-medium text-gray-900">{booking.time}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Guests */}
                                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <Users className="w-5 h-5 text-primary" />
                                        Participants
                                    </h3>
                                    <div className="space-y-2">
                                        {(booking as any).guest_details?.guestCounts ? (
                                            Object.entries((booking as any).guest_details.guestCounts).map(([type, count]) => (
                                                <div key={type} className="flex justify-between text-sm">
                                                    <span className="text-gray-600">{type}</span>
                                                    <span className="font-medium">{count as number}</span>
                                                </div>
                                            ))
                                        ) : (
                                            <>
                                                {booking.adults > 0 && (
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-gray-600">Adults</span>
                                                        <span className="font-medium">{booking.adults}</span>
                                                    </div>
                                                )}
                                                {booking.students > 0 && (
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-gray-600">Students</span>
                                                        <span className="font-medium">{booking.students}</span>
                                                    </div>
                                                )}
                                                {booking.youths > 0 && (
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-gray-600">Youths</span>
                                                        <span className="font-medium">{booking.youths}</span>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                        <div className="border-t pt-2 mt-3">
                                            <div className="flex justify-between">
                                                <span className="font-bold text-gray-900">Total Paid</span>
                                                <span className="font-bold text-primary text-xl">€{booking.total_price.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Customer Info */}
                                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <Mail className="w-5 h-5 text-primary" />
                                        Contact Information
                                    </h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Name</span>
                                            <span className="font-medium">{booking.customer_name}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Email</span>
                                            <span className="font-medium">{booking.customer_email}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Important Info */}
                                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                                    <h4 className="font-bold text-amber-800 mb-2 flex items-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        Important Reminders
                                    </h4>
                                    <ul className="text-sm text-amber-700 space-y-1">
                                        <li>• Please arrive 20 minutes before your scheduled time</li>
                                        <li>• Bring a valid ID or passport</li>
                                        <li>• Dress code: Shoulders and knees must be covered</li>
                                        <li>• A confirmation email has been sent to {booking.customer_email}</li>
                                    </ul>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-8">
                                <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                                <p className="text-gray-600 text-lg">Your booking has been confirmed!</p>
                                <p className="text-sm text-gray-500 mt-2">Check your email for the confirmation details.</p>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Link
                                href="/"
                                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:opacity-90 transition-colors"
                            >
                                <Home size={18} />
                                Back to Home
                            </Link>
                            <button
                                onClick={() => window.print()}
                                className="flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors"
                            >
                                <Download size={18} />
                                Save PDF
                            </button>
                        </div>
                    </div>
                </div>

                {/* Trust Badges */}
                <div className="flex justify-center gap-6 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                        Instant Confirmation
                    </span>
                    <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-emerald-500" />
                        Mobile Tickets
                    </span>
                </div>
            </div>
        </div>
    );
}

export default function SuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        }>
            <SuccessContent />
        </Suspense>
    );
}
