import { defineField, defineType } from 'sanity'

export const settingsType = defineType({
    name: 'settings',
    title: 'Site Settings',
    type: 'document',
    fields: [
        defineField({
            name: 'site',
            title: 'Website',
            type: 'reference',
            to: [{ type: 'site' }],
            validation: (rule) => rule.required(),
            description: 'Which website these settings apply to',
        }),
        defineField({
            name: 'heroTitle',
            title: 'Hero Title',
            type: 'string',
            description: 'Main heading on the homepage (e.g., THE ETERNAL CITY, UNLOCKED)',
        }),
        defineField({
            name: 'heroSubtitle',
            title: 'Hero Subtitle',
            type: 'string',
            description: 'Subtitle text below the main heading',
        }),
        defineField({
            name: 'heroVideo',
            title: 'Hero Video',
            type: 'file',
            options: {
                accept: 'video/mp4',
            },
            description: 'Upload an MP4 video for the background (max 10MB recommended)',
        }),
        defineField({
            name: 'heroImage',
            title: 'Hero Fallback Image',
            type: 'image',
            options: {
                hotspot: true,
            },
            description: 'Shown on mobile or if video fails to load',
        }),
    ],
})
