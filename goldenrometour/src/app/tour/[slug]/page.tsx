import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BookingPanel from '@/components/BookingPanel';
import TourCardCompact from '@/components/TourCardCompact';
import { getTour, getTours } from '@/lib/dataAdapter';
import { Clock, Users, Star, MapPin, CheckCircle, AlertCircle } from 'lucide-react';

export const revalidate = 300;

export async function generateStaticParams() {
  const tours = await getTours();
  return tours.map((t: any) => ({ slug: t.slug?.current || '' })).filter((x: any) => x.slug);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tour = await getTour(slug);
  if (!tour) return { title: 'Tour Not Found' };
  const title = tour.title || 'Vatican Tour';
  const desc = typeof tour.description === 'string' ? tour.description : '';
  return {
    title: `${title} | Golden Rome Tour`,
    description: desc.slice(0, 160),
    openGraph: {
      title,
      description: desc.slice(0, 160),
      images: tour.mainImage?.asset?.url ? [{ url: tour.mainImage.asset.url }] : [],
    },
  };
}

export default async function TourPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tour = await getTour(slug);
  if (!tour) notFound();

  const allTours = await getTours();
  const otherTour = allTours.find((t: any) => t._id !== tour._id);

  const description = typeof tour.description === 'string'
    ? tour.description
    : tour.description?.[0]?.children?.[0]?.text || '';

  const imageUrl = tour.mainImage?.asset?.url || '/vatican-museums.jpg';
  const highlights: string[] = tour.highlights || [];
  const includes: string[] = tour.includes || [];
  const excludes: string[] = (tour as any).excludes || [];
  const importantInfo: string[] = (tour as any).importantInfo || [];
  const guestTypes = (tour as any).guestTypes || [
    { name: 'Adult', price: tour.price || 65, description: 'Age 18+' },
    { name: 'Child', price: Math.round((tour.price || 65) * 0.7), description: 'Age 6–17' },
  ];

  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Hero Image */}
      <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <img
          src={imageUrl}
          alt={tour.title || ''}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        {/* Title bar */}
        <div className="bg-card rounded-2xl shadow-lg border border-border p-6 md:p-8 mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            {(tour as any).badge && (
              <span className="bg-accent/20 text-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {(tour as any).badge}
              </span>
            )}
            <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
              {tour.category || 'Vatican'}
            </span>
          </div>
          <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            {tour.title}
          </h1>
          <div className="flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5 font-medium text-foreground">
              <Clock className="w-4 h-4 text-primary" /> {tour.duration}
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-primary" /> {tour.groupSize || 'Small Group'}
            </span>
            <span className="flex items-center gap-1.5">
              <Star className="w-4 h-4 fill-accent text-accent" />
              {tour.rating || '4.9'} ({tour.reviewCount || 0} reviews)
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-primary" />
              {(tour as any).meetingPoint || 'Via Germanico, 40, 00192 Roma'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Left: Description + Details */}
          <div className="lg:col-span-2 space-y-10">
            {/* Description */}
            <section>
              <h2 className="font-heading text-2xl font-bold text-foreground mb-4">Tour Overview</h2>
              <div className="prose prose-lg prose-p:text-muted-foreground prose-p:leading-relaxed max-w-none">
                <p>{description}</p>
              </div>
            </section>

            {/* Highlights */}
            {highlights.length > 0 && (
              <section>
                <h2 className="font-heading text-2xl font-bold text-foreground mb-4">Highlights</h2>
                <ul className="space-y-3">
                  {highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{h}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* What's Included */}
            {includes.length > 0 && (
              <section>
                <h2 className="font-heading text-2xl font-bold text-foreground mb-4">What&apos;s Included</h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {includes.map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
                      <span className="text-muted-foreground text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* What's Excluded */}
            {excludes.length > 0 && (
              <section>
                <h2 className="font-heading text-2xl font-bold text-foreground mb-4">Not Included</h2>
                <ul className="space-y-2">
                  {excludes.map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-muted-foreground text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40" />
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Important Info */}
            {importantInfo.length > 0 && (
              <section>
                <h2 className="font-heading text-2xl font-bold text-foreground mb-4">Important Information</h2>
                <div className="bg-secondary rounded-xl p-5 space-y-2">
                  {importantInfo.map((info, i) => (
                    <p key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <AlertCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      {info}
                    </p>
                  ))}
                </div>
              </section>
            )}

            {/* Meeting Point */}
            {(tour as any).meetingPoint && (
              <section>
                <h2 className="font-heading text-2xl font-bold text-foreground mb-4">Meeting Point</h2>
                <div className="bg-card border border-border rounded-xl p-5 flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground">{(tour as any).meetingPoint}</p>
                    <p className="text-sm text-muted-foreground mt-1">Please arrive 25 minutes before your scheduled start time.</p>
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* Right: Booking Panel */}
          <div className="lg:col-span-1">
            <BookingPanel
              tourId={tour._id}
              tourTitle={tour.title}
              tourSlug={slug}
              basePrice={tour.price || 65}
              guestTypes={guestTypes}
            />
          </div>
        </div>

        {/* Other Tour */}
        {otherTour && (
          <section className="pb-16 md:pb-24">
            <h2 className="font-heading text-2xl font-bold text-foreground text-center mb-8">
              Also Available
            </h2>
            <div className="max-w-md mx-auto">
              <TourCardCompact tour={otherTour} />
            </div>
          </section>
        )}
      </div>

      <Footer />
    </main>
  );
}
