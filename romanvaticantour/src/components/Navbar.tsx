'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

import { useLanguage } from '@/context/LanguageContext';
import { useSite } from '@/components/SiteProvider';
import { urlFor } from '@/lib/dataAdapter';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navbar() {
    const { t } = useLanguage();
    const site = useSite();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Vatican', href: '/category/vatican' },
        { name: 'Colosseum', href: '/category/colosseum' },
        { name: 'Private Tours', href: '/category/hidden-gems' },
        { name: 'All Tours', href: '/search' },
    ];

    const scrolled = isScrolled || isMobileMenuOpen;

    return (
        <>
            {/* ANNOUNCEMENT MARQUEE */}
            <div className="fixed top-0 left-0 right-0 z-[10002] bg-primary py-2 overflow-hidden border-b border-white/10 pointer-events-none">
                <motion.div
                    animate={{ x: [0, -1000] }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="flex whitespace-nowrap gap-12 items-center"
                >
                    {[...Array(10)].map((_, i) => (
                        <div key={i} className="flex items-center gap-12 text-white/90 font-bold tracking-[0.2em] text-[11px] font-sans">
                            <span>✦ EXCLUSIVE VATICAN ACCESS ✦</span>
                            <span>✦ SECURE YOUR ENTRY TICKETS NOW ✦</span>
                            <span>✦ EXPERT LICENSED HISTORIANS ✦</span>
                        </div>
                    ))}
                </motion.div>
            </div>

            <nav
                style={{ top: '34px' }}
                className={clsx(
                    'fixed left-0 right-0 z-[10001] transition-all duration-500 border-b',
                    scrolled
                        ? 'bg-background/90 backdrop-blur-2xl shadow-[0_8px_32px_rgba(91,44,111,0.12)] border-primary/20 py-2'
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
                                        scrolled ? 'text-foreground' : 'text-white drop-shadow-md'
                                    )}>
                                        ROMAN <span className=" text-primary">VATICAN</span>
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
                                            'text-[10px] xl:text-xs font-serif font-bold  tracking-wide transition-all duration-300 whitespace-nowrap relative pb-1',
                                            'after:absolute after:bottom-0 after:left-0 after:h-[1px] after:transition-all after:duration-500',
                                            isActive ? 'after:w-full after:bg-primary text-primary' : 'after:w-0 hover:after:w-full after:bg-primary',
                                            scrolled ? (!isActive && 'text-foreground/70 hover:text-primary') : (!isActive && 'text-white/80 hover:text-white')
                                        )}
                                    >
                                        {link.name}
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Right Actions */}
                        <div className="hidden lg:flex items-center gap-3 shrink-0 ml-4">
                            <Link 
                                href="/search"
                                className="bg-primary hover:bg-primary/90 text-white px-5 py-2 rounded-full text-xs font-bold tracking-widest transition-all shadow-md active:scale-95"
                            >
                                BOOK NOW
                            </Link>
                            <LanguageSwitcher />
                        </div>

                        {/* Mobile Toggle */}
                        <div className="flex items-center gap-2 lg:hidden">
                            <button className={clsx('p-2 rounded-full backdrop-blur-md active:scale-95', scrolled ? 'text-primary bg-primary/5' : 'text-white bg-white/20')} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="lg:hidden bg-background border-t border-primary/20 overflow-hidden"
                        >
                            <div className="px-4 pt-2 pb-6 space-y-1">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className="block px-3 py-4 text-sm font-serif font-bold text-foreground hover:text-primary border-b border-primary/10"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                                <div className="pt-4 px-3">
                                    <Link
                                        href="/search"
                                        className="block w-full bg-primary text-white text-center py-4 rounded-xl font-bold tracking-widest text-xs"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        BOOK NOW
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>
        </>
    );
}
