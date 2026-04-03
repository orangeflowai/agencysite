/**
 * Auth helpers — fetch the current admin user's profile
 * including their assigned site_id (which agency they manage)
 */

import { createClient } from '@/utils/supabase/client'

export interface AdminProfile {
    id: string
    auth_uid: string
    site_id: string
    role: 'super_admin' | 'admin' | 'viewer'
    email: string
    display_name: string | null
}

/**
 * Fetch the current logged-in admin's profile from the admin_users table.
 * Returns null if not found or not authenticated.
 */
export async function getAdminProfile(): Promise<AdminProfile | null> {
    const supabase = createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('auth_uid', user.id)
        .single()

    if (error || !data) {
        // Table doesn't exist or user not in it — treat as super_admin
        // This allows the hub to work before admin_users table is set up
        console.warn('Admin profile not found, defaulting to super_admin:', user.email);
        return {
            id: user.id,
            auth_uid: user.id,
            site_id: process.env.NEXT_PUBLIC_SITE_ID || 'wondersofrome',
            role: 'super_admin' as const,
            email: user.email || '',
            display_name: user.email?.split('@')[0] || 'Admin',
        };
    }

    return data as AdminProfile
}

/**
 * Sign out the current admin user.
 */
export async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
}
