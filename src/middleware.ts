import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

function getSecretKey() {
  const secret = process.env.JWT_SECRET || 'ports-shipping-jwt-secret-2026-godaddy';
  return new TextEncoder().encode(secret);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin/* pages (not /admin/login itself)
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    // Try request.cookies first, then fall back to raw Cookie header
    let token = request.cookies.get('admin_token')?.value;

    if (!token) {
      // Fallback: parse raw Cookie header (more reliable on Phusion Passenger)
      const cookieHeader = request.headers.get('cookie') || '';
      const match = cookieHeader.split(';').map(c => c.trim()).find(c => c.startsWith('admin_token='));
      if (match) token = match.split('=').slice(1).join('=');
    }

    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    try {
      await jwtVerify(token, getSecretKey());
      return NextResponse.next();
    } catch {
      const response = NextResponse.redirect(new URL('/admin/login', request.url));
      response.headers.set('Set-Cookie', 'admin_token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
