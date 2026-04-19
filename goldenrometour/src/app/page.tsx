import React from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TourCard from "@/components/TourCard";
import FAQ from "@/components/FAQ";
import { getTours, getSettings } from "@/lib/dataAdapter";
import { tours as fallbackTours } from "@/lib/toursData";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShieldCheck, Zap, MessageCircle, RefreshCw, Star, Quote } from "lucide-react";

export const revalidate = 3600;

const R2 = 'https://pub-772bbb33a07f4026aa9652a0cfef4c2e.r2.dev/rome%20photos';

export default async function Home() {
  let tours = await getTours();
  const settings = await getSettings();

  if (!tours || tours.length === 0) {
    tours = fallbackTours.map((t: any) => ({
      ...t, _id: t.id, slug: { current: t.slug }, mainImage: t.imageUrl,
    })) as any;
  }

  const bestSellers = tours.slice(0, 3);

  return (
    <main className="min-h-screen bg-[#FAF9F6] text-[#5A5A5A] font-sans selection:bg-[#C9A227] selection:text-[#0A1628]">
      <Navbar />

      {/* 1. Hero Section */}
      <section className="relative w-full h-[100vh] min-h-[800px] flex items-center justify-center overflow-hidden bg-[#0A1628]">
        {/* Ken Burns Background */}
        <div className="absolute inset-0 z-0">
           <img 
              src={`${R2}/pexels-alex-250137-757239.jpg`} 
              alt="Colosseum Golden Hour" 
              className="w-full h-full object-cover animate-[kenburns_20s_ease-out_forwards]"
              style={{ animation: 'kenburns 20s ease-out forwards' }}
           />
           <div className="absolute inset-0 bg-gradient-to-b from-[#0A1628]/30 to-[#0A1628]/70" />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-[900px] mx-auto px-6 text-center pt-20">
           <div className="flex items-center justify-center gap-4 mb-6 opacity-0 animate-[fadeUp_0.8s_0.2s_ease-out_forwards]">
              <div className="h-px w-8 bg-[#E8D5A3]" />
              <span className="text-[#E8D5A3] uppercase tracking-[0.2em] text-[0.875rem] font-bold">Curated Since 2014</span>
              <div className="h-px w-8 bg-[#E8D5A3]" />
           </div>
           
           <h1 className="text-white font-serif font-bold leading-[1.1] tracking-[-0.02em] mb-6 opacity-0 animate-[fadeUp_0.8s_0.4s_ease-out_forwards]" style={{ fontSize: 'clamp(3rem, 6vw, 5.5rem)' }}>
              Rome's Greatest Archives,<br/><span className="italic text-[#E8D5A3]">Reopened.</span>
           </h1>
           
           <p className="text-white/80 text-lg md:text-xl font-medium max-w-2xl mx-auto mb-10 opacity-0 animate-[fadeUp_0.8s_0.6s_ease-out_forwards]">
              Skip-the-line access to the Vatican, Colosseum, and Ancient City. Small groups. Expert historians. Zero chaos.
           </p>
           
           <div className="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 animate-[fadeUp_0.8s_0.8s_ease-out_forwards]">
              <Link href="/category/vatican" className="w-full sm:w-auto px-8 py-4 bg-[#C9A227] text-[#0A1628] rounded-full font-bold uppercase tracking-widest text-sm hover:bg-[#E8D5A3] transition-all hover:-translate-y-1">
                 Explore Vatican Tours
              </Link>
              <Link href="/category/colosseum" className="w-full sm:w-auto px-8 py-4 bg-transparent border border-white/30 text-white rounded-full font-bold uppercase tracking-widest text-sm hover:bg-white hover:text-[#0A1628] transition-all hover:-translate-y-1">
                 Colosseum Experiences
              </Link>
           </div>
        </div>

        {/* Search Bar (Overlapping) */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-1/2 px-6 z-20 opacity-0 animate-[slideUp_0.9s_1s_ease-out_forwards]">
           <div className="max-w-4xl mx-auto bg-white rounded-2xl p-6 shadow-2xl flex flex-col md:flex-row items-center gap-4 border border-[#E5E5E5]">
              <select className="flex-1 w-full bg-[#FAF9F6] border border-[#E5E5E5] rounded-xl px-4 py-3 text-[#1A1A1A] font-bold outline-none focus:border-[#C9A227] transition-colors appearance-none">
                 <option value="" disabled selected>Destination Sector</option>
                 <option>Vatican Collection</option>
                 <option>Ancient Rome</option>
                 <option>City Archives</option>
              </select>
              <input type="date" className="flex-1 w-full bg-[#FAF9F6] border border-[#E5E5E5] rounded-xl px-4 py-3 text-[#1A1A1A] font-bold outline-none focus:border-[#C9A227] transition-colors" />
              <select className="flex-1 w-full bg-[#FAF9F6] border border-[#E5E5E5] rounded-xl px-4 py-3 text-[#1A1A1A] font-bold outline-none focus:border-[#C9A227] transition-colors appearance-none">
                 <option value="2">2 Guests</option>
                 <option value="3">3 Guests</option>
                 <option value="4">4 Guests</option>
              </select>
              <button className="w-full md:w-auto px-8 py-3 bg-[#0A1628] text-[#C9A227] rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-[#1A1A1A] transition-colors shrink-0">
                 Find Tours
              </button>
           </div>
        </div>
      </section>

      {/* 2. Social Proof #1 (Trust Bar) */}
      <section className="bg-[#FAF9F6] pt-32 pb-12">
         <div className="container mx-auto px-6 text-center">
            <h3 className="text-[#8A8A8A] font-bold uppercase tracking-widest text-xs mb-8">Trusted by 50,000+ Travelers Worldwide</h3>
            <div className="flex flex-wrap justify-center items-center gap-12 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
               <div className="flex items-center gap-2"><Star className="w-5 h-5 fill-[#C9A227] text-[#C9A227]"/><span className="font-serif font-bold text-xl text-[#1A1A1A]">TripAdvisor</span></div>
               <div className="flex items-center gap-2"><Star className="w-5 h-5 fill-[#C9A227] text-[#C9A227]"/><span className="font-serif font-bold text-xl text-[#1A1A1A]">Google</span></div>
               <span className="font-serif font-bold text-xl text-[#1A1A1A] italic">Viator Elite</span>
               <span className="font-serif font-bold text-xl text-[#1A1A1A] italic">GetYourGuide</span>
               <div className="flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-[#2D6A4F]"/><span className="font-bold text-sm uppercase tracking-widest text-[#2D6A4F]">Licensed Operator</span></div>
            </div>
         </div>
      </section>

      {/* 3. Best Sellers */}
      <section className="bg-[#FAF9F6] py-24">
         <div className="max-w-[1280px] mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
               <div>
                  <p className="text-[#C9A227] font-bold uppercase tracking-[0.2em] text-xs mb-3">Most Requested</p>
                  <h2 className="text-[#1A1A1A] font-serif font-bold leading-tight" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>The Essential Collection</h2>
                  <p className="text-[#5A5A5A] mt-4 max-w-xl">Our highest-rated experiences, curated for first-time visitors and Roman veterans alike.</p>
               </div>
               <Link href="/search" className="group flex items-center gap-2 text-[#0A1628] font-bold uppercase tracking-widest text-xs hover:text-[#C9A227] transition-colors">
                  View All Tours <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
               </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {bestSellers.map((tour: any) => (
                  <TourCard key={tour._id} tour={tour} />
               ))}
            </div>
         </div>
      </section>

      {/* 4. Categories (Tour Types) */}
      <section className="bg-[#0A1628] text-white py-24">
         <div className="container mx-auto px-6">
            <div className="text-center mb-16">
               <p className="text-[#C9A227] font-bold uppercase tracking-[0.2em] text-xs mb-3">Browse by Archive</p>
               <h2 className="font-serif font-bold mb-4" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>Select Your Sector</h2>
               <p className="text-white/70 max-w-xl mx-auto">Each collection is optimized for a specific kind of explorer.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[300px]">
               {/* Vatican - Span 2 rows */}
               <Link href="/category/vatican" className="group relative overflow-hidden rounded-2xl lg:col-span-1 lg:row-span-2 shadow-xl">
                  <img src={`${R2}/pexels-nastiz-12604242.jpg`} alt="Vatican" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628] via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                  <div className="absolute bottom-0 left-0 p-8 transform transition-transform group-hover:-translate-y-2">
                     <h3 className="font-serif font-bold text-2xl mb-1">Vatican Series</h3>
                     <p className="text-[#E8D5A3] font-bold uppercase tracking-widest text-[10px] mb-4">8 Experiences</p>
                     <div className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center group-hover:bg-[#C9A227] group-hover:border-[#C9A227] transition-colors"><ArrowRight size={16} className="group-hover:-rotate-45 transition-transform" /></div>
                  </div>
               </Link>

               {/* Colosseum */}
               <Link href="/category/colosseum" className="group relative overflow-hidden rounded-2xl lg:col-span-2 shadow-xl">
                  <img src={`${R2}/pexels-alex-250137-757239.jpg`} alt="Colosseum" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628] via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                  <div className="absolute bottom-0 left-0 p-8 transform transition-transform group-hover:-translate-y-2">
                     <h3 className="font-serif font-bold text-2xl mb-1">Ancient Rome</h3>
                     <p className="text-[#E8D5A3] font-bold uppercase tracking-widest text-[10px] mb-4">12 Experiences</p>
                     <div className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center group-hover:bg-[#C9A227] group-hover:border-[#C9A227] transition-colors"><ArrowRight size={16} className="group-hover:-rotate-45 transition-transform" /></div>
                  </div>
               </Link>

               {/* Private */}
               <Link href="/private-tours" className="group relative overflow-hidden rounded-2xl lg:col-span-1 shadow-xl">
                  <img src={`${R2}/pexels-filiamariss-30785778.jpg`} alt="Private Tours" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628] via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                  <div className="absolute bottom-0 left-0 p-8 transform transition-transform group-hover:-translate-y-2">
                     <h3 className="font-serif font-bold text-2xl mb-1">Private Custom</h3>
                     <p className="text-[#E8D5A3] font-bold uppercase tracking-widest text-[10px] mb-4">Bespoke</p>
                     <div className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center group-hover:bg-[#C9A227] group-hover:border-[#C9A227] transition-colors"><ArrowRight size={16} className="group-hover:-rotate-45 transition-transform" /></div>
                  </div>
               </Link>

               {/* Food */}
               <Link href="/category/city" className="group relative overflow-hidden rounded-2xl lg:col-span-3 shadow-xl">
                  <img src={`${R2}/pexels-matteobasilephoto-11200578.jpg`} alt="Food Tours" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628] via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                  <div className="absolute bottom-0 left-0 p-8 transform transition-transform group-hover:-translate-y-2">
                     <h3 className="font-serif font-bold text-2xl mb-1">City & Culinary</h3>
                     <p className="text-[#E8D5A3] font-bold uppercase tracking-widest text-[10px] mb-4">5 Experiences</p>
                     <div className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center group-hover:bg-[#C9A227] group-hover:border-[#C9A227] transition-colors"><ArrowRight size={16} className="group-hover:-rotate-45 transition-transform" /></div>
                  </div>
               </Link>
            </div>
         </div>
      </section>

      {/* 5. Brand Benefits (Why Choose Us) - Sticky Layout */}
      <section className="bg-[#FAF9F6] py-24 relative">
         <div className="container mx-auto px-6">
            <div className="flex flex-col lg:flex-row gap-16">
               
               {/* Sticky Left Image */}
               <div className="lg:w-2/5 hidden lg:block">
                  <div className="sticky top-[100px] aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
                     <img src={`${R2}/pexels-akarsh-chandran-2156074716-34026966.jpg`} alt="Guide explaining" className="w-full h-full object-cover" />
                  </div>
               </div>

               {/* Scrolling Right Content */}
               <div className="lg:w-3/5 lg:py-16">
                  <p className="text-[#C9A227] font-bold uppercase tracking-[0.2em] text-xs mb-4">The Golden Standard</p>
                  <h2 className="text-[#1A1A1A] font-serif font-bold mb-16 leading-tight" style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)' }}>
                     Rome Is Chaotic.<br/>Your Journey Should Be Curated.
                  </h2>

                  <div className="space-y-12">
                     {[
                        { icon: ShieldCheck, title: 'Licensed & Accredited Guides', desc: 'Every guide is ATAC-certified and vetted by the Italian Ministry of Culture. No students. No scripts. Just historians with 10+ years in the field.' },
                        { icon: Zap, title: 'True Skip-the-Line Priority', desc: 'We don\'t just sell tickets—we secure timed entry slots that bypass the general admission queue entirely. You enter with our guide through the group door.' },
                        { icon: MessageCircle, title: '24-Hour Concierge Support', desc: 'WhatsApp, email, or phone. Our multilingual team is awake when you are, from booking to boarding your flight home.' },
                        { icon: RefreshCw, title: 'Worry-Free Cancellation', desc: 'Full refund up to 24 hours before your tour. If a site closes unexpectedly, we reschedule or refund automatically.' },
                     ].map((item, i) => (
                        <div key={i} className="group border-b border-[#E5E5E5] pb-12 hover:border-[#C9A227] transition-colors">
                           <div className="flex items-start gap-6">
                              <div className="w-14 h-14 rounded-full bg-white border border-[#E5E5E5] flex items-center justify-center shrink-0 group-hover:bg-[#C9A227] group-hover:border-[#C9A227] transition-colors shadow-sm">
                                 <item.icon size={24} className="text-[#0A1628] group-hover:text-white transition-colors" />
                              </div>
                              <div>
                                 <h3 className="text-xl font-serif font-bold text-[#1A1A1A] mb-3">{item.title}</h3>
                                 <p className="text-[#5A5A5A] leading-relaxed">{item.desc}</p>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

            </div>
         </div>
      </section>

      {/* 6. Social Proof #2 (Testimonials) */}
      <section className="bg-white py-24 border-y border-[#E5E5E5]">
         <div className="container mx-auto px-6">
            <div className="text-center mb-16">
               <h2 className="text-[#1A1A1A] font-serif font-bold mb-3" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>Verified Logs</h2>
               <p className="text-[#5A5A5A]">Real entries from our guest archive.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {[
                  { text: "Francesca was phenomenal. She navigated us through the Vatican crowds like a true insider. Worth every cent.", author: "Janice M.", meta: "Vatican Small Group Tour · October 2025" },
                  { text: "The Colosseum underground is a must-see. Our guide brought the gladiatorial games to life in a way a guidebook never could.", author: "Robert T.", meta: "Ancient Rome VIP · September 2025" },
                  { text: "Flawless organization. From the WhatsApp confirmation to the final gelato recommendation, Golden Rome Tours delivered perfection.", author: "Elena V.", meta: "Private City Tour · August 2025" },
               ].map((review, i) => (
                  <div key={i} className="bg-[#FAF9F6] p-8 rounded-2xl border border-[#E5E5E5] relative shadow-sm hover:-translate-y-2 transition-transform duration-300">
                     <Quote className="absolute top-6 right-6 w-12 h-12 text-[#C9A227] opacity-20" />
                     <div className="flex gap-1 mb-6">
                        {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 fill-[#C9A227] text-[#C9A227]" />)}
                     </div>
                     <p className="font-serif italic text-lg text-[#1A1A1A] leading-relaxed mb-8">"{review.text}"</p>
                     <div className="flex items-center gap-4 mt-auto">
                        <div className="w-12 h-12 rounded-full bg-[#0A1628] flex items-center justify-center text-[#E8D5A3] font-serif font-bold text-lg">{review.author.charAt(0)}</div>
                        <div>
                           <p className="font-bold text-[#1A1A1A] text-sm">{review.author}</p>
                           <p className="text-[10px] uppercase tracking-widest text-[#8A8A8A]">{review.meta}</p>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* 7. About the Brand */}
      <section className="bg-[#FAF9F6] py-32 border-b border-[#E5E5E5]">
         <div className="max-w-[800px] mx-auto px-6 text-center">
            <p className="text-[#C9A227] font-bold uppercase tracking-[0.2em] text-xs mb-6">The Archive</p>
            <h2 className="text-[#1A1A1A] font-serif font-bold mb-10 leading-tight" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>A Rare Path Through Rome</h2>
            <div className="space-y-6 text-[#5A5A5A] text-lg md:text-xl leading-relaxed font-medium">
               <p>
                  Golden Rome Tours began with a simple belief: that the Eternal City deserves more than rushed, cattle-car sightseeing. We built this agency for travelers who read the plaque, who look up at the coffered ceiling, who want to know why Bernini chose bronze over marble.
               </p>
               <p>
                  Every route we design is pressure-tested for pacing, shade, and the exact angle of the afternoon light. We don't do standard. We do permanent.
               </p>
            </div>
            <div className="mt-12 flex flex-col items-center justify-center gap-4">
               <div className="w-16 h-16 rounded-full bg-[#E5E5E5] overflow-hidden border-2 border-white shadow-md">
                  <img src="https://i.pravatar.cc/150?img=11" alt="Founder" className="w-full h-full object-cover grayscale" />
               </div>
               <div>
                  <p className="font-serif font-bold text-[#1A1A1A] text-lg">Marco Valerio</p>
                  <p className="text-xs uppercase tracking-widest text-[#8A8A8A]">Founder & Chief Archivist</p>
               </div>
            </div>
         </div>
      </section>

      {/* FAQ Import - Can be the FAQ component if desired, or link to /faq */}
      <div id="faq" className="bg-white"><FAQ /></div>

      {/* Final CTA */}
      <section className="bg-[#0A1628] py-32 relative overflow-hidden text-center">
         {/* Animated Dots */}
         <div className="absolute inset-0 opacity-[0.05] animate-[drift_60s_linear_infinite]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 2px, transparent 0)', backgroundSize: '40px 40px' }} />
         
         <div className="relative z-10 max-w-3xl mx-auto px-6">
            <h2 className="text-white font-serif font-bold leading-none mb-6 relative inline-block" style={{ fontSize: 'clamp(3rem, 6vw, 5rem)' }}>
               Secure Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C9A227] via-[#E8D5A3] to-[#C9A227] animate-[shimmer_3s_infinite]">Access.</span>
            </h2>
            <p className="text-white/70 text-lg md:text-xl font-medium mb-12">
               Timed entry slots disappear days in advance. Lock in your preferred date now.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
               <Link href="/search" className="w-full sm:w-auto px-10 py-5 bg-[#C9A227] text-[#0A1628] rounded-full font-bold uppercase tracking-widest text-sm hover:scale-105 transition-transform shadow-[0_0_40px_rgba(201,162,39,0.3)]">
                  Browse Vatican Tours
               </Link>
               <Link href="/private-tours" className="w-full sm:w-auto px-10 py-5 bg-transparent border border-white/30 text-white rounded-full font-bold uppercase tracking-widest text-sm hover:bg-white hover:text-[#0A1628] hover:scale-105 transition-all">
                  Plan a Private Day
               </Link>
            </div>
         </div>
      </section>

      <Footer />

      <style jsx global>{`
         @keyframes kenburns {
            0% { transform: scale(1); }
            100% { transform: scale(1.05); }
         }
         @keyframes fadeUp {
            0% { opacity: 0; transform: translateY(30px); }
            100% { opacity: 1; transform: translateY(0); }
         }
         @keyframes slideUp {
            0% { opacity: 0; transform: translateY(60px); }
            100% { opacity: 1; transform: translateY(50%); }
         }
         @keyframes drift {
            0% { background-position: 0 0; }
            100% { background-position: 1000px 1000px; }
         }
         @keyframes shimmer {
            0% { background-position: -200% center; }
            100% { background-position: 200% center; }
         }
      `}</style>
    </main>
  );
}
