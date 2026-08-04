import { createClient } from 'next-sanity';
import { createImageUrlBuilder } from '@sanity/image-url';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface Site {
    _id: string;
    title: string;
    slug: { current: string };
    domain?: string;
    isActive: boolean;
    logo?: { asset: { _id: string; url: string } };
    favicon?: { asset: { _id: string; url: string } };
    logoText?: string;
    logoTextAccent?: string;
    seo?: {
        metaTitle?: string;
        metaDescription?: string;
        keywords?: string[];
        ogImage?: { asset: { _id: string; url: string } };
    }
    brandColors?: {
        primary?: { hex: string };
        secondary?: { hex: string };
        accent?: { hex: string };
    }
    contactEmail?: string;
    contactPhone?: string;
    whatsappNumber?: string;
    officeAddress?: string;
    mapLink?: string;
    socialLinks?: {
        facebook?: string;
        instagram?: string;
        twitter?: string;
        tripadvisor?: string;
        youtube?: string;
        linkedin?: string;
    }
    businessInfo?: {
        companyName?: string;
        vatNumber?: string;
        reaNumber?: string;
        registeredAddress?: string;
        pecEmail?: string;
        sdiCode?: string;
        shareCapital?: string;
    }
    gdprSettings?: {
        cookieBannerTitle?: string;
        cookieBannerText?: string;
        acceptButtonText?: string;
        declineButtonText?: string;
        privacyPolicyLink?: string;
        privacyPolicyText?: string;
        showCookieBanner?: boolean;
        gdprComplianceRegion?: string;
    }
    legalLinks?: {
        privacyPolicy?: string;
        termsAndConditions?: string;
        cookiePolicy?: string;
        cancellationPolicy?: string;
    }
}

export interface Tour {
    _id: string;
    title: string;
    slug: { current: string };
    mainImage?: any;
    price: number;
    duration: string;
    description: any;
    category: string;
    features: string[];
    highlights?: string[];
    badge?: string;
    rating?: number;
    reviewCount?: number;
    groupSize?: string;
    location?: string;
    studentPrice?: number;
    youthPrice?: number;
    tags?: string[];
    includes?: string[];
    excludes?: string[];
    importantInfo?: string[];
    itinerary?: Array<{ title: string; duration: string; description: string }>;
    meetingPoint?: string;
    mapAddress?: string;
    maxParticipants?: number;
    gallery?: any[];
    guestTypes?: Array<{ name: string; price: number; description?: string; _key?: string }>;
}

export interface Post {
    _id: string;
    title: string;
    slug: { current: string };
    mainImage?: any;
    publishedAt: string;
    excerpt: string;
    keywords?: string[];
    body?: any;
}

export interface Settings {
    heroTitle?: string;
    heroSubtitle?: string;
    heroVideo?: { asset: { _id: string; url: string } };
    heroImage?: { asset: { _id: string; url: string } };
}

// ── Sanity client ─────────────────────────────────────────────────────────────

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'aknmkkwd';
const dataset   = process.env.NEXT_PUBLIC_SANITY_DATASET   || 'production';
const apiVersion = '2024-01-01';

export const client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    token: process.env.SANITY_API_TOKEN,
    perspective: 'published',
});

const builder = createImageUrlBuilder(client);

export function urlFor(source: any) {
    if (!source) return { url: () => '', width: () => ({ url: () => '' }), height: () => ({ url: () => '' }) };
    return builder.image(source);
}

// ── Site ID ───────────────────────────────────────────────────────────────────

// ticketsinrome Sanity site _id
const TICKETSINROME_SITE_ID = 'tickets-in-rome-site';

export const DEFAULT_SITE_ID = process.env.NEXT_PUBLIC_SITE_ID || 'ticketsinrome';

// ── Tours ─────────────────────────────────────────────────────────────────────

// Map a slug-based siteId to the Sanity site _id reference
function resolveSiteRef(siteId?: string): string {
    const map: Record<string, string> = {
        'ticketsinrome': 'tickets-in-rome-site',
        'rome-tour-tickets': 'tickets-in-rome-site',
        'tickets-in-rome-site': 'tickets-in-rome-site',
    };
    return map[siteId || ''] || TICKETSINROME_SITE_ID;
}

