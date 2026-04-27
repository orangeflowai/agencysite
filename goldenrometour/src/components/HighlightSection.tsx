'use client';

import { motion } from 'framer-motion';
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
        <section className="w-full">
            <div className={`flex flex-col ${flip ? 'lg:flex-row-reverse' : 'lg:flex-row'} min-h-[480px]`}>
                {/* Left: Text Block */}
                <motion.div
                    initial={{ opacity: 0, x: flip ? 32 : -32 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="flex-1 flex flex-col justify-center px-10 md:px-16 lg:px-20 py-16 lg:py-24"
                    style={{ backgroundColor: '#555B02' }}
                >
                    {eyebrow && (
                        <p
                            className="text-[10px] font-bold  tracking-[0.3em] mb-5 opacity-60"
                            style={{ color: '#F5F0E8' }}
                        >
                            {eyebrow}
                        </p>
                    )}
                    <h2
                        className="font-serif font-bold leading-tight mb-6"
                        style={{ fontSize: 'clamp(28px, 3.5vw, 48px)', color: '#F5F0E8' }}
                    >
                        {title}
                    </h2>
                    <p
                        className="text-base leading-relaxed mb-8 max-w-md"
                        style={{ color: 'rgba(245, 240, 232, 0.65)' }}
                    >
                        {body}
                    </p>
                    <Link
                        href={ctaHref}
                        className="self-start inline-flex items-center gap-2 font-bold  tracking-[0.2em] text-sm py-3 px-8 rounded-full transition-all hover:scale-105 shadow-xl"
                        style={{ backgroundColor: '#555B02', color: '#F5F0E8' }}
                    >
                        {ctaText}
                    </Link>
                </motion.div>

                {/* Right: Masked Image on Pattern */}
                <motion.div
                    initial={{ opacity: 0, x: flip ? -32 : 32 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.15 }}
                    className="flex-1 relative flex items-center justify-center py-12 px-8 lg:p-0 min-h-[360px] lg:min-h-0 overflow-hidden"
                    style={{
                        backgroundColor: '#F5F0E8',
                        backgroundImage: `
                            linear-gradient(rgba(26,18,16,0.05) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(26,18,16,0.05) 1px, transparent 1px)
                        `,
                        backgroundSize: '40px 40px',
                    }}
                >
                    {/* Large blob/circle masked image */}
                    <div
                        className="relative w-full max-w-sm aspect-[4/5] shadow-2xl overflow-hidden"
                        style={{
                            borderRadius: '60% 40% 60% 40% / 60% 60% 40% 40%',
                            boxShadow: '0 32px 80px rgba(26,18,16,0.25)',
                        }}
                    >
                        <Image
                            src={imageUrl}
                            alt={imageAlt}
                            fill
                            sizes="(max-width: 768px) 90vw, 50vw"
                            className="object-cover hover:scale-105 transition-transform duration-700"
                            priority
                        />
                    </div>

                    {/* Decorative floating badge */}
                    <div
                        className="absolute top-8 right-8 lg:top-12 lg:right-12 w-20 h-20 rounded-full flex flex-col items-center justify-center text-center shadow-lg"
                        style={{ backgroundColor: '#1A1210', color: '#F5F0E8' }}
                    >
                        <span className="font-serif font-bold text-xl leading-none">50K</span>
                        <span className="text-[9px] font-bold  tracking-wider leading-tight mt-0.5 opacity-80">Guests</span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
