'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Menu, X, Search, Calendar, Users, Minus, Plus, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import SmartCalendar from './ui/SmartCalendar';
import { format } from 'date-fns';
import Image from 'next/image';
import { SUPABASE_BUCKET_URL } from '@/lib/constants';
import { useSite } from '@/components/SiteProvider';
import { urlFor } from '@/lib/sanityService';

import { useLanguage } from '@/context/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import { useCart } from '@/context/CartContext';
import CartDropdown from './CartDropdown';

export default function Navbar() {
    const { t } = useLanguage();
    const site = useSite();
    const { totalItems } = useCart();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const router = useRouter();

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

    // Fix Hydration Mismatch: Only calculate activeSlug after mount
    const [activeSlug, setActiveSlug] = useState('');

    useEffect(() => {
        // When options load or destination changes, update active slug
        const found = searchOptions.find(o => o.title === destination)?.slug || searchOptions[0]?.slug || '';
        console.log("Navbar: activeSlug calculated:", found, "Destination:", destination, "Options:", searchOptions);
        setActiveSlug(found);
    }, [destination, searchOptions]);


    // Load Tours for Search
    useEffect(() => {
        async function loadOptions() {
            try {
                // Determine if we should use supabase client here or fetch via an API
                // Supabase client is fine for public filtered access
                const { supabase } = await import('@/lib/supabase');
                const { data, error } = await supabase.from('tours').select('title, slug').limit(20);
                if (error) {
                    console.error("Navbar: Supabase fetch error:", error);
                } else {
                    console.log("Navbar: Loaded search options:", data);
                    if (data && data.length > 0) setSearchOptions(data);
                }
            } catch (e) {
                console.error("Navbar: Failed to load search options", e);
            }
        }
        loadOptions();
    }, []);

    // const activeSlug derived in useEffect above to prevent hydration mismatch

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
        // If we have a specific slug, maybe redirect to that tour?
        // But for generic search page, keep as is
        router.push(`/search?q=${query}${dateParam}${guestParam}`);
        setIsMobileMenuOpen(false);
    };

    const navLinks = [
        { name: t('nav.colosseum'), href: '/category/colosseum' },
        { name: t('nav.vatican'), href: '/category/vatican' },
        { name: t('nav.city'), href: '/category/city' },
        { name: t('nav.hidden'), href: '/category/hidden-gems' },
        { name: t('nav.about') || 'About Us', href: '/about' },
    ];

    return (
        <nav
            className={clsx(
                'fixed top-0 left-0 right-0 z-[100] transition-all duration-300 border-b border-transparent',
                (isScrolled || isMobileMenuOpen)
                    ? 'bg-cream md:bg-cream/95 backdrop-blur-md shadow-md border-emerald/10 py-2'
                    : 'bg-transparent py-3 md:py-4'
            )}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Top Row / Main Bar: Logo & Links & Search (Side by Side) */}
                <div className="flex items-center justify-between gap-2 md:gap-4 lg:gap-6">
                    {/* Logo Image - Dynamic from Sanity */}
                    <Link href="/" className="z-50 shrink-0 flex-none">
                        {site?.logo ? (
                            <Image
                                src={urlFor(site.logo).url()}
                                alt={site.title || 'Logo'}
                                width={150}
                                height={48}
                                className="h-8 md:h-10 lg:h-12 w-auto object-contain"
                                priority
                            />
                        ) : site?.logoText ? (
                            <span className="text-xl md:text-2xl font-bold text-white drop-shadow-md">
                                {site.logoText}
                                {site.logoTextAccent && (
                                    <span className="text-emerald-400">{site.logoTextAccent}</span>
                                )}
                            </span>
                        ) : (
                            <Image
                                src={`${SUPABASE_BUCKET_URL}/logo.png`}
                                alt="ticketsinrome"
                                width={150}
                                height={48}
                                className="h-8 md:h-10 lg:h-12 w-auto object-contain drop-shadow-md"
                                priority
                            />
                        )}
                    </Link>

                    {/* Desktop Menu - Centered-ish */}
                    <div className="hidden lg:flex items-center space-x-2 lg:space-x-4 xl:space-x-6 flex-1 min-w-0">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={clsx(
                                    "text-xs lg:text-sm font-bold uppercase tracking-wide transition-colors hover:text-emerald-500 whitespace-nowrap",
                                    isScrolled ? "text-black" : "text-white drop-shadow-sm"
                                )}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Integrated Compact Search Bar (Right Side) - Desktop */}
                    <div className="hidden lg:flex items-center bg-white rounded-full pl-3 lg:pl-4 pr-1.5 py-1.5 shadow-lg border border-gray-100 flex-none gap-1 lg:gap-2">
                        {/* Destination */}
                        <div className="flex items-center border-r border-gray-200 pr-3">
                            <Search size={14} className="text-emerald-600 mr-2 shrink-0" />
                            <select
                                value={destination}
                                onChange={(e) => setDestination(e.target.value)}
                                className="bg-transparent text-xs xl:text-sm font-bold text-gray-800 outline-none w-24 xl:w-32 cursor-pointer appearance-none truncate"
                            >
                                <option value="" disabled>{t('nav.search_placeholder') || "Search Tours"}</option>
                                {searchOptions.map(opt => (
                                    <option key={opt.slug} value={opt.title}>{opt.title}</option>
                                ))}
                            </select>
                        </div>

                        {/* Date Picker - Popover with SmartCalendar */}
                        <div className="flex items-center border-r border-gray-200 pr-3 relative group cursor-pointer" ref={calendarRef}>
                            <div className="flex items-center" onClick={() => setIsCalendarOpen(!isCalendarOpen)}>
                                <Calendar size={14} className="text-emerald-600 mr-2 shrink-0" />
                                <span className={clsx("text-xs xl:text-sm font-bold w-16 xl:w-24 uppercase truncate", date ? "text-gray-800" : "text-gray-400")}>
                                    {date ? format(new Date(date), 'MMM dd') : 'Add Date'}
                                </span>
                            </div>

                            {/* Calendar Popover */}
                            <AnimatePresence>
                                {isCalendarOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute top-full left-1/2 -translate-x-1/2 mt-4 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-50 overflow-hidden w-auto"
                                    >
                                        <div className='p-2'>
                                            <SmartCalendar
                                                slug={activeSlug}
                                                selectedDate={date ? new Date(date) : undefined}
                                                onSelect={(d) => {
                                                    setDate(d ? format(d, 'yyyy-MM-dd') : '');
                                                    setIsCalendarOpen(false);
                                                }}
                                                basePrice={0}
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Helper: Guest Popover */}
                        <div className="relative flex items-center pr-1 cursor-pointer" ref={guestRef}>
                            <div
                                className="flex items-center hover:bg-gray-50 rounded-full px-2 py-1 transition-colors"
                                onClick={() => setIsGuestOpen(!isGuestOpen)}
                            >
                                <Users size={14} className="text-emerald-600 mr-2 shrink-0" />
                                <span className="text-xs xl:text-sm font-bold text-gray-800 w-10 xl:w-14 text-center select-none">
                                    {guests}
                                </span>
                            </div>

                            {/* Guest Stepper Popover */}
                            <AnimatePresence>
                                {isGuestOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute top-full right-0 mt-4 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 z-50 overflow-hidden"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-bold text-gray-600">Guests</span>
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => setGuests(Math.max(1, guests - 1))}
                                                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-emerald-100 hover:text-emerald-600 transition-colors"
                                                >
                                                    <Minus size={14} />
                                                </button>
                                                <span className="font-bold w-4 text-center">{guests}</span>
                                                <button
                                                    onClick={() => setGuests(Math.min(20, guests + 1))}
                                                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-emerald-100 hover:text-emerald-600 transition-colors"
                                                >
                                                    <Plus size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <button
                            onClick={handleSearch}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full p-2.5 transition-transform active:scale-95 shrink-0 shadow-md"
                        >
                            <Search size={16} />
                        </button>
                    </div>

                    {/* Right Side Actions: Cart + Language */}
                    <div className="flex items-center gap-2 md:gap-3 flex-none">
                        {/* Cart Button */}
                        <div className="hidden lg:block">
                            <CartDropdown />
                        </div>

                        {/* Language Selector */}
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
                                    ? "text-emerald-900 bg-gray-100/50"
                                    : "text-white bg-black/20 backdrop-blur-sm"
                            )}
                        >
                            <ShoppingBag className="w-5 h-5" />
                            {totalItems > 0 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                    {totalItems}
                                </span>
                            )}
                        </Link>

                        <button
                            className={clsx(
                                "relative z-[250] p-2 rounded-full transition-colors",
                                (isScrolled || isMobileMenuOpen)
                                    ? "text-emerald-900 bg-gray-100/50"
                                    : "text-white bg-black/20 backdrop-blur-sm"
                            )}
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            data-mobile-menu-open="true"
                            initial={{ opacity: 0, x: '100%' }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-0 bg-white z-[9999] flex flex-col pt-24 px-6 overflow-y-auto"
                        >
                            {/* Mobile Links */}
                            <nav className="flex flex-col space-y-6 mb-12">
                                {navLinks.map((link, idx) => (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        className="text-3xl font-black text-gray-900 hover:text-emerald-600 transition-colors uppercase tracking-tight block border-b border-gray-50 pb-2"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                            </nav>

                            {/* Mobile Search Widget - Redesigned */}
                            <div className="bg-gray-50 rounded-3xl p-6 space-y-5 border border-gray-100 shadow-sm mb-8">
                                <h4 className="flex items-center gap-2 text-sm font-bold text-gray-400 uppercase tracking-widest">
                                    <Search size={14} /> Plan your trip
                                </h4>

                                <div className="space-y-3">
                                    <div className="relative">
                                        <select
                                            value={destination}
                                            onChange={(e) => setDestination(e.target.value)}
                                            className="w-full h-14 pl-4 pr-10 bg-white rounded-xl text-lg font-bold text-gray-900 outline-none border border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all appearance-none"
                                        >
                                            <option value="" disabled>Where to?</option>
                                            {searchOptions.map(opt => (
                                                <option key={opt.slug} value={opt.title}>{opt.title}</option>
                                            ))}
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                            <Search size={20} />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <input
                                            type="date"
                                            value={date}
                                            onChange={(e) => setDate(e.target.value)}
                                            className="h-14 px-4 bg-white rounded-xl font-bold text-gray-900 outline-none border border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                                        />
                                        <div className="h-14 px-4 bg-white rounded-xl border border-gray-200 flex items-center justify-between">
                                            <button onClick={() => setGuests(Math.max(1, guests - 1))} className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full text-gray-600 active:scale-90"><Minus size={14} /></button>
                                            <span className="font-bold text-gray-900">{guests}</span>
                                            <button onClick={() => setGuests(guests + 1)} className="w-8 h-8 flex items-center justify-center bg-emerald-100 rounded-full text-emerald-700 active:scale-90"><Plus size={14} /></button>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={handleSearch}
                                    className="w-full h-14 bg-emerald-600 text-white font-black text-lg uppercase tracking-widest rounded-xl shadow-lg shadow-emerald-200 hover:shadow-xl hover:bg-emerald-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                                >
                                    Search Availability
                                </button>
                            </div>

                            {/* Mobile Language Selector */}
                            <div className="border-t border-gray-100 pt-6 pb-20">
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Language</p>
                                <LanguageSwitcher />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </nav>
    );
}
