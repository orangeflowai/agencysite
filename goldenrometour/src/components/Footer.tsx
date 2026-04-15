'use client';

import Link from 'next/link';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import Newsletter from './Newsletter';
import { useLanguage } from '@/context/LanguageContext';
import { useSite } from '@/components/SiteProvider';
import Image from 'next/image';
import { SUPABASE_BUCKET_URL } from '@/lib/constants';
import PaymentLogos from './PaymentLogos';

// Category mapping with icons and descriptions
const categoryLinks = [
    {
        id: 'colosseum',
        href: '/category/colosseum',
        translationKey: 'footer.colosseum'
    },
    {
        id: 'vatican',
        href: '/category/vatican',
        translationKey: 'footer.vatican'
    },
    {
        id: 'city',
        href: '/category/city',
        translationKey: 'footer.city'
    },
    {
        id: 'hidden-gems',
        href: '/category/hidden-gems',
        translationKey: 'footer.hidden'
    },
];

const supportLinks = [
    { href: '/contact', translationKey: 'footer.contact_us' },
    { href: '/faq', translationKey: 'footer.faq' },
    { href: '/terms-and-conditions', translationKey: 'footer.terms' },
    { href: '/privacy-policy', translationKey: 'footer.privacy' },
    { href: '/cancellation-policy', translationKey: 'footer.cancellation' },
    { href: '/disclaimer', translationKey: 'footer.disclaimer' },
];

