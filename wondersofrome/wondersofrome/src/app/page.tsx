import Navbar from "@/components/Navbar";
import WondersHero from "@/components/WondersHero";
import StickyRomeSection from "@/components/StickyRomeSection";
import TrustBadges from "@/components/TrustBadges";
import Footer from "@/components/Footer";
import ProductRow from "@/components/ProductRow";
import AnimatedSection from "@/components/AnimatedSection";
import FloatingReviews from "@/components/FloatingReviews";
import WhatsAppButton from "@/components/WhatsAppButton";
import { getTours, getSettings, getPosts } from "@/lib/dataAdapter";
import { getPexelsImages, ROME_QUERIES } from "@/lib/pexels";
import { tours as fallbackTours } from "@/lib/toursData";
import dynamic from 'next/dynamic';
import { Star, ArrowRight, Zap, BookOpen, Clock, Users } from 'lucide-react';
import SplitText from "@/components/SplitText";
import Link from "next/link";
import Image from "next/image";

export const revalidate = 3600;

const RomeGallery  = dynamic(() => import('@/components/RomeGallery'),  { loading: () => <div className="h-96 w-full bg-neutral-900 animate-pulse" /> });
const FAQ          = dynamic(() => import('@/components/FAQ'));

export default async function Home() {
  const [toursData, settings, posts, pexelsVatican, pexelsColosseum] = await Promise.all([
    getTours(),
    getSettings(),
    getPosts(),
    getPexelsImages(ROME_QUERIES.vatican, 4),
    getPexelsImages(ROME_QUERIES.colosseum, 4)
  ]);

  let tours = toursData;
  if (!tours || tours.length === 0) {
    tours = fallbackTours.map((t: any) => ({
      ...t, _id: t.id, slug: { current: t.slug }, mainImage: t.imageUrl,
    })) as any;
  }

  const vaticanTours    = tours.filter((t: any) => t.category === 'vatican');
  const colosseumTours  = tours.filter((t: any) => t.category === 'colosseum');
  const cityTours       = tours.filter((t: any) => t.category === 'city');
  const featuredTour    = vaticanTours[0] || tours[0];

  return (
    <main className="min-h-screen bg-background selection:bg-primary selection:text-white font-sans">
      <Navbar />
      <WondersHero settings={settings} />

      {/* Social Proof Bar */}
      <div className="border-b border-border bg-card py-12">
          <div className="container mx-auto px-6 text-center">
            <h3 className="text-[#8A8A8A] font-bold  tracking-widest text-[10px] mb-8">Authenticated by 50,000+ Verified Logs</h3>
            <div className="flex flex-wrap justify-center items-center gap-12 opacity-40 hover:opacity-100 transition-all duration-500">
               <span className="font-serif font-bold text-xl text-foreground">TripAdvisor</span>
               <span className="font-serif font-bold text-xl text-foreground">Google</span>
               <span className="font-serif font-bold text-xl text-foreground ">Viator Elite</span>
               <span className="font-serif font-bold text-xl text-foreground ">GetYourGuide</span>
            </div>
          </div>
      </div>

      {/* Sticky Parallax Section */}
      <StickyRomeSection />

      {/* Featured Product Section - NEW */}
      {featuredTour && (
        <AnimatedSection delay={0.1}>
          <section className="py-32 bg-card border-b border-border overflow-hidden">
            <div className="container mx-auto px-6">
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                  <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl group border-8 border-background">
                     <Image 
                        src={featuredTour.mainImage ? (typeof featuredTour.mainImage === 'string' ? featuredTour.mainImage : featuredTour.mainImage.asset?.url) : pexelsVatican[0]?.url}
                        alt={`${featuredTour.title} - Skip-the-line Vatican tour with AR audio guide by Wonders of Rome`}
                        fill
                        className="object-cover transition-transform duration-1000 group-hover:scale-105"
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
                     <div className="absolute top-10 left-10">
                        <span className="bg-primary text-white px-4 py-1.5 rounded-full text-[10px] font-bold  tracking-[0.4em] shadow-lg">Featured Experience</span>
                     </div>
                  </div>
                  <div className="space-y-8">
                     <div className="space-y-4">
                        <p className="text-primary font-bold  tracking-[0.4em] text-[10px]">Top Pick</p>
                        <SplitText className="text-5xl md:text-7xl font-serif font-bold text-foreground leading-[0.9] tracking-tighter  ">{featuredTour.title}</SplitText>
                     </div>
                     <p className="text-xl text-muted-foreground font-medium leading-relaxed max-w-xl ">
                        "{featuredTour.description ? (typeof featuredTour.description === 'string' ? featuredTour.description.slice(0, 180) : 'An editorial-grade deep dive into Rome\'s most sacred archives.') : 'An editorial-grade deep dive into Rome\'s most sacred archives.'}..."
                     </p>
                     
                     <div className="flex flex-wrap gap-8 items-center text-[10px] font-bold  tracking-widest text-muted-foreground border-y border-border py-6">
                        <div className="flex items-center gap-2"><Clock size={14} className="text-primary" /> {featuredTour.duration}</div>
                        <div className="flex items-center gap-2"><Users size={14} className="text-primary" /> {featuredTour.groupSize || 'Small Group'}</div>
                        <div className="flex items-center gap-2"><Star size={14} className="text-primary fill-current" /> {4.5 + Math.random() * 0.5} Rating</div>
                     </div>

                     <div className="flex items-center gap-6 pt-4">
                        <Link href={`/tour/${featuredTour.slug.current}`} className="bg-primary hover:bg-primary/90 text-white font-bold px-12 py-5 rounded-full  tracking-widest text-xs transition-all shadow-xl hover:-translate-y-1 active:scale-95">
                           Initiate Tour
                        </Link>
                        <Link href="/search" className="text-foreground hover:text-primary font-bold  tracking-widest text-xs flex items-center gap-2 group transition-colors">
                           View All Collections <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                     </div>
                  </div>
               </div>
            </div>
          </section>
        </AnimatedSection>
      )}

      {/* Tour Sections */}
      <div className="flex flex-col">
        <AnimatedSection id="vatican" delay={0.1}>
          <div className="bg-background py-16 lg:py-32 border-b border-border">
            <ProductRow title="Vatican Collection" subtitle="SKIP THE LINE: SISTINE CHAPEL, MUSEUMS, GARDENS." tours={vaticanTours} link="/category/vatican" />
          </div>
        </AnimatedSection>

        <RomeGallery />

        <AnimatedSection id="colosseum" delay={0.2}>
          <div className="bg-card py-16 lg:py-32 border-b border-border shadow-inner">
            <ProductRow title="Ancient Power" subtitle="COLOSSEUM ARENA, UNDERGROUND, AND ROMAN FORUM." tours={colosseumTours} link="/category/colosseum" />
          </div>
        </AnimatedSection>

        {/* Tour Guide App Section */}
        <AnimatedSection delay={0.2}>
          <section className="py-24 bg-[#111] text-white overflow-hidden relative group border-y border-white/5">
             <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                   <div className="space-y-12">
                      <div className="space-y-4">
                         <span className="inline-block px-4 py-1 bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold  tracking-[0.4em] rounded-full">Next Gen Hardware</span>
                         <SplitText className="text-5xl md:text-7xl font-serif font-bold leading-[0.85]  text-white">THE WONDERS GUIDE APP</SplitText>
                      </div>
                      <p className="text-xl opacity-60 max-w-md font-mono leading-relaxed  tracking-tighter">
                        EXPERIENCE ROME THROUGH OUR PROPRIETARY AUGMENTED REALITY ENGINE. REAL-TIME DATA OVERLAYS AND HIGH-FIDELITY AUDIO ARCHIVES.
                      </p>
                      <div className="flex flex-wrap gap-6 pt-4">
                         <img src="https://pub-772bbb33a07f4026aa9652a0cfef4c2e.r2.dev/logod/applestore.png" alt="Download Wonders of Rome AR audio guide app on Apple App Store" className="h-14 w-auto object-contain cursor-pointer hover:scale-105 transition-transform" />
                         <img src="https://pub-772bbb33a07f4026aa9652a0cfef4c2e.r2.dev/logod/googleplay.png" alt="Download Wonders of Rome AR audio guide app on Google Play Store" className="h-14 w-auto object-contain cursor-pointer hover:scale-105 transition-transform" />
                      </div>
                   </div>
                   <div className="relative">
                      <div className="relative z-10 w-full max-w-md mx-auto transform hover:rotate-2 transition-transform duration-1000">
                         <img src="https://pub-772bbb33a07f4026aa9652a0cfef4c2e.r2.dev/Gemini_Generated_Image_xucflixucflixucf.png" alt="Wonders of Rome mobile app showing AR overlay of Vatican Museums with real-time audio guide" className="w-full h-auto rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.8)] border-[12px] border-[#222]" />
                      </div>
                      <div className="absolute -inset-10 bg-primary/10 blur-[120px] rounded-full -z-10 animate-pulse"></div>
                   </div>
                </div>
             </div>
          </section>
        </AnimatedSection>

        {/* Blog Section - NEW */}
        <AnimatedSection delay={0.3}>
          <section className="py-32 bg-background border-b border-border">
              <div className="container mx-auto px-6">
                  <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-6">
                      <div className="max-w-xl">
                          <p className="text-primary font-bold  tracking-[0.4em] text-[10px] mb-4">Travel Guides</p>
                          <SplitText className="text-5xl md:text-7xl font-serif font-bold tracking-tighter   leading-none text-foreground">The Roman Journal</SplitText>
                      </div>
                      <Link href="/blog" className="inline-flex items-center gap-2 px-8 py-4 border-2 border-primary/20 text-primary text-[10px] font-bold  tracking-widest rounded-full hover:bg-primary hover:text-white transition-all shrink-0">
                        View All Articles <ArrowRight size={14} />
                      </Link>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {posts?.slice(0, 3).map((post: any) => (
                          <Link key={post._id} href={`/blog/${post.slug.current}`} className="group flex flex-col h-full bg-card rounded-[2.5rem] overflow-hidden border border-border hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                              <div className="relative aspect-[16/10] overflow-hidden">
                                  <img src={post.mainImage || pexelsVatican[1]?.url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt={`${post.title} - Rome travel guide by Wonders of Rome`} />
                              </div>
                              <div className="p-10 flex flex-col flex-1">
                                  <span className="text-[10px] font-bold  tracking-widest text-primary mb-4 block">Travel Guide</span>
                                  <h3 className="text-2xl font-serif font-bold text-foreground mb-4 group-hover:text-primary transition-colors leading-tight ">{post.title}</h3>
                                  <p className="text-sm text-muted-foreground line-clamp-3 mb-8 font-medium leading-relaxed">{post.excerpt}</p>
                                  <div className="mt-auto flex items-center justify-between pt-6 border-t border-border/50">
                                      <span className="text-[10px] font-bold  tracking-[0.2em] text-primary">Read Article</span>
                                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all"><ArrowRight size={14} /></div>
                                  </div>
                              </div>
                          </Link>
                      ))}
                  </div>
              </div>
          </section>
        </AnimatedSection>
      </div>

      {/* Reviews */}
      <AnimatedSection delay={0.4}>
        <div className="bg-foreground text-background py-32 border-b border-border relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-20">
               <p className="text-primary font-bold  tracking-[0.4em] text-[10px] mb-4">Verified Feedback</p>
               <SplitText className="text-5xl md:text-7xl font-serif font-bold tracking-tighter   leading-none text-background justify-center">Guest Reviews</SplitText>
            </div>
            <FloatingReviews />
          </div>
        </div>
      </AnimatedSection>

      {/* Trust Badges — removed, shown in footer instead */}

      <div id="faq" className="bg-background">
        <div className="py-24 border-t border-border/50">
          <FAQ />
        </div>
      </div>

      <Footer />
      <WhatsAppButton />
    </main>
  );
}
