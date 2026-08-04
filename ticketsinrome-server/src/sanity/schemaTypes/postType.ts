
import { defineField, defineType } from 'sanity'

export const postType = defineType({
    name: 'post',
    title: 'Blog Post',
    type: 'document',
    fields: [
        defineField({
            name: 'site',
            title: 'Website',
            type: 'reference',
            to: [{ type: 'site' }],
            validation: (rule) => rule.required(),
            description: 'Which website this post belongs to',
        }),
        defineField({
            name: 'title',
            type: 'string',
        }),
        defineField({
            name: 'slug',
            type: 'slug',
            options: {
                source: 'title',
            },
        }),
        defineField({
            name: 'mainImage',
            type: 'image',
            options: {
                hotspot: true,
            },
            fields: [
                defineField({
                    name: 'alt',
                    type: 'string',
                    title: 'Alternative text',
                })
            ]
        }),
        defineField({
            name: 'publishedAt',
            type: 'datetime',
        }),
        defineField({
            name: 'excerpt',
            type: 'text',
            title: 'Excerpt',
            description: 'Short summary for the blog card (150-200 chars)',
            rows: 3
        }),
        defineField({
            name: 'body',
            type: 'array',
            of: [{ type: 'block' }, { type: 'image' }],
        }),
        defineField({
            name: 'keywords',
            type: 'array',
            title: 'SEO Keywords',
            of: [{ type: 'string' }],
            options: {
                layout: 'tags'
            }
        })
    ],
    preview: {
        select: {
            title: 'title',
            media: 'mainImage',
        },
    },
})
