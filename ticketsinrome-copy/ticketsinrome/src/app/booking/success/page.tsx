'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
    CheckCircle, Download, Mail, MessageCircle, Calendar,
    MapPin, Clock, Users, Phone, Share2, Star, FileText,
    AlertTriangle, ChevronRight, Copy, Check, ExternalLink,
    Clock3, Map, Ticket, Info
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface BookingDetails {
    id: string;
    booking_ref: string;
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
    add_ons?: any[];
    meeting_point?: string;
    duration?: string;
    guide_name?: string;
    guide_phone?: string;
    qr_code?: string;
}

function SuccessContent() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const paymentIntentId = searchParams.get('payment_intent');
    const [booking, setBooking] = useState<BookingDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);
    const [countdown, setCountdown] = useState(3);
    const [activeTab, setActiveTab] = useState<'details' | 'tickets' | 'share'>('details');

    useEffect(() => {
        const id = sessionId || paymentIntentId;
        if (id) {
            fetchBookingDetails(id);
        } else {
            setLoading(false);
        }
    }, [sessionId, paymentIntentId]);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    async function fetchBookingDetails(id: string) {
        try {
            // Try to find booking
            let query = supabase.from('bookings').select('*');

            if (sessionId) {
                query = query.eq('stripe_session_id', sessionId);
            } else if (paymentIntentId) {
                query = query.eq('stripe_payment_intent_id', paymentIntentId);
            }

            const { data, error } = await query.single();

            if (error) throw error;

            // Enhance with tour details
            const enhancedData: BookingDetails = {
                ...data,
                meeting_point: data.meeting_point || 'Via Vespasiano 20, Rome (near Ottaviano Metro)',
                duration: data.duration || '3 hours',
                guide_name: data.guide_name || 'Marco Rossi',
                guide_phone: data.guide_phone || '+39 329 929 4414',
            };

            setBooking(enhancedData);
        } catch (err) {
            console.error('Failed to fetch booking:', err);
        } finally {
            setLoading(false);
        }
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const downloadTicket = () => {
        if (booking?.booking_ref) {
            window.open(`/api/tickets/${booking.booking_ref}`, '_blank');
        }
    };

    const shareWhatsApp = () => {
        const text = `I've booked a tour in Rome! 🏛️\n\nTour: ${booking?.tour_title}\nDate: ${booking?.date}\nBooking Ref: ${booking?.booking_ref}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    };

    const shareEmail = () => {
        const subject = `My Rome Tour Booking - ${booking?.booking_ref}`;
        const body = `Hi!\n\nI've booked a tour in Rome:\n\nTour: ${booking?.tour_title}\nDate: ${booking?.date} at ${booking?.time}\nBooking Reference: ${booking?.booking_ref}\n\nYou can view the booking at: ${window.location.origin}/booking/lookup?ref=${booking?.booking_ref}`;
        window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex items-center justify-center">
                <div className="text-center">
                    <div className="relative w-20 h-20 mx-auto mb-4">
                        <div className="absolute inset-0 border-4 border-emerald-200 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-emerald-600 rounded-full border-t-transparent animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-2xl font-bold text-emerald-600">{countdown}</span>
                        </div>
                    </div>
                    <p className="text-gray-600">Confirming your booking...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-gray-50">
            {/* Confetti Animation */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
                {[...Array(30)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute animate-confetti"
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

            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/" className="text-xl font-bold text-gray-900">
                        ticketsinrome
                    </Link>
                    <div className="flex items-center gap-2 text-emerald-600">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-medium">Booking Confirmed</span>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-8">
                {/* Success Banner */}
                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 text-white mb-8 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>

                    <div className="relative z-10">
                        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-10 h-10" />
                        </div>
                        <h1 className="text-3xl font-bold mb-2">Grazie! You're All Set!</h1>
                        <p className="text-emerald-100 text-lg">
                            Your booking is confirmed and tickets are ready
                        </p>
                    </div>
                </div>

                {booking && (
                    <>
                        {/* Booking Reference Card */}
                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Booking Reference</p>
                                    <div className="flex items-center gap-3">
                                        <span className="text-3xl font-mono font-bold text-gray-900 tracking-wider">
                                            {booking.booking_ref}
                                        </span>
                                        <button
                                            onClick={() => copyToClipboard(booking.booking_ref)}
                                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                            title="Copy reference"
                                        >
                                            {copied ? <Check className="w-5 h-5 text-emerald-600" /> : <Copy className="w-5 h-5 text-gray-400" />}
                                        </button>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={downloadTicket}
                                        className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-colors"
                                    >
                                        <Download className="w-5 h-5" />
                                        Download Tickets
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 mb-6">
                            <div className="flex border-b border-gray-200">
                                <button
                                    onClick={() => setActiveTab('details')}
                                    className={`flex-1 px-4 py-4 font-medium text-sm flex items-center justify-center gap-2 transition-colors ${activeTab === 'details'
                                        ? 'text-emerald-600 border-b-2 border-emerald-600'
                                        : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    <Info className="w-4 h-4" />
                                    Booking Details
                                </button>
                                <button
                                    onClick={() => setActiveTab('tickets')}
                                    className={`flex-1 px-4 py-4 font-medium text-sm flex items-center justify-center gap-2 transition-colors ${activeTab === 'tickets'
                                        ? 'text-emerald-600 border-b-2 border-emerald-600'
                                        : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    <Ticket className="w-4 h-4" />
                                    Your Tickets
                                </button>
                                <button
                                    onClick={() => setActiveTab('share')}
                                    className={`flex-1 px-4 py-4 font-medium text-sm flex items-center justify-center gap-2 transition-colors ${activeTab === 'share'
                                        ? 'text-emerald-600 border-b-2 border-emerald-600'
                                        : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    <Share2 className="w-4 h-4" />
                                    Share
                                </button>
                            </div>

                            <div className="p-6">
                                {activeTab === 'details' && (
                                    <div className="space-y-6">
                                        {/* Tour Info */}
                                        <div className="flex gap-4">
                                            <div className="w-20 h-20 bg-gray-100 rounded-xl flex-shrink-0 flex items-center justify-center">
                                                <MapPin className="w-8 h-8 text-gray-400" />
                                            </div>
                                            <div className="flex-1">
                                                <h2 className="text-xl font-bold text-gray-900">{booking.tour_title}</h2>
                                                <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="w-4 h-4" />
                                                        {booking.date}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-4 h-4" />
                                                        {booking.time}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock3 className="w-4 h-4" />
                                                        {booking.duration}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Meeting Point */}
                                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                                            <div className="flex items-start gap-3">
                                                <MapPin className="w-5 h-5 text-amber-600 mt-0.5" />
                                                <div>
                                                    <h3 className="font-semibold text-amber-900">Meeting Point</h3>
                                                    <p className="text-amber-800 mt-1">{booking.meeting_point}</p>
                                                    <a
                                                        href={`https://maps.google.com/?q=${encodeURIComponent(booking.meeting_point || '')}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1 text-amber-700 text-sm font-medium mt-2 hover:underline"
                                                    >
                                                        Open in Maps <ExternalLink className="w-3 h-3" />
                                                    </a>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Guest Details */}
                                        <div className="border-t border-gray-200 pt-6">
                                            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                                <Users className="w-5 h-5 text-emerald-600" />
                                                Guest Details
                                            </h3>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="bg-gray-50 rounded-lg p-4">
                                                    <p className="text-sm text-gray-500">Lead Guest</p>
                                                    <p className="font-medium text-gray-900">{booking.customer_name}</p>
                                                </div>
                                                <div className="bg-gray-50 rounded-lg p-4">
                                                    <p className="text-sm text-gray-500">Total Guests</p>
                                                    <p className="font-medium text-gray-900">{booking.guests} people</p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {booking.adults} Adults, {booking.students} Students, {booking.youths} Youths
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Guide Info */}
                                        {booking.guide_name && (
                                            <div className="border-t border-gray-200 pt-6">
                                                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                                    <Star className="w-5 h-5 text-emerald-600" />
                                                    Your Guide
                                                </h3>
                                                <div className="bg-emerald-50 rounded-xl p-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 bg-emerald-200 rounded-full flex items-center justify-center">
                                                            <span className="text-emerald-700 font-bold">
                                                                {booking.guide_name.charAt(0)}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-gray-900">{booking.guide_name}</p>
                                                            <p className="text-sm text-gray-600">Expert Local Guide</p>
                                                        </div>
                                                        <a
                                                            href={`tel:${booking.guide_phone}`}
                                                            className="ml-auto flex items-center gap-1 px-3 py-1.5 bg-white rounded-lg text-emerald-600 font-medium text-sm hover:bg-emerald-100 transition-colors"
                                                        >
                                                            <Phone className="w-4 h-4" />
                                                            Call
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Important Info */}
                                        <div className="border-t border-gray-200 pt-6">
                                            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                                <AlertTriangle className="w-5 h-5 text-amber-500" />
                                                Important Information
                                            </h3>
                                            <ul className="space-y-2 text-sm text-gray-700">
                                                <li className="flex items-start gap-2">
                                                    <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                                                    Arrive 20 minutes early for check-in
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                                                    Bring valid ID/Passport for all guests
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                                                    Dress code: Shoulders & knees covered
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                                                    Comfortable walking shoes recommended
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                                                    Free cancellation up to 24 hours before
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'tickets' && (
                                    <div className="space-y-6">
                                        {/* Ticket Preview */}
                                        <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl p-6 text-white relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>

                                            <div className="relative z-10">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <p className="text-white/80 text-sm">ADMIT ONE</p>
                                                        <h3 className="text-xl font-bold mt-1">{booking.tour_title}</h3>
                                                        <p className="mt-2 text-white/90">{booking.date} at {booking.time}</p>
                                                    </div>
                                                    <div className="bg-white/20 rounded-lg p-3">
                                                        <Ticket className="w-8 h-8" />
                                                    </div>
                                                </div>

                                                <div className="mt-6 pt-6 border-t border-white/20">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className="text-white/80 text-sm">Reference</p>
                                                            <p className="text-2xl font-mono font-bold">{booking.booking_ref}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-white/80 text-sm">Guests</p>
                                                            <p className="text-2xl font-bold">{booking.guests}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Download Options */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <button
                                                onClick={downloadTicket}
                                                className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border-2 border-gray-200 hover:border-emerald-500 hover:bg-emerald-50 transition-colors text-left"
                                            >
                                                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                                                    <FileText className="w-6 h-6 text-emerald-600" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900">Download PDF Ticket</p>
                                                    <p className="text-sm text-gray-500">Print or save to your phone</p>
                                                </div>
                                            </button>

                                            <button
                                                onClick={() => window.print()}
                                                className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border-2 border-gray-200 hover:border-emerald-500 hover:bg-emerald-50 transition-colors text-left"
                                            >
                                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                                    <Download className="w-6 h-6 text-blue-600" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900">Print Ticket</p>
                                                    <p className="text-sm text-gray-500">Open print dialog</p>
                                                </div>
                                            </button>
                                        </div>

                                        {/* Add to Wallet */}
                                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                            <p className="font-medium text-gray-900 mb-3">Add to Phone Wallet</p>
                                            <div className="flex gap-3">
                                                <button className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                                                    <span>🍎</span> Apple Wallet
                                                </button>
                                                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-800 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                                                    <span>▶️</span> Google Pay
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'share' && (
                                    <div className="space-y-6">
                                        <p className="text-gray-600">Share your booking with travel companions:</p>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <button
                                                onClick={shareWhatsApp}
                                                className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border-2 border-green-200 hover:border-green-500 transition-colors text-left"
                                            >
                                                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-white text-2xl">
                                                    💬
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900">WhatsApp</p>
                                                    <p className="text-sm text-gray-500">Share via WhatsApp</p>
                                                </div>
                                            </button>

                                            <button
                                                onClick={shareEmail}
                                                className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border-2 border-blue-200 hover:border-blue-500 transition-colors text-left"
                                            >
                                                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white">
                                                    <Mail className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900">Email</p>
                                                    <p className="text-sm text-gray-500">Send via email</p>
                                                </div>
                                            </button>

                                            <button
                                                onClick={() => copyToClipboard(`${window.location.origin}/booking/lookup?ref=${booking.booking_ref}`)}
                                                className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border-2 border-gray-200 hover:border-gray-500 transition-colors text-left"
                                            >
                                                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                                                    <Copy className="w-6 h-6 text-gray-600" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900">Copy Link</p>
                                                    <p className="text-sm text-gray-500">Copy booking URL</p>
                                                </div>
                                            </button>

                                            <button
                                                onClick={() => {
                                                    if (navigator.share) {
                                                        navigator.share({
                                                            title: `My Rome Tour - ${booking.tour_title}`,
                                                            text: `I've booked a tour in Rome!`,
                                                            url: `${window.location.origin}/booking/lookup?ref=${booking.booking_ref}`
                                                        });
                                                    }
                                                }}
                                                className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl border-2 border-purple-200 hover:border-purple-500 transition-colors text-left"
                                            >
                                                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center text-white">
                                                    <Share2 className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900">More Options</p>
                                                    <p className="text-sm text-gray-500">Native share menu</p>
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Next Steps */}
                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">What's Next?</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="flex gap-3">
                                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Mail className="w-5 h-5 text-emerald-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">Check Your Email</p>
                                        <p className="text-sm text-gray-500">We've sent your tickets and details</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Download className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">Download Tickets</p>
                                        <p className="text-sm text-gray-500">Save them offline on your phone</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Clock3 className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">24h Reminder</p>
                                        <p className="text-sm text-gray-500">We'll send you a reminder</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Help Section */}
                        <div className="mt-8 text-center">
                            <p className="text-gray-600 mb-4">Need help with your booking?</p>
                            <div className="flex justify-center gap-4">
                                <a
                                    href="tel:3517869798"
                                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    <Phone className="w-4 h-4" />
                                    Call Us
                                </a>
                                <a
                                    href="https://wa.me/3517869798"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    <MessageCircle className="w-4 h-4" />
                                    WhatsApp
                                </a>
                            </div>
                        </div>
                    </>
                )}
            </main>

            <style jsx global>{`
                @keyframes confetti {
                    0% { transform: translateY(-100px) rotate(0deg); opacity: 1; }
                    100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
                }
                .animate-confetti {
                    animation: confetti linear forwards;
                }
            `}</style>
        </div>
    );
}

export default function BookingSuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
        }>
            <SuccessContent />
        </Suspense>
    );
}
