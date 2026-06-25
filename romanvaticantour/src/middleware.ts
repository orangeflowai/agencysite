import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect admin routes (except login page)
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    // Check for Supabase auth session cookies
    const hasSupabaseSession = request.cookies.get('sb-etutpkdi-auth-token')?.value
      || request.cookies.get('sb-access-token')?.value
      || request.cookies.get('supabase-auth-token')?.value;

    // Also check for our custom admin session fallback
    const adminSession = request.cookies.get('admin_session')?.value;

    if (!hasSupabaseSession && !adminSession) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
