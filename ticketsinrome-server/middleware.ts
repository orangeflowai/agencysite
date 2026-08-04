
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

    // Protect /admin page routes
    if (request.nextUrl.pathname.startsWith('/admin')) {
        // Allow access to login page
        if (request.nextUrl.pathname === '/admin/login') {
            // If already logged in, redirect to dashboard
            if (session) {
                return NextResponse.redirect(new URL('/admin/dashboard', request.url))
            }
            return response
        }

        // Redirect unauthenticated users to login
        if (!session) {
            return NextResponse.redirect(new URL('/admin/login', request.url))
        }
    }

    // Protect /api/admin API routes (not covered by page matcher)
    if (request.nextUrl.pathname.startsWith('/api/admin')) {
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        // Add site-id header for API routes
        response.headers.set('x-site-id', process.env.NEXT_PUBLIC_SITE_ID || 'wondersofrome')
    }

    return response
}

export const config = {
    matcher: [
        // Protect page routes AND admin API routes
        '/((?!_next/static|_next/image|favicon.ico|api/webhooks|api/contact|api/availability|api/create-payment-intent|api/checkout|api/book|api/next-available|api/debug|api/seed|api/tickets|api/ai|api/addons|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
