import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MessageCircle, Mail, MapPin, Phone, Star, Users, History, Ticket } from 'lucide-react';
import Image from "next/image";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-background selection:bg-primary selection:text-white font-sans">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                <div className="absolute inset-0 bg-primary/5 opacity-40" />
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold  tracking-[0.3em] mb-6">
                            Our Story
                        </span>
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading text-foreground mb-8">
                            Unlocking Rome, <br />
                            <span className="text-primary">One Story at a Time</span>
                        </h1>
                        <p className="text-xl text-muted-foreground leading-relaxed font-medium max-w-2xl mx-auto">
                            We're a group of Rome-obsessed locals who believe every ancient stone has a secret worth sharing.
                        </p>
                    </div>
                </div>
            </section>

            {/* Core Narrative */}
            <section className="py-20 bg-background border-y border-border">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto">
                        <div className="prose prose-lg mx-auto text-foreground/80 font-medium leading-relaxed space-y-8">
                            <p className="text-2xl font-serif font-bold  text-foreground border-l-4 border-primary pl-6">
                                "Gladiators once fought right here... and one of them probably complained about the traffic on the Via Sacra." 😄
                            </p>

                            <p>
                                That's the kind of magic we chase every day at <strong>Wonders of Rome</strong>.
                            </p>

                            <p>
                                We're not just tour operators—we're a bunch of Rome-obsessed locals who can't stop geeking out over this city. Our guides? They're the real deal: licensed historians, art lovers, food fanatics, and professional storytellers who grew up dodging tourists on scooters and sneaking gelato after school. They live and breathe Rome, and they want to share its wild, wonderful secrets with you.
                            </p>

                            <div className="bg-card p-8 rounded-3xl border border-border my-12 shadow-sm">
                                <h3 className="text-xl font-serif font-bold   tracking-tight text-primary mb-4">How it Started</h3>
                                <p className="mb-0 text-muted-foreground">
                                    Back in the day (okay, not that far back), a few of us got tired of seeing visitors rush through the Vatican lines, snap a quick selfie at the Trevi Fountain, and miss the real soul of the Eternal City. So we said: "Enough chaos. Let's make Rome feel like an adventure again."
                                </p>
                            </div>

                            <p>
                                We teamed up with official partners to grab those elusive skip-the-line tickets, early-morning slots, and underground access that most people only dream about. We crafted tours that feel personal—whether you're in a small group laughing over gladiator gossip, on a private journey with your family, or chasing hidden gems in Trastevere at sunset.
                            </p>

                            <p>
                                Today, over <strong>50,000 travelers</strong> have joined us, given us a shiny <strong>4.9/5 average rating</strong>, and left with stories they'll tell for years.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Promise */}
            <section className="py-24 bg-card overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-4xl md:text-6xl font-heading text-center mb-16">Our Promise to You</h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="bg-background p-10 rounded-[2rem] border border-border hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 group">
                                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <History className="text-primary w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-serif font-bold   tracking-tight text-foreground mb-4">No Boring Lectures</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">Just fun, fascinating stories that bring 2,800 years of history to life in a way you'll actually remember.</p>
                            </div>

                            <div className="bg-background p-10 rounded-[2rem] border border-border hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 group">
                                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <Ticket className="text-primary w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-serif font-bold   tracking-tight text-foreground mb-4">Zero Stress</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">We handle the lines, the crowds, and the "where do we meet?" panic. Your only job is to enjoy the view.</p>
                            </div>

                            <div className="bg-background p-10 rounded-[2rem] border border-border hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 group">
                                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <Users className="text-primary w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-serif font-bold   tracking-tight text-foreground mb-4">Memories that Stick</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">You'll leave feeling like you didn't just visit Rome—you lived a little piece of its vibrant soul.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact & CTA */}
            <section className="py-24 bg-background border-t border-border">
                <div className="container mx-auto px-4 text-center">
                    <div className="max-w-3xl mx-auto bg-foreground text-background p-12 lg:p-16 rounded-[3rem] shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
                        <h2 className="text-4xl md:text-6xl font-heading mb-6 relative z-10 text-white">Ready to unlock the Eternal City?</h2>
                        <p className="text-background/60 mb-10 text-lg relative z-10 font-mono  tracking-tighter">Browse our tours or ping us on WhatsApp—we're always up for a chat about Rome's next great adventure.</p>

                        <div className="grid sm:grid-cols-2 gap-6 mb-12 relative z-10">
                            <a href="https://wa.me/3514199425" className="flex items-center justify-center gap-3 bg-primary hover:opacity-90 text-white py-4 px-8 rounded-2xl font-bold transition-all transform hover:scale-[1.02]  tracking-widest text-xs">
                                <MessageCircle size={20} />
                                WhatsApp Chat
                            </a>
                            <Link href="/search" className="flex items-center justify-center gap-3 bg-primary hover:bg-primary/90 text-white py-4 px-8 rounded-2xl font-bold transition-all transform hover:scale-[1.02]  tracking-widest text-xs shadow-lg shadow-primary/30">
                                <Star size={20} className="fill-current" />
                                View All Tours
                            </Link>
                        </div>

                        <div className="flex flex-wrap justify-center gap-8 text-background/40 font-mono text-[10px]  tracking-[0.2em] pt-8 border-t border-white/5 relative z-10">
                            <div className="flex items-center gap-2"><Phone size={12} /> +39 351 419 9425</div>
                            <div className="flex items-center gap-2"><Mail size={12} /> info@wondersofrome.com</div>
                        </div>
                    </div>

                    <p className="mt-12 text-[10px] font-bold text-muted-foreground  tracking-[0.5em]">Wonders Of Rome // Official Archives.</p>
                </div>
            </section>

            <Footer />
            <WhatsAppButton />
        </main>
    );
}