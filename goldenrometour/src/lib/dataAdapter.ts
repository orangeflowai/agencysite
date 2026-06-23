/**
 * dataAdapter.ts — Unified data layer
 * DATA_SOURCE=payload  → Payload CMS only (default for all sites now)
 * DATA_SOURCE=sanity   → Sanity only
 * DATA_SOURCE=dual     → Payload first, Sanity fallback
 * DATA_SOURCE=hybrid   → Sanity for content/images, Payload for availability
 */

import * as sanity  from './sanityService'
import * as payload from './payloadService'

export type { Tour, Post, Site, Settings } from './sanityService'

const source = process.env.DATA_SOURCE || 'sanity'

export const DEFAULT_SITE_ID = process.env.NEXT_PUBLIC_SITE_ID || 'goldenrometour'

// Load static tours from toursData.ts (always available, no network needed)
function loadStaticTours() {
  try {
    // Dynamic import not needed — toursData is a plain module
    const { tours } = require('./toursData') as { tours: any[] }
    return tours.map((t: any) => ({
      _id: t.id,
      title: t.title,
      slug: { current: t.slug },
      mainImage: t.imageUrl ? { asset: { url: t.imageUrl } } : undefined,
      price: t.price,
      duration: t.duration,
      description: t.description,
      category: t.category,
      features: t.highlights || [],
      highlights: t.highlights || [],
      badge: t.badge,
      rating: t.rating,
      reviewCount: t.reviews,
      groupSize: t.groupSize,
      tags: [],
      includes: t.includes || [],
      excludes: t.excludes || [],
      importantInfo: t.importantInfo || [],
      meetingPoint: t.meetingPoint || '',
      itinerary: [],
      guestTypes: [
        { name: 'Adult', price: t.price, description: 'Age 18+' },
        { name: 'Student', price: Math.round(t.price * 0.85), description: 'Valid ID required' },
        { name: 'Youth', price: Math.round(t.price * 0.70), description: 'Age 12–17' },
        { name: 'Child', price: Math.round(t.price * 0.50), description: 'Under 12' },
      ],
      maxParticipants: undefined,
      location: t.meetingPoint || '',
    }))
  } catch (error) {
    console.error('[dataAdapter] Error loading static tours:', error)
    return []
  }
}

// Helper to load JSON tours (server-side only, legacy fallback)
async function loadJSONTours() {
  if (typeof window !== 'undefined') return []
  
  try {
    const { loadToursFromJSON } = await import('./jsonTours')
    const jsonTours = loadToursFromJSON()
    
    return jsonTours.map((t: any) => ({
      _id: t.productCode,
      title: t.title,
      slug: { current: t.slug },
      mainImage: undefined,
      price: t.price,
      duration: t.duration,
      description: t.description,
      category: t.category,
      features: t.highlights || [],
      highlights: t.highlights || [],
      badge: t.badge,
      rating: t.rating,
      reviewCount: t.reviewCount,
      groupSize: t.groupSize,
      tags: t.tags || [],
      includes: t.includes || [],
      excludes: t.excludes || [],
      importantInfo: t.importantInfo || [],
      meetingPoint: t.meetingPoint,
      itinerary: t.itinerary || [],
      guestTypes: t.guestTypes || [],
      maxParticipants: t.maxParticipants,
      location: t.location,
    }))
  } catch (error) {
    console.error('[dataAdapter] Error loading JSON tours:', error)
    return []
  }
}

async function loadJSONTour(slug: string) {
  if (typeof window !== 'undefined') return null
  
  try {
    const { loadTourFromJSON } = await import('./jsonTours')
    const jsonTour = loadTourFromJSON(slug)
    
    if (!jsonTour) return null
    
    return {
      _id: jsonTour.productCode,
      title: jsonTour.title,
      slug: { current: jsonTour.slug },
      mainImage: undefined,
      price: jsonTour.price,
      duration: jsonTour.duration,
      description: jsonTour.description,
      category: jsonTour.category,
      features: jsonTour.highlights || [],
      highlights: jsonTour.highlights || [],
      badge: jsonTour.badge,
      rating: jsonTour.rating,
      reviewCount: jsonTour.reviewCount,
      groupSize: jsonTour.groupSize,
      tags: jsonTour.tags || [],
      includes: jsonTour.includes || [],
      excludes: jsonTour.excludes || [],
      importantInfo: jsonTour.importantInfo || [],
      meetingPoint: jsonTour.meetingPoint,
      itinerary: jsonTour.itinerary || [],
      guestTypes: jsonTour.guestTypes || [],
      maxParticipants: jsonTour.maxParticipants,
      location: jsonTour.location,
    }
  } catch (error) {
    console.error('[dataAdapter] Error loading JSON tour:', error)
    return null
  }
}

