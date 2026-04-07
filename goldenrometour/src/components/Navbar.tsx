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

    const activeSlug = searchOptions.find((o: { title: string, slug: string }) => o.title === destination)?.slug || '';

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
        <>
        <nav
            className={clsx(
                'fixed top-0 left-0 right-0 z-[10001] transition-all duration-300 border-b border-transparent',
                (isScrolled || isMobileMenuOpen)
                    ? 'bg-cream shadow-sm border-forest/10 py-2'
                    : 'bg-transparent py-3 md:py-4'
            )}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Top Row / Main Bar: Logo & Links & Search (Side by Side) */}
                <div className="relative z-[10000] flex items-center gap-3 lg:gap-4">
                    {/* Logo Image - From Sanity or Local fallback */}
                    <Link href="/" className="z-50 shrink-0">
                        {site?.logo ? (
                            <Image
                                src={urlFor(site.logo).url()}
                                alt={site.title || process.env.NEXT_PUBLIC_SITE_NAME || "Your Agency"}
                                width={150}
                                height={48}
                                className="h-8 md:h-10 lg:h-12 w-auto object-contain drop-shadow-md"
                                priority
                            />
                        ) : (
                            <div className="flex flex-col items-start justify-center">
                                <span className={clsx(
                                    "font-serif text-2xl md:text-3xl font-bold tracking-tighter leading-none",
                                    (isScrolled || isMobileMenuOpen) ? "text-forest" : "text-cream"
                                )}>
                                    GOLDEN <span className="italic">ROME TOUR</span>
                                </span>
                                <span className="font-sans text-forest/40 text-[8px] uppercase font-black tracking-[0.4em] -mt-0.5 pl-1">
                                    Editorial Series
                                </span>
                            </div>
                        )}
                    </Link>

                    {/* Desktop Menu - Centered */}
                    <div className="hidden lg:flex items-center gap-3 xl:gap-4 flex-1 justify-center">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={clsx(
                                        "text-[10px] xl:text-xs font-serif font-bold italic tracking-wide transition-colors whitespace-nowrap relative pb-1",
                                        "after:absolute after:bottom-0 after:left-0 after:h-[1px] after:transition-all after:duration-500",
                                        isActive
                                            ? "text-forest after:w-full after:bg-forest"
                                            : "after:w-0 hover:after:w-full after:bg-forest",
                                        (isScrolled || isMobileMenuOpen)
                                            ? isActive ? "text-forest" : "text-black hover:text-forest"
                                            : isActive ? "text-forest" : "text-cream hover:text-cream/80"
                                    )}
                                >
                                    {link.name}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Integrated Compact Search Bar (Right Side) - Desktop */}
                    <div className="hidden lg:flex items-center bg-cream border border-forest/20 pl-4 pr-1 py-1 shrink-0 gap-3">
                        {/* Destination */}
                        <div className="flex items-center border-r border-forest/10 pr-4">
                            <Search size={14} className="text-forest mr-3 shrink-0" />
                            <select
                                value={destination}
                                onChange={(e) => setDestination(e.target.value)}
                                className="bg-transparent text-xs xl:text-sm font-bold text-gray-800 outline-none w-28 xl:w-32 cursor-pointer appearance-none truncate"
                            >
                                <option value="" disabled>{t('nav.search_placeholder') || "Search Tours"}</option>
                                {searchOptions.map(opt => (
                                    <option key={opt.slug} value={opt.title}>{opt.title}</option>
                                ))}
                            </select>
                        </div>

                        {/* Date Picker - Popover with SmartCalendar */}
                        <div className="flex items-center border-r border-forest/10 pr-4 relative group cursor-pointer" ref={calendarRef}>
                            <div className="flex items-center" onClick={() => setIsCalendarOpen(!isCalendarOpen)}>
                                <Calendar size={14} className="text-forest mr-3 shrink-0" />
                                <span className={clsx("text-xs xl:text-sm font-sans font-black uppercase tracking-widest w-24 truncate", date ? "text-forest" : "text-forest/30")}>
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
                                        className="absolute top-full left-1/2 -translate-x-1/2 mt-4 bg-white shadow-xl border border-forest/10 p-2 z-50 overflow-hidden w-auto"
                                    >
                                        <div className='p-2'>
                                            <SmartCalendar
                                                slug={activeSlug}
                                                selectedDate={date ? new Date(date) : undefined}
                                                onSelect={(d: Date | undefined) => {
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
                                className="flex items-center hover:bg-forest/5 px-3 py-1 transition-colors"
                                onClick={() => setIsGuestOpen(!isGuestOpen)}
                            >
                                <Users size={14} className="text-forest mr-3 shrink-0" />
                                <span className="text-xs xl:text-sm font-sans font-black text-forest w-14 text-center select-none uppercase tracking-widest">
                                    {guests} pxl
                                </span>
                            </div>

                            {/* Guest Stepper Popover */}
                            <AnimatePresence>
                                {isGuestOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute top-full right-0 mt-4 w-48 bg-white shadow-xl border border-forest/10 p-4 z-50 overflow-hidden"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-bold text-gray-600">Guests</span>
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => setGuests(Math.max(1, guests - 1))}
                                                    className="w-8 h-8 bg-gray-100 flex items-center justify-center hover:bg-forest hover:text-cream transition-colors"
                                                >
                                                    <Minus size={14} />
                                                </button>
                                                <span className="font-bold w-4 text-center">{guests}</span>
                                                <button
                                                    onClick={() => setGuests(Math.min(20, guests + 1))}
                                                    className="w-8 h-8 bg-gray-100 flex items-center justify-center hover:bg-forest hover:text-cream transition-colors"
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
                            className="bg-forest hover:bg-forest/90 text-cream p-2.5 transition-transform active:scale-95 shrink-0"
                        >
                            <Search size={16} />
                        </button>
                    </div>

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
                                "relative p-2 transition-colors",
                                (isScrolled || isMobileMenuOpen)
                                    ? "text-forest bg-forest/5"
                                    : "text-white bg-black/20 backdrop-blur-sm"
                            )}
                        >
                            <ShoppingBag className="w-5 h-5" />
                            {totalItems > 0 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-forest text-cream text-[10px] font-bold flex items-center justify-center">
                                    {totalItems}
                                </span>
                            )}
                        </Link>

                        <button
                            className={clsx(
                                "relative z-[10005] p-2 transition-colors",
                                (isScrolled || isMobileMenuOpen)
                                    ? "text-forest bg-forest/5"
                                    : "text-white bg-black/20 backdrop-blur-sm"
                            )}
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>
        </nav>

        {/* Mobile Menu Overlay — OUTSIDE nav, in root stacking context */}
        <AnimatePresence>
            {isMobileMenuOpen && (
                <motion.div
                    data-mobile-menu-open="true"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="fixed inset-0 bg-cream flex flex-col items-center justify-start pt-24 space-y-8 lg:hidden p-4 z-[10000] overflow-y-auto"
                >
                    {/* Mobile Search Widget */}
                    <div className="w-full max-w-sm bg-white border border-forest/10 p-4 space-y-4">
                        <p className="text-xs font-bold text-forest/40 uppercase">Search Tours</p>
                        <select
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                            className="w-full p-3 bg-gray-50 text-lg font-bold outline-none border border-forest/5 focus:border-forest transition-colors"
                        >
                            {searchOptions.map(opt => (
                                <option key={opt.slug} value={opt.title}>{opt.title}</option>
                            ))}
                        </select>
                        <div className="flex gap-2">
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full p-3 bg-gray-50 font-bold outline-none border border-forest/5 focus:border-forest transition-colors"
                            />
                            <div className="flex items-center bg-gray-50 border border-forest/5 px-2 w-32 justify-between">
                                <button onClick={() => setGuests(Math.max(1, guests - 1))} className="p-2"><Minus size={14} /></button>
                                <span className="font-bold">{guests}</span>
                                <button onClick={() => setGuests(guests + 1)} className="p-2"><Plus size={14} /></button>
                            </div>
                        </div>
                        <button onClick={handleSearch} className="w-full bg-forest text-cream font-bold py-3 hover:bg-forest/90 transition-colors">
                            Explore Selection
                        </button>
                    </div>

                    <div className="h-px w-full max-w-sm bg-gray-200" />

                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-2xl font-bold text-black hover:text-sky-600 transition-colors"
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

