import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Clock, Users, Check, Star, MapPin, Map as MapIcon, Info, XCircle, CheckCircle, Shield, Zap, Award, Calendar, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BookingWidget from '@/components/BookingWidget';
import TourHeroSlider from '@/components/TourHeroSlider';
import { getTour, getTours } from '@/lib/sanityService';
import { urlFor } from '@/sanity/lib/image';
import { PortableText } from '@portabletext/react';

export const revalidate = 3600;

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    const tours = await getTours();
    return tours.map((tour) => ({ slug: tour.slug.current }));
}

function TrustBadge({ icon, label, sub }: { icon: React.ReactNode; label: string; sub: string }) {
    return (
        <div className="flex items-center gap-3 px-4 py-3 bg-card rounded-xl border border-border shadow-sm">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                {icon}
            </div>
            <div>
                <p className="text-xs font-bold text-foreground leading-tight">{label}</p>
                <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">{sub}</p>
            </div>
        </div>
    );
}

export default async function TourPage({ params }: PageProps) {
    const { slug } = await params;
    const tour = await getTour(slug);

    if (!tour) notFound();

    const sliderImages = [tour.mainImage, ...(tour.gallery || [])].filter(Boolean);
    if (sliderImages.length === 0) {
        sliderImages.push('https://images.unsplash.com/photo-1531572753322-ad063cecc140?auto=format&fit=crop&q=80');
    }

    return (
        <main className="min-h-screen bg-background">
            <Navbar />

            {/* Hero */}
            <div className="relative">
                <TourHeroSlider
                    images={sliderImages}
                    title={tour.title}
                    category={tour.category}
                    duration={tour.duration}
                    groupSize={tour.groupSize}
                    rating={tour.rating}
                    reviewCount={tour.reviewCount}
                />
                <div className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 md:pb-12">
                        <div className="max-w-3xl pointer-events-auto space-y-3">
                            <Link href="/" className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-xs font-medium transition-colors mb-2">
                                <ArrowLeft className="w-3.5 h-3.5" /> Back to Tours
                            </Link>
                            <span className="inline-block bg-primary text-primary-foreground text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                                {tour.category}
                            </span>
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white drop-shadow-lg leading-tight">
                                {tour.title}
                            </h1>
                            <div className="flex flex-wrap items-center gap-4 text-white/90 text-sm font-medium">
                                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{tour.duration}</span>
                                <span className="flex items-center gap-1.5"><Users className="w-4 h-4" />{tour.groupSize || 'Small Group'}</span>
                                <span className="flex items-center gap-1.5 text-amber-400">
                                    <Star className="w-4 h-4 fill-current" />
                                    {tour.rating || '5.0'}
                                    <span className="text-white/70">({tour.reviewCount || 100} reviews)</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Trust strip */}
            <div className="bg-muted border-b border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <TrustBadge icon={<Zap className="w-4 h-4" />} label="Skip the Line" sub="No waiting in queues" />
                        <TrustBadge icon={<Shield className="w-4 h-4" />} label="Free Cancellation" sub="Up to 24h before" />
                        <TrustBadge icon={<Award className="w-4 h-4" />} label="Expert Guides" sub="Licensed & certified" />
                        <TrustBadge icon={<Calendar className="w-4 h-4" />} label="Instant Confirmation" sub="Booking confirmed now" />
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    <div className="lg:col-span-2 space-y-10">

                        {/* Overview */}
                        <section>
                            <h2 className="text-2xl font-bold text-foreground mb-4">Tour Overview</h2>
                            <div className="prose prose-base max-w-none text-muted-foreground leading-relaxed
                                prose-headings:text-foreground prose-headings:font-bold
                                prose-h2:text-xl prose-h3:text-lg
                                prose-strong:text-foreground prose-strong:font-semibold
                                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                                prose-li:text-muted-foreground">
                                <PortableText
                                    value={tour.description}
                                    components={{
                                        types: {
                                            image: ({ value }) => {
                                                if (!value?.asset?._ref) return null;
                                                return (
                                                    <div className="my-6 relative w-full aspect-video rounded-xl overflow-hidden shadow-md">
                                                        <Image src={urlFor(value).width(800).fit('max').url()} alt={value.alt || 'Tour image'} fill className="object-cover" />
                                                    </div>
                                                );
                                            }
                                        },
                                        block: {
                                            normal: ({ children }) => <p className="mb-4 text-base leading-relaxed">{children}</p>,
                                            h2: ({ children }) => <h2 className="text-xl font-bold mt-6 mb-3 text-foreground">{children}</h2>,
                                            h3: ({ children }) => <h3 className="text-lg font-semibold mt-5 mb-2 text-foreground">{children}</h3>,
                                        },
                                        marks: {
                                            strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
                                            link: ({ value, children }) => {
                                                const target = (value?.href || '').startsWith('http') ? '_blank' : undefined;
                                                return <a href={value?.href} target={target} rel={target === '_blank' ? 'noopener noreferrer' : undefined} className="text-primary hover:underline font-medium">{children}</a>;
                                            }
                                        },
                                        list: {
                                            bullet: ({ children }) => <ul className="list-disc pl-5 mb-4 space-y-1.5">{children}</ul>,
                                            number: ({ children }) => <ol className="list-decimal pl-5 mb-4 space-y-1.5">{children}</ol>,
                                        }
                                    }}
                                />
                            </div>
                        </section>

                        {/* Highlights */}
                        {tour.highlights && tour.highlights.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-bold text-foreground mb-4">Highlights</h2>
                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {tour.highlights.map((feature, i) => (
                                        <li key={i} className="flex items-start gap-3 p-4 bg-card rounded-xl border border-border">
                                            <span className="w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center shrink-0 mt-0.5">
                                                <Check className="w-3 h-3 text-primary" />
                                            </span>
                                            <span className="text-sm text-foreground font-medium leading-snug">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        {/* Itinerary */}
                        {tour.itinerary && tour.itinerary.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-bold text-foreground mb-4">Itinerary</h2>
                                <div className="relative pl-6 border-l-2 border-border space-y-6">
                                    {tour.itinerary.map((stop, index) => (
                                        <div key={index} className="relative">
                                            <span className="absolute -left-[29px] top-1 w-4 h-4 rounded-full bg-primary border-2 border-background shadow-sm" />
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">Stop {index + 1}</p>
                                            <h3 className="text-base font-bold text-foreground mb-1">{stop.title}</h3>
                                            {stop.duration && <p className="text-xs text-muted-foreground mb-1.5">{stop.duration}</p>}
                                            <p className="text-sm text-muted-foreground leading-relaxed">{stop.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Includes / Excludes */}
                        {(tour.includes?.length || tour.excludes?.length) ? (
                            <section className="grid sm:grid-cols-2 gap-6">
                                {tour.includes && tour.includes.length > 0 && (
                                    <div className="bg-card rounded-xl border border-border p-5">
                                        <h3 className="text-base font-bold text-foreground mb-3 flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                                            What's Included
                                        </h3>
                                        <ul className="space-y-2">
                                            {tour.includes.map((item, i) => (
                                                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                                    <Check className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />{item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {tour.excludes && tour.excludes.length > 0 && (
                                    <div className="bg-card rounded-xl border border-border p-5">
                                        <h3 className="text-base font-bold text-foreground mb-3 flex items-center gap-2">
                                            <XCircle className="w-4 h-4 text-destructive shrink-0" />
                                            Not Included
                                        </h3>
                                        <ul className="space-y-2">
                                            {tour.excludes.map((item, i) => (
                                                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                                    <XCircle className="w-3.5 h-3.5 text-destructive/60 shrink-0 mt-0.5" />{item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </section>
                        ) : null}

                        {/* Meeting Point + Important Info */}
                        {(tour.meetingPoint || (tour.importantInfo && tour.importantInfo.length > 0)) && (
                            <section className="bg-muted rounded-xl border border-border p-6 space-y-5">
                                {tour.meetingPoint && (
                                    <div>
                                        <h3 className="text-base font-bold text-foreground mb-2 flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-primary shrink-0" />
                                            Meeting Point
                                        </h3>
                                        <p className="text-sm text-muted-foreground mb-3">{tour.meetingPoint}</p>
                                        <a
                                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(tour.meetingPoint + ' Rome')}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
                                        >
                                            <MapIcon className="w-3.5 h-3.5" />
                                            View on Google Maps
                                        </a>
                                    </div>
                                )}
                                {tour.importantInfo && tour.importantInfo.length > 0 && (
                                    <div>
                                        <h3 className="text-base font-bold text-foreground mb-2 flex items-center gap-2">
                                            <Info className="w-4 h-4 text-primary shrink-0" />
                                            Important Information
                                        </h3>
                                        <ul className="space-y-1.5">
                                            {tour.importantInfo.map((info, i) => (
                                                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                                                    {info}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </section>
                        )}
                    </div>

                    {/* Sticky booking widget */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            <BookingWidget tour={tour} />
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
