import { NextResponse } from 'next/server';
import { signJWT } from '@/lib/auth';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const cleanUser = (body.username || '').trim();
    const cleanPass = (body.password || '').trim();

    // Default to 'admin' if ADMIN_USERNAME is not set in hosting env
    const expectedUser = (process.env.ADMIN_USERNAME || 'admin').trim();
    // Default to 'ports@2026!secure' if password is not configured in hosting env
    const expectedPass = (process.env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD_HASH || 'ports@2026!secure').trim();

    if (cleanUser !== expectedUser) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    let valid = false;
    // 1. Direct match (plain text)
    if (cleanPass === expectedPass) {
      valid = true;
    } else {
      // 2. Bcrypt match (if expectedPass is hashed)
      try {
        valid = await bcrypt.compare(cleanPass, expectedPass);
      } catch {
        valid = false;
      }
    }

    if (!valid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = await signJWT({ username: cleanUser, role: 'admin' });
    const isHttps = request.headers.get('x-forwarded-proto') === 'https' || request.url.startsWith('https://');

    cookies().set({
      name: 'admin_token',
      value: token,
      httpOnly: true,
      secure: isHttps,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin auth error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}

export async function DELETE() {
  cookies().delete('admin_token');
  return NextResponse.json({ success: true });
}

