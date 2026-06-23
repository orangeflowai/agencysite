import { createClient } from 'next-sanity';
import { createImageUrlBuilder } from '@sanity/image-url';

// Define Interfaces
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
    description: any; // Portable Text blocks
    category: string;
    features: string[];
    highlights?: string[]; // Alias for features
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
    maxParticipants?: number;
    sites?: Array<{ _ref: string; _type: 'reference' }>;
    gallery?: any[];
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
    site?: { _ref: string };
}

export interface Settings {
    heroTitle?: string;
    heroSubtitle?: string;
    heroVideo?: { asset: { _id: string; url: string } };
    heroImage?: { asset: { _id: string; url: string } };
    site?: { _ref: string };
}

// Client Configuration
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const apiVersion = '2024-01-01';

export const client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: true, // Enable CDN for better performance and higher rate limits
});

// Helper for image URLs
const builder = createImageUrlBuilder(client);

export function urlFor(source: any) {
    if (typeof source === 'string') { const s: any = { url: () => source, width: () => s, height: () => s, fit: () => s, auto: () => s, quality: () => s }; return s; }
    if (!source) return { width: () => ({ url: () => '' }), height: () => ({ url: () => '' }), url: () => '' };
    return builder.image(source);
}

// Site Configuration
export const DEFAULT_SITE_ID = process.env.NEXT_PUBLIC_SITE_ID || 'romewander';

// Hardcoded site info for small agency (rarely changes)
export const HARDCODED_SITE_INFO = {
  title: 'Rome Wander',
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "info@romeagency.com",
  contactPhone: '+39 351 419 9425',
  whatsappNumber: '3514199425',
  logoText: 'Rome',
  logoTextAccent: 'Wander',
  brandColors: {
    primary: { hex: '#0f4c3a' },
    secondary: { hex: '#f5f5dc' },
    accent: { hex: '#C9A84C' }
  },
  businessInfo: {
    companyName: 'Rome Wander Tours',
    vatNumber: 'IT12345678901',
    registeredAddress: 'Via Roma 1, 00100 Roma, Italy'
  },
  socialLinks: {
    instagram: 'https://instagram.com/romewander',
    facebook: 'https://facebook.com/romewander',
    tripadvisor: 'https://tripadvisor.com/romewander'
  }
};

// Hardcoded hero settings (rarely changes)
export const HARDCODED_HERO_SETTINGS: Partial<Settings> = {
  heroTitle: 'Discover Vatican City with Expert Guides',
  heroSubtitle: 'Skip-the-line tours, small groups, unforgettable experiences in the heart of Rome',
};

// Helper to get site reference from slug
async function getSiteRefBySlug(slug: string): Promise<string | null> {
    try {
        const query = `*[_type == "site" && slug.current == $slug][0]{ _id }`;
        const result = await client.fetch(query, { slug });
        return result?._id || null;
    } catch (error) {
        console.error('Failed to get site ref:', error);
        return null;
    }
}

/**
 * Get tours for a specific site
 * Refactored for dedicated dashboards:
 * 1. Try fetching with site filtering (legacy/multi-tenant)
 * 2. If empty, fetch ALL tours from the project (dedicated dashboard mode)
 */
export async function getTours(siteId: string = DEFAULT_SITE_ID): Promise<Tour[]> {
    try {
        const siteRef = await getSiteRefBySlug(siteId);
        let tours = [];

        if (siteRef) {
            const query = `*[_type == "tour" && $siteRef in sites[]._ref]{
                _id, title, slug, mainImage { asset -> { _id, url } },
                price, duration, "description": pt::text(description),
                category, "features": highlights, badge, rating, reviewCount,
                tags, guestTypes, includes, excludes, importantInfo, sites
            }`;
            tours = await client.fetch(query, { siteRef }, { next: { revalidate: 60 } });
        }

        // FALLBACK: Fetch ALL tours if site-specific search yields nothing
        if (tours.length === 0) {
            console.log(`[Sanity] No tours found for site "${siteId}", fetching all tours from dashboard...`);
            const query = `*[_type == "tour"]{
                _id, title, slug, mainImage { asset -> { _id, url } },
                price, duration, "description": pt::text(description),
                category, "features": highlights, badge, rating, reviewCount,
                tags, guestTypes, includes, excludes, importantInfo, gallery, groupSize, location
            }`;
            tours = await client.fetch(query, {}, { next: { revalidate: 60 } });
        }
        
        // Filter out tours without images only if we have plenty of tours
        const toursWithImages = tours.filter((t: any) => t.mainImage?.asset?.url);
        return toursWithImages.length > 0 ? toursWithImages : tours;
    } catch (error) {
        console.error('[Sanity] Failed to fetch tours:', error);
        return [];
    }
}

/**
 * Get a single tour by slug
 */
export async function getTour(slug: string, siteId: string = DEFAULT_SITE_ID): Promise<Tour | null> {
    try {
        const siteRef = await getSiteRefBySlug(siteId);
        let tour = null;

        if (siteRef) {
            const query = `*[_type == "tour" && slug.current == $slug && $siteRef in sites[]._ref][0]{
                ...,
                "features": highlights
            }`;
            tour = await client.fetch(query, { slug, siteRef }, { next: { revalidate: 60 } });
        }

        if (!tour) {
            const query = `*[_type == "tour" && slug.current == $slug][0]{
                ...,
                "features": highlights
            }`;
            tour = await client.fetch(query, { slug }, { next: { revalidate: 60 } });
        }

        return tour;
    } catch (error) {
        console.error('Failed to fetch tour:', error);
        return null;
    }
}

