'use client';

import React from 'react';
import Link from 'next/link';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white border-t border-gray-100 py-24">
            <div className="container mx-auto px-8">
                <div className="flex flex-col md:flex-row justify-between items-start gap-16">
                    <div className="max-w-xs">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">RomeWander</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            Curated experiences for the discerning pilgrim. Discover the Eternal City with purpose and peace of mind.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-16">
                        <div>
                            <h4 className="text-xs font-black uppercase tracking-widest text-gray-900 mb-6">Experiences</h4>
                            <ul className="space-y-4 text-sm text-gray-500">
                                <li><Link href="/category/vatican" className="hover:text-primary transition-colors">Vatican Museums</Link></li>
                                <li><Link href="/category/colosseum" className="hover:text-primary transition-colors">Ancient Rome</Link></li>
                                <li><Link href="/private-tours" className="hover:text-primary transition-colors">Private Tours</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-xs font-black uppercase tracking-widest text-gray-900 mb-6">Support</h4>
                            <ul className="space-y-4 text-sm text-gray-500">
                                <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
                                <li><Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
                                <li><Link href="/cancellation-policy" className="hover:text-primary transition-colors">Cancellations</Link></li>
                            </ul>
                        </div>

                        <div className="col-span-2 md:col-span-1">
                            <h4 className="text-xs font-black uppercase tracking-widest text-gray-900 mb-6">Legal</h4>
                            <ul className="space-y-4 text-sm text-gray-500">
                                <li><Link href="/terms-and-conditions" className="hover:text-primary transition-colors">Terms</Link></li>
                                <li><Link href="/privacy-policy" className="hover:text-primary transition-colors">Privacy</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="mt-24 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-8">
                    <p className="text-gray-400 text-xs">
                        © {currentYear} RomeWander. All rights reserved.
                    </p>
                    <div className="flex gap-8">
                        <span className="text-gray-400 text-xs uppercase tracking-widest font-bold">Vatican City</span>
                        <span className="text-gray-400 text-xs uppercase tracking-widest font-bold">Rome, Italy</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
