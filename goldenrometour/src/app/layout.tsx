import type { Metadata } from "next";
import { Roboto_Flex, Playfair_Display, Cormorant_Garamond, Josefin_Sans, Great_Vibes, Open_Sans, Inter, Instrument_Serif } from "next/font/google";
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

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-instrument-serif',
  display: 'swap',
});

const robotoFlex = Roboto_Flex({
  subsets: ['latin'],
  variable: '--font-roboto',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
});

const josefin = Josefin_Sans({
  subsets: ['latin'],
  variable: '--font-josefin',
  display: 'swap',
});

const vibes = Great_Vibes({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-vibes',
  display: 'swap',
});

const openSans = Open_Sans({
  subsets: ['latin'],
  variable: '--font-open-sans',
  display: 'swap',
});

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite(DEFAULT_SITE_ID);
  const siteName = site?.title || process.env.NEXT_PUBLIC_SITE_NAME || 'Vatican Archives';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://goldenrometour.com';

  return {
    metadataBase: new URL(siteUrl),
    title: site?.seo?.metaTitle || "Vatican Archives | Official Skip-the-Line Vatican Tours",
    description: site?.seo?.metaDescription || "Experience the Vatican Museums & Sistine Chapel with accredited art historians. Authorized skip-the-line access for small groups and private expeditions.",
    applicationName: siteName,
    keywords: ["Vatican tours", "Sistine Chapel private access", "Vatican Museums guide", "St. Peters Basilica tour", "art historian Vatican tour", "Vatican Archives", "Vatican skip-the-line", "Vatican private tours", "Vatican small group tours"],
    icons: {
      icon: site?.favicon?.asset?.url || '/logo.png',
      shortcut: site?.favicon?.asset?.url || '/logo.png',
      apple: site?.favicon?.asset?.url || '/logo.png',
    },
    openGraph: {
      siteName,
      title: site?.seo?.metaTitle || "Vatican Archives | Official Vatican Museum Access",
      description: site?.seo?.metaDescription || "Exclusive Vatican Museums & Sistine Chapel tours with art historians. Maximum 6 guests per tour. Skip-the-line access.",
      url: siteUrl,
      type: 'website',
      images: [
        {
          url: site?.favicon?.asset?.url || "/vatican-museums.jpg",
          width: 1200,
          height: 630,
          alt: "Vatican Archives - Official Vatican Museum Tours"
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: site?.seo?.metaTitle || "Vatican Archives | Official Vatican Tours",
      description: site?.seo?.metaDescription || "Exclusive Vatican Museums tours with art historians. Skip-the-line access.",
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
              "name": "Vatican Archives",
              "description": "Official Vatican Museums & Sistine Chapel tours with accredited art historians. Skip-the-line access for small groups and private expeditions into the Holy See.",
              "url": process.env.NEXT_PUBLIC_SITE_URL || "https://goldenrometour.com",
              "image": site?.favicon?.asset?.url || "/vatican-museums.jpg",
              "priceRange": "€€€",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Vatican City",
                "addressRegion": "Vatican",
                "addressCountry": "VA"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.9",
                "reviewCount": "850"
              },
              "touristType": ["Art Enthusiasts", "History Buffs", "Religious Pilgrims"],
              "availableLanguage": ["English", "Italian", "Spanish", "French", "German"],
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
        className={`${robotoFlex.variable} ${playfair.variable} ${cormorant.variable} ${josefin.variable} ${vibes.variable} ${openSans.variable} ${inter.variable} ${instrumentSerif.variable} font-sans antialiased`}
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
