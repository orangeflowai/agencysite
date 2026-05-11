import { defineField, defineType } from 'sanity'
import { Map, Calendar, List, Info, Tag } from 'lucide-react'

const tourType = defineType({
    name: 'tour',
    title: 'Tour',
    type: 'document',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    icon: Map as any,
    groups: [
        { name: 'details', title: 'Details', icon: Info as any },
        { name: 'content', title: 'Content', icon: List as any },
        { name: 'logistics', title: 'Logistics', icon: Calendar as any },
        { name: 'seo', title: 'SEO', icon: Tag as any },
    ],
    fields: [
        defineField({
            name: 'sites',
            title: 'Websites (Select one or more)',
            type: 'array',
            of: [{
                type: 'reference',
                to: [{ type: 'site' }],
                options: {
                    filter: 'isActive == true'
                }
            }],
            group: 'details',
            validation: (rule) => rule.required().min(1),
            description: 'Which websites should display this tour? Select one or both sites.',
        }),
        defineField({
            name: 'title',
            title: 'Tour Title',
            type: 'string',
            group: 'details',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'slug',
            title: 'Slug (URL)',
            type: 'slug',
            options: {
                source: 'title',
                maxLength: 96,
            },
            group: 'details',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'mainImage',
            title: 'Main Image',
            type: 'image',
            options: { hotspot: true },
            group: 'details',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'gallery',
            title: 'Image Gallery',
            type: 'array',
            of: [{ type: 'image', options: { hotspot: true } }],
            group: 'details',
        }),
        defineField({
            name: 'price',
            title: 'Base Price (€)',
            type: 'number',
            group: 'details',
            validation: (rule) => rule.required().min(0),
        }),
        defineField({
            name: 'guestTypes',
            title: 'Guest Types & Pricing',
            type: 'array',
            group: 'details',
            of: [{
                type: 'object',
                fields: [
                    { name: 'name', type: 'string', title: 'Category Name', validation: rule => rule.required() },
                    { name: 'price', type: 'number', title: 'Price (€)', validation: rule => rule.required().min(0) },
                    { name: 'description', type: 'string', title: 'Help Text (e.g. "Age 65+")' },
                ],
                preview: {
                    select: {
                        name: 'name',
                        price: 'price',
                    },
                    prepare({ name, price }) {
                        return {
                            title: `${name}: €${price}`,
                        }
                    }
                }
            }],
            description: 'Define participant categories and their specific prices. If empty, the base price will be used for Adults.',
        }),
        defineField({
            name: 'duration',
            title: 'Duration (e.g., "2.5 hours")',
            type: 'string',
            group: 'details',
        }),
        defineField({
            name: 'category',
            title: 'Category',
            type: 'string',
            group: 'details',
            options: {
                list: [
                    { title: 'Colosseum Tours', value: 'colosseum' },
                    { title: 'Vatican Tours', value: 'vatican' },
                    { title: 'City Tours', value: 'city' },
                    { title: 'Italy Hidden Gems', value: 'hidden-gems' },
                ],
            },
        }),
        defineField({
            name: 'tourType',
            title: 'Tour Type',
            type: 'string',
            group: 'details',
            options: {
                list: [
                    { title: 'Guided Tour', value: 'Guided Tour' },
                    { title: 'Private Tour', value: 'Private' },
                    { title: 'Skip-the-Line', value: 'Skip-the-Line' },
                    { title: 'Golf Cart', value: 'Golf Cart' },
                    { title: 'Food Tour', value: 'Food Tour' },
                    { title: 'Day Trip', value: 'Day Trip' },
                ]
            }
        }),
        defineField({
            name: 'badge',
            title: 'Product Badge',
            type: 'string',
            group: 'details',
            options: {
                list: [
                    { title: 'Bestseller', value: 'Bestseller' },
                    { title: 'Likely to Sell Out', value: 'Likely to Sell Out' },
                    { title: 'Skip the Line', value: 'Skip the Line' },
                ]
            },
            description: 'Optional badge to display on the tour card',
        }),
        defineField({
            name: 'rating',
            title: 'Rating (0-5)',
            type: 'number',
            group: 'details',
            validation: (rule) => rule.min(0).max(5),
            description: 'Rating out of 5 (e.g. 4.8)',
        }),
        defineField({
            name: 'reviewCount',
            title: 'Review Count',
            type: 'number',
            group: 'details',
        }),

        // Content Fields
        defineField({
            name: 'description',
            title: 'Full Description',
            type: 'array',
            group: 'content',
            of: [
                { type: 'block' },
                {
                    type: 'image',
                    options: { hotspot: true },
                    fields: [
                        { name: 'alt', type: 'string', title: 'Alternative Text' }
                    ]
                }
            ]
        }),
        defineField({
            name: 'highlights',
            title: 'Highlights',
            type: 'array',
            group: 'content',
            of: [{ type: 'string' }],
        }),
        defineField({
            name: 'includes',
            title: 'What\'s Included',
            type: 'array',
            group: 'content',
            of: [{ type: 'string' }],
        }),
        defineField({
            name: 'excludes',
            title: 'What\'s Not Included',
            type: 'array',
            group: 'content',
            of: [{ type: 'string' }],
        }),
        defineField({
            name: 'faqs',
            title: 'FAQs',
            type: 'array',
            group: 'content',
            of: [{
                type: 'object',
                fields: [
                    { name: 'question', type: 'string', title: 'Question' },
                    { name: 'answer', type: 'text', title: 'Answer' },
                ]
            }]
        }),
        defineField({
            name: 'itinerary',
            title: 'Itinerary',
            type: 'array',
            group: 'content',
            of: [{
                type: 'object',
                fields: [
                    { name: 'title', type: 'string', title: 'Title' },
                    { name: 'description', type: 'text', title: 'Description' },
                    { name: 'duration', type: 'string', title: 'Duration' }
                ]
            }]
        }),

        // Logistics Fields
        defineField({
            name: 'meetingPoint',
            title: 'Meeting Point',
            type: 'text',
            group: 'logistics',
        }),
        defineField({
            name: 'mapAddress',
            title: 'Exact Map Address / link',
            type: 'string',
            group: 'logistics',
            description: 'The precise address or Google Maps URL strictly for the "View on Map" links (e.g. "Piazza Navona, 00186 Roma RM, Italy"). Overrides auto-extracting from Meeting Point.'
        }),
        defineField({
            name: 'importantInfo',
            title: 'Important Information',
            type: 'array',
            group: 'logistics',
            of: [{ type: 'string' }],
            description: 'Dress code, ID requirements, etc.'
        }),
        defineField({
            name: 'groupSize',
            title: 'Group Size',
            type: 'string',
            group: 'logistics',
        }),
        defineField({
            name: 'maxParticipants',
            title: 'Max Participants (per booking)',
            type: 'number',
            group: 'logistics',
            validation: (rule) => rule.min(1).warning('Must be at least 1'),
            description: 'Caps the number of participants selectable in checkout',
        }),
        defineField({
            name: 'location',
            title: 'Location',
            type: 'string',
            group: 'logistics',
        }),
        defineField({
            name: 'tags',
            title: 'Marketing Tags',
            type: 'array',
            group: 'logistics',
            description: 'Tags like "Featured", "10% OFF", "Selling Fast"',
            of: [{ type: 'string' }],
        }),

        // SEO Fields
        defineField({
            name: 'seoTitle',
            title: 'SEO Title',
            type: 'string',
            group: 'seo',
            validation: (rule) => rule.max(60).warning('Should be under 60 characters'),
        }),
        defineField({
            name: 'seoDescription',
            title: 'SEO Description',
            type: 'text',
            rows: 3,
            group: 'seo',
            validation: (rule) => rule.max(160).warning('Should be under 160 characters'),
        }),
        defineField({
            name: 'keywords',
            title: 'Keywords',
            type: 'array',
            group: 'seo',
            of: [{ type: 'string' }],
        }),

        // Translations
        defineField({
            name: 'translations',
            title: 'Translations',
            type: 'object',
            group: 'content',
            description: 'Add translations for this tour in different languages',
            fields: [
                {
                    name: 'it',
                    title: 'Italian (Italiano)',
                    type: 'object',
                    fields: [
                        { name: 'title', title: 'Tour Title', type: 'string' },
                        { name: 'description', title: 'Description', type: 'array', of: [{ type: 'block' }] },
                        { name: 'highlights', title: 'Highlights', type: 'array', of: [{ type: 'string' }] },
                        { name: 'includes', title: 'What\'s Included', type: 'array', of: [{ type: 'string' }] },
                        { name: 'excludes', title: 'What\'s Not Included', type: 'array', of: [{ type: 'string' }] },
                        { name: 'meetingPoint', title: 'Meeting Point', type: 'text' },
                        { name: 'importantInfo', title: 'Important Information', type: 'array', of: [{ type: 'string' }] },
                        { name: 'seoTitle', title: 'SEO Title', type: 'string' },
                        { name: 'seoDescription', title: 'SEO Description', type: 'text', rows: 2 },
                    ]
                },
                {
                    name: 'es',
                    title: 'Spanish (Español)',
                    type: 'object',
                    fields: [
                        { name: 'title', title: 'Tour Title', type: 'string' },
                        { name: 'description', title: 'Description', type: 'array', of: [{ type: 'block' }] },
                        { name: 'highlights', title: 'Highlights', type: 'array', of: [{ type: 'string' }] },
                        { name: 'includes', title: 'What\'s Included', type: 'array', of: [{ type: 'string' }] },
                        { name: 'excludes', title: 'What\'s Not Included', type: 'array', of: [{ type: 'string' }] },
                        { name: 'meetingPoint', title: 'Meeting Point', type: 'text' },
                        { name: 'importantInfo', title: 'Important Information', type: 'array', of: [{ type: 'string' }] },
                        { name: 'seoTitle', title: 'SEO Title', type: 'string' },
                        { name: 'seoDescription', title: 'SEO Description', type: 'text', rows: 2 },
                    ]
                },
                {
                    name: 'fr',
                    title: 'French (Français)',
                    type: 'object',
                    fields: [
                        { name: 'title', title: 'Tour Title', type: 'string' },
                        { name: 'description', title: 'Description', type: 'array', of: [{ type: 'block' }] },
                        { name: 'highlights', title: 'Highlights', type: 'array', of: [{ type: 'string' }] },
                        { name: 'includes', title: 'What\'s Included', type: 'array', of: [{ type: 'string' }] },
                        { name: 'excludes', title: 'What\'s Not Included', type: 'array', of: [{ type: 'string' }] },
                        { name: 'meetingPoint', title: 'Meeting Point', type: 'text' },
                        { name: 'importantInfo', title: 'Important Information', type: 'array', of: [{ type: 'string' }] },
                        { name: 'seoTitle', title: 'SEO Title', type: 'string' },
                        { name: 'seoDescription', title: 'SEO Description', type: 'text', rows: 2 },
                    ]
                },
                {
                    name: 'de',
                    title: 'German (Deutsch)',
                    type: 'object',
                    fields: [
                        { name: 'title', title: 'Tour Title', type: 'string' },
                        { name: 'description', title: 'Description', type: 'array', of: [{ type: 'block' }] },
                        { name: 'highlights', title: 'Highlights', type: 'array', of: [{ type: 'string' }] },
                        { name: 'includes', title: 'What\'s Included', type: 'array', of: [{ type: 'string' }] },
                        { name: 'excludes', title: 'What\'s Not Included', type: 'array', of: [{ type: 'string' }] },
                        { name: 'meetingPoint', title: 'Meeting Point', type: 'text' },
                        { name: 'importantInfo', title: 'Important Information', type: 'array', of: [{ type: 'string' }] },
                        { name: 'seoTitle', title: 'SEO Title', type: 'string' },
                        { name: 'seoDescription', title: 'SEO Description', type: 'text', rows: 2 },
                    ]
                },
            ]
        }),
    ],
    preview: {
        select: {
            title: 'title',
            sites: 'sites',
            media: 'mainImage',
        },
        prepare({ title, sites, media }) {
            const siteNames = sites?.map((s: any) => s.title).join(', ') || 'No site assigned';
            return {
                title: title,
                subtitle: `Sites: ${siteNames}`,
                media: media,
            }
        }
    }
})

export { tourType }
