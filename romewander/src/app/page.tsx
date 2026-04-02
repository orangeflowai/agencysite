import Link from "next/link";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import StickyRomeSection from "@/components/StickyRomeSection";
import TrustBadges from "@/components/TrustBadges";
import TourCard from "@/components/TourCard";
import Footer from "@/components/Footer";
import ProductRow from "@/components/ProductRow";
import AnimatedSection from "@/components/AnimatedSection";
import FloatingReviews from "@/components/FloatingReviews";
import LiveVisitorCounter from "@/components/LiveVisitorCounter";
import { getTours, getSettings } from "@/lib/sanityService";
import { tours as fallbackTours } from "@/lib/toursData";
import dynamic from 'next/dynamic';

export const revalidate = 3600;

// Lazy Load Components Below Fold
const RomeGallery = dynamic(() => import('@/components/RomeGallery'), {
  loading: () => <div className="h-96 w-full bg-gray-50 animate-pulse" />
});
const SocialProof = dynamic(() => import('@/components/SocialProof'), { ssr: true }); // Keep SSR for SEO/trust
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
  const otherTours = tours.filter((t: any) => t.category !== 'vatican').slice(0, 4);

  return (
    <main className="min-h-screen bg-theme-light selection:bg-theme-secondary selection:text-white">
      <Navbar />
      <Hero settings={settings} />

      {/* Spacer for Hero search bar overlap — bar is ~88px tall, translateY 50% = 44px */}
      <div style={{ height: '60px' }} aria-hidden="true" />

      {/* Live Visitor Counter */}
      <div className="flex justify-center py-4 bg-white/50">
        <LiveVisitorCounter />
      </div>

      {/* Social Proof - High Impact Placement */}
      <SocialProof />

      <StickyRomeSection />

      {/* Main Content Area - Subtle Alternating Backgrounds */}
      <div className="flex flex-col">

        {/* 1. Vatican Section */}
        <AnimatedSection id="vatican" delay={0.1}>
          <div className="bg-theme-light py-12 lg:py-24">
            <ProductRow
              title="Vatican Museums & St. Peter's"
              subtitle="Skip the line to the Sistine Chapel, Gardens, and the Dome."
              tours={vaticanTours}
              link="/category/vatican"
            />
          </div>
        </AnimatedSection>

        {/* 2. Visual Break - Rome Gallery */}
        <RomeGallery />

        {/* 3. Exclusive Papal Tours (Mockup split of Vatican tours) */}
        <AnimatedSection id="exclusive" delay={0.2}>
          <div className="bg-theme-dark text-theme-light py-12 lg:py-24">
            <ProductRow
              title="Premium Audiances"
              subtitle="Get exclusive access to Papal events and rare collections."
              tours={otherTours}
              link="/category/vatican"
            />
          </div>
        </AnimatedSection>

      </div>

      {/* Floating Reviews */}
      <AnimatedSection delay={0.5}>
        <div className="bg-gradient-to-b from-white to-cream-100 py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-2 gradient-text-rome">
              What Our Travelers Say
            </h2>
            <p className="text-center text-gray-600 mb-8">
              Join thousands of happy travelers exploring Rome
            </p>
            <FloatingReviews />
          </div>
        </div>
      </AnimatedSection>

      {/* Trust Badges */}
      <AnimatedSection delay={0.6}>
        <div className="bg-white py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-8 text-gray-900">
              Book with Confidence
            </h2>
            <TrustBadges />
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

