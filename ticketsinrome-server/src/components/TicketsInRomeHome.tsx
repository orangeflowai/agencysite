'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Star, Shield, Clock, MapPin, Ticket, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface Tour {
  _id: string; title: string; slug: { current: string }; price: number;
  mainImage?: any; category?: string; duration?: string; groupSize?: string;
  rating?: number; reviewCount?: number; badge?: string; description?: string;
}

interface TicketsInRomeHomeProps {
  tours: Tour[];
  vaticanTours: Tour[];
  colosseumTours: Tour[];
  posts: any[];
  heroImages: string[];
}

export default function TicketsInRomeHome({ tours, vaticanTours, colosseumTours, heroImages }: TicketsInRomeHomeProps) {
  const categories = [
    { name: 'All Tours', tours },
    { name: 'Vatican', tours: vaticanTours },
    { name: 'Colosseum', tours: colosseumTours },
    { name: 'City Tours', tours: tours.filter((t: any) => t.category === 'city-tours' || t.category === 'city') },
  ].filter(c => c.tours.length > 0);

  const [activeCat, setActiveCat] = useState(0);
  const displayTours = categories[activeCat]?.tours || tours;

  const features = [
    { title: 'Official Tickets', desc: 'Authorized partner for all major Rome attractions. No hidden fees.' },
    { title: 'Skip the Line', desc: 'Priority entry to Vatican Museums, Colosseum and more.' },
    { title: 'Free Cancellation', desc: 'Full refund up to 24 hours before your tour.' },
    { title: 'Mobile Tickets', desc: 'Instant delivery to your phone. No printing needed.' },
    { title: 'Expert Guides', desc: 'Licensed English-speaking guides with deep local knowledge.' },
    { title: 'Secure Payment', desc: 'SSL encrypted payments via Stripe. Your data is safe.' },
  ];

  const formatPrice = (p: number) => `€${p}`;

  return (
    <main className="min-h-screen bg-background text-foreground font-sans">
      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-white border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-3xl">
            <span className="inline-block text-xs font-semibold text-primary tracking-widest uppercase mb-4">
              Official Ticket Partner
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground leading-[1.05] mb-6">
              Rome tickets,{' '}
              <span className="text-primary">made simple.</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mb-8 leading-relaxed">
              Skip-the-line tickets for the Vatican, Colosseum, and Rome&apos;s best attractions.
              Instant confirmation. Free cancellation. No hidden fees.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/category/vatican"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors text-sm"
              >
                Vatican Tickets <ArrowRight size={16} />
              </Link>
              <Link
                href="/category/colosseum"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-foreground font-semibold rounded-lg border-2 border-border hover:border-primary transition-colors text-sm"
              >
                Colosseum Tickets <ArrowRight size={16} />
              </Link>
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-border">
              {[
                { value: '50,000+', label: 'Happy travelers' },
                { value: '4.9', label: 'Average rating' },
                { value: '24h', label: 'Free cancellation' },
              ].map(s => (
                <div key={s.label}>
                  <p className="text-2xl font-bold text-foreground">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Category Pills ─────────────────────────────────────── */}
      <section className="py-12 bg-white border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {[
              { icon: '⛪', label: 'Vatican Museums', href: '/category/vatican' },
              { icon: '🏟', label: 'Colosseum', href: '/category/colosseum' },
              { icon: '🏛', label: 'City Tours', href: '/category/city-tours' },
              { icon: '🎨', label: 'Art & History', href: '/search?q=art' },
              { icon: '🍷', label: 'Food & Wine', href: '/search?q=food' },
              { icon: '🚗', label: 'Day Trips', href: '/category/hidden-gems' },
            ].map(c => (
              <Link
                key={c.label}
                href={c.href}
                className="inline-flex items-center gap-2 px-5 py-3 bg-card border border-border rounded-full text-sm font-medium text-foreground hover:border-primary hover:text-primary transition-all"
              >
                <span className="text-lg">{c.icon}</span>
                {c.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Popular Tours ──────────────────────────────────────── */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold text-primary tracking-widest uppercase">Popular Tickets</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">Top-rated experiences in Rome</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Hand-picked tours with instant confirmation and free cancellation.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex justify-center gap-2 mb-10">
            {categories.map((cat, i) => (
              <button
                key={cat.name}
                onClick={() => setActiveCat(i)}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeCat === i
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-card text-muted-foreground border border-border hover:text-foreground'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Tour Cards — 3-column grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayTours.slice(0, 9).map((tour: Tour) => {
              const imgUrl = tour.mainImage
                ? typeof tour.mainImage === 'string' ? tour.mainImage : (tour.mainImage?.asset?.url || '/placeholder.jpg')
                : '/placeholder.jpg';
              return (
                <Link
                  key={tour._id}
                  href={`/tour/${tour.slug.current}`}
                  className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all duration-300"
                >
                  {/* Image */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                    <Image
                      src={imgUrl}
                      alt={tour.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    {tour.badge && (
                      <span className="absolute top-3 left-3 px-2.5 py-1 bg-primary text-white text-xs font-semibold rounded-md">
                        {tour.badge}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    {tour.rating && (
                      <div className="flex items-center gap-1.5 mb-2">
                        <Star size={14} className="text-amber-400 fill-amber-400" />
                        <span className="text-sm font-semibold text-foreground">{tour.rating}</span>
                        <span className="text-xs text-muted-foreground">({tour.reviewCount || 0} reviews)</span>
                      </div>
                    )}
                    <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors leading-snug">
                      {tour.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {tour.description || 'Skip-the-line access with expert guide'}
                    </p>
                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <div>
                        <span className="text-xs text-muted-foreground">From</span>
                        <p className="text-xl font-bold text-foreground">
                          {formatPrice(tour.price)}
                          <span className="text-xs font-normal text-muted-foreground"> /person</span>
                        </p>
                      </div>
                      <span className="text-xs font-semibold text-primary group-hover:underline">
                        View Details →
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* See all link */}
          <div className="text-center mt-10">
            <Link
              href="/search"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
            >
              See all tours <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Why Book With Us ───────────────────────────────────── */}
      <section className="py-20 bg-card border-y border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-xs font-semibold text-primary tracking-widest uppercase">Why ticketsinrome</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">Everything you need for a perfect trip</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {features.map((f, i) => {
              const icons = [Ticket, Shield, Clock, Ticket, MapPin, Shield];
              const Icon = icons[i];
              return (
                <div key={f.title} className="flex gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                    <Icon size={20} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{f.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Testimonials ───────────────────────────────────────── */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold text-primary tracking-widest uppercase">Reviews</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">What our travelers say</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { name: 'Sarah M.', text: 'Incredible experience! The skip-the-line tickets saved us hours. Our guide was knowledgeable and friendly.', rating: 5 },
              { name: 'James K.', text: 'Booked Vatican tickets last minute and got instant confirmation. Everything went smoothly. Highly recommend!', rating: 5 },
              { name: 'Elena R.', text: 'The Colosseum underground tour was the highlight of our trip. Easy booking, great communication.', rating: 5 },
            ].map(r => (
              <div key={r.name} className="bg-card border border-border rounded-xl p-6">
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-foreground leading-relaxed mb-4">&ldquo;{r.text}&rdquo;</p>
                <p className="text-xs font-semibold text-foreground">{r.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────── */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to explore Rome?
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-lg mx-auto">
            Skip the lines. See the sights. Book your tickets in 60 seconds.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/search"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-primary font-semibold rounded-lg hover:bg-blue-50 transition-colors text-sm"
            >
              Browse All Tours <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
