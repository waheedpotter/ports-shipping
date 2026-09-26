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

const UpdateRotationSchema = z.object({
  rotationNumber: z.string().min(1).max(50).trim().optional(),
  active: z.boolean().optional(),
});

// ─── PUT /api/admin/rotation-numbers/[id] ────────────────────────────────────
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const admin = await requireAdmin(req);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = params;

  const existing = await prisma.rotationNumber.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: 'Rotation number not found' }, { status: 404 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const parsed = UpdateRotationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const { rotationNumber, active } = parsed.data;

  // Check uniqueness if changing rotationNumber
  if (rotationNumber && rotationNumber.toUpperCase() !== existing.rotationNumber) {
    const collision = await prisma.rotationNumber.findUnique({
      where: { rotationNumber: rotationNumber.toUpperCase() },
    });
    if (collision) {
      return NextResponse.json(
        { error: `Rotation number '${rotationNumber.toUpperCase()}' already exists.` },
        { status: 409 },
      );
    }
  }

  const updated = await prisma.rotationNumber.update({
    where: { id },
    data: {
      ...(rotationNumber !== undefined ? { rotationNumber: rotationNumber.toUpperCase() } : {}),
      ...(active !== undefined ? { active } : {}),
    },
  });

  const count = await prisma.booking.count({
    where: { rotationNumber: updated.rotationNumber },
  });

  return NextResponse.json({ ...updated, _count: { bookings: count } });
}

// ─── DELETE /api/admin/rotation-numbers/[id] ─────────────────────────────────
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const admin = await requireAdmin(req);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = params;

  const existing = await prisma.rotationNumber.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: 'Rotation number not found' }, { status: 404 });

  const bookingCount = await prisma.booking.count({
    where: { rotationNumber: existing.rotationNumber },
  });

  if (bookingCount > 0) {
    return NextResponse.json(
      {
        error: `Cannot delete — this rotation number has ${bookingCount} associated booking(s).`,
      },
      { status: 400 },
    );
  }

  await prisma.rotationNumber.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
