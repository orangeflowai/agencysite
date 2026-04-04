'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Menu, X, Search, Calendar, Users, Minus, Plus, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { useRouter, usePathname } from 'next/navigation';
import SmartCalendar from './ui/SmartCalendar';
import { format } from 'date-fns';
import Image from 'next/image';
import Marquee from './Marquee';

import { useLanguage } from '@/context/LanguageContext';
import { useSite } from '@/components/SiteProvider';
import { useCart } from '@/context/CartContext';
import { urlFor } from '@/lib/sanityService';
import CartDropdown from './CartDropdown';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navbar() {
    const { language, setLanguage, t } = useLanguage();
    const site = useSite();
    const { totalItems } = useCart();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    // Search State
    const [destination, setDestination] = useState('');
    const [date, setDate] = useState('');
    const [guests, setGuests] = useState(2);
    const [isGuestOpen, setIsGuestOpen] = useState(false);
    const guestRef = useRef<HTMLDivElement>(null);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const calendarRef = useRef<HTMLDivElement>(null);

    // Dynamic Options from Supabase
    const [searchOptions, setSearchOptions] = useState<{ title: string, slug: string }[]>([]);

    // Load Tours for Search
    useEffect(() => {
        async function loadOptions() {
            try {
                // Determine if we should use supabase client here or fetch via an API
                // Supabase client is fine for public filtered access
                const { supabase } = await import('@/lib/supabase');
                const { data } = await supabase.from('tours').select('title, slug').limit(20);
                if (data && data.length > 0) setSearchOptions(data);
            } catch (e) {
                console.error("Failed to load search options", e);
            }
        }
        loadOptions();
    }, []);

    const activeSlug = searchOptions.find(o => o.title === destination)?.slug || '';

    // Close calendar on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
                setIsCalendarOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Close guest dropdown on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (guestRef.current && !guestRef.current.contains(event.target as Node)) {
                setIsGuestOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isMobileMenuOpen]);

    const handleSearch = () => {
        const query = encodeURIComponent(destination);
        const dateParam = date ? `&date=${date}` : '';
        const guestParam = `&guests=${guests}`;
        router.push(`/search?q=${query}${dateParam}${guestParam}`);
        setIsMobileMenuOpen(false);
    };

    const navLinks = [
        { name: t('nav.vatican'), href: '/category/vatican' },
        { name: 'Private Tours', href: '/private-tours' },
        { name: 'Pilgrimage', href: '/category/vatican' },
        { name: 'Blog', href: '/blog' },
        { name: t('nav.about') || 'About Us', href: '/about' },
    ];

    return (
        <>
        <header className="fixed top-0 left-0 right-0 z-[10002] flex flex-col w-full transition-all duration-300">
            <div className="w-full relative z-[10001]">
                <Marquee />
            </div>
            <nav
                className={clsx(
                    'w-full transition-all duration-300 border-b relative z-[10002]',
                (isScrolled || isMobileMenuOpen)
                    ? 'bg-[#F5F0E8] border-gray-200 shadow-md py-2'
                    : 'bg-gradient-to-b from-black/60 to-transparent border-transparent py-4'
            )}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Top Row / Main Bar: Logo & Links & Search (Side by Side) */}
                <div className="relative z-[10000] flex items-center justify-between w-full">
                    
                    {/* Left: Logo */}
                    <div className="flex flex-1 justify-start">
                    {/* Logo Image - From Sanity or Local fallback */}
                    <Link href="/" className="z-50 shrink-0">
                        {site?.logo ? (
                            <Image
                                src={urlFor(site.logo).url()}
                                alt={site.title || "RomeWander"}
                                width={150}
                                height={48}
                                className="h-8 md:h-10 lg:h-12 w-auto object-contain drop-shadow-md"
                                priority
                            />
                        ) : (
                            <div className="flex flex-col items-start justify-center">
                                <span className={clsx(
                                    "font-serif text-2xl md:text-3xl font-black tracking-tight leading-none",
                                    (isScrolled || isMobileMenuOpen) ? "text-theme-dark" : "text-theme-light"
                                )}>
                                    ROMEWANDER
                                </span>
                                <span className="font-accent text-theme-primary text-[10px] md:text-sm -mt-1 tracking-widest pl-1">
                                    Vatican Tours
                                </span>
                            </div>
                        )}
                    </Link>
                    </div>

                    {/* Center: Desktop Menu */}
                    <div className="hidden lg:flex items-center gap-4 xl:gap-6 flex-none justify-center">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={clsx(
                                        "text-[10px] xl:text-xs font-bold uppercase tracking-wide transition-colors whitespace-nowrap relative pb-0.5",
                                        "after:absolute after:bottom-0 after:left-0 after:h-[2px] after:rounded-full after:transition-all after:duration-300",
                                        isActive
                                            ? "text-theme-primary after:w-full after:bg-theme-primary"
                                            : "after:w-0 hover:after:w-full after:bg-theme-primary",
                                        (isScrolled || isMobileMenuOpen)
                                            ? isActive ? "text-theme-primary" : "text-black hover:text-theme-primary"
                                            : isActive ? "text-theme-primary" : "text-white drop-shadow-sm hover:text-theme-primary"
                                    )}
                                >
                                    {link.name}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Right: Search & Mobile Toggle */}
                    <div className="flex flex-1 justify-end items-center gap-2 sm:gap-4">

                    {/* Right Side Actions: Cart + Language */}
                    <div className="flex items-center gap-3 shrink-0">
                        {/* Cart Button */}
                        <div className="hidden lg:block">
                            <CartDropdown />
                        </div>

                        <div className="hidden lg:flex items-center">
                            <LanguageSwitcher />
                        </div>
                    </div>

                    {/* Mobile Toggle */}
                    <div className="flex items-center gap-2 lg:hidden">
                        {/* Mobile Cart */}
                        <Link
                            href="/checkout"
                            className={clsx(
                                "relative p-2 rounded-full transition-colors",
                                (isScrolled || isMobileMenuOpen)
                                    ? "text-theme-dark bg-gray-100/50"
                                    : "text-white bg-black/20 backdrop-blur-sm"
                            )}
                        >
                            <ShoppingBag className="w-5 h-5" />
                            {totalItems > 0 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-theme-primary text-white text-[10px] font-bold rounded-sm flex items-center justify-center">
                                    {totalItems}
                                </span>
                            )}
                        </Link>

                        <button
                            className={clsx(
                                "relative z-[250] p-2 rounded-full transition-colors",
                                (isScrolled || isMobileMenuOpen)
                                    ? "text-theme-dark bg-gray-100/50"
                                    : "text-white bg-black/20 backdrop-blur-sm"
                            )}
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div> {/* Close Right container */}
                
                </div> {/* Close Main flex row */}
            </div> {/* Close max-w container */}
        </nav>
        </header>

        {/* Mobile Menu Overlay — MUST be OUTSIDE nav to escape its stacking context */}
        <AnimatePresence>
            {isMobileMenuOpen && (
                <motion.div
                    data-mobile-menu-open="true"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="fixed inset-0 flex flex-col items-center justify-start pt-24 space-y-8 lg:hidden p-4 z-[10000] overflow-y-auto"
                    style={{ backgroundColor: '#F5F0E8' }}
                >
                    {/* Mobile Search Widget */}
                    <div className="w-full max-w-sm bg-white rounded-sm p-6 shadow-2xl space-y-6">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Search Tours</p>
                        <select
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                            className="w-full p-4 bg-gray-50 rounded-sm text-lg font-bold outline-none border border-gray-100 focus:border-theme-primary transition-colors"
                        >
                            {searchOptions.map(opt => (
                                <option key={opt.slug} value={opt.title}>{opt.title}</option>
                            ))}
                        </select>
                        <div className="flex flex-col gap-3">
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full p-4 bg-gray-50 rounded-sm font-bold outline-none border border-gray-100 focus:border-theme-primary transition-colors"
                            />
                            <div className="flex items-center bg-gray-50 rounded-sm border border-gray-100 px-3 py-1 justify-between h-14">
                                <span className="text-xs font-bold text-gray-400 uppercase">Guests</span>
                                <div className="flex items-center gap-4">
                                    <button onClick={() => setGuests(Math.max(1, guests - 1))} className="p-2"><Minus size={14} /></button>
                                    <span className="font-bold w-6 text-center">{guests}</span>
                                    <button onClick={() => setGuests(guests + 1)} className="p-2"><Plus size={14} /></button>
                                </div>
                            </div>
                        </div>
                        <button onClick={handleSearch} className="w-full bg-theme-primary text-white font-black uppercase tracking-widest py-4 rounded-sm shadow-xl hover:bg-theme-dark transition-colors">
                            Search
                        </button>
                    </div>

                    <div className="h-px w-full max-w-sm bg-gray-200" />

                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-2xl font-serif font-bold transition-colors"
                            style={{ color: '#1A1210' }}
                            onMouseEnter={e => (e.currentTarget.style.color = '#C9A84C')}
                            onMouseLeave={e => (e.currentTarget.style.color = '#1A1210')}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}

                    {/* Mobile Language Selector */}
                    <div className="border-t border-gray-100 pt-6 w-full max-w-sm">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 text-center">Language</p>
                        <div className="flex justify-center">
                            <LanguageSwitcher />
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
        </>
    );
}
