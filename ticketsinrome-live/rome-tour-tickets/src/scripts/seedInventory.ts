
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';
import { addDays, format } from 'date-fns';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function seedInventory() {
    console.log("🚀 Seeding Inventory for next 90 days...");

    // 1. Get all tours
    const { data: tours, error: tourError } = await supabase
        .from('tours')
        .select('slug, base_price');

    if (tourError || !tours) {
        console.error("Failed to fetch tours:", tourError);
        return;
    }

    console.log(`Found ${tours.length} tours. Generating slots...`);

    const startDate = new Date();
    const inventoryPayload = [];

    // 2. Generate slots for each tour
    for (const tour of tours) {
        // Create slots for next 90 days
        for (let i = 0; i < 90; i++) {
            const date = addDays(startDate, i);
            const dateStr = format(date, 'yyyy-MM-dd');

            // Add standard times: 09:00, 10:00, 14:00
            const times = ['09:00', '10:00', '14:00'];

            for (const time of times) {
                inventoryPayload.push({
                    tour_slug: tour.slug,
                    date: dateStr,
                    time: time,
                    available_slots: 20, // Default capacity
                    price_override: null // Use base price
                });
            }
        }
    }

    console.log(`Preparing to insert ${inventoryPayload.length} slots...`);

    // 3. Batch Insert (Upsert)
    // Supabase limits batch size, let's do chunks of 1000
    const chunkSize = 1000;
    for (let i = 0; i < inventoryPayload.length; i += chunkSize) {
        const chunk = inventoryPayload.slice(i, i + chunkSize);
        const { error } = await supabase
            .from('inventory')
            .upsert(chunk, { onConflict: 'tour_slug,date,time' });

        if (error) {
            console.error("Chunk insert error:", error.message);
        } else {
            console.log(`Inserted chunk ${i / chunkSize + 1}`);
        }
    }

    console.log("🎉 Inventory Seed Complete!");
}

seedInventory();