async function withFallback<T>(
  payloadFn: () => Promise<T>,
  sanityFn:  () => Promise<T>
): Promise<T> {
  if (source === 'payload') return payloadFn()
  if (source === 'sanity')  return sanityFn()
  
  // hybrid mode — get content from Sanity, availability from Payload
  if (source === 'hybrid') {
    try {
      const sanityResult = await sanityFn()
      // For tours, we'll merge with Payload availability later
      return sanityResult
    } catch (e) {
      console.warn('[dataAdapter] Sanity failed in hybrid mode, falling back to Payload:', e)
      return payloadFn()
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

// For goldenrometour we show all our tours (vatican + colosseum + city)
const VATICAN_ONLY = false

// Helper to merge Sanity tour content with Payload availability
async function mergeTourWithAvailability(sanityTour: any, slug: string) {
  try {
    // Get availability data from Payload
    const payloadTour = await payload.getTour(slug)
    if (payloadTour) {
      // Merge: keep Sanity content/images, add Payload availability
      return {
        ...sanityTour,
        // Keep Sanity's rich content and images
        title: sanityTour.title,
        description: sanityTour.description,
        mainImage: sanityTour.mainImage,
        gallery: sanityTour.gallery,
        features: sanityTour.features,
        highlights: sanityTour.highlights,
        // Add Payload's availability data if it exists
        availability: payloadTour.availability,
        maxParticipants: payloadTour.maxParticipants,
        // Merge other fields, preferring Sanity
      }
    }
  } catch (e) {
    console.warn('[dataAdapter] Could not fetch Payload availability for', slug, e)
  }
  return sanityTour
}

export const getTours = async (siteId?: string) => {
  let tours
  
  if (source === 'hybrid') {
    tours = await sanity.getTours(siteId)
  } else {
    tours = await withFallback(() => payload.getTours(siteId), () => sanity.getTours(siteId))
  }
  
  // If no tours from CMS, use static toursData.ts as reliable fallback
  if (!tours || tours.length === 0) {
    console.log('[dataAdapter] No tours from CMS, using static toursData fallback...')
    tours = loadStaticTours()
    if (tours.length === 0) {
      // Last resort: JSON files
      tours = await loadJSONTours()
    }
  }
  
  return VATICAN_ONLY ? tours.filter((t: any) => t.category === 'vatican') : tours
}

export const getTour = async (slug: string, siteId?: string) => {
  let tour
  
  if (source === 'hybrid') {
    tour = await sanity.getTour(slug, siteId)
    if (tour) {
      tour = await mergeTourWithAvailability(tour, slug)
    }
  } else {
    tour = await withFallback(() => payload.getTour(slug, siteId), () => sanity.getTour(slug, siteId))
  }
  
  // If no tour from CMS, check static toursData.ts first
  if (!tour) {
    console.log(`[dataAdapter] No tour "${slug}" from CMS, checking static fallback...`)
    const staticTours = loadStaticTours()
    tour = staticTours.find((t: any) => t.slug?.current === slug) || null
  }
  
  // Last resort: JSON files
  if (!tour) {
    console.log(`[dataAdapter] No tour "${slug}" in static data, trying JSON fallback...`)
    tour = await loadJSONTour(slug)
  }
  
  if (tour) {
    console.log(`[dataAdapter] Found tour: ${tour.title}, category: ${tour.category}, slug: ${tour.slug.current}`)
  } else {
    console.warn(`[dataAdapter] Tour not found for slug: ${slug}`)
  }
  
  // Vatican-only validation
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
  let tours
  
  if (source === 'hybrid') {
    tours = await sanity.getAllTours()
  } else {
    tours = await withFallback(() => payload.getAllTours(), () => sanity.getAllTours())
  }
  
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
