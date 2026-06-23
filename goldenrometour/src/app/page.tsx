import VaticanHeader from '@/components/vatican/header';
import { HeroSection } from "@/components/sections/hero-section";
import { PhilosophySection } from "@/components/sections/philosophy-section";
import { FeaturedProductsSection } from "@/components/sections/featured-products-section";
import { GallerySection } from "@/components/sections/gallery-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { FooterSection } from "@/components/sections/footer-section";
import { getTours } from "@/lib/dataAdapter";

export const revalidate = 300;

export default async function Home() {
  const tours = await getTours();

  // Map tours to the shape FeaturedProductsSection expects
  const mappedTours = tours.map((t) => ({
    id: t._id,
    title: t.title,
    description: typeof t.description === 'string' ? t.description : '',
    price: t.price,
    duration: t.duration,
    image: t.mainImage?.asset?.url || (t.mainImage as any) || '',
    slug: t.slug?.current || (t.slug as any) || '',
    category: t.category,
    rating: t.rating ? String(t.rating) : '4.9',
    reviews: t.reviewCount ? String(t.reviewCount) : '0',
    badge: (t as any).badge,
  }));

  return (
    <main className="min-h-screen bg-background">
      <VaticanHeader />
      <HeroSection />
      <PhilosophySection tours={tours} />
      <FeaturedProductsSection tours={mappedTours} />
      <GallerySection />
      <TestimonialsSection />
      <FooterSection />
    </main>
  );
}
