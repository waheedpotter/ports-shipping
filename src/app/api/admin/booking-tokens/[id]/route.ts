import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { verifyJWT, ADMIN_COOKIE } from '@/lib/auth';

// ─── Auth helper ─────────────────────────────────────────────────────────────
async function requireAdmin() {
  const token = cookies().get(ADMIN_COOKIE)?.value;
  if (!token) return null;
  const decoded = await verifyJWT(token);
  return decoded.valid ? decoded : null;
}

// ─── PATCH schema ────────────────────────────────────────────────────────────
const PatchSchema = z.union([
  z.object({ action: z.enum(['deactivate', 'activate']) }),
  z.object({ expiresAt: z.string().datetime({ offset: true }).nullable() }),
]);

// ─── PATCH /api/admin/booking-tokens/[id] ────────────────────────────────────
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = params;

  const existing = await prisma.bookingToken.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: 'Token not found' }, { status: 404 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const parsed = PatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten() },
      { status: 422 },
    );
  }

  let updateData: Record<string, unknown> = {};

  if ('action' in parsed.data) {
    if (parsed.data.action === 'deactivate') {
      updateData = { status: 'Deactivated' };
    } else if (parsed.data.action === 'activate') {
      // Only allow reactivation if it was Deactivated (not Used)
      if (existing.status === 'Used') {
        return NextResponse.json(
          { error: 'Cannot reactivate a used token.' },
          { status: 400 },
        );
      }
      updateData = { status: 'Unused' };
    }
  } else {
    updateData = {
      expiresAt: parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : null,
    };
  }

  const updated = await prisma.bookingToken.update({
    where: { id },
    data: updateData,
  });

  return NextResponse.json(updated);
}

// ─── DELETE /api/admin/booking-tokens/[id] ───────────────────────────────────
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = params;

  const existing = await prisma.bookingToken.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: 'Token not found' }, { status: 404 });

  if (existing.status !== 'Unused') {
    return NextResponse.json(
      { error: 'Only unused tokens can be deleted.' },
      { status: 400 },
    );
  }

  await prisma.bookingToken.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
