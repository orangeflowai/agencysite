/**
 * payloadService.ts — Payload CMS data layer
 */

const PAYLOAD_URL = process.env.PAYLOAD_API_URL || process.env.NEXT_PUBLIC_PAYLOAD_URL || 'https://admin.wondersofrome.com'
const DEFAULT_SITE_ID = process.env.NEXT_PUBLIC_SITE_ID || 'ticketsinrome'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface Site {
  _id: string; title: string; slug: { current: string }; domain?: string; isActive: boolean
  logo?: { asset: { _id: string; url: string } }; favicon?: { asset: { _id: string; url: string } }
  logoText?: string; logoTextAccent?: string
  seo?: { metaTitle?: string; metaDescription?: string; keywords?: string[] }
  brandColors?: { primary?: { hex: string }; secondary?: { hex: string }; accent?: { hex: string } }
  contactEmail?: string; contactPhone?: string; whatsappNumber?: string
  officeAddress?: string; mapLink?: string
  socialLinks?: { facebook?: string; instagram?: string; twitter?: string; tripadvisor?: string; youtube?: string; linkedin?: string }
}

export interface Tour {
  _id: string; title: string; slug: { current: string }; mainImage?: any
  price: number; duration: string; description: any; category: string
  features: string[]; highlights?: string[]; badge?: string; rating?: number
  reviewCount?: number; groupSize?: string; location?: string
  studentPrice?: number; youthPrice?: number; tags?: string[]
}

// Stub implementation since we prefer Sanity for content
export async function getTours(siteId: string = DEFAULT_SITE_ID): Promise<Tour[]> { return [] }
export async function getTour(slug: string, siteId: string = DEFAULT_SITE_ID): Promise<Tour | null> { return null }
export async function getAllTours(): Promise<Tour[]> { return [] }
export async function getPosts(siteId: string = DEFAULT_SITE_ID): Promise<any[]> { return [] }
export async function getPost(slug: string, siteId: string = DEFAULT_SITE_ID): Promise<any | null> { return null }
export async function getSettings(siteId: string = DEFAULT_SITE_ID): Promise<any | null> { return null }
export async function getSite(siteId: string = DEFAULT_SITE_ID): Promise<Site | null> { return null }
export async function getAllSites(): Promise<Site[]> { return [] }
