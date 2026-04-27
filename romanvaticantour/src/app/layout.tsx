import type { Metadata } from "next";
import { Google_Sans_Flex } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { SiteProvider } from "@/components/SiteProvider";
import GlobalThemeProvider from "@/components/GlobalThemeProvider";
import GoogleTranslate from "@/components/GoogleTranslate";
import { getSite, DEFAULT_SITE_ID } from "@/lib/dataAdapter";
import { CartProvider } from "@/context/CartContext";
import CurveTransition from "@/components/CurveTransition";
import WhatsAppButton from "@/components/WhatsAppButton";

const googleSans = Google_Sans_Flex({ 
  subsets: ["latin"], 
  variable: "--font-google-sans",
  weight: "variable", // Use variable weight
  display: 'swap',
});

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite(DEFAULT_SITE_ID);
  return {
    title: site?.seo?.metaTitle || "Roman Vatican Tour",
    description: site?.seo?.metaDescription || "Exclusive tours in Rome.",
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const site = await getSite(DEFAULT_SITE_ID);

  return (
    <html lang="en">
      <body className={`${googleSans.variable} font-sans antialiased`}>
        <SiteProvider site={site}>
          <GlobalThemeProvider>
            <LanguageProvider>
              <CartProvider>
                <GoogleTranslate />
                <CurveTransition>
                  {children}
                </CurveTransition>
                <WhatsAppButton />
              </CartProvider>
            </LanguageProvider>
          </GlobalThemeProvider>
        </SiteProvider>
      </body>
    </html>
  );
}
