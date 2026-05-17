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
export const DEFAULT_SITE_ID = process.env.NEXT_PUBLIC_SITE_ID || 'your-agency-slug';

// Helper to get site reference from slug
async function getSiteRefBySlug(slug: string): Promise<string | null> {
    try {
        const query = `*[_type == "site" && slug.current == $slug][0]{ _id }`;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
        
        const result = await Promise.race([
            client.fetch(query, { slug }),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Sanity fetch timeout')), 5000))
        ]);
        
        clearTimeout(timeoutId);
        return (result as any)?._id || null;
    } catch (error) {
        console.warn(`[sanityService] Failed to get site ref for "${slug}":`, error);
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
        // Try site filtering first
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

        // FALLBACK: If no tours found with site filter, fetch ALL tours
        // This is ideal for dedicated dashboards where site tagging might be missing
        if (tours.length === 0) {
            console.log(`[sanityService] No tours found for site "${siteId}", fetching all tours from project...`);
            const query = `*[_type == "tour"]{
                _id, title, slug, mainImage { asset -> { _id, url } },
                price, duration, "description": pt::text(description),
                category, "features": highlights, badge, rating, reviewCount,
                tags, guestTypes, includes, excludes, importantInfo, gallery, groupSize, location
            }`;
            tours = await client.fetch(query, {}, { next: { revalidate: 60 } });
        }

        // For goldenrometour, we still might want to filter by vatican category if the user insists,
        // but if they have a dedicated dashboard, they likely only put vatican tours there.
        return siteId === 'goldenrometour' ? tours.filter(t => t.category === 'vatican' || !t.category) : tours;
    } catch (error) {
        console.error('[sanityService] Failed to fetch tours:', error);
        return [];
    }
}

/**
 * Get a single tour by slug
 */
export async function getTour(slug: string, siteId: string = DEFAULT_SITE_ID): Promise<Tour | null> {
    try {
        // Try site-filtered first
        const siteRef = await getSiteRefBySlug(siteId);
        let tour = null;

        if (siteRef) {
            const query = `*[_type == "tour" && slug.current == $slug && $siteRef in sites[]._ref][0]{
                ...,
                "features": highlights,
                mainImage { asset -> { _id, url } },
                gallery[] { asset -> { _id, url } }
            }`;
            tour = await client.fetch(query, { slug, siteRef }, { next: { revalidate: 60 } });
        }

        // FALLBACK: Fetch by slug only
        if (!tour) {
            const query = `*[_type == "tour" && slug.current == $slug][0]{
                ...,
                "features": highlights,
                mainImage { asset -> { _id, url } },
                gallery[] { asset -> { _id, url } }
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

        const result = await Promise.race([
            client.fetch(query, { siteId }),
            new Promise<any[]>((resolve) => setTimeout(() => resolve([]), 2000))
        ]);

        return result || [];
    } catch (error) {
        console.error('[sanityService] Failed to fetch posts:', error);
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

        let settings = await Promise.race([
            client.fetch(query, { siteId }, { next: { revalidate: 60 } }),
            new Promise<null>((resolve) => setTimeout(() => resolve(null), 2000))
        ]);

        // FALLBACK: If no settings found for site, get the first one available
        if (!settings) {
            console.log(`[sanityService] No settings found for site "${siteId}", fetching first available settings...`);
            settings = await client.fetch(`*[_type == "settings"][0]{ ... }`);
        }

        return settings || null;
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

        let site = await client.fetch(query, { siteId }, { next: { revalidate: 60 } });

        // FALLBACK: If no site found by slug, get the first active one
        if (!site) {
            console.log(`[sanityService] No site found for slug "${siteId}", fetching first active site...`);
            site = await client.fetch(`*[_type == "site" && isActive == true][0]{ ... }`);
        }

        return site;
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
