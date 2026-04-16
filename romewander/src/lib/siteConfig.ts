const siteId = process.env.NEXT_PUBLIC_SITE_ID || 'romewander'
const stripeSuffix = siteId.toUpperCase().replace(/-/g, '_')

export const siteConfig = {
  id: siteId,
  name: process.env.NEXT_PUBLIC_SITE_NAME || 'Rome Wander',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://romewander.com',
  email: process.env.EMAIL_FROM || 'info@romewander.com',
  adminEmail: process.env.ADMIN_EMAIL || 'wondersoffrome@gmail.com',
  phone: process.env.NEXT_PUBLIC_SUPPORT_PHONE || '+39 351 419 9425',
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '3514199425',
  address: process.env.NEXT_PUBLIC_OFFICE_ADDRESS || 'Rome, Italy',
  stripePublishableKey:
    (process.env as any)[`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_${stripeSuffix}`] ||
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
    '',
  payloadUrl: process.env.NEXT_PUBLIC_PAYLOAD_URL || 'https://admin.wondersofrome.com',
  dataSource: (process.env.DATA_SOURCE as 'payload' | 'sanity' | 'dual') || 'dual',
} as const

export type SiteConfig = typeof siteConfig
