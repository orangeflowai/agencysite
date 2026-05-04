import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { tours } from '@/lib/toursData';
import { addDays, format } from 'date-fns';

// Create Admin Client with Service Role Key
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
    try {
        console.log('Starting inventory seeding...');
        const today = new Date();
        const daysToSeed = 90; // 3 months
        const timeSlots = ['09:00', '10:00', '11:00', '14:00', '15:00'];

        let totalInserted = 0;

        for (const tour of tours) {
            console.log(`Seeding: ${tour.title} (${tour.slug})`);
            const rows = [];

            for (let i = 0; i < daysToSeed; i++) {
                const date = addDays(today, i);
                const dateStr = format(date, 'yyyy-MM-dd');

                // Skip random days to stimulate "sold out" or "no availability" (e.g., 5% chance)
                if (Math.random() < 0.05) continue;

                for (const time of timeSlots) {
                    // Random availability logic
                    // 10% Sold Out (0 slots)
                    // 15% Low Availability (< 10 slots)
                    // 75% High Availability (20+ slots)
                    const rand = Math.random();
                    let slots = 20;
                    if (rand < 0.10) slots = 0;
                    else if (rand < 0.25) slots = Math.floor(Math.random() * 9) + 1; // 1-9
                    else slots = Math.floor(Math.random() * 20) + 10; // 10-29

                    rows.push({
                        tour_slug: tour.slug,
                        date: dateStr,
                        time: time,
                        available_slots: slots,
                        price_override: tour.price // Use base price
                    });
                }
            }

            // Batch insert for this tour
            const { error } = await supabaseAdmin
                .from('inventory')
                .upsert(rows, { onConflict: 'tour_slug, date, time' });

            if (error) {
                console.error(`Error seeding ${tour.slug}:`, error);
            } else {
                totalInserted += rows.length;
            }
        }

        return NextResponse.json({
            success: true,
            message: `Seeded inventory for ${tours.length} tours.`,
            totalSlots: totalInserted
        });

    } catch (error: any) {
        console.error('Seed Inventory Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
