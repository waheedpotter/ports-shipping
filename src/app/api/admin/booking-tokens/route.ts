import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { z } from 'zod';
import { prisma } from '@/lib/db';
import { verifyJWT, ADMIN_COOKIE } from '@/lib/auth';
import { generateBookingToken } from '@/lib/tokens';

// ─── Auth helper ─────────────────────────────────────────────────────────────
async function requireAdmin(request: Request) {
  const cookieHeader = request.headers.get('cookie') || '';
  const match = cookieHeader.split(';').map((c: string) => c.trim()).find((c: string) => c.startsWith(`${ADMIN_COOKIE}=`));
  if (!match) return null;
  const token = match.split('=').slice(1).join('=');
  if (!token) return null;
  const decoded = await verifyJWT(token);
  return decoded.valid ? decoded : null;
}

// ─── POST schema ─────────────────────────────────────────────────────────────
const CreateTokenSchema = z.object({
  expiresAt: z.string().datetime({ offset: true }).optional().nullable(),
  notes: z.string().max(500).optional().nullable(),
});

// ─── GET /api/admin/booking-tokens ───────────────────────────────────────────
export async function GET(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.trim() ?? '';
    const statusFilter = searchParams.get('status')?.trim() ?? '';

    const where: Record<string, unknown> = {};
    if (search) {
      where.OR = [
        { token: { contains: search } },
        { notes: { contains: search } },
      ];
    }
    if (statusFilter) {
      where.status = statusFilter;
    }

    const tokens = await prisma.bookingToken.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        booking: {
          select: {
            confirmationNumber: true,
            bookingParty: true,
            createdAt: true,
          },
        },
      },
    });

    return NextResponse.json(tokens);
  } catch (error: any) {
    console.error('Admin tokens fetch error:', error);
    return NextResponse.json({ error: error?.message || 'Failed to fetch tokens' }, { status: 500 });
  }
}

// ─── POST /api/admin/booking-tokens ──────────────────────────────────────────
export async function POST(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const parsed = CreateTokenSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const { expiresAt, notes } = parsed.data;

  const token = generateBookingToken();

  const bookingToken = await prisma.bookingToken.create({
    data: {
      token,
      status: 'Unused',
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      notes: notes ?? null,
    },
  });

  return NextResponse.json(bookingToken, { status: 201 });
}
