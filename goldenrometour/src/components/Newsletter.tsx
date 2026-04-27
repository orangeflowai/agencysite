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
        <section className="relative py-32 bg-forest relative overflow-hidden">
            {/* Background Texture & Glow */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]"></div>
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
            
            <div className="container mx-auto px-8 md:px-16 relative z-10">
                <div className="glass-dark rounded-[4rem] p-10 md:p-20 border border-gold/10 relative group">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        
                        {/* Content */}
                        <div className="flex-1 space-y-8 text-center lg:text-left">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="inline-block px-5 py-2 rounded-full border border-gold/20 bg-gold/5"
                            >
                                <span className="font-sans text-[10px] font-bold  tracking-[0.4em] text-gold-light">Editorial Series</span>
                            </motion.div>
                            
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                                className="font-serif text-5xl md:text-7xl text-cream font-bold  leading-[0.9]"
                            >
                                Dispatch from the <span className="text-gold">Eternal City.</span>
                            </motion.h2>
                            
                            <motion.p
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="font-sans text-cream/60 text-lg md:text-xl leading-relaxed max-w-lg"
                            >
                                Join our inner circle for weekly architectural studies, private gallery access, and the untold stories of Golden Rome.
                            </motion.p>
                        </div>

                        {/* Form Area */}
                        <div className="w-full lg:w-1/3">
                            <AnimatePresence mode="wait">
                                {status === 'success' ? (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="bg-gold/10 border border-gold/20 rounded-[3rem] p-12 text-center backdrop-blur-xl"
                                    >
                                        <CheckCircle2 size={48} className="text-gold mx-auto mb-6" strokeWidth={1.5} />
                                        <h3 className="font-serif text-2xl text-cream mb-2 ">Correspondence Authenticated</h3>
                                        <p className="font-sans text-[10px]  font-bold tracking-widest text-gold/60">Welcome to the Private Archive</p>
                                        <button
                                            onClick={() => setStatus('idle')}
                                            className="mt-8 font-sans text-[9px] font-bold  tracking-widest text-gold-light hover:text-white transition-colors border-b border-gold-light/20 pb-1"
                                        >
                                            Register Another Dispatch
                                        </button>
                                    </motion.div>
                                ) : (
                                    <motion.form
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        onSubmit={handleSubmit}
                                        className="space-y-4"
                                    >
                                        <div className="relative group/input">
                                            <input
                                                type="email"
                                                required
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="CORRESPONDENCE@CLIENT.COM"
                                                className="w-full bg-cream/5 border border-gold/20 rounded-[2rem] px-8 py-6 text-cream text-[11px] font-bold  tracking-[0.2em] outline-none focus:border-gold transition-all backdrop-blur-sm"
                                                disabled={status === 'loading'}
                                            />
                                            <Mail className="absolute right-8 top-1/2 -translate-y-1/2 text-gold/30 group-focus-within/input:text-gold transition-colors" size={18} />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={status === 'loading'}
                                            className="w-full bg-gold hover:bg-gold-light text-forest py-6 rounded-[2rem] font-bold  tracking-[0.4em] text-[10px] transition-all flex items-center justify-center gap-3 overflow-hidden group/btn disabled:opacity-50"
                                        >
                                            {status === 'loading' ? (
                                                <div className="w-5 h-5 border-2 border-forest/30 border-t-forest rounded-full animate-spin"></div>
                                            ) : (
                                                <>
                                                    <span>Register Access</span>
                                                    <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                                                </>
                                            )}
                                        </button>
                                        <p className="text-[9px] text-center text-gold/30  font-bold tracking-widest mt-6">
                                            Private Correspondence. Zero Redundancy.
                                        </p>
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
