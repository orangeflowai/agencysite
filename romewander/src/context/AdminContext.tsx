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

                // Check localStorage for preference
                const storedSite = localStorage.getItem('admin_selected_site');
                const defaultSite = process.env.NEXT_PUBLIC_SITE_ID || process.env.NEXT_PUBLIC_SITE_ID || 'romewander';

                console.log('Available Sites:', siteList);

                if (storedSite && siteList.some(s => s.slug.current === storedSite)) {
                    setSelectedSiteId(storedSite);
                } else if (siteList.length > 0) {
                    // Prefer the env default if it exists in the list, otherwise first one
                    const match = siteList.find(s => s.slug.current === defaultSite);
                    setSelectedSiteId(match ? match.slug.current : siteList[0].slug.current);
                } else {
                    setSelectedSiteId(defaultSite);
                }

            } catch (err) {
                console.error("Failed to load sites", err);
            } finally {
                setIsLoading(false);
            }
        };

        loadSites();
    }, []);

    // Persist selection
    const handleSetSite = (id: string) => {
        setSelectedSiteId(id);
        localStorage.setItem('admin_selected_site', id);
        // Dispatch a custom event so other components (like non-context hooks if any/legacy) can know
        window.dispatchEvent(new Event('site-changed'));
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
