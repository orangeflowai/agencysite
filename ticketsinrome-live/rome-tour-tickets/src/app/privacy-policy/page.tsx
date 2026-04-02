
import React from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Privacy Policy | TicketsInRome',
    description: 'Privacy Policy for TicketsInRome. Learn how we collect, use, and protect your personal information.',
};

export default function PrivacyPolicy() {
    return (
        <main className="min-h-screen bg-cream selection:bg-olive selection:text-white">
            <Navbar />

            <div className="container mx-auto px-4 py-24 max-w-4xl">
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-8 tracking-tight">Privacy Policy</h1>
                <p className="text-sm text-gray-500 mb-8 italic">Last Updated: February 20, 2026</p>

                <div className="prose prose-lg prose-emerald text-gray-600 max-w-none space-y-8">
                    <p className="lead text-xl text-gray-800 font-medium">
                        At Tickets in Rome, we care about the privacy of your data and are committed to protecting it. We will not use or share your information with anyone except as described in this Privacy Policy.
                    </p>

                    <p>
                        We use your Personal Information for providing and improving the Service. By using the Service, you agree to the collection and use of information in accordance with this policy. The privacy policy we share is subject to terms and conditions, available here for review: <a href="/terms-and-conditions" className="text-emerald-700 font-bold hover:underline">https://ticketsinrome.com/terms-and-conditions/</a>
                    </p>

                    <p>
                        This Privacy Policy explains what information we collect about you and why, what we do with that information, and how we handle that information. Throughout this policy, when we write “Tickets in Rome” or “we” or “us,” we’re referring to Tickets in Rome, and our subsidiaries and other affiliates.
                    </p>

                    <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm my-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-0">Table of Contents</h2>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 list-none p-0">
                            <li><a href="#scope" className="text-emerald-600 hover:text-emerald-800 font-medium">1. What is the scope of this policy?</a></li>
                            <li><a href="#personal-info" className="text-emerald-600 hover:text-emerald-800 font-medium">2. Personal Information We Collect</a></li>
                            <li><a href="#other-info" className="text-emerald-600 hover:text-emerald-800 font-medium">3. Other Information we collect</a></li>
                            <li><a href="#usage" className="text-emerald-600 hover:text-emerald-800 font-medium">4. How do we use your personal information?</a></li>
                            <li><a href="#disclosure" className="text-emerald-600 hover:text-emerald-800 font-medium">5. Information Access and Disclosure</a></li>
                            <li><a href="#cookies" className="text-emerald-600 hover:text-emerald-800 font-medium">6. Cookie Policy</a></li>
                            <li><a href="#widgets" className="text-emerald-600 hover:text-emerald-800 font-medium">7. Third-Party Widgets</a></li>
                            <li><a href="#pixels" className="text-emerald-600 hover:text-emerald-800 font-medium">8. Tracking Pixels</a></li>
                            <li><a href="#security" className="text-emerald-600 hover:text-emerald-800 font-medium">9. Data Storage and Security</a></li>
                            <li><a href="#deletion" className="text-emerald-600 hover:text-emerald-800 font-medium">10. Can I delete my Personal Data?</a></li>
                            <li><a href="#children" className="text-emerald-600 hover:text-emerald-800 font-medium">11. Children’s Online Privacy Protection</a></li>
                            <li><a href="#changes" className="text-emerald-600 hover:text-emerald-800 font-medium">12. Changes to this Privacy Policy</a></li>
                            <li><a href="#contact" className="text-emerald-600 hover:text-emerald-800 font-medium">13. Contact Information & Feedback</a></li>
                        </ul>
                    </div>

                    <h3 id="scope" className="text-2xl font-bold text-gray-900 mt-12">1. What is the scope of this policy?</h3>
                    <p>In order to conduct our business operations and activities, such as making and maintaining trip bookings on behalf of our clients, we must collect, utilize, and disclose personal information. With numerous physical, technological, and procedural measures, we are fully dedicated to preserving the privacy and security of personal information.</p>
                    <p>For the purposes of the General Data Protection Regulation (“GDPR”), we take the position of “data processor” or “data controller” for any personal information you give to us in the course of our interaction. The precise role played is determined by the circumstances of our connection with you and the aim of the personal information processing. If you do not provide us with your personal information, or if you withdraw a consent that you have provided under this Policy, it may impair our ability to offer you services.</p>

                    <h3 id="personal-info" className="text-2xl font-bold text-gray-900 mt-12">2. Personal Information We Collect</h3>
                    <p>We only collect personal data in compliance with local data protection law. When you interact with our Site, Software, and/or Services, we gather information that can be used to identify you (“Personal Data”). Some information is stored in such a way that it cannot be traced back to you (“Non-Personal Data”).</p>
                    <p>You freely provide us with Personal Data when you browse our site or purchase a tour, including:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Name</li>
                        <li>Email address</li>
                        <li>Telephone number</li>
                        <li>Address</li>
                    </ul>

                    <h3 id="other-info" className="text-2xl font-bold text-gray-900 mt-12">3. Other Information we collect</h3>
                    <p>We automatically log certain information regarding the devices you use to access Tickets in Rome:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Geographical Location:</strong> Identified by an IP address or equivalent identifier.</li>
                        <li><strong>Log Data:</strong> Browser type, settings, date/time of usage, and cookie data.</li>
                        <li><strong>Usage Information:</strong> Information on how you interact with the Tickets in Rome Site and Services.</li>
                    </ul>

                    <h3 id="usage" className="text-2xl font-bold text-gray-900 mt-12">4. How do we use your personal information?</h3>
                    <p>We process your information to:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Provide, improve, and develop the Services.</li>
                        <li>Create a trusted and safer environment.</li>
                        <li>Provide a personalized experience and improve marketing.</li>
                        <li>Fulfill our role as an agent for travel service providers (e.g., booking your specific tour).</li>
                    </ul>

                    <h3 id="disclosure" className="text-2xl font-bold text-gray-900 mt-12">5. Information Access and Disclosure</h3>
                    <p>We do not sell or trade your personally identifiable information. We may share information with:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Trusted Third Parties:</strong> Who assist in operating our website or conducting business, under strict confidentiality agreements.</li>
                        <li><strong>Travel Service Providers:</strong> To facilitate the specific services you have booked.</li>
                        <li><strong>Legal Compliance:</strong> When required by law or subpoena.</li>
                    </ul>

                    <h3 id="cookies" className="text-2xl font-bold text-gray-900 mt-12">6. Cookie Policy</h3>
                    <p>Cookies are small files stored on your hard drive that help us:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Make the website work as expected.</li>
                        <li>Remember your settings between visits.</li>
                        <li>Improve site speed and security.</li>
                    </ul>
                    <p><em>Note: You can adjust your browser settings (Chrome, Firefox, etc.) to delete or block cookies, though some parts of the Tickets in Rome site may not load correctly without them.</em></p>

                    <h3 id="widgets" className="text-2xl font-bold text-gray-900 mt-12">7. Third-Party Widgets</h3>
                    <p>Our site may use third-party applications. Your interaction with these widgets is governed by the privacy policies of the companies providing them.</p>

                    <h3 id="pixels" className="text-2xl font-bold text-gray-900 mt-12">8. Tracking Pixels</h3>
                    <p>We use pixels to track user traffic patterns. While these cannot be disabled directly, they often rely on cookies to function; deleting cookies will impair their tracking ability.</p>

                    <h3 id="security" className="text-2xl font-bold text-gray-900 mt-12">9. Data Storage and Security</h3>
                    <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Storage:</strong> Data is housed and accessible in our Central Data Center.</li>
                        <li><strong>Retention:</strong> We retain your personal data only as long as necessary to fulfill the purposes for which it was collected, such as providing our services, complying with legal obligations (including tax and accounting requirements), resolving disputes, and enforcing our agreements. Booking-related data is typically kept for up to 7 years, after which it is securely deleted or anonymized.</li>
                        <li><strong>Security:</strong> While we use commercially acceptable means to protect your Personal Information, no method of electronic storage is 100% secure.</li>
                    </ul>

                    <h3 id="deletion" className="text-2xl font-bold text-gray-900 mt-12">10. Can I delete my Personal Data from Tickets in Rome?</h3>
                    <p>Please write an email to <a href="mailto:info@ticketsinrome.com" className="text-emerald-700 font-bold hover:underline">info@ticketsinrome.com</a> with your name, email address, and phone number to request removal. We will require identity verification before processing the request.</p>

                    <h3 id="children" className="text-2xl font-bold text-gray-900 mt-12">11. Children’s Online Privacy Protection</h3>
                    <p>We comply with COPPA. Our Service does not address anyone under the age of 18. If we discover a child under 18 has provided us with Personal Information, we will delete it immediately.</p>

                    <h3 id="changes" className="text-2xl font-bold text-gray-900 mt-12">12. Changes to this Privacy Policy</h3>
                    <p>We may update this policy from time to time. We will notify you by posting the new Privacy Policy on this page. Changes are effective immediately upon posting.</p>

                    <h3 id="contact" className="text-2xl font-bold text-gray-900 mt-12">13. Contact Information & Feedback</h3>
                    <p>If you wish to modify, correct, or delete your personal information, please contact us at <a href="mailto:info@ticketsinrome.com" className="text-emerald-700 font-bold hover:underline">info@ticketsinrome.com</a>.</p>
                    <p>For our full contact info, visit: <a href="/contact" className="text-emerald-700 font-bold hover:underline">https://ticketsinrome.com/contact/</a></p>
                </div>
            </div>

            <Footer />
        </main>
    );
}
