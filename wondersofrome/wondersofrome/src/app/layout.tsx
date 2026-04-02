import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
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

const playfair = Playfair_Display({
  weight: ['400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

const inter = Inter({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite(DEFAULT_SITE_ID);
  const siteName = 'Wonders of Rome';

  return {
    title: site?.seo?.metaTitle || "Wonders of Rome | Official Vatican & Colosseum Tours",
    description: site?.seo?.metaDescription || "Exclusive skip-the-line tours for the Vatican Museums, Sistine Chapel, and Colosseum. Book your official Rome tour experience today.",
    applicationName: siteName,
    icons: {
      icon: site?.favicon?.asset?.url || '/logo.png',
      shortcut: site?.favicon?.asset?.url || '/logo.png',
      apple: site?.favicon?.asset?.url || '/logo.png',
    },
    openGraph: {
      siteName,
      title: site?.seo?.metaTitle || "Wonders of Rome | Official Vatican & Colosseum Tours",
      description: site?.seo?.metaDescription || "Exclusive skip-the-line tours for the Vatican Museums, Sistine Chapel, and Colosseum.",
      url: 'https://wondersofrome.com',
      type: 'website',
    },
    other: {
      'viewport': 'width=device-width, initial-scale=1',
    }
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const site = await getSite(DEFAULT_SITE_ID);

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Wonders of Rome",
              "alternateName": "wondersofrome.com",
              "url": "https://wondersofrome.com",
              "potentialAction": {
                "@type": "SearchAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": "https://wondersofrome.com/search?q={search_term_string}"
                },
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased`}
        data-site-id={site?.slug?.current || DEFAULT_SITE_ID}
        data-site={site?.slug?.current || DEFAULT_SITE_ID}
        suppressHydrationWarning
      >
        <SiteProvider site={site}>
          <GlobalThemeProvider>
            <LanguageProvider>
              <CartProvider>
                <GoogleTranslate />
                <SmoothScroll>
                  <WhatsAppButton />
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
