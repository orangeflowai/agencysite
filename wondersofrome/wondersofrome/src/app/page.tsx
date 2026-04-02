import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CategoryPills from "@/components/CategoryPills";
import FeatureBand from "@/components/FeatureBand";
import Footer from "@/components/Footer";
import ProductRow from "@/components/ProductRow";
import ExperienceShowcase from "@/components/ExperienceShowcase";
import AnimatedSection from "@/components/AnimatedSection";
import ReviewsAndTrust from "@/components/ReviewsAndTrust";
import WhatsAppButton from "@/components/WhatsAppButton";
import { getTours, getSettings } from "@/lib/sanityService";
import { tours as fallbackTours } from "@/lib/toursData";
import dynamic from 'next/dynamic';

export const revalidate = 3600;

const RomeGallery = dynamic(() => import('@/components/RomeGallery'), {
  loading: () => <div className="h-96 w-full bg-neutral-900 animate-pulse" />,
});
const FAQ = dynamic(() => import('@/components/FAQ'));

export default async function Home() {
  let tours = await getTours();
  const settings = await getSettings();

  if (!tours || tours.length === 0) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tours = fallbackTours.map(t => ({
      ...t,
      _id: t.id,
      slug: { current: t.slug },
      mainImage: t.imageUrl,
    })) as any;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const vaticanTours = tours.filter((t: any) => t.category === 'vatican');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const colosseumTours = tours.filter((t: any) => t.category === 'colosseum');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cityTours = tours.filter((t: any) => t.category === 'city');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const hiddenGemsTours = tours.filter((t: any) => t.category === 'hidden-gems');

  return (
    <main className="min-h-screen bg-[#FDFFF5] selection:bg-sky-600 selection:text-white">
      <Navbar />
      <Hero settings={settings} />



      {/* Vatican — ExperienceShowcase */}
      <AnimatedSection id="vatican" delay={0.1}>
        <ExperienceShowcase
          title="Vatican Museums & St. Peter's"
          subtitle="Skip the line to the Sistine Chapel, Gardens, and the Dome."
          tours={vaticanTours}
          link="/category/vatican"
          accent="gold"
        />
      </AnimatedSection>

      <AnimatedSection id="vatican-row" delay={0.1}>
        <div className="bg-white py-12 lg:py-16">
          <ProductRow
            title="All Vatican Tours"
            tours={vaticanTours}
            link="/category/vatican"
          />
        </div>
      </AnimatedSection>

      <CategoryPills />

      {/* Book with Confidence — Gold/Navy Cubania circular icon style */}
      <FeatureBand />

      {/* Colosseum — ExperienceShowcase */}
      <AnimatedSection id="colosseum" delay={0.1}>
        <div className="bg-gray-50">
          <ExperienceShowcase
            title="Colosseum & Ancient Rome"
            subtitle="Walk in the footsteps of Gladiators. Arena, Underground, and Forum."
            tours={colosseumTours}
            link="/category/colosseum"
            accent="gold"
          />
        </div>
      </AnimatedSection>

      <AnimatedSection id="colosseum-row" delay={0.1}>
        <div className="bg-white py-12 lg:py-16">
          <ProductRow
            title="All Colosseum Tours"
            tours={colosseumTours}
            link="/category/colosseum"
          />
        </div>
      </AnimatedSection>

      {/* City Tours */}
      <AnimatedSection id="city" delay={0.1}>
        <ExperienceShowcase
          title="Rome City Tours"
          subtitle="Explore the Pantheon, Trevi Fountain, Spanish Steps and iconic squares."
          tours={cityTours}
          link="/category/city"
          accent="gold"
        />
      </AnimatedSection>

      <AnimatedSection id="city-row" delay={0.1}>
        <div className="bg-gray-50 py-12 lg:py-16">
          <ProductRow
            title="All City Tours"
            tours={cityTours}
            link="/category/city"
          />
        </div>
      </AnimatedSection>

      {/* Gallery */}
      <RomeGallery />

      {/* FAQ */}
      <div id="faq" className="bg-white">
        <FAQ />
      </div>

      <Footer />

      {/* Floating WhatsApp */}
      <WhatsAppButton />
    </main>
  );
}
