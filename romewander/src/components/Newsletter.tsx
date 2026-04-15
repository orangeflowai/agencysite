'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, CheckCircle2, ArrowRight } from 'lucide-react';

export default function Newsletter() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setStatus('loading');
        setTimeout(() => {
            setStatus('success');
            setEmail('');
        }, 1200);
    };

    return (
        <section className="relative py-32 bg-[#0A0A0A] overflow-hidden">
            {/* Sacred Atmosphere */}
            <div className="absolute inset-0 bg-[#0A0A0A]"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-gold/10 to-transparent blur-[120px]"></div>
            
            <div className="container mx-auto px-6 relative z-10">
                <div className="glass-dark rounded-[4rem] p-10 md:p-24 border border-gold/10 relative group overflow-hidden backdrop-blur-xl bg-white/5">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-[0.05]"></div>
                    
                    <div className="flex flex-col lg:flex-row items-center gap-20">
                        {/* Left: Philosophy */}
                        <div className="flex-1 space-y-8 text-center lg:text-left">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="inline-block px-6 py-2 rounded-full border border-gold/20 bg-gold/5 backdrop-blur-md"
                            >
                                <span className="font-sans text-[10px] uppercase tracking-[0.4em] text-gold font-bold">Sacred Sanctuary</span>
                            </motion.div>
                            
                            <motion.h2
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                                className="font-serif text-5xl md:text-8xl text-white font-bold italic leading-[0.9] tracking-tight"
                            >
                                The <span className="text-gold">Wander</span> List.
                            </motion.h2>
                            
                            <motion.p
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="font-serif text-gray-400 text-xl md:text-2xl italic leading-relaxed max-w-lg"
                            >
                                Private invitations to Rome's most guarded sanctuaries. Stories of light, stone, and the sacred pulse of the city.
                            </motion.p>
                        </div>

                        {/* Right: Invitation Form */}
                        <div className="w-full lg:w-2/5">
                            <AnimatePresence mode="wait">
                                {status === 'success' ? (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-gold/5 border border-gold/20 rounded-[3rem] p-12 text-center backdrop-blur-2xl"
                                    >
                                        <div className="w-20 h-20 bg-gold rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-gold/20">
                                            <CheckCircle2 size={40} className="text-black" strokeWidth={1.5} />
                                        </div>
                                        <h3 className="font-serif text-3xl text-white mb-4 italic">Invitation Accepted</h3>
                                        <p className="font-sans text-[10px] uppercase font-bold tracking-[0.2em] text-gold/60">The first Chapter arrives soon.</p>
                                    </motion.div>
                                ) : (
                                    <motion.form
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        onSubmit={handleSubmit}
                                        className="space-y-6"
                                    >
                                        <div className="relative">
                                            <input
                                                type="email"
                                                required
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="Requesting Access (Email)"
                                                className="w-full bg-white/5 border border-gold/10 rounded-2xl px-10 py-7 text-white text-lg font-serif italic outline-none focus:border-gold/30 focus:bg-white/10 transition-all backdrop-blur-xl"
                                                disabled={status === 'loading'}
                                            />
                                            <Mail className="absolute right-10 top-1/2 -translate-y-1/2 text-gold/40" size={20} strokeWidth={1} />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={status === 'loading'}
                                            className="w-full bg-gold hover:bg-[#B89740] text-black py-7 rounded-2xl font-bold uppercase tracking-[0.4em] text-[11px] transition-all flex items-center justify-center gap-4 group/btn disabled:opacity-50 shadow-2xl shadow-gold/10"
                                        >
                                            {status === 'loading' ? (
                                                <div className="w-6 h-6 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                                            ) : (
                                                <>
                                                    <span>Request Invitation</span>
                                                    <ArrowRight size={16} className="group-hover/btn:translate-x-2 transition-transform" />
                                                </>
                                            )}
                                        </button>
                                        <div className="flex items-center justify-center gap-4 mt-8">
                                            <div className="h-px flex-1 bg-gold/10"></div>
                                            <span className="text-[10px] text-gold/30 uppercase font-black tracking-widest whitespace-nowrap">Sacred Privacy Assured</span>
                                            <div className="h-px flex-1 bg-gold/10"></div>
                                        </div>
                                    </motion.form>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
