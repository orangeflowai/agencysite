import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import FloatingReviews from "@/components/FloatingReviews";
import FAQ from "@/components/FAQ";
import TourCard from "@/components/TourCard";
import TrustBadges from "@/components/TrustBadges";
import Link from "next/link";
import { getTours, getSettings, getPosts } from "@/lib/dataAdapter";
import { tours as fallbackTours } from "@/lib/toursData";
import { ArrowRight, Shield, Clock, Star, Users, Zap, CheckCircle, ExternalLink, BookOpen, MapPin, Camera, UserCheck } from "lucide-react";
import Image from "next/image";

export const revalidate = 3600;

const R2 = 'https://pub-772bbb33a07f4026aa9652a0cfef4c2e.r2.dev/rome%20photos';

const HOW_TO_STEPS = [
  { num: "01", title: "Choose Your Experience",  desc: "Browse our curated Vatican & Rome tours. Filter by duration, group size, or attraction." },
  { num: "02", title: "Pick a Date & Time",       desc: "Select from real-time availability. Instant confirmation — no waiting for approval." },
  { num: "03", title: "Secure Your Spot",         desc: "Pay securely via Stripe. Your booking is confirmed immediately with a PDF ticket." },
  { num: "04", title: "Meet Your Guide",          desc: "Arrive at the meeting point. Your expert guide will be waiting with skip-the-line access." },
];

const GOOGLE_REVIEWS = [
  { author: "Michael T.", date: "2 weeks ago", rating: 5, text: "Incredible experience bypassing the massive lines outside the Vatican. Our guide was extremely knowledgeable about the Sistine Chapel frescoes. Worth every penny." },
  { author: "Sarah Jenkins", date: "1 month ago", rating: 5, text: "Booking was seamless and the instant confirmation gave us peace of mind. The tour was perfectly paced, and we actually had room to breathe in the galleries." },
  { author: "David R.", date: "3 months ago", rating: 5, text: "Highly recommend Roman Vatican Tour. They organized our entire family's visit flawlessly. The communication via WhatsApp before the tour was a lifesaver." }
];

