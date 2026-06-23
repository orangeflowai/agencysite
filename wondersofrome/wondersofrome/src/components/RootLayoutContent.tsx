'use client';

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
 */
export default function RootLayoutContent({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const isAdminOrStudio =
        pathname.startsWith('/admin') ||
        pathname.startsWith('/studio');

    if (isAdminOrStudio) {
        // Clean render — no hero, no animations, no floating buttons
        return <>{children}</>;
    }

    return (
        <CurveTransition>
            <SmoothScroll>
                <GoogleTranslate />
                <CookieBanner />
                <AIConcierge />
                {children}
            </SmoothScroll>
        </CurveTransition>
    );
}
