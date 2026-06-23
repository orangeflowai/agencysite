"use client";

import Link from "next/link";

const footerLinks = {
  tours: [
    { label: "Vatican Tours", href: "/category/vatican" },
    { label: "Colosseum Tours", href: "/category/colosseum" },
    { label: "City Walking Tours", href: "/category/city-tours" },
    { label: "Food & Wine", href: "/category/food-and-wine" },
  ],
  support: [
    { label: "FAQ", href: "/faq" },
    { label: "Contact Us", href: "/contact" },
    { label: "Booking Help", href: "/contact" },
    { label: "Cancellation Policy", href: "/cancellation-policy" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Our Guides", href: "/about" },
    { label: "Press", href: "/contact" },
    { label: "Careers", href: "/contact" },
  ],
};

export function FooterSection() {
  return (
    <footer className="bg-background">
      {/* Main Footer Content */}
      <div className="border-t border-border px-6 py-16 md:px-12 md:py-20 lg:px-20">
        <div className="grid grid-cols-2 gap-12 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 lg:col-span-2">
            <Link href="/" className="text-lg font-bold text-foreground tracking-tighter">
              GOLDEN ROME TOUR
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Official skip-the-line entry to Vatican, Colosseum & Rome attractions. 
              Curated experiences by licensed art historians.
            </p>
            
            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <span className="text-[8px] font-bold">IT</span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">Our Roman Office</p>
                  <p className="text-[8px]">Via Tunisi 43, 00192 Roma</p>
                </div>
              </div>
              <a href="mailto:info@goldenrometour.com" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <span className="text-[8px] font-bold">@</span>
                </div>
                <p className="text-xs font-semibold">{process.env.NEXT_PUBLIC_CONTACT_EMAIL || "info@romeagency.com"}</p>
              </a>
              <a href="tel:+393514199425" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <span className="text-[8px] font-bold">TEL</span>
                </div>
                <p className="text-xs font-semibold">+39 351 419 9425</p>
              </a>
            </div>

            <div className="mt-6 flex items-center gap-4">
              <div className="flex items-center gap-2 text-[8px] font-bold uppercase tracking-widest text-muted-foreground">
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                WhatsApp active
              </div>
            </div>
          </div>

          {/* Tours */}
          <div>
            <h4 className="mb-4 text-sm font-medium text-foreground">Tours</h4>
            <ul className="space-y-3">
              {footerLinks.tours.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="mb-4 text-sm font-medium text-foreground">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="mb-4 text-sm font-medium text-foreground">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border px-6 py-6 md:px-12 lg:px-20">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-xs text-muted-foreground">
            2026 Golden Rome Tour. All rights reserved.
          </p>

          {/* Trust Badges */}
          <div className="flex items-center gap-6 text-xs text-muted-foreground">
            <span>100% Secure Booking</span>
            <span>Official Partner</span>
            <span>Licensed Guides</span>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-6">
            <a
              href="https://instagram.com/goldenrometour"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Instagram
            </a>
            <a
              href="https://facebook.com/goldenrometour"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Facebook
            </a>
            <a
              href="https://www.tripadvisor.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              TripAdvisor
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
