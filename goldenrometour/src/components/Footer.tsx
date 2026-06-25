import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';

const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'info@goldenrometour.com';
const contactPhone = process.env.NEXT_PUBLIC_SUPPORT_PHONE || '+39 351 419 9425';
const address = 'Via Germanico, 40, 00192 Roma, RM, Italy';

const tourLinks = [
  { name: 'Guided Vatican Tour', href: '/tour/vatican-museums-and-sistine-chapel-guided-tour' },
  { name: 'Skip-the-Line Ticket', href: '/tour/vatican-museums-sistine-chapel-skip-the-line' },
];

const pageLinks = [
  { name: 'FAQ', href: '/faq' },
  { name: 'Contact', href: '/contact' },
];

const legalLinks = [
  { name: 'Terms & Conditions', href: '/terms-and-conditions' },
  { name: 'Privacy Policy', href: '/privacy-policy' },
  { name: 'Cancellation Policy', href: '/cancellation-policy' },
  { name: 'Disclaimer', href: '/disclaimer' },
];

export default function Footer() {
  return (
    <footer className="bg-foreground text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="font-heading text-2xl font-bold tracking-tight">
              Golden Rome<span className="text-accent"> Tour</span>
            </Link>
            <p className="mt-4 text-white/60 text-sm leading-relaxed">
              Official Vatican Museum partner. Skip-the-line access with accredited art historian guides.
            </p>
          </div>

          {/* Tours */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-white/50">Tours</h4>
            <ul className="space-y-3">
              {tourLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-white/75 hover:text-accent transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Pages */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-white/50">Support</h4>
            <ul className="space-y-3">
              {pageLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-white/75 hover:text-accent transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
              <li className="flex items-start gap-2 pt-2">
                <Mail className="w-4 h-4 text-white/40 shrink-0 mt-0.5" />
                <a href={`mailto:${contactEmail}`} className="text-white/75 hover:text-accent transition-colors text-sm break-all">
                  {contactEmail}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-white/40 shrink-0 mt-0.5" />
                <a href={`tel:${contactPhone}`} className="text-white/75 hover:text-accent transition-colors text-sm">
                  {contactPhone}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-white/40 shrink-0 mt-0.5" />
                <span className="text-white/60 text-sm">{address}</span>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-white/50">Legal</h4>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-white/60 hover:text-accent transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-xs">
            &copy; {new Date().getFullYear()} Golden Rome Tour. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-white/40 text-xs">
            <span>Secure Booking</span>
            <span>&middot;</span>
            <span>Licensed Guides</span>
            <span>&middot;</span>
            <span>Official Partner</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
