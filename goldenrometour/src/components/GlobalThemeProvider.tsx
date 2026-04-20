'use client';

import { useEffect, ReactNode } from 'react';
import { useSite } from './SiteProvider';

// Default themes for each site
const DEFAULT_THEMES: Record<string, Record<string, string>> = {
    'rome-tour-tickets': {
        '--color-primary': '#0f4c3a',
        '--color-primary-light': '#166534',
        '--color-primary-dark': '#064e3b',
        '--color-secondary': '#f5f5dc',
        '--color-accent': '#f59e0b',
    },
    'default': {
        '--color-primary': '#0ea5e9',
        '--color-primary-light': '#2563eb',
        '--color-primary-dark': '#1e40af',
        '--color-secondary': '#fef3c7',
        '--color-accent': '#0c4a6e',
    },
};

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
    const siteId = site?.slug?.current || 'goldenrometour';

    useEffect(() => {
        // Load custom theme from localStorage (set by admin panel) or Sanity
        const loadTheme = () => {
            try {
                const root = document.documentElement;

                // 1. Apply default theme for this site (Baseline)
                const defaultTheme = DEFAULT_THEMES[siteId] || DEFAULT_THEMES['default'];
                Object.entries(defaultTheme).forEach(([key, value]) => {
                    root.style.setProperty(key, value);
                });

                // Apply the new theme mappings
                const themeMappings: Record<string, string> = {
                    '--color-card': 'var(--card)',
                    '--color-ring': 'var(--ring)',
                    '--color-input': 'var(--input)',
                    '--color-muted': 'var(--muted)',
                    '--color-accent': 'var(--accent)',
                    '--color-border': 'var(--border)',
                    '--color-radius': 'var(--radius)',
                    '--color-chart-1': 'var(--chart-1)',
                    '--color-chart-2': 'var(--chart-2)',
                    '--color-chart-3': 'var(--chart-3)',
                    '--color-chart-4': 'var(--chart-4)',
                    '--color-chart-5': 'var(--chart-5)',
                    '--color-popover': 'var(--popover)',
                    '--color-primary': 'var(--primary)',
                    '--color-sidebar': 'var(--sidebar)',
                    '--color-font-mono': 'var(--font-mono)',
                    '--color-font-sans': 'var(--font-sans)',
                    '--color-secondary': 'var(--secondary)',
                    '--color-background': 'var(--background)',
                    '--color-font-serif': 'var(--font-serif)',
                    '--color-foreground': 'var(--foreground)',
                    '--color-destructive': 'var(--destructive)',
                    '--color-shadow-blur': 'var(--shadow-blur)',
                    '--color-shadow-color': 'var(--shadow-color)',
                    '--color-sidebar-ring': 'var(--sidebar-ring)',
                    '--color-shadow-spread': 'var(--shadow-spread)',
                    '--color-shadow-opacity': 'var(--shadow-opacity)',
                    '--color-sidebar-accent': 'var(--sidebar-accent)',
                    '--color-sidebar-border': 'var(--sidebar-border)',
                    '--color-card-foreground': 'var(--card-foreground)',
                    '--color-shadow-offset-x': 'var(--shadow-offset-x)',
                    '--color-shadow-offset-y': 'var(--shadow-offset-y)',
                    '--color-sidebar-primary': 'var(--sidebar-primary)',
                    '--color-muted-foreground': 'var(--muted-foreground)',
                    '--color-accent-foreground': 'var(--accent-foreground)',
                    '--color-popover-foreground': 'var(--popover-foreground)',
                    '--color-primary-foreground': 'var(--primary-foreground)',
                    '--color-sidebar-foreground': 'var(--sidebar-foreground)',
                    '--color-secondary-foreground': 'var(--secondary-foreground)',
                    '--color-destructive-foreground': 'var(--destructive-foreground)',
                    '--color-sidebar-accent-foreground': 'var(--sidebar-accent-foreground)',
                    '--color-sidebar-primary-foreground': 'var(--sidebar-primary-foreground)',
                };
                Object.entries(themeMappings).forEach(([key, value]) => {
                    root.style.setProperty(key, value);
                });

                // 2. Apply Brand Colors from Sanity (Server Data) - OVERRIDES Default
                if (site?.brandColors) {
                    if (site.brandColors.primary?.hex) {
                        root.style.setProperty('--color-primary', site.brandColors.primary.hex);
                        // Fallbacks for shades if not calculated (simple override)
                        root.style.setProperty('--color-primary-light', site.brandColors.primary.hex);
                        root.style.setProperty('--color-primary-dark', site.brandColors.primary.hex);
                    }
                    if (site.brandColors.secondary?.hex) {
                        root.style.setProperty('--color-secondary', site.brandColors.secondary.hex);
                    }
                    if (site.brandColors.accent?.hex) {
                        root.style.setProperty('--color-accent', site.brandColors.accent.hex);
                    }
                }

                // 3. Apply LocalStorage Overrides (Admin Panel Preview) - HIGHEST PRIORITY
                const saved = localStorage.getItem('admin_theme_config');
                if (saved) {
                    const parsed = JSON.parse(saved);

                    if (parsed.isCustom && parsed.customColors) {
                        // Apply custom colors
                        Object.entries(parsed.customColors).forEach(([key, value]) => {
                            if (value) {
                                const cssVar = `--color-${key.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`)}`;
                                root.style.setProperty(cssVar, value as string);
                            }
                        });
                    } else if (parsed.themeKey) {
                        // Apply preset theme
                        const preset = getPresetTheme(parsed.themeKey);
                        Object.entries(preset).forEach(([key, value]) => {
                            root.style.setProperty(key, value);
                        });
                    }
                }
            } catch (e) {
                console.error('Failed to load theme:', e);
            }
        };

        // Load theme immediately and whenever site data changes
        loadTheme();

        // Listen for theme changes from admin panel (via storage event)
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'admin_theme_config') {
                loadTheme();
            }
        };

        // Listen for custom theme change events
        const handleThemeChange = () => {
            loadTheme();
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('themechange', handleThemeChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('themechange', handleThemeChange);
        };
    }, [siteId]);

    return <>{children}</>;
}

// Helper to get preset theme colors
function getPresetTheme(themeKey: string): Record<string, string> {
    const presets: Record<string, Record<string, string>> = {
        emerald: {
            '--color-primary': '#0f4c3a',
            '--color-primary-light': '#166534',
            '--color-primary-dark': '#064e3b',
            '--color-secondary': '#f5f5dc',
            '--color-accent': '#f59e0b',
        },
        royal: {
            '--color-primary': '#1e3a8a',
            '--color-primary-light': '#2563eb',
            '--color-primary-dark': '#1e40af',
            '--color-secondary': '#fef3c7',
            '--color-accent': '#dc2626',
        },
        burgundy: {
            '--color-primary': '#7c2d12',
            '--color-primary-light': '#9a3412',
            '--color-primary-dark': '#431407',
            '--color-secondary': '#fef7ed',
            '--color-accent': '#d97706',
        },
        purple: {
            '--color-primary': '#581c87',
            '--color-primary-light': '#7c3aed',
            '--color-primary-dark': '#3b0764',
            '--color-secondary': '#faf5ff',
            '--color-accent': '#f59e0b',
        },
        teal: {
            '--color-primary': '#134e4a',
            '--color-primary-light': '#0d9488',
            '--color-primary-dark': '#042f2e',
            '--color-secondary': '#f0fdfa',
            '--color-accent': '#f97316',
        },
    };

    return presets[themeKey] || presets['sky'];
}

// Helper function to broadcast theme change (call from admin panel)
export function broadcastThemeChange() {
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('themechange'));
    }
}
