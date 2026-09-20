import { NextResponse } from 'next/server';
import { signJWT } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const cleanUser = (body.username || '').trim();
    const cleanPass = (body.password || '').trim();

    const expectedUser = (process.env.ADMIN_USERNAME || 'admin').trim();
    const expectedPass = (process.env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD_HASH || 'ports@2026!secure').trim();

    if (cleanUser !== expectedUser) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    let valid = false;
    if (cleanPass === expectedPass) {
      valid = true;
    } else {
      try {
        valid = await bcrypt.compare(cleanPass, expectedPass);
      } catch {
        valid = false;
      }
    }

    if (!valid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const jwtToken = await signJWT({ username: cleanUser, role: 'admin' });
    const isHttps =
      request.headers.get('x-forwarded-proto') === 'https' ||
      request.url.startsWith('https://');

    const maxAge = 60 * 60 * 24 * 7; // 7 days
    const cookieValue = `admin_token=${jwtToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${isHttps ? '; Secure' : ''}`;

    const res = NextResponse.json({ success: true });
    res.headers.set('Set-Cookie', cookieValue);
    return res;
  } catch (error) {
    console.error('Admin auth error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}

export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.headers.set('Set-Cookie', 'admin_token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0');
  return res;
}
