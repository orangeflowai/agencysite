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
        <div className="bg-stone-900 border-y border-stone-800 py-12">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-8 max-w-7xl mx-auto">

                    {/* Left: Icon & Text */}
                    <div className="flex items-center gap-6 w-full lg:w-1/3 justify-center lg:justify-start">
                        <div className="relative">
                            <Mail size={48} strokeWidth={1} className="text-gray-600" />
                            <Bell size={24} className="absolute -bottom-2 -right-2 text-sky-400 fill-stone-900 bg-stone-900 rounded-full p-0.5" />
                        </div>
                        <div className="text-left">
                            <h3 className="text-xl font-bold text-white">Get Updates & More</h3>
                            <p className="text-sm text-gray-400">Thoughtful thoughts to your inbox</p>
                        </div>
                    </div>

                    {/* Center: Input Form */}
                    <div className="w-full lg:w-1/3">
                        <form onSubmit={handleSubmit} className="flex items-center w-full max-w-md mx-auto bg-stone-800 border border-stone-700 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-sky-500/20 transition-all shadow-sm">
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Your email address"
                                className="flex-grow bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-gray-500"
                                disabled={status === 'loading'}
                            />
                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className="bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold uppercase tracking-widest px-6 py-4 transition-colors disabled:opacity-50"
                            >
                                {status === 'loading' ? '...' : 'Subscribe'}
                            </button>
                        </form>
                    </div>

                    {/* Right: Social Follow */}
                    <div className="w-full lg:w-1/3 flex flex-col items-center lg:items-end gap-2">
                        <span className="text-sm font-bold text-white">Follow Us</span>
                        <div className="flex gap-4">
                            {[
                                { Icon: Facebook, href: '#' },
                                { Icon: Instagram, href: '#' },
                                { Icon: Twitter, href: '#' },
                                { Icon: Youtube, href: '#' },
                                { Icon: Linkedin, href: '#' }
                            ].map(({ Icon, href }, i) => (
                                <a
                                    key={i}
                                    href={href}
                                    className="block p-2 rounded-full bg-stone-800 text-gray-400 hover:bg-sky-600 hover:text-white transition-all transform hover:-translate-y-1"
                                >
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
