'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface ThemeConfig {
    primary: string;
    primaryLight: string;
    primaryDark: string;
    secondary: string;
    accent: string;
    name: string;
}

export const PRESET_THEMES: Record<string, ThemeConfig> = {
    golden: {
        name: 'Golden Rome',
        primary: '#D4AF37',
        primaryLight: '#F4D03F',
        primaryDark: '#B8860B',
        secondary: '#8B4513',
        accent: '#FFD700',
    },
    emerald: {
        name: 'Emerald',
        primary: '#10b981',
        primaryLight: '#34d399',
        primaryDark: '#059669',
        secondary: '#14b8a6',
        accent: '#6ee7b7',
    },
    ocean: {
        name: 'Ocean Blue',
        primary: '#0ea5e9',
        primaryLight: '#38bdf8',
        primaryDark: '#0284c7',
        secondary: '#06b6d4',
        accent: '#7dd3fc',
    },
    sunset: {
        name: 'Sunset',
        primary: '#f97316',
        primaryLight: '#fb923c',
        primaryDark: '#ea580c',
        secondary: '#f59e0b',
        accent: '#fbbf24',
    },
    royal: {
        name: 'Royal Purple',
        primary: '#9333ea',
        primaryLight: '#a855f7',
        primaryDark: '#7e22ce',
        secondary: '#8b5cf6',
        accent: '#c084fc',
    },
};

interface ThemeContextType {
    theme: Partial<ThemeConfig>;
    setTheme: (themeKey: string) => void;
    customColors: Partial<ThemeConfig>;
    setCustomColors: (colors: Partial<ThemeConfig>) => void;
    isCustom: boolean;
    applyCustomTheme: () => void;
    resetToDefault: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = 'admin_theme_config';

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [customColors, setCustomColors] = useState<Partial<ThemeConfig>>({});
    const [isCustom, setIsCustom] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed.customColors) setCustomColors(parsed.customColors);
                if (parsed.isCustom) setIsCustom(true);
            } catch (e) {
                console.error('Failed to parse saved theme', e);
            }
        }
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;
        const root = document.documentElement;

        if (isCustom && Object.keys(customColors).length > 0) {
            Object.entries(customColors).forEach(([key, value]) => {
                if (value) {
                    const cssVar = `--${key.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`)}`;
                    root.style.setProperty(cssVar, value as string);
                }
            });
        }

        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('themechange'));
        }
    }, [customColors, isCustom, mounted]);

    const setTheme = (key: string) => {}; // No-op for presets now
    const applyCustomTheme = () => setIsCustom(true);
    const resetToDefault = () => {
        setIsCustom(false);
        setCustomColors({});
        // Removing inline styles to fall back to globals.css
        document.documentElement.removeAttribute('style');
    };

    return (
        <ThemeContext.Provider value={{
            theme: customColors,
            setTheme,
            customColors,
            setCustomColors,
            isCustom,
            applyCustomTheme,
            resetToDefault,
        }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useTheme must be used within a ThemeProvider');
    return context;
}
