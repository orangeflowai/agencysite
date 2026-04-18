import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TrustBadges from "@/components/TrustBadges";
import Footer from "@/components/Footer";
import ProductRow from "@/components/ProductRow";
import AnimatedSection from "@/components/AnimatedSection";
import HighlightSection from "@/components/HighlightSection";
import { getTours, getSettings } from "@/lib/dataAdapter";
import { tours as fallbackTours } from "@/lib/toursData";
import dynamic from 'next/dynamic';
import { Compass, Map, Camera, Coffee, Landmark, Apple, Play } from 'lucide-react';

export const revalidate = 3600;

const R2 = 'https://pub-772bbb33a07f4026aa9652a0cfef4c2e.r2.dev/rome%20photos';

const RomeGallery      = dynamic(() => import('@/components/RomeGallery'),      { loading: () => <div className="h-96 w-full bg-[#1A1210] animate-pulse" /> });
const FloatingReviews  = dynamic(() => import('@/components/FloatingReviews'),  { ssr: true });
const StickyRomeSection = dynamic(() => import('@/components/StickyRomeSection'));
const FAQ              = dynamic(() => import('@/components/FAQ'));

export default async function Home() {
  let tours = await getTours();
  const settings = await getSettings();

  if (!tours || tours.length === 0) {
    tours = fallbackTours.map((t: any) => ({
      ...t, _id: t.id, slug: { current: t.slug }, mainImage: t.imageUrl,
    })) as any;
  }

  const vaticanTours    = tours.filter((t: any) => t.category === 'vatican');
  const colosseumTours  = tours.filter((t: any) => t.category === 'colosseum');
  const cityTours       = tours.filter((t: any) => t.category === 'city');
  const hiddenGemsTours = tours.filter((t: any) => t.category === 'hidden-gems');

  const TOUR_STYLES = [
      { id: 'vatican', title: 'Vatican Series', desc: 'EDITORIAL_CURATION: SISTINE CHAPEL & GARDENS.', icon: Landmark },
      { id: 'colosseum', title: 'Ancient Tapes', desc: 'HISTORICAL_ARCHIVE: ARENA & THE UNDERGROUND.', icon: Map },
      { id: 'city', title: 'City Intervals', desc: 'STREET_LOGIC: PANTHEON, TREVI & PIAZZAS.', icon: Compass },
      { id: 'hidden-gems', title: 'Hidden Tracks', desc: 'ANALOG_ROME: CATACOMBS & PRIVATE GEMS.', icon: Camera },
      { id: 'food', title: 'Taste Profile', desc: 'LOCAL_DATA: TRASTEVERE & JEWISH GHETTO.', icon: Coffee },
  ];

  return (
    <main className="min-h-screen bg-[#F5F0E8] font-sans selection:bg-[#1A3626] selection:text-white">
      <Navbar />
      <Hero settings={settings} />

      {/* Stats ticker */}
      <div className="py-4 overflow-hidden bg-[#1A3626] border-y border-white/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-white/10">
            {[
              { stat: '50,000+', label: 'Verified Logs' },
              { stat: '10 Years', label: 'Uptime' },
              { stat: '4.9 ★',  label: 'User Rating' },
              { stat: 'LIVE',    label: 'Support Active' },
            ].map((item) => (
              <div key={item.label} className="text-center px-4 py-1">
                <p className="font-serif font-bold text-xl md:text-2xl leading-none text-[#F5F0E8] italic">{item.stat}</p>
                <p className="font-sans text-[8px] uppercase tracking-[0.3em] mt-1 text-white/40 font-black">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tour Style Navigator (Avero Inspired) */}
      <AnimatedSection delay={0.1}>
          <section className="py-24 bg-[#F5F0E8] border-b border-[#1A3626]/10">
              <div className="container mx-auto px-6">
                  <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
                      <div className="max-w-xl">
                          <p className="text-[#1A3626] font-black uppercase tracking-[0.4em] text-[10px] mb-4">ARCHIVE_DIRECTORY</p>
                          <h2 className="text-4xl md:text-6xl font-serif font-bold tracking-tighter uppercase italic leading-none text-[#1A3626]">Browse Tour<br/>Collections</h2>
                      </div>
                      <div className="pb-2">
                        <p className="text-[#1A3626]/50 text-sm font-bold uppercase tracking-widest max-w-xs text-right">
                            Select a sector to initiate optimized route planning and availability checks.
                        </p>
                      </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                      {TOUR_STYLES.map((style) => (
                          <div key={style.id} className="group relative bg-white border border-[#1A3626]/10 p-8 rounded-sm hover:bg-[#1A3626] hover:border-[#1A3626] transition-all duration-500 cursor-pointer overflow-hidden shadow-sm hover:shadow-2xl">
                              <div className="relative z-10">
                                  <style.icon size={28} className="text-[#1A3626] group-hover:text-white mb-10 transition-colors" />
                                  <h3 className="text-xl font-serif font-bold text-[#1A3626] group-hover:text-white mb-2 transition-colors italic uppercase">{style.title}</h3>
                                  <p className="text-[9px] font-sans font-black text-[#1A3626]/50 group-hover:text-white/70 transition-colors uppercase leading-relaxed tracking-widest">{style.desc}</p>
                              </div>
                              <div className="absolute top-4 right-4 text-[#1A3626]/10 group-hover:text-white/10 transition-colors">
                                  <style.icon size={48} />
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          </section>
      </AnimatedSection>

      {/* Vatican Section */}
      <AnimatedSection id="vatican" delay={0.1}>
        <div className="py-20 bg-white shadow-inner">
            <ProductRow title="Vatican Series" subtitle="EDITORIAL_ENTRY: SISTINE CHAPEL & ST. PETERS." tours={vaticanTours} link="/category/vatican" dark={false} />
        </div>
      </AnimatedSection>

      <RomeGallery />

      <HighlightSection
        eyebrow="SYSTEM_PROTOCOL"
        title="Rome's Greatest Archives, Reopened"
        body="Skip-the-line access, small small groups, and expert historians who bring the stories of Rome to life. Curated for the discerning traveler."
        ctaText="Initiate Exploration"
        ctaHref="/category/vatican"
        imageUrl={`${R2}/pexels-akarsh-chandran-2156074716-34026966.jpg`}
        imageAlt="Inside the Vatican Museums"
      />

      {/* Colosseum Section */}
      <AnimatedSection id="colosseum" delay={0.2}>
        <div className="py-20 bg-[#1A3626] text-[#F5F0E8]">
            <ProductRow title="Imperial Logic" subtitle="ANCIENT_ARCHIVE: ARENA & THE UNDERGROUND." tours={colosseumTours} link="/category/colosseum" dark={true} />
        </div>
      </AnimatedSection>

      {/* Plan Your Trip Guide (Avero Inspired) */}
      <AnimatedSection delay={0.2}>
          <section className="py-24 bg-[#F5F0E8] overflow-hidden relative border-y border-[#1A3626]/10">
              <div className="container mx-auto px-6 relative z-10">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                      <div className="space-y-12">
                          <div>
                              <span className="inline-block px-4 py-1 border border-[#1A3626]/30 text-[10px] font-black uppercase tracking-[0.4em] mb-6 text-[#1A3626]">User_Instructions</span>
                              <h2 className="text-5xl md:text-7xl font-serif font-bold tracking-tighter uppercase leading-[0.9] italic text-[#1A3626]">Simple Booking<br/>Cycle 0.1</h2>
                          </div>

                          <div className="space-y-10">
                              {[
                                  { step: '01', title: 'Target Area', desc: 'Select your preferred historical archive from our verified site categories.' },
                                  { step: '02', title: 'Sync Calendar', desc: 'Identify an open transmission slot in our real-time availability network.' },
                                  { step: '03', title: 'Confirm ID', desc: 'Finalize your credentials to receive priority encrypted access to the site.' },
                              ].map((item) => (
                                  <div key={item.step} className="flex gap-8 group">
                                      <span className="text-4xl font-serif font-bold text-[#1A3626] opacity-20 group-hover:opacity-100 transition-opacity italic">{item.step}</span>
                                      <div>
                                          <h4 className="text-lg font-bold uppercase tracking-widest mb-1 text-[#1A3626]">{item.title}</h4>
                                          <p className="text-xs text-[#1A3626]/60 font-sans font-black uppercase max-w-sm tracking-wide">{item.desc}</p>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      </div>

                      <div className="relative aspect-[3/4] max-w-md mx-auto lg:ml-auto">
                          <div className="absolute inset-0 bg-white shadow-2xl rounded-sm border border-[#1A3626]/10 rotate-3"></div>
                          <img 
                              src="https://images.unsplash.com/photo-1529260830199-42c24126f198?auto=format&fit=crop&q=80" 
                              alt="Rome Planning" 
                              className="absolute inset-0 w-full h-full object-cover rounded-sm -rotate-3 hover:rotate-0 transition-transform duration-700 grayscale"
                          />
                          <div className="absolute -bottom-8 -left-8 bg-[#1A3626] text-[#F5F0E8] p-10 rounded-full shadow-2xl">
                              <Compass size={44} />
                          </div>
                      </div>
                  </div>
              </div>
          </section>
      </AnimatedSection>

      {/* Guide App Section */}
      <AnimatedSection delay={0.3}>
          <section className="py-24 bg-white border-b border-[#1A3626]/10">
              <div className="container mx-auto px-6">
                  <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-16">
                      <div className="w-full md:w-1/2">
                          <img 
                            src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80" 
                            alt="Wonders Guide App" 
                            className="rounded-[3rem] shadow-[0_40px_100px_rgba(26,54,38,0.2)] border-8 border-[#1A3626] w-full max-w-xs mx-auto transform -rotate-6 hover:rotate-0 transition-transform duration-700"
                          />
                      </div>
                      <div className="w-full md:w-1/2 space-y-8">
                          <div className="space-y-4">
                              <span className="inline-block px-3 py-1 bg-[#1A3626]/5 text-[#1A3626] text-[10px] font-black uppercase tracking-[0.4em] rounded-full">Coming Soon</span>
                              <h2 className="text-4xl md:text-5xl font-serif font-bold italic text-[#1A3626] leading-none">The Golden Guide<br/>Augmented Audio</h2>
                              <p className="text-[#1A3626]/60 font-sans text-sm font-bold uppercase tracking-wide leading-relaxed">
                                  Our upcoming mobile application integrates GPS-triggered historical data with AR reconstructions of Ancient Rome. 
                              </p>
                          </div>
                          
                          <div className="flex flex-wrap gap-4 pt-4">
                              <div className="flex items-center gap-3 px-6 py-3 bg-[#1A3626] text-white rounded-xl cursor-pointer hover:brightness-110 transition-all shadow-lg shadow-[#1A3626]/20">
                                  <Apple size={24} />
                                  <div className="flex flex-col">
                                      <span className="text-[10px] opacity-60 font-bold uppercase">Download on</span>
                                      <span className="text-sm font-bold">App Store</span>
                                  </div>
                              </div>
                              <div className="flex items-center gap-3 px-6 py-3 bg-white text-[#1A3626] border-2 border-[#1A3626] rounded-xl cursor-pointer hover:bg-[#1A3626]/5 transition-all">
                                  <Play size={20} fill="currentColor" />
                                  <div className="flex flex-col">
                                      <span className="text-[10px] opacity-60 font-bold uppercase">Get it on</span>
                                      <span className="text-sm font-bold">Google Play</span>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </section>
      </AnimatedSection>

      {/* Floating Reviews */}
      <div className="py-24 bg-[#F5F0E8]">
        <div className="container mx-auto px-6 md:px-16 text-center mb-12">
          <p className="font-sans text-[10px] tracking-[0.4em] uppercase font-black mb-3 text-[#1A3626]/40 italic underline decoration-[#C9A84C]/50 decoration-2 underline-offset-8">GUEST_RECORDS_ACTIVE</p>
          <h2 className="font-serif font-bold text-5xl text-[#1A3626] italic mt-6">Verified Logs</h2>
        </div>
        <FloatingReviews />
      </div>

      <StickyRomeSection />

      {/* Trust & FAQ */}
      <AnimatedSection delay={0.6}>
        <section className="py-24 bg-white border-y border-[#1A3626]/10">
          <div className="container mx-auto px-6 md:px-16 text-center mb-12">
            <p className="font-sans text-[10px] tracking-[0.35em] uppercase font-black mb-3 text-[#1A3626]/40 underline decoration-[#C9A84C]/50 decoration-2 underline-offset-8">PROTOCOL_AUTHENTICATED</p>
            <h2 className="font-serif font-bold text-[#1A3626] italic mt-6" style={{ fontSize: 'clamp(28px, 3.5vw, 42px)' }}>Secure Your Access</h2>
          </div>
          <TrustBadges />
        </section>
      </AnimatedSection>

      <div id="faq" className="bg-[#F5F0E8] py-12"><FAQ /></div>
      <Footer />
    </main>
  );
}
