'use client';

import Link from 'next/link';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useSite } from '@/components/SiteProvider';
import Image from 'next/image';
import { SUPABASE_BUCKET_URL } from '@/lib/constants';
import PaymentLogos from './PaymentLogos';
import LanguageSwitcher from './LanguageSwitcher';

const categoryLinks = [
    {
        id: 'vatican',
        href: '/category/vatican',
        label: 'Vatican Museums'
    },
    {
        id: 'private',
        href: '/private-tours',
        label: 'Private Experiences'
    },
];

const supportLinks = [
    { href: '/contact', translationKey: 'footer.contact_us' },
    { href: '/faq', translationKey: 'footer.faq' },
    { href: '/terms-and-conditions', translationKey: 'footer.terms' },
    { href: '/privacy-policy', translationKey: 'footer.privacy' },
];

export default function Footer() {
    const { t } = useLanguage();
    const site = useSite();
    const currentYear = new Date().getFullYear();

    const contactEmail = site?.contactEmail || process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'info@romewander.com';
    const contactPhone = site?.contactPhone || process.env.NEXT_PUBLIC_SUPPORT_PHONE || '+39 389 892 2088';

    return (
        <footer className="selection:bg-gold selection:text-black border-t border-gray-100" style={{ backgroundColor: '#1A1210', color: 'rgba(245,240,232,0.9)' }}>
            <div className="container mx-auto px-6 md:px-12 py-24">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-16 lg:gap-24">

                    {/* Brand & Mission */}
                    <div className="md:col-span-5 space-y-10">
                        <Link href="/" className="inline-block group">
                            <div className="flex flex-col items-start transition-transform group-hover:scale-105 duration-500">
                                <span className="font-inter text-4xl font-black tracking-tighter text-white">
                                    ROMEWANDER
                                </span>
                                <span className="font-inter text-[10px] uppercase font-black tracking-[0.5em] text-[#C9A84C] mt-1">
                                    Vatican Tours
                                </span>
                            </div>
                        </Link>
                        <p className="text-lg leading-relaxed text-white/50 max-w-md font-medium">
                            Providing exclusive access to Rome's most sacred treasures. Experience history, art, and the sacred through our curated private journeys.
                        </p>
                        <div className="flex items-center gap-6">
                            {[Facebook, Instagram, Twitter].map((Icon, i) => (
                                <Link key={i} href="/" className="w-14 h-14 rounded-full border border-white/5 bg-white/5 flex items-center justify-center text-white/40 hover:text-[#C9A84C] hover:border-[#C9A84C]/30 hover:bg-[#C9A84C]/5 transition-all duration-500 backdrop-blur-xl">
                                    <Icon size={20} strokeWidth={1.5} />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Columns */}
                    <div className="md:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12">
                        <div className="space-y-8">
                            <h4 className="font-inter text-xs font-black uppercase tracking-[0.3em] text-[#C9A84C]">Experience</h4>
                            <ul className="space-y-5 text-sm font-bold text-white/40">
                                {categoryLinks.map((category) => (
                                    <li key={category.id}>
                                        <Link href={category.href} className="hover:text-white transition-colors">{category.label}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="space-y-8">
                            <h4 className="font-inter text-xs font-black uppercase tracking-[0.3em] text-[#C9A84C]">Company</h4>
                            <ul className="space-y-5 text-sm font-bold text-white/40">
                                {supportLinks.map((link) => (
                                    <li key={link.href}>
                                        <Link href={link.href} className="hover:text-white transition-colors">{t(link.translationKey)}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="space-y-8 col-span-2 md:col-span-1">
                            <h4 className="font-inter text-xs font-black uppercase tracking-[0.3em] text-[#C9A84C]">Concierge</h4>
                            <ul className="space-y-5 text-sm font-bold text-white/40">
                                <li className="flex items-center gap-3">
                                    <Mail size={16} className="text-[#C9A84C]" />
                                    <a href={`mailto:${contactEmail}`} className="hover:text-white transition-colors truncate">{contactEmail}</a>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Phone size={16} className="text-[#C9A84C]" />
                                    <span className="hover:text-white transition-colors">{contactPhone}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex flex-col md:flex-row items-center gap-8 text-[10px] font-black uppercase tracking-[0.3em] text-white/20">
                        <p>&copy; {currentYear} RomeWander</p>
                        <div className="hidden md:block h-3 w-px bg-white/5" />
                        <Link href="/privacy-policy" className="hover:text-[#C9A84C]">Privacy</Link>
                        <Link href="/terms-and-conditions" className="hover:text-[#C9A84C]">Terms</Link>
                        <div className="hidden md:block h-3 w-px bg-white/5" />
                        <div className="opacity-60 hover:opacity-100 transition-opacity">
                            <LanguageSwitcher />
                        </div>
                    </div>
                    
                    <div className="opacity-30 hover:opacity-100 transition-opacity duration-1000 grayscale hover:grayscale-0">
                        <PaymentLogos size="sm" />
                    </div>
                </div>
            </div>
        </footer>
    );
}
