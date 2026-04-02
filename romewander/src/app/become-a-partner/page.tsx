
import React from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { TrendingUp, Users, Globe, ShieldCheck, ArrowRight, Mail } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
    title: 'Become a Partner | ${process.env.NEXT_PUBLIC_SITE_NAME || "Your Agency"}',
    description: 'Partner with Rome\'s leading tour provider. Earn high commissions and offer unforgettable experiences to your clients.',
};

export default function BecomeAPartner() {
    return (
        <main className="min-h-screen bg-cream selection:bg-olive selection:text-white">
            <Navbar />

            {/* Hero Section */}
            <div className="relative bg-emerald-900 text-white overflow-hidden">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
                <div className="container mx-auto px-4 py-32 relative z-10 text-center">
                    <span className="inline-block py-1 px-3 rounded-full bg-emerald-800 border border-emerald-700 text-emerald-100 text-sm font-bold tracking-wider mb-6">B2B PARTNERSHIP</span>
                    <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight leading-none">
                        Grow with <span className="text-emerald-400">${process.env.NEXT_PUBLIC_SITE_NAME || "Your Agency"}</span>
                    </h1>
                    <p className="text-emerald-100 text-xl md:text-2xl max-w-2xl mx-auto font-medium mb-10 leading-relaxed">
                        Join our network of travel agencies, influencers, and affiliates. Offer your clients exclusive skip-the-line access to Rome's wonders.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a href="mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL || "info@yourdomain.com"}" className="px-8 py-4 bg-white text-emerald-900 font-bold rounded-lg hover:bg-emerald-50 transition-all transform hover:-translate-y-1 shadow-lg shadow-emerald-900/50 flex items-center gap-2">
                            <Mail size={20} />
                            Contact Partnership Team
                        </a>
                        <Link href="#benefits" className="px-8 py-4 bg-transparent border border-emerald-700 text-white font-bold rounded-lg hover:bg-emerald-800 transition-all">
                            Explore Benefits
                        </Link>
                    </div>
                </div>
            </div>

            {/* Stats / Trust */}
            <div className="bg-emerald-800 py-12 border-t border-emerald-700">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-4xl font-black text-white mb-1">50k+</div>
                            <div className="text-emerald-200 text-sm uppercase tracking-wider font-bold">Happy Travelers</div>
                        </div>
                        <div>
                            <div className="text-4xl font-black text-white mb-1">4.9/5</div>
                            <div className="text-emerald-200 text-sm uppercase tracking-wider font-bold">Average Rating</div>
                        </div>
                        <div>
                            <div className="text-4xl font-black text-white mb-1">24/7</div>
                            <div className="text-emerald-200 text-sm uppercase tracking-wider font-bold">Partner Support</div>
                        </div>
                        <div>
                            <div className="text-4xl font-black text-white mb-1">100%</div>
                            <div className="text-emerald-200 text-sm uppercase tracking-wider font-bold">Booking Guarantee</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Benefits Section */}
            <div id="benefits" className="py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16 max-w-3xl mx-auto">
                        <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6">Why Partner With Us?</h2>
                        <p className="text-lg text-gray-600 leading-relaxed">
                            We don't just sell tickets; we create memories. Partnering with us means giving your clients the best possible experience in Rome while growing your business.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Benefit 1 */}
                        <div className="p-8 rounded-2xl bg-cream-50 border border-gray-100 hover:border-emerald-200 hover:shadow-lg transition-all group">
                            <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                                <TrendingUp size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Competitive Commissions</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Earn attractive commissions on every booking. We offer tiered structures that reward high-volume partners.
                            </p>
                        </div>

                        {/* Benefit 2 */}
                        <div className="p-8 rounded-2xl bg-cream-50 border border-gray-100 hover:border-emerald-200 hover:shadow-lg transition-all group">
                            <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                                <Globe size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Instant Confirmation</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Our real-time inventory system ensures your clients get their tickets instantly. No waiting, no uncertainty.
                            </p>
                        </div>

                        {/* Benefit 3 */}
                        <div className="p-8 rounded-2xl bg-cream-50 border border-gray-100 hover:border-emerald-200 hover:shadow-lg transition-all group">
                            <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                                <Users size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Dedicated Support</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Get access to a dedicated account manager and 24/7 priority support for you and your clients.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Who is this for? */}
            <div className="py-24 bg-gray-50 border-y border-gray-200">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center gap-16">
                        <div className="flex-1 space-y-6">
                            <h2 className="text-3xl md:text-4xl font-black text-gray-900">Who is this for?</h2>
                            <p className="text-lg text-gray-600">We tailor our partnership programs to suit different needs within the travel industry.</p>

                            <ul className="space-y-4">
                                <li className="flex items-start gap-4">
                                    <div className="mt-1 p-1 rounded-full bg-emerald-100 text-emerald-700"><ShieldCheck size={16} /></div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">Travel Agencies</h4>
                                        <p className="text-sm text-gray-500">Simplify your booking process with our B2B portal.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="mt-1 p-1 rounded-full bg-emerald-100 text-emerald-700"><Globe size={16} /></div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">Travel Bloggers & Influencers</h4>
                                        <p className="text-sm text-gray-500">Monetize your content with trackable affiliate links.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="mt-1 p-1 rounded-full bg-emerald-100 text-emerald-700"><Users size={16} /></div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">Hotels & Concierges</h4>
                                        <p className="text-sm text-gray-500">Provide value-added services to your guests effortlessly.</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="flex-1 bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">Start the conversation</h3>
                            <form className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Company Name</label>
                                    <input type="text" className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all" placeholder="Your Agency / Brand" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
                                    <input type="email" className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all" placeholder="you@company.com" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Partnership Type</label>
                                    <select className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all">
                                        <option>Travel Agency</option>
                                        <option>Affiliate / Influencer</option>
                                        <option>Hotel / Concierge</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                                <button type="button" className="w-full py-4 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200">
                                    Request Information
                                </button>
                                <p className="text-xs text-center text-gray-400 mt-4">
                                    By submitting, you agree to our <Link href="/privacy-policy" className="underline hover:text-emerald-600">Privacy Policy</Link>.
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
