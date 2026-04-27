'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';
import { useState } from 'react';
import PhoneInput from '@/components/PhoneInput';

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
        <main className="min-h-screen bg-cream selection:bg-olive selection:text-white">
            <Navbar />

            {/* Header - Reduced padding for cleaner look */}
            <div className="bg-olive pt-32 pb-20 text-center text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative z-10"
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 font-serif">{t('contact.title')}</h1>
                    <p className="text-white/90 text-lg max-w-2xl mx-auto px-4 font-medium">
                        {t('contact.subtitle')}
                    </p>
                </motion.div>
            </div>

            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">

                    {/* Contact Info */}
                    <motion.div
                        initial="initial"
                        animate="animate"
                        variants={fadeInUp}
                        className="space-y-8"
                    >
                        <h2 className="text-3xl font-serif font-bold text-black border-b-2 border-olive/20 pb-4 inline-block">Get in Touch</h2>
                        <div className="space-y-8">
                            <div className="flex items-start space-x-6 group">
                                <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-olive/10 flex items-center justify-center shrink-0 group-hover:bg-olive group-hover:text-white transition-all duration-300">
                                    <Mail className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-black mb-1">Email Us</h3>
                                    <p className="text-gray-600 font-medium hover:text-olive transition-colors cursor-pointer">{process.env.NEXT_PUBLIC_CONTACT_EMAIL || "info@yourdomain.com"}</p>
                                    <p className="text-gray-400 text-xs mt-1  tracking-wider font-bold">24/7 Support</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-6 group">
                                <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-olive/10 flex items-center justify-center shrink-0 group-hover:bg-olive group-hover:text-white transition-all duration-300">
                                    <Phone className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-black mb-1">Call Us</h3>
                                    <p className="text-gray-600 font-medium">351 419 9425</p>
                                    <p className="text-gray-400 text-xs mt-1  tracking-wider font-bold">Mon-Sun, 9am - 6pm</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-6 group">
                                <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-olive/10 flex items-center justify-center shrink-0 group-hover:bg-olive group-hover:text-white transition-all duration-300">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-black mb-1">Visit Our Office</h3>
                                    <p className="text-gray-600 leading-relaxed">Via Tunisi 43,<br />Rome, Italy</p>
                                    <p className="text-gray-400 text-xs mt-1  tracking-wider font-bold">Near St. Peter&apos;s Square</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="bg-white p-8 md:p-10 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 relative overflow-hidden"
                    >
                        {/* Decorative background element */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-olive/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                        <form className="space-y-5 relative z-10" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500  tracking-wider mb-2">{t('contact.form.name')}</label>
                                    <input
                                        name="firstName"
                                        required
                                        type="text"
                                        className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-olive/20 rounded-xl focus:bg-white focus:ring-4 focus:ring-olive/10 outline-none transition-all font-medium text-gray-900"
                                        placeholder="John"
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500  tracking-wider mb-2">Last Name</label>
                                    <input
                                        name="lastName"
                                        type="text"
                                        className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-olive/20 rounded-xl focus:bg-white focus:ring-4 focus:ring-olive/10 outline-none transition-all font-medium text-gray-900"
                                        placeholder="Doe"
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500  tracking-wider mb-2">{t('contact.form.email')}</label>
                                <input
                                    name="email"
                                    required
                                    type="email"
                                    className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-olive/20 rounded-xl focus:bg-white focus:ring-4 focus:ring-olive/10 outline-none transition-all font-medium text-gray-900"
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
                                <label className="block text-xs font-bold text-gray-500  tracking-wider mb-2">{t('contact.form.message')}</label>
                                <textarea
                                    name="message"
                                    required
                                    rows={4}
                                    className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-olive/20 rounded-xl focus:bg-white focus:ring-4 focus:ring-olive/10 outline-none transition-all font-medium text-gray-900 resize-none"
                                    placeholder="How can we help you?"
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-emerald-800 hover:bg-emerald-900 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-emerald-900/20 transform hover:-translate-y-1 transition-all  tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Sending...' : t('contact.btn.submit')}
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
