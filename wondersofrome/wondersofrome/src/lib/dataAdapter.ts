/**
 * dataAdapter.ts — Unified data layer
 * DATA_SOURCE=payload  → Payload CMS only
 * DATA_SOURCE=sanity   → Sanity only
 * DATA_SOURCE=dual     → Payload first, Sanity fallback
 * DATA_SOURCE=hybrid   → Payload data + Sanity images (RECOMMENDED)
 */

import * as sanity  from './sanityService'
import * as payload from './payloadService'

export type { Tour, Post, Site, Settings } from './sanityService'

const source = process.env.DATA_SOURCE || 'payload'

export const DEFAULT_SITE_ID = process.env.NEXT_PUBLIC_SITE_ID || 'wondersofrome'

async function withFallback<T>(
  payloadFn: () => Promise<T>,
  sanityFn:  () => Promise<T>
): Promise<T> {
  if (source === 'payload') return payloadFn()
  if (source === 'sanity')  return sanityFn()
  
  // hybrid — Payload data with Sanity images merged
  if (source === 'hybrid') {
    try {
      const [payloadResult, sanityResult] = await Promise.all([
        payloadFn().catch(() => null),
        sanityFn().catch(() => null)
      ]);

      // If we have both, merge them (Payload data + Sanity images)
      if (payloadResult && sanityResult) {
        if (Array.isArray(payloadResult) && Array.isArray(sanityResult)) {
          // Merge tours: Payload data + Sanity images by matching slug
          return payloadResult.map((payloadTour: any) => {
            // Normalize slugs for comparison
            const payloadSlug = payloadTour.slug?.current || payloadTour.slug;
            const sanityTour = sanityResult.find((st: any) => {
              const sanitySlug = st.slug?.current || st.slug;
              return sanitySlug === payloadSlug;
            });
            return {
              ...payloadTour,
              mainImage: sanityTour?.mainImage || payloadTour.mainImage,
              images: sanityTour?.images || payloadTour.images,
            };
          }) as T;
        } else if (typeof payloadResult === 'object' && typeof sanityResult === 'object') {
          // Merge single tour
          return {
            ...payloadResult,
            mainImage: (sanityResult as any).mainImage || (payloadResult as any).mainImage,
            images: (sanityResult as any).images || (payloadResult as any).images,
          } as T;
        }
      }

      // Fallback to whichever we have
      return payloadResult || sanityResult || ([] as T);
    } catch (e) {
      console.warn('[dataAdapter] Hybrid mode failed:', e);
      return sanityFn();
    }
  }
  
  // dual — try Payload, fall back to Sanity
  try {
    const result = await payloadFn()
    // For arrays, check length; for objects check truthiness
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

// urlFor — Payload uses direct URLs; Sanity uses image builder
// This shim works for both and supports chaining
export function urlFor(source: any) {
  const url = typeof source === 'string'
    ? source
    : source?.asset?.url || source?.url || ''

  const builder: any = {
    url:    ()           => url,
    width:  (_w: number) => builder,
    height: (_h: number) => builder,
    fit:    (_f: string) => builder,
    auto:   (_a: string) => builder,
  }
  return builder
}
