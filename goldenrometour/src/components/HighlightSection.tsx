'use client';

import Link from 'next/link';
import Image from 'next/image';

interface HighlightSectionProps {
    eyebrow?: string;
    title: string;
    body: string;
    ctaText?: string;
    ctaHref?: string;
    imageUrl: string;
    imageAlt?: string;
    flip?: boolean; // flip = image on left
}

export default function HighlightSection({
    eyebrow = 'WHAT ARE WE HERE FOR?',
    title,
    body,
    ctaText = 'Explore Tours',
    ctaHref = '/',
    imageUrl,
    imageAlt = 'Rome Experience',
    flip = false,
}: HighlightSectionProps) {
    return (
        <section className="w-full py-20 bg-background">
            <div className="container mx-auto px-6">
                <div className={`flex flex-col ${flip ? 'lg:flex-row-reverse' : 'lg:flex-row'} min-h-[600px] rounded-[3rem] overflow-hidden shadow-3xl`}>
                    {/* Left: Text Block (Dark Purple) */}
                    <div
                        }
                        }
                        viewport={{ once: true }}
                        }
                        className="flex-1 flex flex-col justify-center p-12 lg:p-20 bg-secondary"
                    >
                        {eyebrow && (
                            <p className="text-primary font-heading font-bold uppercase tracking-tight text-[8px] mb-6">
                                {eyebrow}
                            </p>
                        )}
                        <h2 className="text-white font-heading text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-8 uppercase">
                            {title}
                        </h2>
                        <p className="text-white/60 font-body text-base md:text-lg leading-relaxed mb-10 max-w-md">
                            {body}
                        </p>
                        <Link
                            href={ctaHref}
                            className="self-start inline-flex items-center gap-4 bg-primary text-secondary px-10 py-5 font-heading font-bold tracking-tight text-[8px] hover:bg-white transition-all rounded-full uppercase"
                        >
                            {ctaText}
                        </Link>
                    </div>

                    {/* Right: Image */}
                    <div
                        }
                        }
                        viewport={{ once: true }}
                        }
                        className="flex-1 relative min-h-[400px] lg:min-h-0"
                    >
                        <Image
                            src={imageUrl}
                            alt={imageAlt}
                            fill
                            className="object-cover contrast-[1.1] brightness-90"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-secondary/40 to-transparent"></div>
                        
                        {/* Floating Badge */}
                        <div className="absolute bottom-12 right-12 bg-secondary/5 backdrop-blur-xl border border-primary/20 p-8 rounded-2xl shadow-2xl">
                             <p className="text-primary font-heading text-2xl md:text-3xl font-bold">24/7</p>
                             <p className="text-secondary/60 font-heading text-[8px] font-bold tracking-tight uppercase mt-1">Concierge Support</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
