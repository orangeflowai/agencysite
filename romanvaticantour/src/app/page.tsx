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
import { ArrowRight, Shield, Clock, Star, Users, Zap, CheckCircle, Camera, Map } from "lucide-react";
import Image from "next/image";

export const revalidate = 3600;

const GALLERY_IMAGES = [
  { src: "https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=600&q=80", alt: "Vatican Museums", label: "Vatican Museums" },
  { src: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&q=80", alt: "Colosseum", label: "Colosseum" },
  { src: "https://images.unsplash.com/photo-1555992336-03a23c7b20ee?w=600&q=80", alt: "Sistine Chapel", label: "Sistine Chapel" },
  { src: "https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=600&q=80", alt: "Roman Forum", label: "Roman Forum" },
  { src: "https://images.unsplash.com/photo-1529260830199-42c24126f198?w=600&q=80", alt: "Trevi Fountain", label: "Trevi Fountain" },
  { src: "https://images.unsplash.com/photo-1568797629192-789acf8e4df3?w=600&q=80", alt: "St Peters Basilica", label: "St. Peter's" },
];

const HOW_TO_STEPS = [
  { num: "01", title: "Choose Your Experience", desc: "Browse our curated Vatican & Rome tours. Filter by duration, group size, or attraction." },
  { num: "02", title: "Pick a Date & Time", desc: "Select from real-time availability. Instant confirmation — no waiting for approval." },
  { num: "03", title: "Secure Your Spot", desc: "Pay securely via Stripe. Your booking is confirmed immediately with a PDF ticket." },
  { num: "04", title: "Meet Your Guide", desc: "Arrive at the meeting point. Your expert guide will be waiting with your skip-the-line access." },
];

const FEATURES = [
  { icon: Zap, title: "Skip the Line", desc: "Bypass queues of up to 3 hours with our official fast-track access." },
  { icon: Shield, title: "Free Cancellation", desc: "Full refund up to 24 hours before your tour. No questions asked." },
  { icon: Star, title: "Expert Guides", desc: "Licensed art historians and archaeologists bring history to life." },
  { icon: Users, title: "Small Groups", desc: "Maximum 15 people per group for an intimate, personal experience." },
  { icon: Clock, title: "Instant Confirmation", desc: "Receive your e-ticket within seconds of booking." },
  { icon: CheckCircle, title: "Official Access", desc: "Authorised by Vatican Museums and Italian Ministry of Culture." },
];

export default async function Home() {
  let tours = await getTours();
  const settings = await getSettings();

  if (!tours || tours.length === 0) {
    tours = fallbackTours.map(t => ({
      ...t, _id: t.id, slug: { current: t.slug }, mainImage: t.imageUrl
    })) as any;
  }

  const vaticanTours = tours.filter((t: any) => t.category === "vatican").slice(0, 4);
  const colosseumTours = tours.filter((t: any) => t.category === "colosseum").slice(0, 4);
  const allFeatured = tours.slice(0, 8);

  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />

      {/* ── HERO ── */}
      <Hero settings={settings} />

      {/* ── MOMENTS GALLERY (like the screenshot mosaic) ── */}
      <AnimatedSection delay={0.1}>
        <section className="py-24 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary mb-3">Gallery</p>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
                Unforgettable Moments in the<br />
                <span className="text-primary">Heart of Rome</span>
              </h2>
              <p className="mt-4 text-base text-muted-foreground max-w-xl mx-auto">
                Every corner of the Eternal City holds a story. Let us show you the ones that last a lifetime.
              </p>
            </div>

            {/* Mosaic grid — matches the screenshot layout */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              {GALLERY_IMAGES.map((img, i) => (
                <div
                  key={i}
                  className={[
                    "relative overflow-hidden rounded-2xl group cursor-pointer",
                    i === 0 ? "md:col-span-2 aspect-[16/9]" : "aspect-square",
                  ].join(" ")}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="absolute bottom-3 left-3 text-white text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {img.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* ── FEATURES GRID ── */}
      <AnimatedSection delay={0.1}>
        <section className="py-24 bg-muted">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary mb-3">Why Choose Us</p>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground">
                Discover the Best Rome Adventures<br />
                <span className="text-primary">for Every Kind of Traveler</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {FEATURES.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="bg-card rounded-2xl p-6 border border-border hover:shadow-lg transition-shadow duration-300 group">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-base font-bold text-foreground mb-2">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* ── VATICAN TOURS ── */}
      {vaticanTours.length > 0 && (
        <AnimatedSection delay={0.1}>
          <section id="vatican" className="py-24 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-end justify-between mb-12">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary mb-2">Vatican</p>
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground">The Vatican Collection</h2>
                  <p className="mt-2 text-base text-muted-foreground max-w-lg">
                    Secure your skip-the-line access to the Sistine Chapel, Museums, and St. Peter's Basilica.
                  </p>
                </div>
                <Link href="/category/vatican" className="hidden md:inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline shrink-0">
                  View All <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {vaticanTours.map((tour: any) => <TourCard key={tour._id} tour={tour} />)}
              </div>
              <div className="mt-8 text-center md:hidden">
                <Link href="/category/vatican" className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline">
                  View All Vatican Tours <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </section>
        </AnimatedSection>
      )}

      {/* ── CAPTURE SECTION (photo mosaic like screenshot) ── */}
      <AnimatedSection delay={0.1}>
        <section className="py-24 bg-muted overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary mb-3">Memories</p>
                <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight mb-6">
                  Capture Your Roman<br />
                  <span className="text-primary">Journey Forever</span>
                </h2>
                <p className="text-base text-muted-foreground leading-relaxed mb-8">
                  Our professional photography add-on captures every breathtaking moment — from the Sistine Chapel ceiling to the Colosseum at golden hour. 50+ edited photos delivered within 24 hours.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/search" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 transition-opacity text-sm">
                    Browse All Tours <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link href="/about" className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-border text-foreground font-bold rounded-xl hover:bg-muted transition-colors text-sm">
                    Learn More
                  </Link>
                </div>
              </div>
              {/* Stacked photo cards */}
              <div className="relative h-80 md:h-96">
                {[
                  { src: "https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=400&q=80", rotate: "-rotate-6", z: "z-10", top: "top-0 left-0" },
                  { src: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400&q=80", rotate: "rotate-3", z: "z-20", top: "top-8 left-16" },
                  { src: "https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=400&q=80", rotate: "-rotate-2", z: "z-30", top: "top-16 left-8" },
                ].map((card, i) => (
                  <div key={i} className={`absolute ${card.top} ${card.z} ${card.rotate} w-48 h-64 md:w-56 md:h-72 rounded-2xl overflow-hidden shadow-xl border-4 border-white hover:scale-105 transition-transform duration-300`}>
                    <Image src={card.src} alt="Rome" fill className="object-cover" sizes="224px" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* ── COLOSSEUM TOURS ── */}
      {colosseumTours.length > 0 && (
        <AnimatedSection delay={0.1}>
          <section id="colosseum" className="py-24 bg-foreground">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-end justify-between mb-12">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary mb-2">Ancient Rome</p>
                  <h2 className="text-3xl md:text-4xl font-bold text-white">Ancient Rome Experiences</h2>
                  <p className="mt-2 text-base text-white/60 max-w-lg">
                    Explore the Colosseum, Roman Forum, and Palatine Hill with expert archaeologists.
                  </p>
                </div>
                <Link href="/category/colosseum" className="hidden md:inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline shrink-0">
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

      {/* ── HOW TO BOOK ── */}
      <AnimatedSection delay={0.1}>
        <section className="py-24 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              {/* Left: image */}
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1529260830199-42c24126f198?w=800&q=80"
                  alt="How to book"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Star className="w-6 h-6 text-primary fill-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">4.9 / 5.0 Rating</p>
                      <p className="text-xs text-muted-foreground">Based on 3,200+ verified reviews</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: steps */}
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary mb-3">Process</p>
                <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">How to Book Your Tour</h2>
                <p className="text-base text-muted-foreground mb-10">
                  From browsing to boarding — our booking process takes less than 3 minutes.
                </p>
                <div className="space-y-6">
                  {HOW_TO_STEPS.map((step, i) => (
                    <div key={i} className="flex gap-5 group">
                      <div className="shrink-0 w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center font-black text-primary text-sm group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                        {step.num}
                      </div>
                      <div className="pt-1">
                        <h3 className="text-base font-bold text-foreground mb-1">{step.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* ── REVIEWS ── */}
      <AnimatedSection delay={0.1}>
        <section className="py-24 bg-muted">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary mb-3">Testimonials</p>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground">
                Trusted by Pilgrims & Travelers
              </h2>
              <p className="mt-4 text-base text-muted-foreground max-w-xl mx-auto">
                Read why thousands of people rate us 5 stars.
              </p>
            </div>
            <FloatingReviews />
          </div>
        </section>
      </AnimatedSection>

      {/* ── CTA BANNER ── */}
      <AnimatedSection delay={0.1}>
        <section className="py-24 bg-primary relative overflow-hidden">
          {/* Subtle pattern */}
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
              Experience the Magic of<br />Roman Vatican Today
            </h2>
            <p className="text-base text-primary-foreground/80 mb-10 max-w-xl mx-auto">
              Join 50,000+ travelers who have unlocked Rome through exclusive access, expert storytelling, and zero waiting.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/search" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary font-bold rounded-xl hover:bg-primary-foreground transition-colors text-sm">
                Browse All Tours <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/contact" className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white/40 text-white font-bold rounded-xl hover:bg-white/10 transition-colors text-sm">
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </AnimatedSection>

      <div id="faq" className="bg-background">
        <FAQ />
      </div>

      <Footer />
    </main>
  );
}
