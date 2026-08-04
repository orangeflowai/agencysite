/**
 * dataAdapter.ts — Unified data layer
 * DATA_SOURCE=payload       → Payload CMS only
 * DATA_SOURCE=sanity        → Sanity only (RECOMMENDED — use when Payload has drafts)
 * DATA_SOURCE=dual          → Payload first, Sanity fallback
 * DATA_SOURCE=hybrid        → Sanity content + Payload images merged
 *
 * NOTE: Availability (slots/inventory) always comes from Payload via /api/availability
 * regardless of DATA_SOURCE. This adapter only controls tour content/images.
 */

import * as sanity  from './sanityService'
import * as payload from './payloadService'

export type { Tour, Post, Site, Settings } from './sanityService'

const source = 'sanity' // Always use Sanity — Payload has draft-only tours

export const DEFAULT_SITE_ID = process.env.NEXT_PUBLIC_SITE_ID || 'wondersofrome'

async function withFallback<T>(
  payloadFn: () => Promise<T>,
  sanityFn:  () => Promise<T>
): Promise<T> {
  // sanity — use Sanity for all content (published, complete data + images)
  if (source === 'sanity') return sanityFn()

  // payload — use Payload only
  if (source === 'payload') return payloadFn()
  
  // hybrid — Sanity content + Payload images merged (Sanity is primary)
  if (source === 'hybrid') {
    try {
      const [sanityResult, payloadResult] = await Promise.all([
        sanityFn().catch(() => null),
        payloadFn().catch(() => null)
      ]);

      // Sanity is primary source of truth for content
      if (sanityResult) {
        if (Array.isArray(sanityResult) && Array.isArray(payloadResult)) {
          // Merge: Sanity content + Payload images (if Payload has better images)
          return sanityResult.map((sanityTour: any) => {
            const sanitySlug = sanityTour.slug?.current || sanityTour.slug;
            const payloadTour = (payloadResult as any[]).find((pt: any) => {
              const pSlug = pt.slug?.current || pt.slug;
              return pSlug === sanitySlug;
            });
            return {
              ...sanityTour,
              // Keep Sanity images (they're published and correct)
              // Only use Payload image if Sanity has none
              mainImage: sanityTour.mainImage || payloadTour?.mainImage,
              gallery:   sanityTour.gallery   || payloadTour?.gallery,
            };
          }) as T;
        }
        return sanityResult;
      }

      // Fallback to Payload if Sanity fails
      return payloadResult || ([] as T);
    } catch (e) {
      console.warn('[dataAdapter] Hybrid mode failed, falling back to Sanity:', e);
      return sanityFn();
    }
  }
  
  // dual — try Payload, fall back to Sanity
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

// urlFor — works for both Sanity image refs and plain URLs
export function urlFor(source: any) {
  if (!source) {
    const empty: any = { url: () => '', width: () => empty, height: () => empty, fit: () => empty, auto: () => empty }
    return empty
  }

  // Sanity image reference (has asset._ref or _type === 'image') — use Sanity image builder
  if (source._type === 'image' || source?.asset?._ref || source?.asset?._id?.startsWith('image-')) {
    return sanity.urlFor(source)
  }

  // Already resolved Sanity asset with direct URL
  if (source?.asset?.url) {
    const url = source.asset.url
    const builder: any = {
      url:    ()           => url,
      width:  (_w: number) => builder,
      height: (_h: number) => builder,
      fit:    (_f: string) => builder,
      auto:   (_a: string) => builder,
    }
    return builder
  }

  // Plain URL string or Payload/R2/Supabase URL
  const url = typeof source === 'string' ? source : source?.url || ''
  const builder: any = {
    url:    ()           => url,
    width:  (_w: number) => builder,
    height: (_h: number) => builder,
    fit:    (_f: string) => builder,
    auto:   (_a: string) => builder,
  }
  return builder
}
