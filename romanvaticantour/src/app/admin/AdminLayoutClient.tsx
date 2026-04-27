'use client';

import { useState, useEffect } from 'react';
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
    ExternalLink,
    Wallet,
    LucideIcon,
    Menu,
    X,
    Bell,
    Search
} from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import SiteSwitcher from '@/components/admin/SiteSwitcher';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface NavLinkProps {
    href: string;
    icon: LucideIcon;
    children: React.ReactNode;
    external?: boolean;
    onClick?: () => void;
}

function NavLink({ href, icon: Icon, children, external, onClick }: NavLinkProps) {
    const pathname = usePathname();
    const isActive = pathname === href || (href !== '/admin' && pathname?.startsWith(href));

    return (
        <Link
            href={href}
            onClick={onClick}
            className={cn(
                "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 group relative",
                isActive 
                    ? "bg-primary/10 text-primary shadow-[0_0_20px_rgba(166,124,82,0.1)]" 
                    : "text-zinc-400 hover:text-white hover:bg-card/5"
            )}
            target={external ? "_blank" : undefined}
        >
            {isActive && (
                <motion.div
                    layoutId="active-pill"
                    className="absolute left-0 w-1 h-6 bg-primary rounded-r-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
            )}
            <Icon size={18} className={cn(
                "transition-colors duration-200",
                isActive ? "text-primary" : "group-hover:text-white"
            )} />
            <span className="flex-1">{children}</span>
            {external && <ExternalLink size={14} className="opacity-40 group-hover:opacity-100 transition-opacity" />}
        </Link>
    );
}

function Sidebar({ onClose }: { onClose?: () => void }) {
    return (
        <div className="flex flex-col h-full bg-[#09090b] text-white">
            {/* Mobile Header */}
            <div className="lg:hidden flex items-center justify-between p-6 border-b border-white/5">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
                        <span className="text-white font-bold text-lg">R</span>
                    </div>
                    <span className="font-semibold text-lg tracking-tight">Roman Vatican</span>
                </div>
                {onClose && (
                    <button onClick={onClose} className="p-2 hover:bg-card/5 rounded-full transition-colors text-zinc-400 hover:text-white">
                        <X size={20} />
                    </button>
                )}
            </div>

            {/* Desktop Branding / Switcher */}
            <div className="hidden lg:block p-6">
                <SiteSwitcher />
            </div>

            <nav className="flex-1 px-4 py-2 space-y-8 overflow-y-auto scrollbar-none">
                <div className="lg:hidden mb-6">
                    <SiteSwitcher />
                </div>

                <div>
                    <div className="text-[10px] font-bold text-zinc-500  tracking-[0.2em] px-3 mb-4">Management</div>
                    <div className="space-y-1">
                        <NavLink href="/admin" icon={LayoutDashboard} onClick={onClose}>Overview</NavLink>
                        <NavLink href="/admin/bookings" icon={Calendar} onClick={onClose}>Reservations</NavLink>
                    </div>
                </div>

                <div>
                    <div className="text-[10px] font-bold text-zinc-500  tracking-[0.2em] px-3 mb-4">Inventory</div>
                    <div className="space-y-1">
                        <NavLink href="/admin/products" icon={Package} onClick={onClose}>Tours & Products</NavLink>
                        <NavLink href="/admin/addons" icon={Store} onClick={onClose}>Add-ons & Extras</NavLink>
                        <NavLink href="/admin/inventory" icon={Calendar} onClick={onClose}>Inventory Control</NavLink>
                        <NavLink href="/admin/blog" icon={PenTool} onClick={onClose}>Editorial</NavLink>
                    </div>
                </div>

                <div>
                    <div className="text-[10px] font-bold text-zinc-500  tracking-[0.2em] px-3 mb-4">Finance & CMS</div>
                    <div className="space-y-1">
                        <NavLink href="/admin/payments" icon={Wallet} onClick={onClose}>Revenue Hub</NavLink>
                        <NavLink href="/studio" icon={ExternalLink} external onClick={onClose}>Content Studio</NavLink>
                    </div>
                </div>

                <div>
                    <div className="text-[10px] font-bold text-zinc-500  tracking-[0.2em] px-3 mb-4">Configuration</div>
                    <div className="space-y-1">
                        <NavLink href="/admin/users" icon={Users} onClick={onClose}>Team Directory</NavLink>
                        <NavLink href="/admin/settings" icon={Settings} onClick={onClose}>Global Settings</NavLink>
                    </div>
                </div>
            </nav>

            <div className="p-4 border-t border-white/5 bg-card/[0.02]">
                <button className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-zinc-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all duration-200 group">
                    <LogOut size={18} className="group-hover:translate-x-0.5 transition-transform" />
                    Sign Out
                </button>
            </div>
        </div>
    );
}

function TopBar({ onMenuClick }: { onMenuClick: () => void }) {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 0);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={cn(
            "h-16 sticky top-0 z-40 px-4 lg:px-8 flex items-center justify-between transition-all duration-300",
            scrolled ? "bg-card/80 backdrop-blur-xl border-b border-zinc-200/50 shadow-sm" : "bg-transparent"
        )}>
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 hover:bg-zinc-100 rounded-full transition-colors"
                >
                    <Menu size={20} className="text-zinc-600" />
                </button>
                <div className="hidden lg:flex items-center gap-2 text-zinc-400 bg-zinc-100/50 px-3 py-1.5 rounded-full border border-zinc-200/50 cursor-pointer hover:bg-zinc-100 transition-colors">
                    <Search size={16} />
                    <span className="text-xs font-medium">Search anything...</span>
                    <span className="text-[10px] bg-card border border-zinc-200 px-1.5 rounded ml-2">⌘K</span>
                </div>
            </div>

            <div className="flex items-center gap-3 lg:gap-6">
                <button className="relative p-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-full transition-all">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-white"></span>
                </button>

                <div className="h-8 w-px bg-zinc-200 hidden sm:block"></div>

                <div className="flex items-center gap-3 pl-2 group cursor-pointer">
                    <div className="text-right hidden sm:block">
                        <p className="text-xs font-bold text-zinc-900 group-hover:text-primary transition-colors">Admin User</p>
                        <p className="text-[10px] text-zinc-500 font-medium">Super Admin</p>
                    </div>
                    <div className="relative">
                        <div className="w-9 h-9 rounded-full border-2 border-white shadow-md overflow-hidden group-hover:ring-2 ring-primary/20 transition-all">
                            <Image
                                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin"
                                alt="Admin"
                                width={36}
                                height={36}
                                unoptimized
                                className="object-cover"
                            />
                        </div>
                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#f8f9fa] flex font-sans">
            {/* Desktop Sidebar */}
            <aside className="w-72 bg-[#09090b] fixed inset-y-0 z-50 hidden lg:flex flex-col shadow-2xl">
                <Sidebar />
            </aside>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <div className="fixed inset-0 z-50 lg:hidden">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-background/60 backdrop-blur-sm"
                            onClick={() => setMobileMenuOpen(false)}
                        />
                        <motion.aside
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="absolute left-0 top-0 bottom-0 w-[280px] bg-[#09090b] shadow-2xl flex flex-col"
                        >
                            <Sidebar onClose={() => setMobileMenuOpen(false)} />
                        </motion.aside>
                    </div>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <div className="lg:ml-72 flex-1 flex flex-col min-w-0">
                <TopBar onMenuClick={() => setMobileMenuOpen(true)} />
                <main className="flex-1 p-4 lg:p-10 max-w-[1600px] mx-auto w-full">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                        {children}
                    </motion.div>
                </main>
            </div>
        </div>
    );
}
