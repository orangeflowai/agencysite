
import Stripe from 'stripe';

// Site-specific Stripe configurations
const ROME_CONFIG = {
    secretKey: process.env.STRIPE_SECRET_KEY_ROME || process.env.STRIPE_SECRET_KEY,
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_ROME || process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET_ROME || process.env.STRIPE_WEBHOOK_SECRET,
};

const WONDERS_CONFIG = {
    secretKey: process.env.STRIPE_SECRET_KEY_WONDERS || process.env.STRIPE_SECRET_KEY,
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_WONDERS || process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET_WONDERS || process.env.STRIPE_WEBHOOK_SECRET,
};

const STRIPE_CONFIGS: Record<string, typeof ROME_CONFIG> = {
    'rome-tour-tickets': ROME_CONFIG,
    'ticketsinrome': ROME_CONFIG,
    'wondersofrome': WONDERS_CONFIG,
    'wonders-of-rome': WONDERS_CONFIG,
};

export type SiteId = keyof typeof STRIPE_CONFIGS;

/**
 * Get Stripe configuration for a specific site
 */
export function getStripeConfig(siteId: string) {
    const config = STRIPE_CONFIGS[siteId as SiteId] || STRIPE_CONFIGS['rome-tour-tickets'];

    if (!config.secretKey || config.secretKey === 'sk_test_dummy') {
        throw new Error(`Stripe secret key not configured for site: ${siteId}`);
    }

    return config;
}

// Singleton cache for Stripe instances
const stripeInstances: Record<string, Stripe> = {};

/**
 * Get Stripe instance for a specific site (Singleton)
 */
export function getStripe(siteId: string): Stripe {
    if (stripeInstances[siteId]) {
        return stripeInstances[siteId];
    }

    const config = getStripeConfig(siteId);

    const stripe = new Stripe(config.secretKey!, {
        apiVersion: '2024-12-18.acacia' as any,
        typescript: true,
    });

    stripeInstances[siteId] = stripe;
    return stripe;
}

/**
 * Get publishable key for client-side use
 */
export function getPublishableKey(siteId: string): string {
    const config = getStripeConfig(siteId);
    return config.publishableKey || '';
}

/**
 * Get webhook secret for a specific site
 */
export function getWebhookSecret(siteId: string): string {
    const config = getStripeConfig(siteId);
    return config.webhookSecret || '';
}

// Default export for backward compatibility
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy', {
    apiVersion: '2024-12-18.acacia' as any,
    typescript: true,
});
