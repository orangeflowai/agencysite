import { defineField, defineType } from 'sanity'
import { Headphones } from 'lucide-react'

const audioTrackFields = [
    defineField({ name: 'audioQuick', title: 'Quick (~2 min)', type: 'object', fields: [
        defineField({ name: 'url', title: 'Audio URL (.m4a / .mp3)', type: 'url' }),
        defineField({ name: 'duration', title: 'Duration (seconds)', type: 'number' }),
        defineField({ name: 'size', title: 'File size (bytes)', type: 'number' }),
    ]}),
    defineField({ name: 'audioDeep', title: 'Deep (~10 min)', type: 'object', fields: [
        defineField({ name: 'url', title: 'Audio URL (.m4a / .mp3)', type: 'url' }),
        defineField({ name: 'duration', title: 'Duration (seconds)', type: 'number' }),
        defineField({ name: 'size', title: 'File size (bytes)', type: 'number' }),
    ]}),
    defineField({ name: 'audioKids', title: 'Kids (myths)', type: 'object', fields: [
        defineField({ name: 'url', title: 'Audio URL (.m4a / .mp3)', type: 'url' }),
        defineField({ name: 'duration', title: 'Duration (seconds)', type: 'number' }),
        defineField({ name: 'size', title: 'File size (bytes)', type: 'number' }),
    ]}),
]

const LANGUAGES = [
    { code: 'en', title: '🇬🇧 English' },
    { code: 'it', title: '🇮🇹 Italian' },
    { code: 'es', title: '🇪🇸 Spanish' },
    { code: 'fr', title: '🇫🇷 French' },
    { code: 'de', title: '🇩🇪 German' },
    { code: 'zh', title: '🇨🇳 Mandarin' },
    { code: 'ja', title: '🇯🇵 Japanese' },
    { code: 'pt', title: '🇧🇷 Portuguese' },
    { code: 'pl', title: '🇵🇱 Polish' },
    { code: 'ru', title: '🇷🇺 Russian' },
    { code: 'ar', title: '🇸🇦 Arabic' },
    { code: 'ko', title: '🇰🇷 Korean' },
]

export const sightType = defineType({
    name: 'sight',
    title: 'Audio Guide Sight',
    type: 'document',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    icon: Headphones as any,
    groups: [
        { name: 'content',  title: 'Content' },
        { name: 'location', title: 'Location & GPS' },
        { name: 'audio',    title: 'Audio Files' },
        { name: 'agency',   title: 'Agency Tips' },
    ],
    fields: [
        // ── Content ──────────────────────────────────────────────────────────
        defineField({
            name: 'name',
            title: 'Name (English)',
            type: 'string',
            group: 'content',
            validation: r => r.required(),
        }),
        defineField({
            name: 'name_it',
            title: 'Name (Italian)',
            type: 'string',
            group: 'content',
        }),
        defineField({
            name: 'slug',
            title: 'Slug (App ID)',
            type: 'slug',
            options: { source: 'name', maxLength: 96 },
            group: 'content',
            validation: r => r.required(),
            description: 'Unique ID used in the app — e.g. "colosseum"',
        }),
        defineField({
            name: 'category',
            title: 'Category',
            type: 'string',
            group: 'content',
            options: {
                list: [
                    { title: 'Ancient / Archaeological', value: 'ancient' },
                    { title: 'Religious', value: 'religious' },
                    { title: 'Museum', value: 'museum' },
                    { title: 'Piazza / Square', value: 'piazza' },
                    { title: 'Other', value: 'other' },
                ],
            },
            initialValue: 'other',
        }),
        defineField({
            name: 'pack',
            title: 'Download Pack',
            type: 'string',
            group: 'content',
            options: {
                list: [
                    { title: 'Essential (free, shown first)', value: 'essential' },
                    { title: 'Full (premium)', value: 'full' },
                ],
            },
            initialValue: 'full',
        }),
        defineField({
            name: 'thumbnail',
            title: 'Thumbnail Image',
            type: 'image',
            options: { hotspot: true },
            group: 'content',
            validation: r => r.required(),
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
            rows: 4,
            group: 'content',
            validation: r => r.required(),
        }),

        // ── Location & GPS ────────────────────────────────────────────────────
        defineField({
            name: 'lat',
            title: 'Latitude',
            type: 'number',
            group: 'location',
            validation: r => r.required().min(-90).max(90),
            description: 'e.g. 41.8902 for the Colosseum',
        }),
        defineField({
            name: 'lng',
            title: 'Longitude',
            type: 'number',
            group: 'location',
            validation: r => r.required().min(-180).max(180),
            description: 'e.g. 12.4922 for the Colosseum',
        }),
        defineField({
            name: 'radius',
            title: 'Geofence Radius (meters)',
            type: 'number',
            group: 'location',
            initialValue: 20,
            description: 'Audio auto-plays when user enters this radius.',
        }),

        // ── Audio Files — one object per language ─────────────────────────────
        ...LANGUAGES.map(lang =>
            defineField({
                name: `audio_${lang.code}`,
                title: `${lang.title} Audio`,
                type: 'object',
                group: 'audio',
                description: `Upload Quick, Deep, and Kids audio files in ${lang.title.replace(/^.+ /, '')}`,
                fields: audioTrackFields,
            })
        ),

        // ── Agency Tips ───────────────────────────────────────────────────────
        defineField({
            name: 'tips',
            title: 'Agency Secret Tips',
            type: 'array',
            group: 'agency',
            of: [{ type: 'string' }],
            description: 'Insider tips shown as text pop-ups near this sight',
        }),
        defineField({
            name: 'kidsMyth',
            title: 'Kids Story / Myth',
            type: 'text',
            rows: 3,
            group: 'agency',
        }),
        defineField({
            name: 'linkedTour',
            title: 'Linked Bookable Tour',
            type: 'reference',
            to: [{ type: 'tour' }],
            group: 'agency',
            description: 'Shows a "Book Now" button in the app.',
        }),
    ],
    preview: {
        select: { title: 'name', subtitle: 'category', media: 'thumbnail' },
        prepare({ title, subtitle, media }) {
            const cat = subtitle ? subtitle.charAt(0).toUpperCase() + subtitle.slice(1) : 'Sight'
            return { title, subtitle: cat, media }
        },
    },
})
