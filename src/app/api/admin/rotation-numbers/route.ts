import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { verifyJWT, ADMIN_COOKIE } from '@/lib/auth';

// ─── Auth helper ─────────────────────────────────────────────────────────────
async function requireAdmin(request: Request) {
  const cookieHeader = request.headers.get('cookie') || '';
  const match = cookieHeader
    .split(';')
    .map((c: string) => c.trim())
    .find((c: string) => c.startsWith(`${ADMIN_COOKIE}=`));
  if (!match) return null;
  const token = match.split('=').slice(1).join('=');
  if (!token) return null;
  const decoded = await verifyJWT(token);
  return decoded.valid ? decoded : null;
}

const CreateRotationSchema = z.object({
  rotationNumber: z
    .string()
    .min(1, 'Rotation number is required')
    .max(50)
    .trim(),
});

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// ─── GET /api/admin/rotation-numbers ─────────────────────────────────────────
export async function GET(request: Request) {
  const admin = await requireAdmin(request);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const rotations = await prisma.rotationNumber.findMany({
    orderBy: { rotationNumber: 'asc' },
  });

  // Calculate bookings count per rotation number
  const rotationsWithCount = await Promise.all(
    rotations.map(async (r) => {
      const count = await prisma.booking.count({
        where: { rotationNumber: r.rotationNumber },
      });
      return {
        ...r,
        _count: { bookings: count },
      };
    })
  );

  return NextResponse.json(rotationsWithCount);
}

// ─── POST /api/admin/rotation-numbers ────────────────────────────────────────
export async function POST(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const parsed = CreateRotationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const rotationNumber = parsed.data.rotationNumber.toUpperCase();

  // Check uniqueness
  const existing = await prisma.rotationNumber.findUnique({ where: { rotationNumber } });
  if (existing) {
    return NextResponse.json(
      { error: `Rotation number '${rotationNumber}' already exists.` },
      { status: 409 },
    );
  }

  const newRotation = await prisma.rotationNumber.create({
    data: { rotationNumber, active: true },
  });

  return NextResponse.json(
    { ...newRotation, _count: { bookings: 0 } },
    { status: 201 }
  );
}
