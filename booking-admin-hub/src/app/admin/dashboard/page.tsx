'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAdmin } from '@/context/AdminContext';
import Link from 'next/link';
import {
  Calendar, DollarSign, TrendingUp, Clock,
  ArrowUpRight, CheckCircle, XCircle, BarChart3,
  Loader2, RefreshCw, Users, Package
} from 'lucide-react';

interface Stats {
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
  site_id: string;
}

export default function DashboardPage() {
  const { selectedSiteId } = useAdmin();
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);
  const [weeklyData, setWeeklyData] = useState<{ day: string; revenue: number; count: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, [selectedSiteId]);

  async function loadDashboard() {
    setLoading(true);
    try {
      // Fetch bookings filtered by site
      let query = supabase.from('bookings').select('*').order('created_at', { ascending: false });
      if (selectedSiteId) query = query.eq('site_id', selectedSiteId);

      const { data: bookings, error } = await query;
      if (error) throw error;

      const all = bookings || [];
      const now = new Date();
      const today = now.toISOString().split('T')[0];
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      const paid      = all.filter(b => b.status === 'paid');
      const pending   = all.filter(b => b.status === 'pending' || b.status === 'pending_payment');
      const cancelled = all.filter(b => b.status === 'cancelled');
      const todayB    = all.filter(b => b.created_at?.startsWith(today));
      const totalRevenue = paid.reduce((s, b) => s + (b.total_price || 0), 0);
      const weekB     = all.filter(b => new Date(b.created_at) >= weekAgo);
      const weekRev   = weekB.filter(b => b.status === 'paid').reduce((s, b) => s + (b.total_price || 0), 0);

      setStats({
        totalBookings: all.length,
        totalRevenue,
        todayBookings: todayB.length,
        pendingBookings: pending.length,
        paidBookings: paid.length,
        cancelledBookings: cancelled.length,
        avgOrderValue: paid.length > 0 ? totalRevenue / paid.length : 0,
        thisWeekRevenue: weekRev,
      });

      setRecentBookings(all.slice(0, 6));

      // Weekly chart
      const days = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const ds = d.toISOString().split('T')[0];
        const dayB = all.filter(b => b.created_at?.startsWith(ds));
        const dayRev = dayB.filter(b => b.status === 'paid').reduce((s, b) => s + (b.total_price || 0), 0);
        days.push({ day: d.toLocaleDateString('en', { weekday: 'short' }), revenue: dayRev, count: dayB.length });
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
        <Loader2 className="animate-spin h-8 w-8 text-emerald-600" />
      </div>
    );
  }

  const maxRevenue = Math.max(...weeklyData.map(d => d.revenue), 1);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1 text-sm">
            {selectedSiteId ? `Showing data for: ${selectedSiteId}` : 'All sites'}
          </p>
        </div>
        <button
          onClick={loadDashboard}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          title="Refresh"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Bookings"   value={stats?.totalBookings || 0}                                                    icon={Calendar}    color="blue"    sub={`${stats?.todayBookings || 0} today`} />
        <StatCard label="Revenue"          value={`€${(stats?.totalRevenue || 0).toLocaleString('en', { minimumFractionDigits: 2 })}`} icon={DollarSign}  color="emerald" sub={`€${(stats?.thisWeekRevenue || 0).toFixed(0)} this week`} />
        <StatCard label="Avg. Order"       value={`€${(stats?.avgOrderValue || 0).toFixed(2)}`}                                 icon={TrendingUp}  color="purple"  sub={`${stats?.paidBookings || 0} paid orders`} />
        <StatCard label="Pending"          value={stats?.pendingBookings || 0}                                                  icon={Clock}       color="amber"   sub={`${stats?.cancelledBookings || 0} cancelled`} />
      </div>

      {/* Chart + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-bold text-gray-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-emerald-600" />
                Revenue — Last 7 Days
              </h2>
              <p className="text-sm text-gray-500 mt-1">€{(stats?.thisWeekRevenue || 0).toFixed(2)} total</p>
            </div>
          </div>
          <div className="flex items-end gap-3 h-40">
            {weeklyData.map((day, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] font-medium text-gray-500">
                  {day.revenue > 0 ? `€${day.revenue.toFixed(0)}` : ''}
                </span>
                <div
                  className="w-full bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-lg transition-all duration-500 min-h-[4px]"
                  style={{ height: `${Math.max((day.revenue / maxRevenue) * 120, 4)}px` }}
                />
                <div className="text-center">
                  <span className="text-[10px] font-medium text-gray-500">{day.day}</span>
                  {day.count > 0 && <p className="text-[9px] text-gray-400">{day.count}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <QuickAction href="/admin/bookings"  icon={Calendar} label="All Bookings"       color="blue" />
            <QuickAction href="/admin/products"  icon={Package}  label="Manage Tours"       color="emerald" />
            <QuickAction href="/admin/inventory" icon={Calendar} label="Inventory Calendar" color="amber" />
            <QuickAction href="/admin/settings"  icon={Users}    label="Settings"           color="gray" />
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-gray-900">Recent Bookings</h2>
          <Link href="/admin/bookings" className="text-sm text-emerald-600 font-medium hover:underline flex items-center gap-1">
            View All <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
        {recentBookings.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No bookings yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {recentBookings.map(b => (
              <div key={b.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center ${b.status === 'paid' ? 'bg-emerald-100' : b.status === 'cancelled' ? 'bg-red-100' : 'bg-amber-100'}`}>
                    {b.status === 'paid'
                      ? <CheckCircle className="w-4 h-4 text-emerald-600" />
                      : b.status === 'cancelled'
                      ? <XCircle className="w-4 h-4 text-red-600" />
                      : <Clock className="w-4 h-4 text-amber-600" />}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{b.tour_title}</p>
                    <p className="text-xs text-gray-500">{b.customer_name} · {b.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900 text-sm">€{b.total_price}</p>
                  <p className="text-xs text-gray-400">{b.guests} guests</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-emerald-50 p-5 rounded-xl flex items-center gap-4">
          <CheckCircle className="w-8 h-8 text-emerald-600" />
          <div><p className="text-2xl font-bold text-emerald-700">{stats?.paidBookings || 0}</p><p className="text-sm font-medium text-emerald-600">Paid</p></div>
        </div>
        <div className="bg-amber-50 p-5 rounded-xl flex items-center gap-4">
          <Clock className="w-8 h-8 text-amber-600" />
          <div><p className="text-2xl font-bold text-amber-700">{stats?.pendingBookings || 0}</p><p className="text-sm font-medium text-amber-600">Pending</p></div>
        </div>
        <div className="bg-red-50 p-5 rounded-xl flex items-center gap-4">
          <XCircle className="w-8 h-8 text-red-600" />
          <div><p className="text-2xl font-bold text-red-700">{stats?.cancelledBookings || 0}</p><p className="text-sm font-medium text-red-600">Cancelled</p></div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color, sub }: { label: string; value: string | number; icon: any; color: string; sub?: string }) {
  const colors: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600', emerald: 'bg-emerald-50 text-emerald-600',
    purple: 'bg-purple-50 text-purple-600', amber: 'bg-amber-50 text-amber-600',
  };
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</p>
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${colors[color]}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

function QuickAction({ href, icon: Icon, label, color }: { href: string; icon: any; label: string; color: string }) {
  const colors: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600', emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600', gray: 'bg-gray-50 text-gray-600',
  };
  return (
    <Link href={href} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-all group">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colors[color]}`}>
        <Icon className="w-4 h-4" />
      </div>
      <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{label}</span>
      <ArrowUpRight className="w-4 h-4 text-gray-300 ml-auto group-hover:text-gray-500" />
    </Link>
  );
}
