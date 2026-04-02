import type { StructureResolver } from 'sanity/structure'
import { 
    Map, 
    FileText, 
    Settings, 
    Globe, 
    Filter,
    LayoutTemplate,
    Eye
} from 'lucide-react'

// Site-aware structure builder with visual site switcher
export const structure: StructureResolver = (S, context) => {
    
    return S.list()
        .title('Content Manager')
        .items([
            // === SITE SWITCHER DASHBOARD ===
            S.listItem()
                .title('🌐 Website Profiles')
                .icon(Globe)
                .child(
                    S.list()
                        .title('Select Website to Manage')
                        .items([
                            // Rome Tour Tickets Profile
                            S.listItem()
                                .title('🎟️ Rome Tour Tickets')
                                .icon(Eye)
                                .child(
                                    S.list()
                                        .title('Rome Tour Tickets Content')
                                        .items([
                                            S.divider(),
                                            S.listItem()
                                                .title('🎯 Tours (Rome Tour Tickets)')
                                                .icon(Map)
                                                .child(
                                                    S.documentList()
                                                        .title('Tours for Rome Tour Tickets')
                                                        .filter('_type == "tour" && $siteId in sites[]._ref')
                                                        .params({ siteId: 'rome-tour-tickets' })
                                                        .defaultOrdering([{ field: 'title', direction: 'asc' }])
                                                ),
                                            S.listItem()
                                                .title('📝 Blog Posts (Rome Tour Tickets)')
                                                .icon(FileText)
                                                .child(
                                                    S.documentList()
                                                        .title('Posts for Rome Tour Tickets')
                                                        .filter('_type == "post" && site._ref == $siteId')
                                                        .params({ siteId: 'rome-tour-tickets' })
                                                ),
                                            S.listItem()
                                                .title('⚙️ Settings (Rome Tour Tickets)')
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
                            
                            // Wonders of Rome Profile
                            S.listItem()
                                .title('✨ Wonders of Rome')
                                .icon(Eye)
                                .child(
                                    S.list()
                                        .title('Wonders of Rome Content')
                                        .items([
                                            S.divider(),
                                            S.listItem()
                                                .title('🎯 Tours (Wonders of Rome)')
                                                .icon(Map)
                                                .child(
                                                    S.documentList()
                                                        .title('Tours for Wonders of Rome')
                                                        .filter('_type == "tour" && $siteId in sites[]._ref')
                                                        .params({ siteId: 'wondersofrome' })
                                                        .defaultOrdering([{ field: 'title', direction: 'asc' }])
                                                ),
                                            S.listItem()
                                                .title('📝 Blog Posts (Wonders of Rome)')
                                                .icon(FileText)
                                                .child(
                                                    S.documentList()
                                                        .title('Posts for Wonders of Rome')
                                                        .filter('_type == "post" && site._ref == $siteId')
                                                        .params({ siteId: 'wondersofrome' })
                                                ),
                                            S.listItem()
                                                .title('⚙️ Settings (Wonders of Rome)')
                                                .icon(Settings)
                                                .child(
                                                    S.documentList()
                                                        .title('Settings for Wonders of Rome')
                                                        .filter('_type == "settings" && site._ref == $siteId')
                                                        .params({ siteId: 'wondersofrome' })
                                                ),
                                        ])
                                ),
                            
                            S.divider(),
                            
                            // Manage Sites
                            S.listItem()
                                .title('⚡ Manage Websites')
                                .icon(Settings)
                                .child(
                                    S.documentTypeList('site')
                                        .title('All Websites')
                                ),
                        ])
                ),
            
            S.divider(),
            
            // === ALL CONTENT (Admin View) ===
            S.listItem()
                .title('📁 All Content (Admin)')
                .icon(LayoutTemplate)
                .child(
                    S.list()
                        .title('All Content')
                        .items([
                            S.documentTypeListItem('tour')
                                .title('🎯 All Tours'),
                            S.documentTypeListItem('post')
                                .title('📝 All Blog Posts'),
                            S.documentTypeListItem('settings')
                                .title('⚙️ All Settings'),
                            S.documentTypeListItem('site')
                                .title('🌐 All Websites'),
                        ])
                ),
            
            S.divider(),
            
            // === QUICK FILTERS ===
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
