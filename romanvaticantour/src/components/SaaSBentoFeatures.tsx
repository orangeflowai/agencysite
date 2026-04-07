'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Clock, Users, ArrowRight, Ticket } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function SaaSBentoFeatures() {
    return (
        <section className="py-24 bg-neutral-50 border-y border-neutral-100">
            <div className="container mx-auto px-6 md:px-12">
                <div className="max-w-3xl mb-16">
                    <h2 className="text-sm font-bold tracking-widest text-theme-primary uppercase mb-3">The Premium Experience</h2>
                    <h3 className="text-4xl md:text-5xl font-bold text-neutral-900 leading-tight">
                        Everything you need for the perfect Roman holiday.
                    </h3>
                </div>

                <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 auto-rows-[300px]">
                    
                    {/* Bento Block 1: Large Feature (spans 2 columns) */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="relative group col-span-1 lg:col-span-2 row-span-1 rounded-3xl bg-neutral-900 overflow-hidden shadow-saas"
                    >
                        <Image 
                            src="https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1200&auto=format&fit=crop" 
                            alt="Vatican Art" 
                            fill 
                            className="object-cover opacity-50 group-hover:opacity-40 transition-opacity duration-500"
                        />
                        <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
                            <div className="bg-white/20 backdrop-blur-md w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                                <Users className="w-6 h-6 text-white" />
                            </div>
                            <h4 className="text-2xl font-bold text-white mb-2">Expert Local Storytellers</h4>
                            <p className="text-neutral-300 max-w-md">Our guides are licensed historians and archaeologists. They don't just show you Rome; they make you feel it.</p>
                        </div>
                    </motion.div>

                    {/* Bento Block 2: Skip the Line */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="col-span-1 border border-neutral-200 rounded-3xl bg-white p-8 flex flex-col shadow-saas hover:shadow-saas-md transition-shadow"
                    >
                        <div className="w-12 h-12 bg-sky-50 rounded-xl flex items-center justify-center mb-6">
                            <Clock className="w-6 h-6 text-theme-primary" />
                        </div>
                        <h4 className="text-xl font-bold text-neutral-900 mb-2">Zero Wait Time</h4>
                        <p className="text-neutral-500 flex-1">Pre-reserved priority entry to the Vatican Museums, Colosseum, and more. Save hours of standing in the sun.</p>
                        <div className="pt-6 mt-auto border-t border-neutral-100 flex items-center justify-between">
                            <span className="text-sm font-semibold text-neutral-900">Learn More</span>
                            <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center">
                                <ArrowRight className="w-4 h-4 text-neutral-900" />
                            </div>
                        </div>
                    </motion.div>

                    {/* Bento Block 3: Easy Cancellation */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="col-span-1 border border-neutral-200 rounded-3xl bg-white p-8 flex flex-col shadow-saas hover:shadow-saas-md transition-shadow"
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                                <ShieldCheck className="w-6 h-6 text-emerald-500" />
                            </div>
                            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Guarantee</span>
                        </div>
                        <h4 className="text-xl font-bold text-neutral-900 mb-2">Maximum Flexibility</h4>
                        <p className="text-neutral-500">Travel plans change. Enjoy free cancellation up to 24 hours before your tour starts.</p>
                    </motion.div>

                    {/* Bento Block 4: Instant Tickets */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="relative group col-span-1 lg:col-span-2 row-span-1 rounded-3xl bg-theme-primary overflow-hidden shadow-saas"
                    >
                        {/* Decorative pattern */}
                        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[size:20px_20px]"></div>
                        
                        <div className="relative h-full p-8 flex flex-col sm:flex-row items-center gap-8 z-10 text-white">
                            <div className="flex-1">
                                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mb-6">
                                    <Ticket className="w-6 h-6 text-white" />
                                </div>
                                <h4 className="text-2xl font-bold mb-2">Instant Ticket Delivery</h4>
                                <p className="text-sky-100 mb-6">Book online and get mobile tickets sent directly to your phone. No printing required, just scan and go.</p>
                                <Link href="/search" className="inline-flex items-center gap-2 bg-white text-theme-primary font-bold px-6 py-3 rounded-xl hover:bg-neutral-50 transition-colors">
                                    Find Tours <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                            
                            {/* Fake Ticket Mockup */}
                            <div className="hidden sm:flex w-64 h-full bg-white rounded-2xl shadow-saas-xl p-4 flex-col text-neutral-900 transform rotate-2 translate-y-6 group-hover:-translate-y-2 group-hover:rotate-0 transition-all duration-500">
                                <div className="border-b-2 border-dashed border-neutral-200 pb-4 mb-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-bold">Rome Tours</span>
                                        <div className="w-6 h-6 bg-theme-primary rounded-md flex items-center justify-center">
                                            <span className="text-white text-[10px] font-black">RV</span>
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-neutral-500 uppercase font-bold tracking-widest">Entry Ticket</p>
                                </div>
                                <div className="flex-1 flex items-center justify-center">
                                    <div className="w-32 h-32 bg-neutral-100 rounded-lg flex flex-col items-center justify-center border border-neutral-200">
                                        <div className="w-24 h-24 border-[4px] border-neutral-900 p-1 flex">
                                            <div className="flex-1 border border-neutral-900 border-dashed"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
