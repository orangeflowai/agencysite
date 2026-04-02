'use client';

import { useState } from 'react';
import { Mail, Bell, Facebook, Instagram, Twitter, Linkedin, Youtube, CheckCircle2 } from 'lucide-react';

export default function Newsletter() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setStatus('loading');

        // Simulate API call for now (or connect to /api/contact in the future)
        setTimeout(() => {
            setStatus('success');
            setEmail('');
        }, 1000);
    };

    if (status === 'success') {
        return (
            <div className="bg-cream border-y border-forest/10 py-16">
                <div className="container mx-auto px-4 text-center">
                    <div className="max-w-md mx-auto flex flex-col items-center gap-6">
                        <CheckCircle2 size={64} strokeWidth={1} className="text-forest" />
                        <h3 className="font-serif text-3xl font-bold italic text-forest italic underline decoration-forest/10 underline-offset-8">Correspondence Received</h3>
                        <p className="font-sans text-[10px] uppercase font-black tracking-widest text-forest/60">Your access to the Editorial Series is confirmed.</p>
                        <button
                            onClick={() => setStatus('idle')}
                            className="font-sans text-[10px] font-black uppercase tracking-widest text-forest/40 hover:text-forest transition-colors border-b border-current"
                        >
                            Register another dispatch
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-cream border-y border-forest/10 py-20">
            <div className="container mx-auto px-8 md:px-16">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12 max-w-7xl mx-auto">

                    {/* Left: Icon & Text */}
                    <div className="flex items-center gap-8 w-full lg:w-1/3 justify-center lg:justify-start">
                        <div className="relative">
                            <Mail size={48} strokeWidth={1} className="text-forest/20" />
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-forest border border-cream flex items-center justify-center">
                                <span className="text-[10px] text-cream font-bold">!</span>
                            </div>
                        </div>
                        <div className="text-left">
                            <h3 className="font-serif text-2xl font-bold italic text-forest italic leading-none">Journal Updates</h3>
                            <p className="font-sans text-[10px] uppercase font-black tracking-widest text-forest/40 mt-2">Correspondence from Rome</p>
                        </div>
                    </div>

                    {/* Center: Input Form */}
                    <div className="w-full lg:w-1/3">
                        <form onSubmit={handleSubmit} className="flex items-center w-full max-w-md mx-auto bg-cream border border-forest/20 overflow-hidden focus-within:border-forest transition-all shadow-xl">
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email address for dispatch"
                                className="flex-grow bg-transparent px-6 py-4 text-[11px] font-black uppercase tracking-widest text-forest outline-none placeholder:text-forest/20"
                                disabled={status === 'loading'}
                            />
                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className="bg-forest hover:bg-forest-light text-cream text-[10px] font-black uppercase tracking-[0.4em] px-10 py-5 transition-all shadow-lg active:scale-95 disabled:opacity-50"
                            >
                                {status === 'loading' ? 'Sending' : 'Engage'}
                            </button>
                        </form>
                    </div>

                    {/* Right: Social Follow */}
                    <div className="w-full lg:w-1/3 flex flex-col items-center lg:items-end gap-3">
                        <span className="font-sans text-[10px] font-black uppercase tracking-[0.4em] text-forest/40">Connections</span>
                        <div className="flex gap-4">
                            {[
                                { Icon: Facebook, href: '#' },
                                { Icon: Instagram, href: '#' },
                                { Icon: Twitter, href: '#' },
                                { Icon: Youtube, href: '#' }
                            ].map(({ Icon, href }, i) => (
                                <a
                                    key={i}
                                    href={href}
                                    className="block p-3 border border-forest/10 text-forest/40 hover:text-forest hover:bg-forest/5 transition-all"
                                >
                                    <Icon size={16} />
                                </a>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
