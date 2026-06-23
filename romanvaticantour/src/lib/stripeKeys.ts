/**
 * Shared Stripe publishable key resolution for multi-site setup.
 */
const keyMap: Record<string, string> = {
  wondersofrome: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_WONDERSOFROME || '',
  'rome-tour-tickets': process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_ROME_TOUR_TICKETS || '',
  goldenrometour: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_GOLDENROMETOUR || '',
  romanvaticantour: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_ROMANVATICANTOUR || '',
  romewander: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_ROMEWANDER || '',
};

export function getStripeKey(siteId?: string): string {
  const id = siteId || process.env.NEXT_PUBLIC_SITE_ID || 'romanvaticantour';
  return keyMap[id] || process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';
}
