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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  const cityTours = tours.filter((t: any) => t.category === 'city');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const hiddenGemsTours = tours.filter((t: any) => t.category === 'hidden-gems');

  return (
    <main className="min-h-screen bg-cream selection:bg-olive selection:text-white">
      <Navbar />
      <Hero settings={settings} />

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
          <div className="bg-white py-12 lg:py-24">
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

        {/* 3. Colosseum Section */}
        <AnimatedSection id="colosseum" delay={0.2}>
          <div className="bg-cream-100 py-12 lg:py-24">
            <ProductRow
              title="Colosseum & Ancient Rome"
              subtitle="Walk in the footsteps of Gladiators. Arena, Underground, and Forum."
              tours={colosseumTours}
              link="/category/colosseum"
            />
          </div>
        </AnimatedSection>

        {/* 4. City & Hidden Gems */}
        <AnimatedSection id="city" delay={0.3}>
          <div className="bg-white py-12 lg:py-24">
            <ProductRow
              title="Rome City Tours"
              subtitle="Explore the Pantheon, Trevi Fountain, Spanish Steps and iconic squares."
              tours={cityTours}
              link="/category/city"
            />
          </div>
        </AnimatedSection>

        {/* 5. Day Trips */}
        <AnimatedSection id="hidden-gems" delay={0.4}>
          <div className="bg-emerald-50/50 py-12 lg:py-24">
            <ProductRow
              title="Italy Hidden Gems"
              subtitle="Catacombs, Golf Cart tours, Day trips, Food tours & unique experiences."
              tours={hiddenGemsTours}
              link="/category/hidden-gems"
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

