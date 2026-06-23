'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Calendar, User, Mail, CreditCard, CheckCircle } from 'lucide-react';

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    tourTitle: string;
    price: number;
}

function BookingModalContent({ isOpen, onClose, tourTitle, price }: BookingModalProps) {
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        date: '',
        guests: 1,
        name: '',
        email: '',
    });

    const total = formData.guests * price;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const res = await fetch('/api/book', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, tourTitle, price: total })
            });

            if (res.ok) {
                setStep(3); // Success step
                // Ideally redirect to /booking/success after a delay
                setTimeout(() => {
                    window.location.href = '/booking/success';
                }, 2000);
            }
        } catch (error) {
            console.error('Booking failed', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        
            <div data-lenis-prevent className="fixed inset-0 z-[10005] flex items-start justify-center p-4 pt-[110px]">
                <div
                    onClick={onClose}
                    className="absolute inset-0 bg-background/60 backdrop-blur-sm"
                />

                <div
                    className="relative bg-card w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden max-h-[calc(100vh-130px)]"
                >
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-cream/50">
                        <h3 className="font-bold text-xl text-foreground">
                            {step === 3 ? 'Booking Confirmed' : 'Complete Booking'}
                        </h3>
                        <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
                            <X size={24} />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-6">
                        {step === 1 && (
                            <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1">Select Date</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-3 text-muted-foreground" size={18} />
                                        <input
                                            type="date"
                                            required
                                            className="w-full pl-10 pr-4 py-3 bg-muted border border-border rounded-xl focus:ring-2 focus:ring-olive focus:border-olive outline-none transition-all"
                                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1">Number of Guests</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 text-muted-foreground" size={18} />
                                        <select
                                            className="w-full pl-10 pr-4 py-3 bg-muted border border-border rounded-xl focus:ring-2 focus:ring-olive focus:border-olive outline-none transition-all"
                                            value={formData.guests}
                                            onChange={(e) => setFormData({ ...formData, guests: Number(e.target.value) })}
                                        >
                                            {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n} Guests</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div className="bg-cream p-4 rounded-xl flex justify-between items-center mt-6">
                                    <span className="text-muted-foreground font-medium">Total Price</span>
                                    <span className="text-2xl font-bold text-olive">€{total}</span>
                                </div>

                                <button type="submit" className="w-full bg-olive hover:bg-olive-light text-white py-4 rounded-xl font-bold text-lg shadow-lg mt-4 transition-all hover:scale-[1.02]">
                                    Continue
                                </button>
                            </form>
                        )}

                        {step === 2 && (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="John Doe"
                                        className="w-full px-4 py-3 bg-muted border border-border rounded-xl focus:ring-2 focus:ring-olive focus:border-olive outline-none"
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 text-muted-foreground" size={18} />
                                        <input
                                            type="email"
                                            required
                                            placeholder="john@example.com"
                                            className="w-full pl-10 pr-4 py-3 bg-muted border border-border rounded-xl focus:ring-2 focus:ring-olive focus:border-olive outline-none"
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="pt-4 pb-2">
                                    <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-4 bg-muted p-3 rounded-lg">
                                        <CreditCard size={16} />
                                        <span>No payment required for this demo.</span>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-olive hover:bg-olive-light text-white py-4 rounded-xl font-bold text-lg shadow-lg transition-all hover:scale-[1.02] flex items-center justify-center"
                                >
                                    {isSubmitting ? 'Processing...' : `Confirm Booking • €${total}`}
                                </button>
                                <button type="button" onClick={() => setStep(1)} className="w-full text-muted-foreground text-sm py-2 hover:text-foreground">
                                    Back
                                </button>
                            </form>
                        )}

                        {step === 3 && (
                            <div className="text-center py-8 space-y-4">
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle className="w-10 h-10 text-green-600" />
                                </div>
                                <h4 className="text-2xl font-bold text-foreground">Booking Successful!</h4>
                                <p className="text-muted-foreground">
                                    Thanks {formData.name}, your tickets have been reserved.
                                    <br />A confirmation email has been sent to {formData.email}.
                                </p>
                                <p className="text-sm text-muted-foreground mt-4 animate-pulse">Redirecting...</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        
    );
}

export default function BookingModal(props: BookingModalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    if (!mounted || !props.isOpen) return null;

    return createPortal(
        <BookingModalContent {...props} />,
        document.body
    );
}
