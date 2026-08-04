'use client';

import { useState, useEffect, useMemo } from 'react';
import {
    Loader2, Mail, Calendar, User, ChevronDown, ChevronUp,
    FileText, Search, Download, Phone, Clock,
    MapPin, CheckCircle, XCircle, AlertCircle, Users,
    ArrowUpDown, RefreshCw, CreditCard, ExternalLink, Ban
} from 'lucide-react';

const ITEMS_PER_PAGE = 25;

export default function BookingsPage() {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedMap, setExpandedMap] = useState<Record<string, boolean>>({});
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [sortField, setSortField] = useState<string>('created_at');
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
    const [currentPage, setCurrentPage] = useState(1);
    const [stats, setStats] = useState({ total: 0, confirmed: 0, pending: 0, cancelled: 0, revenue: 0 });

    const siteId = useMemo(() => {
        if (typeof window !== 'undefined') {
            return process.env.NEXT_PUBLIC_SITE_ID || 'romanvaticantour';
        }
        return 'romanvaticantour';
    }, []);

    const fetchBookings = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`/api/admin/bookings?siteId=${encodeURIComponent(siteId)}`);
            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.detail || `HTTP ${res.status}`);
            }
            const data = await res.json();
            setBookings(data.bookings || []);
            setStats(data.stats || { total: 0, confirmed: 0, pending: 0, cancelled: 0, revenue: 0 });
        } catch (err: any) {
            console.error("Error fetching bookings:", err);
            setError(err.message || 'Failed to fetch bookings');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const toggleExpand = (id: string) => {
        setExpandedMap(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const [cancellingId, setCancellingId] = useState<string | null>(null);

    const handleCancel = async (bookingId: string) => {
        const booking = bookings.find(b => b.id === bookingId);
        const hasStripe = !!booking?.stripe_payment_intent_id;
        const confirmMsg = hasStripe
            ? 'Cancel and refund this booking via Stripe? Inventory slots will be released.'
            : 'Cancel this booking? No Stripe payment found — refund must be done manually.';
        if (!confirm(confirmMsg)) return;
        setCancellingId(bookingId);
        try {
            const res = await fetch('/api/admin/bookings', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: bookingId }),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.error || 'Cancel failed');
            // Update local state
            setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'cancelled' } : b));
            if (json.refund) {
                alert(`Booking cancelled. €${json.refund.amount} refunded via Stripe (${json.refund.id}).`);
            } else if (json.refundError) {
                alert(`Booking cancelled but refund failed: ${json.refundError}. Process manually in Stripe dashboard.`);
            } else {
                alert('Booking cancelled. No refund processed (payment may not have been captured).');
            }
        } catch (err: any) {
            alert('Failed to cancel: ' + err.message);
        } finally {
            setCancellingId(null);
        }
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
                (b.lead_first_name || '').toLowerCase().includes(term) ||
                (b.lead_email || '').toLowerCase().includes(term) ||
                (b.tour_title || '').toLowerCase().includes(term) ||
                (b.stripe_payment_intent_id || '').toLowerCase().includes(term)
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

    // Stats (now from API)
    const displayStats = stats;

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
        const headers = ['Tour', 'First Name', 'Last Name', 'Email', 'Date', 'Guests', 'Total', 'Status', 'Created'];
        const rows = filtered.map(b => [
            b.tour_title, b.lead_first_name, b.lead_last_name, b.lead_email,
            b.date, b.guests, b.total_amount, b.status,
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
        confirmed: 'bg-emerald-100 text-foreground',
        pending: 'bg-amber-100 text-amber-700',
        cancelled: 'bg-red-100 text-red-700',
    };

    const statusIcons: Record<string, any> = {
        confirmed: CheckCircle,
        pending: Clock,
        cancelled: XCircle,
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin h-8 w-8 text-primary" />
                <span className="ml-3 text-muted-foreground">Loading bookings...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <AlertCircle className="h-10 w-10 text-red-500 mb-4" />
                <p className="text-red-600 font-medium mb-2">Failed to load bookings</p>
                <p className="text-xs text-muted-foreground mb-4">{error}</p>
                <button
                    onClick={fetchBookings}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90"
                >
                    <RefreshCw size={14} />
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Bookings</h1>
                    <p className="text-muted-foreground mt-1">{displayStats.total} total bookings · €{(displayStats.revenue || 0).toLocaleString('en', { minimumFractionDigits: 2 })} revenue</p>
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
                    { key: 'all', label: 'All', count: displayStats.total },
                    { key: 'confirmed', label: 'Confirmed', count: displayStats.confirmed },
                    { key: 'pending', label: 'Pending', count: displayStats.pending },
                    { key: 'cancelled', label: 'Cancelled', count: displayStats.cancelled },
                ].map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => { setStatusFilter(tab.key); setCurrentPage(1); }}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${statusFilter === tab.key
                                ? 'bg-primary text-primary-foreground shadow-sm'
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
                    className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none"
                />
            </div>

            {/* Results */}
            <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
                {/* Table Header */}
                <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-muted border-b border-border text-xs font-bold text-muted-foreground  tracking-wider">
                    <div className="col-span-4 flex items-center gap-1 cursor-pointer hover:text-foreground" onClick={() => toggleSort('tour_title')}>
                        Tour <ArrowUpDown className="w-3 h-3" />
                    </div>
                    <div className="col-span-2 flex items-center gap-1 cursor-pointer hover:text-foreground" onClick={() => toggleSort('lead_first_name')}>
                        Customer <ArrowUpDown className="w-3 h-3" />
                    </div>
                    <div className="col-span-2 flex items-center gap-1 cursor-pointer hover:text-foreground" onClick={() => toggleSort('date')}>
                        Date <ArrowUpDown className="w-3 h-3" />
                    </div>
                    <div className="col-span-1">Guests</div>
                    <div className="col-span-1 flex items-center gap-1 cursor-pointer hover:text-foreground" onClick={() => toggleSort('total_amount')}>
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
                                                <span>{booking.lead_first_name}</span>
                                                <span className="font-bold text-foreground">€{booking.total_amount}</span>
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
                                                <p className="text-sm text-foreground">{booking.lead_first_name}</p>
                                                <p className="text-xs text-muted-foreground">{booking.lead_email}</p>
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
                                                <span className="font-bold text-foreground">€{booking.total_amount}</span>
                                            </div>
                                            <div className="col-span-1">
                                                <span className={`text-xs font-bold px-2 py-1 rounded-full ${statusColors[booking.status] || 'bg-gray-100 text-muted-foreground'}`}>
                                                    {booking.status}
                                                </span>
                                            </div>
                                            <div className="col-span-1 flex items-center justify-end gap-1">
                                                {booking.status !== 'cancelled' && (
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleCancel(booking.id); }}
                                                        disabled={cancellingId === booking.id}
                                                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                                        title="Cancel booking"
                                                    >
                                                        {cancellingId === booking.id ? <Loader2 size={14} className="animate-spin" /> : <Ban size={14} />}
                                                    </button>
                                                )}
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
                                                            <span>{booking.lead_first_name || 'N/A'}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Mail size={14} className="text-muted-foreground" />
                                                            <span>{booking.lead_email || 'N/A'}</span>
                                                        </div>
                                                        {booking.lead_phone && (
                                                            <div className="flex items-center gap-2">
                                                                <Phone size={14} className="text-muted-foreground" />
                                                                <span>{booking.lead_phone}</span>
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
                                                        {booking.guest_counts && typeof booking.guest_counts === 'object' ? (
                                                            Object.entries(booking.guest_counts as Record<string, number>).map(([key, val]) => (
                                                                <div key={key} className="flex justify-between">
                                                                    <span className="capitalize">{key}</span>
                                                                    <span className="font-medium">{val}</span>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div className="flex justify-between">
                                                                <span>Guests</span>
                                                                <span className="font-medium">{booking.guests || 0}</span>
                                                            </div>
                                                        )}
                                                        <div className="flex justify-between border-t pt-1.5 font-bold text-foreground">
                                                            <span>Total</span>
                                                            <span>€{booking.total_amount}</span>
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

                                            {/* Logistics & Notes */}
                                            {(booking.pickup_location || booking.notes) && (
                                                <div className="grid grid-cols-1 gap-6 mt-6 pt-4 border-t border-border">
                                                    {booking.pickup_location && (
                                                        <div className="space-y-2">
                                                            <h4 className="font-bold text-foreground  text-xs flex items-center gap-1">
                                                                <MapPin size={12} /> Pickup Location
                                                            </h4>
                                                            <p className="text-sm text-muted-foreground">{booking.pickup_location}</p>
                                                        </div>
                                                    )}
                                                    {booking.notes && (
                                                        <div className="space-y-2">
                                                            <h4 className="font-bold text-foreground  text-xs flex items-center gap-1">
                                                                <FileText size={12} /> Notes
                                                            </h4>
                                                            <p className="text-sm text-muted-foreground">{booking.notes}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* Footer info */}
                                            <div className="mt-4 pt-3 border-t border-border flex flex-wrap items-center gap-4 text-xs text-muted-foreground font-mono">
                                                <span>ID: {booking.id}</span>
                                                {booking.stripe_payment_intent_id && <span>Stripe PI: {booking.stripe_payment_intent_id}</span>}
                                                {booking.created_at && <span>Created: {new Date(booking.created_at).toLocaleString()}</span>}
                                                <div className="flex-1" />
                                                {booking.status !== 'cancelled' && (
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleCancel(booking.id); }}
                                                        disabled={cancellingId === booking.id}
                                                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors disabled:opacity-50"
                                                    >
                                                        {cancellingId === booking.id ? (
                                                            <Loader2 size={12} className="animate-spin" />
                                                        ) : (
                                                            <Ban size={12} />
                                                        )}
                                                        Cancel Booking
                                                    </button>
                                                )}
                                            </div>

                                            {/* Stripe Payment Details */}
                                            {booking.stripe_payment_intent_id && (
                                                <div className="mt-4 pt-3 border-t border-border">
                                                    <h4 className="font-bold text-foreground text-xs flex items-center gap-1 mb-3">
                                                        <CreditCard size={12} /> Stripe Payment
                                                    </h4>
                                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                                                        <div>
                                                            <p className="text-xs text-muted-foreground mb-0.5">Payment Status</p>
                                                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                                                                booking.stripe_payment_status === 'succeeded' ? 'bg-emerald-100 text-emerald-700' :
                                                                booking.stripe_payment_status === 'requires_payment_method' ? 'bg-red-100 text-red-700' :
                                                                booking.stripe_payment_status === 'stripe_lookup_failed' ? 'bg-amber-100 text-amber-700' :
                                                                'bg-gray-100 text-gray-700'
                                                            }`}>
                                                                {booking.stripe_payment_status || 'N/A'}
                                                            </span>
                                                        </div>
                                                        {booking.stripe_card_brand && (
                                                            <div>
                                                                <p className="text-xs text-muted-foreground mb-0.5">Card</p>
                                                                <p className="font-medium text-foreground capitalize">
                                                                    {booking.stripe_card_brand} •••• {booking.stripe_card_last4}
                                                                </p>
                                                            </div>
                                                        )}
                                                        {booking.stripe_customer_name && (
                                                            <div>
                                                                <p className="text-xs text-muted-foreground mb-0.5">Stripe Customer</p>
                                                                <p className="font-medium text-foreground">{booking.stripe_customer_name}</p>
                                                            </div>
                                                        )}
                                                        {booking.stripe_amount_received != null && (
                                                            <div>
                                                                <p className="text-xs text-muted-foreground mb-0.5">Amount Received</p>
                                                                <p className="font-medium text-foreground">€{booking.stripe_amount_received}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                    {booking.stripe_receipt_url && (
                                                        <a
                                                            href={booking.stripe_receipt_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1 mt-3 text-xs text-primary hover:underline"
                                                        >
                                                            <ExternalLink size={12} />
                                                            View Stripe Receipt
                                                        </a>
                                                    )}
                                                    {booking.stripe_failure_message && (
                                                        <p className="mt-2 text-xs text-red-600">Stripe error: {booking.stripe_failure_message}</p>
                                                    )}
                                                </div>
                                            )}
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
                                                ? 'bg-primary text-primary-foreground'
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
