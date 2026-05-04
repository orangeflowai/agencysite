import React from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import TourCard from "@/components/TourCard";
import FAQ from "@/components/FAQ";
import HomeAnimations from "@/components/HomeAnimations";
import { getTours, getSettings, getPosts } from "@/lib/dataAdapter";
import { getPexelsImages, ROME_QUERIES } from "@/lib/pexels";
import { tours as fallbackTours } from "@/lib/toursData";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Zap, MessageCircle, RefreshCw } from "lucide-react";
import SplitText from "@/components/SplitText";
import HighlightSection from "@/components/HighlightSection";
import RomeGallery from "@/components/RomeGallery";
import FloatingReviews from "@/components/FloatingReviews";
import TrustBadges from "@/components/TrustBadges";
import SpecialOffer from "@/components/SpecialOffer";
import BookingCTA from "@/components/BookingCTA";
import Steps from "@/components/Steps";
import FeatureIcons from "@/components/FeatureIcons";

export const revalidate = 3600;

export default async function Home() {
  const [toursData, settings, posts, pexelsVatican] = await Promise.all([
    getTours(),
    getSettings(),
    getPosts(),
    getPexelsImages(ROME_QUERIES.vatican, 4),
  ]);

  let tours = toursData;
  if (!tours || tours.length === 0) {
    tours = fallbackTours.map((t: any) => ({
      ...t, _id: t.id, slug: { current: t.slug }, mainImage: t.imageUrl,
    })) as any;
  }

  const bestSellers = tours.slice(0, 3);
  const featuredTour = bestSellers[0] || tours[0];

  return (
    <main className="min-h-screen bg-background text-secondary font-body selection:bg-primary selection:text-secondary-foreground">
      <Navbar />
      
      {/* 1. Hero Section */}
      <Hero settings={settings} />

      {/* 2. Trust / Stats Bar - Proper Spacing */}
      <section className="bg-background py-16 md:py-24 border-b border-primary/20">
         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-secondary font-heading font-bold uppercase tracking-tight text-[10px] mb-8 text-center opacity-40">Authenticated by 50,000+ Verified Logs</h3>
            <TrustBadges />
         </div>
      </section>

      {/* 3. Top Destinations - All Tours Grid */}
      <section className="bg-background py-24 md:py-32 border-b border-primary/10">
         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-end justify-between mb-16 md:mb-20 gap-6">
               <div className="max-w-2xl">
                  <p className="text-[10px] font-heading font-bold uppercase tracking-tight text-primary mb-4">✦ Sacred Destinations ✦</p>
                  <SplitText className="text-4xl md:text-5xl font-heading font-bold leading-tight tracking-tighter text-secondary uppercase">
                    Top Vatican & Rome <span className="font-vibes text-primary lowercase italic">Experiences</span>
                  </SplitText>
               </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {tours.map((tour: any) => <TourCard key={tour._id} tour={tour} />)}
            </div>
         </div>
      </section>

      {/* 4. Featured Experience - Proper Spacing */}
      {featuredTour && (
         <HighlightSection 
            eyebrow="✦ Featured Experience ✦"
            title={featuredTour.title || "Vatican Early Access"}
            body={featuredTour.description?.slice(0, 200) + "..." || "Experience Rome like never before with our expert-led historian tours."}
            imageUrl={featuredTour.mainImage?.asset?.url || (typeof featuredTour.mainImage === 'string' ? featuredTour.mainImage : pexelsVatican[0]?.url)}
            ctaText="Explore the Archive"
            ctaHref={`/tour/${featuredTour.slug?.current}`}
            imageAlt={`${featuredTour.title} - Luxury small-group tour with Golden Rome art historian guide`}
         />
      )}

      {/* 5. Why Golden Rome (Historian's Choice) - Proper Spacing */}
      <section className="bg-background text-secondary py-24 md:py-32 relative overflow-hidden border-b border-primary/10">
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[150px] rounded-full -mr-64 -mt-64" />
         <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-4xl mb-16 md:mb-20">
               <SplitText className="text-4xl md:text-5xl font-heading font-bold leading-tight tracking-tighter text-secondary uppercase">Why Golden Rome is the <span className="font-vibes text-primary lowercase italic">Historian's Choice.</span></SplitText>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
               {[
                  { title: 'Skip the Line Protocols', icon: Zap, desc: 'Official partner portals secure bypass entry.' },
                  { title: 'Licensed Historians', icon: ShieldCheck, desc: 'Vetted archaeologists and art history experts.' },
                  { title: 'Small Group Intimacy', icon: MessageCircle, desc: 'Maximum 15 guests for navigation ease.' },
                  { title: 'Encrypted Payments', icon: RefreshCw, desc: 'Secure booking via Stripe protocols.' },
               ].map((item, i) => (
                  <div key={i} className="space-y-4 group">
                     <item.icon className="w-8 h-8 text-primary transition-transform group-hover:scale-110" />
                     <h4 className="text-lg md:text-xl font-heading font-bold leading-tight tracking-tight text-secondary uppercase">{item.title}</h4>
                     <p className="text-base font-body leading-relaxed text-secondary/60">{item.desc}</p>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* 6. Experience Gallery - Proper Spacing */}
      <RomeGallery />

      {/* 7. How it Works (3 Steps) - Proper Spacing */}
      <Steps />

      {/* 8. Special Offer Banner - Proper Spacing */}
      <SpecialOffer />

      {/* 9. Feature Icons Row - Proper Spacing */}
      <FeatureIcons />

      {/* 10. Testimonials (Guest Log Archives) - Proper Spacing */}
      <section className="py-24 md:py-32 bg-background border-b border-primary/10">
         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 md:mb-20">
               <p className="text-[10px] font-heading font-bold uppercase tracking-tight text-primary mb-4">✦ Verified Feedback ✦</p>
               <SplitText className="text-4xl md:text-5xl font-heading font-bold leading-tight tracking-tighter text-secondary justify-center uppercase">Guest Log <span className="font-vibes text-primary lowercase italic">Archives</span></SplitText>
            </div>
            <FloatingReviews />
         </div>
      </section>

      {/* 11. Booking Platform CTA - Proper Spacing */}
      <BookingCTA />

      <div id="faq" className="bg-background"><FAQ /></div>

      {/* 12. Blog Section - Proper Spacing */}
      {posts && posts.length > 0 && (
        <section className="py-24 md:py-32 bg-background text-secondary border-t border-primary/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-6">
              <div>
                <p className="text-[10px] font-heading font-bold uppercase tracking-tight text-primary mb-3">Sacred Travel</p>
                <h2 className="text-4xl md:text-5xl font-heading font-bold leading-tight tracking-tighter text-secondary uppercase">News & <span className="font-vibes text-primary lowercase italic">Insights</span></h2>
              </div>
              <Link href="/blog" className="inline-flex items-center gap-2 text-xs font-heading font-bold uppercase tracking-tight text-primary hover:underline shrink-0">
                All Articles <ArrowRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {posts.slice(0, 3).map((post: any) => (
                <Link key={post._id} href={`/blog/${post.slug.current}`} className="group flex flex-col bg-background rounded-2xl overflow-hidden border border-primary/20 hover:border-primary transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-xl">
                  <div className="relative aspect-[16/9] overflow-hidden bg-ivory-parchment">
                    {post.mainImage?.asset?.url && (
                      <img src={post.mainImage.asset.url} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    )}
                  </div>
                  <div className="p-6 md:p-8 flex flex-col flex-1">
                    <h3 className="text-lg font-heading font-bold leading-tight tracking-tight text-secondary mb-2 group-hover:text-primary transition-colors line-clamp-2 uppercase">{post.title}</h3>
                    <p className="text-sm font-body leading-relaxed text-secondary/60 line-clamp-3 mb-4 flex-1">{post.excerpt}</p>
                    <span className="text-[10px] font-heading font-bold uppercase tracking-tight text-primary flex items-center gap-1">Read More <ArrowRight size={12} /></span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
      <HomeAnimations />
    </main>
  );
}
