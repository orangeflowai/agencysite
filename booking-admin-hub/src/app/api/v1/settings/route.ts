import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { client as sanityClient } from '@/sanity/lib/client'

// GET /api/v1/settings?site_id=romewander
export async function GET(request: NextRequest) {
    const siteId = request.nextUrl.searchParams.get('site_id')
    if (!siteId) return NextResponse.json({ error: 'site_id required' }, { status: 400 })

    const supabase = await createClient()

    const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('site_id', siteId)
        .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ settings: data || { site_id: siteId } })
}

// PUT /api/v1/settings — save settings to Supabase + Sanity
export async function PUT(request: NextRequest) {
    const supabase = await createClient()

    // Verify auth
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Get user's profile
    const { data: adminUser } = await supabase
        .from('admin_users')
        .select('site_id, role')
        .eq('auth_uid', user.id)
        .single()

    if (!adminUser) return NextResponse.json({ error: 'Admin profile not found' }, { status: 403 })

    const body = await request.json()
    const { business_info, contact_info, gdpr_settings, social_links, notification_prefs } = body

    const site_id = adminUser.role === 'super_admin' ? (body.site_id || adminUser.site_id) : adminUser.site_id

    // 1. Upsert to Supabase
    const { error: supabaseError } = await supabase
        .from('site_settings')
        .upsert({
            site_id,
            business_info: business_info || {},
            contact_info: contact_info || {},
            gdpr_settings: gdpr_settings || {},
            social_links: social_links || {},
            notification_prefs: notification_prefs || {},
            updated_at: new Date().toISOString(),
            updated_by: user.id,
        }, { onConflict: 'site_id' })

    if (supabaseError) return NextResponse.json({ error: supabaseError.message }, { status: 500 })

    // 2. Write contact + business info to Sanity (find site doc by slug)
    try {
        const sanityQuery = `*[_type == "site" && slug.current == $siteId][0]{ _id }`
        const siteDoc = await sanityClient.fetch(sanityQuery, { siteId: site_id })

        if (siteDoc?._id) {
            const patch: Record<string, unknown> = {}

            if (business_info) {
                patch.businessInfo = {
                    companyName: business_info.company_name || business_info.companyName,
                    vatNumber: business_info.vat_number || business_info.vatNumber,
                    reaNumber: business_info.rea_number || business_info.reaNumber,
                    registeredAddress: business_info.registered_address || business_info.registeredAddress,
                    pecEmail: business_info.pec_email || business_info.pecEmail,
                    sdiCode: business_info.sdi_code || business_info.sdiCode,
                    shareCapital: business_info.share_capital || business_info.shareCapital,
                }
            }

            if (contact_info) {
                patch.contactEmail = contact_info.contact_email || contact_info.contactEmail
                patch.contactPhone = contact_info.contact_phone || contact_info.contactPhone
                patch.whatsappNumber = contact_info.whatsapp_number || contact_info.whatsappNumber
                patch.officeAddress = contact_info.office_address || contact_info.officeAddress
            }

            if (social_links) {
                patch.socialLinks = {
                    facebook: social_links.facebook,
                    instagram: social_links.instagram,
                    twitter: social_links.twitter,
                    tripadvisor: social_links.tripadvisor,
                    youtube: social_links.youtube,
                    linkedin: social_links.linkedin,
                }
            }

            if (gdpr_settings) {
                patch.gdprSettings = {
                    cookieBannerTitle: gdpr_settings.cookie_banner_title || gdpr_settings.cookieBannerTitle,
                    cookieBannerText: gdpr_settings.cookie_banner_text || gdpr_settings.cookieBannerText,
                    acceptButtonText: gdpr_settings.accept_button_text || gdpr_settings.acceptButtonText,
                    declineButtonText: gdpr_settings.decline_button_text || gdpr_settings.declineButtonText,
                    privacyPolicyLink: gdpr_settings.privacy_policy_link || gdpr_settings.privacyPolicyLink,
                    privacyPolicyText: gdpr_settings.privacy_policy_text || gdpr_settings.privacyPolicyText,
                    showCookieBanner: gdpr_settings.show_cookie_banner ?? gdpr_settings.showCookieBanner,
                    gdprComplianceRegion: gdpr_settings.gdpr_compliance_region || gdpr_settings.gdprComplianceRegion,
                }
            }

            if (Object.keys(patch).length > 0) {
                await sanityClient.patch(siteDoc._id).set(patch).commit()
            }
        }
    } catch (sanityErr) {
        console.error('Sanity settings write failed (non-fatal):', sanityErr)
    }

    return NextResponse.json({ success: true, site_id })
}
