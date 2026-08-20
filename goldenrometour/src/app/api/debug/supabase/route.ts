
import { NextResponse, type NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { isAdmin } from '@/lib/adminAuth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    if (!isAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
