import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TrustBadges from "@/components/TrustBadges";
import Footer from "@/components/Footer";
import ProductRow from "@/components/ProductRow";
import AnimatedSection from "@/components/AnimatedSection";
import HighlightSection from "@/components/HighlightSection";
import { getTours, getSettings } from "@/lib/dataAdapter";
import { tours as fallbackTours } from "@/lib/toursData";
import dynamic from 'next/dynamic';

export const revalidate = 3600;

const R2 = 'https://pub-772bbb33a07f4026aa9652a0cfef4c2e.r2.dev/rome%20photos';

const RomeGallery      = dynamic(() => import('@/components/RomeGallery'),      { loading: () => <div className="h-96 w-full bg-[#1A1210] animate-pulse" /> });
const FloatingReviews  = dynamic(() => import('@/components/FloatingReviews'),  { ssr: true });
const StickyRomeSection = dynamic(() => import('@/components/StickyRomeSection'));
const FAQ              = dynamic(() => import('@/components/FAQ'));

export default async function Home() {
  let tours = await getTours();
  const settings = await getSettings();

  if (!tours || tours.length === 0) {
    tours = fallbackTours.map((t: any) => ({
      ...t, _id: t.id, slug: { current: t.slug }, mainImage: t.imageUrl,
    })) as any;
  }

  const vaticanTours    = tours.filter((t: any) => t.category === 'vatican');
  const colosseumTours  = tours.filter((t: any) => t.category === 'colosseum');
  const cityTours       = tours.filter((t: any) => t.category === 'city');
  const hiddenGemsTours = tours.filter((t: any) => t.category === 'hidden-gems');

  return (
    <main className="min-h-screen bg-[#F5F0E8]">
      <Navbar />
      <Hero settings={settings} />

      <div className="h-20" aria-hidden="true" />

      {/* Stats ticker */}
      <div className="py-3 overflow-hidden bg-[#1A1210]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-white/10">
            {[
              { stat: '15,000+', label: 'Guests Served' },
              { stat: '48',      label: 'Curated Routes' },
              { stat: '4.9 ★',  label: 'Average Rating' },
              { stat: '24/7',    label: 'Concierge Support' },
            ].map((item) => (
              <div key={item.label} className="text-center px-4 py-2">
                <p className="font-serif font-bold text-xl md:text-2xl leading-none text-[#C9A84C]">{item.stat}</p>
                <p className="font-sans text-[9px] uppercase tracking-[0.2em] mt-1 text-white/50">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="py-24 bg-[#F5F0E8]">
        <div className="container mx-auto px-6 md:px-16 text-center mb-12">
          <p className="font-sans text-[10px] tracking-[0.4em] uppercase font-bold mb-3 text-[#C9A84C]">✦ GUEST EXPERIENCES ✦</p>
          <h2 className="font-serif font-bold text-4xl text-[#1A1210]">What our travelers say</h2>
        </div>
        <FloatingReviews />
      </div>

      <StickyRomeSection />

      {/* Vatican */}
      <AnimatedSection id="vatican" delay={0.1}>
        <ProductRow title="Vatican Museums & St. Peter's" subtitle="Skip the line to the Sistine Chapel, Gardens & Dome" tours={vaticanTours} link="/category/vatican" dark={false} />
      </AnimatedSection>

      <RomeGallery />

      <HighlightSection
        eyebrow="WHAT WE DO"
        title="Rome's Greatest Experiences, Perfected"
        body="Skip-the-line access, small groups, and expert licensed guides who bring the stories of Rome to life. We've obsessed over every detail so your visit feels effortless."
        ctaText="Browse All Tours"
        ctaHref="/category/vatican"
        imageUrl={`${R2}/pexels-akarsh-chandran-2156074716-34026966.jpg`}
        imageAlt="Inside the Vatican Museums"
      />

      {/* Colosseum */}
      <AnimatedSection id="colosseum" delay={0.2}>
        <ProductRow title="Colosseum & Ancient Rome" subtitle="Walk in the footsteps of Gladiators — Arena, Underground, and Forum." tours={colosseumTours} link="/category/colosseum" dark={true} />
      </AnimatedSection>

      {/* City */}
      <AnimatedSection id="city" delay={0.3}>
        <ProductRow title="Rome City Tours" subtitle="Explore the Pantheon, Trevi Fountain, Spanish Steps and iconic squares." tours={cityTours} link="/category/city" dark={false} />
      </AnimatedSection>

      {/* Hidden Gems */}
      <AnimatedSection id="hidden-gems" delay={0.4}>
        <ProductRow title="Italy Hidden Gems" subtitle="Catacombs, Golf Cart tours, Day trips, Food tours & unique experiences." tours={hiddenGemsTours} link="/category/hidden-gems" dark={true} />
      </AnimatedSection>

      {/* Trust */}
      <AnimatedSection delay={0.6}>
        <section className="py-24 bg-white">
          <div className="container mx-auto px-6 md:px-16 text-center mb-12">
            <p className="font-sans text-[10px] tracking-[0.35em] uppercase font-bold mb-3 text-[#C9A84C]">✦ BOOK WITH CONFIDENCE ✦</p>
            <h2 className="font-serif font-bold text-[#1A1210]" style={{ fontSize: 'clamp(28px, 3.5vw, 42px)' }}>Why Choose Our Services</h2>
          </div>
          <TrustBadges />
        </section>
      </AnimatedSection>

      <div id="faq" className="bg-white"><FAQ /></div>
      <Footer />
    </main>
  );
}
