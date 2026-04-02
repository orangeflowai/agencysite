'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAllSites, Site } from '@/lib/sanityService';
import { getAdminProfile, AdminProfile, signOut } from '@/lib/auth';

interface AdminContextType {
    // Auth
    adminProfile: AdminProfile | null;
    isAuthLoading: boolean;
    signOut: () => Promise<void>;

    // Site selection (locked to user's assigned site unless super_admin)
    selectedSiteId: string;
    setSelectedSiteId: (id: string) => void; // Only usable by super_admin
    sites: Site[];
    isLoading: boolean;
    currentSite: Site | undefined;

    // Helpers
    canSwitchSites: boolean; // true only if role === 'super_admin'
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
    const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);
    const [isAuthLoading, setIsAuthLoading] = useState(true);
    const [selectedSiteId, setSelectedSiteIdState] = useState<string>('');
    const [sites, setSites] = useState<Site[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const init = async () => {
            try {
                // 1. Get admin profile (includes site_id for their agency)
                const profile = await getAdminProfile();
                setAdminProfile(profile);

                // 2. Load all Sanity sites (for display info)
                const siteList = await getAllSites();
                setSites(siteList);

                // 3. Determine which site to show
                if (profile) {
                    if (profile.role === 'super_admin') {
                        // Super admin: check localStorage preference
                        const stored = localStorage.getItem('admin_selected_site');
                        const match = stored && siteList.some(s => s.slug.current === stored);
                        setSelectedSiteIdState(match ? stored! : (siteList[0]?.slug.current || profile.site_id));
                    } else {
                        // Regular admin: locked to their site
                        setSelectedSiteIdState(profile.site_id);
                    }
                } else {
                    // Fallback (shouldn't happen if middleware works)
                    const defaultSite = process.env.NEXT_PUBLIC_SITE_ID || 'rome-tour-tickets';
                    setSelectedSiteIdState(siteList[0]?.slug.current || defaultSite);
                }
            } catch (err) {
                console.error('AdminContext init error:', err);
            } finally {
                setIsAuthLoading(false);
                setIsLoading(false);
            }
        };

        init();
    }, []);

    const handleSetSite = (id: string) => {
        // Only super_admin can switch sites
        if (adminProfile?.role !== 'super_admin') return;
        setSelectedSiteIdState(id);
        localStorage.setItem('admin_selected_site', id);
        window.dispatchEvent(new Event('site-changed'));
    };

    const handleSignOut = async () => {
        await signOut();
        // Redirect to login
        window.location.href = '/admin/login';
    };

    const currentSite = sites.find(s => s.slug.current === selectedSiteId);
    const canSwitchSites = adminProfile?.role === 'super_admin';

    return (
        <AdminContext.Provider value={{
            adminProfile,
            isAuthLoading,
            signOut: handleSignOut,
            selectedSiteId,
            setSelectedSiteId: handleSetSite,
            sites,
            isLoading,
            currentSite,
            canSwitchSites,
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
