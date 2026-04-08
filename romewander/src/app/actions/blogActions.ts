
'use server';

import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "@/sanity/env";
import { revalidatePath } from "next/cache";

const client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false, // Write operations generally shouldn't use CDN
    token: process.env.SANITY_API_TOKEN, // REQUIRED for write access
});

interface CreatePostData {
    title: string;
    excerpt: string;
    body: string; // Markdown string
    keywords: string[];
    siteId: string; // NEW
}

export async function createBlogPost(data: CreatePostData) {
    if (!process.env.SANITY_API_TOKEN) {
        throw new Error("Missing SANITY_API_TOKEN. Cannot publish.");
    }

    try {
        // Convert Markdown to specific Portable Text format manually or use a library?
        // For simplicity in this Agentic context, we will try to parse basic markdown to blocks
        // OR we can just save it as a raw string if the schema supported it, 
        // but our schema expects 'block' array.
        // Let's do a simple conversion: 1 paragraph = 1 block.

        // Helper to parse a paragraph into Portable Text spans with bold and links
        const parseParagraph = (text: string) => {
            const children: any[] = [];
            const markDefs: any[] = [];
            let childKey = 0;

            // Regex to match [Link](url) OR **Bold**
            // Captured groups: 1=LinkText, 2=LinkUrl, 3=BoldText
            const regex = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*/g;

            let lastIndex = 0;
            let match;

            while ((match = regex.exec(text)) !== null) {
                // Push text before the match
                if (match.index > lastIndex) {
                    children.push({
                        _type: 'span',
                        _key: `c${childKey++}`,
                        text: text.slice(lastIndex, match.index),
                        marks: []
                    });
                }

                if (match[1] && match[2]) {
                    // It's a LINK
                    const linkKey = `link${markDefs.length}`;
                    markDefs.push({
                        _type: 'link',
                        _key: linkKey,
                        href: match[2]
                    });
                    children.push({
                        _type: 'span',
                        _key: `c${childKey++}`,
                        text: match[1],
                        marks: [linkKey]
                    });
                } else if (match[3]) {
                    // It's BOLD
                    children.push({
                        _type: 'span',
                        _key: `c${childKey++}`,
                        text: match[3],
                        marks: ['strong']
                    });
                }

                lastIndex = regex.lastIndex;
            }

            // Push remaining text
            if (lastIndex < text.length) {
                children.push({
                    _type: 'span',
                    _key: `c${childKey++}`,
                    text: text.slice(lastIndex),
                    marks: []
                });
            }

            // Fallback for empty strings
            if (children.length === 0) {
                children.push({ _type: 'span', _key: `c${childKey++}`, text: '', marks: [] });
            }

            return { children, markDefs };
        };

        const blocks = data.body.split('\n\n').map((para, index) => {
            const blockKey = `b${index}`;

            if (para.startsWith('## ')) {
                const content = para.replace('## ', '');
                return {
                    _type: 'block',
                    _key: blockKey,
                    style: 'h2',
                    children: [{ _type: 'span', _key: `c0`, text: content, marks: [] }],
                    markDefs: []
                };
            }

            const { children, markDefs } = parseParagraph(para);

            return {
                _type: 'block',
                _key: blockKey,
                style: 'normal',
                children,
                markDefs
            };
        });

        // Resolve SITE REFERENCE
        // We need the _id of the site document based on the slug (siteId)
        // If no siteId provided, fallback to default? Better to require it.
        const siteSlug = data.siteId || process.env.NEXT_PUBLIC_SITE_ID || process.env.NEXT_PUBLIC_SITE_ID || 'romewander';

        // Fetch site _id
        const siteQuery = `*[_type == "site" && slug.current == $slug][0]._id`;
        const siteRefId = await client.fetch(siteQuery, { slug: siteSlug });

        if (!siteRefId) {
            return { success: false, error: `Site not found: ${siteSlug}` };
        }

        const doc = {
            _type: 'post',
            site: {
                _type: 'reference',
                _ref: siteRefId
            },
            title: data.title,
            slug: {
                _type: 'slug',
                current: data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 96)
            },
            excerpt: data.excerpt,
            publishedAt: new Date().toISOString(),
            body: blocks,
            keywords: data.keywords
        };

        const result = await client.create(doc);

        revalidatePath('/blog');
        return { success: true, id: result._id };
    } catch (error) {
        console.error("Sanity Create Error:", error);
        return { success: false, error: 'Failed to create post' };
    }
}

export async function getAllTours(siteId?: string) {
    try {
        const targetSite = siteId || process.env.NEXT_PUBLIC_SITE_ID || process.env.NEXT_PUBLIC_SITE_ID || 'romewander';
        // Fetch minimal data needed for context - FILTERED BY SITE
        const query = `*[_type == "tour" && $targetSite in sites[]->slug.current]{title, "slug": slug.current, description, keywords}`;
        const tours = await client.fetch(query, { targetSite }, { next: { revalidate: 0 } });
        return { success: true, tours };
    } catch (error) {
        console.error("Fetch Tours Error:", error);
        return { success: false, error: 'Failed to fetch tours' };
    }
}
