'use server';

import { createClient } from 'next-sanity';
import { revalidatePath } from 'next/cache';
import { apiVersion, dataset, projectId } from '@/sanity/env';

const client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    token: process.env.SANITY_API_TOKEN,
});

interface SettingsPayload {
    siteId: string;
    business: {
        companyName: string;
        vatNumber: string;
        reaNumber: string;
        registeredAddress: string;
        pecEmail: string;
        sdiCode: string;
        shareCapital: string;
    };
    contact: {
        contactEmail: string;
        contactPhone: string;
        whatsappNumber: string;
        officeAddress: string;
    };
    gdpr: {
        cookieBannerTitle: string;
        cookieBannerText: string;
        acceptButtonText: string;
        declineButtonText: string;
        privacyPolicyLink: string;
        privacyPolicyText: string;
        showCookieBanner: boolean;
        gdprComplianceRegion: string;
    };
}

export async function saveSettings(payload: SettingsPayload) {
    if (!process.env.SANITY_API_TOKEN) {
        return { success: false, error: 'Missing SANITY_API_TOKEN' };
    }

    try {
        // Find the site document by slug
        const site = await client.fetch(
            `*[_type == "site" && slug.current == $siteId][0]{ _id }`,
            { siteId: payload.siteId }
        );

        if (!site?._id) {
            return { success: false, error: `Site "${payload.siteId}" not found in Sanity` };
        }

        await client
            .patch(site._id)
            .set({
                contactEmail: payload.contact.contactEmail,
                contactPhone: payload.contact.contactPhone,
                whatsappNumber: payload.contact.whatsappNumber,
                officeAddress: payload.contact.officeAddress,
                businessInfo: {
                    _type: 'businessInfo',
                    companyName: payload.business.companyName,
                    vatNumber: payload.business.vatNumber,
                    reaNumber: payload.business.reaNumber,
                    registeredAddress: payload.business.registeredAddress,
                    pecEmail: payload.business.pecEmail,
                    sdiCode: payload.business.sdiCode,
                    shareCapital: payload.business.shareCapital,
                },
                gdprSettings: {
                    _type: 'gdprSettings',
                    cookieBannerTitle: payload.gdpr.cookieBannerTitle,
                    cookieBannerText: payload.gdpr.cookieBannerText,
                    acceptButtonText: payload.gdpr.acceptButtonText,
                    declineButtonText: payload.gdpr.declineButtonText,
                    privacyPolicyLink: payload.gdpr.privacyPolicyLink,
                    privacyPolicyText: payload.gdpr.privacyPolicyText,
                    showCookieBanner: payload.gdpr.showCookieBanner,
                    gdprComplianceRegion: payload.gdpr.gdprComplianceRegion,
                },
            })
            .commit();

        revalidatePath('/');
        revalidatePath('/admin/settings');

        return { success: true };
    } catch (e: any) {
        console.error('[saveSettings]', e);
        return { success: false, error: e?.response?.body?.message || e?.message || 'Save failed' };
    }
}
