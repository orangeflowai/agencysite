import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Clock, Users, Check, Star, MapPin, Map as MapIcon, Info, XCircle, CheckCircle, Shield, Zap, Award, Calendar, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BookingWidget from '@/components/BookingWidget';
import TourHeroSlider from '@/components/TourHeroSlider';
import ScrollToBookingButton from '@/components/ScrollToBookingButton';
import TourCard from '@/components/TourCard';
import { getTour, getTours, urlFor } from '@/lib/dataAdapter';
import { PortableText } from '@portabletext/react';
import { Metadata } from 'next';

export const revalidate = 3600;

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const tour = await getTour(slug);

    if (!tour) return { title: 'Tour Not Found' };

    const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Roman Vatican Tour';
    const title = `${tour.title} | ${siteName}`;
    const description = tour.description 
        ? (typeof tour.description === 'string' ? tour.description.slice(0, 160) : 'Book your exclusive skip-the-line tour in Rome.')
        : `Experience ${tour.title} with expert guides.`;

    const imageUrl = tour.mainImage ? urlFor(tour.mainImage).width(1200).height(630).url() : '';

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630, alt: tour.title }] : [],
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: imageUrl ? [imageUrl] : [],
        },
    };
}

export async function generateStaticParams() {
    const tours = await getTours();
    return tours.map((tour) => ({ slug: tour.slug.current }));
}

function TrustBadge({ icon, label, sub }: { icon: React.ReactNode; label: string; sub: string }) {
    return (
        <div className="flex items-center gap-3 px-4 py-3 bg-card rounded-xl border border-border/20 shadow-sm">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                {icon}
            </div>
            <div>
                <p className="text-[11px] font-sans font-bold tracking-widest text-foreground leading-tight">{label}</p>
                <p className="text-[8px] text-muted-foreground leading-tight mt-0.5  tracking-tight">{sub}</p>
            </div>
        </div>
    );
}

