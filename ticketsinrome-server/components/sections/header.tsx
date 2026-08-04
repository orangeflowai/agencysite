"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { label: 'Tours', href: '/tours' },
  { label: 'Vatican', href: '/category/vatican' },
  { label: 'Colosseum', href: '/category/colosseum' },
  { label: 'About', href: '/about' },
];

// Pages with a full-bleed dark hero where transparent navbar looks good at the top
const HERO_PAGES = ['/'];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // Does the current page have a dark hero behind the navbar?
  const hasHero = HERO_PAGES.includes(pathname);
  // Always use solid background on non-hero pages or once scrolled
  const useSolid = !hasHero || isScrolled;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    // Set initial state in case page loads already scrolled
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <header
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-3xl transition-all duration-300 ${
        useSolid
          ? "bg-background/95 backdrop-blur-md rounded-full shadow-md border border-border"
          : "bg-transparent"
      }`}
    >
      <div className="flex items-center justify-between transition-all duration-300 px-2 pl-5 py-2">
        {/* Logo */}
        <Link
          href="/"
          className={`text-lg font-medium tracking-tight transition-colors duration-300 ${
            useSolid ? "text-foreground" : "text-white"
          }`}
        >
          TICKETS IN ROME
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-10 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm transition-colors ${
                isActive(link.href)
                  ? useSolid ? "text-foreground font-semibold" : "text-white font-semibold"
                  : useSolid ? "text-muted-foreground hover:text-foreground" : "text-white/70 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden items-center gap-6 md:flex">
          <Link
            href="/tours"
            className={`px-4 py-2 text-sm font-medium transition-all rounded-full ${
              useSolid
                ? "bg-foreground text-background hover:opacity-80"
                : "bg-white text-foreground hover:bg-white/90"
            }`}
          >
            Book Now
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`transition-colors md:hidden ${useSolid ? "text-foreground" : "text-white"}`}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="border-t border-border bg-background px-6 py-8 md:hidden rounded-b-2xl">
          <nav className="flex flex-col gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-lg ${isActive(link.href) ? "text-foreground font-semibold" : "text-foreground"}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/tours"
              className="mt-4 bg-foreground px-5 py-3 text-center text-sm font-medium text-background rounded-full"
              onClick={() => setIsMenuOpen(false)}
            >
              Book Now
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
