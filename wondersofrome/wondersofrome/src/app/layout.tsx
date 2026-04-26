import type { Metadata } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";
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

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-sans",
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

const sourceSerif = Source_Serif_4({ 
  subsets: ["latin"], 
  variable: "--font-serif",
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite(DEFAULT_SITE_ID);
  return {
    title: site?.seo?.metaTitle || "Wonders of Rome | Official Tours",
    description: site?.seo?.metaDescription || "Expert-led historian tours in Rome.",
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const site = await getSite(DEFAULT_SITE_ID);
  const siteSlug = site?.slug?.current || DEFAULT_SITE_ID;

  return (
    <html lang="en">
      <body className={`${inter.variable} ${sourceSerif.variable} font-sans antialiased`} data-site={siteSlug}>
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
