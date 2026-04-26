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
    emerald: {
        name: 'Emerald Green',
        primary: '#0f4c3a',
        primaryLight: '#166534',
        primaryDark: '#064e3b',
        secondary: '#f5f5dc',
        accent: '#f59e0b',
    },
    royal: {
        name: 'Royal Blue',
        primary: '#0ea5e9',
        primaryLight: '#2563eb',
        primaryDark: '#1e40af',
        secondary: '#fef3c7',
        accent: '#0c4a6e',
    },
    burgundy: {
        name: 'Roman Burgundy',
        primary: '#7c2d12',
        primaryLight: '#9a3412',
        primaryDark: '#431407',
        secondary: '#fef7ed',
        accent: '#d97706',
    },
    purple: {
        name: 'Imperial Purple',
        primary: '#581c87',
        primaryLight: '#7c3aed',
        primaryDark: '#3b0764',
        secondary: '#faf5ff',
        accent: '#f59e0b',
    },
    teal: {
        name: 'Mediterranean Teal',
        primary: '#134e4a',
        primaryLight: '#0d9488',
        primaryDark: '#042f2e',
        secondary: '#f0fdfa',
        accent: '#f97316',
    },
};

interface ThemeContextType {
    theme: ThemeConfig;
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
    const [themeKey, setThemeKey] = useState<string>('royal');
    const [customColors, setCustomColors] = useState<Partial<ThemeConfig>>({});
    const [isCustom, setIsCustom] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Load saved theme on mount
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed.themeKey && PRESET_THEMES[parsed.themeKey]) {
                    setThemeKey(parsed.themeKey);
                }
                if (parsed.customColors) {
                    setCustomColors(parsed.customColors);
                }
                if (parsed.isCustom) {
                    setIsCustom(true);
                }
            } catch (e) {
                console.error('Failed to parse saved theme', e);
            }
        }
        // Set mounted after loading theme to avoid hydration mismatch
        setMounted(true);
    }, []);

    // Apply theme CSS variables
    useEffect(() => {
        if (!mounted) return;

        const baseTheme = PRESET_THEMES[themeKey] || PRESET_THEMES['royal'];
        const theme = isCustom && Object.keys(customColors).length > 0
            ? { ...baseTheme, ...customColors }
            : baseTheme;

        const root = document.documentElement;

        // Apply CSS variables
        root.style.setProperty('--color-primary', theme.primary);
        root.style.setProperty('--color-primary-light', theme.primaryLight);
        root.style.setProperty('--color-primary-dark', theme.primaryDark);
        root.style.setProperty('--color-secondary', theme.secondary);
        root.style.setProperty('--color-accent', theme.accent);

        // Save to localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
            themeKey,
            customColors,
            isCustom,
        }));

        // Broadcast theme change to other tabs/windows
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('themechange'));
        }
    }, [themeKey, customColors, isCustom, mounted]);

    const setTheme = (key: string) => {
        if (PRESET_THEMES[key]) {
            setThemeKey(key);
            setIsCustom(false);
        }
    };

    const applyCustomTheme = () => {
        setIsCustom(true);
    };

    const resetToDefault = () => {
        setIsCustom(false);
        setCustomColors({});
        setThemeKey('royal');
    };

    const resolvedBase = PRESET_THEMES[themeKey] || PRESET_THEMES['royal'];
    const theme = isCustom && Object.keys(customColors).length > 0
        ? { ...resolvedBase, ...customColors }
        : resolvedBase;

    return (
        <ThemeContext.Provider value={{
            theme,
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
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
