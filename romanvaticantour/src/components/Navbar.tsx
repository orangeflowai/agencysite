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
        {
            name: 'Tours',
            isDropdown: true,
            items: [
                { name: 'Vatican Tours', href: '/category/vatican' },
                { name: 'Colosseum Tours', href: '/category/colosseum' },
                { name: 'Other Tours', href: '/search' },
            ]
        },
        { name: 'About Us', href: '/about' },
        { name: 'Contact', href: '/contact' },
    ];

    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    const scrolled = isScrolled || isMobileMenuOpen;

    return (
        <>
            <nav
                className={clsx(
                    'fixed top-0 left-0 right-0 z-[10001] transition-all duration-500 border-b',
                    scrolled
                        ? 'bg-[#e4d7b0]/80 backdrop-blur-2xl shadow-[0_8px_32px_rgba(141,157,79,0.08)] border-[#b19681]/30 py-2'
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
                                <div className="flex flex-col items-start justify-center transition-transform group-hover:scale-105 duration-300">
                                    <span className={clsx(
                                        'font-serif text-2xl md:text-3xl font-bold tracking-tighter leading-none transition-colors duration-300',
                                        scrolled ? 'text-[#5c4b3e]' : 'text-white drop-shadow-md'
                                    )}>
                                        ROMAN <span className="italic">VATICAN</span>
                                    </span>
                                    <span className={clsx(
                                        'font-sans text-[8px] uppercase font-black tracking-[0.4em] -mt-0.5 pl-1 transition-colors duration-300',
                                        scrolled ? 'text-[#5c4b3e]/50' : 'text-white/60'
                                    )}>
                                        Official Series
                                    </span>
                                </div>
                            )}
                        </Link>

                        {/* Desktop Nav Links */}
                        <div className="hidden lg:flex items-center gap-6 xl:gap-8 flex-1 justify-center">
                            {navLinks.map((link) => {
                                if (link.isDropdown) {
                                    return (
                                        <div
                                            key={link.name}
                                            className="relative"
                                            onMouseEnter={() => setActiveDropdown(link.name)}
                                            onMouseLeave={() => setActiveDropdown(null)}
                                        >
                                            <button
                                                className={clsx(
                                                    'flex items-center gap-1 text-[11px] xl:text-xs font-serif font-bold italic tracking-wide transition-colors pb-1',
                                                    scrolled ? 'text-[#5c4b3e] hover:text-primary' : 'text-white hover:text-white/80'
                                                )}
                                            >
                                                {link.name}
                                                <ChevronDown size={14} className={clsx("transition-transform", activeDropdown === link.name && "rotate-180")} />
                                            </button>
                                            <AnimatePresence>
                                                {activeDropdown === link.name && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: 10 }}
                                                        className="absolute top-full left-0 mt-2 w-48 bg-white/95 backdrop-blur-xl border border-gray-100 rounded-xl shadow-lg overflow-hidden py-2"
                                                    >
                                                        {link.items.map(item => (
                                                            <Link
                                                                key={item.href}
                                                                href={item.href}
                                                                className="block px-4 py-2 text-sm font-bold text-gray-800 hover:bg-primary/5 hover:text-primary transition-colors"
                                                            >
                                                                {item.name}
                                                            </Link>
                                                        ))}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    );
                                }

                                const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={clsx(
                                            'text-[11px] xl:text-xs font-serif font-bold italic tracking-wide transition-all duration-300 whitespace-nowrap relative pb-1',
                                            'after:absolute after:bottom-0 after:left-0 after:h-[1px] after:transition-all after:duration-500',
                                            isActive
                                                ? 'after:w-full after:bg-primary'
                                                : 'after:w-0 hover:after:w-full after:bg-primary',
                                            scrolled
                                                ? isActive ? 'text-primary' : 'text-[#5c4b3e] hover:text-primary'
                                                : isActive ? 'text-white' : 'text-white/80 hover:text-white'
                                        )}
                                    >
                                        {link.name}
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Right Actions */}
                        <div className="hidden lg:flex items-center gap-4 shrink-0">
                            <LanguageSwitcher />
                            <Link 
                                href="/search"
                                className="bg-primary hover:bg-primary/90 text-white font-bold px-6 py-2.5 rounded-full uppercase tracking-widest text-[10px] transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
                            >
                                Book Now
                            </Link>
                        </div>

                        {/* Mobile Toggle */}
                        <div className="flex items-center gap-2 lg:hidden">
                            <Link
                                href="/checkout"
                                className={clsx(
                                    'relative p-2 rounded-full transition-all duration-300 backdrop-blur-md active:scale-95',
                                    scrolled
                                        ? 'text-primary bg-primary/5 border border-primary/10 shadow-sm'
                                        : 'text-white bg-white/20 border border-white/30 shadow-sm'
                                )}
                            >
                                <ShoppingBag className="w-5 h-5" />
                                {totalItems > 0 && (
                                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-md">
                                        {totalItems}
                                    </span>
                                )}
                            </Link>

                            <button
                                className={clsx(
                                    'relative z-[10005] p-2 rounded-full transition-all duration-300 backdrop-blur-md active:scale-95',
                                    scrolled
                                        ? 'text-primary bg-primary/5 border border-primary/10 shadow-sm'
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
                        className="fixed inset-0 bg-[#e4d7b0]/80 backdrop-blur-3xl flex flex-col items-center justify-start pt-24 space-y-7 lg:hidden p-4 z-[10000] overflow-y-auto"
                    >
                        {/* Mobile Search Widget */}
                        <div className="w-full max-w-sm bg-white/60 backdrop-blur-xl rounded-3xl p-5 shadow-[0_8px_32px_rgba(141,157,79,0.06)] border border-white/60 space-y-4">
                            <p className="text-xs font-bold text-primary/60 uppercase tracking-widest pl-1">Search Tours</p>

                            <div className="relative">
                                <select
                                    value={destination}
                                    onChange={(e) => setDestination(e.target.value)}
                                    className="w-full p-4 bg-white/80 backdrop-blur-md rounded-2xl text-base font-bold outline-none border border-white/80 focus:border-primary/30 transition-all appearance-none"
                                >
                                    <option value="" disabled>Where to?</option>
                                    {searchOptions.map((opt) => (
                                        <option key={opt.slug} value={opt.title}>{opt.title}</option>
                                    ))}
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <Search size={18} className="text-primary/40" />
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="flex-1 p-4 bg-white/80 backdrop-blur-md rounded-2xl font-bold outline-none border border-white/80 focus:border-primary/30 transition-all"
                                />
                                <div className="flex items-center bg-white/80 backdrop-blur-md rounded-2xl border border-white/80 px-2 w-[110px] justify-between shadow-sm">
                                    <button onClick={() => setGuests(Math.max(1, guests - 1))} className="p-2 hover:bg-white rounded-xl transition-colors text-primary/60 hover:text-primary">
                                        <Minus size={15} />
                                    </button>
                                    <span className="font-bold text-lg text-slate-800">{guests}</span>
                                    <button onClick={() => setGuests(guests + 1)} className="p-2 hover:bg-white rounded-xl transition-colors text-primary/60 hover:text-primary">
                                        <Plus size={15} />
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={handleSearch}
                                className="w-full bg-primary text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all border border-primary/50 text-base uppercase tracking-wide"
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
