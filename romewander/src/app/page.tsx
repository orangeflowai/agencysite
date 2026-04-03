import Link from "next/link";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import StickyRomeSection from "@/components/StickyRomeSection";
import TrustBadges from "@/components/TrustBadges";
import Footer from "@/components/Footer";
import ProductRow from "@/components/ProductRow";
import AnimatedSection from "@/components/AnimatedSection";
import FloatingReviews from "@/components/FloatingReviews";
import LiveVisitorCounter from "@/components/LiveVisitorCounter";
import { getTours, getSettings } from "@/lib/sanityService";
import { tours as fallbackTours } from "@/lib/toursData";
import dynamic from 'next/dynamic';
import HighlightSection from '@/components/HighlightSection';

export const revalidate = 3600;

const RomeGallery = dynamic(() => import('@/components/RomeGallery'), {
  loading: () => <div className="h-96 w-full animate-pulse" style={{ backgroundColor: '#F5F0E8' }} />,
});
const SocialProof = dynamic(() => import('@/components/SocialProof'), { ssr: true });
const FAQ = dynamic(() => import('@/components/FAQ'));

export default async function Home() {
  let tours = await getTours();
  const settings = await getSettings();

  if (!tours || tours.length === 0) {
    tours = fallbackTours.map(t => ({
      ...t,
      _id: t.id,
      slug: { current: t.slug },
      mainImage: t.imageUrl
    })) as any;
  }

  const vaticanTours = tours.filter((t: any) => t.category === 'vatican');
  const otherTours = tours.filter((t: any) => t.category !== 'vatican').slice(0, 8);

  return (
    <main className="min-h-screen selection:bg-theme-secondary selection:text-white" style={{ backgroundColor: '#F5F0E8' }}>
      <Navbar />
      <Hero settings={settings} />

      {/* Spacer — Hero search bar translateY(50%) needs clearance (bar≈88px → 44px overlap) */}
      <div style={{ height: '60px' }} aria-hidden="true" />


      {/* Stats ticker */}
      <div
        className="py-3 overflow-hidden"
        style={{ backgroundColor: '#1A1210' }}
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-white/10">
            {[
              { stat: '15,000+', label: 'Pilgrims Served' },
              { stat: '48', label: 'Vatican Routes' },
              { stat: '4.9 ★', label: 'Average Rating' },
              { stat: '24/7', label: 'Concierge Support' },
            ].map((item) => (
              <div key={item.label} className="text-center px-4 py-2">
                <p
                  className="font-serif font-bold text-xl md:text-2xl leading-none"
                  style={{ color: '#C9A84C' }}
                >
                  {item.stat}
                </p>
                <p
                  className="font-nav text-[9px] uppercase tracking-[0.2em] mt-1"
                  style={{ color: 'rgba(245,240,232,0.5)' }}
                >
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>


      {/* Social Proof reviews */}
      <SocialProof />

      {/* Full-screen cinematic scroll section */}
      <StickyRomeSection />

      {/* Vatican Tours Section */}
      <AnimatedSection id="vatican" delay={0.1}>
        <ProductRow
          title="Vatican Museums & St. Peter's"
          subtitle="Skip the line to the Sistine Chapel, Gardens & Dome"
          tours={vaticanTours}
          link="/category/vatican"
          dark={false}
        />
      </AnimatedSection>

      {/* Visual Break Gallery */}
      <RomeGallery />

      {/* Highlight Section — Image 3 style */}
      <HighlightSection
        eyebrow="WHAT ARE WE HERE FOR?"
        title="Vatican & Rome's Greatest Experiences, Simplified"
        body="Finding skip-the-line access that doesn't feel rushed, with guides who actually know the stories — it can feel like a wild goose chase. At RomeWander, your next great tour should be just a click away."
        ctaText="Browse All Tours"
        ctaHref="/category/vatican"
        imageUrl="https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=800&q=80"
        imageAlt="Inside the Vatican Museums"
      />

      {/* Premium / Dark CTA Section */}
      <AnimatedSection id="exclusive" delay={0.2}>
        <ProductRow
          title="Premium Papal Experiences"
          subtitle="Exclusive access to events & rare collections"
          tours={otherTours}
          link="/category/vatican"
          dark={true}
        />
      </AnimatedSection>



      {/* Trust Badges */}
      <AnimatedSection delay={0.6}>
        <section className="py-16" style={{ backgroundColor: '#ffffff' }}>
          <div className="container mx-auto px-6 md:px-16 text-center mb-8">
            <p
              className="font-nav text-[10px] tracking-[0.35em] uppercaese font-bold mb-3"
              style={{ color: '#C9A84C' }}
            >
              ✦ BOOK WITH CONFIDENCE ✦
            </p>
            <h2
              className="font-serif font-bold"
              style={{ fontSize: 'clamp(28px, 3.5vw, 42px)', color: '#1A1210' }}
            >
              Why Choose RomeWander
            </h2>
          </div>
          <TrustBadges />

        </section>
      </AnimatedSection>

      {/* FAQ */}
      <div id="faq" style={{ backgroundColor: '#F5F0E8' }}>
        <FAQ />
      </div>

      <Footer />
    </main>
  );
}
