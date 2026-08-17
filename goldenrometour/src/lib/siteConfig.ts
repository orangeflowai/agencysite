const siteId = process.env.NEXT_PUBLIC_SITE_ID || 'goldenrometour'
const stripeSuffix = siteId.toUpperCase().replace(/-/g, '_')

export const siteConfig = {
  id: siteId,
  name: process.env.NEXT_PUBLIC_SITE_NAME || 'Golden Rome Tours',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://goldenrometour.com',
  email: process.env.EMAIL_FROM || process.env.NEXT_PUBLIC_CONTACT_EMAIL || "goldenrometours@gmail.com",
  adminEmail: process.env.ADMIN_EMAIL || 'admin@goldenrometour.com',
  phone: process.env.NEXT_PUBLIC_SUPPORT_PHONE || '+39 380 264 4344',
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '3802644344',
  address: process.env.NEXT_PUBLIC_OFFICE_ADDRESS || 'Via Germanico 26, 00166 Roma RM, Italy',
  legalName: 'Golden Rome Tours',
  registrationNumber: '17958971008',
  registeredIn: 'Italian Business Register, Italian Chambers of Commerce',
  stripePublishableKey:
    (process.env as any)[`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_${stripeSuffix}`] ||
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
    '',
  payloadUrl: process.env.NEXT_PUBLIC_PAYLOAD_URL || 'https://admin.wondersofrome.com',
  dataSource: (process.env.DATA_SOURCE as 'payload' | 'sanity' | 'dual') || 'dual',
} as const

export type SiteConfig = typeof siteConfig
