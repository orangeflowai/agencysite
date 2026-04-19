import React from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TourCard from "@/components/TourCard";
import FAQ from "@/components/FAQ";
import HomeAnimations from "@/components/HomeAnimations";
import { getTours, getSettings } from "@/lib/dataAdapter";
import { getPexelsImages, ROME_QUERIES } from "@/lib/pexels";
import { tours as fallbackTours } from "@/lib/toursData";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Zap, MessageCircle, RefreshCw, Star, Quote, Ticket, BookOpen } from "lucide-react";
import SplitText from "@/components/SplitText";

export const revalidate = 3600;

export default async function Home() {
  const [toursData, settings, pexelsHero, pexelsVatican, pexelsColosseum] = await Promise.all([
    getTours(),
    getSettings(),
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

  const bestSellers = tours.slice(0, 3);
  const heroImage = pexelsHero[0]?.url || 'https://images.pexels.com/photos/1797161/pexels-photo-1797161.jpeg';

  return (
    <main className="min-h-screen bg-[#FAF9F6] text-[#5A5A5A] font-sans selection:bg-[#C9A227] selection:text-[#0A1628]">
      <Navbar />

      {/* 1. Hero Section */}
      <section className="relative w-full h-[100vh] min-h-[800px] flex items-center justify-center overflow-hidden bg-[#0A1628]">
        <div className="absolute inset-0 z-0">
           <img 
              src={heroImage} 
              alt="Golden Rome Hero" 
              className="w-full h-full object-cover animate-[kenburns_20s_ease-out_forwards]"
           />
           <div className="absolute inset-0 bg-gradient-to-b from-[#0A1628]/40 to-[#0A1628]/80" />
        </div>

        <div className="relative z-10 w-full max-w-[1000px] mx-auto px-6 text-center pt-20">
           <div className="flex items-center justify-center gap-4 mb-8 opacity-0 animate-[fadeUp_0.8s_0.2s_ease-out_forwards]">
              <div className="h-[1px] w-12 bg-[#C9A227]" />
              <span className="text-[#E8D5A3] uppercase tracking-[0.4em] text-[0.75rem] font-black">Official Vatican Partner</span>
              <div className="h-[1px] w-12 bg-[#C9A227]" />
           </div>
           
           <div className="mb-8 opacity-0 animate-[fadeUp_0.8s_0.4s_ease-out_forwards]">
              <SplitText className="text-white font-serif font-bold leading-[0.95] tracking-[-0.03em] justify-center" style={{ fontSize: 'clamp(3.5rem, 8vw, 6.5rem)' }}>
                 Rome's Greatest Archives, Reopened.
              </SplitText>
           </div>
           
           <p className="text-white/70 text-lg md:text-2xl font-medium max-w-3xl mx-auto mb-12 leading-relaxed opacity-0 animate-[fadeUp_0.8s_0.6s_ease-out_forwards]">
              Bypass the 3-hour queues with confirmed priority entry. Curated small group experiences led by accredited art historians.
           </p>
           
           <div className="flex flex-col sm:flex-row items-center justify-center gap-6 opacity-0 animate-[fadeUp_0.8s_0.8s_ease-out_forwards]">
              <Link href="/category/vatican" className="group relative w-full sm:w-auto px-10 py-5 bg-[#C9A227] text-[#0A1628] rounded-full font-black uppercase tracking-widest text-xs transition-all hover:scale-105 shadow-[0_0_40px_rgba(201,162,39,0.3)]">
                 Explore the Archive
              </Link>
              <Link href="/category/colosseum" className="w-full sm:w-auto px-10 py-5 bg-transparent border-2 border-white/20 text-white rounded-full font-black uppercase tracking-widest text-xs hover:bg-white/10 hover:border-white/40 transition-all">
                 Colosseum Access
              </Link>
           </div>
        </div>
      </section>

      {/* 2. SEO Section */}
      <section className="bg-white py-24 border-b border-[#E5E5E5]">
         <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
               <div className="space-y-8">
                  <div>
                    <SplitText className="text-[#0A1628] font-serif font-bold text-5xl mb-6 italic tracking-tight">The Eternal City Guide</SplitText>
                    <p className="text-xl leading-relaxed">Planning a trip to Rome can be overwhelming. From the <span className="text-[#C9A227] font-bold">Vatican Museums</span> to the <span className="text-[#C9A227] font-bold">Ancient Colosseum</span>, knowing where to start is key to an unforgettable experience.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-3">
                        <div className="flex items-center gap-3 text-[#0A1628]"><Ticket className="w-5 h-5 text-[#C9A227]" /><h4 className="font-bold uppercase tracking-widest text-xs">Vatican Museums</h4></div>
                        <p className="text-sm leading-relaxed">Home to the Sistine Chapel and 54 galleries of masterpieces. Always book skip-the-line tickets 2-3 weeks in advance.</p>
                     </div>
                     <div className="space-y-3">
                        <div className="flex items-center gap-3 text-[#0A1628]"><BookOpen className="w-5 h-5 text-[#C9A227]" /><h4 className="font-bold uppercase tracking-widest text-xs">Ancient History</h4></div>
                        <p className="text-sm leading-relaxed">The Roman Forum and Palatine Hill are as important as the Colosseum itself. Our guides connect the entire architectural story.</p>
                     </div>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4 pt-12">
                     <img src={pexelsVatican[0]?.url} className="rounded-2xl aspect-[4/5] object-cover shadow-lg hover:scale-[1.02] transition-transform duration-500" alt="Vatican" />
                     <img src={pexelsColosseum[1]?.url} className="rounded-2xl aspect-square object-cover shadow-lg hover:scale-[1.02] transition-transform duration-500" alt="Colosseum" />
                  </div>
                  <div className="space-y-4">
                     <img src={pexelsColosseum[0]?.url} className="rounded-2xl aspect-square object-cover shadow-lg hover:scale-[1.02] transition-transform duration-500" alt="Rome Architecture" />
                     <img src={pexelsVatican[2]?.url} className="rounded-2xl aspect-[4/5] object-cover shadow-lg hover:scale-[1.02] transition-transform duration-500" alt="Sistine Chapel detail" />
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 3. Essential Collection */}
      <section className="bg-[#FAF9F6] py-32">
         <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
               <div className="max-w-2xl">
                  <p className="text-[#C9A227] font-black uppercase tracking-[0.4em] text-[10px] mb-4">Curated Selection</p>
                  <SplitText className="text-[#0A1628] font-serif font-bold text-6xl leading-none tracking-tighter uppercase italic">Best Selling Archives</SplitText>
               </div>
               <Link href="/search" className="hidden md:flex items-center gap-3 font-black uppercase tracking-widest text-[10px] text-[#0A1628] hover:text-[#C9A227] transition-colors">
                  View Full Directory <ArrowRight size={16} />
               </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
               {bestSellers.map((tour: any) => <TourCard key={tour._id} tour={tour} />)}
            </div>
         </div>
      </section>

      {/* 4. Why Choose Golden Rome */}
      <section className="bg-[#0A1628] text-white py-32 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#C9A227]/10 blur-[150px] rounded-full -mr-64 -mt-64" />
         <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-4xl">
               <SplitText className="font-serif font-bold text-5xl md:text-7xl mb-12 leading-[1.1] tracking-tighter text-white">Why Golden Rome is the Historian's Choice.</SplitText>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                  {[
                     { title: 'Skip the Line Protocols', icon: Zap, desc: 'Official partner portals secure bypass entry.' },
                     { title: 'Licensed Historians', icon: ShieldCheck, desc: 'Vetted archaeologists and art history experts.' },
                     { title: 'Small Group Intimacy', icon: MessageCircle, desc: 'Maximum 15 guests for navigation ease.' },
                     { title: 'Encrypted Payments', icon: RefreshCw, desc: 'Secure booking via Stripe protocols.' },
                  ].map((item, i) => (
                     <div key={i} className="space-y-4">
                        <item.icon className="w-8 h-8 text-[#C9A227]" />
                        <h4 className="text-xl font-bold uppercase tracking-widest">{item.title}</h4>
                        <p className="text-white/60 leading-relaxed">{item.desc}</p>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </section>

      <div id="faq" className="bg-white"><FAQ /></div>

      <Footer />
      <HomeAnimations />
    </main>
  );
}
