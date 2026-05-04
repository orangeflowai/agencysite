'use client';

import { Clock, Users, MapPin, Check, Star, XCircle, CheckCircle } from 'lucide-react';
import BookingWidget from '@/components/BookingWidget';
import TourHeroSlider from '@/components/TourHeroSlider';
import { PortableText } from '@portabletext/react';
import { useLanguage, TranslatedTour } from '@/context/LanguageContext';

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

    const renderItem = (item: any) => {
        if (typeof item === 'object' && item !== null) {
            return item.item || item.text || JSON.stringify(item);
        }
        return String(item || '');
    };

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
                        <span className="bg-primary text-white px-4 py-1.5 rounded-full text-sm font-semibold  tracking-wide">
                            {translatedTour.category}
                        </span>
                        <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-white drop-shadow-lg  ">
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
                    <div className="lg:col-span-2 space-y-12">
                        {/* Quick Info */}
                        <div className="flex flex-wrap gap-8 py-6 border-y border-border">
                            {translatedTour.duration && (
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] font-bold  tracking-widest text-muted-foreground">Duration</span>
                                    <div className="flex items-center gap-2 text-foreground font-bold  ">
                                        <Clock className="w-4 h-4 text-primary" />
                                        <span>{translatedTour.duration}</span>
                                    </div>
                                </div>
                            )}
                            {translatedTour.groupSize && (
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] font-bold  tracking-widest text-muted-foreground">Capacity</span>
                                    <div className="flex items-center gap-2 text-foreground font-bold  ">
                                        <Users className="w-4 h-4 text-primary" />
                                        <span>{translatedTour.groupSize}</span>
                                    </div>
                                </div>
                            )}
                            {translatedTour.location && (
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] font-bold  tracking-widest text-muted-foreground">Sector</span>
                                    <div className="flex items-center gap-2 text-foreground font-bold  ">
                                        <MapPin className="w-4 h-4 text-primary" />
                                        <span>{translatedTour.location}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        {translatedTour.description && (
                            <section className="prose prose-lg max-w-none text-foreground/80 font-sans leading-relaxed">
                                <h2 className="text-3xl font-serif font-bold text-foreground mb-8   tracking-tighter decoration-primary/20 underline underline-offset-8">
                                    {t('tour.overview')}
                                </h2>
                                {typeof translatedTour.description === 'string' ? (
                                    <p className="font-medium">{translatedTour.description}</p>
                                ) : (
                                    <PortableText value={translatedTour.description as any} />
                                )}
                            </section>
                        )}

                        {/* Highlights */}
                        {translatedTour.highlights && translatedTour.highlights.length > 0 && (
                            <section>
                                <h2 className="text-3xl font-serif font-bold text-foreground mb-8   tracking-tighter">
                                    {t('tour.highlights')}
                                </h2>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {translatedTour.highlights.map((highlight, idx) => (
                                        <li key={idx} className="flex items-start gap-4 p-5 bg-card border border-border rounded-2xl shadow-sm group hover:border-primary transition-colors">
                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                                                <Check className="w-4 h-4 stroke-[3]" />
                                            </div>
                                            <span className="text-foreground font-bold   text-sm">{renderItem(highlight)}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        {/* What's Included */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-border">
                            {translatedTour.includes && translatedTour.includes.length > 0 && (
                                <section>
                                    <h3 className="text-xl font-serif font-bold text-foreground mb-6   flex items-center gap-3">
                                        <CheckCircle className="w-5 h-5 text-primary" />
                                        {t('tour.includes')}
                                    </h3>
                                    <ul className="space-y-4">
                                        {translatedTour.includes.map((item, idx) => (
                                            <li key={idx} className="flex items-start gap-3 text-sm font-medium text-muted-foreground  tracking-tight">
                                                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                                                {renderItem(item)}
                                            </li>
                                        ))}
                                    </ul>
                                </section>
                            )}

                            {translatedTour.excludes && translatedTour.excludes.length > 0 && (
                                <section>
                                    <h3 className="text-xl font-serif font-bold text-foreground mb-6   flex items-center gap-3">
                                        <XCircle className="w-5 h-5 text-red-500" />
                                        {t('tour.excludes')}
                                    </h3>
                                    <ul className="space-y-4">
                                        {translatedTour.excludes.map((item, idx) => (
                                            <li key={idx} className="flex items-start gap-3 text-sm font-medium text-muted-foreground  tracking-tight">
                                                <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                                                {renderItem(item)}
                                            </li>
                                        ))}
                                    </ul>
                                </section>
                            )}
                        </div>

                        {/* Meeting Point */}
                        {translatedTour.meetingPoint && (
                            <section className="bg-foreground text-background p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
                                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 2px, transparent 0)', backgroundSize: '40px 40px' }} />
                                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                                    <div className="space-y-4">
                                        <h2 className="text-3xl font-serif font-bold   tracking-tighter leading-none">{t('tour.meeting')}</h2>
                                        <p className="text-lg opacity-80 leading-relaxed font-serif  max-w-md">{translatedTour.meetingPoint}</p>
                                        <div className="flex items-center gap-2 px-3 py-1 bg-primary text-white rounded-full w-fit text-[10px] font-bold  tracking-[0.2em]">
                                            <div className="w-1.5 h-1.5 rounded-full bg-card animate-pulse" />
                                            Live Coordinates Linked
                                        </div>
                                    </div>
                                    <a
                                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(translatedTour.meetingPoint + ' Rome')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-primary hover:bg-primary/90 text-white px-10 py-4 rounded-full font-bold text-xs  tracking-widest transition-all shadow-xl hover:-translate-y-1 active:scale-95 text-center shrink-0"
                                    >
                                        Initiate Navigation
                                    </a>
                                </div>
                            </section>
                        )}

                        {/* Important Info */}
                        {translatedTour.importantInfo && translatedTour.importantInfo.length > 0 && (
                            <section className="p-8 bg-card border border-border rounded-[2rem]">
                                <h2 className="text-xl font-serif font-bold text-foreground mb-6   tracking-tight">{t('tour.important')}</h2>
                                <ul className="space-y-3">
                                    {translatedTour.importantInfo.map((info, idx) => (
                                        <li key={idx} className="flex items-start gap-3 text-sm font-medium text-muted-foreground  tracking-tight">
                                            <div className="w-1 h-1 rounded-full bg-primary mt-2 shrink-0" />
                                            {renderItem(info)}
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        {/* Translated Notice */}
                        {tour.translations && (
                            <div className="text-[10px] text-muted-foreground  font-bold tracking-widest mt-12 opacity-30">
                                {t('common.translated_by_google')} // TRANSMISSION_VERIFIED
                            </div>
                        )}
                    </div>

                    {/* Right Column - Booking Widget */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-32">
                            <BookingWidget tour={translatedTour} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
