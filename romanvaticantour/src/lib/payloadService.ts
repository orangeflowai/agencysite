/**
 * payloadService.ts — Payload CMS data layer
 * Uses email/password auth with cached token (refreshes on 401).
 * Maps Payload docs → same shapes as sanityService for drop-in compatibility.
 */

const PAYLOAD_URL = process.env.PAYLOAD_API_URL || process.env.NEXT_PUBLIC_PAYLOAD_URL || 'https://admin.wondersofrome.com'
const DEFAULT_SITE_ID = process.env.NEXT_PUBLIC_SITE_ID || 'wondersofrome'
const R2_BASE = 'https://pub-772bbb33a07f4026aa9652a0cfef4c2e.r2.dev/rome%20photos'

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
  businessInfo?: { companyName?: string; vatNumber?: string; reaNumber?: string; registeredAddress?: string; pecEmail?: string; sdiCode?: string; shareCapital?: string }
  gdprSettings?: { cookieBannerTitle?: string; cookieBannerText?: string; acceptButtonText?: string; declineButtonText?: string; privacyPolicyLink?: string; showCookieBanner?: boolean; gdprComplianceRegion?: string }
  legalLinks?: { privacyPolicy?: string; termsAndConditions?: string; cookiePolicy?: string; cancellationPolicy?: string }
}

export interface Tour {
  _id: string; title: string; slug: { current: string }; mainImage?: any
  price: number; duration: string; description: any; category: string
  features: string[]; highlights?: string[]; badge?: string; rating?: number
  reviewCount?: number; groupSize?: string; location?: string
  studentPrice?: number; youthPrice?: number; tags?: string[]
  includes?: string[]; excludes?: string[]; importantInfo?: string[]
  itinerary?: Array<{ title: string; duration: string; description: string }>
  meetingPoint?: string; mapAddress?: string; maxParticipants?: number; gallery?: any[]
  guestTypes?: Array<{ name: string; price: number; description?: string; _key?: string }>
}

export interface Post {
  _id: string; title: string; slug: { current: string }; mainImage?: any
  publishedAt: string; excerpt: string; keywords?: string[]; body?: any
}

export interface Settings {
  heroTitle?: string; heroSubtitle?: string
  heroVideo?: { asset: { _id: string; url: string } }
  heroImage?: { asset: { _id: string; url: string } }
}

// ── Auth token cache ──────────────────────────────────────────────────────────

let _token: string | null = null
let _tokenExpiry = 0

