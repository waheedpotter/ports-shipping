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

const CreateVoyageSchema = z.object({
  voyageRef: z
    .string()
    .min(1, 'Voyage reference is required')
    .max(50)
    .regex(/^[A-Za-z0-9_-]+$/, 'Only letters, numbers, hyphens, and underscores allowed'),
});

// ─── GET /api/admin/voyage-refs ──────────────────────────────────────────────
export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const refs = await prisma.voyageReference.findMany({
    orderBy: { voyageRef: 'asc' },
    include: {
      _count: { select: { bookings: true } },
    },
  });

  return NextResponse.json(refs);
}

// ─── POST /api/admin/voyage-refs ─────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const parsed = CreateVoyageSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const { voyageRef } = parsed.data;

  // Check uniqueness
  const existing = await prisma.voyageReference.findUnique({ where: { voyageRef } });
  if (existing) {
    return NextResponse.json(
      { error: `Voyage reference '${voyageRef}' already exists.` },
      { status: 409 },
    );
  }

  const newRef = await prisma.voyageReference.create({
    data: { voyageRef, active: true },
  });

  return NextResponse.json(newRef, { status: 201 });
}
