
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

    const isAdminPage = request.nextUrl.pathname.startsWith('/admin');
    const isAdminApi = request.nextUrl.pathname.startsWith('/api/admin') ||
                       request.nextUrl.pathname.startsWith('/api/admin-setup');

    // Protect /admin page routes
    if (isAdminPage) {
        // Allow access to login page
        if (request.nextUrl.pathname === '/admin/login') {
            if (session) {
                return NextResponse.redirect(new URL('/admin/dashboard', request.url))
            }
            return response
        }

        if (!session) {
            return NextResponse.redirect(new URL('/admin/login', request.url))
        }
    }

    // Protect admin API routes
    if (isAdminApi) {
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const isAdmin = session.user?.user_metadata?.role === 'admin'
        if (!isAdmin) {
            return NextResponse.json({ error: 'Admin role required' }, { status: 403 })
        }
    }

    return response
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
