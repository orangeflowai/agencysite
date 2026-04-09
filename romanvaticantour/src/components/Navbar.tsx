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
    const { t } = useLanguage();
    const site = useSite();
    const { totalItems } = useCart();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    const [destination, setDestination] = useState('');
    const [date, setDate] = useState('');
    const [guests, setGuests] = useState(2);
    const [isGuestOpen, setIsGuestOpen] = useState(false);
    const guestRef = useRef<HTMLDivElement>(null);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const calendarRef = useRef<HTMLDivElement>(null);

    const [searchOptions, setSearchOptions] = useState<{ title: string; slug: string }[]>([]);

    useEffect(() => {
        async function loadOptions() {
            try {
                const { supabase } = await import('@/lib/supabase');
                const { data } = await supabase.from('tours').select('title, slug').limit(20);
                if (data && data.length > 0) setSearchOptions(data);
            } catch (e) {
                console.error('Failed to load search options', e);
            }
        }
        loadOptions();
    }, []);

    const activeSlug = searchOptions.find((o) => o.title === destination)?.slug || '';

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
                setIsCalendarOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (guestRef.current && !guestRef.current.contains(event.target as Node)) {
                setIsGuestOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isMobileMenuOpen]);

    const handleSearch = () => {
        const query = encodeURIComponent(destination);
        const dateParam = date ? `&date=${date}` : '';
        router.push(`/search?q=${query}${dateParam}&guests=${guests}`);
        setIsMobileMenuOpen(false);
    };

    const navLinks = [
        { name: t('nav.colosseum') || 'Colosseum', href: '/category/colosseum' },
        { name: t('nav.vatican') || 'Vatican', href: '/category/vatican' },
        { name: t('nav.city') || 'City Tours', href: '/category/city' },
        { name: t('nav.hidden') || 'Hidden Gems', href: '/category/hidden-gems' },
        { name: t('nav.about') || 'About Us', href: '/about' },
    ];

    const scrolled = isScrolled || isMobileMenuOpen;

    return (
        <>
            <nav
                className={clsx(
                    'fixed top-0 left-0 right-0 z-[10001] transition-all duration-500 border-b',
                    scrolled
                        ? 'bg-white/60 backdrop-blur-2xl shadow-[0_8px_32px_rgba(2,132,199,0.06)] border-white/50 py-2'
                        : 'bg-transparent border-transparent py-3 md:py-4'
                )}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="relative z-[10000] flex items-center justify-between lg:justify-start gap-3 lg:gap-4 w-full">

                        {/* Logo */}
                        <Link href="/" className="z-50 shrink-0 group">
                            {site?.logo ? (
                                <Image
                                    src={urlFor(site.logo).url()}
                                    alt={site.title || 'Roman Vatican Tour'}
                                    width={150}
                                    height={48}
                                    className="h-8 md:h-10 lg:h-12 w-auto object-contain drop-shadow-md transition-transform group-hover:scale-105 duration-300"
                                    priority
                                />
                            ) : (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src="/logo.png"
                                    alt={process.env.NEXT_PUBLIC_SITE_NAME || 'Roman Vatican Tour'}
                                    width={150}
                                    height={48}
                                    className="h-8 md:h-10 lg:h-12 w-auto object-contain drop-shadow-md transition-transform group-hover:scale-105 duration-300"
                                />
                            )}
                        </Link>

                        {/* Desktop Nav Links */}
                        <div className="hidden lg:flex items-center gap-3 xl:gap-4 flex-1 justify-center">
                            {navLinks.map((link) => {
                                const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={clsx(
                                            'text-[10px] xl:text-xs font-bold uppercase tracking-wide transition-all duration-300 whitespace-nowrap relative pb-0.5',
                                            'after:absolute after:bottom-0 after:left-0 after:h-[2px] after:rounded-full after:transition-all after:duration-300',
                                            isActive
                                                ? 'text-sky-500 after:w-full after:bg-sky-500'
                                                : 'after:w-0 hover:after:w-full after:bg-sky-500 hover:text-sky-400',
                                            scrolled
                                                ? isActive ? 'text-sky-600' : 'text-slate-800'
                                                : isActive ? 'text-sky-300' : 'text-white drop-shadow-sm'
                                        )}
                                    >
                                        {link.name}
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Desktop Glassmorphism Search Bar */}
                        <div
                            className={clsx(
                                'hidden lg:flex items-center rounded-full pl-4 pr-1.5 py-1.5 border shrink-0 gap-3 transition-all duration-300',
                                scrolled
                                    ? 'bg-white/70 backdrop-blur-xl border-white/60 shadow-lg shadow-sky-500/5'
                                    : 'bg-white/20 backdrop-blur-md border-white/30 shadow-lg'
                            )}
                        >
                            {/* Destination */}
                            <div className={clsx('flex items-center border-r pr-4', scrolled ? 'border-sky-900/10' : 'border-white/20')}>
                                <Search size={14} className={clsx('mr-2 shrink-0', scrolled ? 'text-sky-600' : 'text-white')} />
                                <select
                                    value={destination}
                                    onChange={(e) => setDestination(e.target.value)}
                                    className={clsx(
                                        'bg-transparent text-xs xl:text-sm font-bold outline-none w-28 xl:w-32 cursor-pointer appearance-none truncate',
                                        scrolled ? 'text-gray-800' : 'text-white/90'
                                    )}
                                >
                                    <option value="" disabled className="text-gray-500">{t('nav.search_placeholder') || 'Search Tours'}</option>
                                    {searchOptions.map((opt) => (
                                        <option key={opt.slug} value={opt.title} className="text-gray-800">{opt.title}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Date */}
                            <div
                                className={clsx('flex items-center border-r pr-4 relative cursor-pointer', scrolled ? 'border-sky-900/10' : 'border-white/20')}
                                ref={calendarRef}
                            >
                                <div className="flex items-center hover:opacity-80 transition-opacity" onClick={() => setIsCalendarOpen(!isCalendarOpen)}>
                                    <Calendar size={14} className={clsx('mr-2 shrink-0', scrolled ? 'text-sky-600' : 'text-white')} />
                                    <span className={clsx(
                                        'text-xs xl:text-sm font-bold uppercase w-20 xl:w-24 truncate',
                                        date
                                            ? (scrolled ? 'text-gray-800' : 'text-white')
                                            : (scrolled ? 'text-gray-400' : 'text-white/60')
                                    )}>
                                        {date ? format(new Date(date), 'MMM dd') : 'Add Date'}
                                    </span>
                                </div>
                                <AnimatePresence>
                                    {isCalendarOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 15, scale: 0.95 }}
                                            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                                            className="absolute top-full left-1/2 -translate-x-1/2 mt-6 bg-white/90 backdrop-blur-2xl rounded-3xl shadow-[0_20px_40px_rgba(2,132,199,0.12)] border border-white/50 p-2 z-50 w-auto ring-1 ring-sky-900/5"
                                        >
                                            <div className="p-2">
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

                            {/* Guests */}
                            <div className="relative flex items-center pr-1 cursor-pointer" ref={guestRef}>
                                <div
                                    className={clsx(
                                        'flex items-center rounded-full px-2 py-1 transition-all duration-300',
                                        scrolled ? 'hover:bg-sky-50' : 'hover:bg-white/10'
                                    )}
                                    onClick={() => setIsGuestOpen(!isGuestOpen)}
                                >
                                    <Users size={14} className={clsx('mr-2 shrink-0', scrolled ? 'text-sky-600' : 'text-white')} />
                                    <span className={clsx('text-xs xl:text-sm font-bold w-14 text-center select-none', scrolled ? 'text-gray-800' : 'text-white')}>
                                        {guests}
                                    </span>
                                </div>
                                <AnimatePresence>
                                    {isGuestOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 15, scale: 0.95 }}
                                            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                                            className="absolute top-full right-0 mt-6 w-48 bg-white/90 backdrop-blur-2xl rounded-3xl shadow-[0_20px_40px_rgba(2,132,199,0.12)] border border-white/50 p-5 z-50 ring-1 ring-sky-900/5"
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-bold text-gray-700">Guests</span>
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        onClick={() => setGuests(Math.max(1, guests - 1))}
                                                        className="w-8 h-8 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center hover:bg-sky-50 hover:text-sky-600 hover:border-sky-200 hover:scale-110 active:scale-95 transition-all shadow-sm"
                                                    >
                                                        <Minus size={14} />
                                                    </button>
                                                    <span className="font-bold text-gray-900 w-4 text-center">{guests}</span>
                                                    <button
                                                        onClick={() => setGuests(Math.min(20, guests + 1))}
                                                        className="w-8 h-8 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center hover:bg-sky-50 hover:text-sky-600 hover:border-sky-200 hover:scale-110 active:scale-95 transition-all shadow-sm"
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
                                className="bg-sky-600 hover:bg-sky-500 text-white rounded-full p-2.5 transition-all hover:scale-105 active:scale-95 shrink-0 shadow-md border border-sky-400/50"
                            >
                                <Search size={16} />
                            </button>
                        </div>

                        {/* Right Actions */}
                        <div className="hidden lg:flex items-center gap-3 shrink-0">
                            <CartDropdown />
                            <LanguageSwitcher />
                        </div>

                        {/* Mobile Toggle */}
                        <div className="flex items-center gap-2 lg:hidden">
                            <Link
                                href="/checkout"
                                className={clsx(
                                    'relative p-2 rounded-full transition-all duration-300 backdrop-blur-md active:scale-95',
                                    scrolled
                                        ? 'text-sky-900 bg-sky-50/80 border border-sky-100 shadow-sm'
                                        : 'text-white bg-white/20 border border-white/30 shadow-sm'
                                )}
                            >
                                <ShoppingBag className="w-5 h-5" />
                                {totalItems > 0 && (
                                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-sky-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-md">
                                        {totalItems}
                                    </span>
                                )}
                            </Link>

                            <button
                                className={clsx(
                                    'relative z-[10005] p-2 rounded-full transition-all duration-300 backdrop-blur-md active:scale-95',
                                    scrolled
                                        ? 'text-sky-900 bg-sky-50/80 border border-sky-100 shadow-sm'
                                        : 'text-white bg-white/20 border border-white/30 shadow-sm'
                                )}
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            >
                                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
                        className="fixed inset-0 bg-white/70 backdrop-blur-3xl flex flex-col items-center justify-start pt-24 space-y-7 lg:hidden p-4 z-[10000] overflow-y-auto"
                    >
                        {/* Mobile Search Widget */}
                        <div className="w-full max-w-sm bg-white/60 backdrop-blur-xl rounded-3xl p-5 shadow-[0_8px_32px_rgba(2,132,199,0.06)] border border-white/60 space-y-4">
                            <p className="text-xs font-bold text-sky-600/60 uppercase tracking-widest pl-1">Search Tours</p>

                            <div className="relative">
                                <select
                                    value={destination}
                                    onChange={(e) => setDestination(e.target.value)}
                                    className="w-full p-4 bg-white/80 backdrop-blur-md rounded-2xl text-base font-bold outline-none border border-white/80 focus:border-sky-300 transition-all appearance-none"
                                >
                                    <option value="" disabled>Where to?</option>
                                    {searchOptions.map((opt) => (
                                        <option key={opt.slug} value={opt.title}>{opt.title}</option>
                                    ))}
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <Search size={18} className="text-sky-400" />
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="flex-1 p-4 bg-white/80 backdrop-blur-md rounded-2xl font-bold outline-none border border-white/80 focus:border-sky-300 transition-all"
                                />
                                <div className="flex items-center bg-white/80 backdrop-blur-md rounded-2xl border border-white/80 px-2 w-[110px] justify-between shadow-sm">
                                    <button onClick={() => setGuests(Math.max(1, guests - 1))} className="p-2 hover:bg-white rounded-xl transition-colors text-sky-600/60 hover:text-sky-600">
                                        <Minus size={15} />
                                    </button>
                                    <span className="font-bold text-lg text-slate-800">{guests}</span>
                                    <button onClick={() => setGuests(guests + 1)} className="p-2 hover:bg-white rounded-xl transition-colors text-sky-600/60 hover:text-sky-600">
                                        <Plus size={15} />
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={handleSearch}
                                className="w-full bg-sky-600 text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all border border-sky-400/50 text-base uppercase tracking-wide"
                            >
                                Search
                            </button>
                        </div>

                        <div className="h-px w-3/4 max-w-sm bg-gradient-to-r from-transparent via-sky-200 to-transparent" />

                        <div className="flex flex-col items-center space-y-5 w-full">
                            {navLinks.map((link, i) => (
                                <motion.div
                                    key={link.name}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.08 + i * 0.05 }}
                                >
                                    <Link
                                        href={link.href}
                                        className="text-2xl font-bold text-slate-800 hover:text-sky-600 hover:scale-105 transition-all inline-block"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {link.name}
                                    </Link>
                                </motion.div>
                            ))}
                        </div>

                        <div className="pt-2 w-full max-w-sm flex flex-col items-center">
                            <p className="text-[10px] font-semibold text-sky-400 uppercase tracking-[0.2em] mb-4 text-center">Language</p>
                            <div className="bg-white/80 backdrop-blur-xl px-6 py-2 rounded-full border border-white/60 shadow-sm">
                                <LanguageSwitcher />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
