'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';

export default function Navbar() {
    const { t } = useLanguage();
    const [isScrolled, setIsScrolled] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: t('nav.vatican') || 'Vatican', href: '/category/vatican' },
        { name: 'Private Tours', href: '/private-tours' },
    ];

    return (
        <nav
            className={clsx(
                'fixed top-0 left-0 right-0 z-[10001] transition-all duration-300 hidden md:block',
                isScrolled 
                    ? 'bg-white/95 backdrop-blur-3xl border-b border-gray-100 h-20 shadow-sm' 
                    : 'bg-transparent h-24'
            )}
        >
            <div className="container mx-auto h-full px-6 md:px-16 flex items-center justify-between">
                
                {/* Logo (Left) */}
                <Link href="/" className="group flex items-center gap-3 shrink-0">
                    <div className="w-10 h-10 rounded-full bg-card flex items-center justify-center text-foreground group-hover:scale-110 transition-transform duration-500 shadow-xl shadow-black/10">
                        <svg width="22" height="22" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16 2L2 16L16 30L30 16L16 2Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                    <div className="flex flex-col">
                        <span className={clsx(
                            "font-inter text-xl font-black tracking-tighter leading-none transition-colors",
                            isScrolled ? "text-foreground" : "text-foreground drop-shadow-lg"
                        )}>
                            ROMEWANDER
                        </span>
                        <span className="font-inter text-[8px] uppercase font-black tracking-[0.4em] text-foreground mt-1 opacity-90">
                            Vatican Tours
                        </span>
                    </div>
                </Link>

                {/* Navigation (Right) */}
                <div className="flex items-center gap-12">
                    {navLinks.map((link) => (
                        <Link 
                            key={link.href} 
                            href={link.href}
                            className={clsx(
                                "text-[12px] font-black uppercase tracking-[0.3em] transition-all duration-300 relative py-1",
                                pathname === link.href 
                                    ? "text-foreground" 
                                    : isScrolled ? "text-foreground/50 hover:text-foreground" : "text-foreground/80 hover:text-white drop-shadow-md"
                            )}
                        >
                            {link.name}
                            {pathname === link.href && (
                                <span 
                                    
                                    className="absolute -bottom-1.5 left-0 right-0 h-[4px] bg-card rounded-full" 
                                />
                            )}
                        </Link>
                    ))}
                    
                    <Link 
                        href="/contact" 
                        className={clsx(
                            "px-8 py-3 rounded-full text-[8px] font-black uppercase tracking-[0.35em] transition-all border",
                            isScrolled 
                                ? "bg-card text-white border-border hover:bg-card hover:border-border shadow-lg shadow-black/10" 
                                : "bg-white/10 text-white border-white/20 hover:bg-card hover:text-foreground backdrop-blur-md"
                        )}
                    >
                        Contact
                    </Link>
                </div>

            </div>
        </nav>
    );
}
