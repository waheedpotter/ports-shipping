import { NextRequest, NextResponse } from 'next/server';

import { z } from 'zod';
import { prisma } from '@/lib/db';
import { verifyJWT, ADMIN_COOKIE } from '@/lib/auth';

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

const UpdateVoyageSchema = z.object({
  voyageRef: z
    .string()
    .min(1)
    .max(50)
    .regex(/^[A-Za-z0-9_-]+$/)
    .optional(),
  active: z.boolean().optional(),
});

// ─── PUT /api/admin/voyage-refs/[id] ─────────────────────────────────────────
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const admin = await requireAdmin(req);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = params;

  const existing = await prisma.voyageReference.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: 'Voyage reference not found' }, { status: 404 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const parsed = UpdateVoyageSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const { voyageRef, active } = parsed.data;

  // Check uniqueness if changing voyageRef
  if (voyageRef && voyageRef !== existing.voyageRef) {
    const collision = await prisma.voyageReference.findUnique({ where: { voyageRef } });
    if (collision) {
      return NextResponse.json(
        { error: `Voyage reference '${voyageRef}' already exists.` },
        { status: 409 },
      );
    }
  }

  const updated = await prisma.voyageReference.update({
    where: { id },
    data: {
      ...(voyageRef !== undefined ? { voyageRef } : {}),
      ...(active !== undefined ? { active } : {}),
    },
  });

  return NextResponse.json(updated);
}

// ─── DELETE /api/admin/voyage-refs/[id] ──────────────────────────────────────
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const admin = await requireAdmin(req);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = params;

  const existing = await prisma.voyageReference.findUnique({
    where: { id },
    include: { _count: { select: { bookings: true } } },
  });
  if (!existing) return NextResponse.json({ error: 'Voyage reference not found' }, { status: 404 });

  if (existing._count.bookings > 0) {
    return NextResponse.json(
      {
        error: `Cannot delete — this voyage reference has ${existing._count.bookings} associated booking(s).`,
      },
      { status: 400 },
    );
  }

  await prisma.voyageReference.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
