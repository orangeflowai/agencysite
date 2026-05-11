import type { StructureResolver } from 'sanity/structure'
import {
    Map,
    FileText,
    Settings,
    Globe,
    Filter,
    LayoutTemplate,
    Eye,
    Headphones,
    ShoppingBag,
} from 'lucide-react'

// ─── Allowed sites for this studio instance ───────────────────────────────────
// This studio is deployed on romewander.com.
// It must ONLY show content belonging to Rome Wander.
const ALLOWED_SITE_IDS = [
    'romewander', // Rome Wander site ID
]

// GROQ filter: tours linked to either of the two allowed sites
const TOURS_FILTER = `_type == "tour" && count(sites[_ref in $allowedSites]) > 0`
// GROQ filter: posts/settings linked to either of the two allowed sites
const POSTS_FILTER = `_type == "post" && site._ref in $allowedSites`
const SETTINGS_FILTER = `_type == "settings" && site._ref in $allowedSites`
// GROQ filter: only the two allowed site documents
const SITES_FILTER = `_type == "site" && _id in $allowedSites`

const ALLOWED_PARAMS = { allowedSites: ALLOWED_SITE_IDS }

export const structure: StructureResolver = (S) => {
    return S.list()
        .title('Content Manager')
        .items([
            // === QUICK START ===
            S.listItem()
                .title('🚀 Quick Start — Add Content')
                .icon(Map)
                .child(
                    S.list()
                        .title('Add New Content')
                        .items([
                            S.listItem()
                                .title('➕ New Tour')
                                .icon(Map)
                                .child(S.editor().schemaType('tour').documentId('new-tour-draft')),
                            S.listItem()
                                .title('🎧 New Audio Guide Sight')
                                .icon(Headphones)
                                .child(S.editor().schemaType('sight').documentId('new-sight-draft')),
                            S.listItem()
                                .title('🛍️ New Shop Product')
                                .icon(ShoppingBag)
                                .child(S.editor().schemaType('product').documentId('new-product-draft')),
                            S.divider(),
                            // Only show the two allowed website profiles
                            S.listItem()
                                .title('🌐 Setup Website Profile')
                                .icon(Globe)
                                .child(
                                    S.documentList()
                                        .title('Website Profiles')
                                        .filter(SITES_FILTER)
                                        .params(ALLOWED_PARAMS)
                                ),
                        ])
                ),

            S.divider(),

            // === SITE SWITCHER ===
            S.listItem()
                .title('🌐 Website Profile')
                .icon(Globe)
                .child(
                    S.list()
                        .title('Rome Wander Content')
                        .items([
                            S.listItem()
                                .title('🎯 Tours')
                                .icon(Map)
                                .child(
                                    S.documentList()
                                        .title('Tours — Rome Wander')
                                        .filter('_type == "tour" && $siteId in sites[]._ref')
                                        .params({ siteId: 'romewander' })
                                        .defaultOrdering([{ field: 'title', direction: 'asc' }])
                                ),
                            S.listItem()
                                .title('📝 Blog Posts')
                                .icon(FileText)
                                .child(
                                    S.documentList()
                                        .title('Posts — Rome Wander')
                                        .filter('_type == "post" && site._ref == $siteId')
                                        .params({ siteId: 'romewander' })
                                ),
                            S.listItem()
                                .title('⚙️ Settings')
                                .icon(Settings)
                                .child(
                                    S.documentList()
                                        .title('Settings — Rome Wander')
                                        .filter('_type == "settings" && site._ref == $siteId')
                                        .params({ siteId: 'romewander' })
                                ),
                            S.listItem()
                                .title('🌐 Site Profile')
                                .icon(Globe)
                                .child(
                                    S.document()
                                        .schemaType('site')
                                        .documentId('romewander')
                                        .title('Rome Wander Profile')
                                ),
                        ])
                ),

            S.divider(),

            // === APP CONTENT ===
            S.listItem()
                .title('📱 App Content')
                .icon(Headphones)
                .child(
                    S.list()
                        .title('Mobile App Content')
                        .items([
                            S.listItem()
                                .title('🎧 Audio Guide Sights')
                                .icon(Headphones)
                                .child(S.documentTypeList('sight').title('Audio Guide Sights')),
                            S.listItem()
                                .title('🛍️ Shop Products')
                                .icon(ShoppingBag)
                                .child(S.documentTypeList('product').title('Shop Products')),
                        ])
                ),

            S.divider(),

            // === ALL CONTENT — scoped to romewander only ===
            S.listItem()
                .title('📁 All Content')
                .icon(LayoutTemplate)
                .child(
                    S.list()
                        .title('All Content (Rome Wander)')
                        .items([
                            S.listItem()
                                .title('🎯 All Tours')
                                .icon(Map)
                                .child(
                                    S.documentList()
                                        .title('All Tours')
                                        .filter(TOURS_FILTER)
                                        .params(ALLOWED_PARAMS)
                                        .defaultOrdering([{ field: 'title', direction: 'asc' }])
                                ),
                            S.listItem()
                                .title('🎧 All Audio Guide Sights')
                                .icon(Headphones)
                                .child(S.documentTypeList('sight').title('All Sights')),
                            S.listItem()
                                .title('🛍️ All Shop Products')
                                .icon(ShoppingBag)
                                .child(S.documentTypeList('product').title('All Products')),
                            S.listItem()
                                .title('📝 All Blog Posts')
                                .icon(FileText)
                                .child(
                                    S.documentList()
                                        .title('All Blog Posts')
                                        .filter(POSTS_FILTER)
                                        .params(ALLOWED_PARAMS)
                                ),
                            S.listItem()
                                .title('⚙️ All Settings')
                                .icon(Settings)
                                .child(
                                    S.documentList()
                                        .title('All Settings')
                                        .filter(SETTINGS_FILTER)
                                        .params(ALLOWED_PARAMS)
                                ),
                            S.listItem()
                                .title('🌐 Our Websites')
                                .icon(Globe)
                                .child(
                                    S.documentList()
                                        .title('Our Websites')
                                        .filter(SITES_FILTER)
                                        .params(ALLOWED_PARAMS)
                                ),
                        ])
                ),

            S.divider(),

            // === FILTER BY CATEGORY — scoped to allowed sites ===
            S.listItem()
                .title('🔍 Filter by Category')
                .icon(Filter)
                .child(
                    S.list()
                        .title('Filter Tours by Category')
                        .items([
                            S.listItem()
                                .title('Colosseum Tours')
                                .icon(Map)
                                .child(
                                    S.documentList()
                                        .title('Colosseum Tours')
                                        .filter(`${TOURS_FILTER} && category == $category`)
                                        .params({ ...ALLOWED_PARAMS, category: 'colosseum' })
                                ),
                            S.listItem()
                                .title('Vatican Tours')
                                .icon(Map)
                                .child(
                                    S.documentList()
                                        .title('Vatican Tours')
                                        .filter(`${TOURS_FILTER} && category == $category`)
                                        .params({ ...ALLOWED_PARAMS, category: 'vatican' })
                                ),
                            S.listItem()
                                .title('City Tours')
                                .icon(Map)
                                .child(
                                    S.documentList()
                                        .title('City Tours')
                                        .filter(`${TOURS_FILTER} && category == $category`)
                                        .params({ ...ALLOWED_PARAMS, category: 'city' })
                                ),
                            S.listItem()
                                .title('Hidden Gems')
                                .icon(Map)
                                .child(
                                    S.documentList()
                                        .title('Hidden Gems')
                                        .filter(`${TOURS_FILTER} && category == $category`)
                                        .params({ ...ALLOWED_PARAMS, category: 'hidden-gems' })
                                ),
                        ])
                ),
        ])
}
