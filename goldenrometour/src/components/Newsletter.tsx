'use client';

import { useState } from 'react';
import { Mail, CheckCircle2, ArrowRight } from 'lucide-react';

export default function Newsletter() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        setStatus('loading');
        // Simulate API call
        setTimeout(() => {
            setStatus('success');
            setEmail('');
        }, 1200);
    };

    return (
        <section className="relative py-24 bg-background overflow-hidden">
            <div className="container mx-auto px-4 sm:px-8 md:px-16 relative z-10">
                <div className="bg-card rounded-3xl p-8 md:p-16 border border-border shadow-xl">
                    <div className="flex flex-col lg:flex-row items-center gap-12">

                        {/* Content */}
                        <div className="flex-1 space-y-6 text-center lg:text-left">
                            <span className="inline-block px-4 py-1.5 rounded-full border border-accent/20 bg-accent/5 text-xs font-semibold text-accent uppercase tracking-widest">
                                Rome Insiders
                            </span>

                            <h2 className="text-4xl md:text-5xl font-serif text-foreground font-bold leading-tight">
                                Travel tips & exclusive<br />
                                <span className="text-accent">Rome updates</span>
                            </h2>

                            <p className="text-muted-foreground text-base leading-relaxed max-w-md">
                                Join 15,000+ travelers getting insider tips, skip-the-line secrets, and exclusive offers for Rome&apos;s top attractions.
                            </p>
                        </div>

                        {/* Form */}
                        <div className="w-full lg:w-96">
                            {status === 'success' ? (
                                <div className="bg-accent/5 border border-accent/20 rounded-2xl p-10 text-center">
                                    <CheckCircle2 size={40} className="text-accent mx-auto mb-4" />
                                    <h3 className="text-xl font-bold text-foreground mb-2">You&apos;re in!</h3>
                                    <p className="text-sm text-muted-foreground">Check your inbox for a welcome email.</p>
                                    <button
                                        onClick={() => setStatus('idle')}
                                        className="mt-6 text-sm font-semibold text-accent hover:underline"
                                    >
                                        Subscribe another email
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="your@email.com"
                                            className="w-full bg-muted border border-border rounded-xl pl-11 pr-4 py-4 text-foreground text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                                            disabled={status === 'loading'}
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={status === 'loading'}
                                        className="w-full bg-foreground hover:bg-accent text-background hover:text-foreground py-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-lg"
                                    >
                                        {status === 'loading' ? (
                                            <div className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <span>Subscribe — It&apos;s Free</span>
                                                <ArrowRight size={16} />
                                            </>
                                        )}
                                    </button>
                                    <p className="text-xs text-center text-muted-foreground">
                                        No spam, ever. Unsubscribe at any time.
                                    </p>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
