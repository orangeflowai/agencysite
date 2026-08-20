
import { NextResponse, type NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { isAdmin } from '@/lib/adminAuth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    if (!isAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    try {
        const { data, error, count } = await supabase
            .from('tours')
            .select('*', { count: 'exact' });

        if (error) {
            return NextResponse.json({ error: error.message });
        }

        return NextResponse.json({
            count: count || 0,
            tours: data?.map(t => ({ slug: t.slug, title: t.title, price: t.price ?? t.base_price })) || []
        });
    } catch (err: any) {
        return NextResponse.json({ error: err.message });
    }
}
