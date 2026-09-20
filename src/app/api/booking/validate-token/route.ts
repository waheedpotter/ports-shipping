import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Simple in-memory rate limiter: 10 attempts per IP per minute
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (entry.count >= 10) return false;
  entry.count++;
  return true;
}

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ valid: false, message: 'Too many attempts. Please try again in a minute.' }, { status: 429 });
  }

  try {
    const body = await request.json();
    const token = (body.token || '').trim().toUpperCase();

    if (!token || token.length < 3) {
      return NextResponse.json({ valid: false, message: 'Please enter a valid booking token.' }, { status: 400 });
    }

    const bookingToken = await prisma.bookingToken.findUnique({ where: { token } });

    if (!bookingToken) {
      return NextResponse.json({ valid: false, message: 'Invalid booking token. Please check the reference number.' }, { status: 400 });
    }

    if (bookingToken.status === 'Used') {
      return NextResponse.json({ valid: false, message: 'This booking token has already been used.' }, { status: 409 });
    }

    if (bookingToken.status === 'Deactivated') {
      return NextResponse.json({ valid: false, message: 'This booking token has been deactivated. Please contact Ports Shipping.' }, { status: 400 });
    }

    if (bookingToken.status === 'Expired' || (bookingToken.expiresAt && new Date() > bookingToken.expiresAt)) {
      if (bookingToken.status !== 'Expired') {
        await prisma.bookingToken.update({ where: { id: bookingToken.id }, data: { status: 'Expired' } });
      }
      return NextResponse.json({ valid: false, message: 'This booking token has expired. Please contact Ports Shipping.' }, { status: 410 });
    }

    return NextResponse.json({ valid: true, tokenId: bookingToken.id, token: bookingToken.token });
  } catch (error) {
    console.error('Token validation error:', error);
    return NextResponse.json({ valid: false, message: 'Server error. Please try again.' }, { status: 500 });
  }
}
