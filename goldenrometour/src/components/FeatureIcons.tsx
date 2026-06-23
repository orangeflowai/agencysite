'use client';

import { ShieldCheck, UserCheck, Heart, Calendar, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const features = [
    {
        icon: ShieldCheck,
        title: "Exclusive Access",
        desc: "Bypass standard queues with our official Vatican partnership protocols."
    },
    {
        icon: UserCheck,
        title: "Certified Guides",
        desc: "Led by vetted art historians and archaeologists with deep local roots."
    },
    {
        icon: Heart,
        title: "Community of Faith",
        desc: "A shared journey for those seeking the spiritual heart of the Eternal City."
    },
    {
        icon: Calendar,
        title: "Easy Planning",
        desc: "Streamlined coordination for a seamless, sacred travel experience."
    }
];

export default function FeatureIcons() {
    return (
        <section className="py-24 bg-background border-y border-primary/10">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-secondary uppercase tracking-tight">Why Choose <span className="text-primary">Vaticano</span></h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
                    {features.map((feature, i) => (
                        <div
                            key={i}
                            className="flex flex-col items-center text-center space-y-4"
                        >
                            <div className="text-primary mb-2">
                                <feature.icon size={48} strokeWidth={1} />
                            </div>
                            <h3 className="font-heading text-lg font-bold text-secondary uppercase tracking-tight">{feature.title}</h3>
                            <p className="font-body text-sm leading-relaxed text-secondary/60 max-w-[200px]">
                                {feature.desc}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <Link href="/about" className="inline-flex items-center gap-2 bg-secondary text-white px-8 py-4 rounded-full font-heading font-bold tracking-tight text-[8px] uppercase hover:bg-primary hover:text-secondary transition-all">
                        Find Out More <ArrowRight size={14} />
                    </Link>
                </div>
            </div>
        </section>
    );
}
