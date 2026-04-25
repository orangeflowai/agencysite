import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TrustBadges from "@/components/TrustBadges";
import Footer from "@/components/Footer";
import ProductRow from "@/components/ProductRow";
import AnimatedSection from "@/components/AnimatedSection";
import { getTours, getSettings, getPosts } from "@/lib/dataAdapter";
import { tours as fallbackTours } from "@/lib/toursData";
import HighlightSection from '@/components/HighlightSection';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export const revalidate = 3600;

const R2 = 'https://pub-772bbb33a07f4026aa9652a0cfef4c2e.r2.dev/rome%20photos';

const RomeGallery     = dynamic(() => import('@/components/RomeGallery'),     { loading: () => <div className="h-96 w-full bg-gray-900 animate-pulse" /> });
const FloatingReviews = dynamic(() => import('@/components/FloatingReviews'), { ssr: true });
const FAQ             = dynamic(() => import('@/components/FAQ'));

export default async function Home() {
  const [toursData, settings, posts] = await Promise.all([getTours(), getSettings(), getPosts()]);
  let tours = toursData;

  if (!tours || tours.length === 0) {
    tours = fallbackTours.map((t: any) => ({
      ...t, _id: t.id, slug: { current: t.slug }, mainImage: t.imageUrl,
    })) as any;
  }

  const vaticanTours    = tours.filter((t: any) => t.category === 'vatican');
  const colosseumTours  = tours.filter((t: any) => t.category === 'colosseum');
  const cityTours       = tours.filter((t: any) => t.category === 'city');
  const hiddenGemsTours = tours.filter((t: any) => t.category === 'hidden-gems');

  return (
    <main className="min-h-screen bg-[#FDFFF5]">
      <Navbar />
      <Hero settings={settings} />

      {/* Stats */}
      <div className="py-3 overflow-hidden bg-[#1A1210]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-white/10">
            {[
              { stat: '50,000+', label: 'Happy Guests' },
              { stat: '4.9 ★',   label: 'Google Rating' },
              { stat: '24/7',    label: 'Support' },
              { stat: '100%',    label: 'Satisfaction' },
            ].map((item) => (
              <div key={item.label} className="text-center px-4 py-2">
                <p className="font-serif font-bold text-xl md:text-2xl leading-none text-[#C9A84C]">{item.stat}</p>
                <p className="font-sans text-[9px] uppercase tracking-[0.2em] mt-1 text-white/50">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="py-20 bg-[#FDFFF5]">
        <div className="container mx-auto px-6 md:px-16 text-center mb-10">
          <p className="font-sans text-[10px] tracking-[0.4em] uppercase font-bold mb-3 text-[#C9A84C]">✦ GUEST EXPERIENCES ✦</p>
          <h2 className="font-serif font-bold text-4xl text-[#1A1210]">What our travelers say</h2>
        </div>
        <FloatingReviews />
      </div>

      {/* Vatican */}
      <AnimatedSection id="vatican" delay={0.1}>
        <ProductRow title="Vatican Museums & St. Peter's" subtitle="Skip the line to the Sistine Chapel, Gardens & Dome" tours={vaticanTours} link="/category/vatican" dark={false} />
      </AnimatedSection>

      <RomeGallery />

      <HighlightSection
        eyebrow="WHAT WE DO"
        title="Vatican & Rome's Greatest Experiences, Simplified"
        body="Skip-the-line access, small groups, and expert licensed guides who bring the stories of Rome to life. We've obsessed over every detail so your visit feels effortless."
        ctaText="Browse All Tours"
        ctaHref="/category/vatican"
        imageUrl={`${R2}/pexels-akarsh-chandran-2156074716-34026966.jpg`}
        imageAlt="Inside the Vatican Museums"
      />

      {/* Colosseum */}
      <AnimatedSection id="colosseum" delay={0.2}>
        <ProductRow title="Colosseum & Ancient Rome" subtitle="Walk in the footsteps of Gladiators — Arena, Underground, and Forum." tours={colosseumTours} link="/category/colosseum" dark={true} />
      </AnimatedSection>

      {/* City */}
      <AnimatedSection id="city" delay={0.3}>
        <ProductRow title="Rome City Tours" subtitle="Explore the Pantheon, Trevi Fountain, Spanish Steps and iconic squares." tours={cityTours} link="/category/city" dark={false} />
      </AnimatedSection>

      {/* Hidden Gems */}
      <AnimatedSection id="hidden-gems" delay={0.4}>
        <ProductRow title="Italy Hidden Gems" subtitle="Catacombs, Golf Cart tours, Day trips, Food tours & unique experiences." tours={hiddenGemsTours} link="/category/hidden-gems" dark={true} />
      </AnimatedSection>

      {/* Trust */}
      <AnimatedSection delay={0.6}>
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6 md:px-16 text-center mb-8">
            <p className="font-sans text-[10px] tracking-[0.35em] uppercase font-bold mb-3 text-[#C9A84C]">✦ BOOK WITH CONFIDENCE ✦</p>
            <h2 className="font-serif font-bold text-[#1A1210]" style={{ fontSize: 'clamp(28px, 3.5vw, 42px)' }}>Why Choose RomeWander</h2>
          </div>
          <TrustBadges />
        </section>
      </AnimatedSection>

      <div id="faq" className="bg-white"><FAQ /></div>

      {/* Blog Section */}
      {posts && posts.length > 0 && (
        <AnimatedSection delay={0.1}>
          <section className="py-24 bg-[#faf9f7] border-t border-[#e8e0d5]">
            <div className="container mx-auto px-6 md:px-16">
              <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-6">
                <div>
                  <p className="text-[#C9A84C] font-bold uppercase tracking-widest text-xs mb-3">Travel Guides</p>
                  <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#1A1210]">From Our Blog</h2>
                </div>
                <Link href="/blog" className="inline-flex items-center gap-2 text-[#C9A84C] font-bold text-sm uppercase tracking-widest hover:underline shrink-0">
                  All Articles <ArrowRight size={16} />
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {posts.slice(0, 3).map((post: any) => (
                  <Link key={post._id} href={`/blog/${post.slug.current}`} className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-[#e8e0d5] hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="relative aspect-[16/9] overflow-hidden bg-[#f0ebe3]">
                      {post.mainImage?.asset?.url && (
                        <Image src={post.mainImage.asset.url} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                      )}
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="text-lg font-bold text-[#1A1210] mb-2 group-hover:text-[#C9A84C] transition-colors line-clamp-2">{post.title}</h3>
                      <p className="text-sm text-[#6b5c4e] line-clamp-3 mb-4 flex-1">{post.excerpt}</p>
                      <span className="text-xs font-bold text-[#C9A84C] uppercase tracking-widest flex items-center gap-1">Read More <ArrowRight size={12} /></span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </AnimatedSection>
      )}

      <Footer />
    </main>
  );
}
