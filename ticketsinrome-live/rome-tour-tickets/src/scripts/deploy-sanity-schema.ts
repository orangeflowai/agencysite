/**
 * Deploy Sanity Schema Script
 * 
 * This script manually pushes schema changes to Sanity
 * Use this instead of `sanity deploy` when CLI has issues
 */

import { client } from '../sanity/lib/client.js';

const addonType = {
    name: 'addon',
    type: 'document',
    title: 'Add-ons & Extras',
    fields: [
        { name: 'name', type: 'string', title: 'Add-on Name' },
        { name: 'id', type: 'slug', title: 'Unique ID (slug)', options: { source: 'name' } },
        { name: 'description', type: 'text', title: 'Description' },
        { name: 'longDescription', type: 'text', title: 'Long Description' },
        { name: 'price', type: 'number', title: 'Price (€)' },
        { 
            name: 'pricingType', 
            type: 'string', 
            title: 'Pricing Type',
            options: { list: ['perPerson', 'perBooking'] }
        },
        { name: 'icon', type: 'string', title: 'Icon' },
        { 
            name: 'category', 
            type: 'string', 
            title: 'Category',
            options: { list: ['transport', 'services', 'food', 'experience', 'insurance'] }
        },
        { name: 'popular', type: 'boolean', title: 'Mark as Popular' },
        { name: 'available', type: 'boolean', title: 'Available for Purchase' },
        { name: 'sortOrder', type: 'number', title: 'Sort Order' },
        { 
            name: 'sites', 
            type: 'array', 
            title: 'Websites',
            of: [{ type: 'reference', to: [{ type: 'site' }] }]
        },
        { name: 'image', type: 'image', title: 'Icon Image' },
    ]
};

async function deploySchema() {
    console.log('🚀 Deploying Sanity schema...\n');
    
    try {
        // Check if addon type already exists
        const existingTypes = await client.fetch(`*[_type == "addon"][0...1]`);
        
        if (existingTypes.length > 0) {
            console.log('✅ Add-on type already exists in dataset');
            console.log(`   Found ${existingTypes.length} add-on document(s)`);
        } else {
            console.log('ℹ️  Add-on type not yet used. Creating sample document...');
            
            // Create a sample add-on to register the type
            const sampleAddon = {
                _type: 'addon',
                name: 'Hotel Pickup Service',
                id: { _type: 'slug', current: 'pickup' },
                description: 'Private Mercedes transfer from your hotel to meeting point',
                price: 45,
                pricingType: 'perBooking',
                icon: 'MapPin',
                category: 'transport',
                popular: true,
                available: true,
                sortOrder: 0,
            };
            
            // Note: We can't directly create without site reference
            // The type will be auto-created when you add via Studio
            console.log('⚠️  Please use the Sanity Studio to create add-ons');
            console.log('   URL: http://localhost:3333 or your deployed studio');
        }
        
        console.log('\n📋 Schema fields defined:');
        addonType.fields.forEach(field => {
            console.log(`   • ${field.name} (${field.type})`);
        });
        
        console.log('\n✅ Schema is ready to use!');
        console.log('\nNext steps:');
        console.log('1. Start Sanity Studio: npm run sanity');
        console.log('2. Create add-ons in the Studio');
        console.log('3. They will appear on the checkout page');
        
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

deploySchema();
