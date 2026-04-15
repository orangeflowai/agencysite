/**
 * payloadService.ts
 * Mirrors sanityService.ts API — fetches from Payload CMS instead of Sanity.
 * Drop-in replacement: same function signatures, same return shapes.
 */

const PAYLOAD_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'https://admin.wondersofrome.com'
const DEFAULT_SITE_ID = process.env.NEXT_PUBLIC_SITE_ID || 'wondersofrome'

// ── Types (matching sanityService shapes) ─────────────────────────────────────

export interface Site {
  _id: string
  title: string
  slug: { current: string }
  domain?: string
  isActive: boolean
  logo?: { asset: { _id: string; url: string } }
  favicon?: { asset: { _id: string; url: string } }
  logoText?: string
  logoTextAccent?: string
  seo?: { metaTitle?: string; metaDescription?: string; keywords?: string[] }
  brandColors?: {
    primary?: { hex: string }
    secondary?: { hex: string }
    accent?: { hex: string }
  }
  contactEmail?: string
  contactPhone?: string
  whatsappNumber?: string
  officeAddress?: string
  mapLink?: string
  socialLinks?: {
    facebook?: string; instagram?: string; twitter?: string
    tripadvisor?: string; youtube?: string; linkedin?: string
  }
  businessInfo?: {
    companyName?: string; vatNumber?: string; reaNumber?: string
    registeredAddress?: string; pecEmail?: string; sdiCode?: string; shareCapital?: string
  }
  gdprSettings?: {
    cookieBannerTitle?: string; cookieBannerText?: string
    acceptButtonText?: string; declineButtonText?: string
    privacyPolicyLink?: string; showCookieBanner?: boolean
    gdprComplianceRegion?: string
  }
  legalLinks?: {
    privacyPolicy?: string; termsAndConditions?: string
    cookiePolicy?: string; cancellationPolicy?: string
  }
}

export interface Tour {
  _id: string
  title: string
  slug: { current: string }
  mainImage?: any
  price: number
  duration: string
  description: any
  category: string
  features: string[]
  highlights?: string[]
  badge?: string
  rating?: number
  reviewCount?: number
  groupSize?: string
  location?: string
  studentPrice?: number
  youthPrice?: number
  tags?: string[]
  includes?: string[]
  excludes?: string[]
  importantInfo?: string[]
  itinerary?: Array<{ title: string; duration: string; description: string }>
  meetingPoint?: string
  mapAddress?: string
  maxParticipants?: number
  gallery?: any[]
}

export interface Post {
  _id: string
  title: string
  slug: { current: string }
  mainImage?: any
  publishedAt: string
  excerpt: string
  keywords?: string[]
  body?: any
}

export interface Settings {
  heroTitle?: string
  heroSubtitle?: string
  heroVideo?: { asset: { _id: string; url: string } }
  heroImage?: { asset: { _id: string; url: string } }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

async function payloadFetch(path: string, params: Record<string, string> = {}): Promise<any> {
  const url = new URL(`${PAYLOAD_URL}/api${path}`)
  url.searchParams.set('depth', '1')
  url.searchParams.set('limit', '200')
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v)

  const res = await fetch(url.toString(), {
    next: { revalidate: 60 },
    headers: { 'Content-Type': 'application/json' },
  })
  if (!res.ok) return null
  return res.json()
}

function mediaUrl(mediaField: any): string | undefined {
  if (!mediaField) return undefined
  if (typeof mediaField === 'string') return `${PAYLOAD_URL}/media/${mediaField}`
  if (mediaField.url) return mediaField.url
  if (mediaField.filename) return `${PAYLOAD_URL}/media/${mediaField.filename}`
  return undefined
}

function toMediaAsset(mediaField: any) {
  const url = mediaUrl(mediaField)
  if (!url) return undefined
  return { asset: { _id: mediaField?.id || '', url } }
}

// ── Map Payload doc → Tour shape ──────────────────────────────────────────────

function mapTour(doc: any): Tour {
  return {
    _id: String(doc.id),
    title: doc.title,
    slug: { current: doc.slug },
    mainImage: doc.images?.[0]?.image ? toMediaAsset(doc.images[0].image) : undefined,
    price: doc.price,
    duration: doc.duration || '',
    description: doc.description || '',
    category: doc.category || '',
    features: doc.includes?.map((i: any) => i.item).filter(Boolean) || [],
    highlights: doc.includes?.map((i: any) => i.item).filter(Boolean) || [],
    badge: doc.badge,
    rating: doc.rating,
    reviewCount: doc.reviewCount,
    tags: doc.tags?.map((t: any) => t.tag).filter(Boolean) || [],
    includes: doc.includes?.map((i: any) => i.item).filter(Boolean) || [],
    excludes: doc.excludes?.map((i: any) => i.item).filter(Boolean) || [],
    importantInfo: doc.importantInfo?.map((i: any) => i.item).filter(Boolean) || [],
    itinerary: doc.itinerary || [],
    meetingPoint: doc.meetingPoint,
    mapAddress: doc.mapAddress,
    maxParticipants: doc.maxParticipants,
    gallery: doc.gallery?.map((g: any) => toMediaAsset(g.image)).filter(Boolean) || [],
  }
}

