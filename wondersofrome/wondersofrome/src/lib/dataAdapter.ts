/**
 * dataAdapter.ts — Unified data layer
 * Sanity CMS is the sole content source since Payload CMS was decommissioned (June 2026).
 * Inventory/availability comes from Supabase via /api/availability.
 */

import * as sanity from './sanityService'

export type { Tour, Post, Site, Settings } from './sanityService'

export const DEFAULT_SITE_ID = process.env.NEXT_PUBLIC_SITE_ID || 'wondersofrome'

// All content functions delegate directly to Sanity
export const getTours     = (siteId?: string)              => sanity.getTours(siteId)
export const getTour      = (slug: string, siteId?: string) => sanity.getTour(slug, siteId)
export const getAllTours   = ()                             => sanity.getAllTours()
export const getPosts     = (siteId?: string)              => sanity.getPosts(siteId)
export const getPost      = (slug: string, siteId?: string) => sanity.getPost(slug, siteId)
export const getSettings  = (siteId?: string)              => sanity.getSettings(siteId)
export const getSite      = (siteId?: string)              => sanity.getSite(siteId)
export const getAllSites   = ()                             => sanity.getAllSites()

// urlFor — works for Sanity image refs and plain URLs
export function urlFor(source: any) {
  if (!source) {
    const empty: any = { url: () => '', width: () => empty, height: () => empty, fit: () => empty, auto: () => empty }
    return empty
  }

  // Sanity image reference (has asset._ref or _type === 'image')
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

  // Plain URL string or R2/Supabase URL
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