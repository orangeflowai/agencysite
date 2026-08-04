'use client';

import React from 'react';
import { Header } from "@/components/header";
import { FooterSection } from "@/components/sections/footer-section";
import { Mail, Phone, MapPin, MessageSquare, Clock, Globe } from 'lucide-react';

const contactInfo = [
    {
        title: "Email Us",
        description: "For booking inquiries and support.",
        value: "info@wondersofrome.com",
        icon: <Mail className="w-6 h-6" />,
        href: "mailto:info@wondersofrome.com"
    },
    {
        title: "Call Us",
        description: "Direct line to our Roman office.",
        value: "+39 351 419 9425",
        icon: <Phone className="w-6 h-6" />,
        href: "tel:+393514199425"
    },
    {
        title: "WhatsApp",
        description: "Quick chat with our team.",
        value: "Message us on WhatsApp",
        icon: <MessageSquare className="w-6 h-6" />,
        href: "https://wa.me/393514199425"
    },
    {
        title: "Visit Us",
        description: "Our office in the heart of Rome.",
        value: "Via Tunisi 43, 00192 Roma",
        icon: <MapPin className="w-6 h-6" />,
        href: "https://goo.gl/maps/xyz"
    }
];

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-background">
            <Header />
            
            <div className="max-w-7xl mx-auto px-6 py-24 md:py-32 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                    {/* Left Column: Info */}
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Contact Us</h1>
                        <p className="text-muted-foreground text-lg mb-12 max-w-lg">
                            Have questions about our tours or need help with a booking? 
                            Our team of Roman experts is here to assist you.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            {contactInfo.map((item) => (
                                <a 
                                    key={item.title} 
                                    href={item.href}
                                    target={item.href.startsWith('http') ? '_blank' : undefined}
                                    className="group p-6 border border-border rounded-3xl hover:border-foreground transition-all"
                                >
                                    <div className="mb-4 text-foreground group-hover:scale-110 transition-transform origin-left">
                                        {item.icon}
                                    </div>
                                    <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                                    <p className="text-xs text-muted-foreground mb-3">{item.description}</p>
                                    <p className="text-sm font-semibold group-hover:text-primary transition-colors">{item.value}</p>
                                </a>
                            ))}
                        </div>

                        <div className="mt-12 p-8 bg-muted rounded-3xl">
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Clock className="w-5 h-5" />
                                Opening Hours
                            </h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Monday – Friday</span>
                                    <span className="font-semibold">09:00 – 18:00 (CET)</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Saturday – Sunday</span>
                                    <span className="font-semibold">10:00 – 16:00 (CET)</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Placeholder for Map or Form */}
                    <div className="relative h-[600px] rounded-3xl overflow-hidden border border-border bg-muted">
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12">
                            <Globe className="w-12 h-12 text-muted-foreground mb-4 animate-pulse" />
                            <h3 className="text-xl font-bold mb-2">Find us in Rome</h3>
                            <p className="text-muted-foreground mb-6 max-w-xs">
                                Our office is located just steps away from the Vatican Museums entrance.
                            </p>
                            <div className="text-sm font-mono bg-background border border-border px-4 py-2 rounded-full">
                                41.9072° N, 12.4547° E
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <FooterSection />
        </main>
    );
}
