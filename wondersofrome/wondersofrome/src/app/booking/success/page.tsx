'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
    CheckCircle, Home, Calendar, Users, Clock, Mail, Download, MapPin, 
    FileText, Phone, Briefcase, Star, Share2, Gift, AlertTriangle,
    Building2, Luggage, Utensils, Sparkles, ChevronRight
} from 'lucide-react';
import { Suspense, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';

interface BookingDetails {
    id: string;
    tour_title: string;
    tour_slug: string;
    date: string;
    time: string;
    guests: number;
    adults: number;
    students: number;
    youths: number;
    total_price: number;
    customer_name: string;
    customer_email: string;
    customer_phone?: string;
    status: string;
    guest_details?: any;
    add_ons?: any[];
    stripe_session_id?: string;
    stripe_payment_intent_id?: string;
    site_id?: string;
    created_at?: string;
}

interface TourDetails {
    meetingPoint?: string;
    duration?: string;
    mainImage?: any;
    description?: string;
}

function SuccessContent() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const paymentIntentId = searchParams.get('payment_intent');
    const bookingSlug = searchParams.get('booking');
    const [booking, setBooking] = useState<BookingDetails | null>(null);
    const [tour, setTour] = useState<TourDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [showConfetti, setShowConfetti] = useState(true);

    useEffect(() => {
        const id = sessionId || paymentIntentId;
        if (id) {
            fetchBookingDetails(id);
        } else {
            setLoading(false);
        }
        const timer = setTimeout(() => setShowConfetti(false), 5000);
        return () => clearTimeout(timer);
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
            if (error) throw error;
            setBooking(data);
            if (data?.tour_slug) {
                fetchTourDetails(data.tour_slug);
            }
        } catch (err) {
            console.error('Failed to fetch booking:', err);
        } finally {
            setLoading(false);
        }
    }

    async function fetchTourDetails(slug: string) {
        try {
            const { createClient } = await import('next-sanity');
            const sanityClient = createClient({
                projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
                dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
                apiVersion: '2024-01-01',
                useCdn: true,
            });
            const tour = await sanityClient.fetch(
                `*[_type == "tour" && slug.current == $slug][0]{ meetingPoint, duration }`,
                { slug }
            );
            setTour({
                meetingPoint: tour?.meetingPoint || 'Please check your confirmation email for the meeting point.',
                duration: tour?.duration || '3 hours',
            });
        } catch (err) {
            console.error('Failed to fetch tour:', err);
            setTour({ meetingPoint: 'Please check your confirmation email for meeting details.', duration: '3 hours' });
        }
    }

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };

    const calculateDiscountCode = () => {
        if (!booking?.id) return '';
        return `WONDERS${booking.id.slice(-6).toUpperCase()}`;
    };

    const getAddOns = () => {
        if (booking?.add_ons && booking.add_ons.length > 0) return booking.add_ons;
        if (booking?.guest_details?.addOns) return booking.guest_details.addOns;
        return [];
    };

    const addToGoogleCalendar = () => {
        if (!booking) return;
        const startDate = booking.date?.replace(/-/g, '') + 'T090000';
        const endDate = booking.date?.replace(/-/g, '') + 'T120000';
        const params = new URLSearchParams({
            action: 'TEMPLATE',
            text: `Rome Tour: ${booking.tour_title}`,
            dates: `${startDate}/${endDate}`,
            details: `Booking ID: ${booking.id?.slice(-8).toUpperCase()}\nMeeting point: ${tour?.meetingPoint || 'See confirmation email'}`,
            location: tour?.meetingPoint || 'Rome, Italy',
        });
        window.open(`https://calendar.google.com/calendar/render?${params.toString()}`, '_blank');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Confirming your booking...</p>
                </div>
            </div>
        );
    }

    const addOns = getAddOns();

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            {showConfetti && (
                <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute animate-fall"
                            style={{
                                left: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 2}s`,
                                animationDuration: `${3 + Math.random() * 2}s`,
                            }}
                        >
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{
                                    backgroundColor: ['#10b981', '#f59e0b', '#3b82f6', '#ef4444', '#8b5cf6'][i % 5],
                                }}
                            />
                        </div>
                    ))}
                </div>
            )}

            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl border border-emerald-100 overflow-hidden mb-6">
                    <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-8 text-center">
                        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                            <CheckCircle className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">Booking Confirmed!</h1>
                        <p className="text-emerald-100">Grazie! Your Wonders of Rome adventure awaits</p>
                    </div>

                    <div className="p-8">
                        {booking ? (
                            <>
                                <div className="text-center mb-8 p-4 bg-gray-50 rounded-xl">
                                    <span className="text-sm text-gray-500">Booking Reference</span>
                                    <p className="text-3xl font-mono font-bold text-gray-900 tracking-wider">
                                        #{booking.id?.slice(-8).toUpperCase()}
                                    </p>
                                </div>
                                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 mb-6 border border-emerald-100">
                                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <Calendar className="w-5 h-5 text-emerald-600" />
                                        Tour Details
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-start">
                                            <span className="text-gray-600">Tour</span>
                                            <span className="font-semibold text-gray-900 text-right max-w-[60%]">{booking.tour_title}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Date</span>
                                            <span className="font-semibold text-gray-900">{formatDate(booking.date)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Time</span>
                                            <span className="font-semibold text-gray-900">{booking.time}</span>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : null}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Link href="/" className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors shadow-lg">
                                <Home size={18} /> Back to Home
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes fall {
                    0% { transform: translateY(-100px) rotate(0deg); opacity: 1; }
                    100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
                }
                .animate-fall {
                    animation: fall linear forwards;
                }
            ` }} />
        </div>
    );
}

export default function SuccessPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div></div>}>
            <SuccessContent />
        </Suspense>
    );
}
