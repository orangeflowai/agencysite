
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAdmin } from '@/context/AdminContext';
import { Loader2, Mail, Calendar, User, ChevronDown, ChevronUp, FileText } from 'lucide-react';

interface GuestDetail {
    name: string;
    passport: string;
}

interface Booking {
    id: string;
    tour_title: string;
    date: string;
    guests: number;
    total_price: number;
    status: string;
    customer_email: string;
    customer_name: string;
    adults?: number;
    students?: number;
    youths?: number;
    guest_details?: GuestDetail[];
    created_at?: string;
    stripe_session_id?: string;
}

export default function BookingsPage() {
    const { selectedSiteId } = useAdmin();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedMap, setExpandedMap] = useState<Record<string, boolean>>({});

    useEffect(() => {
        fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedSiteId]);

    async function fetchBookings() {
        try {
            let query = supabase.from('bookings').select('*').order('created_at', { ascending: false });
            if (selectedSiteId) query = query.eq('site_id', selectedSiteId);
            const { data, error } = await query;

            if (error) throw error;
            setBookings(data || []);
        } catch (err) {
            console.error("Error fetching bookings:", err);
        } finally {
            setLoading(false);
        }
    }

    const toggleExpand = (id: string) => {
        setExpandedMap(prev => ({ ...prev, [id]: !prev[id] }));
    };

    if (loading) return <div className="p-12 text-center"><Loader2 className="animate-spin h-8 w-8 mx-auto text-emerald-600" /></div>;

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-900">Recent Bookings</h1>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {bookings.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">No bookings found.</div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {bookings.map((booking) => {
                            const isExpanded = expandedMap[booking.id];
                            return (
                                <div key={booking.id} className="flex flex-col hover:bg-gray-50/50 transition-colors">
                                    {/* Main Row */}
                                    <div
                                        onClick={() => toggleExpand(booking.id)}
                                        className="p-6 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
                                    >
                                        <div className="space-y-1">
                                            <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                                {booking.tour_title}
                                                {isExpanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                                            </h3>
                                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                                                <span className="flex items-center"><Calendar className="w-4 h-4 mr-1" /> {booking.date}</span>
                                                <span className="flex items-center"><User className="w-4 h-4 mr-1" /> {booking.guests} Guests</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <p className="font-bold text-emerald-900">€{booking.total_price}</p>
                                                <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-full ${booking.status === 'paid' ? 'bg-emerald-100 text-emerald-700' :
                                                        booking.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {booking.status}
                                                </span>
                                            </div>
                                            <div className="text-right text-xs text-gray-400">
                                                <div className="flex items-center justify-end"><Mail className="w-3 h-3 mr-1" /> {booking.customer_email}</div>
                                                <div>{booking.customer_name}</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expanded Details */}
                                    {isExpanded && (
                                        <div className="px-6 pb-6 bg-gray-50/50 border-t border-gray-100 text-sm">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                                {/* Breakdown */}
                                                <div>
                                                    <h4 className="font-bold text-gray-700 uppercase text-xs mb-2">Ticket Breakdown</h4>
                                                    <ul className="space-y-1 text-gray-600">
                                                        <li>Adults: {booking.adults || 0}</li>
                                                        <li>Students: {booking.students || 0}</li>
                                                        <li>Youths: {booking.youths || 0}</li>
                                                    </ul>
                                                </div>

                                                {/* Guest Details */}
                                                <div>
                                                    <h4 className="font-bold text-gray-700 uppercase text-xs mb-2">Guest List (Security)</h4>
                                                    {booking.guest_details && Array.isArray(booking.guest_details) && booking.guest_details.length > 0 ? (
                                                        <div className="space-y-2">
                                                            {booking.guest_details.map((guest: GuestDetail, idx: number) => (
                                                                <div key={idx} className="bg-white p-2 rounded border border-gray-200 flex justify-between items-center">
                                                                    <span className="font-medium text-gray-900">{guest.name}</span>
                                                                    <span className="text-gray-500 font-mono text-xs flex items-center gap-1">
                                                                        <FileText size={12} /> {guest.passport}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <p className="text-gray-400 italic">No detailed guest info provided.</p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="mt-4 text-xs text-gray-400 font-mono">
                                                Session ID: {booking.stripe_session_id}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
