'use client';

import Image from 'next/image';
import { Clock, Users, MapPin, Check, Star, XCircle, CheckCircle } from 'lucide-react';
import BookingWidget from '@/components/BookingWidget';
import TourHeroSlider from '@/components/TourHeroSlider';
import { urlFor } from '@/lib/dataAdapter';
import { PortableText } from '@portabletext/react';
import { useLanguage, TranslatedTour } from '@/context/LanguageContext';
import EmbeddedMap from './EmbeddedMap';

interface TourContentProps {
    tour: TranslatedTour;
}

export default function TourContent({ tour }: TourContentProps) {
    const { t, translateTour } = useLanguage();

    // Get translated tour data
    const translatedTour = translateTour(tour);

    // Combine main image and gallery for the slider
    const sliderImages = [translatedTour.mainImage].concat(translatedTour.gallery || []).filter(Boolean);

    // If no images at all, fallback
    const fallbackImage = 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=80';
    if (sliderImages.length === 0) {
        sliderImages.push(fallbackImage);
    }

    return (
        <>
            {/* Tour Hero Slider */}
            <div className="relative">
                <TourHeroSlider
                    images={sliderImages}
                    title={translatedTour.title}
                    category={translatedTour.category}
                    duration={translatedTour.duration}
                    groupSize={translatedTour.groupSize}
                    rating={translatedTour.rating}
                    reviewCount={translatedTour.reviewCount}
                />

                {/* Overlay Content */}
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 container mx-auto pointer-events-none z-10">
                    <div className="max-w-4xl space-y-4 pointer-events-auto">
                        <span className="bg-forest text-cream px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.3em]">
                            {translatedTour.category}
                        </span>
                        <h1 className="font-serif text-4xl md:text-6xl lg:text-8xl font-bold text-white drop-shadow-2xl italic leading-[0.9]">
                            {translatedTour.title}
                        </h1>

                        {/* Rating & Reviews */}
                        {translatedTour.rating && (
                            <div className="flex items-center gap-2 text-white drop-shadow-md">
                                <div className="flex items-center gap-1 bg-white/10 backdrop-blur-md px-3 py-1.5 border border-white/20">
                                    <Star className="w-3 h-3 fill-gold text-gold" />
                                    <span className="font-serif italic font-bold">{translatedTour.rating}</span>
                                </div>
                                <span className="font-sans text-[10px] font-black uppercase tracking-widest opacity-80">
                                    {translatedTour.reviewCount || 0} {t('tour.reviews')}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left Column - Tour Details */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Quick Info */}
                        <div className="flex flex-wrap gap-4">
                            {translatedTour.duration && (
                                <div className="flex items-center gap-2 text-forest">
                                    <Clock className="w-4 h-4 text-forest" />
                                    <span className="font-sans text-[11px] font-black uppercase tracking-widest">{translatedTour.duration}</span>
                                </div>
                            )}
                            {translatedTour.groupSize && (
                                <div className="flex items-center gap-2 text-forest">
                                    <Users className="w-4 h-4 text-forest" />
                                    <span className="font-sans text-[11px] font-black uppercase tracking-widest">{translatedTour.groupSize}</span>
                                </div>
                            )}
                            {translatedTour.location && (
                                <div className="flex items-center gap-2 text-forest">
                                    <MapPin className="w-4 h-4 text-forest" />
                                    <span className="font-sans text-[11px] font-black uppercase tracking-widest">{translatedTour.location}</span>
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        {translatedTour.description && (
                            <section>
                                <h2 className="font-serif text-2xl font-bold text-forest mb-6 italic underline decoration-forest/10">{t('tour.overview')}</h2>
                                <div className="font-sans prose prose-lg max-w-none text-forest/80">
                                    <PortableText value={translatedTour.description as any} />
                                </div>
                            </section>
                        )}

                        {/* Highlights */}
                        {translatedTour.highlights && translatedTour.highlights.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('tour.highlights')}</h2>
                                <ul className="space-y-3">
                                    {translatedTour.highlights.map((highlight, idx) => (
                                        <li key={idx} className="flex items-start gap-3">
                                            <Check className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                                            <span className="text-gray-700">{highlight}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        {/* What's Included */}
                        {translatedTour.includes && translatedTour.includes.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('tour.includes')}</h2>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {translatedTour.includes.map((item, idx) => (
                                        <li key={idx} className="flex items-start gap-3">
                                            <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                                            <span className="text-gray-700">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        {/* What's Not Included */}
                        {translatedTour.excludes && translatedTour.excludes.length > 0 && (
                            <section>
                                <h2 className="font-serif text-2xl font-bold text-forest mb-6 italic border-b border-forest/10 pb-4">{t('tour.excludes')}</h2>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {translatedTour.excludes.map((item, idx) => (
                                        <li key={idx} className="flex items-start gap-3">
                                            <XCircle className="w-4 h-4 text-red-800 mt-0.5 shrink-0" />
                                            <span className="text-forest/70 font-sans text-sm">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        {/* Meeting Point */}
                        {translatedTour.meetingPoint && (
                            <section>
                                <h2 className="font-serif text-2xl font-bold text-forest mb-6 italic border-b border-forest/10 pb-4">{t('tour.meeting')}</h2>
                                <div className="bg-cream p-8 border border-forest/20 flex flex-col md:flex-row md:items-center justify-between gap-8 mb-8 shadow-xl">
                                    <div className="flex items-start gap-6">
                                        <div className="w-14 h-14 bg-forest text-cream flex items-center justify-center shrink-0">
                                            <MapPin className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-forest font-serif font-bold italic text-lg leading-tight mb-2">{translatedTour.meetingPoint}</p>
                                            <p className="text-[10px] text-forest/40 uppercase tracking-[0.2em] font-black">Please arrive 15 min early for check-in</p>
                                        </div>
                                    </div>
                                    <a
                                        href={translatedTour.location || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(translatedTour.meetingPoint + ' Rome')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-forest text-cream px-10 py-4 font-black text-[10px] uppercase tracking-[0.3em] hover:bg-forest-light transition-all shrink-0 text-center shadow-lg shadow-forest/20"
                                    >
                                        Dispatch Location
                                    </a>
                                </div>
                                {/* Embedded Map */}
                                <EmbeddedMap location={translatedTour.meetingPoint} locationUrl={translatedTour.location} />
                            </section>
                        )}

                        {/* Important Info */}
                        {translatedTour.importantInfo && translatedTour.importantInfo.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('tour.important')}</h2>
                                <ul className="space-y-2">
                                    {translatedTour.importantInfo.map((info, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-gray-700">
                                            <span className="text-emerald-600">•</span>
                                            {info}
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        {/* Translated Notice */}
                        {tour.translations && (
                            <div className="text-xs text-gray-400 italic mt-8 pt-4 border-t">
                                {t('common.translated_by_google')}
                            </div>
                        )}
                    </div>

                    {/* Right Column - Booking Widget */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            <BookingWidget tour={translatedTour} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
