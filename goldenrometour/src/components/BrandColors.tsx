'use client';

import { useEffect } from 'react';
import { useSite } from './SiteProvider';

export default function BrandColors() {
    const site = useSite();

    useEffect(() => {
        // Safety check - if no site or no brandColors, skip
        if (!site || !site.brandColors) return;

        const root = document.documentElement;
        const brandColors = site.brandColors;

        // Apply brand colors from Sanity admin (with extra safety checks)
        if (brandColors?.primary?.hex) {
            root.style.setProperty('--color-primary', brandColors.primary.hex);
            // Calculate darker variant for primary-dark
            root.style.setProperty('--color-primary-dark', adjustBrightness(brandColors.primary.hex, -20));
        }
        if (brandColors?.secondary?.hex) {
            root.style.setProperty('--color-secondary', brandColors.secondary.hex);
        }
        if (brandColors?.accent?.hex) {
            root.style.setProperty('--color-accent', brandColors.accent.hex);
            root.style.setProperty('--color-accent-light', adjustBrightness(brandColors.accent.hex, 20));
        }
    }, [site?.brandColors]);

    return null;
}

// Helper to darken/lighten colors
function adjustBrightness(hex: string, percent: number): string {
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.min(255, Math.max(0, (num >> 16) + amt));
    const G = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amt));
    const B = Math.min(255, Math.max(0, (num & 0x0000FF) + amt));
    return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
}
