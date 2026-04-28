'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Search, ShoppingBag, ChevronDown, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';
import { useSite } from '@/components/SiteProvider';
import { useCart } from '@/context/CartContext';
import { getSite, DEFAULT_SITE_ID, urlFor } from "@/lib/dataAdapter";
import CartDropdown from './CartDropdown';

const NAV_LINKS = [
  { label: 'Vatican',     href: '/category/vatican' },
  { label: 'Colosseum',   href: '/category/colosseum' },
  { label: 'City Tours',  href: '/category/city' },
  { label: 'Hidden Gems', href: '/category/hidden-gems' },
  { label: 'About',       href: '/about' },
];

export default function Navbar() {
  const site = useSite();
  const { totalItems } = useCart();
  const router = useRouter();
  const pathname = usePathname();

  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [searchQ, setSearchQ]     = useState('');
  const [lang, setLang]           = useState('EN');
  const [langOpen, setLangOpen]   = useState(false);

  const LANGS = [
    { code: 'EN', label: 'English' },
    { code: 'IT', label: 'Italiano' },
    { code: 'ES', label: 'Español' },
    { code: 'FR', label: 'Français' },
    { code: 'DE', label: 'Deutsch' },
    { code: 'ZH', label: '中文' },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQ.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQ.trim())}`);
      setMenuOpen(false);
    }
  };

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + '/');

  const scrolledOrOpen = scrolled || menuOpen;

  return (
    <>
      {/* 5K ROLLING MARQUEE */}
      <div className="fixed top-0 left-0 right-0 z-[10002] bg-primary py-2 overflow-hidden border-b border-white/5 pointer-events-none">
        <motion.div
            animate={{ x: [0, -1000] }}
            transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
            className="flex whitespace-nowrap gap-12 items-center"
        >
            {[...Array(10)].map((_, i) => (
                <div key={i} className="flex items-center gap-12 text-white/90 font-mono font-bold  tracking-[0.4em] text-[9px]">
                    <span>✦ DISCOVER THE ANCIENT WONDERS ✦</span>
                    <span>✦ SKIP THE LINE PROTOCOLS ACTIVE ✦</span>
                    <span>✦ 100% SECURE BOOKING SYSTEM ✦</span>
                </div>
            ))}
        </motion.div>
      </div>

      <nav
        style={{ top: '34px' }}
        className={`fixed left-0 right-0 z-[9000] transition-all duration-300 border-b ${
          scrolledOrOpen
            ? 'bg-card/98 backdrop-blur-md border-border shadow-sm py-3'
            : 'bg-transparent border-transparent py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-6">

            {/* Logo */}
            <Link href="/" className="shrink-0 flex items-center group">
              {site?.logo ? (
                <Image
                  src={urlFor(site.logo).url()}
                  alt={site.title || 'Wonders of Rome'}
                  width={140}
                  height={40}
                  className="h-9 w-auto object-contain group-hover:scale-105 transition-transform"
                  priority
                />
              ) : (
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-sm bg-primary flex items-center justify-center shadow-lg">
                    <span className="text-white font-mono font-bold text-sm">W</span>
                  </div>
                  <span
                    className={`font-serif font-bold text-lg tracking-tighter transition-colors  ${
                      scrolledOrOpen ? 'text-primary' : 'text-white drop-shadow-md'
                    }`}
                  >
                    WONDERS <span className=" opacity-70">OF</span> ROME
                  </span>
                </div>
              )}
            </Link>

            {/* Desktop nav links */}
            <div className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-3 py-2 text-[0.75rem] font-bold  tracking-[0.2em] transition-colors ${
                    isActive(link.href)
                      ? 'text-primary'
                      : scrolledOrOpen
                        ? 'text-foreground hover:text-primary'
                        : 'text-white/90 hover:text-white'
                  }`}
                >
                  {link.label}
                  {isActive(link.href) && (
                    <span className="absolute bottom-0.5 left-3 right-3 h-0.5 bg-primary rounded-full" />
                  )}
                </Link>
              ))}
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-3">
              {/* Search — desktop */}
              <form onSubmit={handleSearch} className="hidden lg:flex items-center">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-sm border transition-all ${
                  scrolledOrOpen
                    ? 'border-border bg-background'
                    : 'border-white/20 bg-card/10 backdrop-blur-sm'
                }`}>
                  <Search size={14} className={scrolledOrOpen ? 'text-primary' : 'text-white/60'} />
                  <input
                    type="text"
                    value={searchQ}
                    onChange={e => setSearchQ(e.target.value)}
                    placeholder="TERMINAL_SEARCH..."
                    className={`bg-transparent text-[10px] font-bold  tracking-widest outline-none w-32 placeholder:opacity-50 transition-colors ${
                      scrolledOrOpen
                        ? 'text-foreground placeholder:text-muted-foreground'
                        : 'text-white placeholder:text-white/50'
                    }`}
                  />
                </div>
              </form>

              {/* Language selector — desktop */}
              <div className="hidden lg:block relative">
                <button
                  onClick={() => setLangOpen(!langOpen)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-bold  tracking-widest transition-all border ${
                    scrolledOrOpen ? 'border-border text-foreground hover:bg-muted' : 'border-white/20 text-white hover:bg-card/10'
                  }`}
                >
                  <Globe size={13} />
                  {lang}
                  <ChevronDown size={11} className={`transition-transform ${langOpen ? 'rotate-180' : ''}`} />
                </button>
                {langOpen && (
                  <div className="absolute right-0 top-full mt-2 bg-card border border-border rounded-xl shadow-xl overflow-hidden z-50 min-w-[140px]">
                    {LANGS.map(l => (
                      <button
                        key={l.code}
                        onClick={() => { setLang(l.code); setLangOpen(false); }}
                        className={`w-full text-left px-4 py-2.5 text-xs font-bold hover:bg-muted transition-colors ${lang === l.code ? 'text-primary bg-primary/5' : 'text-foreground'}`}
                      >
                        {l.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Cart — desktop */}
              <div className="hidden lg:block">
                <CartDropdown />
              </div>

              {/* Cart — mobile */}
              <Link
                href="/checkout"
                className={`relative lg:hidden p-2 rounded-sm transition-colors border ${
                  scrolledOrOpen ? 'text-primary bg-background border-border' : 'text-white bg-card/10 border-white/20'
                }`}
              >
                <ShoppingBag size={20} />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-background">
                    {totalItems}
                  </span>
                )}
              </Link>

              {/* Hamburger */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className={`lg:hidden p-2 rounded-sm transition-colors border ${
                  scrolledOrOpen ? 'text-primary bg-background border-border' : 'text-white bg-card/10 border-white/20'
                }`}
                aria-label="Toggle menu"
              >
                {menuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-[8999] bg-background flex flex-col pt-24 overflow-y-auto">
          <div className="px-6 py-8 space-y-3">
            {/* Mobile search */}
            <form onSubmit={handleSearch} className="mb-8">
              <div className="flex items-center gap-3 px-4 py-4 bg-card rounded-sm border border-border">
                <Search size={18} className="text-primary shrink-0" />
                <input
                  type="text"
                  value={searchQ}
                  onChange={e => setSearchQ(e.target.value)}
                  placeholder="QUERY_CORE..."
                  className="flex-1 bg-transparent text-foreground text-sm font-bold  tracking-widest outline-none placeholder:text-muted-foreground"
                />
              </div>
            </form>

            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center justify-between px-6 py-5 rounded-sm text-sm font-bold  tracking-[0.2em] transition-all border ${
                  isActive(link.href)
                    ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                    : 'text-foreground hover:bg-card border-transparent'
                }`}
              >
                {link.label}
                <ChevronDown size={16} className={isActive(link.href) ? "-rotate-90" : "-rotate-90 opacity-20"} />
              </Link>
            ))}
          </div>

          {/* Mobile footer */}
          <div className="mt-auto px-8 py-10 border-t border-border bg-card">
            <p className="font-mono text-[10px] text-muted-foreground  tracking-[0.4em] mb-4 font-bold">Link Established</p>
            <a
              href={`tel:${process.env.NEXT_PUBLIC_SUPPORT_PHONE || '+393514199425'}`}
              className="text-primary font-bold text-lg font-mono tracking-tighter"
            >
              {process.env.NEXT_PUBLIC_SUPPORT_PHONE || '+39 351 419 9425'}
            </a>
          </div>
        </div>
      )}
    </>
  );
}
