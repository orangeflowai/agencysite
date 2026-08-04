import React from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getPost, getPosts } from '@/lib/dataAdapter';
import { urlFor } from '@/lib/dataAdapter';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { PortableText } from '@portabletext/react';
import { Calendar, User, ArrowLeft, Clock, Tag } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 60;

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    const posts = await getPosts();
    return posts
        .filter((post) => post.slug?.current)
        .map(p => ({ slug: p.slug.current }));
}

export async function generateMetadata({ params }: PageProps) {
    const { slug } = await params;
    const post = await getPost(slug);
    if (!post) return { title: 'Post Not Found - Wonders of Rome' };

    return {
        title: `${post.title} | Wonders of Rome Blog`,
        description: post.excerpt,
        keywords: post.keywords,
        openGraph: {
            images: [post.mainImage?.asset?.url || ''],
        },
    };
}

const FALLBACK = 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=80';

export default async function BlogPostPage({ params }: PageProps) {
    const { slug } = await params;
    const post = await getPost(slug);

    if (!post) notFound();

    const heroImage = post.mainImage?.asset?.url || FALLBACK;

    return (
        <main className="min-h-screen bg-background">
            <Navbar />

            <article>
                {/* Hero */}
                <header className="relative h-[65vh] min-h-[500px] flex items-end overflow-hidden">
                    <Image
                        src={heroImage}
                        alt={post.title}
                        fill
                        className="object-cover"
                        priority
                        sizes="100vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

                    <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pb-16 max-w-4xl">
                        {/* Back link */}
                        <Link
                            href="/blog"
                            className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm font-medium mb-8 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" /> Back to Blog
                        </Link>

                        {/* Category tag */}
                        <p className="text-primary font-bold tracking-[0.4em] text-[8px] uppercase mb-4">Travel Guide</p>

                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white leading-[0.95] tracking-tighter mb-8">
                            {post.title}
                        </h1>

                        {/* Meta row */}
                        <div className="flex flex-wrap items-center gap-6 text-sm text-white/60">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-primary" />
                                {post.publishedAt
                                    ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                                    : 'Recently Updated'}
                            </div>
                            <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-primary" />
                                Rome Expert
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-primary" />
                                5 min read
                            </div>
                        </div>
                    </div>
                </header>

                {/* Article body */}
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                    <div className="max-w-3xl mx-auto">

                        {/* Excerpt / lead */}
                        {post.excerpt && (
                            <p className="text-xl md:text-2xl font-serif text-foreground leading-relaxed mb-12 pb-12 border-b border-border">
                                {post.excerpt}
                            </p>
                        )}

                        {/* Body */}
                        <div className="prose prose-lg max-w-none
                            prose-headings:font-serif prose-headings:font-bold prose-headings:text-foreground prose-headings:tracking-tight
                            prose-h2:text-3xl prose-h2:mt-16 prose-h2:mb-6 prose-h2:border-b prose-h2:border-border prose-h2:pb-4
                            prose-h3:text-2xl prose-h3:mt-10 prose-h3:mb-4
                            prose-p:text-foreground prose-p:leading-[1.85] prose-p:mb-6
                            prose-li:text-foreground prose-li:leading-relaxed
                            prose-strong:text-foreground prose-strong:font-bold
                            prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-muted prose-blockquote:px-6 prose-blockquote:py-4 prose-blockquote:rounded-r-2xl prose-blockquote:not-italic
                            prose-a:text-primary prose-a:underline prose-a:decoration-primary/30 hover:prose-a:decoration-primary
                            prose-img:rounded-2xl prose-img:shadow-lg
                            [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-8 [&>ul]:space-y-3 [&>ul>li]:marker:text-primary
                            [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-8 [&>ol]:space-y-3">
                            {(() => {
                                const content = post.body || (post as any).content || (post as any).description;
                                if (!content) return <p className="text-muted-foreground">Content coming soon.</p>;
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
                                                        <figure className="my-12">
                                                            <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-lg border border-border">
                                                                <Image src={imgUrl} alt={value.alt || 'Blog image'} fill className="object-cover" sizes="(max-width: 768px) 100vw, 768px" />
                                                            </div>
                                                            {value.caption && (
                                                                <figcaption className="mt-3 text-center text-sm text-muted-foreground">{value.caption}</figcaption>
                                                            )}
                                                        </figure>
                                                    );
                                                }
                                            },
                                            block: {
                                                normal:     ({ children }) => <p className="mb-6">{children}</p>,
                                                h2:         ({ children }) => <h2 className="text-3xl font-serif font-bold text-foreground mt-16 mb-6 pb-4 border-b border-border">{children}</h2>,
                                                h3:         ({ children }) => <h3 className="text-2xl font-serif font-bold text-foreground mt-10 mb-4">{children}</h3>,
                                                h4:         ({ children }) => <h4 className="text-xl font-serif font-bold text-foreground mt-8 mb-3">{children}</h4>,
                                                blockquote: ({ children }) => (
                                                    <blockquote className="border-l-4 border-primary bg-muted px-6 py-4 rounded-r-2xl my-8 text-foreground/80 text-lg leading-relaxed">
                                                        {children}
                                                    </blockquote>
                                                ),
                                            },
                                            marks: {
                                                strong: ({ children }) => <strong className="font-bold text-foreground">{children}</strong>,
                                                em:     ({ children }) => <em className="italic text-muted-foreground">{children}</em>,
                                                link:   ({ value, children }) => {
                                                    const isExternal = (value?.href || '').startsWith('http');
                                                    return (
                                                        <a
                                                            href={value?.href}
                                                            target={isExternal ? '_blank' : undefined}
                                                            rel={isExternal ? 'noopener noreferrer' : undefined}
                                                            className="text-primary underline decoration-primary/30 hover:decoration-primary font-medium transition-all"
                                                        >
                                                            {children}
                                                        </a>
                                                    );
                                                }
                                            },
                                            list: {
                                                bullet: ({ children }) => <ul className="list-disc pl-6 mb-8 space-y-3 marker:text-primary">{children}</ul>,
                                                number: ({ children }) => <ol className="list-decimal pl-6 mb-8 space-y-3 marker:text-primary">{children}</ol>,
                                            },
                                            listItem: {
                                                bullet: ({ children }) => <li className="text-foreground leading-relaxed">{children}</li>,
                                                number: ({ children }) => <li className="text-foreground leading-relaxed">{children}</li>,
                                            }
                                        }}
                                    />
                                );
                                return <p>{String(content)}</p>;
                            })()}
                        </div>

                        {/* Tags */}
                        {post.keywords && post.keywords.length > 0 && (
                            <div className="mt-16 pt-8 border-t border-border">
                                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
                                    <Tag className="w-4 h-4" />
                                    <span className="font-bold tracking-widest text-[8px] uppercase">Related Topics</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {post.keywords.map((keyword, i) => (
                                        <span
                                            key={i}
                                            className="px-4 py-1.5 bg-muted text-muted-foreground rounded-full text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                                        >
                                            #{keyword}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Back to blog */}
                        <div className="mt-16 pt-8 border-t border-border">
                            <Link
                                href="/blog"
                                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-primary/20 text-primary text-[8px] font-bold tracking-widest rounded-full hover:bg-primary hover:text-primary-foreground transition-all uppercase"
                            >
                                <ArrowLeft size={14} /> Back to All Articles
                            </Link>
                        </div>
                    </div>
                </div>
            </article>

            <Footer />
        </main>
    );
}
