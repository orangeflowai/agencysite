'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, CheckCircle2, ArrowRight, Facebook, Instagram, Twitter } from 'lucide-react';

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
        <section className="relative py-24 bg-[#413c33] overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="glass rounded-[3rem] p-8 md:p-16 border border-white/10 overflow-hidden relative group">
                    <div className="absolute inset-0 bg-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
                        {/* Content */}
                        <div className="max-w-xl text-center lg:text-left space-y-6">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20"
                            >
                                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                                <span className="text-[10px] font-black uppercase tracking-widest text-primary">Exclusive Access</span>
                            </motion.div>
                            
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                                className="text-4xl md:text-5xl font-serif font-bold text-white tracking-tight leading-[0.95]"
                            >
                                Join the <span className="text-accent italic font-serif">RomanVatican</span> Inner Circle.
                            </motion.h2>
                            
                            <motion.p
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="text-stone-400 text-lg leading-relaxed font-medium font-sans"
                            >
                                Weekly dispatches from the heart of Rome. Secret openings, private access alerts, and architectural logic delivered to your inbox.
                            </motion.p>
                        </div>

                        {/* Form Area */}
                        <div className="w-full max-w-md">
                            <AnimatePresence mode="wait">
                                {status === 'success' ? (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="bg-primary/10 border border-primary/20 rounded-3xl p-10 text-center backdrop-blur-md"
                                    >
                                        <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/30">
                                            <CheckCircle2 size={32} className="text-white" />
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-2 font-serif">Authenticated.</h3>
                                        <p className="text-stone-400 text-sm mb-6 font-sans">Welcome to the network. Your first dispatch is on its way.</p>
                                        
                                        {/* Social Links */}
                                        <div className="flex flex-wrap gap-3 justify-center">
                                            <>
                                                    <Link href="/" aria-label="Facebook" className="w-10 h-10 rounded-2xl bg-stone-800/50 flex items-center justify-center text-stone-400 hover:bg-primary hover:text-white transition-all duration-300 backdrop-blur-sm">
                                                        <Facebook size={18} />
                                                    </Link>
                                                    <Link href="/" aria-label="Instagram" className="w-10 h-10 rounded-2xl bg-stone-800/50 flex items-center justify-center text-stone-400 hover:bg-primary hover:text-white transition-all duration-300 backdrop-blur-sm">
                                                        <Instagram size={18} />
                                                    </Link>
                                                    <Link href="/" aria-label="Twitter" className="w-10 h-10 rounded-2xl bg-stone-800/50 flex items-center justify-center text-stone-400 hover:bg-primary hover:text-white transition-all duration-300 backdrop-blur-sm">
                                                        <Twitter size={18} />
                                                    </Link>
                                                </>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.form
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        onSubmit={handleSubmit}
                                        className="relative p-2 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2rem] flex flex-col sm:flex-row gap-2"
                                    >
                                        <div className="flex-1 relative">
                                            <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-500 w-5 h-5" />
                                            <input
                                                type="email"
                                                required
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="vatican-concierge@brand.com"
                                                className="w-full bg-transparent border-none px-14 py-6 text-white placeholder:text-stone-600 outline-none text-sm font-medium font-sans"
                                                disabled={status === 'loading'}
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={status === 'loading'}
                                            className="bg-primary hover:bg-primary/90 text-white px-10 py-6 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-3 overflow-hidden group/btn disabled:opacity-50"
                                        >
                                            {status === 'loading' ? (
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            ) : (
                                                <>
                                                    <span className="font-sans">Connect</span>
                                                    <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                                                </>
                                            )}
                                        </button>
                                    </motion.form>
                                )}
                            </AnimatePresence>
                            <p className="mt-6 text-[10px] text-center lg:text-left text-stone-500 uppercase tracking-widest font-bold font-sans">
                                Zero Spam. High Bitrate Travel Intelligence.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