async function getToken(): Promise<string> {
  // Return cached token if still valid (with 5min buffer)
  if (_token && Date.now() < _tokenExpiry - 300_000) return _token

  // Skip auth during static generation (build time)
  if (typeof window === 'undefined' && process.env.NEXT_PHASE === 'phase-production-build') {
    return ''
  }

  const email    = process.env.PAYLOAD_API_EMAIL    || 'superadmin@romeagency.com'
  const password = process.env.PAYLOAD_API_PASSWORD || 'SuperAdmin2025!'

  try {
    const res = await fetch(`${PAYLOAD_URL}/api/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      cache: 'no-store',
    })
    if (!res.ok) throw new Error(`Auth failed: ${res.status}`)
    const data = await res.json()
    _token = data.token
    _tokenExpiry = (data.exp || 0) * 1000 || Date.now() + 7_200_000 // 2h default
    return _token!
  } catch (e) {
    console.warn('[payloadService] Auth failed:', e)
    return ''
  }
}

// ── Fetch helper ──────────────────────────────────────────────────────────────

async function payloadFetch(path: string, params: Record<string, string> = {}, retry = true): Promise<any> {
  const url = new URL(`${PAYLOAD_URL}/api${path}`)
  url.searchParams.set('depth', '2')
  url.searchParams.set('limit', '200')
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v)

  const token = await getToken()

  try {
    const res = await fetch(url.toString(), {
      next: { revalidate: 60 },
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    })

    // On 401, clear token and retry once
    if (res.status === 401 && retry) {
      _token = null
      return payloadFetch(path, params, false)
    }

    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

// ── Image helpers ─────────────────────────────────────────────────────────────

function resolveImageUrl(doc: any): string | undefined {
  // 1. Direct imageUrl field (our migration stores R2 URLs here)
  if (doc.imageUrl) return doc.imageUrl
  // 2. mainImage upload relation
  if (doc.mainImage?.url) return doc.mainImage.url
  if (doc.mainImage?.filename) return `${PAYLOAD_URL}/media/${doc.mainImage.filename}`
  return undefined
}

function toMainImage(doc: any) {
  const url = resolveImageUrl(doc)
  if (!url) return undefined
  return { asset: { _id: String(doc.id || ''), url } }
}

// ── Map Payload doc → Tour ────────────────────────────────────────────────────

function mapTour(doc: any): Tour {
  const img = toMainImage(doc)
  return {
    _id:           String(doc.id),
    title:         doc.title,
    slug:          { current: doc.slug },
    mainImage:     img,
    price:         doc.price || 0,
    duration:      doc.duration || '',
    description:   doc.description || '',
    category:      doc.category || 'city',
    features:      (doc.highlights || []).map((h: any) => h.item || h).filter(Boolean),
    highlights:    (doc.highlights || []).map((h: any) => h.item || h).filter(Boolean),
    badge:         doc.badge || '',
    rating:        doc.rating,
    reviewCount:   doc.reviewCount,
    groupSize:     doc.groupSize || doc.group_size || '',
    tags:          (doc.tags || []).map((t: any) => t.tag || t).filter(Boolean),
    includes:      (doc.includes || []).map((i: any) => i.item || i).filter(Boolean),
    excludes:      (doc.excludes || []).map((e: any) => e.item || e).filter(Boolean),
    importantInfo: (doc.importantInfo || doc.important_info || []).map((i: any) => i.item || i).filter(Boolean),
    meetingPoint:  doc.meetingPoint || doc.meeting_point || '',
    mapAddress:    doc.mapAddress || '',
    maxParticipants: doc.maxParticipants || doc.max_participants || 20,
    gallery:       [],
    guestTypes:    (doc.guestTypes || []).map((g: any) => ({
      name:        g.name,
      price:       g.price,
      description: g.description || '',
      _key:        g.id || g._key || '',
    })),
  }
}

function mapPost(doc: any): Post {
  let body = doc.content || doc.body || []
  if (typeof body === 'string') {
    try { body = JSON.parse(body) } catch { body = [] }
  }
  return {
    _id:         String(doc.id),
    title:       doc.title,
    slug:        { current: doc.slug },
    mainImage:   toMainImage(doc),
    publishedAt: doc.publishedAt || doc.createdAt,
    excerpt:     doc.excerpt || '',
    keywords:    (doc.keywords || []).map((k: any) => k.keyword || k).filter(Boolean),
    body:        body,
  }
}

function mapSite(doc: any): Site {
  return {
    _id:           String(doc.id),
    title:         doc.siteName || doc.tenant,
    slug:          { current: doc.tenant },
    domain:        doc.siteUrl,
    isActive:      true,
    contactEmail:  doc.contactEmail,
    contactPhone:  doc.supportPhone,
    whatsappNumber: doc.whatsappNumber,
    socialLinks:   doc.socialLinks,
    businessInfo:  doc.businessInfo,
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

export async function getTours(siteId: string = DEFAULT_SITE_ID): Promise<Tour[]> {
  // Master site: Show ALL tours regardless of tenant
  const data = await payloadFetch('/tours', {
    'where[active][equals]': 'true',
    'sort': 'createdAt',
    'limit': '500',
  })
  
  // Filter for unique slugs to avoid duplicates if same tour assigned to multiple tenants
  const seen = new Set();
  const docs = (data?.docs || []).filter((doc: any) => {
    const slugBase = doc.slug.split('-')[0];
    if (seen.has(slugBase)) return false;
    seen.add(slugBase);
    return true;
  });

  return docs.map(mapTour);
}

export async function getTour(slug: string, siteId: string = DEFAULT_SITE_ID): Promise<Tour | null> {
  // Master site strategy: Try the slug with the specific tenant,
  // but if not found, search ALL tenants for this slug base.
  
  // 1. Try exact match first
  const data = await payloadFetch('/tours', {
    'where[slug][equals]': slug,
    'limit': '1',
  })
  if (data?.docs?.[0]) return mapTour(data.docs[0])

  // 2. Try common site suffixes if base slug was provided
  for (const s of [`${slug}-wor`, `${slug}-tir`, `${slug}-grt`, `${slug}-rvt`, `${slug}-rwd`]) {
    const d = await payloadFetch('/tours', {
      'where[slug][equals]': s,
      'limit': '1',
    })
    if (d?.docs?.[0]) return mapTour(d.docs[0])
  }
  
  return null
}

export async function getAllTours(): Promise<Tour[]> {
  const data = await payloadFetch('/tours', { 'limit': '500' })
  return (data?.docs || []).map(mapTour)
}

export async function getPosts(siteId: string = DEFAULT_SITE_ID): Promise<Post[]> {
  const data = await payloadFetch('/posts', {
    'where[tenant][equals]': siteId,
    'sort': '-publishedAt',
  })
  return (data?.docs || []).map(mapPost)
}

export async function getPost(slug: string, siteId: string = DEFAULT_SITE_ID): Promise<Post | null> {
  const data = await payloadFetch('/posts', {
    'where[slug][equals]': slug,
    'where[tenant][equals]': siteId,
    'limit': '1',
  })
  const doc = data?.docs?.[0]
  return doc ? mapPost(doc) : null
}

export async function getSettings(siteId: string = DEFAULT_SITE_ID): Promise<Settings | null> {
  const data = await payloadFetch('/site-settings', {
    'where[tenant][equals]': siteId,
    'limit': '1',
  })
  const doc = data?.docs?.[0]
  if (!doc) return null
  return {
    heroTitle:    doc.heroTitle,
    heroSubtitle: doc.heroSubtitle,
    heroImage:    doc.heroImage ? { asset: { _id: '', url: doc.heroImage } } : undefined,
    heroVideo:    doc.heroVideo ? { asset: { _id: '', url: doc.heroVideo } } : undefined,
  }
}

export async function getSite(siteId: string = DEFAULT_SITE_ID): Promise<Site | null> {
  const data = await payloadFetch('/site-settings', {
    'where[tenant][equals]': siteId,
    'limit': '1',
  })
  const doc = data?.docs?.[0]
  return doc ? mapSite(doc) : null
}

export async function getAllSites(): Promise<Site[]> {
  const data = await payloadFetch('/site-settings', { 'limit': '20' })
  return (data?.docs || []).map(mapSite)
}

// urlFor shim — Payload uses direct URLs, no builder needed
export function urlFor(source: any) {
  const url = typeof source === 'string' ? source : (source?.asset?.url || source?.url || '')
  const builder: any = {
    url:    ()           => url,
    width:  (_w: number) => builder,
    height: (_h: number) => builder,
    fit:    (_f: string) => builder,
    auto:   (_a: string) => builder,
  }
  return builder
}
