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
    title: site?.seo?.metaTitle || `${siteName} | Official Tours`,
    description: site?.seo?.metaDescription || `Book skip-the-line tours with ${siteName}. Expert guides, instant confirmation.`,
    applicationName: siteName,
    icons: {
      icon: site?.favicon?.asset?.url || '/logo.png',
      shortcut: site?.favicon?.asset?.url || '/logo.png',
      apple: site?.favicon?.asset?.url || '/logo.png',
    },
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
  const siteSlug = site?.slug?.current || DEFAULT_SITE_ID;

  return (
    <html lang="en">
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
