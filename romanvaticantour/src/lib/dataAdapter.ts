/**
 * dataAdapter.ts — Unified data layer
 */

import * as sanity  from './sanityService'
import * as payload from './payloadService'

export type { Tour, Post, Site, Settings } from './sanityService'

const source = process.env.DATA_SOURCE || 'payload'
export const DEFAULT_SITE_ID = process.env.NEXT_PUBLIC_SITE_ID || 'wondersofrome'

const R2_BASE = 'https://pub-772bbb33a07f4026aa9652a0cfef4c2e.r2.dev/rome%20photos';
const FALLBACKS = {
    wondersofrome: [
        `${R2_BASE}/pexels-nastiz-12604242.jpg`,
        `${R2_BASE}/pexels-matteobasilephoto-11200578.jpg`
    ],
    ticketsinrome: [
        `${R2_BASE}/pexels-c1superstar-27096007.jpg`,
        `${R2_BASE}/pexels-alex-250137-757239.jpg`
    ],
    goldenrometour: [
        `${R2_BASE}/pexels-filiamariss-30785778.jpg`,
        `${R2_BASE}/pexels-nastiz-12604242.jpg`
    ],
    romanvaticantour: [
        `${R2_BASE}/pexels-alex-250137-757239.jpg`,
        `${R2_BASE}/pexels-filiamariss-30785778.jpg`
    ]
};

async function withFallback<T>(
  payloadFn: () => Promise<T>,
  sanityFn:  () => Promise<T>
): Promise<T> {
  if (source === 'payload') return payloadFn()
  if (source === 'sanity')  return sanityFn()
  try {
    const result = await payloadFn()
    if (Array.isArray(result) ? (result as any[]).length > 0 : result) return result
  } catch (e) {
    console.warn('[dataAdapter] Payload failed, falling back to Sanity:', e)
  }
  return sanityFn()
}

export const getTours     = (siteId?: string)              => withFallback(() => payload.getTours(siteId),          () => sanity.getTours(siteId))
export const getTour      = (slug: string, siteId?: string) => withFallback(() => payload.getTour(slug, siteId),    () => sanity.getTour(slug, siteId))
export const getAllTours   = ()                             => withFallback(() => payload.getAllTours(),              () => sanity.getAllTours())
export const getPosts     = (siteId?: string)              => withFallback(() => payload.getPosts(siteId),          () => sanity.getPosts(siteId))
export const getPost      = (slug: string, siteId?: string) => withFallback(() => payload.getPost(slug, siteId),    () => sanity.getPost(slug, siteId))
export const getSettings  = (siteId?: string)              => withFallback(() => payload.getSettings(siteId),       () => sanity.getSettings(siteId))
export const getSite      = (siteId?: string)              => withFallback(() => payload.getSite(siteId),           () => sanity.getSite(siteId))
export const getAllSites   = ()                             => withFallback(() => payload.getAllSites(),              () => sanity.getAllSites())

export function urlFor(source: any) {
  let url = typeof source === 'string'
    ? source
    : source?.asset?.url || source?.url || ''

  // If no URL, pick a site-specific fallback
  if (!url) {
      const siteId = (process.env.NEXT_PUBLIC_SITE_ID || 'wondersofrome') as keyof typeof FALLBACKS;
      const images = FALLBACKS[siteId] || FALLBACKS.wondersofrome;
      url = images[0]; 
  }

  const builder: any = {
    url:    ()           => url,
    width:  (_w: number) => builder,
    height: (_h: number) => builder,
    fit:    (_f: string) => builder,
    auto:   (_a: string) => builder,
  }
  return builder
}
