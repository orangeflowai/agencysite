'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';

// Add Google Translate types
declare global {
    interface Window {
        googleTranslateElementInit: () => void;
        google: {
            translate: {
                TranslateElement: {
                    new(options: object, elementId: string): void;
                    InlineLayout: {
                        VERTICAL: number;
                        HORIZONTAL: number;
                        SIMPLE: number;
                    };
                };
            };
        };
    }
}

export default function GoogleTranslate() {
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        // Initialize Google Translate
        window.googleTranslateElementInit = () => {
            if (window.google && window.google.translate) {
                new window.google.translate.TranslateElement(
                    {
                        pageLanguage: 'en',
                        includedLanguages: 'en,it,es,fr,de,pt,ru',
                        layout: window.google.translate.TranslateElement.InlineLayout.HORIZONTAL,
                        autoDisplay: false,
                    },
                    'google_translate_element'
                );
                setLoaded(true);

                // Hide the default Google Translate widget
                const style = document.createElement('style');
                style.innerHTML = `
                    .goog-te-banner-frame { display: none !important; }
                    .goog-te-gadget { display: none !important; }
                    .goog-te-combo { display: none !important; }
                    body { top: 0 !important; }
                    .skiptranslate { display: none !important; }
                    #goog-gt-tt { display: none !important; }
                `;
                document.head.appendChild(style);
            }
        };
    }, []);

    return (
        <>
            <Script
                src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
                strategy="afterInteractive"
                onLoad={() => console.log('Google Translate loaded')}
            />
            {/* Hidden container for Google Translate */}
            <div id="google_translate_element" style={{ display: 'none' }} />
        </>
    );
}

// Hook to programmatically change translation
export function useGoogleTranslate() {
    const translateTo = (languageCode: string) => {
        if (typeof window !== 'undefined') {
            const googleTranslateDropdown = document.querySelector('.goog-te-combo') as HTMLSelectElement;
            if (googleTranslateDropdown) {
                googleTranslateDropdown.value = languageCode;
                googleTranslateDropdown.dispatchEvent(new Event('change'));
                return true;
            }
        }
        return false;
    };

    return { translateTo };
}
