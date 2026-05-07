import React from 'react';
import VaticanHeader from "@/components/vatican/header";
import VaticanHeroSection from "@/components/vatican/hero-section";
import TrustFeatures from "@/components/vatican/trust-features";
import TourCards from "@/components/vatican/tour-cards";
import AboutSection from "@/components/vatican/about-section";
import EntryRequirements from "@/components/vatican/entry-requirements";
import Testimonials from "@/components/vatican/testimonials";
import FAQSection from "@/components/vatican/faq-section";
import VaticanFooter from "@/components/vatican/footer";
import { getTours, getSettings, getPosts } from "@/lib/dataAdapter";
import { getPexelsImages, ROME_QUERIES } from "@/lib/pexels";
import { tours as fallbackTours } from "@/lib/toursData";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const revalidate = 3600;

export default async function Home() {
  const [toursData, settings, posts, pexelsVatican] = await Promise.all([
    getTours(),
    getSettings(),
    getPosts(),
    getPexelsImages(ROME_QUERIES.vatican, 4),
  ]);

  let tours = toursData;
  if (!tours || tours.length === 0) {
    tours = fallbackTours.map((t: any) => ({
      ...t, _id: t.id, slug: { current: t.slug }, mainImage: t.imageUrl,
    })) as any;
  }
// Use settings for Hero if available
const heroTitle = settings?.heroTitle || "Official Vatican Access. Unfiltered.";
const heroSubtitle = settings?.heroSubtitle || "The exclusive portal for authenticated Vatican Museum entry. Curated small group routes and private historian-led expeditions into the Holy See.";
const heroImage = settings?.heroImage?.asset?.url || "/vatican-museums.jpg";

// Vatican-only tours (already filtered by dataAdapter)
const homeTours = tours.slice(0, 6);

return (
  <main className="min-h-screen bg-background text-foreground">
    <VaticanHeader />
    <VaticanHeroSection title={heroTitle} subtitle={heroSubtitle} heroImage={heroImage} />
    <TrustFeatures />

    {/* The Vatican Collection Grid */}
    <div className="py-20 bg-background border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         <div className="text-center mb-16">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent mb-2">Authenticated Collection</p>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground">The Vatican <span className="italic">Archives</span></h2>
         </div>
         <TourCards tours={homeTours} />
      </div>
    </div>

    <AboutSection />

      <EntryRequirements />
      
      {/* Testimonials Section */}
      <Testimonials />

      {/* Blog Section */}
      {posts && posts.length > 0 && (
        <section className="py-24 md:py-32 bg-secondary/30 text-foreground border-t border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-6">
              <div>
                <p className="text-sm uppercase tracking-widest text-accent mb-3 font-semibold">The Roman Journal</p>
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground">News & <span className="italic">Insights</span></h2>
              </div>
              <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline shrink-0">
                All Articles <ArrowRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {posts.slice(0, 3).map((post: any) => (
                <Link key={post._id} href={`/blog/${post.slug.current}`} className="group flex flex-col bg-card rounded-2xl overflow-hidden border border-border hover:border-accent/50 transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-xl">
                  <div className="relative aspect-[16/9] overflow-hidden">
                    {post.mainImage?.asset?.url && (
                      <img src={post.mainImage.asset.url} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    )}
                  </div>
                  <div className="p-6 md:p-8 flex flex-col flex-1">
                    <h3 className="text-xl font-serif font-bold text-foreground mb-2 group-hover:text-accent transition-colors line-clamp-2">{post.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1">{post.excerpt}</p>
                    <span className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-1">Read More <ArrowRight size={12} /></span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <FAQSection />
      <VaticanFooter />
    </main>
  );
}
