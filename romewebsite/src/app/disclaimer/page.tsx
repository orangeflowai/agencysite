
import React from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Disclaimer | ${process.env.NEXT_PUBLIC_SITE_NAME || "Your Agency"}',
    description: 'Disclaimer for ${process.env.NEXT_PUBLIC_SITE_NAME || "Your Agency"} website usage and travel risks.',
};

export default function Disclaimer() {
    return (
        <main className="min-h-screen bg-cream selection:bg-olive selection:text-white">
            <Navbar />

            <div className="container mx-auto px-4 py-24 max-w-4xl">
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-8 tracking-tight">Disclaimer</h1>

                <div className="prose prose-lg prose-emerald text-gray-600 max-w-none space-y-8">
                    <p className="lead text-xl text-gray-800 font-medium">
                        The information provided by ${process.env.NEXT_PUBLIC_SITE_NAME || "Your Agency"} (“we,” “us,” or “our”) on <a href="${process.env.NEXT_PUBLIC_SITE_URL || "https://yourdomain.com"}" className="text-emerald-700 font-bold hover:underline">${process.env.NEXT_PUBLIC_SITE_URL || "https://yourdomain.com"}</a> (the “Site”) and through our mobile applications or services is for general informational purposes only. All information on the Site is provided in good faith, however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the Site.
                    </p>

                    <h3 className="text-2xl font-bold text-gray-900 mt-12">1. External Links Disclaimer</h3>
                    <p>
                        The Site may contain (or you may be sent through the Site) links to other websites or content belonging to or originating from third parties. Such external links are not investigated, monitored, or checked for accuracy, adequacy, validity, reliability, or completeness by us.
                    </p>
                    <p>
                        ${process.env.NEXT_PUBLIC_SITE_NAME || "Your Agency"} does not warrant, endorse, guarantee, or assume responsibility for the accuracy or reliability of any information offered by third-party websites linked through the site. We will not be a party to or in any way be responsible for monitoring any transaction between you and third-party providers of products or services.
                    </p>

                    <h3 className="text-2xl font-bold text-gray-900 mt-12">2. Professional Disclaimer (Travel Risks)</h3>
                    <p>
                        Travel involves inherent risks. ${process.env.NEXT_PUBLIC_SITE_NAME || "Your Agency"} acts as an intermediary between clients and tour service providers (including but not limited to museums, transport companies, and local guides).
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li><strong>Site Closures:</strong> We are not responsible for sudden closures of monuments, museums, or archaeological sites dictated by governing authorities or unexpected events.</li>
                        <li><strong>Personal Injury:</strong> We shall not be held liable for any injury, loss, claim, damage, or any indirect, incidental, or consequential damages of any kind which arise out of or are in any way connected with the performance of any travel service provider.</li>
                    </ul>

                    <h3 className="text-2xl font-bold text-gray-900 mt-12">3. Errors and Omissions Disclaimer</h3>
                    <p>
                        While we have made every attempt to ensure that the information contained in this site has been obtained from reliable sources, ${process.env.NEXT_PUBLIC_SITE_NAME || "Your Agency"} is not responsible for any errors or omissions, or for the results obtained from the use of this information. All information in this Site is provided "as is," with no guarantee of completeness, accuracy, or timeliness.
                    </p>

                    <h3 className="text-2xl font-bold text-gray-900 mt-12">4. "Use at Your Own Risk" Disclaimer</h3>
                    <p>
                        Every effort is made to keep the website up and running smoothly. However, ${process.env.NEXT_PUBLIC_SITE_NAME || "Your Agency"} takes no responsibility for, and will not be liable for, the website being temporarily unavailable due to technical issues beyond our control. Your use of the Site and your reliance on any information on the Site is solely at your own risk.
                    </p>

                    <h3 className="text-2xl font-bold text-gray-900 mt-12">5. Contact Us</h3>
                    <p>
                        If you require any more information or have any questions about our site's disclaimer, please feel free to contact us by email at <a href="mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL || "info@yourdomain.com"}" className="text-emerald-700 font-bold hover:underline">${process.env.NEXT_PUBLIC_CONTACT_EMAIL || "info@yourdomain.com"}</a>.
                    </p>
                </div>
            </div>

            <Footer />
        </main>
    );
}
