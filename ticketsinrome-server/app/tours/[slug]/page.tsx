import { Header } from '@/components/header';
import { FooterSection } from '@/components/sections/footer-section';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { getTour, getTours, urlFor } from '@/lib/sanityService';
import { notFound } from 'next/navigation';
import BookingWidget from '@/components/BookingWidget';

export const revalidate = 300;

// Pre-build all tour pages at deploy time
export async function generateStaticParams() {
    const tours = await getTours();
    return tours
        .filter((t) => t.slug?.current)
        .map((t) => ({ slug: t.slug.current }));
}

export default async function TourDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const tour = await getTour(slug);

    if (!tour) {
        return (
            <main className="min-h-screen bg-background">
                <Header />
                <section className="py-16 px-4 sm:px-6 lg:px-8 pt-32">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-3xl font-bold mb-4">Tour Not Found</h1>
                        <p className="text-muted-foreground mb-8">The tour you are looking for does not exist.</p>
                        <Link href="/tours"><Button>Back to Tours</Button></Link>
                    </div>
                </section>
            </main>
        );
    }

    const imageUrl = tour.mainImage?.asset?.url
        ? urlFor(tour.mainImage).width(1200).height(600).url()
        : '/placeholder.jpg';

    const highlights = tour.highlights || tour.features || [];
    const includes   = tour.includes || [];
    const excludes   = tour.excludes || [];

    return (
        <main className="min-h-screen bg-background">
            <Header />

            <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                        {/* ── Left: Tour Content ── */}
                        <div className="lg:col-span-2">
                            {/* Hero Image */}
                            <div className="relative w-full h-80 md:h-96 rounded-2xl overflow-hidden mb-8">
                                <Image
                                    src={imageUrl}
                                    alt={tour.title}
                                    fill
                                    className="object-cover"
                                    priority
                                    unoptimized
                                />
                            </div>

                            {/* Title & Meta */}
                            <div className="mb-8">
                                {tour.category && (
                                    <span className="inline-block bg-foreground text-background text-xs font-medium px-3 py-1 rounded-full mb-3 capitalize">
                                        {tour.category}
                                    </span>
                                )}
                                <h1 className="text-3xl md:text-4xl font-bold mb-4">{tour.title}</h1>
                                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                    {tour.duration && <span>⏱ {tour.duration}</span>}
                                    {tour.groupSize && <span>👥 {tour.groupSize}</span>}
                                    {tour.rating && <span>⭐ {tour.rating} ({tour.reviewCount || 0} reviews)</span>}
                                    {tour.location && <span>📍 {tour.location}</span>}
                                </div>
                            </div>

                            {/* Description */}
                            {tour.description && (
                                <div className="mb-8">
                                    <h2 className="text-xl font-semibold mb-3">Overview</h2>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {typeof tour.description === 'string' ? tour.description : ''}
                                    </p>
                                </div>
                            )}

                            {/* Highlights */}
                            {highlights.length > 0 && (
                                <div className="mb-8">
                                    <h2 className="text-xl font-semibold mb-4">Highlights</h2>
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {highlights.map((h: string, i: number) => (
                                            <li key={i} className="flex items-start gap-3">
                                                <span className="text-primary font-bold mt-0.5">✓</span>
                                                <span className="text-sm">{h}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Includes / Excludes */}
                            {(includes.length > 0 || excludes.length > 0) && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                    {includes.length > 0 && (
                                        <div>
                                            <h2 className="text-xl font-semibold mb-3">What's Included</h2>
                                            <ul className="space-y-2">
                                                {includes.map((item: string, i: number) => (
                                                    <li key={i} className="flex items-start gap-2 text-sm">
                                                        <span className="text-green-600 font-bold">✓</span>
                                                        <span>{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    {excludes.length > 0 && (
                                        <div>
                                            <h2 className="text-xl font-semibold mb-3">Not Included</h2>
                                            <ul className="space-y-2">
                                                {excludes.map((item: string, i: number) => (
                                                    <li key={i} className="flex items-start gap-2 text-sm">
                                                        <span className="text-red-500 font-bold">✗</span>
                                                        <span>{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Meeting Point */}
                            {tour.meetingPoint && (
                                <div className="mb-8 p-5 bg-muted rounded-xl border">
                                    <h2 className="text-xl font-semibold mb-2">Meeting Point</h2>
                                    <p className="text-muted-foreground text-sm">{tour.meetingPoint}</p>
                                </div>
                            )}

                            {/* Important Info */}
                            {tour.importantInfo && tour.importantInfo.length > 0 && (
                                <div className="mb-8">
                                    <h2 className="text-xl font-semibold mb-3">Important Information</h2>
                                    <ul className="space-y-2">
                                        {tour.importantInfo.map((info: string, i: number) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                                <span className="text-amber-500 font-bold">•</span>
                                                <span>{info}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* ── Right: Booking Widget ── */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-24">
                                <BookingWidget tour={tour} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <FooterSection />
        </main>
    );
}
