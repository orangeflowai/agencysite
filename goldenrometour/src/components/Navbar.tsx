'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Menu, X, Search, Calendar, Users, Minus, Plus, ShoppingBag } from 'lucide-react';
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

    // Updated to link to the 2 specific tours
    const navLinks = [
        { name: 'Skip The Line', href: '/tour/vatican-museum-sistine-chapel-skip-line-tickets' },
        { name: 'VIP Tour', href: '/tour/vip-vatican-museum-sistine-chapel-st-basilica' },
        { name: t('nav.about') || 'About Us', href: '/about' },
        { name: t('nav.faq') || 'FAQ', href: '/faq' },
    ];

    const scrolled = isScrolled || isMobileMenuOpen;

    return (
        <>
            {/* 5K ROLLING MARQUEE */}
            <div className="fixed top-0 left-0 right-0 z-[10002] bg-background py-2 overflow-hidden border-b border-primary/10 pointer-events-none">
                <div
                    }
                    }
                    className="flex whitespace-nowrap gap-12 items-center"
                >
                    {[...Array(10)].map((_, i) => (
                        <div key={i} className="flex items-center gap-12">
                            <span className="font-heading font-bold text-[8px] tracking-tight text-secondary uppercase">✦ Official Vatican Partner</span>
                            <span className="font-heading font-bold text-[8px] tracking-tight text-secondary uppercase">✦ Skip the Line Priority Access</span>
                            <span className="font-heading font-bold text-[8px] tracking-tight text-secondary uppercase">✦ Curator-Led Historian Routes</span>
                        </div>
                    ))}
                </div>
            </div>

            <nav
                style={{ top: '34px' }}
                className={clsx(
                    'fixed left-0 right-0 z-[10001] transition-all duration-500 border-b',
                    scrolled
                        ? 'bg-secondary/95 backdrop-blur-2xl shadow-xl border-primary/20 py-2'
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
                                        'font-heading text-xl md:text-2xl font-bold tracking-tighter leading-none transition-colors duration-300 italic',
                                        'text-white'
                                    )}>
                                        Vaticano <span className="text-primary not-italic">+</span>
                                    </span>
                                    <span className="font-heading text-primary/40 text-[8px] font-bold tracking-tight mt-1 uppercase">
                                        Sacred Luxury Editorial
                                    </span>
                                </div>
                            )}
                        </Link>

                        {/* Desktop Nav Links */}
                        <div className="hidden lg:flex items-center gap-10 xl:gap-14 flex-1 justify-center">
                            {navLinks.map((link) => {
                                const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={clsx(
                                            'text-[8px] font-heading font-bold tracking-tight transition-all duration-300 whitespace-nowrap relative pb-1 uppercase group/link',
                                            isActive ? 'text-primary' : (scrolled ? 'text-white/80 hover:text-primary' : 'text-white/90 hover:text-primary')
                                        )}
                                    >
                                        {link.name}
                                        <span className="absolute bottom-0 left-0 w-0 h-px bg-primary transition-all duration-300 group-hover/link:w-full"></span>
                                    </Link>
                                );
                            })}
                        </div>



                        {/* Right Actions */}
                        <div className="hidden lg:flex items-center gap-3 shrink-0 ml-4">
                            <CartDropdown />
                            <LanguageSwitcher />
                        </div>

                        {/* Mobile Toggle */}
                        <div className="flex items-center gap-2 lg:hidden">
                            <button className="p-2 rounded-full backdrop-blur-md active:scale-95 border border-white/20 bg-card/10 text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            
                {isMobileMenuOpen && (
                    <div
                        }
                        }
                        }
                        }
                        className="fixed inset-0 z-[10003] bg-secondary lg:hidden flex flex-col"
                    >
                        <div className="p-6 flex justify-between items-center border-b border-primary/10">
                            <span className="font-heading text-xl md:text-2xl font-bold text-white tracking-tight">VATICANO <span className="text-primary">+</span></span>
                            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded-full border border-white/10 text-white">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto py-12 px-8 space-y-8 text-center">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block font-heading text-3xl md:text-4xl text-white hover:text-primary transition-colors uppercase tracking-tight"
                                >
                                    {link.name}
                                </Link>
                            ))}
                            
                            <div className="pt-12 border-t border-primary/10 space-y-6">
                                <Link href="/search" onClick={() => setIsMobileMenuOpen(false)} className="block bg-primary text-secondary py-4 rounded-full font-heading font-bold tracking-tight text-[8px] uppercase">
                                    Explore Archive
                                </Link>
                                <div className="flex justify-center gap-6">
                                    <CartDropdown />
                                    <LanguageSwitcher />
                                </div>
                            </div>
                        </div>

                        <div className="p-8 border-t border-primary/10 bg-secondary/20">
                            <p className="font-body text-[8px] font-bold tracking-tight text-secondary/40 uppercase text-center">✦ sacred luxury editorial ✦</p>
                        </div>
                    </div>
                )}
            
        </>
    );
}
