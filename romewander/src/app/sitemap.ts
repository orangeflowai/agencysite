import { MetadataRoute } from 'next';
import { getTours, getPosts } from '@/lib/dataAdapter';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com';

    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
        { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
        { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
        { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
        { url: `${baseUrl}/faq`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
        { url: `${baseUrl}/search`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
        { url: `${baseUrl}/category/colosseum`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
        { url: `${baseUrl}/category/vatican`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
        { url: `${baseUrl}/category/city`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
        { url: `${baseUrl}/category/hidden-gems`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
        { url: `${baseUrl}/privacy-policy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
        { url: `${baseUrl}/terms-and-conditions`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
        { url: `${baseUrl}/cancellation-policy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    ];

    // Dynamic tour pages
    let tourPages: MetadataRoute.Sitemap = [];
    try {
        const tours = await getTours();
        tourPages = tours.map(tour => ({
            url: `${baseUrl}/tour/${tour.slug.current}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.9,
        }));
    } catch (_) {}

    // Dynamic blog pages
    let blogPages: MetadataRoute.Sitemap = [];
    try {
        const posts = await getPosts();
        blogPages = posts.map(post => ({
            url: `${baseUrl}/blog/${post.slug.current}`,
            lastModified: new Date(post.publishedAt || Date.now()),
            changeFrequency: 'monthly' as const,
            priority: 0.6,
        }));
    } catch (_) {}

    return [...staticPages, ...tourPages, ...blogPages];
}
