import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

// GET — list all auth users
export async function GET() {
    try {
        const admin = getSupabaseAdmin();
        const { data, error } = await admin.auth.admin.listUsers();
        if (error) throw error;
        return NextResponse.json({ users: data.users });
    } catch (e: any) {
        console.error('[admin/users GET]', e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

// POST — invite a new user
export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();
        if (!email) return NextResponse.json({ error: 'email required' }, { status: 400 });

        const admin = getSupabaseAdmin();
        const { data, error } = await admin.auth.admin.inviteUserByEmail(email);
        if (error) throw error;
        return NextResponse.json({ user: data.user });
    } catch (e: any) {
        console.error('[admin/users POST]', e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

// DELETE — remove a user
export async function DELETE(req: NextRequest) {
    try {
        const { userId } = await req.json();
        if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });

        const admin = getSupabaseAdmin();
        const { error } = await admin.auth.admin.deleteUser(userId);
        if (error) throw error;
        return NextResponse.json({ ok: true });
    } catch (e: any) {
        console.error('[admin/users DELETE]', e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
