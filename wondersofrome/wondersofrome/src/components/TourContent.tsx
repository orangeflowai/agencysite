'use client';

import Image from 'next/image';
import { Clock, Users, MapPin, Check, Star, XCircle, CheckCircle, HelpCircle, ChevronDown, Tag } from 'lucide-react';
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
                        {translatedTour.badge && (
                            <span className="inline-block bg-accent text-white text-xs font-bold px-3 py-1 tracking-[0.3em] rounded-sm mb-1">
                                {translatedTour.badge.toUpperCase()}
                            </span>
                        )}
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="bg-olive text-white px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide">
                                {translatedTour.category}
                            </span>
                            {translatedTour.tourType && (
                                <span className="bg-white/20 backdrop-blur-sm text-white px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide border border-white/30">
                                    {translatedTour.tourType}
                                </span>
                            )}
                        </div>
                        <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-white drop-shadow-lg">
                            {translatedTour.title}
                        </h1>

                        {/* Rating & Reviews */}
                        {translatedTour.rating && (
                            <div className="flex items-center gap-2 text-white drop-shadow-md">
                                <div className="flex items-center gap-1 bg-card/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
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
                        <div className="flex flex-col gap-4">
                            {translatedTour.duration && (
                                <div className="flex items-center gap-3 text-foreground">
                                    <Clock className="w-5 h-5 text-primary shrink-0" />
                                    <span className="text-sm font-medium tracking-wide">{translatedTour.duration}</span>
                                </div>
                            )}
                            {translatedTour.groupSize && (
                                <div className="flex items-center gap-3 text-foreground">
                                    <Users className="w-5 h-5 text-primary shrink-0" />
                                    <span className="text-sm font-medium tracking-wide">{translatedTour.groupSize}</span>
                                </div>
                            )}
                            {translatedTour.location && (
                                <div className="flex items-center gap-3 text-foreground">
                                    <MapPin className="w-5 h-5 text-primary shrink-0" />
                                    <span className="text-sm font-medium tracking-wide">{translatedTour.location}</span>
                                </div>
                            )}
                            {translatedTour.tourType && (
                                <div className="flex items-center gap-3 text-foreground">
                                    <Tag className="w-5 h-5 text-primary shrink-0" />
                                    <span className="text-sm font-medium tracking-wide">{translatedTour.tourType}</span>
                                </div>
                            )}
                        </div>

                        {/* Tags */}
                        {translatedTour.tags && translatedTour.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {translatedTour.tags.map((tag: any, i: number) => (
                                    <span key={i} className="inline-flex items-center gap-1 px-3 py-1.5 bg-muted border border-border rounded-full text-[10px] font-bold text-muted-foreground tracking-wider">
                                        <Tag className="w-3 h-3 text-primary" />
                                        {typeof tag === 'string' ? tag : tag?.label || tag?.name || String(tag)}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Description */}
                        {translatedTour.description && (
                            <section>
                                <h2 className="text-2xl font-bold text-foreground mb-4">{t('tour.overview')}</h2>
                                <div className="prose prose-lg max-w-none text-muted-foreground">
                                    {typeof translatedTour.description === 'string' ? (
                                        <p>{translatedTour.description}</p>
                                    ) : (
                                        <PortableText value={translatedTour.description as any} />
                                    )}
                                </div>
                            </section>
                        )}

                        {/* Highlights */}
                        {translatedTour.highlights && translatedTour.highlights.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-bold text-foreground mb-4">{t('tour.highlights')}</h2>
                                <ul className="space-y-3">
                                    {translatedTour.highlights.map((highlight, idx) => (
                                        <li key={idx} className="flex items-start gap-3">
                                            <Check className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                                            <span className="text-foreground">{highlight}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        {/* What's Included */}
                        {translatedTour.includes && translatedTour.includes.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-bold text-foreground mb-4">{t('tour.includes')}</h2>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {translatedTour.includes.map((item, idx) => (
                                        <li key={idx} className="flex items-start gap-3">
                                            <CheckCircle className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                                            <span className="text-foreground">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        {/* What's Not Included */}
                        {translatedTour.excludes && translatedTour.excludes.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-bold text-foreground mb-4">{t('tour.excludes')}</h2>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {translatedTour.excludes.map((item, idx) => (
                                        <li key={idx} className="flex items-start gap-3">
                                            <XCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                                            <span className="text-foreground">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        {/* Meeting Point */}
                        {translatedTour.meetingPoint && (
                            <section>
                                <h2 className="text-2xl font-bold text-foreground mb-4">{t('tour.meeting')}</h2>
                                <div className="bg-muted p-6 rounded-2xl border border-border flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0 mt-1">
                                            <MapPin className="text-primary w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-foreground font-medium leading-relaxed">{translatedTour.meetingPoint}</p>
                                            <p className="text-xs text-muted-foreground mt-2  tracking-widest font-bold">Please arrive 15 min early</p>
                                        </div>
                                    </div>
                                    <a
                                        href={translatedTour.mapAddress?.startsWith('http') ? translatedTour.mapAddress 
                                            : translatedTour.location?.startsWith('http') ? translatedTour.location 
                                            : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((translatedTour.mapAddress || translatedTour.location || translatedTour.meetingPoint?.split(/(?:\n|\. )/)[0] || '') + ' Rome')}`
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-card border-2 border-emerald-600 text-primary px-6 py-3 rounded-xl font-bold text-sm  tracking-widest hover:bg-secondary transition-colors shrink-0 text-center"
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
                                <h2 className="text-2xl font-bold text-foreground mb-4">{t('tour.important')}</h2>
                                <ul className="space-y-2">
                                    {translatedTour.importantInfo.map((info, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-foreground">
                                            <span className="text-primary">•</span>
                                            {info}
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        {/* FAQs */}
                        {translatedTour.faqs && translatedTour.faqs.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                                    <HelpCircle className="w-6 h-6 text-primary" />
                                    Frequently Asked Questions
                                </h2>
                                <div className="space-y-3">
                                    {translatedTour.faqs.map((faq, i) => (
                                        <details key={i} className="group bg-card rounded-2xl border border-border overflow-hidden transition-all duration-300">
                                            <summary className="w-full flex items-center justify-between p-6 cursor-pointer list-none">
                                                <span className="text-sm font-bold text-foreground pr-8">{faq.question}</span>
                                                <span className="shrink-0 ml-2 transition-transform duration-300 group-open:rotate-180">
                                                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                                                </span>
                                            </summary>
                                            <div className="px-6 pb-6 pt-0">
                                                <p className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
                                            </div>
                                        </details>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Translated Notice */}
                        {tour.translations && (
                            <div className="text-xs text-muted-foreground  mt-8 pt-4 border-t">
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
