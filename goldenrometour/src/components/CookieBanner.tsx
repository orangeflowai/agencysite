'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useSite } from '@/components/SiteProvider';

export default function CookieBanner() {
    const [show, setShow] = useState(false);
    const site = useSite();
    
    // Get GDPR settings with fallbacks
    const gdprSettings = site?.gdprSettings;
    const showBanner = gdprSettings?.showCookieBanner !== false; // Default to true
    const bannerTitle = gdprSettings?.cookieBannerTitle || 'We respect your privacy';
    const bannerText = gdprSettings?.cookieBannerText || 
        'We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.';
    const acceptButtonText = gdprSettings?.acceptButtonText || 'Accept All';
    const declineButtonText = gdprSettings?.declineButtonText || 'Decline';
    const privacyPolicyLink = gdprSettings?.privacyPolicyLink || '/privacy-policy';
    const privacyPolicyText = gdprSettings?.privacyPolicyText || 'Read our Privacy Policy';
    const complianceRegion = gdprSettings?.gdprComplianceRegion || 'eu';
    
    // Add compliance region text
    const getComplianceText = () => {
        switch (complianceRegion) {
            case 'italy':
                return 'In compliance with Italian Law.';
            case 'eu':
                return 'In compliance with EU GDPR.';
            case 'us':
                return 'In compliance with CCPA.';
            case 'uk':
                return 'In compliance with UK GDPR.';
            default:
                return 'In compliance with applicable privacy laws.';
        }
    };

    useEffect(() => {
        // Check if user has already made a choice
        const consent = localStorage.getItem('cookie-consent');
        if (!consent && showBanner) {
            // Delay slightly for smoother UX
            const timer = setTimeout(() => setShow(true), 1000);
            return () => clearTimeout(timer);
        }
    }, [showBanner]);

    const accept = () => {
        localStorage.setItem('cookie-consent', 'accepted');
        localStorage.setItem('cookie-consent-date', new Date().toISOString());
        localStorage.setItem('cookie-consent-region', complianceRegion);
        setShow(false);
        // Here you would initialize analytics (e.g. GA4)
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('consent', 'update', {
                analytics_storage: 'granted',
                ad_storage: 'granted',
            });
        }
    };

    const decline = () => {
        localStorage.setItem('cookie-consent', 'declined');
        localStorage.setItem('cookie-consent-date', new Date().toISOString());
        localStorage.setItem('cookie-consent-region', complianceRegion);
        setShow(false);
        // Ensure analytics are disabled
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('consent', 'update', {
                analytics_storage: 'denied',
                ad_storage: 'denied',
            });
        }
    };

    // Don't render if banner is disabled in settings
    if (!showBanner) return null;

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-0 left-0 right-0 z-50 p-4"
                >
                    <div className="max-w-5xl mx-auto bg-cream border border-forest p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-6 shadow-2xl">
                        <div className="flex-1">
                            <h3 className="font-serif text-xl font-bold text-forest mb-2 italic underline decoration-forest/20">{bannerTitle}</h3>
                            <p className="font-sans text-xs text-forest leading-relaxed uppercase tracking-wider opacity-80">
                                {bannerText}
                                {' '}{getComplianceText()}
                                <Link href={privacyPolicyLink} className="text-forest hover:underline font-black ml-1">
                                    {privacyPolicyText}
                                </Link>.
                            </p>
                        </div>
                        <div className="flex gap-3 shrink-0 w-full md:w-auto">
                            <button
                                onClick={decline}
                                className="flex-1 md:flex-none px-6 py-3 border border-forest text-forest font-black uppercase tracking-widest hover:bg-forest hover:text-cream transition-colors text-[10px]"
                            >
                                {declineButtonText}
                            </button>
                            <button
                                onClick={accept}
                                className="flex-1 md:flex-none px-8 py-3 bg-forest text-cream font-black uppercase tracking-widest hover:bg-forest-light transition-colors text-[10px] shadow-lg shadow-forest/10"
                            >
                                {acceptButtonText}
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
