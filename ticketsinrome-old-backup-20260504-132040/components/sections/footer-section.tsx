"use client";

import Link from "next/link";

const footerLinks = {
  tours: [
    { label: "Vatican Tours", href: "#vatican" },
    { label: "Colosseum Tours", href: "#colosseum" },
    { label: "City Walking Tours", href: "#tours" },
    { label: "Food & Wine", href: "#tours" },
  ],
  support: [
    { label: "FAQ", href: "#" },
    { label: "Contact Us", href: "#" },
    { label: "Booking Help", href: "#" },
    { label: "Cancellation Policy", href: "#" },
  ],
  company: [
    { label: "About Us", href: "#about" },
    { label: "Our Guides", href: "#" },
    { label: "Press", href: "#" },
    { label: "Careers", href: "#" },
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
            <Link href="/" className="text-lg font-medium text-foreground">
              TICKETS IN ROME
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Official skip-the-line entry to Vatican, Colosseum & Rome attractions. 
              Curated experiences by licensed art historians.
            </p>
            <div className="mt-6 flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                Usually replies in minutes
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
            2026 Tickets In Rome. All rights reserved.
          </p>

          {/* Trust Badges */}
          <div className="flex items-center gap-6 text-xs text-muted-foreground">
            <span>100% Secure Booking</span>
            <span>Official Partner</span>
            <span>Licensed Guides</span>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <Link
              href="#"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Instagram
            </Link>
            <Link
              href="#"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Facebook
            </Link>
            <Link
              href="#"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              TripAdvisor
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
