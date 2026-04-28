import type { Metadata } from "next";
import { Radio_Canada_Big } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { SiteProvider } from "@/components/SiteProvider";
import GlobalThemeProvider from "@/components/GlobalThemeProvider";
import GoogleTranslate from "@/components/GoogleTranslate";
import { getSite, DEFAULT_SITE_ID } from "@/lib/dataAdapter";
import { CartProvider } from "@/context/CartContext";
import CurveTransition from "@/components/CurveTransition";
import WhatsAppButton from "@/components/WhatsAppButton";
import SmoothScroll from "@/components/SmoothScroll";
import CookieBanner from "@/components/CookieBanner";

const radioCanada = Radio_Canada_Big({ 
  subsets: ["latin"], 
  variable: "--font-radio",
  weight: ['400', '500', '600'], // Staying around the requested weights
  display: 'swap',
});

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite(DEFAULT_SITE_ID);
  return {
    title: site?.seo?.metaTitle || "Rome Tours & AR Audio Guides | Wonders of Rome",
    description: site?.seo?.metaDescription || "Explore Rome with AR audio guides & self-guided tours. Skip-the-line Vatican, Colosseum tickets. Download the Wonders of Rome app today.",
    applicationName: "Wonders of Rome",
    keywords: ["Rome tours", "Vatican audio guide", "AR Rome app", "Colosseum tickets", "self-guided Rome tours", "skip-the-line Vatican"],
    openGraph: {
      siteName: "Wonders of Rome",
      title: site?.seo?.metaTitle || "Rome Tours & AR Audio Guides | Wonders of Rome",
      description: site?.seo?.metaDescription || "Explore Rome with AR audio guides & self-guided tours. Skip-the-line Vatican, Colosseum tickets.",
      url: process.env.NEXT_PUBLIC_SITE_URL || "https://wondersofrome.com",
      type: "website",
      images: [
        {
          url: "https://pub-772bbb33a07f4026aa9652a0cfef4c2e.r2.dev/logod/logo.png",
          width: 1200,
          height: 630,
          alt: "Wonders of Rome AR Audio Guide App"
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: site?.seo?.metaTitle || "Rome Tours & AR Audio Guides | Wonders of Rome",
      description: site?.seo?.metaDescription || "Explore Rome with AR audio guides & self-guided tours",
    }
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const site = await getSite(DEFAULT_SITE_ID);
  const siteSlug = site?.slug?.current || DEFAULT_SITE_ID;

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "TouristAttraction",
              "name": "Wonders of Rome",
              "description": "AR audio guide app and self-guided tours for Vatican Museums, Colosseum, and Rome attractions",
              "url": process.env.NEXT_PUBLIC_SITE_URL || "https://wondersofrome.com",
              "image": "https://pub-772bbb33a07f4026aa9652a0cfef4c2e.r2.dev/logod/logo.png",
              "priceRange": "€€",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Rome",
                "addressCountry": "IT"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.9",
                "reviewCount": "1200"
              },
              "potentialAction": {
                "@type": "SearchAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": `${process.env.NEXT_PUBLIC_SITE_URL || "https://wondersofrome.com"}/search?q={search_term_string}`
                },
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </head>
      <body className={`${radioCanada.variable} font-sans antialiased`} data-site={siteSlug}>
        <SiteProvider site={site}>
          <GlobalThemeProvider>
            <LanguageProvider>
              <CartProvider>
                <GoogleTranslate />
                <CurveTransition>
                    <SmoothScroll>
                        <WhatsAppButton />
                        <CookieBanner />
                        {children}
                    </SmoothScroll>
                </CurveTransition>
              </CartProvider>
            </LanguageProvider>
          </GlobalThemeProvider>
        </SiteProvider>
      </body>
    </html>
  );
}
