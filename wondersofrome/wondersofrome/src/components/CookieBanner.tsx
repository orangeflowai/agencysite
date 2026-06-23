'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSite } from '@/components/SiteProvider';

export default function CookieBanner() {
    const [show, setShow] = useState(false);
    const [visible, setVisible] = useState(false);
    const site = useSite();

    const gdprSettings = site?.gdprSettings;
    const showBanner       = gdprSettings?.showCookieBanner !== false;
    const bannerTitle      = gdprSettings?.cookieBannerTitle    || 'We respect your privacy';
    const bannerText       = gdprSettings?.cookieBannerText     || 'We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.';
    const acceptButtonText = gdprSettings?.acceptButtonText     || 'Accept All';
    const declineButtonText= gdprSettings?.declineButtonText    || 'Decline';
    const privacyPolicyLink= gdprSettings?.privacyPolicyLink    || '/privacy-policy';
    const privacyPolicyText= gdprSettings?.privacyPolicyText    || 'Read our Privacy Policy';
    const complianceRegion = gdprSettings?.gdprComplianceRegion || 'eu';

    const getComplianceText = () => {
        const map: Record<string, string> = {
            italy: 'In compliance with Italian Law.',
            eu:    'In compliance with EU GDPR.',
            us:    'In compliance with CCPA.',
            uk:    'In compliance with UK GDPR.',
        };
        return map[complianceRegion] || 'In compliance with applicable privacy laws.';
    };

    useEffect(() => {
        const consent = localStorage.getItem('cookie-consent');
        if (!consent && showBanner) {
            const timer = setTimeout(() => {
                setShow(true);
                requestAnimationFrame(() => setVisible(true));
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [showBanner]);

    const handleConsent = (accepted: boolean) => {
        setVisible(false);
        setTimeout(() => setShow(false), 400);
        localStorage.setItem('cookie-consent', accepted ? 'accepted' : 'declined');
        localStorage.setItem('cookie-consent-date', new Date().toISOString());
        localStorage.setItem('cookie-consent-region', complianceRegion);
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('consent', 'update', {
                analytics_storage: accepted ? 'granted' : 'denied',
                ad_storage: accepted ? 'granted' : 'denied',
            });
        }
    };

    if (!showBanner || !show) return null;

    return (
        <div
            className="fixed bottom-0 left-0 right-0 z-50 p-4 transition-all duration-400"
            style={{
                transform: visible ? 'translateY(0)' : 'translateY(100%)',
                opacity: visible ? 1 : 0,
                transition: 'transform 0.4s ease, opacity 0.4s ease',
            }}
        >
            <div className="max-w-5xl mx-auto bg-card rounded-2xl shadow-2xl border border-border p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="flex-1">
                    <h3 className="font-bold text-foreground mb-2">{bannerTitle}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        {bannerText} {getComplianceText()}
                        <Link href={privacyPolicyLink} className="text-primary hover:underline font-bold ml-1">
                            {privacyPolicyText}
                        </Link>.
                    </p>
                </div>
                <div className="flex gap-3 shrink-0 w-full md:w-auto">
                    <button
                        onClick={() => handleConsent(false)}
                        className="flex-1 md:flex-none px-6 py-3 rounded-xl border border-border text-muted-foreground font-bold hover:bg-muted transition-colors text-sm"
                    >
                        {declineButtonText}
                    </button>
                    <button
                        onClick={() => handleConsent(true)}
                        className="flex-1 md:flex-none px-8 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors shadow-lg text-sm"
                    >
                        {acceptButtonText}
                    </button>
                </div>
            </div>
        </div>
    );
}
