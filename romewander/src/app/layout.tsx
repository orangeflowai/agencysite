import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import WhatsAppButton from "@/components/WhatsAppButton";
import SmoothScroll from "@/components/SmoothScroll";
import CookieBanner from "@/components/CookieBanner";
import { LanguageProvider } from "@/context/LanguageContext";
import { SiteProvider } from "@/components/SiteProvider";
import GlobalThemeProvider from "@/components/GlobalThemeProvider";
import GoogleTranslate from "@/components/GoogleTranslate";
import { getSite, DEFAULT_SITE_ID } from "@/lib/sanityService";
import { CartProvider } from "@/context/CartContext";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite(DEFAULT_SITE_ID);
  const siteName = site?.title || process.env.NEXT_PUBLIC_SITE_NAME || 'Tour Agency';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com';

  return {
    title: site?.seo?.metaTitle || `${siteName} | Official Tours`,
    description: site?.seo?.metaDescription || `Book skip-the-line tours with ${siteName}. Expert guides, instant confirmation.`,
    applicationName: siteName,
    openGraph: {
      siteName,
      title: site?.seo?.metaTitle || `${siteName} | Official Tours`,
      description: site?.seo?.metaDescription || `Book skip-the-line tours with ${siteName}.`,
      url: siteUrl,
      type: 'website',
    },
    other: { 'viewport': 'width=device-width, initial-scale=1' },
  };
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const site = await getSite(DEFAULT_SITE_ID);
  const siteName = site?.title || process.env.NEXT_PUBLIC_SITE_NAME || 'Tour Agency';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com';
  const siteSlug = site?.slug?.current || DEFAULT_SITE_ID;

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": siteName,
              "url": siteUrl,
              "potentialAction": {
                "@type": "SearchAction",
                "target": { "@type": "EntryPoint", "urlTemplate": `${siteUrl}/search?q={search_term_string}` },
                "query-input": "required name=search_term_string",
              },
            })
          }}
        />
      </head>
      <body
        className={`${inter.variable} font-inter antialiased`}
        data-site-id={siteSlug}
        data-site={siteSlug}
        suppressHydrationWarning
      >
        <SiteProvider site={site}>
          <GlobalThemeProvider>
            <LanguageProvider>
              <CartProvider>
                <GoogleTranslate />
                <SmoothScroll>
                  <CookieBanner />
                  {children}
                </SmoothScroll>
              </CartProvider>
            </LanguageProvider>
          </GlobalThemeProvider>
        </SiteProvider>
      </body>
    </html>
  );
}
