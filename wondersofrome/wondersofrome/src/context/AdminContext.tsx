'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAllSites, Site } from '@/lib/sanityService';

interface AdminContextType {
    selectedSiteId: string;
    setSelectedSiteId: (id: string) => void;
    sites: Site[];
    isLoading: boolean;
    currentSite: Site | undefined;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
    // Default to env var or site-specific ID
    const [selectedSiteId, setSelectedSiteId] = useState<string>('');
    const [sites, setSites] = useState<Site[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadSites = async () => {
            try {
                const siteList = await getAllSites();
                setSites(siteList);

                const defaultSite = process.env.NEXT_PUBLIC_SITE_ID || 'wondersofrome';
                setSelectedSiteId(defaultSite);

                console.log('Active Site:', defaultSite);
            } catch (err) {
                console.error("Failed to load sites", err);
                const defaultSite = process.env.NEXT_PUBLIC_SITE_ID || 'wondersofrome';
                setSelectedSiteId(defaultSite);
            } finally {
                setIsLoading(false);
            }
        };

        loadSites();
    }, []);

    // Selection is locked to current site
    const handleSetSite = (id: string) => {
        // No-op or force current site
        const defaultSite = process.env.NEXT_PUBLIC_SITE_ID || 'wondersofrome';
        setSelectedSiteId(defaultSite);
    };

    const currentSite = sites.find(s => s.slug.current === selectedSiteId);

    return (
        <AdminContext.Provider value={{
            selectedSiteId,
            setSelectedSiteId: handleSetSite,
            sites,
            isLoading,
            currentSite
        }}>
            {children}
        </AdminContext.Provider>
    );
}

export function useAdmin() {
    const context = useContext(AdminContext);
    if (context === undefined) {
        throw new Error('useAdmin must be used within an AdminProvider');
    }
    return context;
}
