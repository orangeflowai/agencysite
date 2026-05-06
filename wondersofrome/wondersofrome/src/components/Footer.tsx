'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';
import { useSite } from '@/components/SiteProvider';
import { urlFor } from '@/lib/dataAdapter';
import PaymentLogos from './PaymentLogos';
import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
  const site = useSite();
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  const email  = site?.contactEmail  || process.env.NEXT_PUBLIC_CONTACT_EMAIL  || 'info@wondersofrome.com';
  const phone  = site?.contactPhone  || process.env.NEXT_PUBLIC_SUPPORT_PHONE  || '+39 351 419 9425';
  const wa     = site?.whatsappNumber || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '3514199425';
  const name   = site?.title || 'Wonders of Rome';

  const EXPLORE = [
    { label: t('footer.vatican'),   href: '/category/vatican' },
    { label: t('footer.colosseum'), href: '/category/colosseum' },
    { label: t('footer.city'),      href: '/category/city-tours' },
    { label: t('footer.hidden'),    href: '/category/hidden-gems' },
    { label: t('footer.all_tours'), href: '/search' },
  ];

  const SUPPORT = [
    { label: t('footer.contact_us'),    href: '/contact' },
    { label: t('footer.faq'),           href: '/faq' },
    { label: t('footer.cancellation'),  href: '/cancellation-policy' },
    { label: t('footer.terms'),         href: '/terms-and-conditions' },
    { label: t('footer.privacy'),       href: '/privacy-policy' },
    { label: t('footer.partner'),       href: '/become-a-partner' },
  ];

  return (
    <footer className="bg-card text-foreground border-t border-border">
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
                  className="h-9 w-auto object-contain group-hover:scale-105 transition-transform"
                />
              ) : (
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-sm bg-primary flex items-center justify-center shadow-lg">
                    <span className="text-white font-mono font-bold text-sm">W</span>
                  </div>
                  <span className="font-serif font-bold text-xl tracking-tighter ">{name}</span>
                </div>
              )}
            </Link>

            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              {t('footer.about')}
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
                  className="w-10 h-10 rounded-sm bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-all shadow-sm"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <p className="text-[10px] font-bold tracking-[0.3em] text-primary mb-6">{t('footer.explore')}</p>
            <ul className="space-y-4">
              {EXPLORE.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors font-mono  tracking-tight"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <p className="text-[10px] font-bold tracking-[0.3em] text-primary mb-6">{t('footer.support')}</p>
            <ul className="space-y-4">
              {SUPPORT.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors font-mono  tracking-tight"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-[10px] font-bold tracking-[0.3em] text-primary mb-6">{t('footer.contact')}</p>
            <ul className="space-y-5">
              <li>
                <a href={`mailto:${email}`} className="flex items-start gap-3 group">
                  <Mail size={16} className="text-primary mt-0.5 shrink-0" />
                  <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors font-mono">{email}</span>
                </a>
              </li>
              <li>
                <a href={`tel:${phone.replace(/\s/g, '')}`} className="flex items-center gap-3 group">
                  <Phone size={16} className="text-primary shrink-0" />
                  <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors font-mono">{phone}</span>
                </a>
              </li>
              <li>
                <div className="flex items-center gap-3">
                  <MapPin size={16} className="text-primary shrink-0" />
                  <span className="text-sm text-muted-foreground font-mono">{t('footer.address')}</span>
                </div>
              </li>
            </ul>

            {/* Payment logos */}
            <div className="mt-8 pt-8 border-t border-border">
              <p className="font-mono text-[10px]  tracking-widest text-muted-foreground mb-4 font-bold">Secure Transfer</p>
              <div className="opacity-90 hover:grayscale hover:opacity-100 transition-all">
                <PaymentLogos size="sm" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-[10px] text-muted-foreground font-mono tracking-widest font-bold">
            © {year} {name} — {t('footer.rights')}
          </p>
          {site?.businessInfo?.vatNumber && (
            <p className="text-[10px] text-muted-foreground font-mono ">
              REG: {site.businessInfo.vatNumber}
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}
