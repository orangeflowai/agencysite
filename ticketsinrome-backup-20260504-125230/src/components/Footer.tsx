'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';
import { useSite } from '@/components/SiteProvider';
import { urlFor } from '@/lib/dataAdapter';
import PaymentLogos from './PaymentLogos';
import Newsletter from './Newsletter';

const EXPLORE = [
  { label: 'Vatican Tours',     href: '/category/vatican' },
  { label: 'Colosseum Tours',   href: '/category/colosseum' },
  { label: 'City Tours',        href: '/category/city' },
  { label: 'Hidden Gems',       href: '/category/hidden-gems' },
  { label: 'Private Tours',     href: '/private-tours' },
  { label: 'All Tours',         href: '/search' },
];

const SUPPORT = [
  { label: 'Contact Us',          href: '/contact' },
  { label: 'FAQ',                  href: '/faq' },
  { label: 'Cancellation Policy', href: '/cancellation-policy' },
  { label: 'Terms & Conditions',  href: '/terms-and-conditions' },
  { label: 'Privacy Policy',      href: '/privacy-policy' },
  { label: 'Become a Partner',    href: '/become-a-partner' },
];

export default function Footer() {
  const site = useSite();
  const year = new Date().getFullYear();

  const email  = site?.contactEmail  || process.env.NEXT_PUBLIC_CONTACT_EMAIL  || 'info@ticketsinrome.com';
  const phone  = site?.contactPhone  || process.env.NEXT_PUBLIC_SUPPORT_PHONE  || '+39 351 786 9798';
  const name   = site?.title || 'Tickets in Rome';

  return (
    <footer className="bg-background text-foreground border-t border-border font-sans selection:bg-primary selection:text-white">
      <Newsletter />
      
      {/* Main grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">

          {/* Brand */}
          <div className="lg:col-span-1 space-y-8">
            <Link href="/" className="inline-block group">
              {site?.logo ? (
                <Image
                  src={urlFor(site.logo).url()}
                  alt={name}
                  width={140}
                  height={40}
                  className="h-9 w-auto object-contain transition-transform group-hover:scale-105"
                />
              ) : (
                <h3 className="text-3xl font-serif font-bold text-primary tracking-tighter  leading-none ">
                   TICKETS<span className="text-foreground opacity-30">IN</span>ROME
                </h3>
              )}
            </Link>

            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs font-bold  tracking-tight">
              OFFICIAL PARTNER: ROM-998-A. PRE-BOOKED VOUCHERS, INSTANT VALIDATION, AND ENCRYPTED TRANSACTION PROTOCOLS.
            </p>

            {/* Social */}
            <div className="flex items-center gap-3">
              {[
                { href: site?.socialLinks?.instagram || 'https://instagram.com', Icon: Instagram, label: 'Instagram' },
                { href: site?.socialLinks?.facebook  || 'https://facebook.com',  Icon: Facebook,  label: 'Facebook' },
                { href: site?.socialLinks?.twitter   || 'https://twitter.com',   Icon: Twitter,   label: 'Twitter' },
              ].map(({ href, Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 rounded-2xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 active:scale-90 shadow-sm"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <p className="text-[10px] font-bold  tracking-[0.4em] text-primary mb-6">Access Nodes</p>
            <ul className="space-y-4">
              {EXPLORE.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors font-bold  tracking-tight"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <p className="text-[10px] font-bold  tracking-[0.4em] text-primary mb-6">Documentation</p>
            <ul className="space-y-4">
              {SUPPORT.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors font-bold  tracking-tight"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-[10px] font-bold  tracking-[0.4em] text-primary mb-6">Support Uplink</p>
            <ul className="space-y-5">
              <li>
                <a href={`mailto:${email}`} className="flex items-start gap-3 group">
                  <Mail size={18} className="text-primary mt-0.5 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors font-bold ">{email}</span>
                </a>
              </li>
              <li>
                <a href={`tel:${phone.replace(/\s/g, '')}`} className="flex items-center gap-3 group">
                  <Phone size={18} className="text-primary shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors font-bold ">{phone}</span>
                </a>
              </li>
              <li>
                <div className="flex items-center gap-3">
                  <MapPin size={18} className="text-primary shrink-0 transition-transform" />
                  <span className="text-sm text-muted-foreground font-bold ">ROME, ITALY</span>
                </div>
              </li>
            </ul>

            {/* Payment logos */}
            <div className="mt-8 pt-8 border-t border-border">
                <p className="text-[10px] font-bold text-muted-foreground mb-4  tracking-[0.2em]">Secure Transfer</p>
                <div className="opacity-90 hover:grayscale hover:opacity-100 transition-all">
                    <PaymentLogos size="sm" />
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-[10px] text-muted-foreground font-bold  tracking-[0.3em]">
            © {year} {name} // TRANSMISSION_NOMINAL
          </p>
          <div className="opacity-50 hover:opacity-100 transition-all duration-500">
             <img src="/tripAdvisor.png" alt="TripAdvisor" className="h-6 w-auto" />
          </div>
        </div>
      </div>
    </footer>
  );
}
