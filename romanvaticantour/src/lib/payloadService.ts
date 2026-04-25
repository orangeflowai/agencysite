/**
 * payloadService.ts — Payload CMS data layer
 * Uses a bypass key for server-to-server static builds to avoid dynamic render errors.
 */

const PAYLOAD_URL = process.env.PAYLOAD_API_URL || process.env.NEXT_PUBLIC_PAYLOAD_URL || 'https://admin.wondersofrome.com'
const DEFAULT_SITE_ID = process.env.NEXT_PUBLIC_SITE_ID || 'wondersofrome'

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

// Using a bypass key for static builds and server calls to prevent 'no-store' fetch errors
const ADMIN_BYPASS_KEY = 'xnxxisnotfreefor69'; 

// ── Fetch helper ──────────────────────────────────────────────────────────────

async function payloadFetch(path: string, params: Record<string, string> = {}): Promise<any> {
  const url = new URL(`${PAYLOAD_URL}/api${path}`)
  url.searchParams.set('depth', '2')
  url.searchParams.set('limit', '200')
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v)

  try {
    const res = await fetch(url.toString(), {
      // Allow static generation by avoiding no-store
      next: { revalidate: 3600 },
      headers: {
        'Content-Type': 'application/json',
        // Use our bypass key for server-to-server auth
        'Authorization': `users API-Key ${ADMIN_BYPASS_KEY}`,
      },
    })

    if (!res.ok) return null
    return res.json()
  } catch (e) {
    console.warn('[payloadService] Fetch failed:', e)
    return null
  }
}

// ── Image helpers ─────────────────────────────────────────────────────────────

function resolveImageUrl(doc: any): string | undefined {
  if (doc.imageUrl) return doc.imageUrl
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
  const data = await payloadFetch('/tours', {
    'where[active][equals]': 'true',
    'sort': 'createdAt',
    'limit': '500',
  })
  
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
  const data = await payloadFetch('/tours', {
    'where[slug][equals]': slug,
    'limit': '1',
  })
  if (data?.docs?.[0]) return mapTour(data.docs[0])

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
