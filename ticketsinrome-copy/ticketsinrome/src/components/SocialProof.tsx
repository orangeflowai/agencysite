
'use client';

import { Star, CheckCircle, Quote } from 'lucide-react';
import { motion } from 'framer-motion';

const reviews = [
    {
        name: "James H.",
        location: "United States",
        text: "The 'Rome in a Day' tour with Sev was phenomenal. He was an absolute encyclopedia of history and made every stop feel personal.",
        rating: 5
    },
    {
        name: "Maria G.",
        location: "United Kingdom",
        text: "Francesca made the Vatican Museums come alive for our kids. Skip-the-line access was a complete lifesaver in the heat!",
        rating: 5
    },
    {
        name: "Robert D.",
        location: "Australia",
        text: "Walking on the Colosseum arena floor felt surreal. The guides' passion for archaeology is truly infectious.",
        rating: 5
    },
    {
        name: "Sophie Bennett",
        location: "France",
        text: "Efficient, fun, and so informative. We saw the best of Rome without the typical tourist stress. Highly recommend.",
        rating: 5
    },
    {
        name: "Elena M.",
        location: "Spain",
        text: "The early morning Sistine Chapel tour was magical. Seeing it before the crowds arrive is worth every penny.",
        rating: 5
    },
    {
        name: "Chen Wei",
        location: "Singapore",
        text: "Perfect organization from start to finish. Our guide managed the timing perfectly so we never felt rushed.",
        rating: 5
    }
];

export default function SocialProof() {
    return (
        <section className="py-24 bg-emerald-900 text-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

            <div className="container mx-auto px-4 relative z-10 mb-16">
                <div className="flex flex-col md:flex-row items-center justify-between gap-12 text-center md:text-left">

                    {/* Left: Stats */}
                    <div className="flex-1 space-y-6">
                        <div className="inline-flex items-center space-x-2 bg-emerald-800/50 px-4 py-2 rounded-full border border-emerald-700/50 backdrop-blur-sm">
                            <CheckCircle size={16} className="text-emerald-400" />
                            <span className="text-sm font-bold tracking-wider uppercase text-emerald-100">Official Partner</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black leading-none tracking-tight">
                            Trusted by over <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-200">50,000+</span> Travelers
                        </h2>
                        <div className="flex flex-col sm:flex-row items-center gap-6 justify-center md:justify-start">
                            <div className="flex items-center space-x-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={24} className="fill-yellow-400 text-yellow-400" />
                                ))}
                            </div>
                            <span className="text-lg font-medium text-emerald-100">
                                <strong className="text-white">4.9/5</strong> Average Rating
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scrolling Reviews Marquee */}
            <div className="relative w-full overflow-hidden">
                {/* Gradients to fade edges */}
                <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-emerald-900 to-transparent z-10 pointer-events-none"></div>
                <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-emerald-900 to-transparent z-10 pointer-events-none"></div>

                <motion.div
                    className="flex gap-6 whitespace-nowrap pl-4"
                    animate={{ x: [0, -1000] }} // Adjust logic for seamless loop if needed, simplistic for now
                    transition={{
                        repeat: Infinity,
                        ease: "linear",
                        duration: 30,
                    }}
                >
                    {/* Simple variety for seamless illusion */}
                    {[...reviews, ...reviews].map((review, i) => (
                        <div key={i} className="w-[350px] bg-white/10 backdrop-blur-md border border-white/10 p-6 rounded-2xl flex-shrink-0 hover:bg-white/15 transition-colors cursor-pointer relative group">
                            <Quote className="absolute top-4 right-4 text-emerald-500/20 group-hover:text-emerald-400/40 transition-colors" size={40} />

                            <div className="flex items-center space-x-1 mb-3">
                                {[...Array(5)].map((_, stars) => (
                                    <Star key={stars} size={14} className="fill-yellow-400 text-yellow-400" />
                                ))}
                            </div>

                            <p className="text-emerald-50 text-base font-medium leading-relaxed whitespace-normal mb-4 min-h-[48px]">
                                "{review.text}"
                            </p>

                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-xs font-bold text-white shadow-inner">
                                    {review.name.charAt(0)}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-white">{review.name}</span>
                                    <span className="text-xs text-emerald-200">{review.location}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
