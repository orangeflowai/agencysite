
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Clock, Users, Calendar, Check, Star, MapPin, Map as MapIcon, Info, XCircle, CheckCircle, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BookingWidget from '@/components/BookingWidget';
import TourHeroSlider from '@/components/TourHeroSlider';
import MobileBookingBar from '@/components/MobileBookingBar';
import { getTour, getTours, urlFor } from '@/lib/dataAdapter';
import { PortableText } from '@portabletext/react';

// Revalidate every hour
export const revalidate = 3600;

interface PageProps {
    params: Promise<{ slug: string }>;
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

    // Combine main image and gallery for the slider
    const sliderImages = [tour.mainImage].concat(tour.gallery || []).filter(Boolean);

    // If no images at all, fallback
    const fallbackImage = 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=80';
    if (sliderImages.length === 0) {
        sliderImages.push(fallbackImage);
    }

    return (
        <main className="min-h-screen bg-cream selection:bg-olive selection:text-white">
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

                {/* Overlay Content (Title etc) - Re-added on top of slider logic in the slider component? 
                    Actually, TourHeroSlider has the image but maybe not the text overlay styling I want?
                    Wait, TourHeroSlider component handles the image rendering.
                    I need to check if I want the text INSIDE the slider component (which changes per slide? No, title is static)
                    OR overlaying the slider.
                    Currently TourHeroSlider just renders images.
                    Let's Put the Title Overlay HERE, absolutely positioned over the slider container.
                */}
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 container mx-auto pointer-events-none z-10">
                    <div className="max-w-4xl space-y-4 pointer-events-auto">
                        <span className="bg-olive text-white px-4 py-1.5 rounded-full text-sm font-semibold uppercase tracking-wide">
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

            <div className="container mx-auto px-4 py-16">
                <div className="flex flex-col xl:flex-row gap-12 items-start">
                    
                    {/* Column 1: Booking Experience (The unique part) */}
                    <div className="w-full xl:w-[448px] shrink-0 xl:sticky xl:top-32 order-2 xl:order-1">
                        <div className="bg-white rounded-[3rem] p-10 shadow-2xl shadow-black/5 border border-olive/5">
                            <h2 className="text-2xl font-inter font-bold text-foreground mb-8 tracking-tighter">Reserve Experience</h2>
                            <BookingWidget tour={tour} />
                        </div>
                    </div>

                    {/* Column 2: Tour Details & Narrative */}
                    <div className="flex-1 space-y-20 order-1 xl:order-2">
                        
                        {/* Highlights Row (Horizontal) */}
                        {tour.highlights && tour.highlights.length > 0 && (
                            <section>
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-12 h-px bg-olive/20" />
                                    <h2 className="text-sm uppercase font-black tracking-[0.4em] text-olive">Highlights</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {tour.highlights.map((feature, i) => (
                                        <div key={i} className="flex flex-col gap-4 p-8 bg-white rounded-[2.5rem] border border-olive/5 hover:border-olive/20 transition-all group">
                                            <div className="w-10 h-10 rounded-full bg-olive/5 flex items-center justify-center group-hover:bg-olive group-hover:text-white transition-all">
                                                <Check className="w-5 h-5" />
                                            </div>
                                            <span className="text-foreground font-bold text-sm leading-tight tracking-tight">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Overview (Clean & Wide) */}
                        <section className="prose prose-xl prose-emerald max-w-none">
                            <div className="flex items-center gap-4 mb-10">
                                <div className="w-12 h-px bg-olive/20" />
                                <h2 className="text-sm uppercase font-black tracking-[0.4em] text-olive m-0">The Story</h2>
                            </div>
                            <div className="font-inter text-foreground/80 leading-[1.8] text-lg">
                                {typeof tour.description === 'string' ? (
                                    <p>{tour.description}</p>
                                ) : (
                                    <PortableText value={tour.description} />
                                )}
                            </div>
                        </section>

                        {/* Itinerary (Horizontal Flow) */}
                        {tour.itinerary && tour.itinerary.length > 0 && (
                            <section>
                                <div className="flex items-center gap-4 mb-10">
                                    <div className="w-12 h-px bg-olive/20" />
                                    <h2 className="text-sm uppercase font-black tracking-[0.4em] text-olive">The Path</h2>
                                </div>
                                <div className="flex flex-row overflow-x-auto gap-8 pb-8 no-scrollbar snap-x">
                                    {tour.itinerary.map((stop, index) => (
                                        <div key={index} className="min-w-[304px] flex-shrink-0 bg-white p-10 rounded-[3rem] border border-olive/5 snap-center shadow-sm hover:shadow-xl transition-all">
                                            <span className="text-[8px] font-black text-olive uppercase tracking-[0.3em] mb-4 block">Stop {index + 1}</span>
                                            <h3 className="text-xl font-bold text-foreground mb-4 tracking-tight leading-tight">{stop.title}</h3>
                                            <div className="flex items-center gap-2 text-gray-400 text-[8px] font-bold uppercase tracking-widest mb-4">
                                                <Clock size={12} /> {stop.duration}
                                            </div>
                                            <p className="text-sm text-gray-500 leading-relaxed">{stop.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Inclusions / Practical Info */}
                        <div className="grid md:grid-cols-2 gap-12">
                            <section className="bg-white p-10 rounded-[3rem] border border-olive/5 shadow-sm">
                                <h3 className="text-lg font-bold text-foreground mb-6 flex items-center tracking-tight">
                                    <CheckCircle className="w-5 h-5 text-olive mr-3" /> Essentials
                                </h3>
                                <ul className="space-y-4">
                                    {tour.includes?.map((item, i) => (
                                        <li key={i} className="flex items-start text-gray-500 text-xs font-bold uppercase tracking-wider leading-relaxed">
                                            <Check className="w-4 h-4 text-olive mr-3 mt-0.5 shrink-0" strokeWidth={3} />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </section>

                            <section className="bg-card p-10 rounded-[3rem] shadow-xl text-white">
                                <h3 className="text-lg font-bold text-white mb-6 flex items-center tracking-tight">
                                    <MapPin className="w-5 h-5 text-olive mr-3" /> Rendezvous
                                </h3>
                                <p className="text-sm text-white/60 mb-6 leading-relaxed">{tour.meetingPoint}</p>
                                <a
                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(tour.meetingPoint + ' Rome')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-olive font-black text-[8px] uppercase tracking-[0.3em] hover:tracking-[0.4em] transition-all"
                                >
                                    Open Maps <ArrowRight size={14} />
                                </a>
                            </section>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />

            {/* Mobile Sticky Booking Bar */}
            <MobileBookingBar price={tour.price} />
        </main>
    );
}
