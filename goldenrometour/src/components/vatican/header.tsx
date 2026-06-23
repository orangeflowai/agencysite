"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, ChevronDown, Star, Shield, Clock } from "lucide-react"
import { useSite } from "@/components/SiteProvider"
import Image from "next/image"
import { urlFor } from "@/lib/dataAdapter"
import clsx from "clsx"

const tours = [
  {
    label: "Vatican Guided Tour",
    href: "/tour/vatican-museums-and-sistine-chapel-guided-tour",
    badge: "Best Seller",
    price: "€65",
    duration: "3 hours",
    desc: "Expert art historian guide, skip-the-line",
  },
  {
    label: "Skip-the-Line Tickets",
    href: "/tour/vatican-museums-sistine-chapel-skip-the-line",
    badge: "Popular",
    price: "€45",
    duration: "Flexible",
    desc: "Self-guided, priority entry ticket",
  },
]

const navLinks = [
  { label: "Tours", href: "/#tours", dropdown: tours },
  { label: "About", href: "/about" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
]

export default function VaticanHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const site = useSite()
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    setIsMenuOpen(false)
    setOpenDropdown(null)
  }, [pathname])

  // Lock scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [isMenuOpen])

  const scrolled = isScrolled || isMenuOpen

  return (
    <>
      {/* Top trust bar */}
      <div className={clsx(
        "fixed top-0 left-0 right-0 z-[60] border-b transition-all duration-300",
        scrolled ? "bg-background border-border" : "bg-black/40 backdrop-blur-sm border-white/10"
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-6 md:gap-10 h-9 overflow-hidden">
            {[
              { icon: Shield, text: "Official Vatican Partner" },
              { icon: Star, text: "4.9 · 3,000+ Reviews" },
              { icon: Clock, text: "Free Cancellation 24h Before" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-1.5 shrink-0">
                <Icon className={clsx("w-3 h-3", scrolled ? "text-accent" : "text-accent")} />
                <span className={clsx(
                  "text-[10px] font-bold uppercase tracking-widest hidden sm:block",
                  scrolled ? "text-muted-foreground" : "text-white/70"
                )}>
                  {text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main header */}
      <header
        style={{ top: "36px" }}
        className={clsx(
          "fixed left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-background/97 backdrop-blur-xl border-b border-border shadow-sm py-3"
            : "bg-transparent py-4 md:py-5"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-8">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
              {site?.logo ? (
                <Image
                  src={urlFor(site.logo).url()}
                  alt={site.title || "Golden Rome Tour"}
                  width={130}
                  height={44}
                  className="h-9 md:h-10 w-auto transition-opacity group-hover:opacity-80"
                  priority
                />
              ) : (
                <div className="flex items-center gap-2.5">
                  <div className={clsx(
                    "w-9 h-9 rounded-full flex items-center justify-center transition-all group-hover:scale-105",
                    scrolled ? "bg-accent" : "bg-accent/90 shadow-lg shadow-accent/30"
                  )}>
                    <span className="text-accent-foreground font-serif text-base font-bold">G</span>
                  </div>
                  <div className="flex flex-col leading-none">
                    <span className={clsx(
                      "font-serif text-lg font-semibold tracking-tight transition-colors",
                      scrolled ? "text-foreground" : "text-white"
                    )}>
                      Golden Rome
                    </span>
                    <span className={clsx(
                      "text-[9px] font-bold uppercase tracking-[0.25em] transition-colors",
                      scrolled ? "text-accent" : "text-accent/80"
                    )}>
                      Vatican Tours
                    </span>
                  </div>
                </div>
              )}
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
              {navLinks.map((link) =>
                link.dropdown ? (
                  <div
                    key={link.label}
                    className="relative"
                    onMouseEnter={() => setOpenDropdown(link.label)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <button
                      className={clsx(
                        "flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-200",
                        openDropdown === link.label
                          ? scrolled ? "bg-accent/10 text-accent" : "bg-white/15 text-white"
                          : scrolled
                          ? "text-muted-foreground hover:text-foreground hover:bg-muted"
                          : "text-white/80 hover:text-white hover:bg-white/10"
                      )}
                    >
                      {link.label}
                      <ChevronDown className={clsx(
                        "w-3 h-3 transition-transform duration-200",
                        openDropdown === link.label && "rotate-180"
                      )} />
                    </button>

                    {/* Mega dropdown */}
                    <div className={clsx(
                      "absolute top-full left-1/2 -translate-x-1/2 pt-2 w-[480px] transition-all duration-200",
                      openDropdown === link.label
                        ? "opacity-100 translate-y-0 pointer-events-auto"
                        : "opacity-0 -translate-y-1 pointer-events-none"
                    )}>
                      <div className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
                        {/* Header */}
                        <div className="px-5 py-3 bg-muted border-b border-border">
                          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
                            Official Vatican Access
                          </p>
                        </div>
                        {/* Tour items */}
                        <div className="p-2">
                          {link.dropdown!.map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              className="flex items-start gap-4 p-3.5 rounded-xl hover:bg-muted transition-colors group/item"
                            >
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-sm font-semibold text-foreground group-hover/item:text-accent transition-colors leading-snug">
                                    {item.label}
                                  </span>
                                  <span className="text-[9px] font-bold bg-accent/15 text-accent px-2 py-0.5 rounded-full shrink-0 uppercase tracking-wide">
                                    {item.badge}
                                  </span>
                                </div>
                                <p className="text-xs text-muted-foreground">{item.desc}</p>
                              </div>
                              <div className="text-right shrink-0">
                                <div className="text-sm font-bold text-foreground">{item.price}</div>
                                <div className="text-[10px] text-muted-foreground">{item.duration}</div>
                              </div>
                            </Link>
                          ))}
                        </div>
                        {/* Footer link */}
                        <div className="border-t border-border px-5 py-3 flex items-center justify-between bg-muted/50">
                          <span className="text-xs text-muted-foreground">2 Vatican experiences available</span>
                          <Link
                            href="/#tours"
                            className="text-xs font-bold text-accent hover:text-accent/80 transition-colors uppercase tracking-widest"
                          >
                            View All →
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    key={link.href!}
                    href={link.href!}
                    className={clsx(
                      "px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-200",
                      pathname === link.href
                        ? "text-accent bg-accent/10"
                        : scrolled
                        ? "text-muted-foreground hover:text-foreground hover:bg-muted"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                    )}
                  >
                    {link.label}
                  </Link>
                )
              )}
            </nav>

            {/* Desktop CTAs */}
            <div className="hidden lg:flex items-center gap-3 shrink-0">
              <a
                href={`tel:${process.env.NEXT_PUBLIC_SUPPORT_PHONE || ""}`}
                className={clsx(
                  "text-xs font-bold transition-colors",
                  scrolled ? "text-muted-foreground hover:text-foreground" : "text-white/70 hover:text-white"
                )}
              >
                {process.env.NEXT_PUBLIC_SUPPORT_PHONE || ""}
              </a>
              <Link
                href="/#tours"
                className="px-6 py-2.5 bg-accent text-accent-foreground text-xs font-bold uppercase tracking-widest rounded-full hover:bg-accent/90 transition-all shadow-lg shadow-accent/20 active:scale-95"
              >
                Book Now
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className={clsx(
                "flex items-center justify-center w-10 h-10 rounded-full border transition-all lg:hidden",
                scrolled
                  ? "border-border text-foreground hover:bg-muted"
                  : "border-white/30 text-white hover:bg-white/10"
              )}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu — full-screen overlay */}
      <div
        className={clsx(
          "fixed inset-0 z-[55] bg-background/98 backdrop-blur-xl lg:hidden flex flex-col transition-all duration-300",
          isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        style={{ top: "calc(36px + 52px)" }}
      >
        {/* Tour cards */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-6 pt-8 pb-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground mb-4">
              Our Vatican Experiences
            </p>
            <div className="space-y-3">
              {tours.map((tour) => (
                <Link
                  key={tour.href}
                  href={tour.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-between p-4 bg-card rounded-2xl border border-border hover:border-accent/40 hover:shadow-md transition-all group"
                >
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-foreground group-hover:text-accent transition-colors leading-snug">
                        {tour.label}
                      </span>
                      <span className="text-[9px] font-bold bg-accent/15 text-accent px-2 py-0.5 rounded-full shrink-0 uppercase">
                        {tour.badge}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{tour.desc}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-base font-bold text-accent">{tour.price}</div>
                    <div className="text-[10px] text-muted-foreground">{tour.duration}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Other links */}
          <div className="px-6 py-4 border-t border-border">
            {navLinks
              .filter((l) => !l.dropdown)
              .map((link) => (
                <Link
                  key={link.href}
                  href={link.href!}
                  onClick={() => setIsMenuOpen(false)}
                  className={clsx(
                    "block py-3 text-sm font-bold uppercase tracking-widest transition-colors border-b border-border/50 last:border-0",
                    pathname === link.href ? "text-accent" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {link.label}
                </Link>
              ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="px-6 py-6 border-t border-border bg-background">
          <Link
            href="/#tours"
            onClick={() => setIsMenuOpen(false)}
            className="block w-full text-center py-4 bg-accent text-accent-foreground text-sm font-bold uppercase tracking-widest rounded-2xl hover:bg-accent/90 transition-all shadow-lg shadow-accent/20 active:scale-98"
          >
            Book Your Vatican Tour →
          </Link>
          <div className="flex items-center justify-center gap-6 mt-4">
            {[
              { icon: Shield, text: "Free Cancellation" },
              { icon: Star, text: "4.9 Rating" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-1.5">
                <Icon className="w-3.5 h-3.5 text-accent" />
                <span className="text-xs text-muted-foreground font-medium">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
