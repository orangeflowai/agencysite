"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, ShoppingCart } from "lucide-react"
import { useSite } from "@/components/SiteProvider"
import Image from "next/image"
import { urlFor } from "@/lib/dataAdapter"

export default function VaticanHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const site = useSite()

  const navLinks = [
    { label: "Vatican Museums", href: "/category/vatican", key: "museums" },
    { label: "Sistine Chapel", href: "/tour/vatican-museums-skip-line-audio-guide-grt", key: "sistine" },
    { label: "St. Peter's", href: "/tour/st-peters-basilica-dome-climb-grt", key: "stpeters" },
    { label: "Vatican Gardens", href: "/tour/vatican-gardens-private-tour-grt", key: "gardens" },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            {site?.logo ? (
              <Image 
                src={urlFor(site.logo).url()} 
                alt={site.title} 
                width={120} 
                height={40} 
                className="h-8 md:h-10 w-auto"
              />
            ) : (
              <>
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-serif text-lg">V</span>
                </div>
                <span className="font-serif text-xl text-foreground hidden sm:block">Vatican Archives</span>
              </>
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.key} 
                href={link.href} 
                className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link 
              href="/contact" 
              className="text-xs font-bold uppercase tracking-widest text-foreground hover:text-muted-foreground transition-all"
            >
              Contact
            </Link>
            <Link 
              href="/#tours" 
              className="px-6 py-2.5 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-widest rounded-full hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
            >
              Book Now
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
             <button 
              className="p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-foreground" />
              ) : (
                <Menu className="w-6 h-6 text-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-6 border-t border-border animate-in fade-in slide-in-from-top-4 duration-300">
            <nav className="flex flex-col gap-5">
              {navLinks.map((link) => (
                <Link 
                  key={link.key} 
                  href={link.href} 
                  className="text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="h-px bg-border my-2" />
              <Link 
                href="/contact" 
                className="text-sm font-bold uppercase tracking-widest text-foreground transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <Link 
                href="/#tours" 
                className="px-6 py-3 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-widest rounded-full text-center hover:opacity-90 transition-opacity"
                onClick={() => setIsMenuOpen(false)}
              >
                Book Now
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
