// Helper functions for handling multilingual content

import { Language } from '@/context/LanguageContext';

// Supported languages
export const SUPPORTED_LANGUAGES: Language[] = ['en', 'it', 'es', 'fr', 'de', 'pt', 'ru'];

// Language display names
export const LANGUAGE_NAMES: Record<Language, string> = {
    en: 'English',
    it: 'Italiano',
    es: 'Español',
    fr: 'Français',
    de: 'Deutsch',
    pt: 'Português',
    ru: 'Русский',
};

// Language flags
export const LANGUAGE_FLAGS: Record<Language, string> = {
    en: '🇬🇧',
    it: '🇮🇹',
    es: '🇪🇸',
    fr: '🇫🇷',
    de: '🇩🇪',
    pt: '🇵🇹',
    ru: '🇷🇺',
};

// Extended GROQ query to fetch tours with translations
export const tourWithTranslationsQuery = `
    _id,
    title,
    slug,
    mainImage,
    gallery,
    price,
    duration,
    description,
    highlights,
    includes,
    excludes,
    meetingPoint,
    importantInfo,
    itinerary,
    faqs,
    category,
    badge,
    rating,
    reviewCount,
    groupSize,
    location,
    tags,
    seoTitle,
    seoDescription,
    "translations": {
        "it": {
            "title": translations.it.title,
            "description": translations.it.description,
            "highlights": translations.it.highlights,
            "includes": translations.it.includes,
            "excludes": translations.it.excludes,
            "meetingPoint": translations.it.meetingPoint,
            "importantInfo": translations.it.importantInfo,
            "seoTitle": translations.it.seoTitle,
            "seoDescription": translations.it.seoDescription
        },
        "es": {
            "title": translations.es.title,
            "description": translations.es.description,
            "highlights": translations.es.highlights,
            "includes": translations.es.includes,
            "excludes": translations.es.excludes,
            "meetingPoint": translations.es.meetingPoint,
            "importantInfo": translations.es.importantInfo,
            "seoTitle": translations.es.seoTitle,
            "seoDescription": translations.es.seoDescription
        },
        "fr": {
            "title": translations.fr.title,
            "description": translations.fr.description,
            "highlights": translations.fr.highlights,
            "includes": translations.fr.includes,
            "excludes": translations.fr.excludes,
            "meetingPoint": translations.fr.meetingPoint,
            "importantInfo": translations.fr.importantInfo,
            "seoTitle": translations.fr.seoTitle,
            "seoDescription": translations.fr.seoDescription
        },
        "de": {
            "title": translations.de.title,
            "description": translations.de.description,
            "highlights": translations.de.highlights,
            "includes": translations.de.includes,
            "excludes": translations.de.excludes,
            "meetingPoint": translations.de.meetingPoint,
            "importantInfo": translations.de.importantInfo,
            "seoTitle": translations.de.seoTitle,
            "seoDescription": translations.de.seoDescription
        },
        "pt": {
            "title": translations.pt.title,
            "description": translations.pt.description,
            "highlights": translations.pt.highlights,
            "includes": translations.pt.includes,
            "excludes": translations.pt.excludes,
            "meetingPoint": translations.pt.meetingPoint,
            "importantInfo": translations.pt.importantInfo,
            "seoTitle": translations.pt.seoTitle,
            "seoDescription": translations.pt.seoDescription
        },
        "ru": {
            "title": translations.ru.title,
            "description": translations.ru.description,
            "highlights": translations.ru.highlights,
            "includes": translations.ru.includes,
            "excludes": translations.ru.excludes,
            "meetingPoint": translations.ru.meetingPoint,
            "importantInfo": translations.ru.importantInfo,
            "seoTitle": translations.ru.seoTitle,
            "seoDescription": translations.ru.seoDescription
        }
    }
`;

// Helper to get localized content
export function getLocalizedContent<T>(
    content: T,
    translatedContent: T | undefined,
    language: Language
): T {
    if (language === 'en' || !translatedContent) {
        return content;
    }
    return translatedContent;
}

// Helper to check if translation exists
export function hasTranslation(
    translations: Record<string, any> | undefined,
    language: Language
): boolean {
    if (!translations || language === 'en') return false;
    return !!translations[language]?.title;
}

// Get browser language
export function detectBrowserLanguage(): Language {
    if (typeof window === 'undefined') return 'en';

    const browserLang = navigator.language.split('-')[0];
    if (SUPPORTED_LANGUAGES.includes(browserLang as Language)) {
        return browserLang as Language;
    }
    return 'en';
}
