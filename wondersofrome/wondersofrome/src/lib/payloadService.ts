/**
 * payloadService.ts — Payload CMS data layer
 * Uses email/password auth with cached token (refreshes on 401).
 * Maps Payload docs → same shapes as sanityService for drop-in compatibility.
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

let _token: string | null = null
let _tokenExpiry = 0

async function getToken(): Promise<string> {
  if (_token && Date.now() < _tokenExpiry - 300_000) return _token

  const email    = process.env.PAYLOAD_API_EMAIL    || 'superadmin@romeagency.com'
  const password = process.env.PAYLOAD_API_PASSWORD || 'SuperAdmin2025!'

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000) // 5s timeout on auth
    const res = await fetch(`${PAYLOAD_URL}/api/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      signal: controller.signal,
    })
    clearTimeout(timeout)
    if (!res.ok) throw new Error(`Auth failed: ${res.status}`)
    const data = await res.json()
    _token = data.token
    _tokenExpiry = (data.exp || 0) * 1000 || Date.now() + 7_200_000
    return _token!
  } catch (e) {
    console.warn('[payloadService] Auth failed:', e)
    return ''
  }
}

// ── Fetch helper ──────────────────────────────────────────────────────────────

async function payloadFetch(path: string, params: Record<string, string> = {}, retry = true): Promise<any> {
  const url = new URL(`${PAYLOAD_URL}/api${path}`)
  // depth defaults to 1 unless overridden by caller
  if (!params['depth']) url.searchParams.set('depth', '1')
  url.searchParams.set('limit', '200')
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v)

  const token = await getToken()

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000) // 8s timeout
    const res = await fetch(url.toString(), {
      next: { revalidate: 60 },
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    })
    clearTimeout(timeout)
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
  // Priority 1: Payload media object (after migration)
  if (doc.mainImage?.url) return doc.mainImage.url
  if (doc.mainImage?.filename) return `${PAYLOAD_URL}/api/media/file/${doc.mainImage.filename}`
  
  // Priority 2: Direct imageUrl (Sanity CDN URL or R2 fallback)
  if (doc.imageUrl) return doc.imageUrl
  
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

export interface InventorySlot {
  id: string;
  tour_slug: string;
  date: string;
  time: string;
  available_slots: number;
  total_slots?: number;
  price_override?: number;
}

export async function getInventory(start: string, end: string): Promise<InventorySlot[]> {
  const dateStart = `${start}T00:00:00.000Z`;
  const dateEnd = `${end}T23:59:59.999Z`;

  const data = await payloadFetch('/inventory', {
    'where[tenant][equals]': DEFAULT_SITE_ID,
    'where[date][greater_than_equal]': dateStart,
    'where[date][less_than_equal]': dateEnd,
    'limit': '1000',
    'depth': '1', // To get tour slug
  });

  return (data?.docs || []).map((doc: any) => ({
    id: String(doc.id),
    tour_slug: doc.tour?.slug || '',
    date: typeof doc.date === 'string' ? doc.date.slice(0, 10) : '',
    time: doc.time,
    available_slots: doc.availableSlots || 0,
    total_slots: doc.totalSlots || 0,
    price_override: doc.priceOverride,
  }));
}

export async function updateInventorySlot(id: string, updates: Partial<InventorySlot>): Promise<InventorySlot | null> {
  const token = await getToken();
  const payload: any = {};
  if (updates.available_slots !== undefined) payload.availableSlots = updates.available_slots;
  if (updates.price_override !== undefined) payload.priceOverride = updates.price_override;
  // Always ensure tenant is present on update if possible, though Payload usually preserves it
  payload.tenant = DEFAULT_SITE_ID;

  try {
    const res = await fetch(`${PAYLOAD_URL}/api/inventory/${id}?depth=1`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
        const errText = await res.text();
        console.error(`[payloadService] PATCH /inventory/${id} failed:`, res.status, errText);
        return null;
    }
    const data = await res.json();
    const doc = data.doc || data; // Handle both nested and flat responses
    return {
      id: String(doc.id),
      tour_slug: doc.tour?.slug || doc.tour || '',
      date: typeof doc.date === 'string' ? doc.date.slice(0, 10) : '',
      time: doc.time,
      available_slots: doc.availableSlots || 0,
      price_override: doc.priceOverride,
    };
  } catch (err) {
    console.error(`[payloadService] PATCH /inventory/${id} exception:`, err);
    return null;
  }
}

export async function createInventorySlot(slot: Omit<InventorySlot, 'id'>): Promise<InventorySlot | null> {
  const token = await getToken();
  
  // First, find the tour ID by slug
  const tourRes = await payloadFetch('/tours', {
    'where[slug][equals]': slot.tour_slug,
    'limit': '1',
    'depth': '0'
  });
  const tourId = tourRes?.docs?.[0]?.id;
  if (!tourId) {
      console.error(`[payloadService] Create slot failed: Tour not found for slug ${slot.tour_slug}`);
      return null;
  }

  const payload = {
    tour: tourId,
    date: `${slot.date}T12:00:00.000Z`, 
    time: slot.time,
    availableSlots: slot.available_slots,
    totalSlots: slot.total_slots || slot.available_slots,
    priceOverride: slot.price_override,
    tenant: DEFAULT_SITE_ID,
  };

  try {
    const res = await fetch(`${PAYLOAD_URL}/api/inventory?depth=1`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
        const errText = await res.text();
        console.error(`[payloadService] POST /inventory failed:`, res.status, errText);
        return null;
    }
    const data = await res.json();
    const doc = data.doc || data;
    return {
      id: String(doc.id),
      tour_slug: slot.tour_slug,
      date: slot.date,
      time: doc.time,
      available_slots: doc.availableSlots || 0,
      price_override: doc.priceOverride,
    };
  } catch (err) {
    console.error(`[payloadService] POST /inventory exception:`, err);
    return null;
  }
}

export async function deleteInventorySlot(id: string): Promise<boolean> {
  const token = await getToken();
  try {
    const res = await fetch(`${PAYLOAD_URL}/api/inventory/${id}`, {
      method: 'DELETE',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    if (!res.ok) {
        const errText = await res.text();
        console.error(`[payloadService] DELETE /inventory/${id} failed:`, res.status, errText);
    }
    return res.ok;
  } catch (err) {
    console.error(`[payloadService] DELETE /inventory/${id} exception:`, err);
    return false;
  }
}

export async function getTours(siteId: string = DEFAULT_SITE_ID): Promise<Tour[]> {
  const data = await payloadFetch('/tours', {
    'where[tenant][equals]': siteId,
    'sort': 'createdAt',
    'depth': '1',  // Changed from '0' to '1' to populate mainImage
  })
  return (data?.docs || []).map(mapTour)
}

export async function getTour(slug: string, siteId: string = DEFAULT_SITE_ID): Promise<Tour | null> {
  for (const s of [slug, `${slug}-wor`, `${slug}-tir`, `${slug}-grt`, `${slug}-rvt`, `${slug}-rwd`]) {
    const data = await payloadFetch('/tours', {
      'where[slug][equals]': s,
      'where[tenant][equals]': siteId,
      'limit': '1',
      'depth': '1',
    })
    const doc = data?.docs?.[0]
    if (doc) return mapTour(doc)
  }
  return null
}

export async function getAllTours(): Promise<Tour[]> {
  const data = await payloadFetch('/tours', { 'limit': '500', 'depth': '1' })
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
  const data = await payloadFetch('/site-settings', { 'where[tenant][equals]': siteId, 'limit': '1' })
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
  const data = await payloadFetch('/site-settings', { 'where[tenant][equals]': siteId, 'limit': '1' })
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
