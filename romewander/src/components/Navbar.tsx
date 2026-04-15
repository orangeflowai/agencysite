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

    const activeSlug = searchOptions.find(o => o.title === destination)?.slug || '';

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (calendarRef.current && !calendarRef.current.contains(e.target as Node)) setIsCalendarOpen(false);
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (guestRef.current && !guestRef.current.contains(e.target as Node)) setIsGuestOpen(false);
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
        document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isMobileMenuOpen]);

    const handleSearch = () => {
        const query = encodeURIComponent(destination);
        const dateParam = date ? `&date=${date}` : '';
        router.push(`/search?q=${query}${dateParam}&guests=${guests}`);
        setIsMobileMenuOpen(false);
    };

    const navLinks = [
        { name: t('nav.vatican') || 'Vatican', href: '/category/vatican' },
        { name: 'Colosseum', href: '/category/colosseum' },
        { name: 'Private Tours', href: '/private-tours' },
        { name: 'Hidden Gems', href: '/category/hidden-gems' },
        { name: 'Blog', href: '/blog' },
    ];

    const scrolled = isScrolled || isMobileMenuOpen;

    return (
        <>
            <nav
                className={clsx(
                    'fixed top-0 left-0 right-0 z-[10001] transition-all duration-500 border-b',
                    scrolled
                        ? 'bg-[#F5F0E8]/65 backdrop-blur-2xl shadow-[0_8px_32px_rgba(26,18,16,0.07)] border-white/40 py-2'
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
                                    alt={site.title || 'RomeWander'}
                                    width={150}
                                    height={48}
                                    className="h-8 md:h-10 lg:h-12 w-auto object-contain drop-shadow-md transition-transform group-hover:scale-105 duration-300"
                                    priority
                                />
                            ) : (
                                <div className="flex flex-col items-start justify-center transition-transform group-hover:scale-105 duration-300">
                                    <span className={clsx(
                                        'font-serif text-2xl md:text-3xl font-black tracking-tight leading-none transition-colors duration-300',
                                        scrolled ? 'text-[#1A1210]' : 'text-white drop-shadow-md'
                                    )}>
                                        ROMEWANDER
                                    </span>
                                    <span className={clsx(
                                        'font-sans text-[9px] uppercase font-black tracking-[0.3em] -mt-0.5 pl-0.5 transition-colors duration-300',
                                        scrolled ? 'text-[#C9A84C]' : 'text-[#C9A84C]/80'
                                    )}>
                                        Vatican Tours
                                    </span>
                                </div>
                            )}
                        </Link>

                        {/* Desktop Nav Links */}
                        <div className="hidden lg:flex items-center gap-4 xl:gap-6 flex-1 justify-center">
                            {navLinks.map((link) => {
                                const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={clsx(
                                            'text-[10px] xl:text-xs font-bold uppercase tracking-widest transition-all duration-300 whitespace-nowrap relative pb-1',
                                            'after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:transition-all after:duration-500',
                                            isActive
                                                ? 'after:w-full after:bg-[#C9A84C]'
                                                : 'after:w-0 hover:after:w-full after:bg-[#C9A84C]',
                                            scrolled
                                                ? isActive ? 'text-[#C9A84C]' : 'text-[#1A1210] hover:text-[#C9A84C]'
                                                : isActive ? 'text-[#C9A84C]' : 'text-white/90 hover:text-[#C9A84C]'
                                        )}
                                    >
                                        {link.name}
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Desktop Search Bar */}
                        <div
                            className={clsx(
                                'hidden lg:flex items-center rounded-full pl-4 pr-1.5 py-1.5 border shrink-0 gap-3 transition-all duration-300',
                                scrolled
                                    ? 'bg-white/70 backdrop-blur-xl border-white/60 shadow-lg'
                                    : 'bg-white/15 backdrop-blur-md border-white/25 shadow-lg'
                            )}
                        >
                            {/* Destination */}
                            <div className={clsx('flex items-center border-r pr-4', scrolled ? 'border-[#1A1210]/10' : 'border-white/20')}>
                                <Search size={13} className={clsx('mr-2 shrink-0', scrolled ? 'text-[#C9A84C]' : 'text-white/70')} />
                                <select
                                    value={destination}
                                    onChange={(e) => setDestination(e.target.value)}
                                    className={clsx(
                                        'bg-transparent text-xs font-bold outline-none w-28 xl:w-32 cursor-pointer appearance-none truncate',
                                        scrolled ? 'text-gray-800' : 'text-white/90'
                                    )}
                                >
                                    <option value="" disabled>Search Tours</option>
                                    {searchOptions.map((opt) => (
                                        <option key={opt.slug} value={opt.title} className="text-gray-800">{opt.title}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Date */}
                            <div
                                className={clsx('flex items-center border-r pr-4 relative cursor-pointer', scrolled ? 'border-[#1A1210]/10' : 'border-white/20')}
                                ref={calendarRef}
                            >
                                <div className="flex items-center hover:opacity-80 transition-opacity" onClick={() => setIsCalendarOpen(!isCalendarOpen)}>
                                    <Calendar size={13} className={clsx('mr-2 shrink-0', scrolled ? 'text-[#C9A84C]' : 'text-white/70')} />
                                    <span className={clsx(
                                        'text-xs font-bold w-20 xl:w-24 truncate',
                                        date ? (scrolled ? 'text-[#1A1210]' : 'text-white') : (scrolled ? 'text-[#1A1210]/40' : 'text-white/50')
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
                                            className="absolute top-full left-1/2 -translate-x-1/2 mt-6 bg-white/90 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/50 p-2 z-50 w-auto"
                                        >
                                            <SmartCalendar
                                                slug={activeSlug}
                                                selectedDate={date ? new Date(date) : undefined}
                                                onSelect={(d) => {
                                                    setDate(d ? format(d, 'yyyy-MM-dd') : '');
                                                    setIsCalendarOpen(false);
                                                }}
                                                basePrice={0}
                                            />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Guests */}
                            <div className="relative flex items-center pr-1 cursor-pointer" ref={guestRef}>
                                <div
                                    className={clsx('flex items-center rounded-full px-2 py-1 transition-all', scrolled ? 'hover:bg-[#C9A84C]/8' : 'hover:bg-white/10')}
                                    onClick={() => setIsGuestOpen(!isGuestOpen)}
                                >
                                    <Users size={13} className={clsx('mr-2', scrolled ? 'text-[#C9A84C]' : 'text-white/70')} />
                                    <span className={clsx('text-xs font-bold w-14 text-center', scrolled ? 'text-gray-800' : 'text-white/90')}>
                                        {guests} pax
                                    </span>
                                </div>
                                <AnimatePresence>
                                    {isGuestOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 15, scale: 0.95 }}
                                            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                                            className="absolute top-full right-0 mt-6 w-48 bg-white/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/50 p-4 z-50"
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-bold text-gray-700">Guests</span>
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        onClick={() => setGuests(Math.max(1, guests - 1))}
                                                        className="w-8 h-8 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center hover:bg-[#C9A84C] hover:text-white hover:border-[#C9A84C] hover:scale-110 active:scale-95 transition-all"
                                                    >
                                                        <Minus size={14} />
                                                    </button>
                                                    <span className="font-bold text-gray-900 w-4 text-center">{guests}</span>
                                                    <button
                                                        onClick={() => setGuests(Math.min(20, guests + 1))}
                                                        className="w-8 h-8 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center hover:bg-[#C9A84C] hover:text-white hover:border-[#C9A84C] hover:scale-110 active:scale-95 transition-all"
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
                                className="bg-[#C9A84C] hover:bg-[#A07830] text-white rounded-full p-2.5 transition-all hover:scale-105 active:scale-95 shrink-0 shadow-md"
                            >
                                <Search size={15} />
                            </button>
                        </div>

                        {/* Desktop right actions */}
                        <div className="hidden lg:flex items-center gap-3 shrink-0">
                            <CartDropdown />
                            <LanguageSwitcher />
                        </div>

                        {/* Mobile toggle */}
                        <div className="flex items-center gap-2 lg:hidden">
                            <Link
                                href="/checkout"
                                className={clsx(
                                    'relative p-2 rounded-full transition-all duration-300 backdrop-blur-md active:scale-95',
                                    scrolled
                                        ? 'text-[#1A1210] bg-[#C9A84C]/10 border border-[#C9A84C]/20'
                                        : 'text-white bg-white/15 border border-white/25'
                                )}
                            >
                                <ShoppingBag className="w-5 h-5" />
                                {totalItems > 0 && (
                                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#C9A84C] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                        {totalItems}
                                    </span>
                                )}
                            </Link>

                            <button
                                className={clsx(
                                    'relative z-[10005] p-2 rounded-full transition-all duration-300 backdrop-blur-md active:scale-95',
                                    scrolled
                                        ? 'text-[#1A1210] bg-[#1A1210]/5 border border-[#1A1210]/10'
                                        : 'text-white bg-white/15 border border-white/25'
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
                        className="fixed inset-0 lg:hidden z-[10000] overflow-y-auto"
                        style={{
                            background: 'rgba(245,240,232,0.75)',
                            backdropFilter: 'blur(32px)',
                            WebkitBackdropFilter: 'blur(32px)',
                        }}
                    >
                        <div className="flex flex-col items-center justify-start pt-24 pb-12 px-6 space-y-8 min-h-full">
                            {/* Nav Links */}
                            <div className="flex flex-col items-center space-y-6 w-full">
                                {navLinks.map((link, i) => (
                                    <motion.div
                                        key={link.name}
                                        initial={{ opacity: 0, y: 12 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.06 + i * 0.05 }}
                                    >
                                        <Link
                                            href={link.href}
                                            className="text-3xl font-serif font-black tracking-tight text-[#1A1210] hover:text-[#C9A84C] transition-colors"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            {link.name}
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="h-px w-24 bg-[#C9A84C]/30" />

                            {/* Mobile Search */}
                            <div className="w-full max-w-sm space-y-4"
                                style={{
                                    background: 'rgba(255,255,255,0.65)',
                                    backdropFilter: 'blur(20px)',
                                    WebkitBackdropFilter: 'blur(20px)',
                                    borderRadius: '1.5rem',
                                    padding: '1.5rem',
                                    border: '1px solid rgba(201,168,76,0.15)',
                                    boxShadow: '0 8px 32px rgba(26,18,16,0.06)',
                                }}
                            >
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#C9A84C] text-center">Plan Your Visit</p>
                                <select
                                    value={destination}
                                    onChange={(e) => setDestination(e.target.value)}
                                    className="w-full p-4 bg-white/80 rounded-2xl text-base font-bold outline-none border border-white/80 focus:border-[#C9A84C]/30 transition-all appearance-none"
                                >
                                    <option value="">Where to?</option>
                                    {searchOptions.map(opt => (
                                        <option key={opt.slug} value={opt.title}>{opt.title}</option>
                                    ))}
                                </select>
                                <div className="flex gap-3">
                                    <input
                                        type="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        className="flex-1 p-4 bg-white/80 rounded-2xl font-bold outline-none border border-white/80 focus:border-[#C9A84C]/30 transition-all"
                                    />
                                    <div className="flex items-center bg-white/80 rounded-2xl border border-white/80 px-2 w-28 justify-between">
                                        <button onClick={() => setGuests(Math.max(1, guests - 1))} className="p-2">
                                            <Minus size={14} className="text-[#1A1210]/60" />
                                        </button>
                                        <span className="font-bold text-lg text-[#1A1210]">{guests}</span>
                                        <button onClick={() => setGuests(guests + 1)} className="p-2">
                                            <Plus size={14} className="text-[#1A1210]/60" />
                                        </button>
                                    </div>
                                </div>
                                <button
                                    onClick={handleSearch}
                                    className="w-full bg-[#C9A84C] text-[#1A1210] font-black uppercase tracking-widest py-4 rounded-2xl shadow-lg hover:brightness-105 active:scale-[0.98] transition-all"
                                >
                                    Search Tours
                                </button>
                            </div>

                            <div className="pt-2 w-full max-w-sm flex flex-col items-center">
                                <div
                                    className="px-6 py-2 rounded-full border border-white/60"
                                    style={{ background: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(12px)' }}
                                >
                                    <LanguageSwitcher />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