export default function Footer() {
    const { t } = useLanguage();
    const site = useSite();
    const currentYear = new Date().getFullYear();

    // Get site settings with fallbacks
    const companyName = site?.businessInfo?.companyName || site?.title || 'Rome Editorial Series';
    const vatNumber = site?.businessInfo?.vatNumber || '';
    const reaNumber = site?.businessInfo?.reaNumber || '';
    const registeredAddress = site?.businessInfo?.registeredAddress || '';
    const shareCapital = site?.businessInfo?.shareCapital;

    // Contact info
    const contactEmail = site?.contactEmail || 'desk@rome-editorial.com';
    const contactPhone = site?.contactPhone || '';
    const officeAddress = site?.officeAddress || 'Piazza del Popolo, Rome';

    return (
        <footer className="bg-forest-black text-cream selection:bg-forest selection:text-cream">
            <Newsletter />

            {/* Main Footer */}
            <div className="border-t border-forest/10 pt-24 pb-16">
                <div className="container mx-auto px-8 md:px-16 text-left">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-12 mb-24">

                        {/* Brand Column */}
                        <div className="space-y-8">
                            <Link href="/" className="inline-block">
                                {site?.logo ? (
                                    <img src={site.logo.asset.url} alt={site.title || 'Golden Rome Tour'} className="h-10 w-auto object-contain" />
                                ) : (
                                    <div className="flex flex-col items-start justify-center">
                                        <span className="font-serif text-3xl font-bold tracking-tighter leading-none text-cream">
                                            GOLDEN <span className="italic text-[#C9A84C]">ROME TOUR</span>
                                        </span>
                                        <span className="font-sans text-[#C9A84C]/60 text-[8px] uppercase font-black tracking-[0.4em] mt-2">
                                            Editorial Series
                                        </span>
                                    </div>
                                )}
                            </Link>
                            <p className="text-forest/40 text-xs leading-relaxed max-w-xs font-sans uppercase tracking-widest">
                                A documentary approach to the eternal city. High-impact experiences Curated for the discerning traveler.
                            </p>

                            {/* Social Links - Editorial Style */}
                            <div className="flex items-center space-x-4">
                                <Link href="/" className="w-10 h-10 rounded-full bg-cream/5 border border-gold/20 flex items-center justify-center text-gold/40 hover:text-gold hover:border-gold transition-all duration-500 backdrop-blur-md">
                                    <Facebook size={16} />
                                </Link>
                                <Link href="/" className="w-10 h-10 rounded-full bg-cream/5 border border-gold/20 flex items-center justify-center text-gold/40 hover:text-gold hover:border-gold transition-all duration-500 backdrop-blur-md">
                                    <Instagram size={16} />
                                </Link>
                                <Link href="/" className="w-10 h-10 rounded-full bg-cream/5 border border-gold/20 flex items-center justify-center text-gold/40 hover:text-gold hover:border-gold transition-all duration-500 backdrop-blur-md">
                                    <Twitter size={16} />
                                </Link>
                            </div>
                        </div>

                        {/* Explore Categories */}
                        <div>
                            <h4 className="font-serif text-xl font-bold italic text-forest mb-8 border-b border-forest/10 pb-4">
                                Exploration
                            </h4>
                            <ul className="space-y-4 text-sm font-sans tracking-tight text-cream/60">
                                {categoryLinks.map((category) => (
                                    <li key={category.id}>
                                        <Link href={category.href} className="hover:text-cream transition-colors flex items-center group">
                                            <span className="w-0 group-hover:w-4 h-px bg-forest mr-0 group-hover:mr-2 transition-all" />
                                            {t(category.translationKey)}
                                        </Link>
                                    </li>
                                ))}
                                <li>
                                    <Link href="/blog" className="hover:text-cream transition-colors flex items-center group italic font-serif">
                                        <span className="w-0 group-hover:w-4 h-px bg-forest mr-0 group-hover:mr-2 transition-all" />
                                        The Dispatch
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Support Links */}
                        <div>
                            <h4 className="font-serif text-xl font-bold italic text-forest mb-8 border-b border-forest/10 pb-4">
                                Documentation
                            </h4>
                            <ul className="space-y-4 text-sm font-sans tracking-tight text-cream/60">
                                {supportLinks.map((link) => (
                                    <li key={link.href}>
                                        <Link href={link.href} className="hover:text-cream transition-colors">
                                            {t(link.translationKey)}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Contact Info */}
                        <div>
                            <h4 className="font-serif text-xl font-bold italic text-forest mb-8 border-b border-forest/10 pb-4">
                                Correspondence
                            </h4>
                            <ul className="space-y-6 text-sm text-cream/40 mb-12">
                                <li className="flex items-start space-x-4">
                                    <MapPin size={18} className="text-forest mt-0.5 shrink-0" />
                                    <span>{officeAddress}</span>
                                </li>
                                <li className="flex items-center space-x-4">
                                    <Phone size={18} className="text-forest shrink-0" />
                                    <span>{contactPhone || '+39 06 123 4567'}</span>
                                </li>
                                <li className="flex items-center space-x-4">
                                    <Mail size={18} className="text-forest shrink-0" />
                                    <a href={`mailto:${contactEmail}`} className="hover:text-forest transition-colors">
                                        {contactEmail}
                                    </a>
                                </li>
                            </ul>

                            {/* Trust Badges */}
                            <div className="flex items-center gap-4 pt-4 border-t border-forest/10">
                                <img src={`${SUPABASE_BUCKET_URL}/tripAdvisor.png`} alt="TripAdvisor" className="h-6 w-auto opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all" />
                            </div>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="border-t border-white/5 pt-12 flex flex-col md:flex-row items-center justify-between gap-8 text-[10px] text-cream/30 uppercase font-black tracking-widest">
                        <p>&copy; {currentYear} {site?.title || 'Golden Rome Tour'}. All rights reserved.</p>

                        {/* Company Details */}
                        <div className="text-center md:text-right flex flex-col md:items-end gap-1">
                            <span className="font-medium text-cream/50">{companyName}</span>
                            <span>
                                {vatNumber && `P.IVA: ${vatNumber}`}
                                {reaNumber && vatNumber && ' • '}
                                {reaNumber && `REA: ${reaNumber}`}
                            </span>
                            <span>{registeredAddress}</span>
                            {shareCapital && <span>{shareCapital}</span>}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
