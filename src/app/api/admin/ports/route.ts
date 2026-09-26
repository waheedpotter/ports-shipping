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

const CreatePortSchema = z.object({
  portCode: z
    .string()
    .min(2, 'Port code must be at least 2 characters')
    .max(10, 'Port code must be at most 10 characters')
    .toUpperCase(),
  portName: z.string().max(200).optional().nullable(),
});

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// ─── GET /api/admin/ports ────────────────────────────────────────────────────
export async function GET(request: Request) {
  const admin = await requireAdmin(request);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const ports = await prisma.port.findMany({
    orderBy: { portCode: 'asc' },
  });

  return NextResponse.json(ports);
}

// ─── POST /api/admin/ports ───────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const parsed = CreatePortSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const { portCode, portName } = parsed.data;

  const existing = await prisma.port.findUnique({ where: { portCode } });
  if (existing) {
    return NextResponse.json(
      { error: `Port code '${portCode}' already exists.` },
      { status: 409 },
    );
  }

  const port = await prisma.port.create({
    data: { portCode, portName: portName ?? null },
  });

  return NextResponse.json(port, { status: 201 });
}
