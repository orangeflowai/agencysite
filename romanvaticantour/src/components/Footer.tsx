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
    const { t, language } = useLanguage();
    const site = useSite();
    const currentYear = new Date().getFullYear();

    // Get site settings with fallbacks
    const siteTitle = site?.title || '${process.env.NEXT_PUBLIC_SITE_NAME || "Your Agency"}';
    const logoText = site?.logoText || 'Wonders of';
    const logoTextAccent = site?.logoTextAccent || 'Rome';
    const logo = site?.logo?.asset?.url;

    // Business info — only show if set in Sanity, never show placeholder data
    const businessInfo = site?.businessInfo;
    const companyName = businessInfo?.companyName || site?.title || '${process.env.NEXT_PUBLIC_SITE_NAME || "Your Agency"}';
    const vatNumber = businessInfo?.vatNumber || '';
    const reaNumber = businessInfo?.reaNumber || '';
    const registeredAddress = businessInfo?.registeredAddress || '';
    const shareCapital = businessInfo?.shareCapital;

    // Contact info
    const contactEmail = site?.contactEmail || '${process.env.NEXT_PUBLIC_CONTACT_EMAIL || "info@yourdomain.com"}';
    const contactPhone = site?.contactPhone || '${process.env.NEXT_PUBLIC_SUPPORT_PHONE || ""}';
    const officeAddress = site?.officeAddress || t('footer.address');

    // Social links
    const socialLinks = site?.socialLinks;
    const hasSocialLinks = socialLinks && (socialLinks.facebook || socialLinks.instagram || socialLinks.twitter);

    return (
        <footer className="bg-[#0B1120] text-slate-300 selection:bg-sky-500 selection:text-white">
            <Newsletter />

            {/* Main Footer */}
            <div className="border-t border-slate-800/50 pt-20 pb-12">
                <div className="container mx-auto px-6 md:px-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 mb-20">

                        {/* Brand Column */}
                        <div className="space-y-8">
                            <Link href="/" className="inline-block group">
                                <span className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
                                    <div className="w-8 h-8 bg-sky-500 rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-transform">
                                        <div className="w-4 h-4 border-2 border-white rounded-sm" />
                                    </div>
                                    ROMAN<span className="text-sky-400">VATICAN</span>
                                </span>
                            </Link>
                            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                                The modern benchmark for Roman exploration. SaaS-driven efficiency, human-led storytelling.
                            </p>

                             {/* Social Links - SaaS Style */}
                             <div className="flex items-center space-x-3">
                                    <a href="#" className="w-10 h-10 rounded-2xl bg-slate-800/50 flex items-center justify-center text-slate-400 hover:bg-sky-500 hover:text-white transition-all duration-300 backdrop-blur-sm">
                                        <Facebook size={18} />
                                    </a>
                                    <a href="#" className="w-10 h-10 rounded-2xl bg-slate-800/50 flex items-center justify-center text-slate-400 hover:bg-sky-500 hover:text-white transition-all duration-300 backdrop-blur-sm">
                                        <Instagram size={18} />
                                    </a>
                                    <a href="#" className="w-10 h-10 rounded-2xl bg-slate-800/50 flex items-center justify-center text-slate-400 hover:bg-sky-500 hover:text-white transition-all duration-300 backdrop-blur-sm">
                                        <Twitter size={18} />
                                    </a>
                             </div>
                                    {socialLinks?.instagram && (
                                        <a
                                            href={socialLinks.instagram}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label="Instagram"
                                            className="w-10 h-10 rounded-full bg-stone-900 flex items-center justify-center text-stone-400 hover:bg-sky-600 hover:text-white transition-all duration-300"
                                        >
                                            <Instagram size={18} />
                                        </a>
                                    )}
                                    {socialLinks?.twitter && (
                                        <a
                                            href={socialLinks.twitter}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label="Twitter"
                                            className="w-10 h-10 rounded-full bg-stone-900 flex items-center justify-center text-stone-400 hover:bg-sky-600 hover:text-white transition-all duration-300"
                                        >
                                            <Twitter size={18} />
                                        </a>
                                    )}
                                    {/* Fallback social links if none configured */}
                                    {!hasSocialLinks && !site && (
                                        <>
                                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-10 h-10 rounded-full bg-stone-900 flex items-center justify-center text-stone-400 hover:bg-sky-600 hover:text-white transition-all duration-300">
                                                <Facebook size={18} />
                                            </a>
                                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-10 h-10 rounded-full bg-stone-900 flex items-center justify-center text-stone-400 hover:bg-sky-600 hover:text-white transition-all duration-300">
                                                <Instagram size={18} />
                                            </a>
                                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="w-10 h-10 rounded-full bg-stone-900 flex items-center justify-center text-stone-400 hover:bg-sky-600 hover:text-white transition-all duration-300">
                                                <Twitter size={18} />
                                            </a>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Explore Categories */}
                        <div>
                            <h4 className="font-bold text-white mb-8 uppercase tracking-widest text-[10px]">
                                Platform
                            </h4>
                            <ul className="space-y-4 text-sm text-slate-400">
                                {categoryLinks.map((category) => (
                                    <li key={category.id}>
                                        <Link
                                            href={category.href}
                                            className="hover:text-sky-400 transition-colors flex items-center group"
                                        >
                                            {t(category.translationKey)}
                                        </Link>
                                    </li>
                                ))}
                                <li>
                                    <Link
                                        href="/blog"
                                        className="hover:text-sky-400 transition-colors flex items-center group font-medium text-sky-500/80"
                                    >
                                        <ArrowRight
                                            size={12}
                                            className="opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all duration-300 mr-2"
                                        />
                                        {t('footer.blog')}
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/search"
                                        className="hover:text-sky-400 transition-colors flex items-center group"
                                    >
                                        <ArrowRight
                                            size={12}
                                            className="opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all duration-300 mr-2"
                                        />
                                        {t('footer.all_tours') || 'All Tours'}
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Support Links */}
                        <div>
                            <h4 className="font-bold text-white mb-8 uppercase tracking-widest text-[10px]">
                                Resources
                            </h4>
                            <ul className="space-y-4 text-sm text-slate-400">
                                {supportLinks.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="hover:text-sky-400 transition-colors"
                                        >
                                            {t(link.translationKey)}
                                        </Link>
                                    </li>
                                ))}
                                <li>
                                    <Link
                                        href="/become-a-partner"
                                        className="text-sky-500 hover:text-sky-400 transition-colors font-medium"
                                    >
                                        {t('footer.partner')}
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Contact Info */}
                        <div>
                            <h4 className="font-bold text-white mb-8 uppercase tracking-widest text-[10px]">
                                Support
                            </h4>
                            <ul className="space-y-5 text-sm text-slate-400 mb-10">
                                <li className="flex items-start space-x-4">
                                    <MapPin size={18} className="text-sky-400 mt-0.5 shrink-0" />
                                    <span>{officeAddress}</span>
                                </li>
                                <li className="flex items-center space-x-4">
                                    <Phone size={18} className="text-sky-400 shrink-0" />
                                    <span>{contactPhone || '+39 06 1122 3344'}</span>
                                </li>
                                <li className="flex items-center space-x-4">
                                    <Mail size={18} className="text-sky-400 shrink-0" />
                                    <a href={`mailto:${contactEmail}`} className="hover:text-sky-400 transition-colors">
                                        {contactEmail}
                                    </a>
                                </li>
                            </ul>

                            {/* Trust Badges */}
                            <div className="flex items-center gap-6 pt-6 border-t border-slate-800/50">
                                <img src={`${SUPABASE_BUCKET_URL}/tripAdvisor.png`} alt="TripAdvisor" className="h-8 w-auto opacity-50 grayscale invert brightness-200 hover:opacity-100 hover:grayscale-0 hover:filter-none transition-all duration-300" />
                                <div className="h-8 w-px bg-slate-800" />
                                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Powered by RomanVatican Engine</p>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="border-t border-slate-800/50 pt-10 flex flex-col md:flex-row items-center justify-between gap-8 text-[11px] text-slate-500">
                        <p>&copy; {currentYear} RomanVatican Tour. Built for speed.</p>

                        {/* Company Details */}
                        <div className="text-center md:text-right flex flex-col md:items-end gap-1">
                            <span className="font-medium text-stone-400">{companyName}</span>
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
