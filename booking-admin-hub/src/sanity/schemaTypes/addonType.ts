import { defineField, defineType } from 'sanity'
import { ShoppingBag, Star } from 'lucide-react'

export const addonType = defineType({
    name: 'addon',
    title: 'Add-ons & Extras',
    type: 'document',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    icon: ShoppingBag as any,
    groups: [
        { name: 'details', title: 'Details' },
        { name: 'display', title: 'Display' },
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
            description: 'Which websites should offer this add-on?',
        }),
        defineField({
            name: 'name',
            title: 'Add-on Name',
            type: 'string',
            group: 'details',
            validation: (rule) => rule.required(),
            description: 'e.g., "Hotel Pickup Service"',
        }),
        defineField({
            name: 'id',
            title: 'Unique ID (slug)',
            type: 'slug',
            options: { 
                source: 'name',
                maxLength: 50,
            },
            group: 'details',
            validation: (rule) => rule.required(),
            description: 'Unique identifier used in code (lowercase, no spaces)',
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
            rows: 2,
            group: 'details',
            validation: (rule) => rule.required().max(150),
            description: 'Short description shown to customers (max 150 chars)',
        }),
        defineField({
            name: 'longDescription',
            title: 'Long Description',
            type: 'text',
            rows: 4,
            group: 'details',
            description: 'Detailed description shown on hover or expanded view',
        }),
        defineField({
            name: 'price',
            title: 'Price (€)',
            type: 'number',
            group: 'details',
            validation: (rule) => rule.required().min(0),
            description: 'Price per person or per booking (specify in description)',
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
            group: 'details',
        }),
        defineField({
            name: 'minHours',
            title: 'Minimum Hours',
            type: 'number',
            initialValue: 1,
            group: 'details',
            hidden: ({ parent }) => parent?.pricingType !== 'perHour',
            validation: (rule) => rule.min(1).max(24),
        }),
        defineField({
            name: 'maxHours',
            title: 'Maximum Hours',
            type: 'number',
            initialValue: 12,
            group: 'details',
            hidden: ({ parent }) => parent?.pricingType !== 'perHour',
            validation: (rule) => rule.min(1).max(24),
        }),
        defineField({
            name: 'icon',
            title: 'Icon',
            type: 'string',
            options: {
                list: [
                    { title: '📍 Map/Pickup', value: 'MapPin' },
                    { title: '💼 Briefcase/Luggage', value: 'Briefcase' },
                    { title: '⭐ Star/VIP', value: 'Star' },
                    { title: '✨ Sparkles/Guide', value: 'Sparkles' },
                    { title: '🍽️ Utensils/Food', value: 'Utensils' },
                    { title: '📷 Camera/Photo', value: 'Camera' },
                    { title: '🛡️ Shield/Insurance', value: 'Shield' },
                    { title: '👤 User/Private', value: 'User' },
                    { title: '🎁 Gift/Kids', value: 'Gift' },
                    { title: '📶 WiFi', value: 'Wifi' },
                    { title: '🍷 Wine/Champagne', value: 'Wine' },
                ],
            },
            initialValue: 'Sparkles',
            group: 'display',
        }),
        defineField({
            name: 'image',
            title: 'Icon Image (optional)',
            type: 'image',
            options: { hotspot: true },
            group: 'display',
            description: 'Custom image instead of icon (optional)',
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
            initialValue: 'services',
            group: 'display',
        }),
        defineField({
            name: 'popular',
            title: 'Mark as Popular',
            type: 'boolean',
            initialValue: false,
            group: 'display',
            description: 'Show "Popular" badge on this add-on',
        }),
        defineField({
            name: 'available',
            title: 'Available for Purchase',
            type: 'boolean',
            initialValue: true,
            group: 'details',
            description: 'Toggle off to hide this add-on temporarily',
        }),
        defineField({
            name: 'sortOrder',
            title: 'Sort Order',
            type: 'number',
            initialValue: 0,
            group: 'display',
            description: 'Lower numbers appear first (0, 1, 2, etc.)',
        }),
    ],
    preview: {
        select: {
            title: 'name',
            price: 'price',
            available: 'available',
            sites: 'sites',
        },
        prepare({ title, price, available, sites }) {
            const siteNames = sites?.map((s: any) => s.title).join(', ') || 'No sites';
            return {
                title: `${title} €${price}`,
                subtitle: `${available ? '✓ Available' : '✗ Hidden'} | ${siteNames}`,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                media: Star as any,
            }
        },
    },
    orderings: [
        {
            title: 'Sort Order',
            name: 'sortOrder',
            by: [{ field: 'sortOrder', direction: 'asc' }],
        },
        {
            title: 'Price Low to High',
            name: 'priceAsc',
            by: [{ field: 'price', direction: 'asc' }],
        },
    ],
})
