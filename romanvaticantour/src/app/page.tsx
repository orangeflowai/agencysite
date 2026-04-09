import Link from "next/link";
import Navbar from "@/components/Navbar";
import HeroStickyGrid from "@/components/HeroStickyGrid";
import SaaSBentoFeatures from "@/components/SaaSBentoFeatures";
import SaaSTourGrid from "@/components/SaaSTourGrid";
import TrustBadges from "@/components/TrustBadges";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import FloatingReviews from "@/components/FloatingReviews";
import { getTours, getSettings } from "@/lib/sanityService";
import { tours as fallbackTours } from "@/lib/toursData";
import dynamic from 'next/dynamic';

export const revalidate = 3600;

// Lazy Load Components Below Fold
// Cleaned up the old dynamic StickyGridScroll import
const FAQ = dynamic(() => import('@/components/FAQ'));

export default async function Home() {
  let tours = await getTours();
  const settings = await getSettings();

  // Fallback if Sanity is empty (Pre-seed state)
  if (!tours || tours.length === 0) {
    tours = fallbackTours.map(t => ({
      ...t,
      _id: t.id,
      slug: { current: t.slug },
      mainImage: t.imageUrl
    })) as any;
  }

  // Group tours by category
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const vaticanTours = tours.filter((t: any) => t.category === 'vatican');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const colosseumTours = tours.filter((t: any) => t.category === 'colosseum');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const otherTours = tours.filter((t: any) => t.category !== 'vatican' && t.category !== 'colosseum');

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      {/* High-Impact SaaS Split Hero merged with Sticky Grid */}
      <HeroStickyGrid settings={settings} tours={[...vaticanTours, ...colosseumTours, ...otherTours]} />

      {/* Trust Badges */}
      <TrustBadges />

      {/* Bento Box Value Proposition */}
      <SaaSBentoFeatures />

      {/* Features/Pricing-style Tour Grids */}
      <div className="flex flex-col">

        {/* 1. Primary Highlight: Vatican */}
        <AnimatedSection id="vatican" delay={0.1}>
          <SaaSTourGrid
            title="The Vatican Collection"
            subtitle="Secure your skip-the-line access to the Sistine Chapel, Museums, and St. Peter's Basilica."
            tours={vaticanTours}
            link="/category/vatican"
            dark={false}
          />
        </AnimatedSection>

      

        {/* 3. Secondary Highlight: Colosseum (Dark Mode) */}
        <AnimatedSection id="colosseum" delay={0.2}>
          <SaaSTourGrid
            title="Ancient Rome Experiences"
            subtitle="Explore the Colosseum, Roman Forum, and Palatine Hill with expert archaeologists."
            tours={colosseumTours}
            link="/category/colosseum"
            dark={true}
          />
        </AnimatedSection>

        {/* 4. Other Tours (Light Mode again) */}
        {otherTours.length > 0 && (
          <AnimatedSection id="explore" delay={0.3}>
             <SaaSTourGrid
                title="City & Hidden Gems"
                subtitle="Complete your Roman holiday with food tours, catacombs, and city highlights."
                tours={otherTours}
                link="/search"
                dark={false}
              />
          </AnimatedSection>
        )}

      </div>

      {/* Floating Reviews as SaaS Testimonials */}
      <AnimatedSection delay={0.4}>
        <div className="bg-neutral-50 py-24 border-t border-neutral-200">
          <div className="container mx-auto px-6 md:px-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-center mb-4 text-neutral-900">
              Trusted by Pilgrims & Travelers
            </h2>
            <p className="text-center text-neutral-500 mb-12 max-w-2xl mx-auto">
              Read why thousands of people rate us 5 stars.
            </p>
            <FloatingReviews />
          </div>
        </div>
      </AnimatedSection>

      <div id="faq" className="bg-white">
        <FAQ />
      </div>
      
      <Footer />
    </main>
  );
}
