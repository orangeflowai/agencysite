import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import TrustBar from '@/components/TrustBar';
import TourCardWide from '@/components/TourCardWide';
import TestimonialRow from '@/components/TestimonialRow';
import FaqPreview from '@/components/FaqPreview';
import Footer from '@/components/Footer';
import { getTours } from '@/lib/tourService';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const tours = await getTours();

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <TrustBar />

      {/* Tours Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
          {tours.map((tour: any, i: number) => (
            <TourCardWide key={tour._id} tour={tour} imageFirst={i % 2 === 0} />
          ))}
        </div>
      </section>

      <TestimonialRow />
      <FaqPreview />
      <Footer />
    </main>
  );
}
