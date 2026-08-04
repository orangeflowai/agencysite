import 'server-only'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

/**
 * Validate admin session for API routes.
 * Returns the authenticated user if valid admin, or null if unauthorized.
 * Call this at the top of protected API route handlers.
 */
export async function requireAdmin(): Promise<{ authorized: boolean; userId?: string; errorResponse?: NextResponse }> {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set() {},
          remove() {},
        },
      }
    )

    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) {
      return {
        authorized: false,
        errorResponse: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
      }
    }

    // Check for admin role. app_metadata is checked first because it can only
    // be set server-side with the service role key. user_metadata is settable
    // by the user during signup and must not be trusted as the primary source.
    const role = user.app_metadata?.role ?? user.user_metadata?.role
    if (role !== 'admin') {
      return {
        authorized: false,
        errorResponse: NextResponse.json({ error: 'Forbidden: admin access required' }, { status: 403 }),
      }
    }

    return { authorized: true, userId: user.id }
  } catch {
    return {
      authorized: false,
      errorResponse: NextResponse.json({ error: 'Authentication error' }, { status: 500 }),
    }
  }
}

/**
 * Lightweight auth check for server actions.
 * Returns the user ID if authenticated as admin, throws if not.
 */
export async function requireAdminAction(): Promise<string> {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set() {},
        remove() {},
      },
    }
  )

  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) {
    throw new Error('Unauthorized: Please log in as admin')
  }

  // app_metadata first — only settable via service role, not by the user
  const role = user.app_metadata?.role ?? user.user_metadata?.role
  if (role !== 'admin') {
    throw new Error('Forbidden: Admin access required')
  }

  return user.id
}
