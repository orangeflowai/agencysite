import { NextResponse, type NextRequest } from 'next/server';

const ADMIN_COOKIE = 'grt_admin_token';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'vatican2026';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin routes
  if (pathname.startsWith('/admin')) {
    // Allow the login page
    if (pathname === '/admin/login') {
      const token = request.cookies.get(ADMIN_COOKIE)?.value;
      if (token === ADMIN_PASSWORD) {
        return NextResponse.redirect(new URL('/admin/inventory', request.url));
      }
      return NextResponse.next();
    }

    // Check auth for all other admin routes
    const token = request.cookies.get(ADMIN_COOKIE)?.value;
    if (token !== ADMIN_PASSWORD) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
