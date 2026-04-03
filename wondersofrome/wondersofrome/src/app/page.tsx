import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CategoryPills from "@/components/CategoryPills";
import Footer from "@/components/Footer";
import ProductRow from "@/components/ProductRow";
import AnimatedSection from "@/components/AnimatedSection";
import ReviewsAndTrust from "@/components/ReviewsAndTrust";
import HighlightSection from "@/components/HighlightSection";
import TrustBadges from "@/components/TrustBadges";
import WhatsAppButton from "@/components/WhatsAppButton";
import { getTours, getSettings } from "@/lib/sanityService";
import { tours as fallbackTours } from "@/lib/toursData";
import dynamic from 'next/dynamic';

export const revalidate = 3600;

const RomeGallery = dynamic(() => import('@/components/RomeGallery'), {
  loading: () => <div className="h-96 w-full animate-pulse" style={{ backgroundColor: '#1A1210' }} />,
});
const FAQ = dynamic(() => import('@/components/FAQ'));

export default async function Home() {
  let tours = await getTours();
  const settings = await getSettings();

  if (!tours || tours.length === 0) {
    tours = fallbackTours.map(t => ({
      ...t,
      _id: t.id,
      slug: { current: t.slug },
      mainImage: t.imageUrl,
    })) as any;
  }

  const vaticanTours = tours.filter((t: any) => t.category === 'vatican');
  const colosseumTours = tours.filter((t: any) => t.category === 'colosseum');
  const cityTours = tours.filter((t: any) => t.category === 'city');

  return (
    <main className="min-h-screen selection:bg-sky-600 selection:text-white" style={{ backgroundColor: '#FDFFF5' }}>
      <Navbar />
      <Hero settings={settings} />

      {/* Stats ticker */}
      <div className="py-3 overflow-hidden" style={{ backgroundColor: '#1A1210' }}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-white/10">
            {[
              { stat: '50,000+', label: 'Happy Guests' },
              { stat: '4.9 ★', label: 'Google Rating' },
              { stat: '24/7', label: 'Support Available' },
              { stat: '100%', label: 'Satisfaction Rate' },
            ].map((item) => (
              <div key={item.label} className="text-center px-4 py-2">
                <p className="font-serif font-bold text-xl md:text-2xl leading-none" style={{ color: '#C9A84C' }}>
                  {item.stat}
                </p>
                <p className="text-[9px] uppercase tracking-[0.2em] mt-1" style={{ color: 'rgba(245,240,232,0.5)' }}>
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews */}
      <ReviewsAndTrust />

      {/* Vatican Tours */}
      <AnimatedSection id="vatican" delay={0.1}>
        <ProductRow
          title="Vatican Museums & St. Peter's"
          subtitle="Skip the line to the Sistine Chapel, Gardens, and the Dome."
          tours={vaticanTours}
          link="/category/vatican"
          dark={false}
        />
      </AnimatedSection>

      {/* Gallery break */}
      <RomeGallery />

      {/* Highlight Section — What Are We Here For */}
      <HighlightSection
        eyebrow="WHAT ARE WE HERE FOR?"
        title="Rome's Most Extraordinary Experiences, Perfected"
        body="Skip-the-line access, small groups, and expert licensed guides who bring the stories of Rome to life. We've obsessed over every detail so your visit feels effortless."
        ctaText="Explore All Tours"
        ctaHref="/category/vatican"
        imageUrl="https://images.unsplash.com/photo-1600181957884-5f80cfa5a7c0?w=800&q=80"
        imageAlt="Wonders of Rome"
      />

      {/* Colosseum Tours */}
      <AnimatedSection id="colosseum" delay={0.1}>
        <ProductRow
          title="Colosseum & Ancient Rome"
          subtitle="Walk in the footsteps of Gladiators — Arena, Underground, and Forum."
          tours={colosseumTours}
          link="/category/colosseum"
          dark={true}
        />
      </AnimatedSection>

      {/* Category Pills */}
      <CategoryPills />

      {/* City Tours */}
      <AnimatedSection id="city" delay={0.1}>
        <ProductRow
          title="Rome City Tours"
          subtitle="Explore the Pantheon, Trevi Fountain, Spanish Steps and iconic squares."
          tours={cityTours}
          link="/category/city"
          dark={false}
        />
      </AnimatedSection>

      {/* Book With Confidence */}
      <AnimatedSection delay={0.2}>
        <section className="py-20" style={{ backgroundColor: '#ffffff' }}>
          <div className="container mx-auto px-6 md:px-16 text-center mb-12">
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] mb-3" style={{ color: '#C9A84C' }}>
              ✦ BOOK WITH CONFIDENCE ✦
            </p>
            <h2 className="font-serif font-bold" style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', color: '#1A1210' }}>
              Why Choose Wonders of Rome
            </h2>
          </div>
          <TrustBadges />
        </section>
      </AnimatedSection>

      {/* FAQ */}
      <div id="faq" style={{ backgroundColor: '#FDFFF5' }}>
        <FAQ />
      </div>

      <Footer />
      <WhatsAppButton />
    </main>
  );
}
