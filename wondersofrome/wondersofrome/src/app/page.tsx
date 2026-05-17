import Navbar from "@/components/Navbar";
import WondersHero from "@/components/WondersHero";
import Footer from "@/components/Footer";
import Testimonials from "@/components/Testimonials";
import WhatsAppButton from "@/components/WhatsAppButton";
import { getTours, getSettings, getPosts } from "@/lib/dataAdapter";
import { getPexelsImages, ROME_QUERIES } from "@/lib/pexels";
import { tours as fallbackTours } from "@/lib/toursData";
import dynamic from 'next/dynamic';
import { ArrowRight, Clock, Users, Star } from 'lucide-react';
import Link from "next/link";
import ScrollMaskText from "@/components/ScrollMaskText";
import ParallaxImage from "@/components/ParallaxImage";
import WordHighlight from "@/components/WordHighlight";
import AutoScrollTourSection from "@/components/AutoScrollTourSection";
import { PhilosophySection } from "@/components/PhilosophySection";
import { TechnologySection } from "@/components/TechnologySection";

export const revalidate = 300; // Revalidate every 5 minutes

const FAQ = dynamic(() => import('@/components/FAQ'));

const SEO_KEYWORDS = ["Vatican", "Colosseum", "Rome", "AR audio guide", "Skip-the-line", "Wonders of Rome", "Ancient Power"];
const R2 = 'https://pub-772bbb33a07f4026aa9652a0cfef4c2e.r2.dev/rome%20photos';
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
    getTours(),
    getSettings(),
    getPosts(),
    getPexelsImages(ROME_QUERIES.vatican, 20),
    getPexelsImages(ROME_QUERIES.colosseum, 20)
  ]);

  let tours = toursData;
  if (!tours || tours.length === 0) {
    tours = fallbackTours.map((t: any) => ({
      ...t, _id: t.id, slug: { current: t.slug }, mainImage: t.imageUrl,
    })) as any;
  }

  // Ensure all tours have a valid image fallback from Pexels
  tours = tours.map((tour: any, idx: number) => ({
    ...tour,
    mainImage: tour.mainImage || (tour.category === 'colosseum' ? pexelsColosseum[idx % 20]?.url : pexelsVatican[idx % 20]?.url)
  }));

  const vaticanTours    = tours.filter((t: any) => t.category === 'vatican');
  const colosseumTours  = tours.filter((t: any) => t.category === 'colosseum');
  const cityTours       = tours.filter((t: any) => t.category === 'city');

  // Fill GALLERY_IMAGES to at least 9 using Pexels Vatican images
  const finalGalleryImages = [...GALLERY_IMAGES];
  if (finalGalleryImages.length < 9) {
    const missingCount = 9 - finalGalleryImages.length;
    for (let i = 0; i < missingCount; i++) {
      if (pexelsVatican[i]) {
        finalGalleryImages.push(pexelsVatican[i].url);
      }
    }
  }

  return (
    <main className="min-h-screen bg-background selection:bg-primary selection:text-white font-sans">
      <Navbar />
      <WondersHero settings={settings} />

      {/* Philosophy Section - Scroll-animated tour cards */}
      <PhilosophySection />

      {/* Technology Section - Multi-image reveal */}
      <TechnologySection />

      {/* Vatican Tours Section - Auto Scroll */}
      <AutoScrollTourSection
        title="Vatican Museums & Sistine Chapel"
        subtitle="Skip the line to the Sistine Chapel, Vatican Museums, Gardens, and St. Peter's Basilica."
        tours={vaticanTours}
        link="/category/vatican"
        category="vatican"
      />

      {/* Colosseum Tours Section - Auto Scroll */}
      <AutoScrollTourSection
        title="Colosseum & Ancient Rome"
        subtitle="Walk in the footsteps of Gladiators. Arena Floor, Underground, and Roman Forum."
        tours={colosseumTours}
        link="/category/colosseum"
        category="colosseum"
      />

      {/* Social Proof Bar */}
      <div className="border-b border-border bg-card py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h3 className="text-[#8A8A8A] font-bold tracking-widest text-[10px] mb-8">Authenticated by 50,000+ Verified Logs</h3>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-40 hover:opacity-100 transition-all duration-500">
               <span className="font-serif font-bold text-xl text-foreground">TripAdvisor</span>
               <span className="font-serif font-bold text-xl text-foreground">Google</span>
               <span className="font-serif font-bold text-xl text-foreground">Viator Elite</span>
               <span className="font-serif font-bold text-xl text-foreground">GetYourGuide</span>
            </div>
          </div>
      </div>

      {/* Tour Guide App Section - Full Screen Cinematic */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-black text-white py-24 md:py-32">
           {/* Background Image Layer */}
           <div className="absolute inset-0 z-0">
              <ParallaxImage 
                src="/replace_the_screen_of_the_202605041559.jpeg" 
                alt="Wonders of Rome proprietary AR guide engine - Augmented Reality experience in Rome" 
                className="w-full h-full object-cover opacity-60"
                aspectRatio="h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
           </div>

           <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
              <div className="max-w-4xl mx-auto space-y-12">
                 <div className="space-y-6">
                    <span className="inline-block px-6 py-2 bg-primary/20 border border-primary/30 text-primary text-[10px] font-bold tracking-[0.4em] rounded-full backdrop-blur-md">
                      Next Gen Hardware Integration
                    </span>
                    <ScrollMaskText className="text-6xl md:text-8xl lg:text-9xl font-serif font-bold leading-[0.85] text-white justify-center" as="h2">
                     THE WONDERS GUIDE APP
                    </ScrollMaskText>
                 </div>
                 
                 <p className="text-xl md:text-2xl opacity-80 max-w-2xl mx-auto font-mono leading-relaxed tracking-tighter">
                   <WordHighlight keywords={SEO_KEYWORDS} highlightClassName="text-white font-bold underline decoration-primary">
                     EXPERIENCE ROME THROUGH OUR PROPRIETARY AUGMENTED REALITY ENGINE. REAL-TIME DATA OVERLAYS AND HIGH-FIDELITY AUDIO ARCHIVES.
                   </WordHighlight>
                 </p>

                 <div className="flex flex-wrap justify-center gap-8 pt-8">
                    <img src="https://pub-772bbb33a07f4026aa9652a0cfef4c2e.r2.dev/logod/applestore.png" alt="Download Wonders of Rome AR audio guide app on Apple App Store" className="h-16 w-auto object-contain cursor-pointer hover:scale-105 transition-transform" />
                    <img src="https://pub-772bbb33a07f4026aa9652a0cfef4c2e.r2.dev/logod/googleplay.png" alt="Download Wonders of Rome AR audio guide app on Google Play Store" className="h-16 w-auto object-contain cursor-pointer hover:scale-105 transition-transform" />
                 </div>
              </div>
           </div>
           
           <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-40">
              <div className="w-[1px] h-20 bg-white" />
           </div>
        </section>

      {/* Reviews */}
      <div className="py-24 md:py-32 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16 md:mb-20">
             <p className="text-primary font-bold tracking-[0.4em] text-[10px] mb-4">Verified Feedback</p>
             <ScrollMaskText className="text-5xl md:text-7xl font-serif font-bold tracking-tighter leading-none text-foreground justify-center" as="h2">
               Guest Reviews
             </ScrollMaskText>
          </div>
          <Testimonials />
        </div>
      </div>

              {/* Blog Section */}
      <section className="py-24 md:py-32 bg-background border-b border-border">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-6">
                  <div className="max-w-xl">
                      <p className="text-primary font-bold tracking-[0.4em] text-[10px] mb-4">Travel Guides</p>
                      <ScrollMaskText className="text-5xl md:text-7xl font-serif font-bold tracking-tighter leading-none text-foreground" as="h2">
                        The Roman Journal
                      </ScrollMaskText>
                  </div>
                  <Link href="/blog" className="inline-flex items-center gap-2 px-8 py-4 border-2 border-primary/20 text-primary text-[10px] font-bold tracking-widest rounded-full hover:bg-primary hover:text-white transition-all shrink-0 hover-underline">
                    View All Articles <ArrowRight size={14} />
                  </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {posts?.slice(0, 3).map((post: any) => (
                      <Link key={post._id} href={`/blog/${post.slug.current}`} className="group flex flex-col h-full bg-card rounded-[2.5rem] overflow-hidden border border-border hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                          <div className="relative aspect-[16/10] overflow-hidden">
                              <ParallaxImage 
                                src={post.mainImage || pexelsVatican[1]?.url} 
                                alt={`${post.title} - Rome travel guide by Wonders of Rome`} 
                                aspectRatio="aspect-[16/10]"
                              />
                          </div>
                          <div className="p-8 md:p-10 flex flex-col flex-1">
                              <span className="text-[10px] font-bold tracking-widest text-primary mb-4 block">Travel Guide</span>
                              <h3 className="text-2xl font-serif font-bold text-foreground mb-4 group-hover:text-primary transition-colors leading-tight">
                                <WordHighlight keywords={SEO_KEYWORDS}>{post.title}</WordHighlight>
                              </h3>
                              <p className="text-sm text-muted-foreground line-clamp-3 mb-8 font-medium leading-relaxed">{post.excerpt}</p>
                              <div className="mt-auto flex items-center justify-between pt-6 border-t border-border/50">
                                  <span className="text-[10px] font-bold tracking-[0.2em] text-primary">Read Article</span>
                                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all"><ArrowRight size={14} /></div>
                              </div>
                          </div>
                      </Link>
                  ))}
              </div>
          </div>
      </section>

      <div id="faq" className="bg-background">
        <div className="py-24 md:py-32 border-t border-border/50">
          <FAQ />
        </div>
      </div>

      <Footer />
      <WhatsAppButton />
    </main>
  );
}
