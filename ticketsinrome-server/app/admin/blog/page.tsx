'use client';

import { useState, useEffect } from 'react';
import { client } from '@/sanity/lib/client';
import { Loader2, Plus, ExternalLink, Edit, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';
import AIBlogAssistant from '@/components/admin/AIBlogAssistant';

interface BlogPost {
    _id: string;
    title: string;
    slug: { current: string };
    publishedAt: string;
    mainImage?: any;
    author?: { name: string };
}

export default function AdminBlogPage() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAIAssistant, setShowAIAssistant] = useState(false);

    useEffect(() => {
        async function fetchPosts() {
            try {
                const query = `*[_type == "post"] | order(publishedAt desc) {
                    _id,
                    title,
                    slug,
                    publishedAt,
                    mainImage,
                    author->{name}
                }`;
                const data = await client.fetch(query);
                setPosts(data);
            } catch (error) {
                console.error("Failed to fetch posts:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchPosts();
    }, []);

    const handleAIApply = (content: {
        title: string;
        excerpt: string;
        body: any[];
        keywords: string[];
    }) => {
        // Open Sanity studio with pre-filled data
        // For now, we'll open the studio - in a full implementation,
        // you could pass this data to a custom creation form
        const studioUrl = `/studio/structure/post?ai_title=${encodeURIComponent(content.title)}&ai_excerpt=${encodeURIComponent(content.excerpt)}`;
        window.open(studioUrl, '_blank');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* AI Assistant Modal */}
            {showAIAssistant && (
                <AIBlogAssistant
                    onApply={handleAIApply}
                    onClose={() => setShowAIAssistant(false)}
                />
            )}

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Blog Posts</h1>
                    <p className="text-sm text-muted-foreground">Manage your travel guides and articles.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setShowAIAssistant(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold rounded-lg hover:opacity-90 transition-colors shadow-sm"
                    >
                        <Sparkles size={18} />
                        AI Write
                    </button>
                    <Link
                        href="/studio/structure/post"
                        target="_blank"
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-bold rounded-lg hover:opacity-90 transition-colors shadow-sm"
                    >
                        <Plus size={18} />
                        Create New Post
                    </Link>
                </div>
            </div>

            {/* AI Promo Banner */}
            <div className="bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-100 rounded-xl p-4 flex items-center gap-4">
                <div className="p-3 bg-violet-100 rounded-lg">
                    <Sparkles className="w-6 h-6 text-violet-600" />
                </div>
                <div className="flex-1">
                    <h3 className="font-bold text-violet-900">New: AI Blog Assistant</h3>
                    <p className="text-sm text-violet-700">Generate SEO-optimized blog posts in seconds with AI</p>
                </div>
                <button
                    onClick={() => setShowAIAssistant(true)}
                    className="px-4 py-2 bg-violet-600 text-white font-medium rounded-lg hover:bg-violet-700 transition-colors"
                >
                    Try it now
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {posts.length > 0 ? (
                    posts.map(post => (
                        <div key={post._id} className="bg-card rounded-xl shadow-sm border border-border overflow-hidden group hover:shadow-md transition-shadow">
                            <div className="aspect-video relative bg-gray-100">
                                {post.mainImage ? (
                                    <Image
                                        src={urlFor(post.mainImage).url()}
                                        alt={post.title}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-muted-foreground">
                                        <span className="text-4xl font-bold opacity-20">No Image</span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                            </div>

                            <div className="p-5">
                                <div className="flex items-center gap-2 mb-3 text-xs font-medium text-muted-foreground">
                                    <span>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Draft'}</span>
                                    <span>•</span>
                                    <span>{post.author?.name || 'Unknown Author'}</span>
                                </div>
                                <h3 className="font-bold text-foreground mb-4 line-clamp-2 min-h-[3rem]">
                                    {post.title}
                                </h3>

                                <div className="flex items-center gap-3 mt-auto pt-4 border-t border-border">
                                    <Link
                                        href={`/studio/structure/post;${post._id}`}
                                        target="_blank"
                                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-bold text-emerald-700 bg-secondary rounded-lg hover:bg-emerald-100 transition-colors"
                                    >
                                        <Edit size={14} />
                                        Edit in Studio
                                    </Link>
                                    <Link
                                        href={`/blog/${post.slug?.current}`}
                                        target="_blank"
                                        className="p-2 text-muted-foreground hover:text-primary hover:bg-muted rounded-lg transition-colors"
                                        title="View Live"
                                    >
                                        <ExternalLink size={18} />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-12 text-center text-muted-foreground bg-muted rounded-xl border border-dashed border-border">
                        <p>No blog posts found.</p>
                        <button
                            onClick={() => setShowAIAssistant(true)}
                            className="mt-4 text-violet-600 font-medium hover:underline"
                        >
                            Create your first one with AI →
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
