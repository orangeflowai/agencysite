
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getPosts } from '@/lib/dataAdapter';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Calendar, ArrowRight } from 'lucide-react';

export const revalidate = 60; // Revalidate every minute

export default async function BlogPage() {
    const posts = await getPosts();

    return (
        <main className="min-h-screen bg-cream selection:bg-olive selection:text-white">
            <Navbar />

            {/* Hero Section */}
            <div className="relative h-[40vh] min-h-[400px] flex items-center justify-center overflow-hidden">
                <Image
                    src="https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=80"
                    alt="Rome Blog"
                    fill
                    className="object-cover brightness-[0.6]"
                    priority
                />
                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                    <span className="block text-emerald-300 font-bold tracking-widest  mb-4 text-sm md:text-base">
                        Travel Tips & Guides
                    </span>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 drop-shadow-lg">
                        Stories from Rome
                    </h1>
                    <p className="text-lg md:text-xl text-emerald-50 max-w-2xl mx-auto leading-relaxed">
                        Discover hidden gems, expert advice, and the rich history of the Eternal City before your visit.
                    </p>
                </div>
            </div>

            {/* Blog Grid */}
            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map((post) => (
                        <Link
                            key={post._id}
                            href={`/blog/${post.slug.current}`}
                            className="group bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-emerald-50 hover:-translate-y-1 flex flex-col"
                        >
                            <div className="relative h-56 overflow-hidden">
                                <Image
                                    src={post.mainImage?.asset?.url || 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=80'}
                                    alt={post.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                            </div>

                            <div className="p-6 flex flex-col flex-1">
                                <div className="flex items-center text-xs text-olive mb-3 font-semibold tracking-wide ">
                                    <Calendar className="w-3 h-3 mr-1.5" />
                                    {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                                        month: 'long',
                                        day: 'numeric',
                                        year: 'numeric'
                                    }) : 'Recently Updated'}
                                </div>

                                <h2 className="text-xl font-serif font-bold text-foreground mb-3 group-hover:text-olive transition-colors line-clamp-2">
                                    {post.title}
                                </h2>

                                <p className="text-muted-foreground mb-6 text-sm leading-relaxed line-clamp-3 flex-1">
                                    {post.excerpt}
                                </p>

                                <div className="flex items-center text-emerald-700 font-bold text-sm group-hover:translate-x-1 transition-transform mt-auto">
                                    Read Article <ArrowRight className="w-4 h-4 ml-1.5" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {posts.length === 0 && (
                    <div className="text-center py-20 bg-secondary rounded-2xl border border-emerald-100">
                        <h3 className="text-2xl font-serif font-bold text-emerald-900 mb-2">No Stories Yet</h3>
                        <p className="text-emerald-700">Check back soon for our first travel guide!</p>
                    </div>
                )}
            </div>

            <Footer />
        </main>
    );
}
