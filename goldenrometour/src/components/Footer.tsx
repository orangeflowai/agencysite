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
  { label: 'The Dispatch (Blog)', href: '/blog' },
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

  const email  = site?.contactEmail  || 'info@goldenrometours.com';
  const phone  = site?.contactPhone  || '+39 389 521 7315';
  const name   = site?.title || 'Golden Rome Tour';
  const address = site?.officeAddress || 'Via Germanico, 28, Rome, Italy';

  return (
    <footer className="bg-background text-black border-t border-primary/10 selection:bg-primary selection:text-white font-body">
      <Newsletter />
      
      {/* Main grid */}
      <div className="max-w-7xl mx-auto px-6 py-24">
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
                  className="h-10 w-auto object-contain transition-transform group-hover:scale-105"
                  priority
                />
              ) : (
                <div className="flex flex-col items-start justify-center transition-transform group-hover:scale-105 duration-300">
                    <span className="font-heading text-3xl font-bold tracking-tighter leading-none italic uppercase">
                        Vaticano <span className="text-primary not-italic">+</span>
                    </span>
                    <span className="font-heading text-primary/60 text-[7px] font-bold tracking-tight mt-1 uppercase">
                        Sacred Luxury Editorial
                    </span>
                </div>
              )}
            </Link>

            <p className="text-black/50 text-xs leading-relaxed max-w-xs uppercase tracking-tight">
              ARCHIVAL CONCIERGE SERVICES FOR THE DISCERNING TRAVELER. CURATING THE RARE, THE HISTORICAL, AND THE GENUINELY SACRED WITHIN THE ETERNAL CITY.
            </p>

            {/* Social */}
            <div className="flex items-center gap-3">
              {[
                { href: site?.socialLinks?.instagram || 'https://instagram.com/goldenrometours', Icon: Instagram, label: 'Instagram' },
                { href: site?.socialLinks?.facebook  || 'https://facebook.com/goldenrometours',  Icon: Facebook,  label: 'Facebook' },
                { href: site?.socialLinks?.twitter   || 'https://twitter.com/goldenrometours',   Icon: Twitter,   label: 'Twitter' },
              ].map(({ href, Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 rounded-full border border-primary/20 flex items-center justify-center text-primary/40 hover:text-primary hover:border-primary transition-all duration-500 shadow-sm"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <p className="text-[10px] font-heading font-bold tracking-tight text-primary mb-8 uppercase">Exploration</p>
            <ul className="space-y-4">
              {EXPLORE.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-xs text-black/60 hover:text-primary transition-colors font-heading font-bold tracking-tight uppercase"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <p className="text-[10px] font-heading font-bold tracking-tight text-primary mb-8 uppercase">Documentation</p>
            <ul className="space-y-4">
              {SUPPORT.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-xs text-black/60 hover:text-primary transition-colors font-heading font-bold tracking-tight uppercase"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-[10px] font-heading font-bold tracking-tight text-primary mb-8 uppercase">Correspondence</p>
            <ul className="space-y-6">
              <li>
                <a href={`mailto:${email}`} className="flex items-start gap-4 group">
                  <Mail size={18} className="text-primary mt-0.5 shrink-0" />
                  <span className="text-xs text-black/60 group-hover:text-primary transition-colors font-body uppercase tracking-tight">{email}</span>
                </a>
              </li>
              <li>
                <a href={`tel:${phone.replace(/\s/g, '')}`} className="flex items-center gap-4 group">
                  <Phone size={18} className="text-primary shrink-0" />
                  <span className="text-xs text-black/60 group-hover:text-primary transition-colors font-body uppercase tracking-tight">{phone}</span>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-4">
                  <MapPin size={18} className="text-primary mt-0.5 shrink-0" />
                  <span className="text-xs text-black/60 font-body uppercase tracking-tight">{address}</span>
                </div>
              </li>
            </ul>

            {/* Payment logos */}
            <div className="mt-12 pt-8 border-t border-primary/10">
              <p className="font-heading text-[9px] tracking-tight text-primary/40 mb-4 font-bold uppercase">Secure Transfer Protocol</p>
              <div className="opacity-80 hover:opacity-100 transition-all grayscale hover:grayscale-0">
                <PaymentLogos size="sm" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-primary/10 bg-background/50">
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-[10px] text-black/30 font-heading font-bold tracking-tight uppercase">
            © {year} {name} // ARCHIVAL CONCIERGE STATUS: NOMINAL
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            {site?.businessInfo?.vatNumber && (
                <span className="text-[10px] text-black/30 font-heading font-bold tracking-tight uppercase">
                    P.IVA: {site.businessInfo.vatNumber}
                </span>
            )}
             <span className="text-[10px] text-black/20 font-heading font-bold tracking-tight uppercase">
                System Version 1.0.4-GRT
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
