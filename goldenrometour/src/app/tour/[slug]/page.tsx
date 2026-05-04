
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Clock, Users, Calendar, Check, Star, MapPin, Map as MapIcon, Info, XCircle, CheckCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BookingWidget from '@/components/BookingWidget';
import TourHeroSlider from '@/components/TourHeroSlider';
import { getTour, getTours, urlFor } from '@/lib/dataAdapter';
import { PortableText } from '@portabletext/react';
import { Metadata } from 'next';

// Revalidate every hour
export const revalidate = 3600;

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const tour = await getTour(slug);

    if (!tour) return { title: 'Tour Not Found' };

    const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Golden Rome Tour';
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

// Pre-build all tour pages at deploy time
export async function generateStaticParams() {
    const tours = await getTours();
    return tours.map((tour) => ({ slug: tour.slug.current }));
}

export default async function TourPage({ params }: PageProps) {
    const { slug } = await params;
    const tour = await getTour(slug);

    if (!tour) {
        notFound();
    }

    const sliderImages = [tour.mainImage].concat(tour.gallery || []).filter(Boolean);

    // If no images at all, fallback
    const fallbackImage = 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=80';
    if (sliderImages.length === 0) {
        sliderImages.push(fallbackImage);
    }

    // JSON-LD Schema for SEO
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'TouristTrip',
        'name': tour.title,
        'description': typeof tour.description === 'string' ? tour.description : 'Expert guided tour in Rome',
        'image': sliderImages.map(img => urlFor(img).url()),
        'provider': {
            '@type': 'Organization',
            'name': process.env.NEXT_PUBLIC_SITE_NAME || 'Golden Rome Tour',
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
        <main className="min-h-screen bg-background text-foreground font-body selection:bg-primary selection:text-primary-foreground">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Navbar />

            {/* Tour Hero Slider */}
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

                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 container mx-auto pointer-events-none z-10">
                    <div className="max-w-4xl space-y-4 pointer-events-auto">
                        <span className="bg-secondary text-white px-4 py-1.5 font-heading font-bold uppercase tracking-tight text-[10px]">
                            {tour.category}
                        </span>
                        <h1 className="text-4xl md:text-5xl lg:text-7xl font-heading text-white drop-shadow-2xl leading-[0.9]">
                            {tour.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-6 text-white/90 font-heading font-bold uppercase tracking-tight text-[10px]">
                            <div className="flex items-center"><Clock className="w-5 h-5 mr-2 text-primary" /> {tour.duration}</div>
                            <div className="flex items-center"><Users className="w-5 h-5 mr-2 text-primary" /> {tour.groupSize || 'Small Group'}</div>
                            <div className="flex items-center text-primary">
                                <Star className="w-5 h-5 mr-2 fill-current" />
                                {tour.rating || '5.0'} ({tour.reviewCount || 100} REVIEWS)
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-12">

                    {/* Overview / Description */}
                    <section className="prose prose-lg max-w-none prose-headings:font-heading prose-headings:text-secondary prose-p:font-body prose-p:text-secondary/80">
                        <h2 className="text-3xl font-heading text-secondary mb-6 border-b border-primary/10 pb-4">Tour Overview</h2>
                        {typeof tour.description === 'string' ? (
                            <p className="mb-6">{tour.description}</p>
                        ) : (
                            <PortableText
                                value={tour.description}
                                components={{
                                    types: {
                                        image: ({ value }) => {
                                            if (!value?.asset?._ref) return null;
                                            return (
                                                <div className="my-12 relative w-full aspect-video rounded-[2rem] overflow-hidden shadow-2xl border border-primary/10">
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
                                        normal: ({ children }) => <p className="mb-6">{children}</p>,
                                        h2: ({ children }) => <h2 className="text-2xl font-heading mt-8 mb-4">{children}</h2>,
                                        h3: ({ children }) => <h3 className="text-xl font-heading mt-6 mb-3">{children}</h3>,
                                    },
                                    marks: {
                                        strong: ({ children }) => <strong className="font-bold text-secondary">{children}</strong>,
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
                                        bullet: ({ children }) => <ul className="list-disc pl-6 mb-6 space-y-2">{children}</ul>,
                                        number: ({ children }) => <ol className="list-decimal pl-6 mb-6 space-y-2">{children}</ol>,
                                    }
                                }}
                            />
                        )}
                    </section>

                    {/* Highlights */}
                    {tour.highlights && tour.highlights.length > 0 && (
                        <section>
                            <h2 className="text-2xl font-heading text-secondary mb-6 uppercase tracking-tight">Highlights</h2>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {tour.highlights.map((feature: any, i: number) => (
                                    <li key={i} className="flex items-start space-x-3 p-6 bg-white rounded-2xl shadow-sm border border-primary/10 transition-transform hover:-translate-y-1">
                                        <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                        <span className="text-secondary font-bold font-heading uppercase tracking-tight text-[10px]">{typeof feature === 'object' ? feature.item : feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {/* Itinerary */}
                    {tour.itinerary && tour.itinerary.length > 0 && (
                        <section>
                            <h2 className="text-2xl font-heading text-secondary mb-6 uppercase tracking-tight">Itinerary</h2>
                            <div className="pl-6 border-l-2 border-primary/20 space-y-10">
                                {tour.itinerary.map((stop: any, index: number) => (
                                    <div key={index} className="relative">
                                        <div className="absolute -left-[33px] top-0 w-4 h-4 bg-primary rounded-full border-4 border-background" />
                                        <h3 className="text-lg font-heading text-secondary uppercase tracking-tight">{stop.title}</h3>
                                        <p className="text-[10px] font-heading font-bold text-primary mb-3 tracking-tight">{stop.duration}</p>
                                        <p className="text-secondary/70 leading-relaxed font-body">{stop.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Inclusions & Exclusions */}
                    <section className="grid md:grid-cols-2 gap-8 py-8 border-y border-primary/10">
                        {tour.includes && tour.includes.length > 0 && (
                            <div>
                                <h3 className="text-lg font-heading text-secondary mb-6 flex items-center uppercase tracking-tight">
                                    <CheckCircle className="w-5 h-5 text-primary mr-3" /> Inclusions
                                </h3>
                                <ul className="space-y-4">
                                    {tour.includes.map((item: any, i: number) => (
                                        <li key={i} className="flex items-start text-secondary/80 text-sm font-body">
                                            <Check className="w-4 h-4 text-primary mr-3 mt-0.5 shrink-0" />
                                            {typeof item === 'object' ? item.item : item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {tour.excludes && tour.excludes.length > 0 && (
                            <div>
                                <h3 className="text-lg font-heading text-secondary mb-6 flex items-center uppercase tracking-tight">
                                    <XCircle className="w-5 h-5 text-accent mr-3" /> Exclusions
                                </h3>
                                <ul className="space-y-4">
                                    {tour.excludes.map((item: any, i: number) => (
                                        <li key={i} className="flex items-start text-secondary/50 text-sm font-body">
                                            <XCircle className="w-4 h-4 text-accent/40 mr-3 mt-0.5 shrink-0" />
                                            {typeof item === 'object' ? item.item : item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </section>

                    {/* Meeting Point & Important Info */}
                    <section className="bg-background text-secondary rounded-[2rem] p-10 space-y-10 shadow-2xl">
                        {tour.meetingPoint && (
                            <div>
                                <h3 className="font-heading text-xl text-primary mb-4 flex items-center uppercase tracking-tight">
                                    <MapPin className="w-6 h-6 mr-3" /> Meeting Point
                                </h3>
                                <p className="text-secondary font-body text-lg leading-relaxed mb-6">{tour.meetingPoint}</p>
                                <a
                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(tour.meetingPoint + ' Rome')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center bg-primary text-secondary px-8 py-4 font-heading font-bold uppercase tracking-tight text-[10px] hover:bg-white transition-all shadow-xl"
                                >
                                    <MapIcon className="w-4 h-4 mr-2" /> View on Dispatch Map
                                </a>
                            </div>
                        )}

                        {tour.importantInfo && tour.importantInfo.length > 0 && (
                            <div>
                                <h3 className="font-heading text-xl text-primary mb-4 flex items-center uppercase tracking-tight">
                                    <Info className="w-6 h-6 mr-3" /> Preparation Protocol
                                </h3>
                                <ul className="space-y-3 font-body text-secondary/70">
                                    {tour.importantInfo.map((info: any, i: number) => (
                                        <li key={i} className="flex gap-3">
                                            <span className="text-primary">•</span>
                                            {typeof info === 'object' ? info.item : info}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </section>
                </div>

                {/* Sidebar Booking Widget */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24">
                        <BookingWidget tour={tour} />
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
