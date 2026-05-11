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
import AnimatedSection from "@/components/AnimatedSection";

export const revalidate = 300; // 5 minutes

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
      ...t, 
      _id: t.id, 
      slug: { current: t.slug }, 
      mainImage: t.imageUrl,
      features: t.highlights, // Map highlights to features for tour cards
    })) as any;
  }
// Use settings for Hero if available
const heroTitle = settings?.heroTitle || "Official Vatican Access. Unfiltered.";
const heroSubtitle = settings?.heroSubtitle || "The exclusive portal for authenticated Vatican Museum entry. Curated small group routes and private historian-led expeditions into the Holy See.";
const heroImage = settings?.heroImage?.asset?.url || "/vatican-museums.jpg";

// Vatican-only tours (already filtered by dataAdapter) - limit to 2
const homeTours = tours.slice(0, 2);

return (
  <main className="min-h-screen bg-background text-foreground">
    <VaticanHeader />
    <VaticanHeroSection title={heroTitle} subtitle={heroSubtitle} heroImage={heroImage} />
    
    <AnimatedSection>
      <TrustFeatures />
    </AnimatedSection>

    {/* The Vatican Collection Grid */}
    <AnimatedSection>
      <div id="tours" className="py-20 bg-background border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-16">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent mb-2">Authenticated Collection</p>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground">The Vatican <span className="italic">Archives</span></h2>
           </div>
           <TourCards tours={homeTours} />
        </div>
      </div>
    </AnimatedSection>

    <AnimatedSection>
      <AboutSection />
    </AnimatedSection>

    <AnimatedSection>
      <EntryRequirements />
    </AnimatedSection>
      
    {/* Testimonials Section */}
    <AnimatedSection>
      <Testimonials />
    </AnimatedSection>

    {/* How to Book Section */}
    <AnimatedSection>
      <section className="py-24 md:py-32 bg-card text-foreground border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-widest text-accent mb-3 font-semibold">Simple Process</p>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground">How to <span className="italic">Book</span></h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">Secure your Vatican access in three simple steps</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-background p-8 rounded-2xl border border-border hover:border-accent/50 transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-xl">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-6 text-primary font-bold text-xl">1</div>
              <h3 className="text-xl font-serif font-bold text-foreground mb-3">Choose Your Tour</h3>
              <p className="text-muted-foreground leading-relaxed">Browse our curated Vatican experiences and select the tour that matches your interests and schedule.</p>
            </div>
            <div className="bg-background p-8 rounded-2xl border border-border hover:border-accent/50 transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-xl">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-6 text-primary font-bold text-xl">2</div>
              <h3 className="text-xl font-serif font-bold text-foreground mb-3">Select Date & Time</h3>
              <p className="text-muted-foreground leading-relaxed">Pick your preferred date and time slot. We offer early morning, standard, and private tour options.</p>
            </div>
            <div className="bg-background p-8 rounded-2xl border border-border hover:border-accent/50 transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-xl">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-6 text-primary font-bold text-xl">3</div>
              <h3 className="text-xl font-serif font-bold text-foreground mb-3">Secure Payment</h3>
              <p className="text-muted-foreground leading-relaxed">Complete your booking with our secure payment system. Receive instant confirmation and skip-the-line tickets.</p>
            </div>
          </div>
        </div>
      </section>
    </AnimatedSection>

    <AnimatedSection>
      <FAQSection />
    </AnimatedSection>
    
    <VaticanFooter />
  </main>
);
}
