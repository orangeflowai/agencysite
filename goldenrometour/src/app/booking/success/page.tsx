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
        // Try to find booking by session_id or payment_intent
        const id = sessionId || paymentIntentId;
        if (id) {
            fetchBookingDetails(id);
        } else {
            setLoading(false);
        }

        // Hide confetti after 5 seconds
        const timer = setTimeout(() => setShowConfetti(false), 5000);
        return () => clearTimeout(timer);
    }, [sessionId, paymentIntentId]);

    async function fetchBookingDetails(id: string) {
        try {
            // Try to find by session_id first, then payment_intent
            let query = supabase.from('bookings').select('*');
            
            if (sessionId) {
                query = query.eq('stripe_session_id', sessionId);
            } else if (paymentIntentId) {
                query = query.eq('stripe_payment_intent_id', paymentIntentId);
            }
            
            const { data, error } = await query.single();
            
            if (error) throw error;
            setBooking(data);
            
            // Fetch tour details for meeting point
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
            // Use a default meeting point for {process.env.NEXT_PUBLIC_SITE_NAME || "Your Agency"}
            setTour({
                meetingPoint: 'Via Vespasiano 20, Rome (near Ottaviano Metro)',
                duration: '3 hours',
            });
        } catch (err) {
            console.error('Failed to fetch tour:', err);
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
        // Generate a discount code from booking ID
        return `WONDERS${booking.id.slice(-6).toUpperCase()}`;
    };

    // Parse add-ons from guest_details or add_ons
    const getAddOns = () => {
        if (booking?.add_ons && booking.add_ons.length > 0) {
            return booking.add_ons;
        }
        if (booking?.guest_details?.addOns) {
            return booking.guest_details.addOns;
        }
        return [];
    };

    // Parse luggage info
    const hasLuggageStorage = () => {
        return booking?.guest_details?.logistics?.luggageDeposit || false;
    };

    const getLuggageHours = () => {
        return booking?.guest_details?.logistics?.luggageHours || 3;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600">Confirming your booking...</p>
                </div>
            </div>
        );
    }

    const addOns = getAddOns();
    const luggageStorage = hasLuggageStorage();
    const luggageHours = getLuggageHours();

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            {/* Confetti Animation */}
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
                {/* Success Header */}
                <div className="bg-white rounded-2xl shadow-xl border border-border overflow-hidden mb-6">
                    <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-8 text-center">
                        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                            <CheckCircle className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">Booking Confirmed!</h1>
                        <p className="text-emerald-100">Grazie! Your {process.env.NEXT_PUBLIC_SITE_NAME || "Your Agency"} adventure awaits</p>
                    </div>

                    <div className="p-8">
                        {booking ? (
                            <>
                                {/* Booking Reference */}
                                <div className="text-center mb-8 p-4 bg-gray-50 rounded-xl">
                                    <span className="text-sm text-gray-500">Booking Reference</span>
                                    <p className="text-3xl font-mono font-bold text-gray-900 tracking-wider">
                                        #{booking.id?.slice(-8).toUpperCase()}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">Save this for your records</p>
                                </div>

                                {/* Tour Details Card */}
                                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 mb-6 border border-border">
                                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <Calendar className="w-5 h-5 text-primary" />
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
                                        {tour?.meetingPoint && (
                                            <div className="flex justify-between items-start">
                                                <span className="text-gray-600">Meeting Point</span>
                                                <span className="font-semibold text-gray-900 text-right text-sm max-w-[60%]">{tour.meetingPoint}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Participants */}
                                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <Users className="w-5 h-5 text-primary" />
                                        Participants ({booking.guests} guests)
                                    </h3>
                                    <div className="space-y-2">
                                        {booking.adults > 0 && (
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600 flex items-center gap-2">
                                                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                                    Adults
                                                </span>
                                                <span className="font-medium">{booking.adults}</span>
                                            </div>
                                        )}
                                        {booking.students > 0 && (
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600 flex items-center gap-2">
                                                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                                                    Students
                                                </span>
                                                <span className="font-medium">{booking.students}</span>
                                            </div>
                                        )}
                                        {booking.youths > 0 && (
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600 flex items-center gap-2">
                                                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                                                    Youths
                                                </span>
                                                <span className="font-medium">{booking.youths}</span>
                                            </div>
                                        )}
                                        
                                        {/* Guest Names if available */}
                                        {booking.guest_details?.guests && (
                                            <div className="mt-4 pt-4 border-t border-gray-200">
                                                <p className="text-xs font-medium text-gray-500  mb-2">Registered Guests</p>
                                                <div className="space-y-1">
                                                    {booking.guest_details.guests.slice(0, 5).map((guest: any, i: number) => (
                                                        <p key={i} className="text-sm text-gray-700">
                                                            {guest.index || i + 1}. {guest.name} <span className="text-gray-400">({guest.type})</span>
                                                        </p>
                                                    ))}
                                                    {booking.guest_details.guests.length > 5 && (
                                                        <p className="text-sm text-gray-500">+{booking.guest_details.guests.length - 5} more</p>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        <div className="border-t-2 border-gray-200 pt-3 mt-3">
                                            <div className="flex justify-between items-center">
                                                <span className="font-bold text-gray-900">Total Paid</span>
                                                <span className="font-bold text-primary text-2xl">€{booking.total_price.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Add-ons Display */}
                                {(addOns.length > 0 || luggageStorage) && (
                                    <div className="bg-amber-50 rounded-xl p-6 mb-6 border border-amber-100">
                                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                            <Sparkles className="w-5 h-5 text-amber-600" />
                                            Your Add-ons
                                        </h3>
                                        <div className="space-y-2">
                                            {addOns.map((addon: any, i: number) => (
                                                <div key={i} className="flex justify-between text-sm">
                                                    <span className="text-gray-700">{addon.name}</span>
                                                    <span className="font-medium">
                                                        {addon.total ? `€${addon.total.toFixed(2)}` : `€${addon.price}`}
                                                        {addon.quantity && addon.quantity > 1 && (
                                                            <span className="text-gray-400 text-xs ml-1">({addon.quantity})</span>
                                                        )}
                                                    </span>
                                                </div>
                                            ))}
                                            {luggageStorage && (
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-700">Luggage Storage ({luggageHours} hours)</span>
                                                    <span className="font-medium">€{(12 * luggageHours).toFixed(2)}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Contact Info */}
                                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <Mail className="w-5 h-5 text-primary" />
                                        Contact Information
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                                                <span className="font-bold text-primary">
                                                    {booking.customer_name.charAt(0)}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{booking.customer_name}</p>
                                                <p className="text-sm text-gray-500">Lead Traveler</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <span className="text-gray-500">Email</span>
                                                <p className="font-medium">{booking.customer_email}</p>
                                            </div>
                                            {booking.customer_phone && (
                                                <div>
                                                    <span className="text-gray-500">Phone</span>
                                                    <p className="font-medium">{booking.customer_phone}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Important Info */}
                                <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6">
                                    <h4 className="font-bold text-amber-800 mb-3 flex items-center gap-2">
                                        <AlertTriangle className="w-5 h-5" />
                                        Important Reminders
                                    </h4>
                                    <ul className="text-sm text-amber-800 space-y-2">
                                        <li className="flex items-start gap-2">
                                            <Clock className="w-4 h-4 mt-0.5 shrink-0" />
                                            <span>Arrive <strong>20 minutes early</strong> for check-in</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <FileText className="w-4 h-4 mt-0.5 shrink-0" />
                                            <span>Bring <strong>valid ID/Passport</strong> for all guests</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="w-4 h-4 rounded-full border-2 border-amber-600 shrink-0 mt-0.5"></span>
                                            <span><strong>Dress code:</strong> Shoulders & knees covered</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <Mail className="w-4 h-4 mt-0.5 shrink-0" />
                                            <span>Confirmation sent to <strong>{booking.customer_email}</strong></span>
                                        </li>
                                    </ul>
                                </div>

                                {/* Discount for next booking */}
                                <div className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl p-6 mb-6 text-white">
                                    <div className="flex items-center gap-3 mb-3">
                                        <Gift className="w-8 h-8" />
                                        <div>
                                            <h4 className="font-bold text-lg">Your Next Adventure Awaits!</h4>
                                            <p className="text-violet-100 text-sm">Book another tour and save 10%</p>
                                        </div>
                                    </div>
                                    <div className="bg-white/20 rounded-lg p-3 text-center">
                                        <span className="text-xs text-violet-100  tracking-wide">Your Discount Code</span>
                                        <p className="text-2xl font-mono font-bold tracking-wider">{calculateDiscountCode()}</p>
                                    </div>
                                    <p className="text-xs text-violet-200 mt-2 text-center">Valid for 6 months • Use at checkout</p>
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
                                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-primary text-white font-bold rounded-xl hover:opacity-90 transition-colors shadow-lg"
                            >
                                <Home size={18} />
                                Back to Home
                            </Link>
                            <button
                                onClick={() => window.print()}
                                className="flex items-center justify-center gap-2 px-6 py-4 bg-white border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors"
                            >
                                <Download size={18} />
                                Save as PDF
                            </button>
                            <button
                                onClick={() => {
                                    if (navigator.share) {
                                        navigator.share({
                                            title: `My ${process.env.NEXT_PUBLIC_SITE_NAME || "Your Agency"} Booking`,
                                            text: `I just booked ${booking?.tour_title} on ${booking?.date}!`,
                                            url: window.location.href,
                                        });
                                    }
                                }}
                                className="flex items-center justify-center gap-2 px-6 py-4 bg-white border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors"
                            >
                                <Share2 size={18} />
                                Share
                            </button>
                        </div>
                    </div>
                </div>

                {/* What's Next */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
                    <h3 className="font-bold text-gray-900 mb-4">What&apos;s Next?</h3>
                    <div className="space-y-4">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
                                <Mail className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900">Check Your Email</h4>
                                <p className="text-sm text-gray-600">We&apos;ve sent your tickets and meeting instructions to your inbox</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                                <Phone className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900">24-Hour Reminder</h4>
                                <p className="text-sm text-gray-600">We&apos;ll send you an SMS reminder with meeting point details</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
                                <MapPin className="w-5 h-5 text-amber-600" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900">Arrive Early</h4>
                                <p className="text-sm text-gray-600">Meet your guide 20 minutes before departure time</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Explore More Tours */}
                <div className="text-center">
                    <p className="text-gray-600 mb-4">Explore more amazing Rome experiences</p>
                    <Link 
                        href="/tours"
                        className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
                    >
                        View All Tours <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>

            <style jsx global>{`
                @keyframes fall {
                    0% { transform: translateY(-100px) rotate(0deg); opacity: 1; }
                    100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
                }
                .animate-fall {
                    animation: fall linear forwards;
                }
            `}</style>
        </div>
    );
}

export default function SuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        }>
            <SuccessContent />
        </Suspense>
    );
}
