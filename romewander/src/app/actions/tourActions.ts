'use server'

import { revalidatePath } from 'next/cache'

const PAYLOAD_URL = process.env.PAYLOAD_API_URL
const PAYLOAD_TENANT = process.env.PAYLOAD_TENANT || process.env.NEXT_PUBLIC_SITE_ID || 'romewander'
const PAYLOAD_API_KEY = process.env.PAYLOAD_API_KEY

const payloadHeaders = {
  'Content-Type': 'application/json',
  'x-tenant-id': PAYLOAD_TENANT,
  ...(PAYLOAD_API_KEY && { Authorization: `Bearer ${PAYLOAD_API_KEY}` }),
}

export async function updateTour(formData: FormData) {
  const _id = formData.get('_id') as string
  const slug = formData.get('slug') as string
  if (!_id && !slug) return { success: false, error: 'Missing tour ID or slug' }

  if (PAYLOAD_URL && PAYLOAD_API_KEY) {
    try {
      const findRes = await fetch(
        `${PAYLOAD_URL}/api/tours?where[slug][equals]=${slug}&where[tenant][equals]=${PAYLOAD_TENANT}&limit=1`,
        { headers: payloadHeaders }
      )
      const findData = await findRes.json()
      const tour = findData.docs?.[0]
      if (!tour) return { success: false, error: `Tour "${slug}" not found in Payload` }

      const patch: Record<string, any> = {
        title: formData.get('title'),
        price: Number(formData.get('price')),
        duration: formData.get('duration') || undefined,
        category: formData.get('category') || undefined,
        badge: formData.get('badge') || undefined,
        rating: Number(formData.get('rating')) || undefined,
        reviewCount: Number(formData.get('reviewCount')) || undefined,
        meetingPoint: formData.get('meetingPoint') || undefined,
        maxParticipants: Number(formData.get('maxParticipants')) || undefined,
      }
      const highlights = formData.get('highlights') as string
      if (highlights) patch.highlights = highlights.split('\n').filter(Boolean).map(item => ({ item }))
      const includes = formData.get('includes') as string
      if (includes) patch.includes = includes.split('\n').filter(Boolean).map(item => ({ item }))
      const excludes = formData.get('excludes') as string
      if (excludes) patch.excludes = excludes.split('\n').filter(Boolean).map(item => ({ item }))
      const importantInfo = formData.get('importantInfo') as string
      if (importantInfo) patch.importantInfo = importantInfo.split('\n').filter(Boolean).map(item => ({ item }))
      const tags = formData.get('tags') as string
      if (tags) patch.tags = tags.split(',').map(t => ({ tag: t.trim() })).filter(t => t.tag)

      const updateRes = await fetch(`${PAYLOAD_URL}/api/tours/${tour.id}`, {
        method: 'PATCH', headers: payloadHeaders, body: JSON.stringify(patch),
      })
      if (!updateRes.ok) {
        const err = await updateRes.json()
        return { success: false, error: err.message || 'Payload update failed' }
      }
      revalidatePath('/admin/products')
      if (slug) revalidatePath(`/tour/${slug}`)
      return { success: true }
    } catch (e: any) {
      return { success: false, error: e.message }
    }
  }

  // Sanity fallback
  if (!process.env.SANITY_API_TOKEN) return { success: false, error: 'No CMS configured' }
  try {
    const { createClient } = await import('next-sanity')
    const { apiVersion, dataset, projectId } = await import('@/sanity/env')
    const client = createClient({ projectId, dataset, apiVersion, useCdn: false, token: process.env.SANITY_API_TOKEN })
    const patch: any = {
      title: formData.get('title'), price: Number(formData.get('price')),
      duration: formData.get('duration'), category: formData.get('category'),
      badge: formData.get('badge'), rating: Number(formData.get('rating')),
      reviewCount: Number(formData.get('reviewCount')),
      meetingPoint: formData.get('meetingPoint') || undefined,
      maxParticipants: Number(formData.get('maxParticipants')) || undefined,
    }
    const highlights = formData.get('highlights') as string
    if (highlights) patch.highlights = highlights.split('\n').filter(Boolean)
    const includes = formData.get('includes') as string
    if (includes) patch.includes = includes.split('\n').filter(Boolean)
    const excludes = formData.get('excludes') as string
    if (excludes) patch.excludes = excludes.split('\n').filter(Boolean)
    const importantInfo = formData.get('importantInfo') as string
    if (importantInfo) patch.importantInfo = importantInfo.split('\n').filter(Boolean)
    const imageFile = formData.get('image') as File
    if (imageFile && imageFile.size > 0) {
      const asset = await client.assets.upload('image', imageFile, { filename: imageFile.name })
      patch.mainImage = { _type: 'image', asset: { _type: 'reference', _ref: asset._id } }
    }
    await client.patch(_id).set(patch).commit()
    revalidatePath('/admin/products')
    if (slug) revalidatePath(`/tour/${slug}`)
    return { success: true }
  } catch (e: any) {
    return { success: false, error: 'Failed to update tour' }
  }
}
