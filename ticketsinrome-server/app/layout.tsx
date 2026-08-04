import React from "react"
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import WhatsAppButton from '@/components/WhatsAppButton'
import { SiteProvider } from '@/components/SiteProvider'
import { CartProvider } from '@/context/CartContext'
import './globals.css'

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Tickets In Rome | Official Skip-the-Line Entry',
  description: 'Skip the line at Vatican, Colosseum & Rome attractions. Official priority access, licensed historians, small group tours. Book your Roman adventure today.',
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
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className={`${inter.variable} font-sans antialiased`}>
        <SiteProvider>
          <CartProvider>
            {children}
            <WhatsAppButton />
            <Analytics />
          </CartProvider>
        </SiteProvider>
      </body>
    </html>
  )
}
