import Navbar from "@/components/Navbar";
import Image from "next/image";
import WondersHero from "@/components/WondersHero";
import Footer from "@/components/Footer";
import Testimonials from "@/components/Testimonials";
import WhatsAppButton from "@/components/WhatsAppButton";
import { getToursWithLivePrices, getSettings, getPosts } from "@/lib/sanityService";
import { getPexelsImages, ROME_QUERIES } from "@/lib/pexels";
import { tours as fallbackTours } from "@/lib/toursData";
import dynamic from 'next/dynamic';
import { ArrowRight, Clock, Users, Star, CheckCircle } from 'lucide-react';
import Link from "next/link";
import ScrollMaskText from "@/components/ScrollMaskText";
import ParallaxImage from "@/components/ParallaxImage";
import WordHighlight from "@/components/WordHighlight";
import AutoScrollTourSection from "@/components/AutoScrollTourSection";
import { PhilosophySection } from "@/components/PhilosophySection";
import { TechnologySection } from "@/components/TechnologySection";
import TicketsInRomeHome from "@/components/TicketsInRomeHome";
import { DEFAULT_SITE_ID } from "@/lib/dataAdapter";

export const revalidate = 60;

const FAQ = dynamic(() => import('@/components/FAQ'));

const SEO_KEYWORDS = ["Vatican", "Colosseum", "Rome", "AR audio guide", "Skip-the-line", "Wonders of Rome", "Ancient Power"];
const GALLERY_IMAGES = [
  'https://pub-772bbb33a07f4026aa9652a0cfef4c2e.r2.dev/section_images/extend_this_image_202604281706.jpeg',
  'https://pub-772bbb33a07f4026aa9652a0cfef4c2e.r2.dev/section_images/extend_this_image_202604281703.jpeg',
  'https://pub-772bbb33a07f4026aa9652a0cfef4c2e.r2.dev/section_images/extend_this_imgae_202604281701.jpeg',
  'https://pub-772bbb33a07f4026aa9652a0cfef4c2e.r2.dev/section_images/f8dc34db687eb4769b32be8032324505.jpg',
  'https://pub-772bbb33a07f4026aa9652a0cfef4c2e.r2.dev/section_images/fb4d6b804484ebe61d7e113e8523b5d8.jpg',
  'https://pub-772bbb33a07f4026aa9652a0cfef4c2e.r2.dev/section_images/pexels-ensar-84745078-32114348.jpg',
  'https://pub-772bbb33a07f4026aa9652a0cfef4c2e.r2.dev/section_images/pexels-jarod-13548736.jpg',
];

export default async function Home() {
  const [toursData, settings, posts, pexelsVatican, pexelsColosseum] = await Promise.all([
    getToursWithLivePrices(),
    getSettings(),
    getPosts(),
    getPexelsImages(ROME_QUERIES.vatican, 20),
    getPexelsImages(ROME_QUERIES.colosseum, 20)
  ]);

  let tours = (toursData || []).filter((t: any) => t?.slug?.current);
  const safePosts = (posts || []).filter((p: any) => p?.slug?.current);

  if (!tours || tours.length === 0) {
    tours = fallbackTours.map((t: any) => ({
      ...t, _id: t.id, slug: { current: t.slug }, mainImage: t.imageUrl,
    })) as any;
  }

  tours = tours.map((tour: any, idx: number) => ({
    ...tour,
    mainImage: tour.mainImage || (tour.category === 'colosseum' ? pexelsColosseum[idx % 20]?.url : pexelsVatican[idx % 20]?.url)
  }));

  const vaticanTours    = tours.filter((t: any) => t.category === 'vatican');
  const colosseumTours  = tours.filter((t: any) => t.category === 'colosseum');

  if (DEFAULT_SITE_ID === 'ticketsinrome') {
    const heroImgs = GALLERY_IMAGES.length > 0 ? GALLERY_IMAGES : pexelsVatican.slice(0, 3).map((p: any) => p.url);
    return (
      <>
        <Navbar />
        <TicketsInRomeHome
          tours={tours}
          vaticanTours={vaticanTours}
          colosseumTours={colosseumTours}
          posts={safePosts}
          heroImages={heroImgs}
        />
        <Footer />
        <WhatsAppButton />
      </>
    );
  }

  return (
    <main>FALLBACK - wondersofrome path</main>
  );
}
