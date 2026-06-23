'use client';

import Link from 'next/link';
import { ArrowRight, Star, MapPin, Users } from 'lucide-react';
import Image from "next/image";

export default function BookingCTA() {
    return (
        <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
            {/* Parallax Background */}
            <div className="absolute inset-0 z-0">
                <div 
                    }
                    }
                    }
                    className="relative w-full h-full"
                >
                    <Image fill  
                        src="https://pub-772bbb33a07f4026aa9652a0cfef4c2e.r2.dev/rome%20photos/pexels-m-venter-1659437-13358908.jpg" 
                        alt="Vatican Aerial View" 
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-secondary/80 backdrop-blur-[4px]"></div>
                </div>
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-6 text-center space-y-12">
                <div
                    }
                    }
                    viewport={{ once: true }}
                    className="space-y-6"
                >
                    <p className="text-primary font-heading font-bold uppercase tracking-tight text-[8px]">✦ Your Sacred Journey Awaits ✦</p>
                    <h2 className="text-white font-heading text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-tight max-w-4xl mx-auto uppercase">
                        Vaticano Is Your <span className="font-vibes text-primary lowercase block md:inline italic">Sacred Journey Platform.</span>
                    </h2>
                </div>

                {/* Stats */}
                <div 
                    }
                    }
                    viewport={{ once: true }}
                    }
                    className="flex flex-wrap justify-center gap-12 md:gap-24"
                >
                    <div className="flex flex-col items-center gap-2">
                        <Users className="text-primary w-6 h-6" />
                        <p className="text-white font-heading text-2xl md:text-3xl font-bold">15,000+</p>
                        <p className="text-white/50 font-heading text-[8px] font-bold tracking-tight uppercase">Verified Pilgrims</p>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <MapPin className="text-primary w-6 h-6" />
                        <p className="text-white font-heading text-2xl md:text-3xl font-bold">48</p>
                        <p className="text-white/50 font-heading text-[8px] font-bold tracking-tight uppercase">Curated Routes</p>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <Star className="text-primary w-6 h-6" />
                        <p className="text-white font-heading text-2xl md:text-3xl font-bold">4.9/5</p>
                        <p className="text-white/50 font-heading text-[8px] font-bold tracking-tight uppercase">Sacred Rating</p>
                    </div>
                </div>

                <div
                    }
                    }
                    viewport={{ once: true }}
                    }
                >
                    <Link href="/search" className="inline-flex items-center gap-4 bg-primary text-secondary px-16 py-6 font-heading font-bold tracking-tight text-[8px] hover:bg-white transition-all rounded-full shadow-2xl uppercase">
                        <span>Start Your Journey</span>
                        <ArrowRight size={16} />
                    </Link>
                </div>
            </div>

            {/* Decorative Borders */}
            <div className="absolute top-12 left-12 right-12 bottom-12 border border-primary/10 pointer-events-none"></div>
            <div className="absolute top-16 left-16 right-16 bottom-16 border border-primary/5 pointer-events-none"></div>
        </section>
    );
}
