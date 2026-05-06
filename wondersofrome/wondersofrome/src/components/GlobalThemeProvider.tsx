'use client';

import { useEffect, ReactNode } from 'react';
import { useSite } from './SiteProvider';

interface GlobalThemeProviderProps {
    children: ReactNode;
}

/**
 * GlobalThemeProvider - Applies custom theme colors to the entire website
 * 
 * This reads theme settings from localStorage (set by admin panel)
 * and applies CSS variables to :root, affecting the entire site.
 */
export default function GlobalThemeProvider({ children }: GlobalThemeProviderProps) {
    const site = useSite();
    const siteId = site?.slug?.current || 'wondersofrome';

    useEffect(() => {
        const loadTheme = () => {
            try {
                const root = document.documentElement;

                // Only apply LocalStorage Overrides (Admin Panel Preview)
                // Sanity brandColors are intentionally skipped — the CSS theme in globals.css
                // is the source of truth for site colors. Sanity brandColors are not fully
                // configured and would override the correct theme.
                const saved = localStorage.getItem('admin_theme_config');
                if (saved) {
                    const parsed = JSON.parse(saved);

                    if (parsed.isCustom && parsed.customColors) {
                        Object.entries(parsed.customColors).forEach(([key, value]) => {
                            if (value) {
                                const cssVar = `--${key.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`)}`;
                                root.style.setProperty(cssVar, value as string);
                            }
                        });
                    }
                }
            } catch (e) {
                console.error('Failed to load theme:', e);
            }
        };

        loadTheme();

        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'admin_theme_config') loadTheme();
        };

        const handleThemeChange = () => loadTheme();

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('themechange', handleThemeChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('themechange', handleThemeChange);
        };
    }, [site, siteId]);

    return <>{children}</>;
}

export function broadcastThemeChange() {
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('themechange'));
    }
}
