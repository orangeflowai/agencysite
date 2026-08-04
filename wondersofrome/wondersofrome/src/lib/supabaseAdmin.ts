import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Lazy singleton — only initialised when first called on the server.
// Never throws at module evaluation so client bundles that accidentally
// import this file don't crash.
let _adminClient: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
    if (_adminClient) return _adminClient;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceRoleKey) {
        throw new Error('Missing Supabase URL or Service Role Key');
    }

    _adminClient = createClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });

    return _adminClient;
}

// Backwards-compatible named export — throws clear error if misconfigured.
// On the server the getter runs fine; on the client this file should never
// be imported at all (and if it is, the lazy init won't fire until called).
export const supabaseAdmin = new Proxy({} as SupabaseClient, {
    get(_target, prop) {
        try {
            const client = getSupabaseAdmin();
            const value = client[prop as keyof SupabaseClient];
            // If the proxied value is a function, bind it to the client
            if (typeof value === 'function') {
                return (value as Function).bind(client);
            }
            return value;
        } catch (err: any) {
            throw new Error(`[supabaseAdmin] Failed to access "${String(prop)}": ${err.message}. Check NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY env vars.`);
        }
    },
});
