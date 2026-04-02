
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const { data, error } = await supabase
            .from('inventory')
            .select('id')
            .limit(1);

        if (error) {
            return NextResponse.json({ connected: false, error: error.message });
        }

        return NextResponse.json({ connected: true, timestamp: new Date().toISOString() });
    } catch (err: any) {
        return NextResponse.json({ connected: false, error: err.message });
    }
}
