import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CheckCircle2, Mail, Phone, MapPin, Ticket, Users, Award, ShieldCheck } from 'lucide-react';

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-white selection:bg-emerald-600 selection:text-white">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 bg-emerald-950 overflow-hidden">
                <div className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center opacity-20" />
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight mb-8">
                            Your Gateway to <br />
                            <span className="text-emerald-400 text-shadow-glow">The Eternal City</span>
                        </h1>
                        <p className="text-xl text-emerald-100/80 leading-relaxed font-medium max-w-2xl mx-auto">
                            Dedicated local experts committed to unlocking the magic of Rome for travelers from around the world.
                        </p>
                    </div>
                </div>
            </section>

            {/* Welcome Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-3xl font-black text-gray-900 mb-6 font-serif uppercase tracking-tight">Welcome to Tickets in Rome</h2>
                                <p className="text-lg text-gray-600 leading-relaxed mb-6 font-medium">
                                    We are a passionate team of local experts dedicated to unlocking the magic of Rome for travelers from around the world. With deep roots in the city, our licensed guides bring history, culture, and hidden stories to life, turning every tour into an unforgettable adventure.
                                </p>
                                <p className="text-lg text-gray-600 leading-relaxed font-medium italic border-l-4 border-emerald-600 pl-6 py-2 bg-emerald-50/50 rounded-r-xl">
                                    "Our mission is simple: to help you feel like a true explorer in Rome — not just a visitor."
                                </p>
                            </div>
                            <div className="relative">
                                <div className="aspect-square bg-emerald-100 rounded-[3rem] overflow-hidden relative">
                                    <div className="absolute inset-0 bg-emerald-900/10 flex items-center justify-center p-8 text-center">
                                        <p className="text-2xl font-black text-emerald-900 leading-tight">Expert local guides, truly passionate about share Rome's legends.</p>
                                    </div>
                                </div>
                                <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center text-white">
                                            <Award size={24} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-gray-900">4.9/5 Rating</p>
                                            <p className="text-xs text-gray-500 font-bold uppercase">Trusted Partner</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* specialization */}
            <section className="py-24 bg-emerald-50/50">
                <div className="container mx-auto px-4">
                    <div className="max-w-5xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">Curated, Stress-Free Experiences</h2>
                            <p className="text-gray-600 font-medium">We specialize in letting you skip the long lines and dive straight into the heart of Rome.</p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { title: "Skip-the-Line", desc: "Priority access to major attractions like the Vatican & Colosseum.", icon: <Ticket /> },
                                { title: "Local Experts", desc: "Licensed historians and storytellers with deep city knowledge.", icon: <Users /> },
                                { title: "Exclusive Entry", desc: "Early morning slots and restricted underground access.", icon: <ShieldCheck /> },
                                { title: "Handpicked", desc: "Private journeys and small groups for an intimate feel.", icon: <Award /> }
                            ].map((item, i) => (
                                <div key={i} className="bg-white p-8 rounded-3xl border border-emerald-100 hover:shadow-xl transition-all duration-300 group">
                                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                        {item.icon}
                                    </div>
                                    <h3 className="text-lg font-black text-gray-900 mb-2">{item.title}</h3>
                                    <p className="text-sm text-gray-500 leading-relaxed font-medium">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Detailed Content */}
            <section className="py-24 bg-white overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto">
                        <div className="prose prose-lg prose-emerald mx-auto text-gray-700 font-medium leading-relaxed space-y-8">
                            <h3 className="text-3xl font-black text-gray-900">What sets us apart?</h3>
                            <ul className="list-none pl-0 space-y-6">
                                <li className="flex gap-4">
                                    <div className="mt-1.5"><CheckCircle2 className="text-emerald-600 w-6 h-6 shrink-0" /></div>
                                    <div>
                                        <p className="font-bold text-gray-900 m-0">Expert local guides</p>
                                        <p className="m-0 text-gray-600">Knowledgeable, engaging, and truly passionate about sharing Rome's legends, art, and everyday charm.</p>
                                    </div>
                                </li>
                                <li className="flex gap-4">
                                    <div className="mt-1.5"><CheckCircle2 className="text-emerald-600 w-6 h-6 shrink-0" /></div>
                                    <div>
                                        <p className="font-bold text-gray-900 m-0">Official Tour Operator & priority access</p>
                                        <p className="m-0 text-gray-600">Ensuring smooth, hassle-free visits to top sites with official priority vouchers.</p>
                                    </div>
                                </li>
                                <li className="flex gap-4">
                                    <div className="mt-1.5"><CheckCircle2 className="text-emerald-600 w-6 h-6 shrink-0" /></div>
                                    <div>
                                        <p className="font-bold text-gray-900 m-0">Trusted by travelers</p>
                                        <p className="m-0 text-gray-600">Rated 4.9/5 stars with thousands of glowing reviews and over 50,000 happy explorers.</p>
                                    </div>
                                </li>
                                <li className="flex gap-4">
                                    <div className="mt-1.5"><CheckCircle2 className="text-emerald-600 w-6 h-6 shrink-0" /></div>
                                    <div>
                                        <p className="font-bold text-gray-900 m-0">Personalized & flexible</p>
                                        <p className="m-0 text-gray-600">Whether you're seeking iconic landmarks, hidden gems, or tailored private tours.</p>
                                    </div>
                                </li>
                            </ul>

                            <p className="text-xl font-bold text-emerald-900 bg-emerald-50 p-8 rounded-[2rem] border border-emerald-100 text-center leading-relaxed">
                                Ready to experience Rome, curated and unlocked?
                                <br />
                                <Link href="/" className="inline-block mt-4 text-emerald-600 underline hover:no-underline">Browse our tours</Link> or contact us — we're here to make your Eternal City visit extraordinary.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-20 bg-gray-50 border-t border-gray-100">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="bg-white rounded-[2rem] p-10 lg:p-16 shadow-xl border border-gray-100">
                        <h2 className="text-2xl font-black text-gray-900 mb-10 text-center uppercase tracking-widest">Questions? Reach us at:</h2>
                        <div className="grid md:grid-cols-2 gap-10">
                            <div className="flex flex-col items-center text-center group">
                                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-[1.5rem] flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                                    <Mail size={32} />
                                </div>
                                <h3 className="font-black text-gray-900 mb-2 uppercase tracking-wide">Email Us</h3>
                                <a href="mailto:info@ticketsinrome.com" className="text-emerald-600 font-bold text-lg hover:underline transition-colors">info@ticketsinrome.com</a>
                            </div>
                            <div className="flex flex-col items-center text-center group">
                                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-[1.5rem] flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                                    <Phone size={32} />
                                </div>
                                <h3 className="font-black text-gray-900 mb-2 uppercase tracking-wide">Call / WhatsApp</h3>
                                <a href="tel:3517869798" className="text-emerald-600 font-bold text-lg hover:underline transition-colors">351 786 9798</a>
                            </div>
                        </div>
                        <div className="mt-16 text-center pt-10 border-t border-gray-100">
                            <p className="text-sm font-black text-gray-400 uppercase tracking-[0.3em]">Tickets In Rome.</p>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
