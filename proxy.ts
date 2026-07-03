/**
 * Proxy (Next 16, Nachfolger der middleware.ts): schützt den Admin-Bereich.
 * Ohne gültiges HMAC-Session-Cookie geht es zu /admin/login.
 */
import { NextResponse, type NextRequest } from 'next/server';
import { ADMIN_COOKIE, verifyAdminToken } from '@/lib/admin/session';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const token = request.cookies.get(ADMIN_COOKIE)?.value;
    if (!(await verifyAdminToken(token))) {
      const login = new URL('/admin/login', request.url);
      return NextResponse.redirect(login);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
