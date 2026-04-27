'use client';

import { useState, useRef, useEffect } from 'react';
import { Globe, Check } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
];

/** Remove Google Translate cookies and restore original page language without a full reload */
function restoreToEnglish() {
    const hostname = window.location.hostname;
    // Clear googtrans cookie on all path/domain variants
    ['/', ''].forEach(path => {
        [hostname, '.' + hostname, ''].forEach(domain => {
            const domainPart = domain ? `; domain=${domain}` : '';
            document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path || '/'}${domainPart}`;
        });
    });

    // Remove GT body offset
    document.body.style.removeProperty('top');

    // Remove GT banner iframe if injected
    const banner = document.querySelector('.goog-te-banner-frame') as HTMLElement | null;
    if (banner) banner.style.display = 'none';

    // Trigger GT's own "show original" via the hidden select
    const select = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
    if (select && select.value !== '') {
        select.value = '';
        select.dispatchEvent(new Event('change'));
    }
}

export default function LanguageSwitcher() {
    const { language, setLanguage } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const currentLang = languages.find(l => l.code === language) || languages[0];

    const handleLanguageChange = (langCode: string) => {
        setLanguage(langCode as any);
        setIsOpen(false);

        if (typeof window === 'undefined') return;

        if (langCode === 'en') {
            restoreToEnglish();
            return;
        }

        // Switch to non-English via Google Translate
        const select = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
        if (select) {
            select.value = langCode;
            select.dispatchEvent(new Event('change'));
        } else {
            // GT not loaded yet — set cookie so it picks up on next render
            document.cookie = `googtrans=/en/${langCode}; path=/`;
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium text-foreground"
                aria-label="Select language"
            >
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline">{currentLang.flag}</span>
                <span className=" text-xs">{currentLang.code}</span>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-card rounded-xl shadow-lg border border-border py-2 z-50">
                    <div className="px-3 py-2 border-b border-border">
                        <p className="text-xs font-semibold text-muted-foreground  tracking-wider">Select Language</p>
                    </div>
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => handleLanguageChange(lang.code)}
                            className={`w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-muted transition-colors ${
                                language === lang.code ? 'text-primary bg-background' : 'text-foreground'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-lg">{lang.flag}</span>
                                <span className={language === lang.code ? 'font-semibold' : ''}>{lang.name}</span>
                            </div>
                            {language === lang.code && <Check className="w-4 h-4" />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
