import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import FloatingReviews from "@/components/FloatingReviews";
import FAQ from "@/components/FAQ";
import TourCard from "@/components/TourCard";
import Link from "next/link";
import { getTours, getSettings } from "@/lib/dataAdapter";
import { tours as fallbackTours } from "@/lib/toursData";
import { ArrowRight, Shield, Clock, Star, Users, Zap, CheckCircle } from "lucide-react";
import Image from "next/image";

export const revalidate = 3600;

const R2 = 'https://pub-772bbb33a07f4026aa9652a0cfef4c2e.r2.dev/rome%20photos';

const GALLERY_IMAGES = [
  { src: `${R2}/pexels-akarsh-chandran-2156074716-34026966.jpg`,        alt: "Vatican Museums",  label: "Vatican Museums" },
  { src: `${R2}/pexels-axp-photography-500641970-18991563.jpg`,         alt: "Colosseum",        label: "Colosseum" },
  { src: `${R2}/pexels-giorgi-gobadze-2160475859-36770779.jpg`,         alt: "Sistine Chapel",   label: "Sistine Chapel" },
  { src: `${R2}/pexels-efrem-efre-2786187-17282659.jpg`,                alt: "Roman Forum",      label: "Roman Forum" },
  { src: `${R2}/pexels-alex-250137-757239.jpg`,                         alt: "Trevi Fountain",   label: "Trevi Fountain" },
  { src: `${R2}/pexels-filiamariss-30785778.jpg`,                       alt: "St Peters",        label: "St. Peter's" },
];

const HOW_TO_STEPS = [
  { num: "01", title: "Choose Your Experience",  desc: "Browse our curated Vatican & Rome tours. Filter by duration, group size, or attraction." },
  { num: "02", title: "Pick a Date & Time",       desc: "Select from real-time availability. Instant confirmation — no waiting for approval." },
  { num: "03", title: "Secure Your Spot",         desc: "Pay securely via Stripe. Your booking is confirmed immediately with a PDF ticket." },
  { num: "04", title: "Meet Your Guide",          desc: "Arrive at the meeting point. Your expert guide will be waiting with skip-the-line access." },
];

const FEATURES = [
  { icon: Zap,          title: "Skip the Line",        desc: "Bypass queues of up to 3 hours with our official fast-track access." },
  { icon: Shield,       title: "Free Cancellation",    desc: "Full refund up to 24 hours before your tour. No questions asked." },
  { icon: Star,         title: "Expert Guides",        desc: "Licensed art historians and archaeologists bring history to life." },
  { icon: Users,        title: "Small Groups",         desc: "Maximum 15 people per group for an intimate, personal experience." },
  { icon: Clock,        title: "Instant Confirmation", desc: "Receive your e-ticket within seconds of booking." },
  { icon: CheckCircle,  title: "Official Access",      desc: "Authorised by Vatican Museums and Italian Ministry of Culture." },
];

