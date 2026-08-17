import { supabaseAdmin } from './supabaseAdmin'
import { tours as staticTours, TourProduct } from './toursData'

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
  tags?: string[]
  includes?: string[]
  excludes?: string[]
  importantInfo?: string[]
  itinerary?: Array<{ title: string; duration: string; description: string }>
  meetingPoint?: string
  guestTypes?: Array<{ name: string; price: number; description: string }>
}

function guestTypesFor(price: number): Array<{ name: string; price: number; description: string }> {
  return [
    { name: 'Adult', price, description: 'Age 18+' },
    { name: 'Student', price: Math.round(price * 0.85), description: 'Valid ID required' },
    { name: 'Youth', price: Math.round(price * 0.70), description: 'Age 12–17' },
    { name: 'Child', price: Math.round(price * 0.50), description: 'Under 12' },
  ]
}

function staticTourToTour(t: TourProduct): Tour {
  return {
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
    location: t.meetingPoint,
    includes: t.includes || [],
    excludes: t.excludes || [],
    importantInfo: t.importantInfo || [],
    meetingPoint: t.meetingPoint || '',
    guestTypes: guestTypesFor(t.price),
  }
}

function rowToTour(row: any): Tour {
  return {
    _id: row.id,
    title: row.title,
    slug: { current: row.slug },
    mainImage: row.image_url ? { asset: { url: row.image_url } } : undefined,
    price: row.price,
    duration: row.duration || '',
    description: row.description || '',
    category: row.category || 'vatican',
    features: row.highlights || [],
    highlights: row.highlights || [],
    badge: row.badge || undefined,
    rating: row.rating != null ? Number(row.rating) : undefined,
    reviewCount: row.reviews || 0,
    groupSize: row.group_size || undefined,
    location: row.meeting_point || '',
    includes: row.includes || [],
    excludes: row.excludes || [],
    importantInfo: row.important_info || [],
    meetingPoint: row.meeting_point || '',
    guestTypes: guestTypesFor(row.price),
  }
}

export async function getTours(): Promise<Tour[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('tours')
      .select('*')
      .eq('active', true)
      .order('sort_order')
    if (!error && data && data.length > 0) return data.map(rowToTour)
  } catch (e) {
    console.error('[tourService] tours read failed, using static fallback', e)
  }
  return staticTours.map(staticTourToTour)
}

export async function getTour(slug: string): Promise<Tour | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from('tours')
      .select('*')
      .eq('slug', slug)
      .eq('active', true)
      .single()
    if (!error && data) return rowToTour(data)
  } catch (e) {
    console.error('[tourService] tour read failed, using static fallback', e)
  }
  const s = staticTours.find((t) => t.slug === slug)
  return s ? staticTourToTour(s) : null
}

export function urlFor(source: any) {
  const url = typeof source === 'string'
    ? source
    : source?.asset?.url || source?.url || ''
  const builder: any = {
    url: () => url,
    width: (_w: number) => builder,
    height: (_h: number) => builder,
    fit: (_f: string) => builder,
    auto: (_a: string) => builder,
  }
  return builder
}
