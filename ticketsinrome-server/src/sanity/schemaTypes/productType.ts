import { defineField, defineType } from 'sanity'
import { ShoppingBag } from 'lucide-react'

export const productType = defineType({
    name: 'product',
    title: 'Shop Product',
    type: 'document',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    icon: ShoppingBag as any,
    groups: [
        { name: 'details', title: 'Details' },
        { name: 'pricing', title: 'Pricing & Stock' },
        { name: 'variants', title: 'Variants' },
    ],
    fields: [
        defineField({
            name: 'name',
            title: 'Product Name',
            type: 'string',
            group: 'details',
            validation: r => r.required(),
        }),
        defineField({
            name: 'slug',
            title: 'Slug (App ID)',
            type: 'slug',
            options: { source: 'name', maxLength: 96 },
            group: 'details',
            validation: r => r.required(),
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
            rows: 3,
            group: 'details',
        }),
        defineField({
            name: 'category',
            title: 'Category',
            type: 'string',
            group: 'details',
            options: {
                list: [
                    { title: 'Souvenir', value: 'souvenir' },
                    { title: 'Book / Guide', value: 'book' },
                    { title: 'Food & Drink', value: 'food' },
                    { title: 'Apparel', value: 'apparel' },
                    { title: 'Other', value: 'other' },
                ],
            },
            initialValue: 'souvenir',
        }),
        defineField({
            name: 'images',
            title: 'Product Images',
            type: 'array',
            of: [{ type: 'image', options: { hotspot: true } }],
            group: 'details',
            validation: r => r.required().min(1),
        }),
        defineField({
            name: 'price',
            title: 'Price (€)',
            type: 'number',
            group: 'pricing',
            validation: r => r.required().min(0),
        }),
        defineField({
            name: 'inStock',
            title: 'In Stock',
            type: 'boolean',
            group: 'pricing',
            initialValue: true,
        }),
        defineField({
            name: 'stockCount',
            title: 'Stock Count',
            type: 'number',
            group: 'pricing',
            description: 'Leave empty for unlimited',
        }),
        defineField({
            name: 'weight',
            title: 'Weight (grams)',
            type: 'number',
            group: 'pricing',
            description: 'Used for shipping calculation',
        }),
        defineField({
            name: 'variants',
            title: 'Variants (size, colour, etc.)',
            type: 'array',
            group: 'variants',
            of: [{
                type: 'object',
                fields: [
                    { name: 'id', type: 'string', title: 'Variant ID (e.g. "red-m")' },
                    { name: 'label', type: 'string', title: 'Label (e.g. "Red / M")' },
                    { name: 'price', type: 'number', title: 'Price override (€) — leave empty to use base price' },
                    { name: 'inStock', type: 'boolean', title: 'In Stock', initialValue: true },
                ],
                preview: { select: { title: 'label', subtitle: 'price' } }
            }],
        }),
    ],
    preview: {
        select: { title: 'name', subtitle: 'price', media: 'images.0' },
        prepare({ title, subtitle, media }) {
            return { title, subtitle: subtitle != null ? `€${subtitle}` : '', media }
        }
    }
})
