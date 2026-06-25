import type { Metadata } from 'next';
import { Inter, Cormorant_Garamond, Great_Vibes } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
});

const greatVibes = Great_Vibes({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-great-vibes',
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://goldenrometour.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Golden Rome Tour | Official Vatican Museum Tours',
    template: '%s | Golden Rome Tour',
  },
  description:
    'Skip-the-line Vatican Museums & Sistine Chapel tours with accredited art historians. Guided tours from €65, self-guided tickets from €45. Small groups, instant confirmation.',
  keywords: [
    'Vatican tours', 'Sistine Chapel tickets', 'Vatican Museums skip the line',
    'Vatican guided tour', 'Rome Vatican tickets', 'Vatican private tour',
  ],
  openGraph: {
    siteName: 'Golden Rome Tour',
    title: 'Golden Rome Tour | Official Vatican Museum Tours',
    description:
      'Skip-the-line Vatican Museums & Sistine Chapel tours. Guided tours from €65, tickets from €45.',
    url: siteUrl,
    type: 'website',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Golden Rome Tour' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Golden Rome Tour | Vatican Tours',
    description: 'Skip-the-line Vatican Museums & Sistine Chapel tours.',
  },
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="bg-background">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'TravelAgency',
              name: 'Golden Rome Tour',
              description:
                'Official Vatican Museums & Sistine Chapel tours with accredited art historians. Skip-the-line access.',
              url: siteUrl,
              priceRange: '€45–€65',
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Rome',
                addressRegion: 'Lazio',
                addressCountry: 'IT',
              },
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.9',
                reviewCount: '2850',
              },
            }),
          }}
        />
      </head>
      <body className={`${inter.variable} ${cormorant.variable} ${greatVibes.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
