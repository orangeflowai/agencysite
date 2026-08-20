import type { NextRequest } from 'next/server';

export const ADMIN_COOKIE = 'grt_admin_token';

// Fail closed: if ADMIN_PASSWORD is not set, admin access is denied.
export function isAdmin(request: NextRequest): boolean {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return false;
  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  return token === password;
}
