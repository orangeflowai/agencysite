'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';
import { useState } from 'react';
import PhoneInput from '@/components/PhoneInput';
import WhatsAppButton from "@/components/WhatsAppButton";

export default function ContactPage() {
    const { t } = useLanguage();
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

    return (
        <main className="min-h-screen bg-background selection:bg-primary selection:text-white font-sans text-foreground">
            <Navbar />

            {/* Header */}
            <div className="bg-foreground pt-48 pb-32 text-center text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/10 mix-blend-overlay"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative z-10 container mx-auto px-4"
                >
                    <h1 className="text-5xl md:text-8xl font-heading mb-6">{t('contact.title')}</h1>
                    <p className="text-background/60 text-lg max-w-2xl mx-auto px-4 font-mono uppercase tracking-tighter">
                        {t('contact.subtitle')}
                    </p>
                </motion.div>
            </div>

            <div className="container mx-auto px-4 py-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 max-w-6xl mx-auto items-start">

                    {/* Contact Info */}
                    <motion.div
                        initial="initial"
                        animate="animate"
                        variants={fadeInUp}
                        className="space-y-12"
                    >
                        <div>
                            <h2 className="text-4xl font-serif font-black italic uppercase tracking-tight text-foreground mb-4">Direct Channels</h2>
                            <p className="text-muted-foreground font-medium">Reach out to our operations center for immediate assistance or editorial inquiries.</p>
                        </div>
                        
                        <div className="space-y-10">
                            <div className="flex items-start space-x-6 group">
                                <div className="w-16 h-16 bg-card rounded-2xl border border-border flex items-center justify-center shrink-0 group-hover:border-primary/50 group-hover:bg-primary/5 transition-all duration-500 shadow-sm">
                                    <Mail className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Digital Terminal</h3>
                                    <p className="text-xl font-bold text-foreground hover:text-primary transition-colors cursor-pointer">info@wondersofrome.com</p>
                                    <p className="text-primary text-[10px] mt-2 font-black uppercase tracking-widest">Priority Queue</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-6 group">
                                <div className="w-16 h-16 bg-card rounded-2xl border border-border flex items-center justify-center shrink-0 group-hover:border-primary/50 group-hover:bg-primary/5 transition-all duration-500 shadow-sm">
                                    <Phone className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Voice Protocol</h3>
                                    <p className="text-xl font-bold text-foreground">+39 351 419 9425</p>
                                    <p className="text-muted-foreground text-[10px] mt-2 font-black uppercase tracking-widest">MON-SUN // 09:00 - 18:00 CET</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-6 group">
                                <div className="w-16 h-16 bg-card rounded-2xl border border-border flex items-center justify-center shrink-0 group-hover:border-primary/50 group-hover:bg-primary/5 transition-all duration-500 shadow-sm">
                                    <MapPin className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Physical Archive</h3>
                                    <p className="text-xl font-bold text-foreground">Via Tunisi 43, Rome, Italy</p>
                                    <p className="text-muted-foreground text-[10px] mt-2 font-black uppercase tracking-widest">Near St. Peter&apos;s Square</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="bg-card p-10 md:p-12 rounded-[3rem] border border-border shadow-2xl relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                        <form className="space-y-8 relative z-10" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest">{t('contact.form.name')}</label>
                                    <input
                                        name="firstName"
                                        required
                                        type="text"
                                        className="w-full px-6 py-4 bg-background border border-border focus:border-primary rounded-2xl outline-none transition-all font-medium text-foreground"
                                        placeholder="John"
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest">Last Name</label>
                                    <input
                                        name="lastName"
                                        type="text"
                                        className="w-full px-6 py-4 bg-background border border-border focus:border-primary rounded-2xl outline-none transition-all font-medium text-foreground"
                                        placeholder="Doe"
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest">Email Address</label>
                                <input
                                    name="email"
                                    required
                                    type="email"
                                    className="w-full px-6 py-4 bg-background border border-border focus:border-primary rounded-2xl outline-none transition-all font-medium text-foreground"
                                    placeholder="john@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest">Phone Connection</label>
                                <PhoneInput
                                    value={formData.phone}
                                    onChange={(val) => setFormData({ ...formData, phone: val })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest">Inquiry Message</label>
                                <textarea
                                    name="message"
                                    required
                                    rows={4}
                                    className="w-full px-6 py-4 bg-background border border-border focus:border-primary rounded-2xl outline-none transition-all font-medium text-foreground resize-none"
                                    placeholder="How can we assist your Roman journey?"
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-primary hover:bg-primary/90 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-xl shadow-primary/20"
                            >
                                {isSubmitting ? (
                                    'Transmitting...'
                                ) : (
                                    <>
                                        Initiate Contact <Send size={16} />
                                    </>
                                )}
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>

            <Footer />
            <WhatsAppButton />
        </main>
    );
}