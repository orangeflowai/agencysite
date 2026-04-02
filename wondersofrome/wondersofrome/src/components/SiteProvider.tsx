'use client'

import { createContext, useContext, ReactNode } from 'react'
import { Site } from '@/lib/sanityService'

interface SiteContextType {
    site: Site | null
}

const SiteContext = createContext<SiteContextType>({ site: null })

export function SiteProvider({ 
    children, 
    site 
}: { 
    children: ReactNode
    site: Site | null 
}) {
    return (
        <SiteContext.Provider value={{ site }}>
            {children}
        </SiteContext.Provider>
    )
}

export function useSite() {
    const context = useContext(SiteContext)
    if (!context) {
        throw new Error('useSite must be used within SiteProvider')
    }
    return context.site
}
