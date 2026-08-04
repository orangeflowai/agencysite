'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Package,
    Calendar,
    Settings,
    LogOut,
    Users,
    PenTool,
    ChevronRight,
    Store,
    LucideIcon,
    Menu,
    X
} from 'lucide-react';
import Image from 'next/image';
import { useAdmin } from '@/context/AdminContext';

interface NavLinkProps {
    href: string;
    icon: LucideIcon;
    children: React.ReactNode;
    external?: boolean;
    exact?: boolean;
    onClick?: () => void;
}

function NavLink({ href, icon: Icon, children, external, exact, onClick }: NavLinkProps) {
    const pathname = usePathname();
    const isActive = exact ? pathname === href : pathname === href || pathname.startsWith(href + '/');

    return (
        <Link
            href={href}
            onClick={onClick}
            className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all group ${
                isActive
                    ? 'bg-secondary text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-emerald-700'
            }`}
            target={external ? "_blank" : undefined}
        >
            <Icon
                size={18}
                className={isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-primary transition-colors'}
            />
            <span className="flex-1">{children}</span>
            {external && <ChevronRight size={14} className="text-muted-foreground" />}
        </Link>
    );
}

function Sidebar({ onClose }: { onClose?: () => void }) {
    const { currentSite, isLoading } = useAdmin();

    return (
        <>
            {/* Mobile Header */}
            <div className="lg:hidden flex items-center justify-between p-4 border-b border-border bg-card">
                <span className="font-bold text-foreground">
                    {currentSite?.title || 'Admin'}
                </span>
                {onClose && (
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
                        <X size={24} />
                    </button>
                )}
            </div>

            {/* Brand Header */}
            <div className="p-6 border-b border-border flex items-center gap-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-sm">
                    {currentSite?.logo ? (
                        <Image 
                            src={currentSite.logo.asset?.url || ""} 
                            alt="Logo" 
                            width={32} 
                            height={32} 
                            className="w-full h-full object-cover rounded-lg" 
                        />
                    ) : (
                        <Store className="text-white w-5 h-5" />
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    {isLoading ? (
                        <div className="h-4 w-24 bg-gray-200 animate-pulse rounded" />
                    ) : (
                        <span className="block font-bold text-foreground tracking-tight truncate">
                            {currentSite?.title || 'Wonders of Rome'}
                        </span>
                    )}
                    <span className="block text-[8px] text-muted-foreground uppercase tracking-widest font-bold">
                        Admin Dashboard
                    </span>
                </div>
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                <div className="text-[8px] font-bold text-muted-foreground tracking-wider px-3 mb-2 mt-4">Main</div>
                <NavLink href="/admin/dashboard" icon={LayoutDashboard} exact onClick={onClose}>Dashboard</NavLink>
                <NavLink href="/admin/bookings" icon={Calendar} onClick={onClose}>Bookings</NavLink>

                <div className="text-[8px] font-bold text-muted-foreground tracking-wider px-3 mb-2 mt-6">Content</div>
                <NavLink href="/admin/products" icon={Package} onClick={onClose}>Tours & Products</NavLink>
                <NavLink href="/admin/addons" icon={Store} onClick={onClose}>Add-ons & Extras</NavLink>
                <NavLink href="/admin/inventory" icon={Calendar} onClick={onClose}>Inventory Calendar</NavLink>
                <NavLink href="/admin/blog" icon={PenTool} onClick={onClose}>Blog Posts</NavLink>

                <div className="text-[8px] font-bold text-muted-foreground tracking-wider px-3 mb-2 mt-6">System</div>
                <NavLink href="/admin/users" icon={Users} onClick={onClose}>Team Members</NavLink>
                <NavLink href="/admin/settings" icon={Settings} onClick={onClose}>Settings</NavLink>
            </nav>

            <div className="p-4 border-t border-border">
                <button className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <LogOut size={18} />
                    Sign Out
                </button>
            </div>
        </>
    );
}

function TopBar({ onMenuClick }: { onMenuClick: () => void }) {
    const { currentSite } = useAdmin();

    return (
        <header className="h-16 bg-card border-b border-border sticky top-0 z-40 px-4 lg:px-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <Menu size={24} className="text-muted-foreground" />
                </button>
                <span className="lg:hidden font-bold text-foreground">
                    {currentSite?.title || 'Admin'}
                </span>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 pl-4 border-l border-border">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-bold text-foreground">Admin User</p>
                        <p className="text-xs text-muted-foreground">Super Admin</p>
                    </div>
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">
                        <Image
                            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin"
                            alt="Admin"
                            width={40}
                            height={40}
                            unoptimized
                        />
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
            <aside className="w-64 bg-card border-r border-border fixed inset-y-0 z-50 hidden lg:flex flex-col">
                <Sidebar />
            </aside>

            {/* Mobile Sidebar Overlay */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div
                        className="absolute inset-0 bg-black/50"
                        onClick={() => setMobileMenuOpen(false)}
                    />
                    <aside className="absolute left-0 top-0 bottom-0 w-64 bg-card shadow-xl flex flex-col">
                        <Sidebar onClose={() => setMobileMenuOpen(false)} />
                    </aside>
                </div>
            )}

            {/* Main Content */}
            <div className="lg:ml-64 flex-1 flex flex-col min-w-0">
                <TopBar onMenuClick={() => setMobileMenuOpen(true)} />
                <main className="flex-1 p-4 lg:p-6 overflow-x-auto">
                    {children}
                </main>
            </div>
        </>
    );
}