export default async function TourPage({ params }: PageProps) {
    const { slug } = await params;
    const tour = await getTour(slug);
    const allTours = await getTours();

    if (!tour) notFound();

    // Get 3 related tours (same category or random, excluding current)
    const relatedTours = allTours
        .filter(t => t.slug?.current !== slug)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

    const sliderImages = [tour.mainImage, ...(tour.gallery || [])].filter(Boolean);
    if (sliderImages.length === 0) {
        sliderImages.push('https://images.unsplash.com/photo-1531572753322-ad063cecc140?auto=format&fit=crop&q=80');
    }

    return (
        <main className="min-h-screen bg-background selection:bg-primary selection:text-white">
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
                            <Link href="/" className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-[11px] font-sans font-bold tracking-widest transition-colors mb-2">
                                <ArrowLeft className="w-3 h-3" /> Back to Tours
                            </Link>
                            <span className="inline-block bg-primary text-white text-[11px] font-sans font-bold tracking-[0.15em] px-3 py-1 rounded-full shadow-lg">
                                {tour.category}
                            </span>
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white drop-shadow-lg leading-tight ">
                                {tour.title}
                            </h1>
                            <div className="flex flex-wrap items-center gap-4 text-white/90 text-[11px] font-sans font-bold tracking-widest">
                                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-primary" />{tour.duration}</span>
                                <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-primary" />{tour.groupSize || 'Small Group'}</span>
                                <span className="flex items-center gap-1.5 text-accent">
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
            <div className="bg-muted/30 border-b border-border/20">
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
                            <div className="flex items-center gap-3 mb-6">
                                <div className="h-px flex-1 bg-border/30"></div>
                                <h2 className="text-2xl font-serif font-bold text-foreground ">Tour Overview</h2>
                                <div className="h-px flex-1 bg-border/30"></div>
                            </div>
                            <div className="prose prose-base max-w-none text-muted-foreground leading-relaxed font-sans
                                prose-headings:text-foreground prose-headings:font-serif prose-headings:font-bold
                                prose-h2:text-xl prose-h3:text-lg
                                prose-strong:text-foreground prose-strong:font-bold
                                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                                prose-li:text-muted-foreground">
                                {typeof tour.description === 'string' ? (
                                    <p className="mb-4 text-base leading-relaxed">{tour.description}</p>
                                ) : (
                                    <PortableText
                                        value={tour.description}
                                        components={{
                                            types: {
                                                image: ({ value }) => {
                                                    if (!value?.asset?._ref && !value?.url) return null;
                                                    return (
                                                        <div className="my-6 relative w-full aspect-video rounded-xl overflow-hidden shadow-md border border-border/20">
                                                            <Image src={urlFor(value).width(800).url()} alt={value.alt || 'Tour image'} fill className="object-cover" />
                                                        </div>
                                                    );
                                                }
                                            },
                                            block: {
                                                normal: ({ children }) => <p className="mb-4 text-base leading-relaxed">{children}</p>,
                                                h2: ({ children }) => <h2 className="text-xl font-serif font-bold mt-6 mb-3 text-foreground ">{children}</h2>,
                                                h3: ({ children }) => <h3 className="text-lg font-serif font-semibold mt-5 mb-2 text-foreground ">{children}</h3>,
                                            },
                                            marks: {
                                                strong: ({ children }) => <strong className="font-bold text-foreground">{children}</strong>,
                                                link: ({ value, children }) => {
                                                    const target = (value?.href || '').startsWith('http') ? '_blank' : undefined;
                                                    return <a href={value?.href} target={target} rel={target === '_blank' ? 'noopener noreferrer' : undefined} className="text-primary hover:underline font-bold ">{children}</a>;
                                                }
                                            },
                                            list: {
                                                bullet: ({ children }) => <ul className="list-disc pl-5 mb-4 space-y-1.5">{children}</ul>,
                                                number: ({ children }) => <ol className="list-decimal pl-5 mb-4 space-y-1.5">{children}</ol>,
                                            }
                                        }}
                                    />
                                )}
                            </div>
                        </section>

                        {/* Highlights */}
                        {tour.highlights && tour.highlights.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-serif font-bold text-foreground mb-6 ">Highlights</h2>
                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {tour.highlights.map((feature: any, i: number) => (
                                        <li key={i} className="flex items-start gap-3 p-4 bg-card rounded-xl border border-border/20 shadow-sm group hover:border-primary/30 transition-colors">
                                            <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-primary transition-colors">
                                                <Check className="w-3 h-3 text-primary group-hover:text-white" />
                                            </span>
                                            <span className="text-sm text-foreground font-medium leading-snug font-sans">{typeof feature === 'object' ? feature.item : feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        {/* Itinerary */}
                        {tour.itinerary && tour.itinerary.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-serif font-bold text-foreground mb-6 ">Itinerary</h2>
                                <div className="relative pl-6 border-l border-border/30 space-y-8">
                                    {tour.itinerary.map((stop, index) => (
                                        <div key={index} className="relative">
                                            <span className="absolute -left-[28.5px] top-1 w-3 h-3 rounded-full bg-primary border-2 border-background shadow-md shadow-primary/20" />
                                            <p className="text-[11px] font-sans font-bold tracking-[0.15em] text-primary mb-1">Stop {index + 1}</p>
                                            <h3 className="text-lg font-serif font-bold text-foreground mb-1 ">{stop.title}</h3>
                                            {stop.duration && <p className="text-[11px] font-sans font-bold text-muted-foreground mb-2 tracking-widest">{stop.duration}</p>}
                                            <p className="text-sm text-muted-foreground leading-relaxed font-sans">{stop.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Includes / Excludes */}
                        {(tour.includes?.length || tour.excludes?.length) ? (
                            <section className="grid sm:grid-cols-2 gap-8">
                                {tour.includes && tour.includes.length > 0 && (
                                    <div className="bg-card rounded-2xl border border-border/20 p-6 shadow-sm">
                                        <h3 className="text-lg font-serif font-bold text-foreground mb-4 flex items-center gap-2 ">
                                            <CheckCircle className="w-5 h-5 text-primary shrink-0" />
                                            What&apos;s Included
                                        </h3>
                                        <ul className="space-y-3">
                                            {tour.includes.map((item: any, i: number) => (
                                                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground font-sans">
                                                    <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />{typeof item === 'object' ? item.item : item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {tour.excludes && tour.excludes.length > 0 && (
                                    <div className="bg-muted/20 rounded-2xl border border-border/10 p-6 shadow-sm">
                                        <h3 className="text-lg font-serif font-bold text-foreground mb-4 flex items-center gap-2  opacity-80">
                                            <XCircle className="w-5 h-5 text-destructive shrink-0" />
                                            Not Included
                                        </h3>
                                        <ul className="space-y-3">
                                            {tour.excludes.map((item: any, i: number) => (
                                                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground font-sans opacity-70">
                                                    <XCircle className="w-4 h-4 text-destructive/40 shrink-0 mt-0.5" />{typeof item === 'object' ? item.item : item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </section>
                        ) : null}

                        {/* Meeting Point + Important Info */}
                        {(tour.meetingPoint || (tour.importantInfo && tour.importantInfo.length > 0)) && (
                            <section className="bg-muted/40 rounded-2xl border border-border/20 p-8 space-y-6 shadow-sm">
                                {tour.meetingPoint && (
                                    <div>
                                        <h3 className="text-lg font-serif font-bold text-foreground mb-3 flex items-center gap-2 ">
                                            <MapPin className="w-5 h-5 text-primary shrink-0" />
                                            Meeting Point
                                        </h3>
                                        <p className="text-sm text-muted-foreground mb-4 font-sans">{tour.meetingPoint}</p>
                                        <a
                                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(tour.meetingPoint + ' Rome')}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 text-[8px] font-sans font-bold text-primary  tracking-[0.2em] hover:opacity-80 transition-opacity"
                                        >
                                            <MapIcon className="w-4 h-4" />
                                            View on Google Maps
                                        </a>
                                    </div>
                                )}
                                {tour.importantInfo && tour.importantInfo.length > 0 && (
                                    <div className="pt-6 border-t border-border/20">
                                        <h3 className="text-lg font-serif font-bold text-foreground mb-4 flex items-center gap-2 ">
                                            <Info className="w-5 h-5 text-primary shrink-0" />
                                            Important Information
                                        </h3>
                                        <ul className="space-y-2.5">
                                            {tour.importantInfo.map((info: any, i: number) => (
                                                <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground font-sans">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2" />
                                                    {typeof info === 'object' ? info.item : info}
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
                        <div className="sticky top-24" id="booking-widget">
                            <BookingWidget tour={tour} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Related Tours */}
            {relatedTours.length > 0 && (
                <section className="bg-muted/30 border-t border-border/20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                        <div className="text-center mb-10">
                            <h2 className="text-2xl font-serif font-bold text-foreground">You May Also Like</h2>
                            <p className="text-muted-foreground mt-2">Explore more exclusive experiences</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {relatedTours.map((relatedTour) => (
                                <TourCard key={relatedTour._id} tour={relatedTour} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <Footer />

            {/* Mobile Sticky Booking Bar */}
            <ScrollToBookingButton price={tour.price} slug={tour.slug?.current || slug} />
        </main>
    );
}
