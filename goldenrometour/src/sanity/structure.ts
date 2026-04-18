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
                            S.listItem()
                                .title('🌐 Setup Website Profile')
                                .icon(Globe)
                                .child(S.documentTypeList('site').title('Website Profiles')),
                        ])
                ),

            S.divider(),

            // === SITE SWITCHER ===
            S.listItem()
                .title('🌐 Website Profiles')
                .icon(Globe)
                .child(
                    S.list()
                        .title('Select Website to Manage')
                        .items([
                            S.listItem()
                                .title('🎟️ Rome Tour Tickets')
                                .icon(Eye)
                                .child(
                                    S.list()
                                        .title('Rome Tour Tickets Content')
                                        .items([
                                            S.listItem()
                                                .title('🎯 Tours')
                                                .icon(Map)
                                                .child(
                                                    S.documentList()
                                                        .title('Tours for Rome Tour Tickets')
                                                        .filter('_type == "tour" && $siteId in sites[]._ref')
                                                        .params({ siteId: 'rome-tour-tickets' })
                                                        .defaultOrdering([{ field: 'title', direction: 'asc' }])
                                                ),
                                            S.listItem()
                                                .title('📝 Blog Posts')
                                                .icon(FileText)
                                                .child(
                                                    S.documentList()
                                                        .title('Posts for Rome Tour Tickets')
                                                        .filter('_type == "post" && site._ref == $siteId')
                                                        .params({ siteId: 'rome-tour-tickets' })
                                                ),
                                            S.listItem()
                                                .title('⚙️ Settings')
                                                .icon(Settings)
                                                .child(
                                                    S.documentList()
                                                        .title('Settings for Rome Tour Tickets')
                                                        .filter('_type == "settings" && site._ref == $siteId')
                                                        .params({ siteId: 'rome-tour-tickets' })
                                                ),
                                        ])
                                ),

                            S.divider(),

                            S.listItem()
                                .title(`✨ ${process.env.NEXT_PUBLIC_SITE_NAME || "Your Agency"}`)
                                .icon(Eye)
                                .child(
                                    S.list()
                                        .title(`$${process.env.NEXT_PUBLIC_SITE_NAME || "Your Agency"} Content`)
                                        .items([
                                            S.listItem()
                                                .title(`🎯 Tours`)
                                                .icon(Map)
                                                .child(
                                                    S.documentList()
                                                        .title(`Tours for $${process.env.NEXT_PUBLIC_SITE_NAME || "Your Agency"}`)
                                                        .filter(`_type == "tour" && $siteId in sites[]._ref')
                                                        .params({ siteId: process.env.NEXT_PUBLIC_SITE_ID || 'your-agency-slug' })
                                                        .defaultOrdering([{ field: 'title', direction: 'asc' }])
                                                ),
                                            S.listItem()
                                                .title('📝 Blog Posts')
                                                .icon(FileText)
                                                .child(
                                                    S.documentList()
                                                        .title(`Posts for ${process.env.NEXT_PUBLIC_SITE_NAME || "Your Agency"}`)
                                                        .filter('_type == "post" && site._ref == $siteId')
                                                        .params({ siteId: process.env.NEXT_PUBLIC_SITE_ID || 'your-agency-slug' })
                                                ),
                                            S.listItem()
                                                .title('⚙️ Settings')
                                                .icon(Settings)
                                                .child(
                                                    S.documentList()
                                                        .title(`Settings for ${process.env.NEXT_PUBLIC_SITE_NAME || "Your Agency"}`)
                                                        .filter('_type == "settings" && site._ref == $siteId')
                                                        .params({ siteId: process.env.NEXT_PUBLIC_SITE_ID || 'your-agency-slug' })
                                                ),
                                        ])
                                ),

                            S.divider(),

                            S.listItem()
                                .title('⚡ Manage Websites')
                                .icon(Settings)
                                .child(
                                    S.documentTypeList('site').title('All Websites')
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

            // === ALL CONTENT (Admin) ===
            S.listItem()
                .title('📁 All Content (Admin)')
                .icon(LayoutTemplate)
                .child(
                    S.list()
                        .title('All Content')
                        .items([
                            S.listItem()
                                .title('🎯 All Tours')
                                .icon(Map)
                                .child(S.documentTypeList('tour').title('All Tours')),
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
                                .child(S.documentTypeList('post').title('All Posts')),
                            S.listItem()
                                .title('⚙️ All Settings')
                                .icon(Settings)
                                .child(S.documentTypeList('settings').title('All Settings')),
                            S.listItem()
                                .title('🌐 All Websites')
                                .icon(Globe)
                                .child(S.documentTypeList('site').title('All Sites')),
                        ])
                ),

            S.divider(),

            // === FILTER BY CATEGORY ===
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
                                        .filter('_type == "tour" && category == $category')
                                        .params({ category: 'colosseum' })
                                ),
                            S.listItem()
                                .title('Vatican Tours')
                                .icon(Map)
                                .child(
                                    S.documentList()
                                        .title('Vatican Tours')
                                        .filter('_type == "tour" && category == $category')
                                        .params({ category: 'vatican' })
                                ),
                            S.listItem()
                                .title('City Tours')
                                .icon(Map)
                                .child(
                                    S.documentList()
                                        .title('City Tours')
                                        .filter('_type == "tour" && category == $category')
                                        .params({ category: 'city' })
                                ),
                            S.listItem()
                                .title('Hidden Gems')
                                .icon(Map)
                                .child(
                                    S.documentList()
                                        .title('Hidden Gems')
                                        .filter('_type == "tour" && category == $category')
                                        .params({ category: 'hidden-gems' })
                                ),
                        ])
                ),
        ])
}