export default async function Home() {
  let tours = await getTours();
  let posts = await getPosts() || [];
  const settings = await getSettings();

  if (!tours || tours.length === 0) {
    tours = fallbackTours.map((t: any) => ({
      ...t, _id: t.id, slug: { current: t.slug }, mainImage: t.imageUrl,
    })) as any;
  }

  const vaticanTours = tours.filter((t: any) => t.category === "vatican").slice(0, 4);

  return (
    <main className="min-h-screen bg-background overflow-x-hidden selection:bg-primary selection:text-white">
      <Navbar />
      <Hero settings={settings} />

      {/* Vatican Collection */}
      {vaticanTours.length > 0 && (
        <AnimatedSection delay={0.1}>
          <section id="vatican" className="py-24 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-4">
                <div>
                  <p className="text-[10px] font-sans font-black uppercase tracking-[0.4em] text-primary mb-2">Exclusive Access</p>
                  <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#5c4b3e] leading-tight uppercase italic">The Vatican Collection</h2>
                  <p className="mt-4 text-base text-[#85766a] max-w-xl font-sans font-medium">Secure your skip-the-line access to the Sistine Chapel, Museums, and St. Peter's Basilica before they sell out.</p>
                </div>
                <Link href="/category/vatican" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white text-[10px] font-sans font-black uppercase tracking-widest rounded-full hover:bg-primary/90 transition-all shadow-md shrink-0">
                  View All Vatican Tours <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {vaticanTours.map((tour: any) => <TourCard key={tour._id} tour={tour} />)}
              </div>
            </div>
          </section>
        </AnimatedSection>
      )}

      {/* NEW: THE HISTORIAN'S PERSPECTIVE (Brand Authority Section) */}
      <AnimatedSection delay={0.2}>
         <section className="py-24 bg-[#413c33] text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-1/3 h-full bg-[#1A1210]/20 skew-x-12 translate-x-20"></div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                  <div className="space-y-8">
                     <div>
                        <p className="text-[#e4d7b0] font-black uppercase tracking-[0.4em] text-[10px] mb-4">Our Methodology</p>
                        <h2 className="text-5xl md:text-7xl font-serif font-black tracking-tighter leading-[0.9] uppercase italic">Historian-Led<br/>Archives.</h2>
                     </div>
                     <p className="text-lg md:text-xl text-stone-300 font-serif italic leading-relaxed">
                        "We believe Rome shouldn't just be seen—it should be decoded. Our guides are accredited art historians who reveal the hidden political and artistic messages within the Vatican's walls."
                     </p>
                     <div className="flex items-center gap-4">
                        <img src="https://i.pravatar.cc/150?img=11" className="w-16 h-16 rounded-full border-2 border-primary grayscale shadow-xl" alt="Lead Historian" />
                        <div>
                           <p className="font-serif font-bold text-xl italic leading-none">Marco Valerio</p>
                           <p className="text-[10px] uppercase tracking-[0.2em] font-black text-primary mt-1">Chief Archivist & Art Historian</p>
                        </div>
                     </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-4 pt-12">
                        <img src={`${R2}/pexels-nastiz-12604242.jpg`} className="rounded-2xl aspect-[3/4] object-cover shadow-2xl" alt="Museum detail" />
                        <div className="bg-primary/20 backdrop-blur-md p-6 rounded-2xl border border-white/10">
                           <BookOpen className="text-primary w-8 h-8 mb-4" />
                           <p className="text-xs font-black uppercase tracking-widest text-primary mb-1">Deep Research</p>
                           <p className="text-[10px] text-stone-400 font-sans uppercase">Every route is pressure-tested for flow and light.</p>
                        </div>
                     </div>
                     <div className="space-y-4">
                        <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10">
                           <UserCheck className="text-primary w-8 h-8 mb-4" />
                           <p className="text-xs font-black uppercase tracking-widest text-primary mb-1">Accredited</p>
                           <p className="text-[10px] text-stone-400 font-sans uppercase">Vetted by the Italian Ministry of Culture.</p>
                        </div>
                        <img src={`${R2}/pexels-alex-250137-757239.jpg`} className="rounded-2xl aspect-[3/4] object-cover shadow-2xl" alt="Ancient Rome" />
                     </div>
                  </div>
               </div>
            </div>
         </section>
      </AnimatedSection>

      {/* NEW: VISUAL PROTOCOL GUIDE (SEO & Utility) */}
      <AnimatedSection delay={0.1}>
         <section className="py-24 bg-[#e7dbbf]/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className="text-center mb-16">
                  <p className="text-[10px] font-sans font-black uppercase tracking-[0.4em] text-primary mb-3">Preparation Protocol</p>
                  <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#5c4b3e] leading-tight italic uppercase">Vatican Entry Requirements</h2>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                     { icon: UserCheck, title: "Dress Code", desc: "Shoulders and knees must be covered. A light scarf in your bag is recommended for the Basilica." },
                     { icon: Camera, title: "Photography", desc: "No flash inside the Museums. Strictly no photos or video in the Sistine Chapel." },
                     { icon: Shield, title: "Security", desc: "Airport-style security at all entrances. No large backpacks, knives, or glass bottles." },
                  ].map((item, i) => (
                     <div key={i} className="bg-white p-10 rounded-[2rem] border border-[#b19681]/10 text-center space-y-4 shadow-sm hover:shadow-xl transition-all duration-500">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                           <item.icon size={28} />
                        </div>
                        <h4 className="text-xl font-serif font-bold text-[#5c4b3e] uppercase italic">{item.title}</h4>
                        <p className="text-sm text-[#85766a] font-sans font-medium">{item.desc}</p>
                     </div>
                  ))}
               </div>
            </div>
         </section>
      </AnimatedSection>

      {/* How to Book */}
      <AnimatedSection delay={0.1}>
        <section className="py-24 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <p className="text-[10px] font-sans font-black uppercase tracking-[0.4em] text-primary mb-3">Simple Process</p>
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#5c4b3e] mb-6 leading-tight uppercase italic">How to Secure Your<br/><span className="text-primary italic">Priority Access</span></h2>
                <p className="text-base text-[#85766a] mb-12 font-sans max-w-md font-medium">From browsing to receiving your verified tickets — our encrypted booking flow takes less than 3 minutes.</p>
                <div className="space-y-8">
                  {HOW_TO_STEPS.map((step, i) => (
                    <div key={i} className="flex gap-6 group">
                      <div className="shrink-0 w-14 h-14 rounded-2xl bg-[#e7dbbf]/40 border border-[#b19681]/20 flex items-center justify-center font-serif font-black text-primary text-xl shadow-sm group-hover:bg-primary group-hover:text-white transition-colors duration-300 italic">{step.num}</div>
                      <div className="pt-1">
                        <h3 className="text-xl font-serif font-bold text-[#5c4b3e] mb-2">{step.title}</h3>
                        <p className="text-sm text-[#85766a] leading-relaxed font-sans font-medium">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white group">
                <Image src={`${R2}/pexels-giorgi-gobadze-2160475859-36770780.jpg`} alt="How to book" fill className="object-cover group-hover:scale-105 transition-transform duration-[2s]" sizes="(max-width: 1024px) 100vw, 50vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1210]/60 to-transparent" />
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 flex items-center gap-5 shadow-xl border border-white/20">
                    <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-inner">
                      <Zap className="w-6 h-6 text-white fill-white" />
                    </div>
                    <div>
                      <p className="text-sm font-sans font-black uppercase tracking-widest text-[#5c4b3e] mb-1">Instant Delivery</p>
                      <p className="text-xs text-[#85766a] font-sans font-black uppercase tracking-tighter opacity-60">Transmission Nominal // 0.2s</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Trusted (Trust Badges) */}
      <AnimatedSection delay={0.1}>
        <section className="py-24 bg-[#e7dbbf]/20 border-y border-[#b19681]/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-[10px] font-sans font-black uppercase tracking-[0.4em] text-primary mb-3">Authorized Provider</p>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#5c4b3e] mb-16 uppercase italic">Licensed Travel Platform</h2>
            <TrustBadges />
          </div>
        </section>
      </AnimatedSection>

      {/* Reviews (Floating + Google) */}
      <AnimatedSection delay={0.1}>
        <section className="py-24 bg-[#413c33] text-white relative">
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <p className="text-[10px] font-sans font-black uppercase tracking-[0.4em] text-[#e4d7b0] mb-3">Verified Feedback</p>
              <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 italic uppercase tracking-tighter">Guest Log Archives</h2>
              <div className="flex items-center justify-center gap-2 mb-8">
                 <Star className="w-5 h-5 text-[#C9A227] fill-[#C9A227]" />
                 <Star className="w-5 h-5 text-[#C9A227] fill-[#C9A227]" />
                 <Star className="w-5 h-5 text-[#C9A227] fill-[#C9A227]" />
                 <Star className="w-5 h-5 text-[#C9A227] fill-[#C9A227]" />
                 <Star className="w-5 h-5 text-[#C9A227] fill-[#C9A227]" />
                 <span className="ml-2 font-bold text-lg text-[#e4d7b0]">4.9 / 5.0 Rating</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
               {GOOGLE_REVIEWS.map((review, i) => (
                  <div key={i} className="bg-[#FAF9F6]/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 relative hover:bg-[#FAF9F6]/10 transition-colors">
                     <div className="absolute top-6 right-6">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" className="w-6 h-6 grayscale opacity-30" />
                     </div>
                     <div className="flex items-center gap-1 mb-4">
                        {[...Array(review.rating)].map((_, idx) => <Star key={idx} className="w-4 h-4 text-[#C9A227] fill-[#C9A227]" />)}
                     </div>
                     <p className="text-stone-300 italic font-serif leading-relaxed mb-8 text-lg">"{review.text}"</p>
                     <div className="flex justify-between items-center mt-auto border-t border-white/5 pt-6">
                        <span className="font-bold text-sm uppercase tracking-widest text-[#e4d7b0]">{review.author}</span>
                        <span className="text-[10px] uppercase tracking-widest opacity-40">{review.date}</span>
                     </div>
                  </div>
               ))}
            </div>

            <div className="text-center">
               <a 
                  href="https://www.google.com/maps/place/Roman+Vatican+Tour+S.R.L.S/@41.9072162,12.4566341,17z/data=!3m1!4b1!4m6!3m5!1s0x132f618ae0168875:0xfd29b1c14213fe3!8m2!3d41.9072162!4d12.4566341!16s%2Fg%2F11w81zhl56" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-10 py-5 bg-[#FAF9F6] text-[#413c33] font-black uppercase tracking-widest text-[10px] rounded-full hover:bg-[#e4d7b0] transition-all shadow-xl hover:-translate-y-1"
               >
                  Read all Google Reviews <ExternalLink className="w-4 h-4" />
               </a>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Blog Section */}
      <AnimatedSection delay={0.1}>
        <section className="py-24 bg-background border-b border-[#b19681]/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-4">
               <div>
                  <p className="text-[10px] font-sans font-black uppercase tracking-[0.4em] text-primary mb-2">Editorial</p>
                  <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#5c4b3e] italic uppercase tracking-tighter">The Roman Journal</h2>
               </div>
               <Link href="/blog" className="inline-flex items-center gap-2 px-6 py-3 border-2 border-primary/20 text-primary text-[10px] font-sans font-black uppercase tracking-widest rounded-full hover:bg-primary/5 transition-all shrink-0">
                  Read All Articles <ArrowRight className="w-4 h-4" />
               </Link>
            </div>

            {posts.length > 0 ? (
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {posts.slice(0, 3).map((post: any) => (
                     <Link key={post._id} href={`/blog/${post.slug.current}`} className="group flex flex-col h-full bg-[#FAF9F6] rounded-[2rem] overflow-hidden border border-[#b19681]/10 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                        <div className="relative aspect-[16/10] overflow-hidden">
                           <Image 
                              src={post.mainImage ? (typeof post.mainImage === 'string' ? post.mainImage : post.mainImage.asset?.url) : `${R2}/pexels-efrem-efre-2786187-17282659.jpg`} 
                              alt={post.title} 
                              fill 
                              className="object-cover group-hover:scale-105 transition-transform duration-1000 grayscale group-hover:grayscale-0" 
                           />
                        </div>
                        <div className="p-8 flex flex-col flex-1">
                           <span className="text-[10px] font-black uppercase tracking-widest text-primary mb-4 block">
                              {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                           </span>
                           <h3 className="text-xl font-serif font-bold text-[#5c4b3e] mb-4 group-hover:text-primary transition-colors leading-tight italic">{post.title}</h3>
                           <p className="text-sm text-[#85766a] line-clamp-3 mb-8 font-sans font-medium">{post.excerpt}</p>
                           <div className="mt-auto flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Read Entry</span>
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all"><ArrowRight size={14} /></div>
                           </div>
                        </div>
                     </Link>
                  ))}
               </div>
            ) : (
               <div className="text-center py-20 bg-[#e7dbbf]/10 rounded-[3rem] border-2 border-dashed border-[#b19681]/20">
                  <p className="text-[#85766a] font-serif italic text-xl">Journal entries are currently being archived. Check back soon.</p>
               </div>
            )}
          </div>
        </section>
      </AnimatedSection>

      <div id="faq" className="bg-background"><FAQ /></div>
      <Footer />
    </main>
  );
}
