import Stripe from 'stripe';

/**
 * Multi-agency Stripe support.
 *
 * Single agency: set STRIPE_SECRET_KEY / NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
 *
 * Multiple agencies from one codebase: add per-site keys using the site ID
 * as a suffix (uppercased, hyphens → underscores):
 *   STRIPE_SECRET_KEY_MYAGENCY=sk_live_...
 *   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_MYAGENCY=pk_live_...
 *   STRIPE_WEBHOOK_SECRET_MYAGENCY=whsec_...
 */
function envSuffix(siteId: string): string {
  return siteId.toUpperCase().replace(/-/g, '_');
}

function getConfig(siteId: string) {
  const suffix = envSuffix(siteId);
  return {
    secretKey:
      process.env[`STRIPE_SECRET_KEY_${suffix}`] ||
      process.env.STRIPE_SECRET_KEY ||
      '',
    publishableKey:
      process.env[`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_${suffix}`] ||
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
      '',
    webhookSecret:
      process.env[`STRIPE_WEBHOOK_SECRET_${suffix}`] ||
      process.env.STRIPE_WEBHOOK_SECRET ||
      '',
  };
}

const instances: Record<string, Stripe> = {};

export function getStripe(siteId: string): Stripe {
  if (instances[siteId]) return instances[siteId];
  const { secretKey } = getConfig(siteId);
  if (!secretKey) throw new Error(`Stripe secret key not configured for site: ${siteId}`);
  instances[siteId] = new Stripe(secretKey, { apiVersion: '2024-12-18.acacia' as any });
  return instances[siteId];
}

export function getPublishableKey(siteId: string): string {
  return getConfig(siteId).publishableKey;
}

export function getWebhookSecret(siteId: string): string {
  return getConfig(siteId).webhookSecret;
}

export function getStripeConfig(siteId: string) {
  return getConfig(siteId);
}

// Default instance for backward compat
export const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder',
  { apiVersion: '2024-12-18.acacia' as any }
);
