'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { SUPABASE_BUCKET_URL } from '@/lib/constants';
import Image from 'next/image';
import { Calendar, Users, MapPin, Search, Star, ShieldCheck, Zap } from 'lucide-react';

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
        <section className="relative min-h-[95vh] w-full flex items-center pt-24 pb-32 overflow-hidden bg-soft-blue">
            {/* Background Decorative Blobs */}
            <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[600px] h-[600px] bg-sky-200/40 blur-[120px] rounded-full z-0" />
            <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[500px] h-[500px] bg-purple-200/30 blur-[100px] rounded-full z-0" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    
                    {/* LEFT CONTENT (7 columns) */}
                    <div className="lg:col-span-7 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-md border border-sky-100 px-4 py-2 rounded-full shadow-sm"
                        >
                            <span className="flex h-2 w-2 rounded-full bg-sky-500 animate-pulse" />
                            <span className="text-sky-600 font-bold text-xs uppercase tracking-widest">{t('hero.title') || 'Trusted by 12,000+ Travelers'}</span>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <h1 className="text-6xl md:text-7xl xl:text-[5.5rem] font-black tracking-tight leading-[0.95] text-stone-950">
                                {settings?.heroTitle || "The Eternal City,"}<br />
                                <span className="text-sky-500 italic decoration-sky-100 underline underline-offset-8">Unlocked.</span>
                            </h1>
                        </motion.div>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="text-lg md:text-xl text-stone-600 max-w-2xl leading-relaxed font-medium"
                        >
                            {settings?.heroSubtitle || "Discover Rome through the lens of local experts. Skip the queues and dive deep into history with our curated premium experiences."}
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                            className="flex flex-col sm:flex-row gap-4"
                        >
                            <Link href="/search" className="group bg-sky-500 hover:bg-sky-600 text-white px-10 py-5 rounded-3xl font-black uppercase tracking-wider transition-all shadow-saas hover:shadow-saas-xl hover:-translate-y-1 flex items-center justify-center gap-2">
                                <span>Start Your Journey</span>
                                <Zap className="w-4 h-4 fill-white group-hover:scale-125 transition-transform" />
                            </Link>
                            <Link href="/private-tours" className="bg-white hover:bg-stone-50 text-stone-950 border border-stone-200 px-10 py-5 rounded-3xl font-black uppercase tracking-wider transition-all hover:border-sky-300 flex items-center justify-center gap-2">
                                <span>View Private Tours</span>
                            </Link>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.8 }}
                            className="flex items-center gap-6 pt-4"
                        >
                            <div className="flex -space-x-3">
                                {[1,2,3,4].map(idx => (
                                    <div key={idx} className="w-10 h-10 rounded-full border-2 border-white bg-stone-200 overflow-hidden ring-2 ring-sky-50">
                                        <img src={`https://i.pravatar.cc/100?img=${idx + 10}`} alt="User" />
                                    </div>
                                ))}
                                <div className="w-10 h-10 rounded-full border-2 border-white bg-sky-500 flex items-center justify-center text-[10px] font-black text-white ring-2 ring-sky-50">
                                    +2K
                                </div>
                            </div>
                            <div className="text-sm">
                                <p className="font-black text-stone-950">4.9/5 Rating</p>
                                <p className="text-stone-500 font-medium tracking-tight">from over 3,200 reviews</p>
                            </div>
                        </motion.div>
                    </div>

                    {/* RIGHT VISUAL (5 columns) */}
                    <div className="lg:col-span-5 relative hidden lg:block">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="relative w-full aspect-square"
                        >
                            {/* Main rounded image */}
                            <div className="absolute inset-0 rounded-[4rem] overflow-hidden shadow-2xl border-[12px] border-white z-10 rotate-3">
                                <Image
                                    src={rawImageUrl}
                                    alt="Rome Destination"
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>

                            {/* Decorative Floating Elements */}
                            <div className="absolute -top-12 -right-12 w-64 h-64 bg-sky-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse z-0" />
                            
                            {/* Card 1: 5-Star Experience */}
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -top-2 -left-12 z-20 bg-white p-4 rounded-3xl shadow-saas-xl flex items-center gap-4 border border-sky-50"
                            >
                                <div className="w-12 h-12 bg-sky-100 rounded-2xl flex items-center justify-center text-sky-600">
                                    <Star className="w-6 h-6 fill-sky-600" />
                                </div>
                                <div>
                                    <p className="font-black text-stone-950 text-sm">Best Selection</p>
                                    <p className="text-stone-500 text-xs font-bold uppercase tracking-widest">Premium Routes</p>
                                </div>
                            </motion.div>

                            {/* Card 2: Satisfaction */}
                            <motion.div
                                animate={{ y: [0, 10, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                                className="absolute -bottom-10 -right-8 z-20 bg-white p-6 rounded-[2rem] shadow-saas-xl border border-sky-50 max-w-[220px]"
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                                        <ShieldCheck className="w-6 h-6" />
                                    </div>
                                    <span className="font-black text-stone-950">Verified</span>
                                </div>
                                <p className="text-stone-600 text-sm font-medium">Over 50,000 successful bookings since 1987.</p>
                            </motion.div>
                        </motion.div>
                    </div>

                </div>

                {/* SEARCH BAR OVERLAY */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1 }}
                    className="mt-16 lg:absolute lg:bottom-0 lg:left-1/2 lg:-translate-x-1/2 lg:translate-y-1/2 w-full lg:max-w-5xl px-4 lg:px-0"
                >
                    <div className="bg-white p-6 rounded-[2.5rem] shadow-saas-xl border border-sky-100 flex flex-col md:flex-row items-center gap-4">
                        <div className="flex-1 w-full relative">
                            <label className="absolute left-6 top-3 text-[10px] font-black text-sky-500 uppercase tracking-widest">📍 Location</label>
                            <input
                                type="text"
                                placeholder="Where in Rome?"
                                className="w-full pt-8 pb-3 px-6 bg-stone-50 rounded-2xl border-none focus:ring-2 focus:ring-sky-200 outline-none text-stone-950 font-bold"
                                value={destination}
                                onChange={(e) => setDestination(e.target.value)}
                            />
                        </div>
                        
                        <div className="flex-1 w-full relative">
                            <label className="absolute left-6 top-3 text-[10px] font-black text-sky-500 uppercase tracking-widest">🗓 Date</label>
                            <input
                                type="date"
                                className="w-full pt-8 pb-3 px-6 bg-stone-50 rounded-2xl border-none focus:ring-2 focus:ring-sky-200 outline-none text-stone-950 font-bold"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </div>

                        <div className="flex-1 w-full relative">
                            <label className="absolute left-6 top-3 text-[10px] font-black text-sky-500 uppercase tracking-widest">👥 Attendees</label>
                            <select
                                className="w-full pt-8 pb-3 px-6 bg-stone-50 rounded-2xl border-none focus:ring-2 focus:ring-sky-200 outline-none text-stone-950 font-bold appearance-none"
                                value={guests}
                                onChange={(e) => setGuests(e.target.value)}
                            >
                                <option value="1">1 Person</option>
                                <option value="2">2 People</option>
                                <option value="4">4 People</option>
                                <option value="8">8 People (Group)</option>
                                <option value="10+">10+ People</option>
                            </select>
                        </div>

                        <button
                            onClick={handleSearch}
                            className="w-full md:w-auto px-10 py-5 bg-sky-500 hover:bg-stone-950 text-white rounded-2xl font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                        >
                            <Search className="w-5 h-5" />
                            <span>Search</span>
                        </button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
