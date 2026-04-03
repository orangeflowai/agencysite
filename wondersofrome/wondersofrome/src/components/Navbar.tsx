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

    // Category options for search — static, no Supabase call needed
    const searchOptions = [
        { title: 'Vatican Museums & Sistine Chapel', slug: 'category/vatican' },
        { title: 'Colosseum & Ancient Rome',         slug: 'category/colosseum' },
        { title: 'Rome City Tours',                  slug: 'category/city' },
        { title: 'Italy Hidden Gems',                slug: 'category/hidden-gems' },
    ];

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
        const selected = searchOptions.find(o => o.title === destination);
        if (selected) {
            router.push(`/${selected.slug}`);
        } else {
            router.push(`/search?q=${encodeURIComponent(destination)}&guests=${guests}${date ? `&date=${date}` : ''}`);
        }
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
                    ? 'bg-white/95 backdrop-blur-md shadow-md border-[#d4af37]/20 py-2'
                    : 'bg-transparent py-3 md:py-4'
            )}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Top Row / Main Bar: Logo & Links & Search (Side by Side) */}
                <div className="relative z-[10000] flex items-center justify-between lg:justify-start gap-3 lg:gap-4 w-full">
                    {/* Logo Image - From Sanity or Local fallback */}
                    <Link href="/" className="z-50 shrink-0">
                        {site?.logo ? (
                            <Image
                                src={urlFor(site.logo).url()}
                                alt={site.title || 'Wonders of Rome'}
                                width={150}
                                height={48}
                                className="h-8 md:h-10 lg:h-12 w-auto object-contain drop-shadow-md"
                                priority
                            />
                        ) : (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src="/logo.png"
                                alt="Wonders of Rome"
                                width={150}
                                height={48}
                                className="h-8 md:h-10 lg:h-12 w-auto object-contain drop-shadow-md"
                            />
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
                                        "text-[10px] xl:text-xs font-bold uppercase tracking-wide transition-colors whitespace-nowrap relative pb-0.5",
                                        "after:absolute after:bottom-0 after:left-0 after:h-[2px] after:rounded-full after:transition-all after:duration-300",
                                        isActive
                                            ? "text-[#d4af37] after:w-full after:bg-[#d4af37]"
                                            : "after:w-0 hover:after:w-full after:bg-[#d4af37]",
                                        (isScrolled || isMobileMenuOpen)
                                            ? isActive ? "text-[#b45309]" : "text-slate-900 hover:text-[#d4af37]"
                                            : isActive ? "text-[#d4af37]" : "text-white drop-shadow-sm hover:text-[#d4af37]"
                                    )}
                                >
                                    {link.name}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Integrated Compact Search Bar (Right Side) - Desktop */}
                    <div className="hidden lg:flex items-center bg-white rounded-full pl-3 pr-1.5 py-1.5 shadow-lg border border-gray-100 shrink-0 gap-2">
                        {/* Destination */}
                        <div className="flex items-center border-r border-gray-200 pr-3">
                            <Search size={14} className="text-[#d4af37] mr-2 shrink-0" />
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
                        <div className="flex items-center border-r border-gray-200 pr-3 relative group cursor-pointer" ref={calendarRef}>
                            <div className="flex items-center" onClick={() => setIsCalendarOpen(!isCalendarOpen)}>
                                <Calendar size={14} className="text-[#d4af37] mr-2 shrink-0" />
                                <span className={clsx("text-xs xl:text-sm font-bold w-20 xl:w-24 uppercase truncate", date ? "text-gray-800" : "text-gray-400")}>
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
                                <Users size={14} className="text-[#d4af37] mr-2 shrink-0" />
                                <span className="text-xs xl:text-sm font-bold text-gray-800 w-14 text-center select-none">
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
                                                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-[#fef3c7] hover:text-[#b45309] transition-colors"
                                                >
                                                    <Minus size={14} />
                                                </button>
                                                <span className="font-bold w-4 text-center">{guests}</span>
                                                <button
                                                    onClick={() => setGuests(Math.min(20, guests + 1))}
                                                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-[#fef3c7] hover:text-[#b45309] transition-colors"
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
                            className="bg-[#0f172a] hover:bg-[#d4af37] text-white rounded-full p-2.5 transition-transform active:scale-95 shrink-0 shadow-md"
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
                                "relative p-2 rounded-full transition-colors",
                                (isScrolled || isMobileMenuOpen)
                                    ? "text-[#0f172a] bg-gray-100/50"
                                    : "text-white bg-black/20 backdrop-blur-sm"
                            )}
                        >
                            <ShoppingBag className="w-5 h-5" />
                            {totalItems > 0 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#d4af37] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                                    {totalItems}
                                </span>
                            )}
                        </Link>

                        <button
                            className={clsx(
                                "relative z-[10000] p-2 rounded-full transition-colors",
                                (isScrolled || isMobileMenuOpen)
                                    ? "text-[#0f172a] bg-gray-100/50"
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
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="fixed inset-0 bg-[#fefce8] flex flex-col items-center justify-start pt-28 space-y-8 lg:hidden p-4 z-[10000] overflow-y-auto"
                >
                    {/* Mobile Search Widget */}
                    <div className="w-full max-w-sm bg-white rounded-2xl p-4 shadow-xl space-y-4">
                        <p className="text-xs font-bold text-gray-400 uppercase">Search Tours</p>
                        <select
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                            className="w-full p-3 bg-gray-50 rounded-lg text-lg font-bold outline-none border border-gray-100 focus:border-[#d4af37] transition-colors"
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
                                className="w-full p-3 bg-gray-50 rounded-lg font-bold outline-none border border-gray-100 focus:border-[#d4af37] transition-colors"
                            />
                            <div className="flex items-center bg-gray-50 rounded-lg border border-gray-100 px-2 w-32 justify-between">
                                <button onClick={() => setGuests(Math.max(1, guests - 1))} className="p-2"><Minus size={14} /></button>
                                <span className="font-bold">{guests}</span>
                                <button onClick={() => setGuests(guests + 1)} className="p-2"><Plus size={14} /></button>
                            </div>
                        </div>
                        <button onClick={handleSearch} className="w-full bg-[#0f172a] hover:bg-[#d4af37] text-[#d4af37] hover:text-[#0f172a] font-bold py-3 rounded-xl shadow-lg transition-colors border border-[#d4af37]/50">
                            Search
                        </button>
                    </div>

                    <div className="h-px w-full max-w-sm bg-gray-200" />

                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-2xl font-bold text-slate-800 hover:text-[#d4af37] transition-colors"
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
