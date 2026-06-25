/**
 * dataAdapter.ts — Unified data layer (Sanity only)
 */

import * as sanity from './sanityService'

export type { Tour, Post, Site, Settings } from './sanityService'
export { extractPortableText, filterRealTours } from './sanityService'
export { getTourImage, CATEGORY_IMAGES } from './tourImages'

export const DEFAULT_SITE_ID = process.env.NEXT_PUBLIC_SITE_ID || 'romanvaticantour'

// Direct Sanity exports — no Payload dependency
export const getTours     = sanity.getTours
export const getTour      = sanity.getTour
export const getAllTours  = sanity.getAllTours
export const getPosts     = sanity.getPosts
export const getPost      = sanity.getPost
export const getSettings  = sanity.getSettings
export const getSite      = sanity.getSite
export const getAllSites  = sanity.getAllSites

const FALLBACKS: Record<string, string[]> = {
  romanvaticantour: ['/images/rome-hero.jpg', '/images/vatican-sistine.jpg'],
  default: ['/images/rome-hero.jpg', '/images/vatican-sistine.jpg'],
}

export function urlFor(source: any) {
  let url = typeof source === 'string'
    ? source
    : source?.asset?.url || source?.url || ''

  if (!url) {
    const siteId = process.env.NEXT_PUBLIC_SITE_ID || 'romanvaticantour'
    const images = FALLBACKS[siteId] || FALLBACKS.default
    url = images[0]
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