export async function getTours(siteId?: string): Promise<Tour[]> {
    const resolvedId = resolveSiteRef(siteId);
    try {
        const query = `*[_type == "tour" && $siteId in sites[]._ref] | order(_createdAt asc) {
            _id,
            title,
            slug,
            mainImage {
                asset -> { _id, url }
            },
            price,
            duration,
            "description": pt::text(description),
            category,
            "features": highlights,
            highlights,
            badge,
            rating,
            reviewCount,
            groupSize,
            tags,
            guestTypes,
            includes,
            excludes,
            importantInfo,
            meetingPoint,
            mapAddress,
            maxParticipants
        }`;

        return await client.fetch(query, { siteId: resolvedId }, { next: { revalidate: 0 } });
    } catch (error) {
        console.error('[sanityService] Failed to fetch tours:', error);
        return [];
    }
}

export async function getTour(slug: string): Promise<Tour | null> {
    if (!slug) return null;
    try {
        const query = `*[_type == "tour" && slug.current == $slug && $siteId in sites[]._ref][0]{
            ...,
            mainImage { asset -> { _id, url } },
            gallery[]{ asset -> { _id, url } },
            "features": highlights
        }`;

        return await client.fetch(query, { slug, siteId: TICKETSINROME_SITE_ID }, { next: { revalidate: 0 } });
    } catch (error) {
        console.error('[sanityService] Failed to fetch tour:', error);
        return null;
    }
}

// ── Posts ─────────────────────────────────────────────────────────────────────

export async function getPosts(): Promise<Post[]> {
    try {
        const query = `*[_type == "post" && site._ref == $siteId] | order(publishedAt desc) {
            _id, title, slug,
            mainImage { asset -> { _id, url } },
            publishedAt, excerpt, keywords
        }`;

        return await client.fetch(query, { siteId: TICKETSINROME_SITE_ID });
    } catch (error) {
        console.error('[sanityService] Failed to fetch posts:', error);
        return [];
    }
}

export async function getPost(slug: string): Promise<Post | null> {
    try {
        const query = `*[_type == "post" && slug.current == $slug && site._ref == $siteId][0]{
            ..., mainImage { asset -> { _id, url } }
        }`;

        return await client.fetch(query, { slug, siteId: TICKETSINROME_SITE_ID });
    } catch (error) {
        console.error('[sanityService] Failed to fetch post:', error);
        return null;
    }
}

// ── Settings ──────────────────────────────────────────────────────────────────

export async function getSettings(): Promise<Settings | null> {
    try {
        const query = `*[_type == "settings" && site._ref == $siteId][0]{
            heroTitle, heroSubtitle,
            heroVideo { asset -> { _id, url } },
            heroImage { asset -> { _id, url } }
        }`;

        return await client.fetch(query, { siteId: TICKETSINROME_SITE_ID }, { next: { revalidate: 0 } });
    } catch (error) {
        console.error('[sanityService] Failed to fetch settings:', error);
        return null;
    }
}

/**
 * Get site information
 */
export async function getSite(siteId: string = DEFAULT_SITE_ID): Promise<Site | null> {
    try {
        const query = `*[_type == "site" && (slug.current == $siteId || _id == $siteId) && isActive == true][0]{
            _id,
            title,
            slug,
            domain,
            isActive,
            logo { asset -> { _id, url } },
            favicon { asset -> { _id, url } },
            logoText,
            logoTextAccent,
            seo {
                metaTitle,
                metaDescription,
                keywords,
                ogImage { asset -> { _id, url } }
            },
            brandColors,
            contactEmail,
            contactPhone,
            whatsappNumber,
            officeAddress,
            mapLink,
            socialLinks,
            businessInfo,
            gdprSettings,
            legalLinks
        }`;

        return await client.fetch(query, { siteId }, { next: { revalidate: 60 } });
    } catch (error) {
        console.error('Failed to fetch site:', error);
        return null;
    }
}

/**
 * Get all active sites
 */
export async function getAllSites(): Promise<Site[]> {
    try {
        const query = `*[_type == "site" && isActive == true]{
            _id,
            title,
            slug,
            domain,
            isActive,
            logo { asset -> { _id, url } },
            brandColors
        }`;

        return await client.fetch(query);
    } catch (error) {
        console.error('Failed to fetch sites:', error);
        return [];
    }
}

// Alias for compatibility with dataAdapter
export const getAllTours = getTours;
