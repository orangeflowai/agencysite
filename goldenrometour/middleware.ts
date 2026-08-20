import { NextResponse, type NextRequest } from 'next/server';
import { ADMIN_COOKIE } from '@/lib/adminAuth';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin routes
  if (pathname.startsWith('/admin')) {
    // Allow the login page
    if (pathname === '/admin/login') {
      const token = request.cookies.get(ADMIN_COOKIE)?.value;
      if (ADMIN_PASSWORD && token === ADMIN_PASSWORD) {
        return NextResponse.redirect(new URL('/admin/inventory', request.url));
      }
      return NextResponse.next();
    }

    // Check auth for all other admin routes (fail closed if no password set)
    const token = request.cookies.get(ADMIN_COOKIE)?.value;
    if (!ADMIN_PASSWORD || token !== ADMIN_PASSWORD) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
