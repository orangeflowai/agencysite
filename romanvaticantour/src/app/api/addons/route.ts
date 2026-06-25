import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const siteId = searchParams.get('site') || process.env.NEXT_PUBLIC_SITE_ID || 'romanvaticantour'

  try {
    const { client } = await import('@/sanity/lib/client')
    const addons = await client.fetch(`
      *[_type == "addon" && available == true && $siteId in sites[]->slug.current] | order(sortOrder asc, price asc) {
        _id, name, "id": id.current, description, longDescription, price, pricingType, icon, category, popular, image
      }
    `, { siteId })
    return NextResponse.json({ addons })
  } catch (err: any) {
    console.warn('[addons] Sanity fetch failed:', err.message)
    return NextResponse.json({ addons: [] })
  }
}
