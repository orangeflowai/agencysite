import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

/**
 * Proxies addon requests to the Payload Unified CMS.
 * Falls back to Sanity if PAYLOAD_API_URL is not set.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const siteId = searchParams.get('site') || process.env.PAYLOAD_TENANT || process.env.NEXT_PUBLIC_SITE_ID || 'goldenrometour'

  const payloadUrl = process.env.PAYLOAD_API_URL
  const apiKey = process.env.PAYLOAD_API_KEY

  if (payloadUrl && apiKey) {
    const params = new URLSearchParams({
      'where[tenant][equals]': siteId,
      'where[isAvailable][equals]': 'true',
      sort: 'sortOrder',
      limit: '50',
      depth: '1',
    })
    const res = await fetch(`${payloadUrl}/api/addons?${params}`, {
      headers: { 'x-tenant-id': siteId, Authorization: `Bearer ${apiKey}` },
      next: { revalidate: 60 },
    })
    const data = await res.json()
    // Normalize to the shape the checkout page expects
    const addons = (data.docs || []).map((a: any) => ({
      id: a.slug || a.id,
      _id: a.id,
      name: a.name,
      description: a.description,
      longDescription: a.longDescription,
      price: a.price,
      pricingType: a.pricingType === 'per_person' ? 'perPerson' : a.pricingType === 'per_hour' ? 'perHour' : 'perBooking',
      icon: a.icon || 'Sparkles',
      category: a.category,
      popular: false,
      image: a.image,
    }))
    return NextResponse.json({ addons })
  }

  // Fallback: Sanity
  try {
    const { client } = await import('@/sanity/lib/client')
    const addons = await client.fetch(`
      *[_type == "addon" && available == true && $siteId in sites[]->slug.current] | order(sortOrder asc, price asc) {
        _id, name, "id": id.current, description, longDescription, price, pricingType, icon, category, popular, image
      }
    `, { siteId })
    return NextResponse.json({ addons })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
