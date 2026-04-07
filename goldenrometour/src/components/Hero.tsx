'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { SUPABASE_BUCKET_URL } from '@/lib/constants';
import Image from 'next/image';
import { Search, Map, Calendar, Users } from 'lucide-react';

interface HeroProps {
    settings?: {
        heroTitle?: string;
        heroSubtitle?: string;
        heroVideo?: { asset: { url: string } };
        heroImage?: { asset: { url: string } };
    } | null;
}

export default function Hero({ settings }: HeroProps) {
    const { t } = useLanguage();
    const router = useRouter();
    const [destination, setDestination] = useState('');
    const [date, setDate] = useState('');
    const [guests, setGuests] = useState('2');

    const rawImageUrl = settings?.heroImage?.asset?.url || `${SUPABASE_BUCKET_URL}/hero-poster.jpg`;

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (destination) params.set('q', destination);
        if (date) params.set('date', date);
        if (guests) params.set('guests', guests);
        router.push(`/search?${params.toString()}`);
    };

    return (
        <section className="relative w-full h-auto lg:h-screen flex flex-col lg:flex-row bg-cream overflow-hidden border-b border-forest">
            {/* LEFT CONTENT (EDITORIAL) */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 md:p-16 xl:p-24 space-y-10 border-r border-forest relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <span className="font-sans font-black text-xs uppercase tracking-[0.4em] text-forest/40">
                        Boutique Travel Concierge
                    </span>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <h1 className="font-serif text-5xl md:text-7xl xl:text-8xl text-forest leading-[1] font-bold">
                        {settings?.heroTitle || "A Rare Path Through Rome."}
                    </h1>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="font-sans text-lg md:text-xl text-forest max-w-xl leading-relaxed opacity-80"
                >
                    {settings?.heroSubtitle || "We avoid the standard. Our collection of private experiences is selected for those who seek the architectural, the historical, and the genuinely rare."}
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="flex flex-col sm:flex-row gap-6"
                >
                    <Link href="/search" className="bg-forest text-cream px-12 py-5 font-sans font-black uppercase tracking-widest text-sm hover:invert transition-all flex items-center justify-center gap-3">
                        <span>Explore Collection</span>
                        <Search className="w-4 h-4" />
                    </Link>
                    <Link href="/private-tours" className="border-2 border-forest text-forest px-12 py-5 font-sans font-black uppercase tracking-widest text-sm hover:bg-forest hover:text-cream transition-all text-center">
                        Private Access
                    </Link>
                </motion.div>

                {/* Editorial Credits / Stats */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="flex items-center gap-12 pt-8 border-t border-forest/10"
                >
                    <div>
                        <p className="font-serif text-2xl font-bold text-forest">Since 1987</p>
                        <p className="font-sans text-[10px] uppercase font-black tracking-widest text-forest/50">Heritage Agency</p>
                    </div>
                    <div>
                        <p className="font-serif text-2xl font-bold text-forest">32 Routes</p>
                        <p className="font-sans text-[10px] uppercase font-black tracking-widest text-forest/50">Curated Monthly</p>
                    </div>
                </motion.div>
            </div>

            {/* RIGHT IMAGE (EDITORIAL) */}
            <div className="w-full lg:w-1/2 relative h-[50vh] lg:h-full group overflow-hidden">
                <motion.div
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="w-full h-full"
                >
                    <Image
                        src={rawImageUrl}
                        alt="Vintage Rome"
                        fill
                        className="object-cover sepia-[0.2] contrast-[1.1] brightness-[0.9]"
                        priority
                    />
                </motion.div>
                
                {/* Vintage Border Inset */}
                <div className="absolute inset-8 border border-cream/30 z-20 pointer-events-none" />

                {/* Floating Content Card (Minimalist) */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 1 }}
                    className="absolute bottom-12 right-12 bg-cream p-8 max-w-[280px] z-30 shadow-2xl"
                >
                    <p className="font-sans font-black text-[10px] uppercase tracking-[0.3em] text-forest/40 mb-4 tracking-widest">Featured Space</p>
                    <h3 className="font-serif text-2xl font-bold text-forest mb-4">The Secret Rooms of the Vatican.</h3>
                    <Link href="/tour/vatican-secrets" className="font-sans font-black text-[11px] uppercase tracking-widest text-forest border-b border-forest pb-1 hover:opacity-50 transition-all">
                        View Details
                    </Link>
                </motion.div>
            </div>

            {/* MINIMALIST SEARCH OVERLAY */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="hidden lg:block absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-40 w-full max-w-6xl px-8"
            >
                <div className="bg-forest p-1 border border-forest">
                    <div className="bg-cream p-1 flex flex-col md:flex-row items-stretch">
                        <div className="flex-1 flex items-center px-8 py-4 border-r border-forest/10 group focus-within:bg-stone-50 transition-colors">
                            <Map className="w-4 h-4 text-forest/30 mr-4" />
                            <div className="flex-1">
                                <label className="block text-[8px] font-black text-forest/40 uppercase tracking-widest mb-1">Architecture / Area</label>
                                <input
                                    type="text"
                                    placeholder="Search the collection..."
                                    className="w-full bg-transparent outline-none font-serif text-lg text-forest placeholder:text-forest/20"
                                    value={destination}
                                    onChange={(e) => setDestination(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex-1 flex items-center px-8 py-4 border-r border-forest/10 group focus-within:bg-stone-50 transition-colors">
                            <Calendar className="w-4 h-4 text-forest/30 mr-4" />
                            <div className="flex-1">
                                <label className="block text-[8px] font-black text-forest/40 uppercase tracking-widest mb-1">Departure</label>
                                <input
                                    type="date"
                                    className="w-full bg-transparent outline-none font-sans text-sm font-bold text-forest"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex-1 flex items-center px-8 py-4 border-r border-forest/10 group focus-within:bg-stone-50 transition-colors">
                            <Users className="w-4 h-4 text-forest/30 mr-4" />
                            <div className="flex-1">
                                <label className="block text-[8px] font-black text-forest/40 uppercase tracking-widest mb-1">Audience Size</label>
                                <select
                                    className="w-full bg-transparent outline-none font-sans text-sm font-bold text-forest appearance-none"
                                    value={guests}
                                    onChange={(e) => setGuests(e.target.value)}
                                >
                                    <option value="1">Individual (1)</option>
                                    <option value="2">Duo (2)</option>
                                    <option value="4">Party (4)</option>
                                    <option value="8">Group (8)</option>
                                </select>
                            </div>
                        </div>

                        <button
                            onClick={handleSearch}
                            className="bg-forest text-cream px-12 py-8 font-sans font-black uppercase tracking-[0.2em] text-xs hover:bg-stone-900 transition-all"
                        >
                            Confirm Selection
                        </button>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
