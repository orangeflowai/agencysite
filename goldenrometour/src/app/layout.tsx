import React from "react"
import type { Metadata } from 'next'
import { Inter, Instrument_Serif } from 'next/font/google'
import WhatsAppButton from '@/components/WhatsAppButton'
import { SiteProvider } from '@/components/SiteProvider'
import { CartProvider } from '@/context/CartContext'
import { LanguageProvider } from "@/context/LanguageContext";
import { getSite, DEFAULT_SITE_ID } from "@/lib/dataAdapter";
import './globals.css'

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-instrument-serif',
  display: 'swap',
});

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite(DEFAULT_SITE_ID);
  const siteName = site?.title || process.env.NEXT_PUBLIC_SITE_NAME || 'Golden Rome Tour';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://goldenrometour.com';

  return {
    metadataBase: new URL(siteUrl),
    title: site?.seo?.metaTitle || "Golden Rome Tour | Official Skip-the-Line Vatican Tours",
    description: site?.seo?.metaDescription || "Experience the Vatican Museums & Sistine Chapel with accredited art historians. Authorized skip-the-line access for small groups and private expeditions.",
    applicationName: siteName,
    keywords: ["Vatican tours", "Sistine Chapel private access", "Vatican Museums guide", "St. Peters Basilica tour", "art historian Vatican tour", "Vatican skip-the-line", "Vatican private tours", "Vatican small group tours", "Golden Rome Tour"],
    icons: {
      icon: [
        {
          url: '/icon-light-32x32.png',
          media: '(prefers-color-scheme: light)',
        },
        {
          url: '/icon-dark-32x32.png',
          media: '(prefers-color-scheme: dark)',
        },
        {
          url: '/icon.svg',
          type: 'image/svg+xml',
        },
      ],
      apple: '/apple-icon.png',
    },
    openGraph: {
      siteName,
      title: site?.seo?.metaTitle || "Golden Rome Tour | Official Vatican Museum Access",
      description: site?.seo?.metaDescription || "Exclusive Vatican Museums & Sistine Chapel tours with art historians. Maximum 6 guests per tour. Skip-the-line access.",
      url: siteUrl,
      type: 'website',
      images: [
        {
          url: site?.favicon?.asset?.url || "/vatican-museums.jpg",
          width: 1200,
          height: 630,
          alt: "Golden Rome Tour - Official Vatican Museum Tours"
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: site?.seo?.metaTitle || "Golden Rome Tour | Official Vatican Tours",
      description: site?.seo?.metaDescription || "Exclusive Vatican Museums tours with art historians. Skip-the-line access.",
    },
  };
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const site = await getSite(DEFAULT_SITE_ID);

  return (
    <html lang="en" className="bg-background">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "TouristAttraction",
              "name": "Golden Rome Tour",
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
        className={`${inter.variable} ${instrumentSerif.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <SiteProvider site={site}>
          <LanguageProvider>
            <CartProvider>
              {children}
              <WhatsAppButton />
            </CartProvider>
          </LanguageProvider>
        </SiteProvider>
      </body>
    </html>
  );
}
