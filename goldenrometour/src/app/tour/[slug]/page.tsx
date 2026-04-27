
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
        <main className="min-h-screen bg-cream selection:bg-olive selection:text-white">
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
                        <span className="bg-olive text-white px-4 py-1.5 rounded-full text-sm font-semibold  tracking-wide">
                            {tour.category}
                        </span>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white shadow-sm drop-shadow-md">
                            {tour.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-6 text-white/90 text-sm md:text-base font-medium">
                            <div className="flex items-center"><Clock className="w-5 h-5 mr-2" /> {tour.duration}</div>
                            <div className="flex items-center"><Users className="w-5 h-5 mr-2" /> {tour.groupSize || 'Small Group'}</div>
                            <div className="flex items-center text-yellow-400">
                                <Star className="w-5 h-5 mr-2 fill-current" />
                                {tour.rating || '5.0'} ({tour.reviewCount || 100} reviews)
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-12">

                    {/* Overview / Description */}
                    <section className="prose prose-lg prose-emerald prose-headings:font-serif prose-headings:font-bold prose-headings:text-emerald-950 prose-p:text-foreground prose-p:leading-loose prose-li:text-foreground max-w-none">
                        <h2 className="text-3xl font-serif font-bold text-emerald-900 mb-6">Tour Overview</h2>
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
                                                <div className="my-8 relative w-full aspect-video rounded-xl overflow-hidden shadow-lg">
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
                                        h2: ({ children }) => <h2 className="text-2xl font-bold mt-8 mb-4">{children}</h2>,
                                        h3: ({ children }) => <h3 className="text-xl font-bold mt-6 mb-3">{children}</h3>,
                                    },
                                    marks: {
                                        strong: ({ children }) => <strong className="font-bold text-foreground">{children}</strong>,
                                        link: ({ value, children }) => {
                                            const target = (value?.href || '').startsWith('http') ? '_blank' : undefined
                                            return (
                                                <a href={value?.href} target={target} rel={target === '_blank' ? 'noindex nofollow' : undefined} className="text-primary underline decoration-emerald-300 hover:decoration-emerald-600 transition-all font-medium">
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
                            <h2 className="text-2xl font-serif font-bold text-foreground mb-6">Highlights</h2>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {tour.highlights.map((feature: any, i: number) => (
                                    <li key={i} className="flex items-start space-x-3 p-4 bg-card rounded-xl shadow-sm border border-olive/5">
                                        <Check className="w-5 h-5 text-olive shrink-0 mt-0.5" />
                                        <span className="text-foreground font-medium">{typeof feature === 'object' ? feature.item : feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {/* Itinerary */}
                    {tour.itinerary && tour.itinerary.length > 0 && (
                        <section>
                            <h2 className="text-2xl font-serif font-bold text-foreground mb-6">Itinerary</h2>
                            <div className="pl-4 border-l-2 border-olive/20 space-y-8">
                                {tour.itinerary.map((stop: any, index: number) => (
                                    <div key={index} className="relative">
                                        <div className="absolute -left-[21px] top-0 w-4 h-4 bg-olive rounded-full border-2 border-cream" />
                                        <h3 className="text-lg font-bold text-foreground">{stop.title}</h3>
                                        <p className="text-sm text-muted-foreground mb-2">{stop.duration}</p>
                                        <p className="text-muted-foreground leading-relaxed">{stop.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Inclusions & Exclusions */}
                    <section className="grid md:grid-cols-2 gap-8">
                        {tour.includes && tour.includes.length > 0 && (
                            <div>
                                <h3 className="text-xl font-serif font-bold text-foreground mb-4 flex items-center">
                                    <CheckCircle className="w-5 h-5 text-olive mr-2" /> What&apos;s Included
                                </h3>
                                <ul className="space-y-3">
                                    {tour.includes.map((item: any, i: number) => (
                                        <li key={i} className="flex items-start text-foreground text-sm">
                                            <Check className="w-4 h-4 text-olive mr-2 mt-0.5 shrink-0" />
                                            {typeof item === 'object' ? item.item : item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {tour.excludes && tour.excludes.length > 0 && (
                            <div>
                                <h3 className="text-xl font-serif font-bold text-foreground mb-4 flex items-center">
                                    <XCircle className="w-5 h-5 text-red-500 mr-2" /> What&apos;s Not Included
                                </h3>
                                <ul className="space-y-3">
                                    {tour.excludes.map((item: any, i: number) => (
                                        <li key={i} className="flex items-start text-muted-foreground text-sm">
                                            <XCircle className="w-4 h-4 text-red-400 mr-2 mt-0.5 shrink-0" />
                                            {typeof item === 'object' ? item.item : item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </section>

                    {/* Meeting Point & Important Info */}
                    <section className="bg-muted rounded-2xl p-8 border border-border space-y-6">
                        {tour.meetingPoint && (
                            <div>
                                <h3 className="font-heading text-lg font-bold text-foreground mb-2 flex items-center">
                                    <MapPin className="w-5 h-5 text-olive mr-2" /> Meeting Point
                                </h3>
                                <p className="text-foreground">{tour.meetingPoint}</p>
                                <a
                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(tour.meetingPoint + ' Rome')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center mt-3 text-olive font-bold hover:underline"
                                >
                                    <MapIcon className="w-4 h-4 mr-1" /> View on Map
                                </a>
                            </div>
                        )}

                        {tour.importantInfo && tour.importantInfo.length > 0 && (
                            <div>
                                <h3 className="text-lg font-bold text-foreground mb-2 flex items-center">
                                    <Info className="w-5 h-5 text-olive mr-2" /> Important Information
                                </h3>
                                <ul className="list-disc list-inside space-y-1 text-foreground font-sans">
                                    {tour.importantInfo.map((info: any, i: number) => (
                                        <li key={i}>{typeof info === 'object' ? info.item : info}</li>
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
