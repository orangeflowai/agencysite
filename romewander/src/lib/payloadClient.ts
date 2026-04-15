/**
 * payloadClient.ts — Website Adapter
 *
 * Drop-in replacement for all Supabase + Sanity calls in each Next.js website.
 * Reads three env vars:
 *   PAYLOAD_API_URL   — e.g. https://admin.wondersofrome.com
 *   PAYLOAD_TENANT    — e.g. wondersofrome
 *   PAYLOAD_API_KEY   — 32-char nanoid from SiteSettings.apiKey
 *
 * Usage:
 *   import { payloadClient } from '@/lib/payloadClient'
 *   const tours = await payloadClient.getTours()
 */

const BASE = (process.env.PAYLOAD_API_URL || '').replace(/\/$/, '')
const TENANT = process.env.PAYLOAD_TENANT || ''
const API_KEY = process.env.PAYLOAD_API_KEY || ''

if (!BASE || !TENANT || !API_KEY) {
  if (typeof window === 'undefined') {
    console.warn('[payloadClient] Missing env vars: PAYLOAD_API_URL, PAYLOAD_TENANT, or PAYLOAD_API_KEY')
  }
}

const baseHeaders: Record<string, string> = {
  'Content-Type': 'application/json',
  'x-tenant-id': TENANT,
  ...(API_KEY && { Authorization: `Bearer ${API_KEY}` }),
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PayloadTour {
  id: string
  tenant: string
  title: string
  slug: string
  description?: any
  price: number
  originalPrice?: number
  duration?: string
  category?: string
  meetingPoint?: string
  mapAddress?: string
  maxParticipants?: number
  minParticipants?: number
  badge?: string
  rating?: number
  reviewCount?: number
  mainImage?: { url?: string; alt?: string }
  gallery?: Array<{ image: { url?: string } }>
  highlights?: Array<{ item: string }>
  includes?: Array<{ item: string }>
  excludes?: Array<{ item: string }>
  importantInfo?: Array<{ item: string }>
  tags?: Array<{ tag: string }>
  guestTypes?: Array<{ name: string; price: number; description?: string }>
  isActive?: boolean
  seo?: { metaTitle?: string; metaDescription?: string }
}

export interface PayloadAddon {
  id: string
  tenant: string
  name: string
  slug: string
  description?: string
  longDescription?: string
  price: number
  pricingType: 'per_person' | 'flat' | 'per_hour'
  category?: string
  icon?: string
  image?: { url?: string }
  isAvailable?: boolean
  sortOrder?: number
}

export interface PayloadBlogPost {
  id: string
  tenant: string
  title: string
  slug: string
  excerpt?: string
  body?: any
  mainImage?: { url?: string; alt?: string }
  author?: string
  publishedAt?: string
  keywords?: Array<{ keyword: string }>
  seo?: { metaTitle?: string; metaDescription?: string }
  status?: 'draft' | 'published'
}

export interface PayloadSiteSettings {
  id: string
  tenant: string
  domain?: string
  isActive?: boolean
  logo?: { url?: string }
  favicon?: { url?: string }
  logoText?: string
  logoTextAccent?: string
  brandColors?: { primary?: string; secondary?: string; accent?: string }
  heroTitle?: string
  heroSubtitle?: string
  heroImage?: { url?: string }
  contactEmail?: string
  contactPhone?: string
  whatsappNumber?: string
  officeAddress?: string
  mapLink?: string
  socialLinks?: Record<string, string>
  businessInfo?: Record<string, string>
  seo?: { metaTitle?: string; metaDescription?: string; keywords?: Array<{ keyword: string }> }
  gdprSettings?: Record<string, any>
  stripe?: { publishableKey?: string }
  adminEmail?: string
  emailFrom?: string
}

export interface AvailabilitySlot {
  id: string
  time: string
  availableSlots: number
  totalCapacity: number
  price: number
}

export interface AvailabilityDayResult {
  slots: AvailabilitySlot[]
}

export interface AvailabilityMonthResult {
  [date: string]: { spots: number; price: number }
}

export interface PaymentIntentBody {
  amount: number
  tourSlug: string
  tourTitle: string
  date: string
  time: string
  guests: number
  guestCounts?: Record<string, number>
  bookingDetails?: {
    leadTraveler?: {
      firstName?: string
      lastName?: string
      email?: string
      phone?: string
    }
    marketing?: { specialRequests?: string }
  }
  addOns?: Array<{ name: string; price: number; quantity: number; pricingType: string }>
  promoCode?: string
}

// ─── Client ───────────────────────────────────────────────────────────────────

async function get<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: { ...baseHeaders, ...(init?.headers as Record<string, string> || {}) },
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || err.message || `Payload API error ${res.status}: ${path}`)
  }
  return res.json()
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: baseHeaders,
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || err.message || `Payload API error ${res.status}: ${path}`)
  }
  return res.json()
}

