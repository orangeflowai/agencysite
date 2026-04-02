
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const { data, error, count } = await supabase
            .from('tours')
            .select('*', { count: 'exact' });

        if (error) {
            return NextResponse.json({ error: error.message });
        }

        return NextResponse.json({
            count: count || 0,
            tours: data?.map(t => ({ slug: t.slug, title: t.title, base_price: t.base_price })) || []
        });
    } catch (err: any) {
        return NextResponse.json({ error: err.message });
    }
}
