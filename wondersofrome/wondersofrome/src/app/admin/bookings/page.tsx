'use client';

import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import {
    Loader2, Mail, Calendar, User, ChevronDown, ChevronUp,
    FileText, Search, Filter, Download, Phone, Clock,
    MapPin, CheckCircle, XCircle, AlertCircle, Users,
    ArrowUpDown, RefreshCw
} from 'lucide-react';

const ITEMS_PER_PAGE = 25;

export default function BookingsPage() {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedMap, setExpandedMap] = useState<Record<string, boolean>>({});
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [sortField, setSortField] = useState<string>('created_at');
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetchBookings();
    }, []);

    async function fetchBookings() {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('bookings')
                .select('*')
                .order('created_at', { ascending: false });

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

    // Filter & Search
    const filtered = useMemo(() => {
        let result = [...bookings];

        // Status filter
        if (statusFilter !== 'all') {
            result = result.filter(b => b.status === statusFilter);
        }

        // Search
        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase();
            result = result.filter(b =>
                (b.customer_name || '').toLowerCase().includes(term) ||
                (b.customer_email || '').toLowerCase().includes(term) ||
                (b.tour_title || '').toLowerCase().includes(term) ||
                (b.stripe_session_id || '').toLowerCase().includes(term)
            );
        }

        // Sort
        result.sort((a, b) => {
            const aVal = a[sortField] || '';
            const bVal = b[sortField] || '';
            if (sortDir === 'asc') return aVal > bVal ? 1 : -1;
            return aVal < bVal ? 1 : -1;
        });

        return result;
    }, [bookings, statusFilter, searchTerm, sortField, sortDir]);

    // Pagination
    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    // Stats
    const stats = useMemo(() => {
        const paid = bookings.filter(b => b.status === 'paid');
        const pending = bookings.filter(b => b.status === 'pending');
        const cancelled = bookings.filter(b => b.status === 'cancelled');
        const revenue = paid.reduce((sum, b) => sum + (b.total_price || 0), 0);
        return { total: bookings.length, paid: paid.length, pending: pending.length, cancelled: cancelled.length, revenue };
    }, [bookings]);

    const toggleSort = (field: string) => {
        if (sortField === field) {
            setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDir('desc');
        }
    };

    // CSV Export
    const exportCSV = () => {
        const headers = ['Tour', 'Customer', 'Email', 'Date', 'Guests', 'Total', 'Status', 'Created'];
        const rows = filtered.map(b => [
            b.tour_title, b.customer_name, b.customer_email,
            b.date, b.guests, b.total_price, b.status,
            new Date(b.created_at).toLocaleDateString()
        ]);
        const csv = [headers, ...rows].map(r => r.map((v: any) => `"${v}"`).join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `bookings-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    const statusColors: Record<string, string> = {
        paid: 'bg-emerald-100 text-emerald-700',
        pending: 'bg-amber-100 text-amber-700',
        cancelled: 'bg-red-100 text-red-700',
    };

    const statusIcons: Record<string, any> = {
        paid: CheckCircle,
        pending: Clock,
        cancelled: XCircle,
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin h-8 w-8 text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Bookings</h1>
                    <p className="text-muted-foreground mt-1">{stats.total} total bookings · €{stats.revenue.toLocaleString('en', { minimumFractionDigits: 2 })} revenue</p>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={fetchBookings} className="p-2 text-muted-foreground hover:text-muted-foreground hover:bg-gray-100 rounded-lg transition-colors" title="Refresh">
                        <RefreshCw className="w-5 h-5" />
                    </button>
                    <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-foreground font-medium rounded-lg hover:bg-gray-200 transition-colors">
                        <Download className="w-4 h-4" />
                        Export CSV
                    </button>
                </div>
            </div>

            {/* Status Tabs */}
            <div className="flex flex-wrap gap-2">
                {[
                    { key: 'all', label: 'All', count: stats.total },
                    { key: 'paid', label: 'Paid', count: stats.paid },
                    { key: 'pending', label: 'Pending', count: stats.pending },
                    { key: 'cancelled', label: 'Cancelled', count: stats.cancelled },
                ].map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => { setStatusFilter(tab.key); setCurrentPage(1); }}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${statusFilter === tab.key
                                ? 'bg-primary text-white shadow-sm'
                                : 'bg-card text-muted-foreground border border-border hover:bg-muted'
                            }`}
                    >
                        {tab.label}
                        <span className={`ml-2 px-1.5 py-0.5 rounded-full text-xs ${statusFilter === tab.key ? 'bg-card/20' : 'bg-gray-100'
                            }`}>{tab.count}</span>
                    </button>
                ))}
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <input
                    type="text"
                    placeholder="Search by customer name, email, or tour title..."
                    value={searchTerm}
                    onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                />
            </div>

            {/* Results */}
            <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
                {/* Table Header */}
                <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-muted border-b border-border text-xs font-bold text-muted-foreground  tracking-wider">
                    <div className="col-span-4 flex items-center gap-1 cursor-pointer hover:text-foreground" onClick={() => toggleSort('tour_title')}>
                        Tour <ArrowUpDown className="w-3 h-3" />
                    </div>
                    <div className="col-span-2 flex items-center gap-1 cursor-pointer hover:text-foreground" onClick={() => toggleSort('customer_name')}>
                        Customer <ArrowUpDown className="w-3 h-3" />
                    </div>
                    <div className="col-span-2 flex items-center gap-1 cursor-pointer hover:text-foreground" onClick={() => toggleSort('date')}>
                        Date <ArrowUpDown className="w-3 h-3" />
                    </div>
                    <div className="col-span-1">Guests</div>
                    <div className="col-span-1 flex items-center gap-1 cursor-pointer hover:text-foreground" onClick={() => toggleSort('total_price')}>
                        Price <ArrowUpDown className="w-3 h-3" />
                    </div>
                    <div className="col-span-1">Status</div>
                    <div className="col-span-1"></div>
                </div>

                {paginated.length === 0 ? (
                    <div className="p-12 text-center text-muted-foreground">
                        <AlertCircle className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                        <p className="font-medium">No bookings found</p>
                        <p className="text-sm mt-1">Try adjusting your search or filters</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {paginated.map((booking) => {
                            const isExpanded = expandedMap[booking.id];
                            const StatusIcon = statusIcons[booking.status] || AlertCircle;
                            return (
                                <div key={booking.id} className="flex flex-col hover:bg-muted/50 transition-colors">
                                    {/* Main Row */}
                                    <div
                                        onClick={() => toggleExpand(booking.id)}
                                        className="px-6 py-4 cursor-pointer"
                                    >
                                        {/* Mobile Layout */}
                                        <div className="md:hidden space-y-2">
                                            <div className="flex items-center justify-between">
                                                <h3 className="font-bold text-foreground text-sm">{booking.tour_title}</h3>
                                                <span className={`text-xs font-bold  px-2 py-1 rounded-full ${statusColors[booking.status] || 'bg-gray-100 text-muted-foreground'}`}>
                                                    {booking.status}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                                                <span>{booking.customer_name}</span>
                                                <span className="font-bold text-foreground">€{booking.total_price}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {booking.date}</span>
                                                <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {booking.guests}</span>
                                            </div>
                                        </div>

                                        {/* Desktop Layout */}
                                        <div className="hidden md:grid grid-cols-12 gap-4 items-center">
                                            <div className="col-span-4">
                                                <h3 className="font-semibold text-foreground text-sm">{booking.tour_title}</h3>
                                                <p className="text-xs text-muted-foreground mt-0.5">{booking.time || ''}</p>
                                            </div>
                                            <div className="col-span-2">
                                                <p className="text-sm text-foreground">{booking.customer_name}</p>
                                                <p className="text-xs text-muted-foreground">{booking.customer_email}</p>
                                            </div>
                                            <div className="col-span-2">
                                                <p className="text-sm text-foreground">{booking.date}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {booking.created_at ? new Date(booking.created_at).toLocaleDateString('en', { month: 'short', day: 'numeric' }) : ''}
                                                </p>
                                            </div>
                                            <div className="col-span-1">
                                                <span className="text-sm text-foreground">{booking.guests}</span>
                                            </div>
                                            <div className="col-span-1">
                                                <span className="font-bold text-foreground">€{booking.total_price}</span>
                                            </div>
                                            <div className="col-span-1">
                                                <span className={`text-xs font-bold  px-2 py-1 rounded-full ${statusColors[booking.status] || 'bg-gray-100 text-muted-foreground'}`}>
                                                    {booking.status}
                                                </span>
                                            </div>
                                            <div className="col-span-1 flex justify-end">
                                                {isExpanded ? <ChevronUp size={16} className="text-muted-foreground" /> : <ChevronDown size={16} className="text-muted-foreground" />}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expanded Details */}
                                    {isExpanded && (
                                        <div className="px-6 pb-6 bg-muted/50 border-t border-border">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                                                {/* Contact Info */}
                                                <div className="space-y-3">
                                                    <h4 className="font-bold text-foreground  text-xs flex items-center gap-1">
                                                        <User size={12} /> Contact Info
                                                    </h4>
                                                    <div className="space-y-2 text-sm text-muted-foreground">
                                                        <div className="flex items-center gap-2">
                                                            <User size={14} className="text-muted-foreground" />
                                                            <span>{booking.customer_name || 'N/A'}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Mail size={14} className="text-muted-foreground" />
                                                            <span>{booking.customer_email || 'N/A'}</span>
                                                        </div>
                                                        {booking.customer_phone && (
                                                            <div className="flex items-center gap-2">
                                                                <Phone size={14} className="text-muted-foreground" />
                                                                <span>{booking.customer_phone}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Ticket Breakdown */}
                                                <div className="space-y-3">
                                                    <h4 className="font-bold text-foreground  text-xs flex items-center gap-1">
                                                        <Users size={12} /> Ticket Breakdown
                                                    </h4>
                                                    <div className="space-y-1.5 text-sm text-muted-foreground">
                                                        <div className="flex justify-between">
                                                            <span>Adults</span>
                                                            <span className="font-medium">{booking.adults || 0}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span>Students</span>
                                                            <span className="font-medium">{booking.students || 0}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span>Youths</span>
                                                            <span className="font-medium">{booking.youths || 0}</span>
                                                        </div>
                                                        <div className="flex justify-between border-t pt-1.5 font-bold text-foreground">
                                                            <span>Total</span>
                                                            <span>€{booking.total_price}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Guest Details */}
                                                <div className="space-y-3">
                                                    <h4 className="font-bold text-foreground  text-xs flex items-center gap-1">
                                                        <FileText size={12} /> Guest List
                                                    </h4>
                                                    {booking.guest_details && Array.isArray(booking.guest_details) && booking.guest_details.length > 0 ? (
                                                        <div className="space-y-1.5">
                                                            {booking.guest_details.map((guest: any, idx: number) => (
                                                                <div key={idx} className="bg-card p-2 rounded border border-border flex justify-between items-center text-sm">
                                                                    <span className="font-medium text-foreground">{guest.name}</span>
                                                                    {guest.passport && (
                                                                        <span className="text-muted-foreground font-mono text-xs flex items-center gap-1">
                                                                            <FileText size={12} /> {guest.passport}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <p className="text-muted-foreground  text-sm">No guest details provided</p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Logistics & Add-ons */}
                                            {(booking.logistics || booking.addons) && (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-4 border-t border-border">
                                                    {booking.logistics && (
                                                        <div className="space-y-2">
                                                            <h4 className="font-bold text-foreground  text-xs flex items-center gap-1">
                                                                <MapPin size={12} /> Logistics
                                                            </h4>
                                                            <div className="text-sm text-muted-foreground space-y-1">
                                                                {booking.logistics.hotelName && <p>Hotel: {booking.logistics.hotelName}</p>}
                                                                {booking.logistics.hotelAddress && <p>Address: {booking.logistics.hotelAddress}</p>}
                                                                {booking.logistics.dietaryRestrictions && <p>Dietary: {booking.logistics.dietaryRestrictions}</p>}
                                                                {booking.logistics.mobilityNeeds && <p>Mobility: {booking.logistics.mobilityNeeds}</p>}
                                                            </div>
                                                        </div>
                                                    )}
                                                    {booking.addons && Array.isArray(booking.addons) && booking.addons.length > 0 && (
                                                        <div className="space-y-2">
                                                            <h4 className="font-bold text-foreground  text-xs">Add-ons</h4>
                                                            <div className="space-y-1">
                                                                {booking.addons.map((addon: any, idx: number) => (
                                                                    <div key={idx} className="flex justify-between text-sm">
                                                                        <span className="text-muted-foreground">{addon.name}</span>
                                                                        <span className="font-medium">€{addon.price}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* Footer info */}
                                            <div className="mt-4 pt-3 border-t border-border flex flex-wrap gap-4 text-xs text-muted-foreground font-mono">
                                                <span>ID: {booking.id}</span>
                                                {booking.stripe_session_id && <span>Stripe: {booking.stripe_session_id}</span>}
                                                {booking.created_at && <span>Created: {new Date(booking.created_at).toLocaleString()}</span>}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-border flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
                        </p>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-1.5 text-sm rounded-lg border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                const page = i + 1;
                                return (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`w-8 h-8 text-sm rounded-lg ${currentPage === page
                                                ? 'bg-primary text-white'
                                                : 'border border-border hover:bg-muted'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                );
                            })}
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1.5 text-sm rounded-lg border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
