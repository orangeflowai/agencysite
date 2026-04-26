import { defineField, defineType } from 'sanity'
import { Package } from 'lucide-react'

export const addonType = defineType({
    name: 'addon',
    title: 'Add-on',
    type: 'document',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    icon: Package as any,
    fields: [
        defineField({
            name: 'name',
            title: 'Name',
            type: 'string',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'id',
            title: 'Unique ID (Slug)',
            type: 'slug',
            options: {
                source: 'name',
                maxLength: 96,
            },
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'description',
            title: 'Short Description',
            type: 'text',
            rows: 2,
            validation: (rule) => rule.required().max(150),
        }),
        defineField({
            name: 'longDescription',
            title: 'Long Description',
            type: 'text',
            rows: 4,
        }),
        defineField({
            name: 'price',
            title: 'Price (€)',
            type: 'number',
            validation: (rule) => rule.required().min(0),
        }),
        defineField({
            name: 'pricingType',
            title: 'Pricing Type',
            type: 'string',
            options: {
                list: [
                    { title: 'Per Person', value: 'perPerson' },
                    { title: 'Per Booking', value: 'perBooking' },
                    { title: 'Per Hour', value: 'perHour' },
                ],
            },
            initialValue: 'perBooking',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'minHours',
            title: 'Min Hours (for Per Hour)',
            type: 'number',
            hidden: ({ parent }) => parent?.pricingType !== 'perHour',
        }),
        defineField({
            name: 'maxHours',
            title: 'Max Hours (for Per Hour)',
            type: 'number',
            hidden: ({ parent }) => parent?.pricingType !== 'perHour',
        }),
        defineField({
            name: 'icon',
            title: 'Icon Name',
            type: 'string',
            description: 'Lucide icon name (e.g., Sparkles, MapPin, Briefcase)',
        }),
        defineField({
            name: 'category',
            title: 'Category',
            type: 'string',
            options: {
                list: [
                    { title: 'Transportation', value: 'transport' },
                    { title: 'Services', value: 'services' },
                    { title: 'Food & Drink', value: 'food' },
                    { title: 'Experience', value: 'experience' },
                    { title: 'Insurance', value: 'insurance' },
                ],
            },
        }),
        defineField({
            name: 'popular',
            title: 'Mark as Popular',
            type: 'boolean',
            initialValue: false,
        }),
        defineField({
            name: 'available',
            title: 'Available',
            type: 'boolean',
            initialValue: true,
        }),
        defineField({
            name: 'sortOrder',
            title: 'Sort Order',
            type: 'number',
            initialValue: 0,
        }),
        defineField({
            name: 'sites',
            title: 'Websites',
            type: 'array',
            of: [{ type: 'reference', to: [{ type: 'site' }] }],
        }),
    ],
})
