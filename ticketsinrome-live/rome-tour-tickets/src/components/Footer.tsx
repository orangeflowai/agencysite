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
    const siteTitle = site?.title || 'Tickets in Rome';
    const logoText = site?.logoText || 'Tickets in';
    const logoTextAccent = site?.logoTextAccent || 'Rome';
    const logo = site?.logo?.asset?.url;

    // Business info — only show if set in Sanity, never hardcode legal data
    const businessInfo = site?.businessInfo;
    const companyName = businessInfo?.companyName || 'Tickets in Rome';
    const vatNumber = businessInfo?.vatNumber;
    const reaNumber = businessInfo?.reaNumber;
    const registeredAddress = businessInfo?.registeredAddress;
    const shareCapital = businessInfo?.shareCapital;

    // Contact info
    const contactEmail = site?.contactEmail || 'info@ticketsinrome.com';
    const contactPhone = site?.contactPhone || '3517869798';
    const officeAddress = site?.officeAddress || t('footer.address');

    // Social links
    const socialLinks = site?.socialLinks;
    const hasSocialLinks = socialLinks && (socialLinks.facebook || socialLinks.instagram || socialLinks.twitter);

    return (
        <footer className="bg-white text-gray-900 border-t border-gray-100">
            <Newsletter />

            {/* Main Footer */}
            <div className="border-t border-gray-100 pt-16 pb-12">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">

                        {/* Brand Column */}
                        <div className="space-y-6">
                            <Link href="/" className="inline-block">
                                {logo ? (
                                    <Image
                                        src={logo}
                                        alt={siteTitle}
                                        width={200}
                                        height={60}
                                        className="h-12 w-auto object-contain"
                                    />
                                ) : (
                                    <h3 className="text-3xl font-serif text-gray-900 tracking-tight">
                                        {logoText} <span className="text-emerald-500">{logoTextAccent}</span>
                                    </h3>
                                )}
                            </Link>
                            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                                {t('footer.about')}
                            </p>

                            {/* Social Links */}
                            {(hasSocialLinks || !site) && (
                                <div className="flex items-center space-x-3">
                                    {socialLinks?.facebook && (
                                        <a
                                            href={socialLinks.facebook}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label="Facebook"
                                            className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-emerald-600 hover:text-white transition-all duration-300"
                                        >
                                            <Facebook size={18} />
                                        </a>
                                    )}
                                    {socialLinks?.instagram && (
                                        <a
                                            href={socialLinks.instagram}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label="Instagram"
                                            className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-emerald-600 hover:text-white transition-all duration-300"
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
                                            className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-emerald-600 hover:text-white transition-all duration-300"
                                        >
                                            <Twitter size={18} />
                                        </a>
                                    )}
                                    {/* Fallback social links if none configured */}
                                    {!hasSocialLinks && !site && (
                                        <>
                                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-emerald-600 hover:text-white transition-all duration-300">
                                                <Facebook size={18} />
                                            </a>
                                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-emerald-600 hover:text-white transition-all duration-300">
                                                <Instagram size={18} />
                                            </a>
                                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-emerald-600 hover:text-white transition-all duration-300">
                                                <Twitter size={18} />
                                            </a>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Explore Categories */}
                        <div>
                            <h4 className="font-bold text-gray-900 mb-6 uppercase tracking-wider text-xs flex items-center gap-2">
                                <span className="w-8 h-px bg-emerald-500"></span>
                                {t('footer.explore')}
                            </h4>
                            <ul className="space-y-3 text-sm text-gray-500">
                                {categoryLinks.map((category) => (
                                    <li key={category.id}>
                                        <Link
                                            href={category.href}
                                            className="hover:text-emerald-400 transition-colors flex items-center group"
                                        >
                                            <ArrowRight
                                                size={12}
                                                className="opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all duration-300 mr-2"
                                            />
                                            {t(category.translationKey)}
                                        </Link>
                                    </li>
                                ))}
                                <li>
                                    <Link
                                        href="/blog"
                                        className="hover:text-emerald-400 transition-colors flex items-center group font-medium text-emerald-500/80"
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
                                        className="hover:text-emerald-400 transition-colors flex items-center group"
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
                            <h4 className="font-bold text-gray-900 mb-6 uppercase tracking-wider text-xs flex items-center gap-2">
                                <span className="w-8 h-px bg-emerald-500"></span>
                                {t('footer.support')}
                            </h4>
                            <ul className="space-y-3 text-sm text-gray-500">
                                {supportLinks.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="hover:text-emerald-400 transition-colors"
                                        >
                                            {t(link.translationKey)}
                                        </Link>
                                    </li>
                                ))}
                                <li>
                                    <Link
                                        href="/become-a-partner"
                                        className="text-emerald-500 hover:text-emerald-400 transition-colors font-medium"
                                    >
                                        {t('footer.partner')}
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Contact Info */}
                        <div>
                            <h4 className="font-bold text-gray-900 mb-6 uppercase tracking-wider text-xs flex items-center gap-2">
                                <span className="w-8 h-px bg-emerald-500"></span>
                                {t('footer.contact')}
                            </h4>
                            <ul className="space-y-4 text-sm text-gray-500 mb-8">
                                <li className="flex items-start space-x-3">
                                    <MapPin size={18} className="text-emerald-500 mt-0.5 shrink-0" />
                                    {site?.mapLink ? (
                                        <a href={site.mapLink} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">
                                            {officeAddress}
                                        </a>
                                    ) : (
                                        <span>{officeAddress}</span>
                                    )}
                                </li>
                                <li className="flex items-center space-x-3">
                                    <Phone size={18} className="text-emerald-500 shrink-0" />
                                    <a
                                        href={`tel:${contactPhone.replace(/\s/g, '')}`}
                                        className="hover:text-emerald-400 transition-colors"
                                    >
                                        {contactPhone}
                                    </a>
                                </li>
                                <li className="flex items-center space-x-3">
                                    <Mail size={18} className="text-emerald-500 shrink-0" />
                                    <a
                                        href={`mailto:${contactEmail}`}
                                        className="hover:text-emerald-400 transition-colors"
                                    >
                                        {contactEmail}
                                    </a>
                                </li>
                            </ul>
                            {/* Payment Methods */}
                            <div className="mt-6 pt-6 border-t border-gray-100">
                                <p className="text-xs text-gray-500 mb-3 uppercase tracking-wider">Secure Payments</p>
                                <PaymentLogos size="sm" />
                            </div>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-400">
                        <p>&copy; {currentYear} {siteTitle}. {t('footer.rights')}</p>

                        {/* Company Details */}
                        <div className="text-center md:text-right flex flex-col md:items-end gap-1">
                            <span className="font-medium text-gray-500">{companyName}</span>
                            {(vatNumber || reaNumber) && (
                                <span>
                                    {vatNumber && `P.IVA: ${vatNumber}`}
                                    {reaNumber && vatNumber && ' • '}
                                    {reaNumber && `REA: ${reaNumber}`}
                                </span>
                            )}
                            {registeredAddress && <span>{registeredAddress}</span>}
                            {shareCapital && <span>{shareCapital}</span>}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
