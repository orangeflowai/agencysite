import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export function createClient() {
    return createSupabaseClient(
    )
}
