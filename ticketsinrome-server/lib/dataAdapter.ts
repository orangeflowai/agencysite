/**
 * dataAdapter.ts — Unified data layer
 */

import * as sanity  from './sanityService'
import * as payload from './payloadService'

export type { Tour, Post, Site, Settings } from './sanityService'

const source = 'sanity'

export const DEFAULT_SITE_ID = process.env.NEXT_PUBLIC_SITE_ID || 'ticketsinrome'

async function withFallback<T>(
  payloadFn: () => Promise<T>,
  sanityFn:  () => Promise<T>
): Promise<T> {
  if (source === 'sanity') return sanityFn()
  return payloadFn()
}

export const getTours     = (siteId?: string)              => withFallback(() => payload.getTours(siteId),          () => sanity.getTours())
export const getTour      = (slug: string, siteId?: string) => withFallback(() => payload.getTour(slug, siteId),    () => sanity.getTour(slug))
export const getAllTours   = ()                             => withFallback(() => payload.getAllTours(),              () => sanity.getAllTours())
export const getPosts     = (siteId?: string)              => withFallback(() => payload.getPosts(siteId),          () => sanity.getPosts())
export const getPost      = (slug: string, siteId?: string) => withFallback(() => payload.getPost(slug, siteId),    () => sanity.getPost(slug))
export const getSettings  = (siteId?: string)              => withFallback(() => payload.getSettings(siteId),       () => sanity.getSettings())
export const getSite      = (siteId?: string)              => withFallback(() => payload.getSite(siteId),           () => sanity.getSite(siteId))
export const getAllSites   = ()                             => withFallback(() => payload.getAllSites(),              () => sanity.getAllSites())

// urlFor — works for both Sanity image refs and plain URLs
export function urlFor(source: any) {
  if (!source) {
    const empty: any = { url: () => '', width: () => empty, height: () => empty, fit: () => empty, auto: () => empty }
    return empty
  }

  // Sanity image reference
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

  // Plain URL string
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
