
import React from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getPost, getPosts } from '@/lib/dataAdapter';
import { urlFor } from '@/lib/dataAdapter';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { PortableText } from '@portabletext/react';
import { Calendar, User, ArrowLeft, Clock } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 60; // Revalidate every minute

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    const posts = await getPosts();
    return posts.map(p => ({ slug: p.slug.current }));
}

export async function generateMetadata({ params }: PageProps) {
    const { slug } = await params;
    const post = await getPost(slug);

    if (!post) {
        return {
            title: 'Post Not Found - Wonders of Rome',
        };
    }

    return {
        title: `${post.title} | Wonders of Rome Blog`,
        description: post.excerpt,
        keywords: post.keywords,
        openGraph: {
            images: [post.mainImage?.asset?.url || ''],
        },
    };
}

export default async function BlogPostPage({ params }: PageProps) {
    const { slug } = await params;
    const post = await getPost(slug);

    if (!post) {
        notFound();
    }

    // Expand main image URL if possible, or fallback
    const heroImage = post.mainImage?.asset?.url || 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=80';

    return (
        <main className="min-h-screen bg-cream selection:bg-olive selection:text-white">
            <Navbar />

            {/* Progress Bar (Optional, can be added later) */}

            <article className="pb-20">
                {/* Hero Header */}
                <header className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
                    <Image
                        src={heroImage}
                        alt={post.title}
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />

                    <div className="relative z-10 container mx-auto px-4 text-center max-w-4xl pt-20">
                        <div className="flex items-center justify-center gap-4 text-emerald-300 font-bold tracking-widest uppercase mb-6 text-sm">
                            <Link href="/blog" className="hover:text-white transition-colors flex items-center gap-2">
                                <ArrowLeft className="w-4 h-4" /> Back to Blog
                            </Link>
                            <span>•</span>
                            <span>Travel Guide</span>
                        </div>

                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-8 leading-tight drop-shadow-2xl">
                            {post.title}
                        </h1>

                        <div className="flex flex-wrap items-center justify-center gap-6 text-lg text-emerald-50 font-medium">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-emerald-400" />
                                {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric'
                                }) : 'Recently Updated'}
                            </div>
                            <div className="flex items-center gap-2">
                                <User className="w-5 h-5 text-emerald-400" />
                                Rome Expert
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="w-5 h-5 text-emerald-400" />
                                5 min read
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <div className="container mx-auto px-4 -mt-20 relative z-20">
                    <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 lg:p-16 max-w-4xl mx-auto border border-emerald-50">
                        {/* Excerpt */}
                        <div className="text-xl md:text-2xl font-serif text-emerald-900 leading-relaxed mb-12 border-l-4 border-olive pl-6 italic">
                            {post.excerpt}
                        </div>

                        {/* Body - Portable Text or String */}
                        <div className="prose prose-lg md:prose-xl prose-emerald prose-headings:font-serif prose-headings:font-bold prose-headings:text-emerald-950 prose-p:text-gray-700 prose-p:leading-loose prose-li:text-gray-700 max-w-none">
                            {(() => {
                              const content = post.body || (post as any).content || (post as any).description;
                              if (!content) return <p className="text-gray-500 italic">Content coming soon.</p>;
                              if (typeof content === 'string') return <p>{content}</p>;
                              if (Array.isArray(content)) return (
                                <PortableText
                                    value={content}
                                    components={{
                                        types: {
                                            image: ({ value }) => {
                                                if (!value?.asset?._ref && !value?.asset?.url) return null;
                                                const imgUrl = value?.asset?.url || urlFor(value).width(1200).url();
                                                return (
                                                    <div className="my-10 relative w-full aspect-video rounded-xl overflow-hidden shadow-lg border border-gray-100">
                                                        <Image src={imgUrl} alt={value.alt || 'Blog image'} fill className="object-cover" />
                                                    </div>
                                                );
                                            }
                                        },
                                        block: {
                                            normal: ({ children }) => <p className="mb-6">{children}</p>,
                                            h2: ({ children }) => <h2 className="text-3xl font-bold mt-12 mb-6 border-b border-emerald-100 pb-2">{children}</h2>,
                                            h3: ({ children }) => <h3 className="text-2xl font-bold mt-8 mb-4 text-emerald-800">{children}</h3>,
                                            blockquote: ({ children }) => (
                                                <blockquote className="border-l-4 border-emerald-500 pl-4 py-2 my-8 bg-emerald-50 rounded-r-lg italic text-emerald-900 shadow-inner">
                                                    {children}
                                                </blockquote>
                                            ),
                                        },
                                        marks: {
                                            strong: ({ children }) => <strong className="font-bold text-black">{children}</strong>,
                                            link: ({ value, children }) => {
                                                const target = (value?.href || '').startsWith('http') ? '_blank' : undefined;
                                                return <a href={value?.href} target={target} rel={target === '_blank' ? 'noopener noreferrer' : undefined} className="text-emerald-600 underline decoration-emerald-300 hover:decoration-emerald-600 transition-all font-bold">{children}</a>;
                                            }
                                        },
                                        list: {
                                            bullet: ({ children }) => <ul className="list-disc pl-6 mb-8 space-y-3 marker:text-emerald-500">{children}</ul>,
                                            number: ({ children }) => <ol className="list-decimal pl-6 mb-8 space-y-3 marker:text-emerald-500 font-bold">{children}</ol>,
                                        }
                                    }}
                                />
                              );
                              return <p>{String(content)}</p>;
                            })()}
                        </div>

                        {/* Keywords / Tags */}
                        {post.keywords && post.keywords.length > 0 && (
                            <div className="mt-16 pt-8 border-t border-gray-100">
                                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Related Topics</h4>
                                <div className="flex flex-wrap gap-2">
                                    {post.keywords.map((keyword, i) => (
                                        <span key={i} className="px-4 py-1.5 bg-gray-100 text-gray-600 rounded-full text-sm font-medium hover:bg-emerald-100 hover:text-emerald-800 transition-colors cursor-pointer capitalize">
                                            #{keyword}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </article>

            <Footer />
        </main>
    );
}
