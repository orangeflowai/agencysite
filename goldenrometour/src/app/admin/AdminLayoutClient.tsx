'use client';

import { useState } from 'react';
import Link from 'next/link';
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
    ExternalLink,
    Wallet,
    LucideIcon,
    Menu,
    X
} from 'lucide-react';
import Image from 'next/image';
import SiteSwitcher from '@/components/admin/SiteSwitcher';

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
            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 hover:text-foreground transition-all group"
            target={external ? "_blank" : undefined}
        >
            <Icon size={18} className="text-gray-400 group-hover:text-primary transition-colors" />
            <span className="flex-1">{children}</span>
            {external && <ChevronRight size={14} className="text-gray-300" />}
        </Link>
    );
}

function Sidebar({ onClose }: { onClose?: () => void }) {
    return (
        <>
            {/* Mobile Header */}
            <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200 bg-white">
                <span className="font-bold text-gray-900">TravelAgent Admin</span>
                {onClose && (
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
                        <X size={24} />
                    </button>
                )}
            </div>

            {/* Replaced Static Header with Switcher */}
            <div className="hidden lg:block">
                <SiteSwitcher />
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                <div className="lg:hidden mb-4">
                    <SiteSwitcher />
                </div>

                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-3 mb-2 mt-4">Main</div>
                <NavLink href="/admin" icon={LayoutDashboard} onClick={onClose}>Dashboard</NavLink>
                <NavLink href="/admin/bookings" icon={Calendar} onClick={onClose}>Bookings</NavLink>

                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-3 mb-2 mt-6">Content</div>
                <NavLink href="/admin/products" icon={Package} onClick={onClose}>Tours & Products</NavLink>
                <NavLink href="/admin/addons" icon={Store} onClick={onClose}>Add-ons & Extras</NavLink>
                <NavLink href="/admin/inventory" icon={Calendar} onClick={onClose}>Inventory Calendar</NavLink>
                <NavLink href="/admin/blog" icon={PenTool} onClick={onClose}>Blog Posts</NavLink>

                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-3 mb-2 mt-6">Payments</div>
                <NavLink href="/admin/payments" icon={Wallet} onClick={onClose}>Payment Methods</NavLink>
                {/* External Link to Studio */}
                <a href="/studio" target="_blank" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 hover:text-foreground transition-all group">
                    <ExternalLink size={18} className="text-gray-400 group-hover:text-primary transition-colors" />
                    <span className="flex-1">Content Studio (CMS)</span>
                    <ChevronRight size={14} className="text-gray-300" />
                </a>

                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-3 mb-2 mt-6">System</div>
                <NavLink href="/admin/users" icon={Users} onClick={onClose}>Team Members</NavLink>
                <NavLink href="/admin/settings" icon={Settings} onClick={onClose}>Settings</NavLink>
            </nav>

            <div className="p-4 border-t border-gray-100">
                <button className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <LogOut size={18} />
                    Sign Out
                </button>
            </div>
        </>
    );
}

function TopBar({ onMenuClick }: { onMenuClick: () => void }) {
    return (
        <header className="h-16 bg-white border-b border-gray-200 sticky top-0 z-40 px-4 lg:px-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <Menu size={24} className="text-gray-600" />
                </button>
                <span className="lg:hidden font-bold text-gray-900">TravelAgent Admin</span>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-bold text-gray-900">Admin User</p>
                        <p className="text-xs text-gray-500">Super Admin</p>
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
            <aside className="w-64 bg-white border-r border-gray-200 fixed inset-y-0 z-50 hidden lg:flex flex-col">
                <Sidebar />
            </aside>

            {/* Mobile Sidebar Overlay */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div
                        className="absolute inset-0 bg-black/50"
                        onClick={() => setMobileMenuOpen(false)}
                    />
                    <aside className="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-xl flex flex-col">
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
