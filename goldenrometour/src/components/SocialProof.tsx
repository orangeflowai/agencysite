'use client';

import { Star, Quote } from 'lucide-react';

const reviews = [
    { name: "James H.",       location: "USA",       text: "We did the Rome in a Day tour with Sev and it was phenomenal. He was an encyclopedia of knowledge!", rating: 5 },
    { name: "Maria G.",       location: "UK",        text: "Francesca made the Vatican Museums come alive. Skip-the-line access was a lifesaver.", rating: 5 },
    { name: "Robert D.",      location: "Australia", text: "The Colosseum underground was the highlight. Walking on the arena floor felt surreal.", rating: 5 },
    { name: "Sophie Bennett", location: "France",    text: "Efficient, fun, and so informative. We saw everything we wanted without the stress.", rating: 5 },
    { name: "Alessandro R.",  location: "Italy",     text: "Even as a local, I learned so much from Roberta. The hidden gems tour is a must.", rating: 5 },
    { name: "Chen Wei",       location: "Singapore", text: "Totally worth it for the early morning access to the Sistine Chapel. Magical experience.", rating: 5 },
];

function ReviewCard({ review }: { review: typeof reviews[0] }) {
    return (
        <div className="w-[336px] bg-background border border-primary/20 p-10 flex-shrink-0 relative rounded-3xl shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
            <Quote className="absolute top-6 right-6 text-primary/10" size={48} />
            <div className="flex items-center space-x-1 mb-6">
                {[...Array(5)].map((_, i) => <Star key={i} size={14} className="fill-primary text-primary" />)}
            </div>
            <p className="font-heading text-lg text-secondary leading-[1.4] mb-8 min-h-[64px] uppercase tracking-tight">
                &ldquo;{review.text}&rdquo;
            </p>
            <div className="flex items-center gap-4 pt-6 border-t border-secondary/10">
                <div className="w-10 h-10 border border-primary/30 flex items-center justify-center text-xs font-heading font-bold text-secondary bg-primary/5 rounded-full">
                    {review.name.charAt(0)}
                </div>
                <div>
                    <p className="font-heading text-[8px] font-bold text-secondary tracking-tight uppercase">{review.name}</p>
                    <p className="font-heading text-[8px] text-secondary/50 tracking-tight uppercase">{review.location}</p>
                </div>
            </div>
        </div>
    );
}

export default function SocialProof() {
    return (
        <section className="py-32 bg-background text-secondary border-t border-primary/10 relative overflow-hidden">
            {/* Editorial Header */}
            <div className="container mx-auto px-8 md:px-16 relative z-10 mb-20 text-center md:text-left">
                <div className="max-w-3xl">
                    <span
                        }
                        }
                        viewport={{ once: true }}
                        className="font-heading text-[8px] font-bold tracking-tighter text-primary/60 uppercase"
                    >
                        Client Testimonials
                    </span>
                    <h2 
                        }
                        }
                        viewport={{ once: true }}
                        }
                        className="font-heading text-5xl md:text-7xl font-bold mt-6 leading-none text-secondary uppercase"
                    >
                        Verified Path <br />
                        <span className="text-primary">Documentation.</span>
                    </h2>
                    <div className="flex items-center gap-6 mt-10 justify-center md:justify-start">
                        <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => <Star key={i} size={20} className="fill-primary text-primary" />)}
                        </div>
                        <span className="font-heading text-[8px] font-bold tracking-tight opacity-60 uppercase">Avg Rating 4.9/5</span>
                    </div>
                </div>
            </div>

            {/* Editorial Marquee */}
            <div className="relative w-full overflow-hidden border-y border-primary/10 py-12 bg-background/50 backdrop-blur-sm">
                <div className="flex gap-10 w-max animate-marquee">
                    {[...reviews, ...reviews].map((review, i) => (
                        <ReviewCard key={i} review={review} />
                    ))}
                </div>
            </div>

            {/* Corporate/Partner Strip */}
            <div className="container mx-auto px-8 mt-20 flex flex-wrap justify-center gap-12 opacity-30">
                <span className="font-heading text-2xl font-bold tracking-tighter uppercase">TripAdvisor Private</span>
                <span className="font-heading text-2xl font-bold tracking-tighter uppercase">Google Elite</span>
                <span className="font-heading text-2xl font-bold tracking-tighter uppercase">The Roman Guild</span>
            </div>
        </section>
    );
}
