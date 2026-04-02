'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    LayoutDashboard, Package, Calendar, Settings, LogOut,
    Users, PenTool, ChevronRight, Store, ExternalLink,
    Wallet, LucideIcon, Menu, X, Globe, ChevronDown
} from 'lucide-react';
import Image from 'next/image';
import { useAdmin } from '@/context/AdminContext';

interface NavLinkProps {
    href: string;
    icon: LucideIcon;
    children: React.ReactNode;
    external?: boolean;
    onClick?: () => void;
}

function NavLink({ href, icon: Icon, children, external, onClick }: NavLinkProps) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-300 rounded-lg hover:bg-white/5 hover:text-white transition-all group"
            target={external ? '_blank' : undefined}
        >
            <Icon size={17} className="text-slate-500 group-hover:text-emerald-400 transition-colors shrink-0" />
            <span className="flex-1">{children}</span>
            {external && <ChevronRight size={13} className="text-slate-600 group-hover:text-slate-400" />}
        </Link>
    );
}

function Sidebar({ onClose }: { onClose?: () => void }) {
    const { currentSite, adminProfile, canSwitchSites, sites, setSelectedSiteId, selectedSiteId, signOut } = useAdmin();
    const [siteMenuOpen, setSiteMenuOpen] = useState(false);
    const router = useRouter();

    const handleSignOut = async () => {
        await signOut();
        router.push('/admin/login');
    };

    return (
        <div className="flex flex-col h-full bg-[#0f1117] border-r border-white/5">
            {/* Logo / Agency Header */}
            <div className="px-5 pt-6 pb-4 border-b border-white/5">
                {/* Mobile close */}
                {onClose && (
                    <div className="flex items-center justify-between mb-4 lg:hidden">
                        <span className="font-bold text-white text-sm">Admin Panel</span>
                        <button onClick={onClose} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                            <X size={20} className="text-slate-400" />
                        </button>
                    </div>
                )}

                {/* Agency Brand */}
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                        {currentSite?.logo?.asset?.url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={currentSite.logo.asset.url} alt="Logo" className="w-full h-full object-cover rounded-lg" />
                        ) : (
                            <Globe size={18} className="text-emerald-400" />
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white truncate">{currentSite?.title || 'Loading...'}</p>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest">{adminProfile?.role || 'Admin'}</p>
                    </div>
                    {/* Site switcher for super_admin */}
                    {canSwitchSites && (
                        <button onClick={() => setSiteMenuOpen(!siteMenuOpen)} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                            <ChevronDown size={14} className={`text-slate-400 transition-transform ${siteMenuOpen ? 'rotate-180' : ''}`} />
                        </button>
                    )}
                </div>

                {/* Site switcher dropdown */}
                {canSwitchSites && siteMenuOpen && (
                    <div className="mt-3 bg-white/5 rounded-xl p-2 space-y-1">
                        {sites.map(site => (
                            <button key={site._id} onClick={() => { setSelectedSiteId(site.slug.current); setSiteMenuOpen(false); }}
                                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${
                                    selectedSiteId === site.slug.current ? 'bg-emerald-500/15 text-emerald-400 font-medium' : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                }`}>
                                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${site.isActive ? 'bg-emerald-400' : 'bg-red-400'}`} />
                                <span className="truncate">{site.title}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Nav Links */}
            <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
                <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest px-3 py-2">Overview</div>
                <NavLink href="/admin" icon={LayoutDashboard} onClick={onClose}>Dashboard</NavLink>
                <NavLink href="/admin/bookings" icon={Calendar} onClick={onClose}>Bookings</NavLink>

                <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest px-3 pt-5 pb-2">Inventory</div>
                <NavLink href="/admin/products" icon={Package} onClick={onClose}>Tours & Products</NavLink>
                <NavLink href="/admin/addons" icon={Store} onClick={onClose}>Add-ons & Extras</NavLink>
                <NavLink href="/admin/inventory" icon={Calendar} onClick={onClose}>Availability Calendar</NavLink>

                <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest px-3 pt-5 pb-2">Content</div>
                <NavLink href="/admin/blog" icon={PenTool} onClick={onClose}>Blog Posts</NavLink>
                <NavLink href="/studio" icon={ExternalLink} external onClick={onClose}>Sanity CMS Studio</NavLink>

                <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest px-3 pt-5 pb-2">Finance</div>
                <NavLink href="/admin/payments" icon={Wallet} onClick={onClose}>Payment Methods</NavLink>

                <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest px-3 pt-5 pb-2">System</div>
                <NavLink href="/admin/users" icon={Users} onClick={onClose}>Team Members</NavLink>
                <NavLink href="/admin/settings" icon={Settings} onClick={onClose}>Settings</NavLink>
            </nav>

            {/* User footer */}
            <div className="p-4 border-t border-white/5">
                <div className="flex items-center gap-3 px-3 py-2.5 mb-2">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/15 flex items-center justify-center overflow-hidden shrink-0">
                        <Image src={`https://api.dicebear.com/7.x/initials/svg?seed=${adminProfile?.display_name || adminProfile?.email || 'Admin'}&backgroundColor=065f46`}
                            alt="Avatar" width={32} height={32} unoptimized />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{adminProfile?.display_name || 'Admin User'}</p>
                        <p className="text-xs text-slate-500 truncate">{adminProfile?.email}</p>
                    </div>
                </div>
                <button onClick={handleSignOut}
                    className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                    <LogOut size={16} />
                    Sign Out
                </button>
            </div>
        </div>
    );
}

function TopBar({ onMenuClick }: { onMenuClick: () => void }) {
    const { currentSite, adminProfile } = useAdmin();

    return (
        <header className="h-14 bg-white border-b border-gray-100 sticky top-0 z-40 px-4 lg:px-6 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
                <button onClick={onMenuClick} className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Menu size={20} className="text-gray-600" />
                </button>
                <div className="hidden lg:flex items-center gap-2 text-sm text-gray-400">
                    <span className="font-medium text-gray-900">{currentSite?.title}</span>
                    <span>/</span>
                    <span>Admin Panel</span>
                </div>
            </div>

            <div className="flex items-center gap-3">
                {/* Live site link */}
                {currentSite?.domain && (
                    <a href={`https://${currentSite.domain}`} target="_blank" rel="noopener noreferrer"
                        className="hidden md:flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        View Live Site
                        <ExternalLink size={11} />
                    </a>
                )}

                <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-bold text-gray-900">{adminProfile?.display_name || 'Admin'}</p>
                        <p className="text-xs text-gray-400 capitalize">{adminProfile?.role?.replace('_', ' ')}</p>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-gray-100 border-2 border-white shadow-sm overflow-hidden">
                        <Image src={`https://api.dicebear.com/7.x/initials/svg?seed=${adminProfile?.display_name || adminProfile?.email || 'Admin'}&backgroundColor=065f46`}
                            alt="Avatar" width={36} height={36} unoptimized />
                    </div>
                </div>
            </div>
        </header>
    );
}

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="w-64 fixed inset-y-0 z-50 hidden lg:flex flex-col">
                <Sidebar />
            </aside>

            {/* Mobile Sidebar Overlay */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
                    <aside className="absolute left-0 top-0 bottom-0 w-72 shadow-2xl flex flex-col">
                        <Sidebar onClose={() => setMobileMenuOpen(false)} />
                    </aside>
                </div>
            )}

            {/* Main Content */}
            <div className="lg:ml-64 flex-1 flex flex-col min-w-0 bg-gray-50/50 min-h-screen">
                <TopBar onMenuClick={() => setMobileMenuOpen(true)} />
                <main className="flex-1 p-4 lg:p-6 overflow-x-auto">
                    {children}
                </main>
            </div>
        </>
    );
}
