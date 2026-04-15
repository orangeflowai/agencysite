'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Clock, Users, ArrowRight, Ticket } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function SaaSBentoFeatures() {
    return (
        <section className="py-24 bg-neutral-50 border-y border-neutral-100 relative overflow-hidden">
            {/* Background dynamic elements */}
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-sky-100/30 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-emerald-100/20 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2"></div>

            <div className="container mx-auto px-6 md:px-12 relative z-10">
                <div className="max-w-3xl mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-xs font-black tracking-[0.3em] text-theme-primary uppercase mb-3 px-4 py-1.5 bg-sky-50 inline-block rounded-full border border-sky-100">
                            The Premium Experience
                        </h2>
                    </motion.div>
                    <motion.h3 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-950 leading-[1.1] tracking-tight mt-6"
                    >
                        Everything you need for the <span className="text-theme-primary">perfect</span> Roman holiday.
                    </motion.h3>
                </div>

                <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 auto-rows-[320px]">
                    
                    {/* Bento Block 1: Large Feature (spans 2 columns) */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="relative group col-span-1 lg:col-span-2 row-span-1 rounded-[2.5rem] bg-neutral-950 overflow-hidden shadow-2xl border border-white/10"
                    >
                        <Image 
                            src="https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=85&w=1200&auto=format&fit=crop" 
                            alt="Vatican Art" 
                            fill 
                            className="object-cover opacity-60 group-hover:opacity-40 group-hover:scale-105 transition-all duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent pointer-events-none"></div>
                        
                        <div className="absolute inset-x-0 bottom-0 p-10 flex flex-col items-start">
                            <div className="glass-white backdrop-blur-2xl w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border border-white/20 shadow-lg">
                                <Users className="w-7 h-7 text-white" />
                            </div>
                            <h4 className="text-3xl font-bold text-white mb-3 tracking-tight">Expert Local Storytellers</h4>
                            <p className="text-neutral-300 max-w-lg text-lg leading-relaxed">Our guides are licensed historians and archaeologists. They don't just show you Rome; they make you feel it.</p>
                        </div>
                    </motion.div>

                    {/* Bento Block 2: Skip the Line */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="col-span-1 border border-neutral-200/60 rounded-[2.5rem] bg-white p-10 flex flex-col shadow-xl hover:shadow-2xl hover:border-sky-200 transition-all duration-500 relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-sky-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-sky-100 transition-colors"></div>
                        
                        <div className="w-14 h-14 bg-sky-50 rounded-2xl flex items-center justify-center mb-8 border border-sky-100 group-hover:scale-110 transition-transform duration-500">
                            <Clock className="w-7 h-7 text-theme-primary" />
                        </div>
                        <h4 className="text-2xl font-bold text-neutral-900 mb-3 tracking-tight">Zero Wait Time</h4>
                        <p className="text-neutral-500 text-lg leading-relaxed flex-1">Pre-reserved priority entry to the Vatican Museums, Colosseum, and more. Save hours of standing in the sun.</p>
                        
                        <div className="pt-8 mt-auto border-t border-neutral-100 flex items-center justify-between">
                            <span className="text-sm font-bold uppercase tracking-widest text-neutral-900">Learn More</span>
                            <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center group-hover:bg-theme-primary group-hover:text-white transition-all duration-300">
                                <ArrowRight className="w-5 h-5" />
                            </div>
                        </div>
                    </motion.div>

                    {/* Bento Block 3: Easy Cancellation */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="col-span-1 border border-neutral-200/60 rounded-[2.5rem] bg-white p-10 flex flex-col shadow-xl hover:shadow-2xl hover:border-emerald-200 transition-all duration-500 relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-emerald-100 transition-colors"></div>
                        
                        <div className="flex justify-between items-start mb-8">
                            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center border border-emerald-100 group-hover:scale-110 transition-transform duration-500">
                                <ShieldCheck className="w-7 h-7 text-emerald-500" />
                            </div>
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border border-emerald-200">
                                Guarantee
                            </span>
                        </div>
                        <h4 className="text-2xl font-bold text-neutral-900 mb-3 tracking-tight">Maximum Flexibility</h4>
                        <p className="text-neutral-500 text-lg leading-relaxed">Travel plans change. Enjoy free cancellation up to 24 hours before your tour starts.</p>
                    </motion.div>

                    {/* Bento Block 4: Instant Tickets */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="relative group col-span-1 lg:col-span-2 row-span-1 rounded-[2.5rem] bg-theme-primary overflow-hidden shadow-2xl transition-all duration-500"
                        style={{ background: 'linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%)' }}
                    >
                        {/* Decorative pattern */}
                        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[size:24px_24px]"></div>
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                        
                        <div className="relative h-full p-10 flex flex-col md:flex-row items-center gap-10 z-10 text-white">
                            <div className="flex-1">
                                <div className="glass-white backdrop-blur-2xl w-14 h-14 rounded-2xl flex items-center justify-center mb-8 border border-white/20 shadow-lg">
                                    <Ticket className="w-7 h-7 text-white" />
                                </div>
                                <h4 className="text-3xl font-bold mb-4 tracking-tight">Instant Ticket Delivery</h4>
                                <p className="text-sky-50/90 text-lg leading-relaxed mb-8">Book online and get mobile tickets sent directly to your phone. No printing required, just scan and go.</p>
                                <Link href="/search" className="inline-flex items-center gap-3 bg-white text-theme-primary font-black uppercase tracking-widest text-xs px-8 py-4 rounded-2xl hover:bg-neutral-50 transition-all hover:scale-105 shadow-xl">
                                    Find Tours <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                            
                            {/* Fake Ticket Mockup with enhanced styling */}
                            <div className="hidden md:flex w-72 h-full bg-white rounded-3xl shadow-2xl p-6 flex-col text-neutral-900 transform rotate-3 translate-y-12 group-hover:translate-y-4 group-hover:rotate-0 transition-all duration-700">
                                <div className="border-b-2 border-dashed border-neutral-100 pb-6 mb-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 bg-theme-primary rounded-md flex items-center justify-center">
                                                <span className="text-white text-[8px] font-black">RV</span>
                                            </div>
                                            <span className="font-black text-xs uppercase tracking-tighter">RomanVatican</span>
                                        </div>
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                    </div>
                                    <p className="text-[10px] text-neutral-400 uppercase font-black tracking-widest leading-none">Official Entry Ticket</p>
                                    <p className="text-lg font-serif font-bold mt-2">Sistine Chapel Privé</p>
                                </div>
                                <div className="flex-1 flex flex-col items-center justify-center gap-4">
                                    <div className="w-40 h-40 bg-neutral-50 rounded-2xl flex items-center justify-center border border-neutral-100 relative group/qr">
                                        <div className="w-32 h-32 border-2 border-neutral-900 overflow-hidden p-1.5 flex items-center justify-center">
                                            <div className="w-full h-full bg-[radial-gradient(circle_at_center,_black_1.5px,_transparent_1.5px)] bg-[size:6px_6px] opacity-80"></div>
                                        </div>
                                    </div>
                                    <p className="font-mono text-[10px] text-neutral-400">#RV-2026-X991</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
