'use client';

import Image from 'next/image';
import { Star, Languages, Clock } from 'lucide-react';

const GUIDES = [
    {
        name: 'Marco Rossi',
        role: 'Vatican & Renaissance Expert',
        bio: 'Art historian with 12 years leading Vatican Museums tours. Specialist in Michelangelo and the Sistine Chapel.',
        languages: ['English', 'Italian', 'Spanish'],
        experience: '12 years',
        rating: 4.9,
        reviews: 847,
        image: 'https://pub-772bbb33a07f4026aa9652a0cfef4c2e.r2.dev/rome%20photos/pexels-efrem-efre-2786187-17282659.jpg',
        badge: 'Vatican Specialist',
        badgeColor: 'bg-amber-100 text-amber-800',
    },
    {
        name: 'Sofia Conti',
        role: 'Ancient Rome & Colosseum Expert',
        bio: 'Archaeology graduate from La Sapienza University. Brings gladiatorial Rome to life with unmatched detail and storytelling.',
        languages: ['English', 'Italian', 'French', 'German'],
        experience: '9 years',
        rating: 5.0,
        reviews: 1124,
        image: 'https://pub-772bbb33a07f4026aa9652a0cfef4c2e.r2.dev/rome%20photos/pexels-imagenesclau-35046617.jpg',
        badge: 'Top Rated',
        badgeColor: 'bg-emerald-100 text-emerald-800',
    },
    {
        name: 'Alessandro Ferrari',
        role: 'City Tours & Hidden Rome',
        bio: 'Born and raised in Trastevere. Knows every piazza, alley, and secret courtyard the guidebooks miss.',
        languages: ['English', 'Italian', 'Portuguese'],
        experience: '7 years',
        rating: 4.8,
        reviews: 612,
        image: 'https://pub-772bbb33a07f4026aa9652a0cfef4c2e.r2.dev/rome%20photos/pexels-nastiz-12604242.jpg',
        badge: 'Local Expert',
        badgeColor: 'bg-sky-100 text-sky-800',
    },
];

export default function GuideProfiles() {
    return (
        <section className="py-24 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <span className="text-[10px] font-bold tracking-[0.4em] text-primary uppercase">The People Behind the Tours</span>
                    <h2 className="mt-3 text-4xl md:text-5xl font-serif font-bold text-foreground tracking-tight">
                        Meet Your Guides
                    </h2>
                    <p className="mt-4 text-muted-foreground max-w-xl mx-auto text-base leading-relaxed">
                        Every tour is led by a certified art historian or archaeologist — not a script reader.
                    </p>
                </div>

                {/* Guide cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {GUIDES.map(guide => (
                        <div
                            key={guide.name}
                            className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col"
                        >
                            {/* Photo */}
                            <div className="relative h-64 overflow-hidden">
                                <Image
                                    src={guide.image}
                                    alt={`${guide.name} — ${guide.role}`}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                <span className={`absolute bottom-4 left-4 text-[9px] font-bold px-2.5 py-1 rounded-full tracking-wider ${guide.badgeColor}`}>
                                    {guide.badge}
                                </span>
                            </div>

                            {/* Content */}
                            <div className="p-6 flex flex-col flex-1">
                                <h3 className="text-xl font-serif font-bold text-foreground">{guide.name}</h3>
                                <p className="text-[10px] font-bold tracking-[0.2em] text-primary mt-1 mb-3 uppercase">{guide.role}</p>
                                <p className="text-sm text-muted-foreground leading-relaxed flex-1">{guide.bio}</p>

                                {/* Meta */}
                                <div className="mt-5 pt-5 border-t border-border space-y-2.5">
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <Star size={13} className="fill-primary text-primary shrink-0" />
                                        <span className="font-bold text-foreground">{guide.rating}</span>
                                        <span>·</span>
                                        <span>{guide.reviews.toLocaleString()} reviews</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <Clock size={13} className="text-primary shrink-0" />
                                        <span>{guide.experience} guiding experience</span>
                                    </div>
                                    <div className="flex items-start gap-2 text-xs text-muted-foreground">
                                        <Languages size={13} className="text-primary shrink-0 mt-0.5" />
                                        <span>{guide.languages.join(' · ')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom CTA */}
                <p className="text-center mt-12 text-sm text-muted-foreground">
                    All guides are certified by the Italian Ministry of Cultural Heritage and Tourism.
                </p>
            </div>
        </section>
    );
}
