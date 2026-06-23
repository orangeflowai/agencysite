'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function SpecialOffer() {
    const [timeLeft, setTimeLeft] = useState({ hours: 24, minutes: 0, seconds: 0 });

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
                if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
                if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
                return prev;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-background border-b border-primary/10">
            <div 
                }
                }
                viewport={{ once: true }}
                className="relative w-full bg-secondary rounded-[2rem] overflow-hidden shadow-2xl min-h-[496px] flex flex-col lg:flex-row items-stretch"
            >
                {/* Left Content */}
                <div className="flex-1 p-8 sm:p-12 md:p-16 lg:p-20 flex flex-col justify-center space-y-8 z-10">
                    <div>
                        <p className="text-primary font-heading font-bold uppercase tracking-tight text-[8px] mb-4">✦ Limited Protocol Offer ✦</p>
                        <h2 className="text-white font-heading text-7xl md:text-9xl leading-tight font-bold tracking-tighter">
                            30% <span className="text-primary">OFF</span>
                        </h2>
                    </div>
                    
                    <p className="text-white/60 font-body text-base md:text-lg leading-relaxed max-w-md">
                        On all Private Papal Audience packages and Sistine Chapel after-hours collection. Use code <span className="text-primary font-bold">VATICANO2025</span> at checkout.
                    </p>

                    <div className="flex flex-wrap gap-8 items-center">
                        <div className="flex items-center gap-3 text-primary">
                            <Clock size={20} />
                            <div className="flex gap-2 font-heading text-lg md:text-xl font-bold leading-tight">
                                <span>{String(timeLeft.hours).padStart(2, '0')}h</span>
                                <span>{String(timeLeft.minutes).padStart(2, '0')}m</span>
                                <span>{String(timeLeft.seconds).padStart(2, '0')}s</span>
                            </div>
                        </div>
                        <Link href="/search?offer=papal" className="bg-primary text-secondary px-10 py-5 font-heading font-bold tracking-tight text-xs uppercase hover:bg-white transition-all flex items-center gap-3 rounded-full">
                            <span>Claim Access</span>
                            <ArrowRight size={14} />
                        </Link>
                    </div>
                </div>

                {/* Right Image */}
                <div className="flex-1 relative min-h-[304px] lg:min-h-0">
                    <Image 
                        src="https://pub-772bbb33a07f4026aa9652a0cfef4c2e.r2.dev/rome%20photos/pexels-m-venter-1659437-13358908.jpg"
                        alt="Vatican Panorama"
                        fill
                        className="object-cover brightness-75 contrast-125"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-secondary via-transparent to-transparent hidden lg:block"></div>
                    
                    {/* Floating Decorative Cross */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-primary/20 rounded-full flex items-center justify-center animate-pulse">
                         <div className="w-px h-24 bg-primary/20"></div>
                         <div className="h-px w-24 bg-primary/20 absolute"></div>
                    </div>
                </div>

                {/* Background Textures */}
                <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]"></div>
            </div>
        </section>
    );
}
