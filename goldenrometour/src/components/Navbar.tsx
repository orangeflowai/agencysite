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
import { urlFor } from '@/lib/dataAdapter';
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

    const handleSearch = () => {
        const query = encodeURIComponent(destination);
        const dateParam = date ? `&date=${date}` : '';
        router.push(`/search?q=${query}${dateParam}&guests=${guests}`);
        setIsMobileMenuOpen(false);
    };

    // REMOVED Colosseum and City per request
    const navLinks = [
        { name: t('nav.vatican') || 'Vatican', href: '/category/vatican' },
        { name: t('nav.private') || 'Private Tours', href: '/private-tours' },
        { name: t('nav.about') || 'About Us', href: '/about' },
        { name: t('nav.faq') || 'FAQ', href: '/faq' },
    ];

    const scrolled = isScrolled || isMobileMenuOpen;

    return (
        <>
            <nav
                className={clsx(
                    'fixed top-0 left-0 right-0 z-[10001] transition-all duration-500 border-b',
                    scrolled
                        ? 'bg-[#0A1628]/95 backdrop-blur-2xl shadow-xl border-[#C9A227]/20 py-2'
                        : 'bg-transparent border-transparent py-4 md:py-6'
                )}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="relative flex items-center justify-between lg:justify-start gap-6 w-full">

                        {/* Logo */}
                        <Link href="/" className="shrink-0 group">
                            {site?.logo ? (
                                <Image
                                    src={urlFor(site.logo).url()}
                                    alt={site.title || 'Golden Rome Tour'}
                                    width={140}
                                    height={40}
                                    className="h-8 md:h-10 w-auto object-contain transition-transform group-hover:scale-105"
                                    priority
                                />
                            ) : (
                                <div className="flex flex-col items-start justify-center transition-transform group-hover:scale-105 duration-300">
                                    <span className={clsx(
                                        'font-serif text-2xl md:text-3xl font-bold tracking-tighter leading-none transition-colors duration-300',
                                        scrolled ? 'text-white' : 'text-white'
                                    )}>
                                        GOLDEN <span className="italic text-[#C9A227]">ROME</span>
                                    </span>
                                </div>
                            )}
                        </Link>

                        {/* Desktop Nav Links */}
                        <div className="hidden lg:flex items-center gap-6 xl:gap-8 flex-1 justify-center">
                            {navLinks.map((link) => {
                                const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={clsx(
                                            'text-[10px] xl:text-xs font-sans font-black uppercase tracking-[0.3em] transition-all duration-300 whitespace-nowrap relative pb-1',
                                            isActive ? 'text-[#C9A227]' : (scrolled ? 'text-white/80 hover:text-[#C9A227]' : 'text-white/90 hover:text-[#C9A227]')
                                        )}
                                    >
                                        {link.name}
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Integrated Glassmorphism Search Bar */}
                        <div
                            className={clsx(
                                'hidden lg:flex items-center rounded-full pl-4 pr-1.5 py-1.5 border shrink-0 gap-3 transition-all duration-300',
                                scrolled
                                    ? 'bg-white/5 backdrop-blur-xl border-white/10 shadow-lg'
                                    : 'bg-white/10 backdrop-blur-md border-white/20 shadow-lg'
                            )}
                        >
                            <div className={clsx('flex items-center border-r pr-4', scrolled ? 'border-white/10' : 'border-white/20')}>
                                <Search size={14} className="text-[#C9A227]" />
                                <select
                                    value={destination}
                                    onChange={(e) => setDestination(e.target.value)}
                                    className="bg-transparent text-[10px] font-black uppercase tracking-widest outline-none w-28 xl:w-32 cursor-pointer appearance-none truncate text-white"
                                >
                                    <option value="" disabled className="text-gray-900">Archive Sector</option>
                                    {searchOptions.map((opt) => (
                                        <option key={opt.slug} value={opt.title} className="text-gray-900">{opt.title}</option>
                                    ))}
                                </select>
                            </div>

                            <div className={clsx('flex items-center border-r pr-4 relative cursor-pointer', scrolled ? 'border-white/10' : 'border-white/20')} ref={calendarRef}>
                                <div className="flex items-center hover:opacity-80 transition-opacity" onClick={() => setIsCalendarOpen(!isCalendarOpen)}>
                                    <Calendar size={14} className="text-[#C9A227]" />
                                    <span className="text-[10px] font-black uppercase tracking-widest w-20 xl:w-24 truncate text-white/80">
                                        {date ? format(new Date(date), 'MMM dd') : 'Add Date'}
                                    </span>
                                </div>
                                <AnimatePresence>
                                    {isCalendarOpen && (
                                        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 15 }} className="absolute top-full left-1/2 -translate-x-1/2 mt-6 bg-[#0A1628]/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/10 p-2 z-50">
                                            <SmartCalendar slug={activeSlug} selectedDate={date ? new Date(date) : undefined} onSelect={(d) => { setDate(d ? format(d, 'yyyy-MM-dd') : ''); setIsCalendarOpen(false); }} />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div className="relative flex items-center pr-1 cursor-pointer" ref={guestRef}>
                                <div className="flex items-center rounded-full px-2 py-1 transition-all hover:bg-white/5" onClick={() => setIsGuestOpen(!isGuestOpen)}>
                                    <Users size={14} className="text-[#C9A227]" />
                                    <span className="text-[10px] font-black uppercase tracking-widest w-10 text-center text-white">
                                        {guests}
                                    </span>
                                </div>
                                <AnimatePresence>
                                    {isGuestOpen && (
                                        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 15 }} className="absolute top-full right-0 mt-6 w-48 bg-[#0A1628]/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/10 p-4 z-50">
                                            <div className="flex items-center justify-between font-black uppercase tracking-widest text-[10px] text-white">
                                                <span>Guests</span>
                                                <div className="flex items-center gap-3">
                                                    <button onClick={() => setGuests(Math.max(1, guests - 1))} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#C9A227] transition-all"><Minus size={14} /></button>
                                                    <span className="text-sm">{guests}</span>
                                                    <button onClick={() => setGuests(guests + 1)} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#C9A227] transition-all"><Plus size={14} /></button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <button onClick={handleSearch} className="bg-[#C9A227] text-[#0A1628] rounded-full p-2.5 transition-all shadow-lg active:scale-95">
                                <Search size={16} />
                            </button>
                        </div>

                        {/* Right Actions */}
                        <div className="hidden lg:flex items-center gap-3 shrink-0 ml-4">
                            <CartDropdown />
                            <LanguageSwitcher />
                        </div>

                        {/* Mobile Toggle */}
                        <div className="flex items-center gap-2 lg:hidden">
                            <button className="p-2 rounded-full backdrop-blur-md active:scale-95 border border-white/20 bg-white/10 text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
}
