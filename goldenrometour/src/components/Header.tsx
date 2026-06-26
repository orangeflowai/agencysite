'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import clsx from 'clsx';
import Button from '@/components/ui/Button';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Guided Tour', href: '/tour/vatican-museums-and-sistine-chapel-guided-tour' },
  { name: 'Skip-the-Line', href: '/tour/vatican-museums-sistine-chapel-skip-the-line' },
  { name: 'FAQ', href: '/faq' },
  { name: 'Contact', href: '/contact' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={clsx(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-background/95 backdrop-blur-md border-b border-border shadow-sm py-3'
            : 'bg-transparent py-4 md:py-5'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="shrink-0 flex items-center gap-3">
              <img
                src="/logo.svg"
                alt="Golden Rome Tour"
                className="h-8 md:h-10 w-auto"
              />
              <span className={clsx(
                'font-heading text-xl md:text-2xl font-bold tracking-tight transition-colors hidden sm:block',
                scrolled ? 'text-foreground' : 'text-white'
              )}>
                Golden Rome<span className="text-accent"> Tour</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={clsx(
                    'text-sm font-medium transition-colors hover:text-primary',
                    pathname === link.href ? 'text-primary font-semibold' : scrolled ? 'text-foreground' : 'text-white/90'
                  )}
                >
                  {link.name}
                </Link>
              ))}
              <Link href="/#tours">
                <Button variant="primary" size="sm">Book Now</Button>
              </Link>
            </nav>

            {/* Mobile Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={clsx('md:hidden p-2 rounded-lg', scrolled ? 'text-foreground' : 'text-white')}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-background flex flex-col pt-20 md:hidden">
          <nav className="flex-1 flex flex-col items-center justify-center gap-8 px-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  'text-2xl font-heading font-bold transition-colors',
                  pathname === link.href ? 'text-primary' : 'text-foreground'
                )}
              >
                {link.name}
              </Link>
            ))}
            <Link href="/#tours" className="mt-4">
              <Button variant="primary" size="lg">Book Now</Button>
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}
