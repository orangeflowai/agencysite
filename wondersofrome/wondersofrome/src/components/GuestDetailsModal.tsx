
'use client';

import { useState, useEffect } from 'react';
import { X, User, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface GuestValues {
    [key: string]: string; // "guest_1_name": "John", "guest_1_passport": "A123"
}

export interface GuestDetail {
    index: number;
    name: string;
}

interface GuestDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (details: GuestDetail[]) => void;
    guestCounts: Record<string, number>;
}

export default function GuestDetailsModal({ isOpen, onClose, onSubmit, guestCounts }: GuestDetailsModalProps) {
    const [values, setValues] = useState<GuestValues>({});

    const totalCount = Object.values(guestCounts || {}).reduce((sum, count) => sum + (count || 0), 0);

    // List of guests with their labels: [{ index: 1, label: "Adult 1" }, { index: 2, label: "Adult 2" }, { index: 3, label: "Student 1" }]
    const guestLabels = Object.entries(guestCounts).flatMap(([type, count]) => {
        return Array.from({ length: count }).map((_, i) => ({
            type,
            label: `${type} ${i + 1}`,
        }));
    });

    // Reset values when opened
    useEffect(() => {
        if (isOpen) {
            setValues({});
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const details: GuestDetail[] = guestLabels.map((guest, i) => {
            const index = i + 1;
            return {
                index,
                name: values[`guest_${index}_name`] || '',
            };
        });

        onSubmit(details);
    };

    const handleChange = (name: string, value: string) => {
        setValues(prev => ({ ...prev, [name]: value }));
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                    >
                        {/* Header */}
                        <div className="bg-sky-900 p-6 flex justify-between items-center text-white shrink-0">
                            <div>
                                <h2 className="text-xl font-bold">Guest Details Required</h2>
                                <p className="text-sky-200 text-sm mt-1">
                                    Why? We need to register every visitor with the Vatican/Colosseum security.
                                </p>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-sky-800 rounded-full transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto">
                            <form id="guest-form" onSubmit={handleSubmit} className="space-y-6">
                                {guestLabels.map((guest, i) => {
                                    const index = i + 1;
                                    return (
                                        <div key={index} className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                                <User size={16} className="text-sky-600" />
                                                Guest {index} - {guest.label} {index === 1 ? '(Lead Traveler)' : ''}
                                            </h3>

                                            <div className="grid grid-cols-1 gap-4">
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Full Name</label>
                                                    <input
                                                        type="text"
                                                        required
                                                        placeholder="As on Passport"
                                                        value={values[`guest_${index}_name`] || ''}
                                                        onChange={(e) => handleChange(`guest_${index}_name`, e.target.value)}
                                                        className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}

                                <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl text-amber-800 text-sm">
                                    <p className="font-bold mb-1">⚠️ IMPORTANT:</p>
                                    <p>You MUST bring these exact physical IDs/Passports on the day of the tour. Photos or copies may determine entry refusal by security.</p>
                                </div>
                            </form>
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 shrink-0">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-3 font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-xl transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                form="guest-form"
                                className="px-8 py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow-lg transition-all"
                            >
                                Confirm & Pay
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