/**
 * Get all tours (admin function - no site filtering)
 */
export async function getAllTours(): Promise<Tour[]> {
    try {
        const query = `*[_type == "tour"]{
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
            badge,
            rating,
            reviewCount,
            tags,
            guestTypes,
            sites[]->{ _id, title, slug }
        }`;

        return await client.fetch(query, {}, { next: { revalidate: 0 } });
    } catch (error) {
        console.error('Failed to fetch all tours:', error);
        return [];
    }
}

/**
 * Get blog posts for a specific site
 */
export async function getPosts(siteId: string = DEFAULT_SITE_ID): Promise<Post[]> {
    try {
        const query = `*[_type == "post" && site->slug.current == $siteId] | order(publishedAt desc) {
            _id,
            title,
            slug,
            mainImage {
                asset -> { _id, url }
            },
            publishedAt,
            excerpt,
            keywords,
            "site": site->{ _id, title, slug }
        }`;

        return await client.fetch(query, { siteId });
    } catch (error) {
        console.error('Failed to fetch posts:', error);
        return [];
    }
}

/**
 * Get a single blog post by slug
 */
export async function getPost(slug: string, siteId: string = DEFAULT_SITE_ID): Promise<Post | null> {
    try {
        const query = `*[_type == "post" && slug.current == $slug && site->slug.current == $siteId][0]{
            ...,
            mainImage { asset -> { _id, url } },
            "site": site->{ _id, title, slug }
        }`;

        return await client.fetch(query, { slug, siteId });
    } catch (error) {
        console.error('Failed to fetch post:', error);
        return null;
    }
}

/**
 * Get settings for a specific site
 * Falls back to first available settings if site-specific ones are missing
 */
export async function getSettings(siteId: string = DEFAULT_SITE_ID): Promise<Settings | null> {
    try {
        const query = `*[_type == "settings" && site->slug.current == $siteId][0]{
            heroTitle,
            heroSubtitle,
            heroVideo { asset -> { _id, url } },
            heroImage { asset -> { _id, url } },
            "site": site->{ _id, title, slug }
        }`;

        let settings = await client.fetch(query, { siteId }, { next: { revalidate: 60 } });
        
        // FALLBACK: If no settings found for site, get the first one available in dashboard
        if (!settings) {
            console.log(`[Sanity] No settings found for site "${siteId}", fetching first available settings...`);
            settings = await client.fetch(`*[_type == "settings"][0]{ ... }`);
        }

        return settings || (HARDCODED_HERO_SETTINGS as Settings);
    } catch (error) {
        console.error('Failed to fetch settings, using hardcoded:', error);
        return HARDCODED_HERO_SETTINGS as Settings;
    }
}

/**
 * Get site information
 * Merges Sanity data with hardcoded fallbacks
 */
export async function getSite(siteId: string = DEFAULT_SITE_ID): Promise<Site | null> {
    try {
        const query = `*[_type == "site" && slug.current == $siteId && isActive == true][0]{
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

        let sanitySite = await client.fetch(query, { siteId }, { next: { revalidate: 60 } });
        
        // FALLBACK: If no site found by slug, get the first active one in dashboard
        if (!sanitySite) {
            console.log(`[Sanity] No site doc found for slug "${siteId}", fetching first active site...`);
            sanitySite = await client.fetch(`*[_type == "site" && isActive == true][0]{ ... }`);
        }

        // Merge Sanity data with hardcoded fallbacks
        if (sanitySite) {
            return {
                ...HARDCODED_SITE_INFO,
                ...sanitySite,
                // Ensure critical fields have fallbacks
                contactEmail: sanitySite.contactEmail || HARDCODED_SITE_INFO.contactEmail,
                contactPhone: sanitySite.contactPhone || HARDCODED_SITE_INFO.contactPhone,
                whatsappNumber: sanitySite.whatsappNumber || HARDCODED_SITE_INFO.whatsappNumber,
                logoText: sanitySite.logoText || HARDCODED_SITE_INFO.logoText,
                logoTextAccent: sanitySite.logoTextAccent || HARDCODED_SITE_INFO.logoTextAccent,
                brandColors: sanitySite.brandColors || HARDCODED_SITE_INFO.brandColors,
                businessInfo: sanitySite.businessInfo || HARDCODED_SITE_INFO.businessInfo,
                socialLinks: sanitySite.socialLinks || HARDCODED_SITE_INFO.socialLinks,
            } as Site;
        }
        
        // If no Sanity site, return hardcoded with basic structure
        return {
            _id: siteId,
            slug: { current: siteId },
            isActive: true,
            ...HARDCODED_SITE_INFO
        } as Site;
    } catch (error) {
        console.error('Failed to fetch site, using hardcoded:', error);
        return {
            _id: siteId,
            slug: { current: siteId },
            isActive: true,
            ...HARDCODED_SITE_INFO
        } as Site;
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
