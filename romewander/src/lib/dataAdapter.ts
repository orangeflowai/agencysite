/**
 * dataAdapter.ts
 * Unified data layer — switches between Sanity and Payload based on DATA_SOURCE env var.
 *
 * DATA_SOURCE=sanity   → use Sanity (default, current behaviour)
 * DATA_SOURCE=payload  → use Payload CMS
 * DATA_SOURCE=dual     → try Payload first, fall back to Sanity on error
 */

import * as sanity from './sanityService'
import * as payload from './payloadService'

export type { Tour, Post, Site, Settings } from './sanityService'

const source = process.env.DATA_SOURCE || 'sanity'

function service() {
  return source === 'payload' ? payload : sanity
}

async function withFallback<T>(
  payloadFn: () => Promise<T>,
  sanityFn: () => Promise<T>
): Promise<T> {
  if (source !== 'dual') return service() === payload ? payloadFn() : sanityFn()
  try {
    const result = await payloadFn()
    if (result) return result
  } catch (e) {
    console.warn('[dataAdapter] Payload failed, falling back to Sanity:', e)
  }
  return sanityFn()
}

export const getTours = (siteId?: string) =>
  withFallback(() => payload.getTours(siteId), () => sanity.getTours(siteId))

export const getTour = (slug: string, siteId?: string) =>
  withFallback(() => payload.getTour(slug, siteId), () => sanity.getTour(slug, siteId))

export const getAllTours = () =>
  withFallback(() => payload.getAllTours(), () => sanity.getAllTours())

export const getPosts = (siteId?: string) =>
  withFallback(() => payload.getPosts(siteId), () => sanity.getPosts(siteId))

export const getPost = (slug: string, siteId?: string) =>
  withFallback(() => payload.getPost(slug, siteId), () => sanity.getPost(slug, siteId))

export const getSettings = (siteId?: string) =>
  withFallback(() => payload.getSettings(siteId), () => sanity.getSettings(siteId))

export const getSite = (siteId?: string) =>
  withFallback(() => payload.getSite(siteId), () => sanity.getSite(siteId))

export const getAllSites = () =>
  withFallback(() => payload.getAllSites(), () => sanity.getAllSites())

// urlFor works with both — Payload returns direct URLs, Sanity uses builder
export { urlFor } from './sanityService'
