'use client';

import VaticanHeader from '@/components/vatican/header';
import VaticanFooter from '@/components/vatican/footer';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useState } from 'react';
import PhoneInput from '@/components/PhoneInput';
import { useSite } from '@/components/SiteProvider';

export default function ContactPage() {
    const site = useSite();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                alert('Message Sent Successfully!');
                setFormData({ firstName: '', lastName: '', email: '', phone: '', message: '' });
            } else {
                alert('Failed to send message. Please try again.');
            }
        } catch (error) {
            alert('Error sending message.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const contactEmail = site?.contactEmail || process.env.NEXT_PUBLIC_CONTACT_EMAIL || process.env.EMAIL_FROM || process.env.NEXT_PUBLIC_CONTACT_EMAIL || "info@romeagency.com";
    const contactPhone = site?.contactPhone || process.env.NEXT_PUBLIC_SUPPORT_PHONE || "+39 351 419 9425";
    const address = site?.officeAddress || "Viale Vaticano, 00165 Roma RM, Italy";

    return (
        <main className="min-h-screen bg-background text-foreground">
            <VaticanHeader />

            {/* Header */}
            <div className="bg-primary pt-32 pb-20 text-center text-primary-foreground relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/vatican-museums.jpg')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <p className="text-xs uppercase tracking-widest text-primary-foreground/60 mb-4 font-bold">Vatican Archives</p>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Contact Us</h1>
                    <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto px-4 leading-relaxed">
                        Have questions about Vatican tours? Our team is here to help you plan your perfect visit.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

                    {/* Contact Info */}
                    <div className="space-y-8">
                        <h2 className="text-3xl font-serif font-bold text-foreground border-b-2 border-primary/20 pb-4 inline-block">Get in Touch</h2>
                        <div className="space-y-8">
                            <div className="flex items-start gap-6 group">
                                <div className="w-14 h-14 bg-card rounded-2xl shadow-sm border border-border flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                                    <Mail className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-foreground mb-1">Email Us</h3>
                                    <p className="text-muted-foreground font-medium hover:text-primary transition-colors cursor-pointer">{contactEmail}</p>
                                    <p className="text-muted-foreground text-xs mt-1 uppercase tracking-wider font-bold">24/7 Support</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-6 group">
                                <div className="w-14 h-14 bg-card rounded-2xl shadow-sm border border-border flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                                    <Phone className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-foreground mb-1">Call Us</h3>
                                    <p className="text-muted-foreground font-medium">{contactPhone}</p>
                                    <p className="text-muted-foreground text-xs mt-1 uppercase tracking-wider font-bold">Mon-Sun, 9am - 6pm</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-6 group">
                                <div className="w-14 h-14 bg-card rounded-2xl shadow-sm border border-border flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-foreground mb-1">Visit Our Office</h3>
                                    <p className="text-muted-foreground leading-relaxed">{address}</p>
                                    <p className="text-muted-foreground text-xs mt-1 uppercase tracking-wider font-bold">Near Vatican Museums</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-card p-8 md:p-10 rounded-3xl shadow-xl border border-border relative overflow-hidden">
                        {/* Decorative background element */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                        <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">First Name</label>
                                    <input
                                        name="firstName"
                                        required
                                        type="text"
                                        className="w-full px-4 py-3 bg-muted border-2 border-transparent focus:border-primary/20 rounded-xl focus:bg-background focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium text-foreground"
                                        placeholder="John"
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Last Name</label>
                                    <input
                                        name="lastName"
                                        type="text"
                                        className="w-full px-4 py-3 bg-muted border-2 border-transparent focus:border-primary/20 rounded-xl focus:bg-background focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium text-foreground"
                                        placeholder="Doe"
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Email</label>
                                <input
                                    name="email"
                                    required
                                    type="email"
                                    className="w-full px-4 py-3 bg-muted border-2 border-transparent focus:border-primary/20 rounded-xl focus:bg-background focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium text-foreground"
                                    placeholder="john@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div>
                                <PhoneInput
                                    label="Phone Number"
                                    value={formData.phone}
                                    onChange={(value) => setFormData({ ...formData, phone: value })}
                                    placeholder="234 567 890"
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Message</label>
                                <textarea
                                    name="message"
                                    required
                                    rows={4}
                                    className="w-full px-4 py-3 bg-muted border-2 border-transparent focus:border-primary/20 rounded-xl focus:bg-background focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium text-foreground resize-none"
                                    placeholder="How can we help you?"
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-primary hover:opacity-90 text-primary-foreground py-4 rounded-xl font-bold text-base shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Sending...' : 'Send Message'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <VaticanFooter />
        </main>
    );
}
