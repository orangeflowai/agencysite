'use client';

import { ReactNode, useEffect } from 'react';
import { DEFAULT_SITE_ID } from '@/lib/sanityService';

interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * ThemeProvider - Applies CSS theme variables based on the current site
 * 
 * This component:
 * 1. Adds a data-site attribute to the body for CSS theme selection
 * 2. Can be extended to load site-specific fonts, colors from Sanity, etc.
 */
export default function ThemeProvider({ children }: ThemeProviderProps) {
  useEffect(() => {
    // Apply the site attribute to the document body
    // This triggers the CSS theme variables in themes.css
    document.body.setAttribute('data-site', DEFAULT_SITE_ID);
    
    // Optional: Load site-specific fonts
    if (DEFAULT_SITE_ID !== 'goldenrometour') {
      // Load Playfair Display for {process.env.NEXT_PUBLIC_SITE_NAME || "Your Agency"}
      const link = document.createElement('link');
      link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
    
    return () => {
      // Cleanup if needed
    };
  }, []);

  return <>{children}</>;
}

/**
 * Get theme-aware class names
 * Utility function for dynamic theming
 */
export function getThemeClasses(siteId: string = DEFAULT_SITE_ID) {
  const themes = {
    'rome-tour-tickets': {
      primary: 'bg-sky-700 hover:bg-sky-800',
      primaryText: 'text-sky-700',
      accent: 'bg-amber-500 hover:bg-amber-600',
      accentText: 'text-amber-500',
      gradient: 'from-emerald-800 to-emerald-600',
    },
    'default': {
      primary: 'bg-blue-800 hover:bg-blue-900',
      primaryText: 'text-blue-800',
      accent: 'bg-red-600 hover:bg-red-700',
      accentText: 'text-red-600',
      gradient: 'from-blue-900 to-blue-700',
    },
  };

    return themes[siteId as keyof typeof themes] || themes['default'];
}
