'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { SUPABASE_BUCKET_URL } from '@/lib/constants';
import Image from 'next/image';
import { Search, Star, MoveRight, CheckCircle2 } from 'lucide-react';

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

    const rawImageUrl = settings?.heroImage?.asset?.url || `${SUPABASE_BUCKET_URL}/hero-poster.jpg`;
    
    const handleSearch = () => {
        const params = new URLSearchParams();
        if (destination) params.set('q', destination);
        if (date) params.set('date', date);
        router.push(`/search?${params.toString()}`);
    };

    return (
        <section className="relative min-h-[90vh] w-full flex items-center pt-28 pb-20 bg-white overflow-hidden border-b border-gray-100">
            {/* Subtle Grid Background for SaaS feel */}
            <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            
            <div className="container mx-auto px-6 md:px-12 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    
                    {/* LEFT CONTENT */}
                    <div className="space-y-8 max-w-2xl">
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center gap-2 bg-neutral-100 text-neutral-800 px-4 py-1.5 rounded-full border border-neutral-200"
                        >
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                            <span className="text-xs font-semibold tracking-wide uppercase">New VIP Access Routes Added</span>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.1 }}
                        >
                            <h1 className="text-6xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tight text-neutral-950 leading-[1.05]">
                                The Vatican. <br />
                                <span className="text-theme-primary">Skipping the line</span> is just the start.
                            </h1>
                        </motion.div>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.2 }}
                            className="text-xl text-neutral-600 max-w-xl leading-relaxed"
                        >
                            {settings?.heroSubtitle || "Join over 50,000 travelers who have unlocked Rome through exclusive access, expert storytelling, and zero waiting."}
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.3 }}
                            className="flex flex-col sm:flex-row gap-4 pt-4"
                        >
                            <Link href="/search" className="bg-neutral-950 hover:bg-neutral-800 text-white px-8 py-4 rounded-xl font-semibold transition-all shadow-saas flex items-center justify-center gap-3 group">
                                Browse All Tours
                                <MoveRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link href="#vatican" className="bg-white hover:bg-neutral-50 text-neutral-950 border border-neutral-200 px-8 py-4 rounded-xl font-semibold transition-all shadow-sm flex items-center justify-center">
                                View Bestsellers
                            </Link>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.7, delay: 0.5 }}
                            className="flex items-center gap-6 pt-6 border-t border-neutral-100"
                        >
                            <div className="flex items-center gap-2">
                                <div className="flex -space-x-2">
                                    {[1,2,3,4].map(idx => (
                                        <div key={idx} className="w-8 h-8 rounded-full border-2 border-white bg-neutral-200 overflow-hidden">
                                            <img src={`https://i.pravatar.cc/100?img=${idx + 10}`} alt="User" />
                                        </div>
                                    ))}
                                </div>
                                <div className="flex flex-col ml-2">
                                    <div className="flex text-amber-400">
                                        {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                                    </div>
                                    <span className="text-xs font-semibold text-neutral-600">4.9/5 from 3,200+ reviews</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* RIGHT VISUAL: SaaS Bento Style */}
                    <div className="relative hidden lg:block h-full min-h-[600px]">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="absolute right-0 top-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-gradient-to-tr from-sky-400/20 to-blue-500/5 rounded-full blur-3xl -z-10"
                        ></motion.div>
                        
                        {/* Main Container simulating an application/feature card */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative z-10 w-full h-[550px] bg-white rounded-3xl shadow-saas-xl border border-neutral-100 overflow-hidden flex flex-col"
                        >
                            {/* Fake Browser/App Header */}
                            <div className="h-12 border-b border-neutral-100 bg-neutral-50/50 flex items-center px-4 gap-2">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                                </div>
                                <div className="mx-auto w-1/2 h-6 bg-white rounded-md border border-neutral-200 text-[10px] text-center text-neutral-400 font-medium flex items-center justify-center leading-none">
                                    romanvaticantour.com
                                </div>
                            </div>

                            <div className="relative flex-1 bg-neutral-100">
                                <Image
                                    src={rawImageUrl}
                                    alt="Vatican Overview"
                                    fill
                                    className="object-cover"
                                />
                                {/* Overlay UI elements */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                                
                                {/* SaaS style interactive widget floating over image */}
                                <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-saas border border-white/40">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <h3 className="font-bold text-neutral-900 flex items-center gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Availability Check
                                            </h3>
                                        </div>
                                    </div>
                                    
                                    <div className="flex gap-3">
                                        <div className="flex-1 bg-white rounded-xl border border-neutral-200 p-1 flex items-center">
                                           <input 
                                             type="text" 
                                             className="w-full bg-transparent border-none text-sm px-3 py-2 outline-none font-medium text-neutral-700" 
                                             placeholder="Destination or Tour..."
                                             value={destination}
                                             onChange={(e) => setDestination(e.target.value)}
                                           />
                                        </div>
                                        <div className="flex-1 bg-white rounded-xl border border-neutral-200 p-1 flex items-center">
                                           <input 
                                             type="date" 
                                             className="w-full bg-transparent border-none text-sm px-3 py-2 outline-none font-medium text-neutral-700" 
                                             value={date}
                                             onChange={(e) => setDate(e.target.value)}
                                           />
                                        </div>
                                        <button onClick={handleSearch} className="bg-theme-primary text-white p-3 rounded-xl hover:bg-theme-primary-dark transition-colors">
                                            <Search className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
}
