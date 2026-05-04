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
        <section className="relative py-32 bg-background overflow-hidden">
            {/* Background Texture & Glow */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]"></div>
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
            
            <div className="container mx-auto px-8 md:px-16 relative z-10">
                <div className="bg-white/5 backdrop-blur-3xl rounded-[4rem] p-10 md:p-20 border border-primary/10 relative group">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        
                        {/* Content */}
                        <div className="flex-1 space-y-8 text-center lg:text-left">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="inline-block px-5 py-2 rounded-full border border-primary/20 bg-primary/5"
                            >
                                <span className="font-heading text-[10px] font-bold tracking-tight text-primary/80 uppercase">Editorial Series</span>
                            </motion.div>
                            
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                                className="font-heading text-5xl md:text-7xl text-secondary font-bold  leading-[0.9] uppercase"
                            >
                                Dispatch from the <span className="text-primary">Eternal City.</span>
                            </motion.h2>
                            
                            <motion.p
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="font-body text-secondary/60 text-lg md:text-xl leading-relaxed max-w-lg"
                            >
                                Join our inner circle for weekly architectural studies, private gallery access, and the untold stories of the Vaticano.
                            </motion.p>
                        </div>

                        {/* Form Area */}
                        <div className="w-full lg:w-1/3">
                            <AnimatePresence mode="wait">
                                {status === 'success' ? (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="bg-primary/10 border border-primary/20 rounded-[3rem] p-12 text-center backdrop-blur-xl"
                                    >
                                        <CheckCircle2 size={48} className="text-primary mx-auto mb-6" strokeWidth={1.5} />
                                        <h3 className="font-heading text-2xl text-secondary mb-2 uppercase">Correspondence Authenticated</h3>
                                        <p className="font-heading text-[10px] font-bold tracking-tight text-primary uppercase">Welcome to the Private Archive</p>
                                        <button
                                            onClick={() => setStatus('idle')}
                                            className="mt-8 font-heading text-[9px] font-bold tracking-tight text-primary hover:text-secondary transition-colors border-b border-primary/20 pb-1 uppercase"
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
                                                className="w-full bg-white/5 border border-primary/20 rounded-[2rem] px-8 py-6 text-secondary text-[11px] font-bold tracking-tight outline-none focus:border-primary transition-all backdrop-blur-sm"
                                                disabled={status === 'loading'}
                                            />
                                            <Mail className="absolute right-8 top-1/2 -translate-y-1/2 text-primary/30 group-focus-within/input:text-primary transition-colors" size={18} />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={status === 'loading'}
                                            className="w-full bg-primary hover:bg-white text-secondary py-6 rounded-[2rem] font-heading font-bold tracking-tight text-[10px] transition-all flex items-center justify-center gap-3 overflow-hidden group/btn disabled:opacity-50 uppercase shadow-2xl"
                                        >
                                            {status === 'loading' ? (
                                                <div className="w-5 h-5 border-2 border-secondary/30 border-t-secondary rounded-full animate-spin"></div>
                                            ) : (
                                                <>
                                                    <span>Register Access</span>
                                                    <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                                                </>
                                            )}
                                        </button>
                                        <p className="text-[9px] text-center text-primary/30 font-heading font-bold tracking-tight mt-6 uppercase">
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
