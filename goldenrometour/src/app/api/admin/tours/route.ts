export const dynamic = 'force-dynamic'
import { NextResponse, type NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { tours as staticTours } from '@/lib/toursData'
import { isAdmin } from '@/lib/adminAuth'

export async function GET(request: NextRequest) {
  if (!isAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { data, error } = await supabaseAdmin
    .from('tours')
    .select('*')
    .order('sort_order')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  let tours = data || []

  // Fall back to the hardcoded 2 tours when the DB has none (so the admin
  // always sees and can edit the two products).
  if (tours.length === 0) {
    tours = staticTours.map((t) => ({
      id: t.id,
      slug: t.slug,
      title: t.title,
      tour_type: t.tourType,
      price: t.price,
      duration: t.duration,
      description: t.description,
      highlights: t.highlights,
      includes: t.includes,
      excludes: t.excludes || [],
      meeting_point: t.meetingPoint,
      important_info: t.importantInfo || [],
      image_url: t.imageUrl,
      badge: t.badge,
      rating: t.rating,
      reviews: t.reviews,
      group_size: t.groupSize,
      category: t.category,
      sort_order: t.slug.includes('guided') ? 2 : 1,
      active: true,
    }))
  }

  return NextResponse.json({ tours })
}

export async function POST(request: NextRequest) {
  if (!isAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await request.json()
  const { slug, title } = body
  if (!slug || !title) return NextResponse.json({ error: 'slug and title are required' }, { status: 400 })

  const slugNorm = String(slug).toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  if (!slugNorm) return NextResponse.json({ error: 'Invalid slug' }, { status: 400 })

  const fields = ['title', 'price', 'duration', 'description', 'badge', 'image_url', 'meeting_point', 'tour_type', 'group_size', 'category', 'sort_order', 'rating', 'reviews', 'active']
  const row: Record<string, any> = { slug: slugNorm, title }
  for (const k of fields) if (body[k] != null) row[k] = body[k]
  if (Array.isArray(body.highlights)) row.highlights = body.highlights
  if (Array.isArray(body.includes)) row.includes = body.includes
  if (Array.isArray(body.excludes)) row.excludes = body.excludes
  if (Array.isArray(body.important_info)) row.important_info = body.important_info
  if (row.price != null) row.price = Number(row.price)
  if (row.category == null) row.category = 'vatican'
  if (row.active == null) row.active = true

  const { data, error } = await supabaseAdmin.from('tours').insert(row).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ tour: data })
}

export async function PUT(request: NextRequest) {
  if (!isAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await request.json()
  const { id, slug, ...fields } = body
  if (!id && !slug) return NextResponse.json({ error: 'Missing id or slug' }, { status: 400 })

  const allowed = ['title', 'price', 'duration', 'description', 'badge', 'image_url', 'meeting_point', 'tour_type', 'group_size', 'category', 'sort_order', 'active']
  const updates: Record<string, any> = { updated_at: new Date().toISOString() }
  for (const k of allowed) if (k in fields) updates[k] = fields[k]
  if (Array.isArray(fields.highlights)) updates.highlights = fields.highlights
  if (Array.isArray(fields.includes)) updates.includes = fields.includes
  if (Array.isArray(fields.excludes)) updates.excludes = fields.excludes
  if (Array.isArray(fields.important_info)) updates.important_info = fields.important_info

  const q = supabaseAdmin.from('tours').update(updates)
  if (id) q.eq('id', id)
  else q.eq('slug', slug)

  const { error } = await q
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
