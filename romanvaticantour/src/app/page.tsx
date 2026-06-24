import Navbar from '@/components/Navbar';
import { HeroSection } from "@/components/sections/hero-section";
import { PhilosophySection } from "@/components/sections/philosophy-section";
import { FeaturedProductsSection } from "@/components/sections/featured-products-section";
import { TechnologySection } from "@/components/sections/technology-section";
import { GallerySection } from "@/components/sections/gallery-section";
import { CollectionSection } from "@/components/sections/collection-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { EditorialSection } from "@/components/sections/editorial-section";
import Footer from '@/components/Footer';
import { getTours, extractPortableText, getTourImage } from "@/lib/dataAdapter";

export const revalidate = 300;

export default async function Home() {
  const tours = await getTours();

  // Map tours to the shape FeaturedProductsSection expects
  const mappedTours = tours.map((t) => ({
    id: t._id,
    title: t.title,
    description: extractPortableText(t.description),
    price: t.price,
    duration: t.duration,
    image: getTourImage(t._id, t.mainImage?.asset?.url),
    slug: typeof t.slug === 'string' ? t.slug : (t.slug?.current || ''),
    category: t.category,
    rating: t.rating ? String(t.rating) : '4.9',
    reviews: t.reviewCount ? String(t.reviewCount) : '0',
    groupSize: t.groupSize || '',
    features: t.features || t.highlights || [],
    includes: t.includes || [],
  }));

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <PhilosophySection />
      <FeaturedProductsSection tours={mappedTours} />
      <TechnologySection />
      <GallerySection tours={mappedTours} />
      <CollectionSection />
      <TestimonialsSection />
      <EditorialSection />
      <Footer />
    </main>
  );
}