// ── Map Payload doc → Post shape ──────────────────────────────────────────────

function mapPost(doc: any): Post {
  return {
    _id: String(doc.id),
    title: doc.title,
    slug: { current: doc.slug },
    mainImage: toMediaAsset(doc.mainImage),
    publishedAt: doc.publishedAt || doc.createdAt,
    excerpt: doc.excerpt || '',
    keywords: doc.keywords?.map((k: any) => k.keyword).filter(Boolean) || [],
    body: doc.body,
  }
}

// ── Map Payload SiteSettings → Site shape ─────────────────────────────────────

function mapSite(doc: any): Site {
  return {
    _id: String(doc.id),
    title: doc.tenant,
    slug: { current: doc.tenant },
    domain: doc.domain,
    isActive: doc.isActive !== false,
    logo: toMediaAsset(doc.logo),
    favicon: toMediaAsset(doc.favicon),
    logoText: doc.logoText,
    logoTextAccent: doc.logoTextAccent,
    seo: doc.seo ? {
      metaTitle: doc.seo.metaTitle,
      metaDescription: doc.seo.metaDescription,
      keywords: doc.seo.keywords?.map((k: any) => k.keyword).filter(Boolean),
    } : undefined,
    brandColors: doc.brandColors ? {
      primary: doc.brandColors.primary ? { hex: doc.brandColors.primary } : undefined,
      secondary: doc.brandColors.secondary ? { hex: doc.brandColors.secondary } : undefined,
      accent: doc.brandColors.accent ? { hex: doc.brandColors.accent } : undefined,
    } : undefined,
    contactEmail: doc.contactEmail,
    contactPhone: doc.contactPhone,
    whatsappNumber: doc.whatsappNumber,
    officeAddress: doc.officeAddress,
    mapLink: doc.mapLink,
    socialLinks: doc.socialLinks,
    businessInfo: doc.businessInfo,
    gdprSettings: doc.gdprSettings,
    legalLinks: undefined, // add to SiteSettings collection if needed
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

export async function getTours(siteId: string = DEFAULT_SITE_ID): Promise<Tour[]> {
  const data = await payloadFetch('/tours', {
    'where[tenant][equals]': siteId,
    'where[isActive][equals]': 'true',
  })
  return (data?.docs || []).map(mapTour)
}

export async function getTour(slug: string, siteId: string = DEFAULT_SITE_ID): Promise<Tour | null> {
  const data = await payloadFetch('/tours', {
    'where[slug][equals]': slug,
    'where[tenant][equals]': siteId,
    'limit': '1',
  })
  const doc = data?.docs?.[0]
  return doc ? mapTour(doc) : null
}

export async function getAllTours(): Promise<Tour[]> {
  const data = await payloadFetch('/tours')
  return (data?.docs || []).map(mapTour)
}

export async function getPosts(siteId: string = DEFAULT_SITE_ID): Promise<Post[]> {
  const data = await payloadFetch('/blog-posts', {
    'where[tenant][equals]': siteId,
    'where[status][equals]': 'published',
    'sort': '-publishedAt',
  })
  return (data?.docs || []).map(mapPost)
}

export async function getPost(slug: string, siteId: string = DEFAULT_SITE_ID): Promise<Post | null> {
  const data = await payloadFetch('/blog-posts', {
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
    heroTitle: doc.heroTitle,
    heroSubtitle: doc.heroSubtitle,
    heroImage: toMediaAsset(doc.heroImage),
    heroVideo: doc.heroVideo ? { asset: { _id: '', url: doc.heroVideo } } : undefined,
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
  const data = await payloadFetch('/site-settings')
  return (data?.docs || []).map(mapSite)
}

// Re-export urlFor as a no-op compatible shim (Payload uses direct URLs)
export function urlFor(source: any) {
  const url = typeof source === 'string' ? source : source?.asset?.url || ''
  return {
    url: () => url,
    width: () => ({ url: () => url }),
    height: () => ({ url: () => url }),
  }
}
