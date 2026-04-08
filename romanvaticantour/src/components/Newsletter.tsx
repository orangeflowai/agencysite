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
        <div className="bg-[#F8FAFC] border-y border-slate-200 py-24">
            <div className="container mx-auto px-6 md:px-12">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12 max-w-7xl mx-auto">

                    {/* Left: Icon & Text */}
                    <div className="flex items-center gap-8 w-full lg:w-1/3 justify-center lg:justify-start">
                        <div className="w-16 h-16 rounded-2xl bg-sky-500/10 flex items-center justify-center">
                            <Mail size={32} className="text-sky-600" />
                        </div>
                        <div className="text-left">
                            <h3 className="text-xl font-black text-slate-900 tracking-tight">Stay Synced</h3>
                            <p className="text-sm text-slate-500">Weekly drops of Roman logic.</p>
                        </div>
                    </div>

                    {/* Center: Input Form */}
                    <div className="w-full lg:w-1/3">
                        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center w-full max-w-md mx-auto gap-2">
                            <div className="relative w-full">
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 text-sm text-slate-900 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition-all shadow-sm"
                                    disabled={status === 'loading'}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className="w-full sm:w-auto shrink-0 bg-sky-600 hover:bg-sky-700 text-white text-sm font-bold rounded-2xl px-8 py-4 shadow-lg shadow-sky-500/20 transition-all active:scale-95 disabled:opacity-50"
                            >
                                {status === 'loading' ? '...' : 'Join'}
                            </button>
                        </form>
                    </div>

                    {/* Right: Social Follow */}
                    <div className="w-full lg:w-1/3 flex flex-col items-center lg:items-end gap-3">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Connect</span>
                        <div className="flex gap-3">
                            {[Facebook, Instagram, Twitter].map((Icon, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    className="p-3 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-sky-600 hover:border-sky-200 hover:shadow-md transition-all"
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
