
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookieOptions: {
                name: 'wonders-auth-token',
            },
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value
                },
                set(name: string, value: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    response.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                },
                remove(name: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    response.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                },
            },
        }
    )

    const { data: { session } } = await supabase.auth.getSession()

    // Protect /admin routes
    if (request.nextUrl.pathname.startsWith('/admin')) {
        // Allow access to login page
        if (request.nextUrl.pathname === '/admin/login') {
            // Only redirect to dashboard if already logged in AND has admin role
            if (session) {
                const loginRole = session.user.app_metadata?.role ?? session.user.user_metadata?.role
                if (loginRole === 'admin') {
                    return NextResponse.redirect(new URL('/admin/dashboard', request.url))
                }
            }
            return response
        }

        // Redirect unauthenticated users to login
        if (!session) {
            return NextResponse.redirect(new URL('/admin/login', request.url))
        }

        // Verify admin role. app_metadata checked first — only settable
        // via service role key, not user-tamperable like user_metadata.
        const role = session.user.app_metadata?.role ?? session.user.user_metadata?.role
        if (role !== 'admin') {
            // Non-admin user — sign them out and redirect to login
            const signOutResponse = NextResponse.redirect(new URL('/admin/login', request.url))
            signOutResponse.cookies.set('wonders-auth-token', '', { maxAge: 0, path: '/' })
            return signOutResponse
        }
    }

    return response
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
