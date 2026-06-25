'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '@/sanity/env'

const token = process.env.SANITY_API_TOKEN

export async function updateTour(formData: FormData) {
  const _id = formData.get('_id') as string
  const slug = formData.get('slug') as string
  if (!_id && !slug) return { success: false, error: 'Missing tour ID or slug' }

  if (!token) return { success: false, error: 'SANITY_API_TOKEN not configured' }

  try {
    const client = createClient({ projectId, dataset, apiVersion, useCdn: false, token })

    // If only slug provided, look up the _id
    let docId = _id
    if (!docId && slug) {
      const doc = await client.fetch(`*[_type == "tour" && slug.current == $slug][0]{_id}`, { slug })
      if (!doc) return { success: false, error: `Tour "${slug}" not found` }
      docId = doc._id
    }

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

    // Clean undefined values
    Object.keys(patch).forEach(k => patch[k] === undefined && delete patch[k])

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

    await client.patch(docId).set(patch).commit()

    revalidatePath('/admin/products')
    revalidatePath('/admin/bookings')
    if (slug) revalidatePath(`/tour/${slug}`)

    return { success: true }
  } catch (e: any) {
    return { success: false, error: e.message || 'Failed to update tour' }
  }
}
