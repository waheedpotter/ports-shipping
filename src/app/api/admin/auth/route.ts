import { NextResponse } from 'next/server';
import { signJWT } from '@/lib/auth';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    
    if (username !== process.env.ADMIN_USERNAME) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const match = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH || '');
    // Fallback simple compare if no hash configured for dev
    const valid = match || password === process.env.ADMIN_PASSWORD_HASH;

    if (!valid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = await signJWT({ username, role: 'admin' });
    
    cookies().set({
      name: 'admin_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}

export async function DELETE() {
  cookies().delete('admin_token');
  return NextResponse.json({ success: true });
}
