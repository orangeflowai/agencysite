import React from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TourCard from "@/components/TourCard";
import FAQ from "@/components/FAQ";
import AnimatedSection from "@/components/AnimatedSection";
import ProductRow from "@/components/ProductRow";
import { getTours, getSettings, getPosts } from "@/lib/dataAdapter";
import { getPexelsImages, ROME_QUERIES } from "@/lib/pexels";
import { tours as fallbackTours } from "@/lib/toursData";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Zap, MessageCircle, RefreshCw, Star, Quote, Ticket, BookOpen, Compass, Map, Camera, Coffee, Landmark } from "lucide-react";
import SplitText from "@/components/SplitText";
import dynamic from 'next/dynamic';

const RomeGallery = dynamic(() => import('@/components/RomeGallery'), {
  loading: () => <div className="h-96 w-full bg-card animate-pulse" />
});

export const revalidate = 3600;

export default async function Home() {
  const [toursData, settings, posts, pexelsHero, pexelsVatican, pexelsColosseum] = await Promise.all([
    getTours(),
    getSettings(),
    getPosts(),
    getPexelsImages(ROME_QUERIES.luxury, 1),
    getPexelsImages(ROME_QUERIES.vatican, 4),
    getPexelsImages(ROME_QUERIES.colosseum, 4)
  ]);

  let tours = toursData;
  if (!tours || tours.length === 0) {
    tours = fallbackTours.map((t: any) => ({
      ...t, _id: t.id, slug: { current: t.slug }, mainImage: t.imageUrl,
    })) as any;
  }

  const vaticanTours = tours.filter((t: any) => t.category === 'vatican');
  const colosseumTours = tours.filter((t: any) => t.category === 'colosseum');
  const cityTours = tours.filter((t: any) => t.category === 'city');

  const TOUR_STYLES = [
      { id: 'vatican', title: 'Vatican Series', desc: 'EDITORIAL_CURATION: SISTINE CHAPEL & GARDENS.', icon: Landmark },
      { id: 'colosseum', title: 'Ancient Tapes', desc: 'HISTORICAL_ARCHIVE: ARENA & THE UNDERGROUND.', icon: Map },
      { id: 'city', title: 'City Intervals', desc: 'STREET_LOGIC: PANTHEON, TREVI & PIAZZAS.', icon: Compass },
      { id: 'luxury', title: 'Luxury Nodes', desc: 'OFF_GRID: PRIVATE DRIVES & EXCLUSIVE GEMS.', icon: Camera },
      { id: 'food', title: 'Taste Profile', desc: 'LOCAL_DATA: TRASTEVERE & JEWISH GHETTO.', icon: Coffee },
  ];

  const heroImage = pexelsHero[0]?.url || 'https://images.pexels.com/photos/1797161/pexels-photo-1797161.jpeg';

  return (
    <main className="min-h-screen bg-[#FAF9F6] text-[#5A5A5A] font-sans selection:bg-[#C96442] selection:text-white">
      <Navbar />

      {/* 1. Hero Section - PEXELS POWERED */}
      <section className="relative w-full h-[100vh] min-h-[800px] flex items-center justify-center overflow-hidden bg-[#1A1A1A]">
        <div className="absolute inset-0 z-0">
           <img 
              src={heroImage} 
              alt="Tickets In Rome Hero" 
              className="w-full h-full object-cover animate-[kenburns_20s_ease-out_forwards]"
           />
           <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/80" />
        </div>

        <div className="relative z-10 w-full max-w-[1000px] mx-auto px-6 text-center pt-20">
           <div className="flex items-center justify-center gap-4 mb-8 opacity-0 animate-[fadeUp_0.8s_0.2s_ease-out_forwards]">
              <div className="h-[1px] w-12 bg-[#C96442]" />
              <span className="text-white/80  tracking-[0.4em] text-[0.75rem] font-bold">Verified Priority Access</span>
              <div className="h-[1px] w-12 bg-[#C96442]" />
           </div>
           
           <div className="mb-8">
              <SplitText className="text-white font-serif font-bold leading-[0.95] tracking-[-0.03em] justify-center" style={{ fontSize: 'clamp(3.5rem, 8vw, 6.5rem)' }}>
                 Official Entry Protocols, Reopened.
              </SplitText>
           </div>
           
           <p className="text-white/70 text-lg md:text-2xl font-medium max-w-3xl mx-auto mb-12 leading-relaxed opacity-0 animate-[fadeUp_0.8s_0.6s_ease-out_forwards]">
              Bypass the general queues with authenticated priority vouchers. Curated small group experiences led by accredited art historians.
           </p>
           
           <div className="flex flex-col sm:flex-row items-center justify-center gap-6 opacity-0 animate-[fadeUp_0.8s_0.8s_ease-out_forwards]">
              <Link href="/category/vatican" className="w-full sm:w-auto px-10 py-5 bg-[#C96442] text-white rounded-full font-bold  tracking-widest text-xs transition-all hover:scale-105 shadow-[0_0_40px_rgba(201,100,66,0.3)]">
                 Browse Vatican Entry
              </Link>
              <Link href="/category/colosseum" className="w-full sm:w-auto px-10 py-5 bg-transparent border-2 border-white/20 text-white rounded-full font-bold  tracking-widest text-xs hover:bg-card/10 transition-all">
                 Colosseum Access
              </Link>
           </div>
        </div>
      </section>

      {/* 2. Tour Style Navigator */}
      <AnimatedSection delay={0.1}>
          <section className="py-32 bg-card border-b border-[#E5E5E5]">
              <div className="container mx-auto px-6">
                  <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
                      <div className="max-w-xl">
                          <p className="text-[#C96442] font-bold  tracking-[0.4em] text-[10px] mb-4">Navigation Matrix</p>
                          <SplitText className="text-4xl md:text-6xl font-serif font-bold tracking-tighter   leading-none text-[#0A1628]">Choose Your Tour Style</SplitText>
                      </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                      {TOUR_STYLES.map((style) => (
                          <div key={style.id} className="group relative bg-[#FAF9F5] border border-[#dad9d4] p-8 rounded-2xl hover:bg-[#C96442] hover:border-[#C96442] transition-all duration-500 cursor-pointer overflow-hidden shadow-sm hover:shadow-2xl">
                              <div className="relative z-10">
                                  <style.icon size={28} className="text-[#C96442] group-hover:text-white mb-10 transition-colors" />
                                  <h3 className="text-xl font-serif font-bold text-[#0A1628] group-hover:text-white mb-2 transition-colors  ">{style.title}</h3>
                                  <p className="text-[9px] font-sans font-bold text-[#5A5A5A] group-hover:text-white/70 transition-colors  leading-relaxed tracking-widest">{style.desc}</p>
                              </div>
                              <div className="absolute top-4 right-4 text-[#C96442]/10 group-hover:text-white/10 transition-colors">
                                  <style.icon size={48} />
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          </section>
      </AnimatedSection>

      {/* 3. Vatican Collection */}
      <AnimatedSection id="vatican" delay={0.1}>
        <div className="py-20 bg-[#FAF9F6]">
            <ProductRow title="Vatican Series" subtitle="EDITORIAL_ENTRY: SISTINE CHAPEL & ST. PETERS." tours={vaticanTours} link="/category/vatican" />
        </div>
      </AnimatedSection>

      <RomeGallery />

      {/* 4. Colosseum Section */}
      <AnimatedSection id="colosseum" delay={0.2}>
        <div className="py-20 bg-[#1A1A1A] text-white">
            <ProductRow title="Ancient Rome" subtitle="ANCIENT_ARCHIVE: ARENA & THE UNDERGROUND." tours={colosseumTours} link="/category/colosseum" dark={true} />
        </div>
      </AnimatedSection>

      {/* 5. Brand Benefits */}
      <section className="bg-card py-32 border-b border-[#E5E5E5]">
         <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
               <div className="space-y-12">
                  <div className="space-y-4">
                     <p className="text-[#C96442] font-bold  tracking-[0.4em] text-[10px]">The Golden Standard</p>
                     <h2 className="text-[#0A1628] font-serif font-bold text-6xl leading-[0.9] tracking-tighter  ">Secure. Precise.<br/>Permanent.</h2>
                  </div>
                  <div className="space-y-10">
                     {[
                        { title: 'Skip the Line Protocols', icon: Zap, desc: 'We utilize official partner portals to secure entry times that bypass the 2-3 hour queues.' },
                        { title: 'Licensed Historians', icon: ShieldCheck, desc: 'Every guide is an accredited art historian vetted by the Italian Ministry of Culture.' },
                        { title: 'Small Group Intimacy', icon: MessageCircle, desc: 'Maximum 15 guests for navigation ease and a personalized atmosphere.' },
                     ].map((item, i) => (
                        <div key={i} className="flex gap-6 group">
                           <div className="w-12 h-12 rounded-full bg-[#FAF9F5] border border-[#dad9d4] flex items-center justify-center shrink-0 group-hover:bg-[#C96442] group-hover:text-white transition-all shadow-sm">
                              <item.icon size={20} />
                           </div>
                           <div>
                              <h4 className="text-lg font-bold  tracking-widest text-[#0A1628] mb-1">{item.title}</h4>
                              <p className="text-sm text-[#5A5A5A] leading-relaxed max-w-sm">{item.desc}</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
               <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl border-8 border-[#FAF9F5]">
                  <img src={pexelsColosseum[2]?.url} className="w-full h-full object-cover transition-all duration-1000" alt="Architecture" />
               </div>
            </div>
         </div>
      </section>

      {/* 6. Blog Section */}
      <AnimatedSection delay={0.3}>
          <section className="py-32 bg-[#FAF9F6] border-b border-[#E5E5E5]">
              <div className="container mx-auto px-6">
                  <div className="flex items-end justify-between mb-16 gap-6">
                      <div className="max-w-xl">
                          <p className="text-[#C96442] font-bold  tracking-[0.4em] text-[10px] mb-4">Editorial Archive</p>
                          <SplitText className="text-5xl md:text-7xl font-serif font-bold tracking-tighter   leading-none text-[#0A1628]">The Roman Journal</SplitText>
                      </div>
                      <Link href="/blog" className="inline-flex items-center gap-2 px-8 py-4 border-2 border-[#C96442]/20 text-[#C96442] text-[10px] font-bold  tracking-widest rounded-full hover:bg-[#C96442] hover:text-white transition-all shrink-0">
                        View All Articles <ArrowRight className="w-4 h-4" />
                      </Link>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {posts?.slice(0, 3).map((post: any) => (
                          <Link key={post._id} href={`/blog/${post.slug.current}`} className="group flex flex-col h-full bg-card rounded-2xl overflow-hidden border border-[#dad9d4] hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                              <div className="relative aspect-[16/10] overflow-hidden">
                                  <img src={post.mainImage || pexelsVatican[0]?.url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt={post.title} />
                              </div>
                              <div className="p-8 flex flex-col flex-1">
                                  <span className="text-[10px] font-bold  tracking-widest text-[#C96442] mb-4 block">Archive Entry</span>
                                  <h3 className="text-xl font-serif font-bold text-[#0A1628] mb-4 group-hover:text-[#C96442] transition-colors leading-tight ">{post.title}</h3>
                                  <p className="text-sm text-[#5A5A5A] line-clamp-3 mb-8">{post.excerpt}</p>
                                  <div className="mt-auto flex items-center justify-between">
                                      <span className="text-[10px] font-bold  tracking-[0.2em] text-[#C96442]">Read Record</span>
                                      <div className="w-8 h-8 rounded-full bg-[#C96442]/10 flex items-center justify-center group-hover:bg-[#C96442] group-hover:text-white transition-all"><ArrowRight size={14} /></div>
                                  </div>
                              </div>
                          </Link>
                      ))}
                  </div>
              </div>
          </section>
      </AnimatedSection>

      <div id="faq" className="bg-card"><FAQ /></div>

      <Footer />
    </main>
  );
}
