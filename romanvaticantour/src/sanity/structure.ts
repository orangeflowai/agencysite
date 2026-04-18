import type { StructureResolver } from 'sanity/structure'
import { Map, FileText, Settings, Globe, Filter, LayoutTemplate, Eye, Headphones, ShoppingBag } from 'lucide-react'

const SITE_ID = process.env.NEXT_PUBLIC_SITE_ID || 'romanvaticantour'

export const structure: StructureResolver = (S) => {
  return S.list()
    .title('Content Manager')
    .items([

      S.listItem()
        .title('🚀 Quick Start')
        .icon(Map)
        .child(
          S.list().title('Add New Content').items([
            S.listItem().title('➕ New Tour').icon(Map)
              .child(S.editor().schemaType('tour').documentId('new-tour-draft')),
            S.listItem().title('🎧 New Audio Guide Sight').icon(Headphones)
              .child(S.editor().schemaType('sight').documentId('new-sight-draft')),
            S.listItem().title('🛍️ New Shop Product').icon(ShoppingBag)
              .child(S.editor().schemaType('product').documentId('new-product-draft')),
            S.divider(),
            S.listItem().title('🌐 Setup Website Profile').icon(Globe)
              .child(S.documentTypeList('site').title('Website Profiles')),
          ])
        ),

      S.divider(),

      S.listItem()
        .title('🌐 Website Profiles')
        .icon(Globe)
        .child(
          S.list().title('Select Website').items([

            S.listItem().title('🎟️ Rome Tour Tickets').icon(Eye)
              .child(
                S.list().title('Rome Tour Tickets').items([
                  S.listItem().title('🎯 Tours').icon(Map)
                    .child(
                      S.documentList()
                        .title('Tours for Rome Tour Tickets')
                        .filter('_type == "tour" && $siteId in sites[]._ref')
                        .params({ siteId: 'rome-tour-tickets' })
                        .defaultOrdering([{ field: 'title', direction: 'asc' }])
                    ),
                  S.listItem().title('📝 Blog Posts').icon(FileText)
                    .child(
                      S.documentList()
                        .title('Posts for Rome Tour Tickets')
                        .filter('_type == "post" && site._ref == $siteId')
                        .params({ siteId: 'rome-tour-tickets' })
                    ),
                  S.listItem().title('⚙️ Settings').icon(Settings)
                    .child(
                      S.documentList()
                        .title('Settings for Rome Tour Tickets')
                        .filter('_type == "settings" && site._ref == $siteId')
                        .params({ siteId: 'rome-tour-tickets' })
                    ),
                ])
              ),

            S.divider(),

            S.listItem().title('Roman Vatican Tour').icon(Eye)
              .child(
                S.list().title('Roman Vatican Tour').items([
                  S.listItem().title('🎯 Tours').icon(Map)
                    .child(
                      S.documentList()
                        .title('Tours for Roman Vatican Tour')
                        .filter('_type == "tour" && $siteId in sites[]._ref')
                        .params({ siteId: SITE_ID })
                        .defaultOrdering([{ field: 'title', direction: 'asc' }])
                    ),
                  S.listItem().title('📝 Blog Posts').icon(FileText)
                    .child(
                      S.documentList()
                        .title('Blog Posts')
                        .filter('_type == "post" && site._ref == $siteId')
                        .params({ siteId: SITE_ID })
                    ),
                  S.listItem().title('⚙️ Settings').icon(Settings)
                    .child(
                      S.documentList()
                        .title('Settings')
                        .filter('_type == "settings" && site._ref == $siteId')
                        .params({ siteId: SITE_ID })
                    ),
                ])
              ),

            S.divider(),

            S.listItem().title('⚡ Manage Websites').icon(Settings)
              .child(S.documentTypeList('site').title('All Websites')),
          ])
        ),

      S.divider(),

      S.listItem().title('📱 App Content').icon(Headphones)
        .child(
          S.list().title('Mobile App Content').items([
            S.listItem().title('🎧 Audio Guide Sights').icon(Headphones)
              .child(S.documentTypeList('sight').title('Audio Guide Sights')),
            S.listItem().title('🛍️ Shop Products').icon(ShoppingBag)
              .child(S.documentTypeList('product').title('Shop Products')),
          ])
        ),

      S.divider(),

      S.listItem().title('📁 All Content (Admin)').icon(LayoutTemplate)
        .child(
          S.list().title('All Content').items([
            S.listItem().title('🎯 All Tours').icon(Map)
              .child(S.documentTypeList('tour').title('All Tours')),
            S.listItem().title('🎧 All Audio Guide Sights').icon(Headphones)
              .child(S.documentTypeList('sight').title('All Sights')),
            S.listItem().title('🛍️ All Shop Products').icon(ShoppingBag)
              .child(S.documentTypeList('product').title('All Products')),
            S.listItem().title('📝 All Blog Posts').icon(FileText)
              .child(S.documentTypeList('post').title('All Posts')),
            S.listItem().title('⚙️ All Settings').icon(Settings)
              .child(S.documentTypeList('settings').title('All Settings')),
            S.listItem().title('🌐 All Websites').icon(Globe)
              .child(S.documentTypeList('site').title('All Sites')),
          ])
        ),

      S.divider(),

      S.listItem().title('🔍 Filter by Category').icon(Filter)
        .child(
          S.list().title('Filter Tours by Category').items([
            S.listItem().title('Colosseum Tours').icon(Map)
              .child(S.documentList().title('Colosseum Tours').filter('_type == "tour" && category == $category').params({ category: 'colosseum' })),
            S.listItem().title('Vatican Tours').icon(Map)
              .child(S.documentList().title('Vatican Tours').filter('_type == "tour" && category == $category').params({ category: 'vatican' })),
            S.listItem().title('City Tours').icon(Map)
              .child(S.documentList().title('City Tours').filter('_type == "tour" && category == $category').params({ category: 'city' })),
            S.listItem().title('Hidden Gems').icon(Map)
              .child(S.documentList().title('Hidden Gems').filter('_type == "tour" && category == $category').params({ category: 'hidden-gems' })),
          ])
        ),

    ])
}
