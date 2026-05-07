/**
 * dataAdapter.ts — Unified data layer
 * DATA_SOURCE=payload  → Payload CMS only (default for all sites now)
 * DATA_SOURCE=sanity   → Sanity only
 * DATA_SOURCE=dual     → Payload first, Sanity fallback
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

// Vatican-only filter for goldenrometour
const VATICAN_ONLY = process.env.NEXT_PUBLIC_SITE_ID === 'goldenrometour'

export const getTours = async (siteId?: string) => {
  const tours = await withFallback(() => payload.getTours(siteId), () => sanity.getTours(siteId))
  return VATICAN_ONLY ? tours.filter(t => t.category === 'vatican') : tours
}

export const getTour = async (slug: string, siteId?: string) => {
  const tour = await withFallback(() => payload.getTour(slug, siteId), () => sanity.getTour(slug, siteId))
  
  // Log for debugging
  if (tour) {
    console.log(`[dataAdapter] Found tour: ${tour.title}, category: ${tour.category}, slug: ${tour.slug.current}`)
  } else {
    console.warn(`[dataAdapter] Tour not found for slug: ${slug}, siteId: ${siteId || DEFAULT_SITE_ID}`)
  }
  
  // Vatican-only validation (only if tour exists and has category)
  if (VATICAN_ONLY && tour) {
    if (!tour.category) {
      console.warn(`[dataAdapter] Tour "${tour.title}" has no category, allowing it through`)
      return tour
    }
    if (tour.category !== 'vatican') {
      console.warn(`[dataAdapter] Tour "${tour.title}" category is "${tour.category}", not "vatican" - filtering out`)
      return null
    }
  }
  
  return tour
}

export const getAllTours = async () => {
  const tours = await withFallback(() => payload.getAllTours(), () => sanity.getAllTours())
  return VATICAN_ONLY ? tours.filter(t => t.category === 'vatican') : tours
}
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
