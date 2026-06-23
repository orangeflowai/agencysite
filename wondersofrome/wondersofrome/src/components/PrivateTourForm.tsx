'use client';

import { useState } from 'react';
import { Send, CheckCircle, Loader2 } from 'lucide-react';

interface PrivateTourFormProps {
    tourOptions?: string[];
}

const DEFAULT_TOURS = [
    'Vatican Museums & Sistine Chapel',
    'Colosseum & Roman Forum',
    'Rome City Highlights',
    'Castel Sant\'Angelo',
    'Borghese Gallery',
    'Custom / Other',
];

export default function PrivateTourForm({ tourOptions }: PrivateTourFormProps) {
    const tours = tourOptions && tourOptions.length > 0 ? [...tourOptions, 'Custom / Other'] : DEFAULT_TOURS;

    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        tour: '',
        groupSize: '',
        dateFrom: '',
        dateTo: '',
        notes: '',
    });
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const field = (key: keyof typeof form) => ({
        value: form[key],
        onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
            setForm(prev => ({ ...prev, [key]: e.target.value })),
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    firstName: form.name,
                    email: form.email,
                    phone: form.phone,
                    message: `PRIVATE TOUR REQUEST\n\nTour: ${form.tour}\nGroup size: ${form.groupSize}\nDates: ${form.dateFrom} → ${form.dateTo}\n\nNotes: ${form.notes}`,
                }),
            });

            if (!res.ok) throw new Error('Failed to send request');
            setSubmitted(true);
        } catch {
            setError('Something went wrong. Please email us directly at info@wondersofrome.com');
        } finally {
            setSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="text-center py-16 bg-emerald-50 rounded-2xl border border-emerald-100">
                <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-2">Request Received!</h3>
                <p className="text-muted-foreground">We'll send your personalised itinerary and quote within 24 hours.</p>
            </div>
        );
    }

    const inputCls = "w-full px-4 py-3 bg-muted border border-border rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm font-medium text-foreground transition-all";
    const labelCls = "block text-[10px] font-bold text-muted-foreground tracking-widest uppercase mb-1.5";

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                    <label className={labelCls}>Full Name *</label>
                    <input type="text" required placeholder="John Smith" className={inputCls} {...field('name')} />
                </div>
                <div>
                    <label className={labelCls}>Email *</label>
                    <input type="email" required placeholder="john@example.com" className={inputCls} {...field('email')} />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                    <label className={labelCls}>Phone</label>
                    <input type="tel" placeholder="+1 555 000 0000" className={inputCls} {...field('phone')} />
                </div>
                <div>
                    <label className={labelCls}>Group Size *</label>
                    <select required className={inputCls} {...field('groupSize')}>
                        <option value="">Select size</option>
                        {['1–2', '3–5', '6–10', '11–20', '20+'].map(s => (
                            <option key={s} value={s}>{s} people</option>
                        ))}
                    </select>
                </div>
            </div>

            <div>
                <label className={labelCls}>Tour of Interest *</label>
                <select required className={inputCls} {...field('tour')}>
                    <option value="">Select a tour</option>
                    {tours.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                    <label className={labelCls}>Preferred Date From *</label>
                    <input type="date" required className={inputCls} {...field('dateFrom')} />
                </div>
                <div>
                    <label className={labelCls}>Preferred Date To</label>
                    <input type="date" className={inputCls} {...field('dateTo')} />
                </div>
            </div>

            <div>
                <label className={labelCls}>Special Requests or Notes</label>
                <textarea
                    rows={4}
                    placeholder="Dietary needs, mobility requirements, languages, specific interests…"
                    className={`${inputCls} resize-none`}
                    {...field('notes')}
                />
            </div>

            <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-3 bg-primary hover:opacity-90 disabled:opacity-60 text-white font-bold py-4 rounded-xl tracking-widest text-sm transition-all shadow-lg shadow-primary/20 active:scale-[0.98]"
            >
                {submitting
                    ? <><Loader2 size={16} className="animate-spin" /> Sending…</>
                    : <><Send size={15} /> Send Enquiry</>
                }
            </button>

            <p className="text-center text-xs text-muted-foreground">
                We reply within 24 hours · No payment required to enquire
            </p>
        </form>
    );
}
