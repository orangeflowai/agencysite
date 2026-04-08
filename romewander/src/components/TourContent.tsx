'use client';

import Image from 'next/image';
import { Clock, Users, MapPin, Check, Star, XCircle, CheckCircle } from 'lucide-react';
import BookingWidget from '@/components/BookingWidget';
import TourHeroSlider from '@/components/TourHeroSlider';
import { urlFor } from '@/sanity/lib/image';
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
                        <span className="bg-olive text-white px-4 py-1.5 rounded-full text-sm font-semibold uppercase tracking-wide">
                            {translatedTour.category}
                        </span>
                        <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-white drop-shadow-lg">
                            {translatedTour.title}
                        </h1>

                        {/* Rating & Reviews */}
                        {translatedTour.rating && (
                            <div className="flex items-center gap-2 text-white drop-shadow-md">
                                <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                    <span className="font-bold">{translatedTour.rating}</span>
                                </div>
                                <span className="text-sm opacity-90">
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
                                <div className="flex items-center gap-2 text-gray-700">
                                    <Clock className="w-5 h-5 text-emerald-600" />
                                    <span>{translatedTour.duration}</span>
                                </div>
                            )}
                            {translatedTour.groupSize && (
                                <div className="flex items-center gap-2 text-gray-700">
                                    <Users className="w-5 h-5 text-emerald-600" />
                                    <span>{translatedTour.groupSize}</span>
                                </div>
                            )}
                            {translatedTour.location && (
                                <div className="flex items-center gap-2 text-gray-700">
                                    <MapPin className="w-5 h-5 text-emerald-600" />
                                    <span>{translatedTour.location}</span>
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        {translatedTour.description && (
                            <section>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('tour.overview')}</h2>
                                <div className="prose prose-lg max-w-none text-gray-600">
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
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('tour.excludes')}</h2>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {translatedTour.excludes.map((item, idx) => (
                                        <li key={idx} className="flex items-start gap-3">
                                            <XCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                                            <span className="text-gray-700">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        {/* Meeting Point */}
                        {translatedTour.meetingPoint && (
                            <section>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('tour.meeting')}</h2>
                                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0 mt-1">
                                            <MapPin className="text-emerald-600 w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-gray-700 font-medium leading-relaxed">{translatedTour.meetingPoint}</p>
                                            <p className="text-xs text-gray-400 mt-2 uppercase tracking-widest font-bold">Please arrive 15 min early</p>
                                        </div>
                                    </div>
                                    <a
                                        href={translatedTour.location || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(translatedTour.meetingPoint + ' Rome')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-white border-2 border-emerald-600 text-emerald-600 px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-emerald-50 transition-colors shrink-0 text-center"
                                    >
                                        View on Maps
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
