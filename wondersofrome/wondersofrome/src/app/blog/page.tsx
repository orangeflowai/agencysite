import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getPosts } from '@/lib/dataAdapter';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Calendar, ArrowRight, BookOpen } from 'lucide-react';

export const revalidate = 60;

export default async function BlogPage() {
    const allPosts = await getPosts();
    const posts = allPosts.filter(p => p.slug?.current);

    const FALLBACK = 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=80';

    return (
        <main className="min-h-screen bg-background">
            <Navbar />

            {/* Hero */}
            <section className="relative h-[50vh] min-h-[420px] flex items-end overflow-hidden">
                <Image
                    src={FALLBACK}
                    alt="Rome Blog"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                    <p className="text-primary font-bold tracking-[0.4em] text-[10px] uppercase mb-4">Travel Guides</p>
                    <h1 className="text-5xl md:text-7xl font-serif font-bold text-white leading-none tracking-tighter mb-4">
                        The Roman Journal
                    </h1>
                    <p className="text-base text-white/70 max-w-xl leading-relaxed">
                        Expert guides, hidden gems, and everything you need to know before visiting the Eternal City.
                    </p>
                </div>
            </section>

            {/* Blog Grid */}
            <section className="py-16 md:py-24 bg-background">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">

                    {posts.length === 0 ? (
                        <div className="text-center py-32">
                            <BookOpen className="w-12 h-12 text-muted-foreground/30 mx-auto mb-6" />
                            <h3 className="text-2xl font-serif font-bold text-foreground mb-2">No Stories Yet</h3>
                            <p className="text-muted-foreground">Check back soon for our first travel guide.</p>
                        </div>
                    ) : (
                        <>
                            {/* Featured — first post large */}
                            {posts[0] && (
                                <Link
                                    href={`/blog/${posts[0].slug.current}`}
                                    className="group mb-12 grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-[2rem] overflow-hidden border border-border bg-card hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 flex"
                                >
                                    <div className="relative aspect-[16/10] lg:aspect-auto lg:min-h-[420px] overflow-hidden bg-muted">
                                        <Image
                                            src={posts[0].mainImage?.asset?.url || FALLBACK}
                                            alt={posts[0].title}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                            sizes="(max-width: 1024px) 100vw, 50vw"
                                            priority
                                        />
                                    </div>
                                    <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
                                        <p className="text-primary font-bold tracking-[0.4em] text-[8px] uppercase mb-6">Featured</p>
                                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground leading-tight mb-6 group-hover:text-primary transition-colors">
                                            {posts[0].title}
                                        </h2>
                                        <p className="text-muted-foreground text-base leading-relaxed mb-8 line-clamp-3">
                                            {posts[0].excerpt}
                                        </p>
                                        <div className="flex items-center justify-between pt-6 border-t border-border/50">
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {posts[0].publishedAt
                                                    ? new Date(posts[0].publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                                                    : 'Recently Updated'}
                                            </div>
                                            <div className="flex items-center gap-2 text-primary font-bold text-xs tracking-widest uppercase group-hover:gap-3 transition-all">
                                                Read Article <ArrowRight className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            )}

                            {/* Rest of posts — 3-col grid */}
                            {posts.length > 1 && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {posts.slice(1).map((post) => (
                                        <Link
                                            key={post._id}
                                            href={`/blog/${post.slug.current}`}
                                            className="group flex flex-col h-full bg-card rounded-[2rem] overflow-hidden border border-border hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
                                        >
                                            <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                                                <Image
                                                    src={post.mainImage?.asset?.url || FALLBACK}
                                                    alt={post.title}
                                                    fill
                                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                                />
                                            </div>
                                            <div className="p-8 flex flex-col flex-1">
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    {post.publishedAt
                                                        ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                                                        : 'Recently Updated'}
                                                </div>
                                                <h2 className="text-xl font-serif font-bold text-foreground mb-4 group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                                                    {post.title}
                                                </h2>
                                                <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 mb-8 flex-1">
                                                    {post.excerpt}
                                                </p>
                                                <div className="mt-auto flex items-center justify-between pt-6 border-t border-border/50">
                                                    <span className="text-[8px] font-bold tracking-widest text-primary uppercase">Read Article</span>
                                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                                                        <ArrowRight size={14} />
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>

            <Footer />
        </main>
    );
}
