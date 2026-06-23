'use client';

import { Map, Ticket, Plane } from 'lucide-react';

const steps = [
    {
        icon: Map,
        title: "Choose Destination",
        desc: "Browse our curated collection of architectural gems and sacred sites across the Eternal City."
    },
    {
        icon: Ticket,
        title: "Reserve Your Place",
        desc: "Secure your exclusive access with our streamlined booking protocol and encrypted payment gateway."
    },
    {
        icon: Plane,
        title: "Begin Your Pilgrimage",
        desc: "Meet your historian guide and step beyond the standard path into the heart of Roman heritage."
    }
];

export default function Steps() {
    return (
        <section className="py-24 md:py-32 bg-background relative overflow-hidden border-b border-primary/10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16 md:mb-20 max-w-2xl mx-auto">
                    <p className="text-[8px] font-heading font-bold uppercase tracking-tight text-primary mb-4">✦ Operational Protocol ✦</p>
                    <h2 className="text-4xl md:text-5xl font-heading font-bold leading-tight tracking-tighter text-secondary uppercase">
                        Your Sacred Journey <br /> in <span className="font-vibes text-primary lowercase">3 Easy Steps.</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 relative">
                    {/* Connector Line */}
                    <div className="hidden md:block absolute top-1/4 left-[10%] right-[10%] h-px bg-primary/20 -z-0"></div>

                    {steps.map((step, i) => (
                        <div
                            key={i}
                            }
                            }
                            viewport={{ once: true }}
                            }
                            className="flex flex-col items-center text-center space-y-8 relative z-10"
                        >
                            <div className="w-24 h-24 rounded-full bg-background flex items-center justify-center text-primary border border-primary/10 shadow-xl group hover:bg-primary hover:text-white transition-all duration-500">
                                <step.icon size={36} strokeWidth={1.5} className="group-hover:scale-110 transition-transform" />
                            </div>
                            <div className="space-y-4 max-w-xs">
                                <h3 className="text-lg md:text-xl font-heading font-bold leading-tight tracking-tight text-secondary uppercase">
                                    <span className="text-primary/30 mr-2">0{i + 1}.</span>
                                    {step.title}
                                </h3>
                                <p className="text-base font-body leading-relaxed text-secondary/60">
                                    {step.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Background Decorative Element */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-background/30 -skew-x-12 translate-x-1/2"></div>
        </section>
    );
}
