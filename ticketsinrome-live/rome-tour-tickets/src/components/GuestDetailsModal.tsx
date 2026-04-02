'use client';

import { useState, useEffect } from 'react';
import { X, User, FileText, Phone, Mail, MapPin, Briefcase, HelpCircle, Check, AlertTriangle, Users, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PhoneInput from './PhoneInput';

export interface GuestDetail {
    index: number;
    type: string;
    name: string;
}

export interface BookingDetails {
    leadTraveler: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
    };
    guests: GuestDetail[];
    logistics: {
        pickupRequired: boolean;
        hotelName: string;
        luggageDeposit: boolean;
    };
    marketing: {
        source: string;
        emailOptIn: boolean;
    };
}

interface GuestDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (details: BookingDetails) => void;
    guestCounts: Record<string, number>;
}

export default function GuestDetailsModal({ isOpen, onClose, onSubmit, guestCounts }: GuestDetailsModalProps) {
    const totalGuests = Object.values(guestCounts || {}).reduce((sum, val) => sum + (val || 0), 0);

    // Form State
    const [leadTraveler, setLeadTraveler] = useState({ firstName: '', lastName: '', email: '', phone: '' });
    const [guests, setGuests] = useState<GuestDetail[]>([]);
    const [logistics, setLogistics] = useState({ pickupRequired: false, hotelName: '', luggageDeposit: false });
    const [marketing, setMarketing] = useState({ source: '', emailOptIn: true });

    // Initialize guest array when modal opens or counts change
    useEffect(() => {
        if (isOpen) {
            const newGuests: GuestDetail[] = [];
            let currentIndex = 1;

            // Helper to add guests
            const addGuest = (type: string, count: number) => {
                for (let i = 0; i < count; i++) {
                    newGuests.push({
                        index: currentIndex,
                        type,
                        name: '',
                    });
                    currentIndex++;
                }
            };

            Object.entries(guestCounts).forEach(([type, count]) => {
                addGuest(type, count);
            });

            setGuests(newGuests);

            // Lock body scroll when modal is open
            document.body.style.overflow = 'hidden';
        }

        return () => {
            // Unlock body scroll when modal closes
            document.body.style.overflow = '';
        };
    }, [isOpen, guestCounts]);

    const handleGuestChange = (index: number, field: keyof GuestDetail, value: string) => {
        setGuests(prev => prev.map(g => g.index === index ? { ...g, [field]: value } : g));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Basic Validation
        if (!leadTraveler.firstName || !leadTraveler.lastName || !leadTraveler.email || !leadTraveler.phone) {
            alert("Please fill in all Lead Traveler details.");
            return;
        }

        // Validate guest names
        const missingNames = guests.some(g => !g.name.trim());
        if (missingNames) {
            alert("Please provide full names for all guests.");
            return;
        }

        onSubmit({
            leadTraveler,
            guests,
            logistics,
            marketing
        });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overscroll-contain"
                    onWheel={(e) => e.stopPropagation()}
                    onTouchMove={(e) => e.stopPropagation()}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col overscroll-contain"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="bg-emerald-900 p-6 flex justify-between items-center text-white shrink-0 shadow-md z-10">
                            <div>
                                <h2 className="text-2xl font-bold flex items-center gap-2">
                                    <Check className="w-6 h-6 text-emerald-400" />
                                    Complete Your Booking
                                </h2>
                                <p className="text-emerald-200 text-sm mt-1">
                                    Please provide accurate details for your tickets and security clearance.
                                </p>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-emerald-800 rounded-full transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Scrollable Form Area */}
                        <div
                            className="flex-1 overflow-y-auto bg-gray-50 overscroll-contain scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
                            onWheel={(e) => e.stopPropagation()}
                        >
                            <form id="booking-form" onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">

                                {/* 1. Lead Traveler Contact */}
                                <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 pb-2 border-b border-gray-100">
                                        <User className="text-emerald-600 w-5 h-5" />
                                        Lead Traveler Details
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">First Name</label>
                                            <input type="text" required placeholder="e.g. John" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                                                value={leadTraveler.firstName} onChange={e => setLeadTraveler({ ...leadTraveler, firstName: e.target.value })} />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Last Name</label>
                                            <input type="text" required placeholder="e.g. Doe" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                                                value={leadTraveler.lastName} onChange={e => setLeadTraveler({ ...leadTraveler, lastName: e.target.value })} />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email Address</label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-3.5 text-gray-400 w-4 h-4" />
                                                <input type="email" required placeholder="name@example.com" className="w-full p-3 pl-10 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                                                    value={leadTraveler.email} onChange={e => setLeadTraveler({ ...leadTraveler, email: e.target.value })} />
                                            </div>
                                        </div>
                                        <div>
                                            <PhoneInput
                                                label="Phone Number"
                                                value={leadTraveler.phone}
                                                onChange={(value) => setLeadTraveler({ ...leadTraveler, phone: value })}
                                                placeholder="234 567 890"
                                                required
                                            />
                                        </div>
                                    </div>
                                </section>

                                {/* 2. Guest Details */}
                                <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 pb-2 border-b border-gray-100">
                                        <Users className="text-emerald-600 w-5 h-5" />
                                        Guest List ({totalGuests})
                                    </h3>
                                    <div className="space-y-4">
                                        {guests.map((guest, idx) => (
                                            <div key={guest.index} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                                                <div className="md:col-span-1 flex items-center justify-center font-bold text-emerald-700 bg-emerald-100 w-8 h-8 rounded-full text-sm">
                                                    {guest.index}
                                                </div>
                                                <div className="md:col-span-2">
                                                    <span className={`text-[10px] font-bold uppercase py-1 px-2 rounded-md ${guest.type === 'Adult' ? 'bg-emerald-100 text-emerald-700' :
                                                        guest.type === 'Student' ? 'bg-orange-100 text-orange-700' :
                                                            guest.type === 'Youth' ? 'bg-blue-100 text-blue-700' :
                                                                'bg-purple-100 text-purple-700'
                                                        }`}>
                                                        {guest.type}
                                                    </span>
                                                </div>
                                                <div className="md:col-span-9">
                                                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Full Name (As on ID)</label>
                                                    <input
                                                        type="text"
                                                        required
                                                        placeholder={`Full Name for ${guest.type}`}
                                                        className="w-full p-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                                                        value={guest.name}
                                                        onChange={e => handleGuestChange(guest.index, 'name', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-4 p-3 bg-amber-50 text-amber-800 text-xs rounded-lg flex gap-2">
                                        <AlertTriangle size={16} className="shrink-0" />
                                        <b>Important:</b> Names must match your physical ID/Passport exactly. Security checks are strict.
                                    </div>
                                </section>

                                {/* 3. Logistics & Extras (Simplified) */}
                                <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 pb-2 border-b border-gray-100">
                                        <Briefcase className="text-emerald-600 w-5 h-5" />
                                        Logistics
                                    </h3>

                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <input type="checkbox" id="pickup" className="mt-1 w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 border-gray-300"
                                                checked={logistics.pickupRequired} onChange={e => setLogistics({ ...logistics, pickupRequired: e.target.checked })} />
                                            <div>
                                                <label htmlFor="pickup" className="block text-sm font-medium text-gray-900 font-bold">Pick-up Service Request</label>
                                                <p className="text-xs text-gray-500">We'll contact you to arrange pickup from your hotel (Extra fee applies).</p>
                                            </div>
                                        </div>

                                        {logistics.pickupRequired && (
                                            <div className="ml-7">
                                                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Hotel/Airbnb Name</label>
                                                <div className="relative">
                                                    <MapPin className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                                                    <input type="text" placeholder="Where are you staying?"
                                                        className="w-full p-2.5 pl-9 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                                                        value={logistics.hotelName} onChange={e => setLogistics({ ...logistics, hotelName: e.target.value })} />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </section>

                            </form>
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-gray-100 bg-white flex justify-between items-center shrink-0 z-10">
                            <button onClick={onClose} className="px-6 py-3 font-semibold text-gray-500 hover:text-gray-900 transition-colors">
                                Back
                            </button>
                            <button type="submit" form="booking-form" className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2">
                                Proceed to Payment <ChevronRight size={18} />
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
