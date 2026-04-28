import type { Metadata } from "next";
import { Roboto_Flex } from "next/font/google";
import "./globals.css";
import WhatsAppButton from "@/components/WhatsAppButton";
import SmoothScroll from "@/components/SmoothScroll";
import CookieBanner from "@/components/CookieBanner";
import { LanguageProvider } from "@/context/LanguageContext";
import { SiteProvider } from "@/components/SiteProvider";
import GlobalThemeProvider from "@/components/GlobalThemeProvider";
import GoogleTranslate from "@/components/GoogleTranslate";
import { getSite, DEFAULT_SITE_ID } from "@/lib/dataAdapter";
import { CartProvider } from "@/context/CartContext";
import CurveTransition from "@/components/CurveTransition";

const robotoFlex = Roboto_Flex({
  subsets: ['latin'],
  variable: '--font-roboto',
  display: 'swap',
});

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite(DEFAULT_SITE_ID);
  const siteName = site?.title || process.env.NEXT_PUBLIC_SITE_NAME || 'Golden Rome Tour';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://goldenrometour.com';

  return {
    title: site?.seo?.metaTitle || "Luxury Small-Group Rome Tours | Golden Rome Experience",
    description: site?.seo?.metaDescription || "Luxury small-group Rome tours with art historians. Maximum 6 guests. Skip-the-line Vatican Museums, Colosseum arena floor access. Book Golden Rome.",
    applicationName: siteName,
    keywords: ["luxury Rome tours", "small group Vatican tours", "art historian guide Rome", "exclusive Colosseum access", "VIP Vatican tours", "Golden Rome tours"],
    icons: {
      icon: site?.favicon?.asset?.url || '/logo.png',
      shortcut: site?.favicon?.asset?.url || '/logo.png',
      apple: site?.favicon?.asset?.url || '/logo.png',
    },
    openGraph: {
      siteName,
      title: site?.seo?.metaTitle || "Luxury Small-Group Rome Tours | Golden Rome Experience",
      description: site?.seo?.metaDescription || "Luxury small-group Rome tours with art historians. Maximum 6 guests per tour.",
      url: siteUrl,
      type: 'website',
      images: [
        {
          url: site?.favicon?.asset?.url || "/logo.png",
          width: 1200,
          height: 630,
          alt: "Golden Rome Tour - Luxury Small-Group Experiences"
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: site?.seo?.metaTitle || "Luxury Small-Group Rome Tours",
      description: site?.seo?.metaDescription || "Exclusive tours with art historians. Max 6 guests.",
    },
    },
    other: { 'viewport': 'width=device-width, initial-scale=1' },
  };
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
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
              "name": "Golden Rome Tour",
              "description": "Luxury small-group Rome tours with art historians. Maximum 6 guests per tour. Skip-the-line Vatican Museums and Colosseum arena floor access.",
              "url": process.env.NEXT_PUBLIC_SITE_URL || "https://goldenrometour.com",
              "image": site?.favicon?.asset?.url || "/logo.png",
              "priceRange": "€€€",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Rome",
                "addressCountry": "IT"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.9",
                "reviewCount": "850"
              },
              "potentialAction": {
                "@type": "SearchAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": `${process.env.NEXT_PUBLIC_SITE_URL || "https://goldenrometour.com"}/search?q={search_term_string}`
                },
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </head>
      <body
        className={`${robotoFlex.variable} font-sans antialiased`}
        data-site-id={siteSlug}
        data-site={siteSlug}
        suppressHydrationWarning
      >
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
