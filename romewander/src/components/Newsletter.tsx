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
            <div className="bg-emerald-50 border-y border-emerald-100 py-12">
                <div className="container mx-auto px-4 text-center">
                    <div className="max-w-md mx-auto flex flex-col items-center gap-4">
                        <CheckCircle2 size={48} className="text-emerald-500" />
                        <h3 className="text-2xl font-bold text-gray-900">You're on the list!</h3>
                        <p className="text-gray-600">Thanks for subscribing. We'll send you the best of Rome shortly.</p>
                        <button
                            onClick={() => setStatus('idle')}
                            className="text-emerald-600 font-bold text-sm hover:underline mt-2"
                        >
                            Subscribe another email
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#FAF9F6] border-y border-gold/10 py-24">
            <div className="container mx-auto px-6 md:px-12">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12 max-w-7xl mx-auto">

                    {/* Left: Icon & Text */}
                    <div className="flex items-center gap-10 w-full lg:w-1/3 justify-center lg:justify-start">
                        <div className="relative">
                            <Mail size={48} strokeWidth={0.5} className="text-gold/40" />
                            <div className="absolute top-0 right-0 w-3 h-3 bg-gold rounded-full border-2 border-[#FAF9F6]" />
                        </div>
                        <div className="text-left">
                            <h3 className="font-serif text-2xl font-bold text-gray-900 italic">The Wanderlist</h3>
                            <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-gold mt-2">Private invitations and stories</p>
                        </div>
                    </div>

                    {/* Center: Input Form */}
                    <div className="w-full lg:w-1/3">
                        <form onSubmit={handleSubmit} className="flex items-center w-full max-w-md mx-auto bg-white border border-gold/20 p-1 focus-within:border-gold/50 transition-all shadow-sm">
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email Address"
                                className="flex-grow bg-transparent px-5 py-3 text-sm text-gray-900 outline-none placeholder:text-gray-300 font-serif italic"
                                disabled={status === 'loading'}
                            />
                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className="bg-gold hover:bg-[#B89740] text-white text-[10px] font-bold uppercase tracking-[0.2em] px-8 py-4 transition-colors disabled:opacity-50"
                            >
                                {status === 'loading' ? '...' : 'Request'}
                            </button>
                        </form>
                    </div>

                    {/* Right: Social Follow */}
                    <div className="w-full lg:w-1/3 flex flex-col items-center lg:items-end gap-3">
                        <span className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-gold">Social Sanctuary</span>
                        <div className="flex gap-4">
                            {[Facebook, Instagram, Twitter].map((Icon, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    className="block p-3 border border-gold/10 text-gold hover:bg-gold hover:text-white transition-all transform hover:-translate-y-1"
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
