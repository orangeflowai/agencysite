'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { usePathname } from 'next/navigation';
import CurveTransition from '@/components/CurveTransition';
import WhatsAppButton from '@/components/WhatsAppButton';
import SmoothScroll from '@/components/SmoothScroll';
import CookieBanner from '@/components/CookieBanner';
import AIConcierge from '@/components/AIConcierge';
import GoogleTranslate from '@/components/GoogleTranslate';

/**
 * Wraps public-facing pages with animations, scroll effects, and floating UI.
 * Admin and Studio routes get none of this — they render children directly.
 *
 * Floating buttons (AIConcierge, WhatsAppButton) are portalled to document.body
 * so they always position relative to the viewport — Lenis smooth-scroll applies
 * CSS transforms that would otherwise break position: fixed containment.
 */
export default function RootLayoutContent({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);

    const isAdminOrStudio =
        pathname.startsWith('/admin') ||
        pathname.startsWith('/studio');

    if (isAdminOrStudio) {
        return <>{children}</>;
    }

    return (
        <>
            <CurveTransition>
                <SmoothScroll>
                    <GoogleTranslate />
                    <CookieBanner />
                    {children}
                </SmoothScroll>
            </CurveTransition>
            {mounted && createPortal(
                <>
                    <AIConcierge />
                    <WhatsAppButton />
                </>,
                document.body
            )}
        </>
    );
}
