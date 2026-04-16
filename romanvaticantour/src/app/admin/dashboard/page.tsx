'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import {
    Calendar, DollarSign, Users, TrendingUp, Clock,
    ArrowUpRight, ArrowDownRight, Package, Store, Settings,
    Loader2, AlertTriangle, CheckCircle, XCircle, BarChart3
} from 'lucide-react';

interface DashboardStats {
    totalBookings: number;
    totalRevenue: number;
    todayBookings: number;
    pendingBookings: number;
    paidBookings: number;
    cancelledBookings: number;
    avgOrderValue: number;
    thisWeekRevenue: number;
}

interface RecentBooking {
    id: string;
    tour_title: string;
    customer_name: string;
    customer_email: string;
    date: string;
    total_price: number;
    status: string;
    guests: number;
    created_at: string;
}

export default function DashboardPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);
    const [weeklyData, setWeeklyData] = useState<{ day: string; revenue: number; count: number }[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboard();
    }, []);

    async function loadDashboard() {
        try {
            // Fetch all bookings
            const siteId = process.env.NEXT_PUBLIC_SITE_ID || '';
            const baseQuery = supabase
                .from('bookings')
                .select('*')
                .order('created_at', { ascending: false });
            const { data: bookings, error } = siteId
                ? await baseQuery.eq('site_id', siteId)
                : await baseQuery;

            if (error) throw error;

            const all = bookings || [];
            const now = new Date();
            const today = now.toISOString().split('T')[0];
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

            // Calculate stats
            const paid = all.filter(b => b.status === 'paid');
            const pending = all.filter(b => b.status === 'pending');
            const cancelled = all.filter(b => b.status === 'cancelled');
            const todayBookings = all.filter(b => b.created_at?.startsWith(today));
            const totalRevenue = paid.reduce((sum, b) => sum + (b.total_price || 0), 0);
            const weekBookings = all.filter(b => new Date(b.created_at) >= weekAgo);
            const thisWeekRevenue = weekBookings.filter(b => b.status === 'paid').reduce((sum, b) => sum + (b.total_price || 0), 0);

            setStats({
                totalBookings: all.length,
                totalRevenue,
                todayBookings: todayBookings.length,
                pendingBookings: pending.length,
                paidBookings: paid.length,
                cancelledBookings: cancelled.length,
                avgOrderValue: paid.length > 0 ? totalRevenue / paid.length : 0,
                thisWeekRevenue,
            });

            // Recent 5 bookings
            setRecentBookings(all.slice(0, 5));

            // Weekly chart data
            const days: { day: string; revenue: number; count: number }[] = [];
            for (let i = 6; i >= 0; i--) {
                const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
                const dateStr = d.toISOString().split('T')[0];
                const dayBookings = all.filter(b => b.created_at?.startsWith(dateStr));
                const dayRevenue = dayBookings.filter(b => b.status === 'paid').reduce((sum, b) => sum + (b.total_price || 0), 0);
                days.push({
                    day: d.toLocaleDateString('en', { weekday: 'short' }),
                    revenue: dayRevenue,
                    count: dayBookings.length,
                });
            }
            setWeeklyData(days);

        } catch (err) {
            console.error('Dashboard error:', err);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin h-8 w-8 text-primary" />
            </div>
        );
    }

    const maxRevenue = Math.max(...weeklyData.map(d => d.revenue), 1);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-500 mt-1">Overview of your tour business performance</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <StatCard
                    label="Total Bookings"
                    value={stats?.totalBookings || 0}
                    icon={Calendar}
                    color="blue"
                    subtitle={`${stats?.todayBookings || 0} today`}
                />
                <StatCard
                    label="Revenue"
                    value={`€${(stats?.totalRevenue || 0).toLocaleString('en', { minimumFractionDigits: 2 })}`}
                    icon={DollarSign}
                    color="emerald"
                    subtitle={`€${(stats?.thisWeekRevenue || 0).toFixed(0)} this week`}
                />
                <StatCard
                    label="Avg. Order Value"
                    value={`€${(stats?.avgOrderValue || 0).toFixed(2)}`}
                    icon={TrendingUp}
                    color="purple"
                    subtitle={`${stats?.paidBookings || 0} paid orders`}
                />
                <StatCard
                    label="Pending"
                    value={stats?.pendingBookings || 0}
                    icon={Clock}
                    color="amber"
                    subtitle={`${stats?.cancelledBookings || 0} cancelled`}
                />
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Chart */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="font-bold text-gray-900 flex items-center gap-2">
                                <BarChart3 className="w-5 h-5 text-primary" />
                                Revenue (Last 7 Days)
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">€{(stats?.thisWeekRevenue || 0).toFixed(2)} total</p>
                        </div>
                    </div>

                    <div className="flex items-end gap-3 h-48">
                        {weeklyData.map((day, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                <span className="text-xs font-medium text-gray-600">
                                    {day.revenue > 0 ? `€${day.revenue.toFixed(0)}` : ''}
                                </span>
                                <div className="w-full relative">
                                    <div
                                        className="w-full bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-lg transition-all duration-500 min-h-[4px]"
                                        style={{ height: `${Math.max((day.revenue / maxRevenue) * 140, 4)}px` }}
                                    />
                                </div>
                                <div className="text-center">
                                    <span className="text-xs font-medium text-gray-500">{day.day}</span>
                                    {day.count > 0 && (
                                        <p className="text-[10px] text-gray-400">{day.count} orders</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="font-bold text-gray-900 mb-4">Quick Actions</h2>
                    <div className="space-y-2">
                        <QuickAction href="/admin/bookings" icon={Calendar} label="View All Bookings" color="blue" />
                        <QuickAction href="/admin/addons" icon={Store} label="Manage Add-ons" color="emerald" />
                        <QuickAction href="/admin/products" icon={Package} label="Manage Tours" color="purple" />
                        <QuickAction href="/admin/inventory" icon={Calendar} label="Inventory Calendar" color="amber" />
                        <QuickAction href="/admin/settings" icon={Settings} label="Settings" color="gray" />
                    </div>
                </div>
            </div>

            {/* Recent Bookings */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="font-bold text-gray-900">Recent Bookings</h2>
                    <Link href="/admin/bookings" className="text-sm text-primary font-medium hover:underline flex items-center gap-1">
                        View All <ArrowUpRight className="w-4 h-4" />
                    </Link>
                </div>

                {recentBookings.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>No bookings yet. They'll appear here once customers start booking.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {recentBookings.map(booking => (
                            <div key={booking.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${booking.status === 'paid' ? 'bg-emerald-100' :
                                            booking.status === 'cancelled' ? 'bg-red-100' : 'bg-amber-100'
                                        }`}>
                                        {booking.status === 'paid' ? <CheckCircle className="w-5 h-5 text-primary" /> :
                                            booking.status === 'cancelled' ? <XCircle className="w-5 h-5 text-red-600" /> :
                                                <Clock className="w-5 h-5 text-amber-600" />}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{booking.tour_title}</p>
                                        <p className="text-sm text-gray-500">{booking.customer_name} · {booking.date}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-gray-900">€{booking.total_price}</p>
                                    <p className="text-xs text-gray-400">{booking.guests} guests</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Status Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatusCard label="Paid" count={stats?.paidBookings || 0} icon={CheckCircle} color="emerald" />
                <StatusCard label="Pending" count={stats?.pendingBookings || 0} icon={Clock} color="amber" />
                <StatusCard label="Cancelled" count={stats?.cancelledBookings || 0} icon={XCircle} color="red" />
            </div>
        </div>
    );
}

function StatCard({ label, value, icon: Icon, color, subtitle }: { label: string; value: string | number; icon: any; color: string; subtitle?: string }) {
    const colors: Record<string, string> = {
        blue: 'bg-blue-50 text-blue-600',
        emerald: 'bg-background text-primary',
        purple: 'bg-purple-50 text-purple-600',
        amber: 'bg-amber-50 text-amber-600',
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-gray-500">{label}</p>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors[color]}`}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        </div>
    );
}

function QuickAction({ href, icon: Icon, label, color }: { href: string; icon: any; label: string; color: string }) {
    const colors: Record<string, string> = {
        blue: 'bg-blue-50 text-blue-600 group-hover:bg-blue-100',
        emerald: 'bg-background text-primary group-hover:bg-emerald-100',
        purple: 'bg-purple-50 text-purple-600 group-hover:bg-purple-100',
        amber: 'bg-amber-50 text-amber-600 group-hover:bg-amber-100',
        gray: 'bg-gray-50 text-gray-600 group-hover:bg-gray-100',
    };

    return (
        <Link href={href} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-all group">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${colors[color]}`}>
                <Icon className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{label}</span>
            <ArrowUpRight className="w-4 h-4 text-gray-300 ml-auto group-hover:text-gray-500" />
        </Link>
    );
}

function StatusCard({ label, count, icon: Icon, color }: { label: string; count: number; icon: any; color: string }) {
    const colors: Record<string, { bg: string; text: string; icon: string }> = {
        emerald: { bg: 'bg-background', text: 'text-foreground', icon: 'text-primary' },
        amber: { bg: 'bg-amber-50', text: 'text-amber-700', icon: 'text-amber-600' },
        red: { bg: 'bg-red-50', text: 'text-red-700', icon: 'text-red-600' },
    };
    const c = colors[color];

    return (
        <div className={`${c.bg} p-5 rounded-xl flex items-center gap-4`}>
            <Icon className={`w-8 h-8 ${c.icon}`} />
            <div>
                <p className={`text-2xl font-bold ${c.text}`}>{count}</p>
                <p className={`text-sm font-medium ${c.text} opacity-75`}>{label}</p>
            </div>
        </div>
    );
}