// ─── Tours ────────────────────────────────────────────────────────────────────

export async function getTours(params?: { limit?: number; category?: string }): Promise<PayloadTour[]> {
  const q = new URLSearchParams({
    'where[tenant][equals]': TENANT,
    'where[isActive][equals]': 'true',
    limit: String(params?.limit || 100),
    sort: 'title',
  })
  if (params?.category) q.set('where[category][equals]', params.category)
  const data = await get<{ docs: PayloadTour[] }>(`/api/tours?${q}`, {
    next: { revalidate: 300 },
  })
  return data.docs
}

export async function getTourBySlug(slug: string): Promise<PayloadTour | null> {
  const q = new URLSearchParams({
    'where[slug][equals]': slug,
    'where[tenant][equals]': TENANT,
    limit: '1',
    depth: '2',
  })
  const data = await get<{ docs: PayloadTour[] }>(`/api/tours?${q}`, {
    next: { revalidate: 300 },
  })
  return data.docs[0] ?? null
}

// ─── Addons ───────────────────────────────────────────────────────────────────

export async function getAddons(tourSlug?: string): Promise<PayloadAddon[]> {
  const q = new URLSearchParams({
    'where[tenant][equals]': TENANT,
    'where[isAvailable][equals]': 'true',
    sort: 'sortOrder',
    limit: '50',
    depth: '1',
  })
  const data = await get<{ docs: PayloadAddon[] }>(`/api/addons?${q}`, {
    next: { revalidate: 60 },
  })
  return data.docs
}

// ─── Blog ─────────────────────────────────────────────────────────────────────

export async function getBlogPosts(params?: { limit?: number }): Promise<PayloadBlogPost[]> {
  const q = new URLSearchParams({
    'where[tenant][equals]': TENANT,
    'where[status][equals]': 'published',
    sort: '-publishedAt',
    limit: String(params?.limit || 20),
    depth: '1',
  })
  const data = await get<{ docs: PayloadBlogPost[] }>(`/api/blog-posts?${q}`, {
    next: { revalidate: 300 },
  })
  return data.docs
}

export async function getBlogPostBySlug(slug: string): Promise<PayloadBlogPost | null> {
  const q = new URLSearchParams({
    'where[slug][equals]': slug,
    'where[tenant][equals]': TENANT,
    limit: '1',
    depth: '2',
  })
  const data = await get<{ docs: PayloadBlogPost[] }>(`/api/blog-posts?${q}`, {
    next: { revalidate: 300 },
  })
  return data.docs[0] ?? null
}

// ─── Site Settings ────────────────────────────────────────────────────────────

export async function getSiteSettings(): Promise<PayloadSiteSettings | null> {
  const q = new URLSearchParams({
    'where[tenant][equals]': TENANT,
    limit: '1',
    depth: '2',
  })
  const data = await get<{ docs: PayloadSiteSettings[] }>(`/api/site-settings?${q}`, {
    next: { revalidate: 300 },
  })
  return data.docs[0] ?? null
}

// ─── Availability ─────────────────────────────────────────────────────────────

export async function getAvailability(
  tourSlug: string,
  date: string,
  mode: 'day' | 'month' = 'day'
): Promise<AvailabilityDayResult | AvailabilityMonthResult> {
  const q = new URLSearchParams({ tour: tourSlug, date, tenant: TENANT, mode })
  return get(`/api/availability?${q}`, { cache: 'no-store' })
}

// ─── Payment Intent ───────────────────────────────────────────────────────────

export async function createPaymentIntent(
  body: PaymentIntentBody
): Promise<{ clientSecret: string; paymentIntentId: string }> {
  return post('/api/create-payment-intent', { ...body, tenant: TENANT })
}

// ─── Promo Code ───────────────────────────────────────────────────────────────

export async function validatePromoCode(
  code: string,
  amount: number,
  tourSlug?: string
): Promise<{ valid: boolean; discountAmount?: number; discountType?: string; finalAmount?: number; reason?: string }> {
  return post('/api/validate-promo', { code, tenant: TENANT, amount, tourSlug })
}

// ─── Ticket ───────────────────────────────────────────────────────────────────

export async function getTicket(bookingRef: string): Promise<Response> {
  return fetch(`${BASE}/api/tickets/${bookingRef}`, {
    headers: { ...baseHeaders },
    cache: 'no-store',
  })
}

// ─── Default export (object form for convenience) ─────────────────────────────

export const payloadClient = {
  getTours,
  getTourBySlug,
  getAddons,
  getBlogPosts,
  getBlogPostBySlug,
  getSiteSettings,
  getAvailability,
  createPaymentIntent,
  validatePromoCode,
  getTicket,
}

export default payloadClient