export default async function Home() {
  let tours = await getTours();
  const settings = await getSettings();

  if (!tours || tours.length === 0) {
    tours = fallbackTours.map((t: any) => ({
      ...t, _id: t.id, slug: { current: t.slug }, mainImage: t.imageUrl,
    })) as any;
  }

  const vaticanTours   = tours.filter((t: any) => t.category === "vatican").slice(0, 4);
  const colosseumTours = tours.filter((t: any) => t.category === "colosseum").slice(0, 4);

  return (
    <main className="min-h-screen bg-background overflow-x-hidden selection:bg-primary selection:text-white">
      <Navbar />
      <Hero settings={settings} />

      {/* Gallery mosaic */}
      <AnimatedSection delay={0.1}>
        <section className="py-24 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <p className="text-[10px] font-sans font-black uppercase tracking-[0.4em] text-primary mb-3">Gallery</p>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#5c4b3e] leading-tight">
                Unforgettable Moments in the<br />
                <span className="text-primary italic">Heart of Rome</span>
              </h2>
              <p className="mt-4 text-base text-[#85766a] max-w-xl mx-auto font-sans">
                Every corner of the Eternal City holds a story. Let us show you the ones that last a lifetime.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              {GALLERY_IMAGES.map((img, i) => (
                <div key={i} className={`relative overflow-hidden rounded-2xl group cursor-pointer ${i === 0 ? "md:col-span-2 aspect-[16/9]" : "aspect-square"}`}>
                  <Image src={img.src} alt={img.alt} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 768px) 50vw, 33vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1210]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="absolute bottom-3 left-3 text-white text-[10px] font-sans font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300">{img.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Features */}
      <AnimatedSection delay={0.1}>
        <section className="py-24 bg-[#e7dbbf]/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <p className="text-[10px] font-sans font-black uppercase tracking-[0.4em] text-primary mb-3">Why Choose Us</p>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#5c4b3e]">
                The Best Rome Adventures<br />
                <span className="text-primary italic">for Every Traveler</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {FEATURES.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="bg-card rounded-2xl p-6 border border-[#b19681]/20 hover:shadow-lg transition-shadow duration-300 group">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary transition-colors">
                    <Icon className="w-6 h-6 text-primary group-hover:text-white" />
                  </div>
                  <h3 className="text-lg font-serif font-bold text-[#5c4b3e] mb-2">{title}</h3>
                  <p className="text-sm text-[#85766a] leading-relaxed font-sans">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Vatican Tours */}
      {vaticanTours.length > 0 && (
        <AnimatedSection delay={0.1}>
          <section id="vatican" className="py-24 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-end justify-between mb-12">
                <div>
                  <p className="text-[10px] font-sans font-black uppercase tracking-[0.4em] text-primary mb-2">Vatican</p>
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#5c4b3e]">The Vatican Collection</h2>
                  <p className="mt-2 text-base text-[#85766a] max-w-lg font-sans">Secure your skip-the-line access to the Sistine Chapel, Museums, and St. Peter's Basilica.</p>
                </div>
                <Link href="/category/vatican" className="hidden md:inline-flex items-center gap-2 text-xs font-sans font-black uppercase tracking-widest text-primary hover:underline shrink-0">
                  View All <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {vaticanTours.map((tour: any) => <TourCard key={tour._id} tour={tour} />)}
              </div>
            </div>
          </section>
        </AnimatedSection>
      )}

      {/* Colosseum Tours */}
      {colosseumTours.length > 0 && (
        <AnimatedSection delay={0.1}>
          <section id="colosseum" className="py-24 bg-[#413c33]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-end justify-between mb-12">
                <div>
                  <p className="text-[10px] font-sans font-black uppercase tracking-[0.4em] text-accent mb-2">Ancient Rome</p>
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-white">Ancient Rome Experiences</h2>
                  <p className="mt-2 text-base text-stone-400 max-w-lg font-sans">Explore the Colosseum, Roman Forum, and Palatine Hill with expert archaeologists.</p>
                </div>
                <Link href="/category/colosseum" className="hidden md:inline-flex items-center gap-2 text-xs font-sans font-black uppercase tracking-widest text-accent hover:underline shrink-0">
                  View All <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {colosseumTours.map((tour: any) => <TourCard key={tour._id} tour={tour} dark />)}
              </div>
            </div>
          </section>
        </AnimatedSection>
      )}

      {/* How to Book */}
      <AnimatedSection delay={0.1}>
        <section className="py-24 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
                <Image src={`${R2}/pexels-giorgi-gobadze-2160475859-36770780.jpg`} alt="How to book" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1210]/40 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-[#e4d7b0]/90 backdrop-blur-sm rounded-2xl p-4 flex items-center gap-4 border border-white/20">
                    <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
                      <Star className="w-6 h-6 text-white fill-white" />
                    </div>
                    <div>
                      <p className="text-sm font-serif font-bold text-[#5c4b3e]">4.9 / 5.0 Rating</p>
                      <p className="text-[10px] text-[#85766a] font-sans font-black uppercase tracking-widest">Based on 3,200+ verified reviews</p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-sans font-black uppercase tracking-[0.4em] text-primary mb-3">Process</p>
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#5c4b3e] mb-4">How to Book Your Tour</h2>
                <p className="text-base text-[#85766a] mb-10 font-sans">From browsing to boarding — our booking process takes less than 3 minutes.</p>
                <div className="space-y-6">
                  {HOW_TO_STEPS.map((step, i) => (
                    <div key={i} className="flex gap-5 group">
                      <div className="shrink-0 w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center font-serif font-black text-primary text-sm group-hover:bg-primary group-hover:text-white transition-colors duration-300 italic">{step.num}</div>
                      <div className="pt-1">
                        <h3 className="text-lg font-serif font-bold text-[#5c4b3e] mb-1">{step.title}</h3>
                        <p className="text-sm text-[#85766a] leading-relaxed font-sans">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Reviews */}
      <AnimatedSection delay={0.1}>
        <section className="py-24 bg-[#e7dbbf]/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
            <p className="text-[10px] font-sans font-black uppercase tracking-[0.4em] text-primary mb-3">Testimonials</p>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#5c4b3e]">Trusted by Travelers Worldwide</h2>
          </div>
          <FloatingReviews />
        </section>
      </AnimatedSection>

      {/* CTA */}
      <AnimatedSection delay={0.1}>
        <section className="py-24 bg-[#413c33] relative overflow-hidden">
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">Experience the Magic of<br />Roman Vatican Today</h2>
            <p className="text-base text-stone-300 mb-10 max-w-xl mx-auto font-sans">Join 50,000+ travelers who have unlocked Rome through exclusive access, expert storytelling, and zero waiting.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/search" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white font-sans font-black uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-all text-[10px]">
                Browse All Tours <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/contact" className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white/20 text-white font-sans font-black uppercase tracking-widest rounded-xl hover:bg-white/10 transition-all text-[10px]">
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </AnimatedSection>

      <div id="faq" className="bg-background"><FAQ /></div>
      <Footer />
    </main>
  );
}
