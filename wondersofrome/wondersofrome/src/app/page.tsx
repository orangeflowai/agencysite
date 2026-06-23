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

  // Safety filter: Only include tours and posts with valid slugs
  let tours = (toursData || []).filter((t: any) => t?.slug?.current);
  const safePosts = (posts || []).filter((p: any) => p?.slug?.current);

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

  return (
    <main className="min-h-screen bg-background selection:bg-primary selection:text-white font-sans">
      <Navbar />
      <WondersHero settings={settings} />

      {/* Philosophy Section */}
      <PhilosophySection />

      {/* Technology Section */}
      <TechnologySection />

      {/* Vatican Tours Section */}
      <AutoScrollTourSection
        title="Vatican Museums & Sistine Chapel"
        subtitle="Skip the line to the Sistine Chapel, Vatican Museums, Gardens, and St. Peter's Basilica."
        tours={vaticanTours}
        link="/category/vatican"
        category="vatican"
      />

      {/* Colosseum Tours Section */}
      <AutoScrollTourSection
        title="Colosseum & Ancient Rome"
        subtitle="Walk in the footsteps of Gladiators. Arena Floor, Underground, and Roman Forum."
        tours={colosseumTours}
        link="/category/colosseum"
        category="colosseum"
      />

      {/* Trust & Social Proof Bar */}
      <section className="border-y border-border bg-card/50 backdrop-blur-sm py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-primary font-bold tracking-[0.4em] text-[10px] uppercase mb-4">Official Verification</p>
              <h3 className="text-2xl md:text-3xl font-serif font-bold text-foreground">Trusted by 50,000+ Global Travelers</h3>
            </div>
            
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-20">
               <div className="flex flex-col items-center gap-3 group">
                  <span className="font-serif font-bold text-2xl text-foreground/40 group-hover:text-foreground transition-colors">TripAdvisor</span>
                  <div className="flex gap-1 text-amber-400">
                    {[1,2,3,4,5].map(i => <Star key={i} size={12} fill="currentColor" />)}
                  </div>
               </div>
               <div className="flex flex-col items-center gap-3 group">
                  <span className="font-serif font-bold text-2xl text-foreground/40 group-hover:text-foreground transition-colors">Google</span>
                  <div className="flex gap-1 text-sky-500">
                    {[1,2,3,4,5].map(i => <Star key={i} size={12} fill="currentColor" />)}
                  </div>
               </div>
               <div className="flex flex-col items-center gap-3 group">
                  <span className="font-serif font-bold text-2xl text-foreground/40 group-hover:text-foreground transition-colors">Viator Elite</span>
                  <span className="text-[10px] font-bold text-primary tracking-widest">LICENSED PARTNER</span>
               </div>
               <div className="flex flex-col items-center gap-3 group">
                  <span className="font-serif font-bold text-2xl text-foreground/40 group-hover:text-foreground transition-colors">GetYourGuide</span>
                  <span className="text-[10px] font-bold text-accent tracking-widest">TOP RATED 2026</span>
               </div>
            </div>

            {/* Trust Badges */}
            <div className="mt-16 flex flex-wrap justify-center gap-8 md:gap-16 pt-12 border-t border-border/50">
               <div className="flex items-center gap-3 px-6 py-3 bg-background rounded-full border border-border">
                  <CheckCircle className="text-primary w-5 h-5" />
                  <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">Instant Confirmation</span>
               </div>
               <div className="flex items-center gap-3 px-6 py-3 bg-background rounded-full border border-border">
                  <CheckCircle className="text-primary w-5 h-5" />
                  <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">Expert Historian Guides</span>
               </div>
               <div className="flex items-center gap-3 px-6 py-3 bg-background rounded-full border border-border">
                  <CheckCircle className="text-primary w-5 h-5" />
                  <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">Secure SSL Payment</span>
               </div>
            </div>
          </div>
      </section>

      {/* Tour Guide App Section */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-black text-white py-24 md:py-32">
           <div className="absolute inset-0 z-0">
              <ParallaxImage 
                src="/replace_the_screen_of_the_202605041559.jpeg" 
                alt="Wonders of Rome proprietary AR guide engine" 
                className="w-full h-full object-cover opacity-60"
                aspectRatio="h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
           </div>

           <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
              <div className="max-w-4xl mx-auto space-y-12">
                 <div className="space-y-6">
                    <span className="inline-block px-6 py-2 bg-primary/20 border border-primary/30 text-primary text-[8px] font-bold tracking-[0.4em] rounded-full backdrop-blur-md">
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
                    <Image src="https://pub-772bbb33a07f4026aa9652a0cfef4c2e.r2.dev/logod/applestore.png" alt="Download on Apple" width={160} height={64} className="h-16 w-auto object-contain cursor-pointer hover:scale-105 transition-transform" />
                    <Image src="https://pub-772bbb33a07f4026aa9652a0cfef4c2e.r2.dev/logod/googleplay.png" alt="Download on Google" width={160} height={64} className="h-16 w-auto object-contain cursor-pointer hover:scale-105 transition-transform" />
                 </div>
              </div>
           </div>
        </section>

      {/* Reviews */}
      <div className="py-24 md:py-32 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16 md:mb-20">
             <p className="text-primary font-bold tracking-[0.4em] text-[8px] mb-4">Verified Feedback</p>
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
                      <p className="text-primary font-bold tracking-[0.4em] text-[8px] mb-4">Travel Guides</p>
                      <ScrollMaskText className="text-5xl md:text-7xl font-serif font-bold tracking-tighter leading-none text-foreground" as="h2">
                        The Roman Journal
                      </ScrollMaskText>
                  </div>
                  <Link href="/blog" className="inline-flex items-center gap-2 px-8 py-4 border-2 border-primary/20 text-primary text-[8px] font-bold tracking-widest rounded-full hover:bg-primary hover:text-white transition-all shrink-0 hover-underline">
                    View All Articles <ArrowRight size={14} />
                  </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {safePosts?.slice(0, 3).map((post: any) => (
                      <Link key={post._id} href={`/blog/${post.slug.current}`} className="group flex flex-col h-full bg-card rounded-[2.5rem] overflow-hidden border border-border hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                          <div className="relative aspect-[16/10] overflow-hidden">
                              <ParallaxImage 
                                src={post.mainImage || pexelsVatican[1]?.url} 
                                alt={post.title} 
                                aspectRatio="aspect-[16/10]"
                              />
                          </div>
                          <div className="p-8 md:p-10 flex flex-col flex-1">
                              <span className="text-[8px] font-bold tracking-widest text-primary mb-4 block">Travel Guide</span>
                              <h3 className="text-2xl font-serif font-bold text-foreground mb-4 group-hover:text-primary transition-colors leading-tight">
                                <WordHighlight keywords={SEO_KEYWORDS}>{post.title}</WordHighlight>
                              </h3>
                              <p className="text-sm text-muted-foreground line-clamp-3 mb-8 font-medium leading-relaxed">{post.excerpt}</p>
                              <div className="mt-auto flex items-center justify-between pt-6 border-t border-border/50">
                                  <span className="text-[8px] font-bold tracking-[0.2em] text-primary">Read Article</span>
                                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all"><ArrowRight size={14} /></div>
                              </div>
                          </div>
                      </Link>
                  ))}
              </div>
          </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="bg-background py-24 md:py-32 border-t border-border/20">
          <FAQ />
      </section>

      <Footer />
      <WhatsAppButton />
    </main>
  );
}
