import { defineField, defineType } from 'sanity'
import { Globe } from 'lucide-react'

export const siteType = defineType({
    name: 'site',
    title: 'Website',
    type: 'document',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    icon: Globe as any,
    groups: [
        { name: 'general', title: 'General' },
        { name: 'branding', title: 'Branding' },
        { name: 'business', title: 'Business Info' },
        { name: 'contact', title: 'Contact' },
        { name: 'gdpr', title: 'GDPR & Legal' },
        { name: 'seo', title: 'SEO' },
    ],
    fields: [
        // General
        defineField({
            name: 'title',
            title: 'Site Name',
            type: 'string',
            validation: (rule) => rule.required(),
            description: 'Display name of the website (e.g., "Wonders of Rome")',
            group: 'general',
        }),
        defineField({
            name: 'slug',
            title: 'Site ID',
            type: 'slug',
            options: {
                source: 'title',
                maxLength: 96,
            },
            validation: (rule) => rule.required(),
            description: 'Unique identifier for this site (e.g., "rome-tour-tickets" or "wondersofrome")',
            group: 'general',
        }),
        defineField({
            name: 'domain',
            title: 'Domain URL',
            type: 'url',
            description: 'Production domain (e.g., https://rome-tour-tickets.com)',
            group: 'general',
        }),
        defineField({
            name: 'isActive',
            title: 'Active',
            type: 'boolean',
            initialValue: true,
            description: 'Whether this site is currently active',
            group: 'general',
        }),

        // Branding
        defineField({
            name: 'logo',
            title: 'Logo',
            type: 'image',
            options: { hotspot: true },
            description: 'Site logo image (transparent PNG recommended)',
            group: 'branding',
        }),
        defineField({
            name: 'logoText',
            title: 'Logo Text',
            type: 'string',
            description: 'Text logo if no image logo (e.g., "Wonders of Rome")',
            group: 'branding',
        }),
        defineField({
            name: 'logoTextAccent',
            title: 'Logo Accent Text',
            type: 'string',
            description: 'Accent part of logo (e.g., "Rome" in "Wonders of Rome")',
            group: 'branding',
        }),
        defineField({
            name: 'favicon',
            title: 'Favicon',
            type: 'image',
            description: 'Site favicon',
            group: 'branding',
        }),
        defineField({
            name: 'brandColors',
            title: 'Brand Colors',
            type: 'object',
            group: 'branding',
            fields: [
                defineField({
                    name: 'primary',
                    title: 'Primary Color',
                    type: 'color',
                    options: {
                        colorList: [
                            { hex: '#0f4c3a' }, { hex: '#1e40af' }, { hex: '#7c3aed' },
                            { hex: '#dc2626' }, { hex: '#ea580c' }, { hex: '#059669' },
                            { hex: '#0891b2' }, { hex: '#be185d' }, { hex: '#4338ca' },
                        ]
                    }
                }),
                defineField({
                    name: 'secondary',
                    title: 'Secondary Color',
                    type: 'color',
                    options: {
                        colorList: [
                            { hex: '#f5f5dc' }, { hex: '#fef3c7' }, { hex: '#dbeafe' },
                            { hex: '#fce7f3' }, { hex: '#d1fae5' }, { hex: '#fef9c3' },
                            { hex: '#ede9fe' }, { hex: '#ffedd5' }, { hex: '#f3f4f6' },
                        ]
                    }
                }),
                defineField({
                    name: 'accent',
                    title: 'Accent Color',
                    type: 'color',
                    options: {
                        colorList: [
                            { hex: '#f59e0b' }, { hex: '#10b981' }, { hex: '#3b82f6' },
                            { hex: '#ef4444' }, { hex: '#8b5cf6' }, { hex: '#ec4899' },
                            { hex: '#14b8a6' }, { hex: '#f97316' }, { hex: '#6366f1' },
                        ]
                    }
                }),
            ]
        }),

        // Business Info
        defineField({
            name: 'businessInfo',
            title: 'Business Information',
            type: 'object',
            group: 'business',
            description: 'Legal business details shown in footer',
            fields: [
                defineField({
                    name: 'companyName',
                    title: 'Company Name',
                    type: 'string',
                    description: 'e.g., "Wonders of Rome S.r.l."',
                }),
                defineField({
                    name: 'vatNumber',
                    title: 'VAT Number (P.IVA)',
                    type: 'string',
                    description: 'e.g., "03188940591"',
                }),
                defineField({
                    name: 'reaNumber',
                    title: 'REA Number',
                    type: 'string',
                    description: 'e.g., "319122"',
                }),
                defineField({
                    name: 'registeredAddress',
                    title: 'Registered Address (Sede Legale)',
                    type: 'string',
                    description: 'e.g., "Via Nettunense 188, Aprilia (LT) 04011"',
                }),
                defineField({
                    name: 'pecEmail',
                    title: 'PEC Email',
                    type: 'string',
                    description: 'Legal certified email address',
                }),
                defineField({
                    name: 'sdiCode',
                    title: 'SDI Code (Codice Destinatario)',
                    type: 'string',
                    description: 'For electronic invoicing',
                }),
                defineField({
                    name: 'shareCapital',
                    title: 'Share Capital',
                    type: 'string',
                    description: 'e.g., "Capitale Sociale: €10.000 i.v."',
                }),
            ]
        }),

        // Contact
        defineField({
            name: 'contactEmail',
            title: 'Contact Email',
            type: 'string',
            group: 'contact',
        }),
        defineField({
            name: 'contactPhone',
            title: 'Contact Phone',
            type: 'string',
            description: 'Phone number shown in checkout "Need Help" box and footer',
            group: 'contact',
        }),
        defineField({
            name: 'whatsappNumber',
            title: 'WhatsApp Number',
            type: 'string',
            description: 'WhatsApp number for the floating button (digits only, e.g., 3514199425)',
            group: 'contact',
        }),
        defineField({
            name: 'officeAddress',
            title: 'Office Address',
            type: 'text',
            rows: 2,
            group: 'contact',
        }),
        defineField({
            name: 'socialLinks',
            title: 'Social Media Links',
            type: 'object',
            group: 'contact',
            fields: [
                defineField({ name: 'facebook', type: 'url', title: 'Facebook' }),
                defineField({ name: 'instagram', type: 'url', title: 'Instagram' }),
                defineField({ name: 'twitter', type: 'url', title: 'Twitter/X' }),
                defineField({ name: 'tripadvisor', type: 'url', title: 'TripAdvisor' }),
                defineField({ name: 'youtube', type: 'url', title: 'YouTube' }),
                defineField({ name: 'linkedin', type: 'url', title: 'LinkedIn' }),
            ]
        }),

        // GDPR & Legal
        defineField({
            name: 'gdprSettings',
            title: 'GDPR Settings',
            type: 'object',
            group: 'gdpr',
            fields: [
                defineField({
                    name: 'cookieBannerTitle',
                    title: 'Cookie Banner Title',
                    type: 'string',
                    initialValue: 'We respect your privacy',
                }),
                defineField({
                    name: 'cookieBannerText',
                    title: 'Cookie Banner Text',
                    type: 'text',
                    rows: 3,
                    initialValue: 'We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.',
                }),
                defineField({
                    name: 'acceptButtonText',
                    title: 'Accept Button Text',
                    type: 'string',
                    initialValue: 'Accept All',
                }),
                defineField({
                    name: 'declineButtonText',
                    title: 'Decline Button Text',
                    type: 'string',
                    initialValue: 'Decline',
                }),
                defineField({
                    name: 'privacyPolicyLink',
                    title: 'Privacy Policy Link',
                    type: 'string',
                    initialValue: '/privacy-policy',
                }),
                defineField({
                    name: 'privacyPolicyText',
                    title: 'Privacy Policy Link Text',
                    type: 'string',
                    initialValue: 'Read our Privacy Policy',
                }),
                defineField({
                    name: 'showCookieBanner',
                    title: 'Show Cookie Banner',
                    type: 'boolean',
                    initialValue: true,
                }),
                defineField({
                    name: 'gdprComplianceRegion',
                    title: 'GDPR Compliance Region',
                    type: 'string',
                    options: {
                        list: [
                            { title: 'EU (Full GDPR)', value: 'eu' },
                            { title: 'Italy Only', value: 'italy' },
                            { title: 'US (CCPA)', value: 'us' },
                            { title: 'UK', value: 'uk' },
                        ]
                    },
                    initialValue: 'eu',
                }),
            ]
        }),
        defineField({
            name: 'legalLinks',
            title: 'Legal Pages',
            type: 'object',
            group: 'gdpr',
            fields: [
                defineField({ name: 'privacyPolicy', type: 'url', title: 'Privacy Policy URL' }),
                defineField({ name: 'termsAndConditions', type: 'url', title: 'Terms & Conditions URL' }),
                defineField({ name: 'cookiePolicy', type: 'url', title: 'Cookie Policy URL' }),
                defineField({ name: 'cancellationPolicy', type: 'url', title: 'Cancellation Policy URL' }),
            ]
        }),

        // SEO
        defineField({
            name: 'seo',
            title: 'Default SEO Settings',
            type: 'object',
            group: 'seo',
            fields: [
                defineField({
                    name: 'metaTitle',
                    title: 'Default Meta Title',
                    type: 'string',
                    description: 'Default title for pages without specific SEO',
                }),
                defineField({
                    name: 'metaDescription',
                    title: 'Default Meta Description',
                    type: 'text',
                    rows: 3,
                    description: 'Default description for pages',
                }),
                defineField({
                    name: 'keywords',
                    title: 'Default Keywords',
                    type: 'array',
                    of: [{ type: 'string' }],
                }),
                defineField({
                    name: 'ogImage',
                    title: 'Default Social Image',
                    type: 'image',
                    description: 'Default Open Graph image for social sharing',
                }),
            ]
        }),
    ],
    preview: {
        select: {
            title: 'title',
            slug: 'slug.current',
            isActive: 'isActive',
        },
        prepare({ title, slug, isActive }) {
            return {
                title: `${title} ${isActive ? '🟢' : '🔴'}`,
                subtitle: slug,
            }
        }
    }
})
