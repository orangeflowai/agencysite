'use client';

import { useState, useEffect } from 'react';
import { X, User, FileText, Globe, Calendar } from 'lucide-react';

interface GuestValues {
    [key: string]: string; // "guest_1_name": "John", "guest_1_passport": "A123"
}

export interface GuestDetail {
    index: number;
    name: string;
    passportNumber: string;
    country: string;
    dateOfBirth: string;
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

    const guestLabels = Object.entries(guestCounts).flatMap(([type, count]) => {
        return Array.from({ length: count }).map((_, i) => ({
            type,
            label: `${type} ${i + 1}`,
        }));
    });

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
                passportNumber: values[`guest_${index}_passport`] || '',
                country: values[`guest_${index}_country`] || '',
                dateOfBirth: values[`guest_${index}_dob`] || '',
            };
        });

        onSubmit(details);
    };

    const handleChange = (name: string, value: string) => {
        setValues(prev => ({ ...prev, [name]: value }));
    };

    return (
        <>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div
                        className="bg-card w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                    >
                        {/* Header */}
                        <div className="bg-primary p-6 flex justify-between items-center text-white shrink-0">
                            <div>
                                <h2 className="text-xl font-bold">Guest Details Required</h2>
                                <p className="text-primary-foreground/80 text-sm mt-1">
                                    Vatican/Colosseum security requires full passport details for every visitor.
                                </p>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto">
                            <form id="guest-form" onSubmit={handleSubmit} className="space-y-6">
                                {guestLabels.map((guest, i) => {
                                    const index = i + 1;
                                    return (
                                        <div key={index} className="bg-muted p-4 rounded-xl border border-border">
                                            <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                                                <User size={16} className="text-primary" />
                                                Guest {index} - {guest.label} {index === 1 ? '(Lead Traveler)' : ''}
                                            </h3>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="col-span-2">
                                                    <label className="block text-xs font-bold text-muted-foreground mb-1">Full Name (as on Passport) *</label>
                                                    <input
                                                        type="text"
                                                        required
                                                        placeholder="As on Passport"
                                                        value={values[`guest_${index}_name`] || ''}
                                                        onChange={(e) => handleChange(`guest_${index}_name`, e.target.value)}
                                                        className="w-full p-3 bg-card border border-border rounded-lg focus:ring-2 focus:ring-primary/50 outline-none"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-muted-foreground mb-1 flex items-center gap-1">
                                                        <FileText size={12} /> Passport Number *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        required
                                                        placeholder="e.g. AB123456"
                                                        value={values[`guest_${index}_passport`] || ''}
                                                        onChange={(e) => handleChange(`guest_${index}_passport`, e.target.value)}
                                                        className="w-full p-3 bg-card border border-border rounded-lg focus:ring-2 focus:ring-primary/50 outline-none"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-muted-foreground mb-1 flex items-center gap-1">
                                                        <Globe size={12} /> Nationality *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        required
                                                        placeholder="e.g. Italy"
                                                        value={values[`guest_${index}_country`] || ''}
                                                        onChange={(e) => handleChange(`guest_${index}_country`, e.target.value)}
                                                        className="w-full p-3 bg-card border border-border rounded-lg focus:ring-2 focus:ring-primary/50 outline-none"
                                                    />
                                                </div>
                                                <div className="col-span-2">
                                                    <label className="block text-xs font-bold text-muted-foreground mb-1 flex items-center gap-1">
                                                        <Calendar size={12} /> Date of Birth *
                                                    </label>
                                                    <input
                                                        type="date"
                                                        required
                                                        value={values[`guest_${index}_dob`] || ''}
                                                        onChange={(e) => handleChange(`guest_${index}_dob`, e.target.value)}
                                                        className="w-full p-3 bg-card border border-border rounded-lg focus:ring-2 focus:ring-primary/50 outline-none"
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
                        <div className="p-6 border-t border-border bg-muted flex justify-end gap-3 shrink-0">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-3 font-semibold text-muted-foreground hover:text-foreground hover:bg-gray-200 rounded-xl transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                form="guest-form"
                                className="px-8 py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg transition-all"
                            >
                                Confirm & Pay
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
