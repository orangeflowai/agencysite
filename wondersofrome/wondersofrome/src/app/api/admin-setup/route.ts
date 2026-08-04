export const dynamic = 'force-dynamic';
import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Admin user setup — creates or updates the admin account.
 * REQUIRES: caller to already have an active admin Supabase session
 * (enforced by middleware). No hardcoded credentials.
 */
export async function POST(request: NextRequest) {
    // Middleware already verified admin session — extract user from cookie
    const cookieHeader = request.headers.get('cookie') || '';
    const tokenMatch = cookieHeader.match(/wonders-auth-token=([^;]+)/);
    const accessToken = tokenMatch ? tokenMatch[1] : '';

    if (!accessToken) {
        return NextResponse.json({ error: 'Unauthorized — no session' }, { status: 401 });
    }

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get: (name: string) => name === 'wonders-auth-token' ? accessToken : undefined,
                set: () => {},
                remove: () => {},
            },
        }
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser(accessToken);

    if (userError || !user) {
        return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    if (user.user_metadata?.role !== 'admin') {
        return NextResponse.json({ error: 'Admin role required' }, { status: 403 });
    }

    // Create or update admin user via service_role (runs on server, not via anon key)
    const adminClient = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    try {
        const body = await request.json().catch(() => ({}));
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json({ error: 'email and password required' }, { status: 400 });
        }

        if (password.length < 12) {
            return NextResponse.json({ error: 'Password must be at least 12 characters' }, { status: 400 });
        }

        // Check if user exists
        const { data: { users }, error: listError } = await adminClient.auth.admin.listUsers();
        if (listError) {
            return NextResponse.json({ error: listError.message }, { status: 500 });
        }

        const existingUser = users.find(u => u.email === email);

        if (existingUser) {
            const { error } = await adminClient.auth.admin.updateUserById(existingUser.id, {
                password,
                user_metadata: { role: 'admin' },
            });
            if (error) return NextResponse.json({ error: error.message }, { status: 500 });
            return NextResponse.json({ message: 'Admin user updated', email });
        } else {
            const { error } = await adminClient.auth.admin.createUser({
                email,
                password,
                email_confirm: true,
                user_metadata: { role: 'admin' },
            });
            if (error) return NextResponse.json({ error: error.message }, { status: 500 });
            return NextResponse.json({ message: 'Admin user created', email });
        }
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
