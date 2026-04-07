'use client';

import { ShieldCheck, Award, ThumbsUp, Headset } from 'lucide-react';

export default function TrustBadges() {
    return (
        <div className="w-full bg-white border-y border-neutral-100 py-12">
            <div className="container mx-auto px-6">
                <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-neutral-400 mb-8">Trusted by travel partners worldwide</p>
                
                <div className="flex flex-wrap justify-center md:justify-between items-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="w-6 h-6 text-neutral-800" />
                        <span className="font-bold text-neutral-800 text-lg">SecureBooking</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Award className="w-6 h-6 text-neutral-800" />
                        <span className="font-bold text-neutral-800 text-lg">TripAdvisor <span className="font-normal">Excellence</span></span>
                    </div>
                    <div className="flex items-center gap-2">
                        <ThumbsUp className="w-6 h-6 text-neutral-800" />
                        <span className="font-bold text-neutral-800 text-lg">50K+ <span className="font-normal">Verified Tours</span></span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Headset className="w-6 h-6 text-neutral-800" />
                        <span className="font-bold text-neutral-800 text-lg">24/7 <span className="font-normal">Concierge</span></span>
                    </div>
                </div>
            </div>
        </div>
    );
}
