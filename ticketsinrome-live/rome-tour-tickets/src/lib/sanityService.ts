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
    useCdn: false,
});

// Helper for image URLs
const builder = createImageUrlBuilder(client);

export function urlFor(source: any) {
    if (!source) return { width: () => ({ url: () => '' }), height: () => ({ url: () => '' }), url: () => '' };
    return builder.image(source);
}

// Site Configuration
export const DEFAULT_SITE_ID = process.env.NEXT_PUBLIC_SITE_ID || 'rome-tour-tickets';

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
 * Uses the sites array to filter tours that belong to the given site
 */
export async function getTours(siteId: string = DEFAULT_SITE_ID): Promise<Tour[]> {
    try {
        // First get the actual site document _id from the slug
        const siteRef = await getSiteRefBySlug(siteId);

        if (!siteRef) {
            console.warn(`Site with slug "${siteId}" not found. Returning empty tours.`);
            return [];
        }

        // Query tours where the sites array contains a reference to this site
        const query = `*[_type == "tour" && $siteRef in sites[]._ref]{
            _id,
            title,
            slug,
            mainImage {
                asset -> {
                    _id,
                    "url": url + "?w=400&h=267&fit=crop&auto=format&q=75"
                }
            },
            price,
            duration,
            "description": pt::text(description),
            category,
            "features": highlights,
            badge,
            rating,
            reviewCount,
            groupSize,
            tags,
            includes,
            excludes,
            importantInfo,
            sites
        }`;

        return await client.fetch(query, { siteRef }, { next: { revalidate: 3600 } });
    } catch (error) {
        console.error('Failed to fetch tours:', error);
        return [];
    }
}

/**
 * Get a single tour by slug
 */
export async function getTour(slug: string, siteId: string = DEFAULT_SITE_ID): Promise<Tour | null> {
    try {
        const siteRef = await getSiteRefBySlug(siteId);

        if (!siteRef) {
            console.warn(`Site with slug "${siteId}" not found.`);
            return null;
        }

        const query = `*[_type == "tour" && slug.current == $slug && $siteRef in sites[]._ref][0]{
            ...,
            "features": highlights
        }`;

        return await client.fetch(query, { slug, siteRef }, { next: { revalidate: 3600 } });
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
                asset -> { _id, "url": url + "?w=400&h=267&fit=crop&auto=format&q=75" }
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
            sites[]->{ _id, title, slug }
        }`;

        return await client.fetch(query, {}, { next: { revalidate: 3600 } });
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
                asset -> { _id, "url": url + "?w=400&h=267&fit=crop&auto=format&q=75" }
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
            mainImage { asset -> { _id, "url": url + "?w=400&h=267&fit=crop&auto=format&q=75" } },
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
 */
export async function getSettings(siteId: string = DEFAULT_SITE_ID): Promise<Settings | null> {
    try {
        const query = `*[_type == "settings" && site->slug.current == $siteId][0]{
            heroTitle,
            heroSubtitle,
            heroVideo { asset -> { _id, url } },
            heroImage { asset -> { _id, "url": url + "?w=1920&h=1080&fit=crop&auto=format&q=85" } },
            "site": site->{ _id, title, slug }
        }`;

        return await client.fetch(query, { siteId }, { next: { revalidate: 60 } });
    } catch (error) {
        console.error('Failed to fetch settings:', error);
        return null;
    }
}

/**
 * Get site information
 */
export async function getSite(siteId: string = DEFAULT_SITE_ID): Promise<Site | null> {
    try {
        const query = `*[_type == "site" && slug.current == $siteId && isActive == true][0]{
            _id,
            title,
            slug,
            domain,
            isActive,
            logo { asset -> { _id, "url": url + "?w=400&h=267&fit=crop&auto=format&q=75" } },
            favicon { asset -> { _id, "url": url + "?w=400&h=267&fit=crop&auto=format&q=75" } },
            logoText,
            logoTextAccent,
            seo {
                metaTitle,
                metaDescription,
                keywords,
                ogImage { asset -> { _id, "url": url + "?w=400&h=267&fit=crop&auto=format&q=75" } }
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

        return await client.fetch(query, { siteId }, { next: { revalidate: 300 } });
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
            logo { asset -> { _id, "url": url + "?w=400&h=267&fit=crop&auto=format&q=75" } }
        }`;

        return await client.fetch(query);
    } catch (error) {
        console.error('Failed to fetch sites:', error);
        return [];
    }
}
