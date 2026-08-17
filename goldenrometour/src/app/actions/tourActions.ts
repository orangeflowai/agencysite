'use server'

import { revalidatePath } from 'next/cache'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function updateTour(formData: FormData) {
  const slug = formData.get('slug') as string
  if (!slug) return { success: false, error: 'Missing tour slug' }

  const lines = (v: unknown) => (typeof v === 'string' ? v.split('\n').map((s) => s.trim()).filter(Boolean) : [])

  const updates: Record<string, any> = {
    title: formData.get('title'),
    price: Number(formData.get('price')),
    duration: formData.get('duration') || undefined,
    description: formData.get('description') || undefined,
    badge: formData.get('badge') || undefined,
    image_url: formData.get('image_url') || undefined,
    meeting_point: formData.get('meeting_point') || undefined,
    highlights: lines(formData.get('highlights')),
    includes: lines(formData.get('includes')),
    excludes: lines(formData.get('excludes')),
    important_info: lines(formData.get('important_info')),
    updated_at: new Date().toISOString(),
  }
  Object.keys(updates).forEach((k) => updates[k] === undefined && delete updates[k])

  const { error } = await supabaseAdmin
    .from('tours')
    .upsert({ slug, ...updates }, { onConflict: 'slug' })
  if (error) return { success: false, error: error.message }

  revalidatePath('/admin/tours')
  revalidatePath(`/tour/${slug}`)
  revalidatePath('/')
  return { success: true }
}
