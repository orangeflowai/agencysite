'use client';

import React from 'react';

const VIDEO_URL = 'https://pub-772bbb33a07f4026aa9652a0cfef4c2e.r2.dev/rome%20photos/Video_Generation_Complete.mp4';

export default function Hero() {
    return (
        <section className="relative w-full h-[80vh] min-h-[600px] overflow-hidden bg-black flex flex-col justify-center">
            {/* Video background */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <video
                    autoPlay loop muted playsInline preload="auto"
                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                    src={VIDEO_URL}
                />
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 md:px-16">
                <p className="text-xs tracking-[0.3em] uppercase font-bold mb-8 text-white/80">
                    RomeWander · Exclusive Tours
                </p>

                <h1 className="leading-tight mb-8 max-w-4xl font-bold text-5xl md:text-8xl text-white">
                    Discover Rome <br />
                    <span className="italic text-primary">with Purpose</span>
                </h1>

                <p className="max-w-2xl mb-12 leading-relaxed text-lg md:text-xl text-white/90 font-medium">
                    Curated Vatican and Colosseum experiences for the discerning traveler. 
                    Skip the lines and uncover the stories of the Eternal City.
                </p>

                <div className="flex flex-col sm:flex-row gap-6">
                    <a href="#vatican" className="px-12 py-5 bg-primary text-white font-bold rounded-full hover:scale-105 transition-transform">
                        Explore Vatican
                    </a>
                    <a href="#colosseum" className="px-12 py-5 border-2 border-white text-white font-bold rounded-full hover:bg-white hover:text-black transition-all">
                        Ancient Rome
                    </a>
                </div>
            </div>
        </section>
    );
}
