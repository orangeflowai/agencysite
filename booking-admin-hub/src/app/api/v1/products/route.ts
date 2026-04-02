import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { client as sanityClient } from '@/sanity/lib/client'

// GET /api/v1/products?site_id=romewander
export async function GET(request: NextRequest) {
    const siteId = request.nextUrl.searchParams.get('site_id')
    if (!siteId) return NextResponse.json({ error: 'site_id required' }, { status: 400 })

    const supabase = await createClient()

    const { data, error } = await supabase
        .from('site_products')
        .select('*')
        .eq('site_id', siteId)
        .eq('is_active', true)
        .order('created_at', { ascending: false })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ products: data })
}

// POST /api/v1/products — create new product in Supabase + Sanity
export async function POST(request: NextRequest) {
    const supabase = await createClient()

    // Verify auth
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Get user's site_id
    const { data: adminUser } = await supabase
        .from('admin_users')
        .select('site_id, role')
        .eq('auth_uid', user.id)
        .single()

    if (!adminUser) return NextResponse.json({ error: 'Admin profile not found' }, { status: 403 })

    const body = await request.json()
    const {
        title, description, price, original_price, duration, category,
        meeting_point, max_participants, min_participants, badge,
        rating, review_count, images, tags, includes, excludes,
        important_info, slug
    } = body

    if (!title || !price || !slug) {
        return NextResponse.json({ error: 'title, price, and slug are required' }, { status: 400 })
    }

    const site_id = adminUser.role === 'super_admin' ? (body.site_id || adminUser.site_id) : adminUser.site_id

    // 1. Write to Supabase
    const { data: supabaseProduct, error: supabaseError } = await supabase
        .from('site_products')
        .insert({
            site_id,
            slug,
            title,
            description,
            price,
            original_price,
            duration,
            category,
            meeting_point,
            max_participants: max_participants || 20,
            min_participants: min_participants || 1,
            badge,
            rating: rating || 4.8,
            review_count: review_count || 0,
            images: images || [],
            tags: tags || [],
            includes: includes || [],
            excludes: excludes || [],
            important_info: important_info || [],
            is_active: true,
        })
        .select()
        .single()

    if (supabaseError) return NextResponse.json({ error: supabaseError.message }, { status: 500 })

    // 2. Write to Sanity (creates a tour document linked to this site)
    let sanityId: string | null = null
    try {
        const sanityDoc = await sanityClient.create({
            _type: 'tour',
            title,
            slug: { _type: 'slug', current: slug },
            price,
            duration,
            category,
            meetingPoint: meeting_point,
            maxParticipants: max_participants,
            badge,
            rating: rating || 4.8,
            reviewCount: review_count || 0,
            features: includes || [],
            excludes: excludes || [],
            importantInfo: important_info || [],
            tags: tags || [],
            // Site reference — requires 'site' field in tourType schema
            siteId: site_id,
        })
        sanityId = sanityDoc._id

        // Update Supabase row with the Sanity ID
        await supabase
            .from('site_products')
            .update({ sanity_id: sanityId })
            .eq('id', supabaseProduct.id)
    } catch (sanityErr) {
        console.error('Sanity write failed (non-fatal):', sanityErr)
        // Continue even if Sanity write fails — Supabase is the primary source
    }

    return NextResponse.json({
        success: true,
        product: { ...supabaseProduct, sanity_id: sanityId }
    }, { status: 201 })
}

// PUT /api/v1/products — update existing product
export async function PUT(request: NextRequest) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { id, sanity_id, ...updates } = body

    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

    // Update Supabase
    const { data, error } = await supabase
        .from('site_products')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // Update Sanity if we have the ID
    if (sanity_id) {
        try {
            await sanityClient.patch(sanity_id)
                .set({
                    title: updates.title,
                    price: updates.price,
                    duration: updates.duration,
                    category: updates.category,
                    meetingPoint: updates.meeting_point,
                    maxParticipants: updates.max_participants,
                    badge: updates.badge,
                    rating: updates.rating,
                    reviewCount: updates.review_count,
                    features: updates.includes || [],
                    excludes: updates.excludes || [],
                    importantInfo: updates.important_info || [],
                    tags: updates.tags || [],
                })
                .commit()
        } catch (sanityErr) {
            console.error('Sanity update failed (non-fatal):', sanityErr)
        }
    }

    return NextResponse.json({ success: true, product: data })
}

// DELETE /api/v1/products?id=xxx — soft delete
export async function DELETE(request: NextRequest) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const id = request.nextUrl.searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

    const { error } = await supabase
        .from('site_products')
        .update({ is_active: false })
        .eq('id', id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
}
