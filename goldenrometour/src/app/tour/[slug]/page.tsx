import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Clock, Users, Calendar, Check, Star, MapPin, Map as MapIcon, Info, XCircle, CheckCircle } from 'lucide-react';
import VaticanHeader from '@/components/vatican/header';
import VaticanFooter from '@/components/vatican/footer';
import VaticanTourHeroFull from '@/components/vatican/tour-hero-full';
import BookingWidget from '@/components/BookingWidget';
import { getTour, getTours, urlFor } from '@/lib/dataAdapter';
import { PortableText } from '@portabletext/react';
import { Metadata } from 'next';

// Revalidate every 5 minutes for faster updates
export const revalidate = 300;

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const tour = await getTour(slug);

    if (!tour) return { title: 'Tour Not Found' };

    const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Vatican Archives';
    const title = `${tour.title} | ${siteName}`;
    const description = tour.description 
        ? (typeof tour.description === 'string' ? tour.description.slice(0, 160) : 'Book your exclusive Vatican skip-the-line tour with art historians.')
        : `Experience ${tour.title} with expert Vatican guides.`;

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

// Pre-build all tour pages at deploy time
export async function generateStaticParams() {
    const tours = await getTours();
    return tours.map((tour) => ({ slug: tour.slug.current }));
}

export default async function TourPage({ params }: PageProps) {
    const { slug } = await params;
    
    console.log(`[TourPage] Fetching tour with slug: ${slug}`)
    const tour = await getTour(slug);

    if (!tour) {
        console.error(`[TourPage] Tour not found for slug: ${slug}`)
        notFound();
    }

    // Vatican-only validation for goldenrometour
    const siteId = process.env.NEXT_PUBLIC_SITE_ID;
    console.log(`[TourPage] Site ID: ${siteId}, Tour category: ${tour.category}`)
    
    if (siteId === 'goldenrometour' && tour.category && tour.category !== 'vatican') {
        console.warn(`[TourPage] Non-Vatican tour on goldenrometour: ${tour.title} (${tour.category})`)
        notFound();
    }

    const sliderImages = [tour.mainImage].concat(tour.gallery || []).filter(Boolean);

    // If no images at all, fallback
    const fallbackImage = 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=80';
    
    // JSON-LD Schema for SEO
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'TouristTrip',
        'name': tour.title,
        'description': typeof tour.description === 'string' ? tour.description : 'Expert guided Vatican tour with art historians',
        'image': sliderImages.length > 0 ? sliderImages.map(img => urlFor(img).url()).filter(Boolean) : [fallbackImage],
        'provider': {
            '@type': 'Organization',
            'name': process.env.NEXT_PUBLIC_SITE_NAME || 'Vatican Archives',
            'url': process.env.NEXT_PUBLIC_SITE_URL
        },
        'offers': {
            '@type': 'Offer',
            'price': tour.price,
            'priceCurrency': 'EUR',
            'availability': 'https://schema.org/InStock'
        },
        'aggregateRating': {
            '@type': 'AggregateRating',
            'ratingValue': tour.rating || '5.0',
            'reviewCount': tour.reviewCount || '100'
        }
    };

    return (
        <main className="min-h-screen bg-background">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <VaticanHeader />

            {/* Immersive Full Screen Intro */}
            <VaticanTourHeroFull
                title={tour.title}
                mainImage={tour.mainImage || fallbackImage}
                category={tour.category}
                duration={tour.duration}
                groupSize={tour.groupSize}
                rating={tour.rating}
                reviewCount={tour.reviewCount}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 grid grid-cols-1 lg:grid-cols-3 gap-16">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-16">

                    {/* Overview / Description */}
                    <section className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-foreground prose-p:font-sans prose-p:text-muted-foreground">
                        <div className="mb-10">
                            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent mb-2">Exhibition Overview</p>
                            <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground border-b border-border pb-6 leading-tight">Historical <span className="italic">Context</span></h2>
                        </div>
                        
                        {typeof tour.description === 'string' ? (
                            <p className="mb-6 text-lg leading-relaxed">{tour.description}</p>
                        ) : (
                            <PortableText
                                value={tour.description}
                                components={{
                                    types: {
                                        image: ({ value }) => {
                                            if (!value?.asset?._ref) return null;
                                            return (
                                                <div className="my-12 relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl border border-border">
                                                    <Image
                                                        src={urlFor(value).width(800).fit('max').url()}
                                                        alt={value.alt || 'Tour image'}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                            );
                                        }
                                    },
                                    block: {
                                        normal: ({ children }) => <p className="mb-8 text-lg leading-relaxed">{children}</p>,
                                        h2: ({ children }) => <h2 className="text-3xl font-serif font-bold mt-12 mb-6">{children}</h2>,
                                        h3: ({ children }) => <h3 className="text-2xl font-serif font-bold mt-8 mb-4">{children}</h3>,
                                    },
                                    marks: {
                                        strong: ({ children }) => <strong className="font-bold text-foreground">{children}</strong>,
                                        link: ({ value, children }) => {
                                            const target = (value?.href || '').startsWith('http') ? '_blank' : undefined
                                            return (
                                                <a href={value?.href} target={target} rel={target === '_blank' ? 'noindex nofollow' : undefined} className="text-primary underline decoration-primary/30 hover:decoration-primary transition-all font-bold">
                                                    {children}
                                                </a>
                                            )
                                        }
                                    },
                                    list: {
                                        bullet: ({ children }) => <ul className="list-disc pl-6 mb-8 space-y-3">{children}</ul>,
                                        number: ({ children }) => <ol className="list-decimal pl-6 mb-8 space-y-3">{children}</ol>,
                                    }
                                }}
                            />
                        )}
                    </section>

                    {/* Highlights */}
                    {tour.highlights && tour.highlights.length > 0 && (
                        <section>
                            <div className="mb-10">
                                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent mb-2">Curated Experiences</p>
                                <h2 className="text-3xl font-serif font-bold text-foreground uppercase tracking-widest">Highlights</h2>
                            </div>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {tour.highlights.map((feature: any, i: number) => (
                                    <li key={i} className="flex items-start space-x-4 p-8 bg-card rounded-3xl border border-border transition-all hover:border-accent/30 group">
                                        <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-accent group-hover:text-white transition-colors">
                                            <Check className="w-4 h-4" />
                                        </div>
                                        <span className="text-foreground font-sans font-bold uppercase tracking-[0.15em] text-[11px] leading-relaxed">{typeof feature === 'object' ? feature.item : feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {/* meetingPoint & Preparation */}
                    <section className="bg-secondary/20 rounded-[3rem] p-12 md:p-16 space-y-12 border border-border relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl" />
                        
                        {tour.meetingPoint && (
                            <div className="relative z-10">
                                <h3 className="font-serif text-2xl font-bold text-foreground mb-6 flex items-center uppercase tracking-widest">
                                    <MapPin className="w-6 h-6 mr-4 text-accent" /> Rendezvous Point
                                </h3>
                                <p className="text-muted-foreground font-sans text-lg leading-relaxed mb-8">{tour.meetingPoint}</p>
                                <a
                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(tour.meetingPoint + ' Rome')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center bg-primary text-primary-foreground px-10 py-5 font-sans font-bold uppercase tracking-widest text-[10px] rounded-full hover:opacity-90 transition-all shadow-2xl shadow-primary/20"
                                >
                                    <MapIcon className="w-4 h-4 mr-3" /> View Geographic Coordinates
                                </a>
                            </div>
                        )}

                        {tour.importantInfo && tour.importantInfo.length > 0 && (
                            <div className="relative z-10 pt-8 border-t border-border/50">
                                <h3 className="font-serif text-2xl font-bold text-foreground mb-6 flex items-center uppercase tracking-widest">
                                    <Info className="w-6 h-6 mr-4 text-accent" /> Entry Protocol
                                </h3>
                                <ul className="space-y-4 font-sans text-muted-foreground">
                                    {tour.importantInfo.map((info: any, i: number) => (
                                        <li key={i} className="flex gap-4 items-start">
                                            <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                                            <span className="text-sm font-medium tracking-wide leading-relaxed">{typeof info === 'object' ? info.item : info}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </section>
                </div>

                {/* Sidebar Booking Widget */}
                <div className="lg:col-span-1">
                    <div className="sticky top-32">
                        <div className="mb-6 p-4 bg-accent/10 border border-accent/20 rounded-2xl">
                           <p className="text-[10px] font-bold uppercase tracking-widest text-accent text-center">Protocol: Secure Booking</p>
                        </div>
                        <BookingWidget tour={tour} />
                    </div>
                </div>
            </div>

            <VaticanFooter />
        </main>
    );
}
