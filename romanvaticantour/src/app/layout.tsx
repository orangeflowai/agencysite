import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { getSite, DEFAULT_SITE_ID } from "@/lib/dataAdapter";
import { SiteProvider } from "@/components/SiteProvider";
import { CartProvider } from "@/context/CartContext";
import { LanguageProvider } from "@/context/LanguageContext";
import WhatsAppButton from "@/components/WhatsAppButton";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite(DEFAULT_SITE_ID);
  return {
    title: site?.seo?.metaTitle || "Vatican Pilgrimage Tours & Papal Audience Tickets | Roman Vatican Tour",
    description: site?.seo?.metaDescription || "Vatican pilgrimage tours & Papal Audience tickets. Catholic-focused routes with prayer time. Skip-the-line Sistine Chapel access. Book Roman Vatican Tour.",
    applicationName: "Roman Vatican Tour",
    keywords: ["Vatican pilgrimage", "Papal Audience tickets", "Catholic Rome tours", "Vatican prayer tours", "Sistine Chapel tickets", "St Peter's Basilica tours"],
    openGraph: {
      siteName: "Roman Vatican Tour",
      title: site?.seo?.metaTitle || "Vatican Pilgrimage Tours & Papal Audience Tickets",
      description: site?.seo?.metaDescription || "Vatican pilgrimage tours & Papal Audience tickets. Catholic-focused routes with prayer time.",
      url: process.env.NEXT_PUBLIC_SITE_URL || "https://romanvaticantour.com",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: site?.seo?.metaTitle || "Vatican Pilgrimage Tours",
      description: site?.seo?.metaDescription || "Catholic-focused Vatican tours with prayer time",
    }
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const site = await getSite(DEFAULT_SITE_ID);

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "TouristAttraction",
              "name": "Roman Vatican Tour",
              "description": "Vatican pilgrimage tours and Papal Audience tickets. Catholic-focused routes with prayer time and skip-the-line Sistine Chapel access.",
              "url": process.env.NEXT_PUBLIC_SITE_URL || "https://romanvaticantour.com",
              "image": "/logo.png",
              "priceRange": "€€",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Rome",
                "addressCountry": "IT"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.9",
                "reviewCount": "650"
              },
              "potentialAction": {
                "@type": "SearchAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": `${process.env.NEXT_PUBLIC_SITE_URL || "https://romanvaticantour.com"}/search?q={search_term_string}`
                },
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </head>
      <body className={`${playfair.variable} ${inter.variable} font-sans antialiased`}>
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
