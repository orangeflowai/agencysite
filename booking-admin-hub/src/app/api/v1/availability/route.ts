import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { validateApiKey } from '@/utils/auth';

export async function GET(request: Request) {
    const authError = await validateApiKey();
    if (authError) return authError;

    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const date = searchParams.get('date');
    const mode = searchParams.get('mode'); // 'day' (default) or 'month'

    if (!slug) {
        return NextResponse.json({ error: 'Missing slug' }, { status: 400 });
    }

    try {
        // Fetch Base Price from Tours table (Unified Pricing)
        const { data: tourData } = await supabase
            .from('tours')
            .select('base_price')
            .eq('slug', slug)
            .single();

        const basePrice = tourData?.base_price || 0;

        // Mode: Month View (for Calendar)
        if (mode === 'month' && date) {
            // date format: YYYY-MM
            const [year, month] = date.split('-').map(Number);
            const startDate = `${date}-01`;
            // Get last day of month correctly
            const lastDay = new Date(year, month, 0).getDate();
            const endDate = `${date}-${lastDay}`;

            const { data, error } = await supabase
                .from('inventory')
                .select('date, available_slots, price_override')
                .eq('tour_slug', slug)
                .gte('date', startDate)
                .lte('date', endDate);

            if (error) throw error;

            // Group by date
            const availabilityMap: Record<string, { spots: number, price?: number }> = {};
            data?.forEach((row: any) => {
                const current = availabilityMap[row.date] || { spots: 0 };
                current.spots += row.available_slots;
                // Use override if exists, otherwise base price
                current.price = row.price_override || basePrice;
                availabilityMap[row.date] = current;
            });

            return NextResponse.json(availabilityMap);
        }

        // Mode: Day View (Specific Slots)
        if (!date) return NextResponse.json({ error: 'Missing date for day view' }, { status: 400 });

        const { data, error } = await supabase
            .from('inventory')
            .select('time, available_slots, price_override')
            .eq('tour_slug', slug)
            .eq('date', date)
            .gt('available_slots', 0)
            .order('time');

        if (error) throw error;

        // Add base price to slots if missing override
        const slots = data?.map((slot: any) => ({
            ...slot,
            price: slot.price_override || basePrice
        })) || [];

        return NextResponse.json({ slots });

    } catch (err: any) {
        console.error('Availability check failed:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
