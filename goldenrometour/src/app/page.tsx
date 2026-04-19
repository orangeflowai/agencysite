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
import { ArrowRight, ShieldCheck, Zap, MessageCircle, RefreshCw, Star, Quote, MapPin, Ticket, BookOpen, Camera } from "lucide-react";

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

      {/* 1. Hero Section - PEXELS POWERED */}
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
           
           <h1 className="text-white font-serif font-bold leading-[0.95] tracking-[-0.03em] mb-8 opacity-0 animate-[fadeUp_0.8s_0.4s_ease-out_forwards]" style={{ fontSize: 'clamp(3.5rem, 8vw, 6.5rem)' }}>
              Rome's Greatest <br/><span className="italic text-[#E8D5A3] font-medium">Archives, Reopened.</span>
           </h1>
           
           <p className="text-white/70 text-lg md:text-2xl font-medium max-w-3xl mx-auto mb-12 leading-relaxed opacity-0 animate-[fadeUp_0.8s_0.6s_ease-out_forwards]">
              Bypass the 3-hour queues with confirmed priority entry. Curated small group experiences led by accredited art historians.
           </p>
           
           <div className="flex flex-col sm:flex-row items-center justify-center gap-6 opacity-0 animate-[fadeUp_0.8s_0.8s_ease-out_forwards]">
              <Link href="/category/vatican" className="group relative w-full sm:w-auto px-10 py-5 bg-[#C9A227] text-[#0A1628] rounded-full font-black uppercase tracking-widest text-xs transition-all hover:scale-105 shadow-[0_0_40px_rgba(201,162,39,0.3)] overflow-hidden">
                 <span className="relative z-10">Explore the Archive</span>
              </Link>
              <Link href="/category/colosseum" className="w-full sm:w-auto px-10 py-5 bg-transparent border-2 border-white/20 text-white rounded-full font-black uppercase tracking-widest text-xs hover:bg-white/10 hover:border-white/40 transition-all">
                 Colosseum Access
              </Link>
           </div>
        </div>
      </section>

      {/* 2. SEO Rich Section: Top Attractions Guide */}
      <section className="bg-white py-24 border-b border-[#E5E5E5]">
         <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
               <div className="space-y-8">
                  <div>
                    <h2 className="text-[#0A1628] font-serif font-bold text-5xl mb-6 italic tracking-tight">The Eternal City Guide</h2>
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

                  <Link href="/blog" className="inline-flex items-center gap-3 text-[#0A1628] font-black uppercase tracking-[0.2em] text-[10px] group">
                    <span>Read Full Travel Guide</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4 pt-12">
                     <img src={pexelsVatican[0]?.url} className="rounded-2xl aspect-[4/5] object-cover shadow-lg" alt="Vatican" />
                     <img src={pexelsColosseum[1]?.url} className="rounded-2xl aspect-square object-cover shadow-lg" alt="Colosseum" />
                  </div>
                  <div className="space-y-4">
                     <img src={pexelsColosseum[0]?.url} className="rounded-2xl aspect-square object-cover shadow-lg" alt="Rome Architecture" />
                     <img src={pexelsVatican[2]?.url} className="rounded-2xl aspect-[4/5] object-cover shadow-lg" alt="Sistine Chapel detail" />
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 3. Essential Collection (Tours) */}
      <section className="bg-[#FAF9F6] py-32">
         <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
               <div className="max-w-2xl">
                  <p className="text-[#C9A227] font-black uppercase tracking-[0.4em] text-[10px] mb-4">Curated Selection</p>
                  <h2 className="text-[#0A1628] font-serif font-bold text-6xl leading-none tracking-tighter uppercase italic">Best Selling<br/>Archives</h2>
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

      {/* 4. SEO Section: Why Choose Golden Rome */}
      <section className="bg-[#0A1628] text-white py-32 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#C9A227]/10 blur-[150px] rounded-full -mr-64 -mt-64" />
         <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-4xl">
               <h2 className="font-serif font-bold text-5xl md:text-7xl mb-12 leading-[1.1] tracking-tighter">Why Golden Rome is the<br/><span className="text-[#E8D5A3] italic">Historian's Choice.</span></h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                  {[
                     { title: 'Skip the Line Protocols', icon: Zap, desc: 'We utilize official partner portals to secure entry times that bypass the 2-3 hour general admission queues at the Vatican and Colosseum.' },
                     { title: 'Licensed Historians', icon: ShieldCheck, desc: 'Every guide is an accredited art historian or archaeologist vetted by the Italian Ministry of Culture. No scripts, only depth.' },
                     { title: 'Small Group Intimacy', icon: MessageCircle, desc: 'Our groups never exceed 15 participants, ensuring you can hear every detail and navigate crowded corridors with ease.' },
                     { title: 'Encrypted Payments', icon: RefreshCw, desc: 'Secure booking through Stripe ensures your transaction is private and protected. Instant digital vouchers delivered to your inbox.' },
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

      {/* 5. Sticky Editorial Section (Brand Story) */}
      <section className="py-32 bg-white relative">
         <div className="container mx-auto px-6">
            <div className="flex flex-col lg:flex-row gap-20">
               <div className="lg:w-1/2">
                  <div className="sticky top-32 space-y-8">
                     <p className="text-[#C9A227] font-black uppercase tracking-[0.4em] text-[10px]">Our Philosophy</p>
                     <h2 className="text-[#0A1628] font-serif font-bold text-6xl leading-[0.9] uppercase tracking-tighter italic">We don't do standard.<br/>We do permanent.</h2>
                     <p className="text-xl text-[#5A5A5A] leading-relaxed max-w-lg">Founded in 2014, Golden Rome Tours was built for travelers who want to know <span className="italic font-serif text-[#0A1628]">why</span>. Why Bernini chose bronze, why the arena floor collapsed, and why Rome remains the center of the world.</p>
                     <div className="pt-8">
                        <img src="https://i.pravatar.cc/150?img=11" className="w-16 h-16 rounded-full border-2 border-[#C9A227] grayscale mb-4" alt="Founder" />
                        <p className="text-[#0A1628] font-serif font-bold text-lg italic leading-none">Marco Valerio</p>
                        <p className="text-[10px] uppercase tracking-[0.2em] font-black text-[#C9A227] mt-1">Founder & Lead Historian</p>
                     </div>
                  </div>
               </div>
               <div className="lg:w-1/2 space-y-6">
                  <img src={pexelsHero[0]?.url} className="rounded-2xl w-full aspect-[4/5] object-cover shadow-2xl" alt="Rome Museum" />
                  <img src={pexelsVatican[3]?.url} className="rounded-2xl w-full aspect-[16/9] object-cover shadow-2xl" alt="Vatican Archives" />
                  <img src={pexelsColosseum[3]?.url} className="rounded-2xl w-full aspect-square object-cover shadow-2xl" alt="Ancient Rome" />
               </div>
            </div>
         </div>
      </section>

      {/* 6. Testimonials - Verified Logs */}
      <section className="bg-[#FAF9F6] py-32 border-y border-[#E5E5E5]">
         <div className="container mx-auto px-6">
            <div className="text-center mb-20">
               <h2 className="text-[#0A1628] font-serif font-bold text-5xl uppercase italic tracking-tighter mb-4">Verified Logs</h2>
               <p className="text-[#8A8A8A] font-bold uppercase tracking-[0.3em] text-xs underline decoration-[#C9A227] decoration-2 underline-offset-8">Real entries from our guest archive</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {[
                  { text: "The early entry Vatican tour is life-changing. Standing in the Sistine Chapel without the crush of thousands is worth every euro.", author: "Janice M.", date: "Oct 2025" },
                  { text: "Golden Rome's guides are truly scientists of history. Our Colosseum tour felt like a lecture at Oxford, but much more exciting.", author: "Robert T.", date: "Sept 2025" },
                  { text: "Flawless skip-the-line execution. We walked right past a line that stretched for blocks. Best decision of our trip.", author: "Elena V.", date: "Aug 2025" },
               ].map((item, i) => (
                  <div key={i} className="bg-white p-10 rounded-2xl border border-[#E5E5E5] shadow-sm relative group hover:border-[#C9A227] transition-colors">
                     <Quote className="absolute top-8 right-8 text-[#C9A227]/10 w-16 h-16 group-hover:text-[#C9A227]/20 transition-colors" />
                     <div className="flex gap-1 mb-6"><Star size={16} fill="#C9A227" className="text-[#C9A227]" /><Star size={16} fill="#C9A227" className="text-[#C9A227]" /><Star size={16} fill="#C9A227" className="text-[#C9A227]" /><Star size={16} fill="#C9A227" className="text-[#C9A227]" /><Star size={16} fill="#C9A227" className="text-[#C9A227]" /></div>
                     <p className="font-serif italic text-xl text-[#0A1628] mb-10 leading-relaxed">"{item.text}"</p>
                     <div className="flex justify-between items-center border-t border-[#E5E5E5] pt-6">
                        <span className="font-bold text-sm">{item.author}</span>
                        <span className="text-[10px] font-black uppercase text-[#8A8A8A]">{item.date}</span>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      <div id="faq" className="bg-white"><FAQ /></div>

      {/* 7. Final CTA - The Golden Sequence */}
      <section className="bg-[#0A1628] py-40 relative overflow-hidden">
         <div className="absolute inset-0 opacity-[0.03] animate-[drift_60s_linear_infinite]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 2px, transparent 0)', backgroundSize: '50px 50px' }} />
         <div className="container mx-auto px-6 text-center relative z-10">
            <h2 className="text-white font-serif font-bold leading-none mb-8 tracking-tighter" style={{ fontSize: 'clamp(3.5rem, 10vw, 7rem)' }}>
               Secure Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C9A227] via-[#E8D5A3] to-[#C9A227] animate-[shimmer_3s_infinite] italic">Access.</span>
            </h2>
            <p className="text-white/60 text-xl md:text-2xl max-w-2xl mx-auto mb-16 leading-relaxed">Timed entry slots for peak dates are limited. Lock in your historian-led exploration today.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
               <Link href="/search" className="w-full sm:w-auto px-12 py-6 bg-[#C9A227] text-[#0A1628] rounded-full font-black uppercase tracking-[0.2em] text-xs hover:scale-105 transition-all shadow-[0_0_50px_rgba(201,162,39,0.4)]">
                  Browse Vatican Tours
               </Link>
               <Link href="/private-tours" className="w-full sm:w-auto px-12 py-6 border-2 border-white/20 text-white rounded-full font-black uppercase tracking-[0.2em] text-xs hover:bg-white hover:text-[#0A1628] transition-all">
                  Private Day Inquiry
               </Link>
            </div>
         </div>
      </section>

      <Footer />
      <HomeAnimations />
    </main>
  );
}
