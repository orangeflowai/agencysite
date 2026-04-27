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
