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

    useEffect(() => {
        console.log("✦ RomeWander UI v2.2 Activating...");
        async function loadOptions() {
            try {
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
        { name: t('nav.vatican') || 'Vatican', href: '/category/vatican' },
        { name: 'Colosseum', href: '/category/colosseum' },
        { name: 'Private Tours', href: '/private-tours' },
        { name: 'Hidden Gems', href: '/category/hidden-gems' },
        { name: 'Blog', href: '/blog' },
    ];

    return (
        <>
            <nav
                className={clsx(
                    'w-full transition-all duration-300 border-b sticky top-0 z-[10002]',
                    (isScrolled || isMobileMenuOpen)
                        ? 'bg-[#F5F0E8] border-gray-200 shadow-md py-2'
                        : 'bg-gradient-to-b from-black/60 to-transparent border-transparent py-4'
                )}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="relative flex items-center justify-between w-full h-16 md:h-20">
                        {/* Left: Logo */}
                        <div className="flex flex-1 justify-start">
                            <Link href="/" className="z-[10005] shrink-0">
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
                                            "font-serif text-xl md:text-2xl lg:text-3xl font-black tracking-tight leading-none",
                                            (isScrolled || isMobileMenuOpen) ? "text-[#1A1210]" : "text-white"
                                        )}>
                                            ROMEWANDER
                                        </span>
                                        <span className="font-accent text-[#C9A84C] text-[10px] md:text-sm -mt-1 tracking-widest pl-1">
                                            Vatican Tours
                                        </span>
                                    </div>
                                )}
                            </Link>
                        </div>

                        {/* Center: Desktop Menu */}
                        <div className="hidden lg:flex items-center gap-4 xl:gap-8 flex-none justify-center">
                            {navLinks.map((link) => {
                                const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
                                return (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        className={clsx(
                                            "text-[10px] xl:text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap relative pb-1",
                                            isActive
                                                ? "text-[#C9A84C]"
                                                : (isScrolled || isMobileMenuOpen)
                                                    ? "text-[#1A1210] hover:text-[#C9A84C]"
                                                    : "text-white drop-shadow-md hover:text-[#C9A84C]"
                                        )}
                                    >
                                        {link.name}
                                        {isActive && <motion.div layoutId="nav-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C9A84C]" />}
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Right: Actions & Mobile Toggle */}
                        <div className="flex flex-1 justify-end items-center gap-2 sm:gap-4">
                            <div className="hidden lg:flex items-center gap-4">
                                <CartDropdown />
                                <LanguageSwitcher />
                            </div>

                            {/* Mobile Buttons */}
                            <div className="flex items-center gap-2 lg:hidden">
                                <Link
                                    href="/checkout"
                                    className={clsx(
                                        "relative p-2 rounded-full transition-colors z-[10005]",
                                        (isScrolled || isMobileMenuOpen)
                                            ? "text-[#1A1210] bg-gray-100"
                                            : "text-white bg-black/20 backdrop-blur-sm"
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
                                        "relative z-[10005] p-2 rounded-full transition-colors",
                                        (isScrolled || isMobileMenuOpen)
                                            ? "text-[#1A1210] bg-gray-100"
                                            : "text-white bg-black/20 backdrop-blur-sm"
                                    )}
                                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                >
                                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed inset-0 lg:hidden z-[10000] overflow-y-auto"
                        style={{ backgroundColor: '#F5F0E8' }}
                    >
                        <div className="flex flex-col items-center justify-start pt-32 pb-12 px-6 space-y-10 min-h-full">
                            {/* Mobile Nav Links */}
                            <div className="flex flex-col items-center space-y-8 w-full">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        className="text-3xl font-serif font-black tracking-tight text-[#1A1210] hover:text-[#C9A84C] transition-colors"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                            </div>

                            <div className="h-px w-24 bg-[#C9A84C]/30" />

                            {/* Mobile Search Widget */}
                            <div className="w-full max-w-sm bg-white rounded-2xl p-8 shadow-2xl border border-[#C9A84C]/10 space-y-6">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#C9A84C] text-center">Plan Your Pilgrimage</p>
                                <div className="space-y-4">
                                    <select
                                        value={destination}
                                        onChange={(e) => setDestination(e.target.value)}
                                        className="w-full p-4 bg-gray-50 rounded-xl text-lg font-bold outline-none border border-gray-100 focus:border-[#C9A84C] transition-all"
                                    >
                                        <option value="">Destination</option>
                                        {searchOptions.map(opt => (
                                            <option key={opt.slug} value={opt.title}>{opt.title}</option>
                                        ))}
                                    </select>
                                    <input
                                        type="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        className="w-full p-4 bg-gray-50 rounded-xl font-bold outline-none border border-gray-100 focus:border-[#C9A84C] transition-all"
                                    />
                                </div>
                                <button onClick={handleSearch} className="w-full bg-[#C9A84C] text-[#1A1210] font-black uppercase tracking-widest py-5 rounded-xl shadow-lg hover:brightness-110 active:scale-95 transition-all">
                                    Search Tours
                                </button>
                            </div>

                            {/* Languages & Footer Info */}
                            <div className="flex flex-col items-center space-y-6 pt-6 w-full">
                                <LanguageSwitcher />
                                <p className="text-[10px] uppercase tracking-widest text-[#1A1210]/40">© {new Date().getFullYear()} ROMEWANDER</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
