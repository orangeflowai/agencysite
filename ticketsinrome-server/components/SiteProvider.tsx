'use client'

import { createContext, useContext, ReactNode } from 'react'

interface Site {
  _id: string
  name: string
  slug: { current: string }
  primaryColor?: string
  logo?: any
  whatsappNumber?: string
}

const SiteContext = createContext<Site | null>(null)

export function SiteProvider({ children, site }: { children: ReactNode; site?: Site | null }) {
  // Default site configuration for TicketsInRome
  const defaultSite: Site = {
    _id: 'rome-tour-tickets',
    name: process.env.NEXT_PUBLIC_SITE_NAME || 'Tickets in Rome',
    slug: { current: process.env.NEXT_PUBLIC_SITE_ID || 'rome-tour-tickets' },
    primaryColor: '#064034',
    whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+39 351 419 9425',
  }

  return (
    <SiteContext.Provider value={site || defaultSite}>
      {children}
    </SiteContext.Provider>
  )
}

export function useSite() {
  const context = useContext(SiteContext)
  if (!context) {
    // Return default site if no provider
    return {
      _id: 'rome-tour-tickets',
      name: process.env.NEXT_PUBLIC_SITE_NAME || 'Tickets in Rome',
      slug: { current: process.env.NEXT_PUBLIC_SITE_ID || 'rome-tour-tickets' },
      primaryColor: '#064034',
    }
  }
  return context
}
