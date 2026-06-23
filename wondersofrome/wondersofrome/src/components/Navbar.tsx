'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Search, ShoppingBag, ChevronDown, ChevronRight, Globe } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useSite } from '@/components/SiteProvider';
import { useCart } from '@/context/CartContext';
import { getSite, DEFAULT_SITE_ID, urlFor } from "@/lib/dataAdapter";
import CartDropdown from './CartDropdown';
import { useLanguage } from '@/context/LanguageContext';

const NAV_LINKS = [
  { labelKey: 'nav.vatican',    label: 'Vatican',     href: '/category/vatican' },
  { labelKey: 'nav.colosseum',  label: 'Colosseum',   href: '/category/colosseum' },
  { labelKey: 'nav.city',       label: 'City Tours',  href: '/category/city-tours' },
  { labelKey: 'nav.hidden',     label: 'Hidden Gems', href: '/category/hidden-gems' },
  { labelKey: 'nav.about',      label: 'About',       href: '/about' },
];

export default function Navbar() {
  const site = useSite();
  const { totalItems } = useCart();
  const { language, setLanguage, t } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();

  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [searchQ, setSearchQ]     = useState('');
  const [langOpen, setLangOpen]   = useState(false);

  const LANGS = [
    { code: 'en', label: 'English' },
    { code: 'it', label: 'Italiano' },
    { code: 'es', label: 'Español' },
    { code: 'fr', label: 'Français' },
    { code: 'de', label: 'Deutsch' },
    { code: 'pt', label: 'Português' },
  ];

  const handleLangChange = (code: string) => {
    setLanguage(code as any);
    setLangOpen(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferredLanguage', code);
      // No reload needed — LanguageContext is reactive and re-renders all components
    }
  };

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
      <div className="fixed top-0 left-0 right-0 z-[10002] bg-primary py-2.5 overflow-hidden border-b border-white/10 pointer-events-none">
        <div
            style={{ animation: 'marquee 40s linear infinite' }}
            className="flex whitespace-nowrap gap-16 items-center"
        >
            {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center gap-16 text-white/95 font-mono font-bold tracking-[0.3em] text-[10px]">
                    <span className="flex items-center gap-2"><span className="text-accent">★</span> RATED 4.9/5 FROM 1,200+ VERIFIED REVIEWS</span>
                    <span className="flex items-center gap-2"><span className="text-accent">✦</span> 12,400+ TOURS BOOKED IN 2024</span>
                    <span className="flex items-center gap-2"><span className="text-accent">✦</span> SKIP-THE-LINE ENTRY ON ALL COLOSSEUM &amp; VATICAN TOURS</span>
                    <span className="flex items-center gap-2"><span className="text-accent">✦</span> FREE CANCELLATION UP TO 72 HOURS BEFORE</span>
                </div>
            ))}
        </div>
      </div>

      <nav
        style={{ top: '37px' }}
        className={`fixed left-0 right-0 z-[9000] transition-all duration-300 border-b bg-card/98 backdrop-blur-md border-border shadow-md py-3`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-6">

            {/* Logo */}
            <Link href="/" className="shrink-0 flex items-center group">
              {site?.logo ? (
                <Image
                  src={urlFor(site.logo).url()}
                  alt={site.title || 'Wonders of Rome'}
                  width={160}
                  height={48}
                  className="h-10 w-auto object-contain group-hover:scale-105 transition-transform"
                  priority
                />
              ) : (
                <Image
                  src="/logo.png"
                  alt="Wonders of Rome"
                  width={160}
                  height={48}
                  className="h-10 w-auto object-contain group-hover:scale-105 transition-transform"
                  priority
                />
              )}
            </Link>

            {/* Desktop nav links */}
            <div className="hidden lg:flex items-center gap-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 text-[11px] font-bold tracking-[0.15em] transition-all hover-underline uppercase ${
                    isActive(link.href)
                      ? 'text-primary'
                      : 'text-foreground hover:text-primary'
                  }`}
                >
                  {t(link.labelKey)}
                  {isActive(link.href) && (
                    <span className="absolute bottom-0.5 left-4 right-4 h-0.5 bg-primary rounded-full" />
                  )}
                </Link>
              ))}
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-4">
              {/* Search — desktop */}
              <form onSubmit={handleSearch} className="hidden lg:flex items-center relative group">
                <div className="flex items-center gap-3 px-5 py-2.5 rounded-full border border-border bg-muted/50 focus-within:border-primary focus-within:bg-background transition-all">
                  <Search size={16} className="text-primary" />
                  <input
                    type="text"
                    value={searchQ}
                    onChange={e => setSearchQ(e.target.value)}
                    placeholder={t('nav.search_placeholder')}
                    className="bg-transparent text-[11px] font-bold tracking-wider outline-none w-44 placeholder:opacity-50 transition-colors text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                
                {/* Category Dropdown */}
                {searchQ && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-xl overflow-hidden z-50 min-w-[280px]">
                    <div className="px-4 py-3 border-b border-border bg-muted/30">
                      <p className="text-xs font-bold text-muted-foreground tracking-wider">EXPLORE CATEGORIES</p>
                    </div>
                    {NAV_LINKS.slice(0, 4).map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => { setSearchQ(''); setMenuOpen(false); }}
                        className="flex items-center justify-between px-4 py-3 text-sm hover:bg-muted transition-colors group/item"
                      >
                        <span className="font-medium text-foreground group-hover/item:text-primary">{link.label}</span>
                        <ChevronDown size={14} className="-rotate-90 text-muted-foreground group-hover/item:text-primary" />
                      </Link>
                    ))}
                  </div>
                )}
              </form>

              {/* Language selector — desktop */}
              <div className="hidden lg:block relative">
                <button
                  onClick={() => setLangOpen(!langOpen)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[8px] font-bold  tracking-widest transition-all border border-border text-foreground hover:bg-muted"
                >
                  <Globe size={13} />
                  {language.toUpperCase()}
                  <ChevronDown size={11} className={`transition-transform ${langOpen ? 'rotate-180' : ''}`} />
                </button>
                {langOpen && (
                  <div className="absolute right-0 top-full mt-2 bg-card border border-border rounded-xl shadow-xl overflow-hidden z-50 min-w-[144px]">
                    {LANGS.map(l => (
                      <button
                        key={l.code}
                        onClick={() => handleLangChange(l.code)}
                        className={`w-full text-left px-4 py-2.5 text-xs font-bold hover:bg-muted transition-colors ${language === l.code ? 'text-primary bg-primary/5' : 'text-foreground'}`}
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
                className="relative lg:hidden p-2.5 rounded-full transition-all border text-primary bg-muted/50 border-border shadow-sm"
              >
                <ShoppingBag size={20} />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-background shadow-lg">
                    {totalItems}
                  </span>
                )}
              </Link>

              {/* Hamburger */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden p-2.5 rounded-full transition-all border shadow-sm text-primary bg-muted/50 border-border hover:bg-muted"
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
        <div className="fixed inset-0 z-[8999] bg-background flex flex-col pt-28 overflow-y-auto animate-in fade-in duration-300">
          <div className="px-6 py-8 space-y-4">
            {/* Mobile search */}
            <form onSubmit={handleSearch} className="mb-8">
              <div className="flex items-center gap-4 px-5 py-5 bg-muted/30 rounded-2xl border border-border focus-within:border-primary transition-all">
                <Search size={20} className="text-primary shrink-0" />
                <input
                  type="text"
                  value={searchQ}
                  onChange={e => setSearchQ(e.target.value)}
                  placeholder={t('nav.search_placeholder')}
                  className="flex-1 bg-transparent text-foreground text-base font-bold tracking-widest outline-none placeholder:text-muted-foreground"
                />
              </div>
            </form>

            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center justify-between px-6 py-6 rounded-2xl text-sm font-bold tracking-[0.2em] transition-all border uppercase ${
                  isActive(link.href)
                    ? 'bg-primary text-white border-primary shadow-xl shadow-primary/20'
                    : 'text-foreground hover:bg-muted border-transparent'
                }`}
              >
                {t(link.labelKey)}
                <ChevronRight size={18} className={isActive(link.href) ? "opacity-100" : "opacity-20"} />
              </Link>
            ))}
          </div>

          {/* Mobile footer */}
          <div className="mt-auto px-8 py-12 border-t border-border bg-muted/30">
            <p className="font-mono text-[10px] text-muted-foreground tracking-[0.4em] mb-4 font-bold uppercase">Emergency Contact</p>
            <a
              href={`tel:${process.env.NEXT_PUBLIC_SUPPORT_PHONE || ''}`}
              className="text-primary font-bold text-2xl font-serif tracking-tighter hover:text-accent transition-colors"
            >
              {process.env.NEXT_PUBLIC_SUPPORT_PHONE || 'CONTACT_SUPPORT'}
            </a>
          </div>
        </div>
      )}
    </>
  );
}
