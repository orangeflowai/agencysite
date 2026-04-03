'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { SUPABASE_BUCKET_URL } from '@/lib/constants';
import { useSite } from '@/components/SiteProvider';
import { urlFor } from '@/lib/sanityService';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import { useCart } from '@/context/CartContext';
import CartDropdown from './CartDropdown';

export default function Navbar() {
  const { t } = useLanguage();
  const site = useSite();
  const { totalItems } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const navLinks = [
    { name: t('nav.colosseum'), href: '/category/colosseum' },
    { name: t('nav.vatican'),   href: '/category/vatican' },
    { name: t('nav.city'),      href: '/category/city' },
    { name: t('nav.hidden'),    href: '/category/hidden-gems' },
  ];

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + '/');

  return (
    <>
    <nav
      className={clsx(
        'fixed top-0 left-0 right-0 z-[10001] transition-all duration-300',
        scrolled || menuOpen
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 py-3'
          : 'bg-transparent py-5'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-6">

        {/* Logo */}
        <Link href="/" className="shrink-0 z-50">
          {site?.logo ? (
            <Image
              src={urlFor(site.logo).url()}
              alt={site.title || 'Logo'}
              width={140}
              height={44}
              className="h-8 md:h-10 w-auto object-contain"
              priority
            />
          ) : site?.logoText ? (
            <span className={clsx('text-xl md:text-2xl font-black tracking-tight transition-colors', (scrolled || menuOpen) ? 'text-gray-900' : 'text-white')}>
              {site.logoText}
              {site.logoTextAccent && <span className="text-emerald-400">{site.logoTextAccent}</span>}
            </span>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={`${SUPABASE_BUCKET_URL}/logo.png`}
              alt="Tickets in Rome"
              width={140}
              height={44}
              className="h-8 md:h-10 w-auto object-contain drop-shadow"
            />
          )}
        </Link>

        {/* Desktop links — centred */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                'text-xs font-bold uppercase tracking-widest transition-colors relative pb-0.5',
                'after:absolute after:bottom-0 after:left-0 after:h-[2px] after:rounded-full after:transition-all after:duration-300',
                isActive(link.href)
                  ? 'text-emerald-600 after:w-full after:bg-emerald-600'
                  : clsx(
                      'after:w-0 hover:after:w-full after:bg-emerald-600',
                      scrolled ? 'text-gray-700 hover:text-emerald-600' : 'text-gray-800 hover:text-emerald-600'
                    )
              )}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Book Now CTA — desktop */}
          <Link
            href="/search"
            className={clsx(
              'hidden lg:inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all',
              'bg-[#f97316] hover:bg-[#ea580c] text-white shadow-md shadow-[#f97316]/30'
            )}
          >
            Book Now
          </Link>

          {/* Cart */}
          <div className="hidden lg:block">
            <CartDropdown />
          </div>

          {/* Language */}
          <div className="hidden lg:flex">
            <LanguageSwitcher />
          </div>

          {/* Mobile: cart + hamburger */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link
              href="/checkout"
              className={clsx(
                'relative p-2 rounded-full transition-colors',
                scrolled || menuOpen ? 'text-gray-800 bg-gray-100/70' : 'text-white bg-black/20 backdrop-blur-sm'
              )}
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={clsx(
                'relative z-[10000] p-2 rounded-full transition-colors',
                scrolled || menuOpen ? 'text-gray-800 bg-gray-100/70' : 'text-white bg-black/20 backdrop-blur-sm'
              )}
              aria-label="Menu"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>
    </nav>

    {/* Mobile menu overlay — OUTSIDE nav to escape stacking context */}
    <AnimatePresence>
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, x: '100%' }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: '100%' }}
          transition={{ type: 'spring', damping: 26, stiffness: 220 }}
          className="fixed inset-0 bg-white z-[10000] flex flex-col items-center justify-start pt-28 px-6 overflow-y-auto"
        >
          <nav className="flex flex-col gap-4 w-full text-center mb-10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={clsx(
                  'text-2xl font-black uppercase tracking-tight py-3 border-b border-gray-50 transition-colors',
                  isActive(link.href) ? 'text-emerald-600' : 'text-gray-900 hover:text-emerald-600'
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <Link
            href="/search"
            onClick={() => setMenuOpen(false)}
            className="w-full py-4 bg-[#f97316] hover:bg-[#ea580c] text-white font-black text-base uppercase tracking-widest rounded-2xl text-center shadow-lg shadow-[#f97316]/30 mb-6 transition-colors"
          >
            Book Now
          </Link>

          <div className="border-t border-gray-100 pt-5">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Language</p>
            <LanguageSwitcher />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}
