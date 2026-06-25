import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import TrustBar from '@/components/TrustBar';
import TourCardWide from '@/components/TourCardWide';
import TestimonialRow from '@/components/TestimonialRow';
import FaqPreview from '@/components/FaqPreview';
import Footer from '@/components/Footer';
import { getTours } from '@/lib/dataAdapter';

export const revalidate = 300;

export default async function Home() {
  const tours = await getTours();

  // We have exactly 2 Vatican tours
  const tour1 = tours.find((t: any) => t.slug?.current?.includes('guided')) || tours[0];
  const tour2 = tours.find((t: any) => t.slug?.current?.includes('skip')) || tours[1] || tours[0];

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <TrustBar />

      {/* Tours Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
          {tour1 && <TourCardWide tour={tour1} imageFirst />}
          {tour2 && <TourCardWide tour={tour2} imageFirst={false} />}
        </div>
      </section>

      <TestimonialRow />
      <FaqPreview />
      <Footer />
    </main>
  );
}
