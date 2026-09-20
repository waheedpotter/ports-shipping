import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyJWT, ADMIN_COOKIE } from '@/lib/auth';


async function requireAdmin(request: Request) {
  const cookieHeader = request.headers.get('cookie') || '';
  const match = cookieHeader.split(';').map((c: string) => c.trim()).find((c: string) => c.startsWith(`${ADMIN_COOKIE}=`));
  if (!match) return null;
  const token = match.split('=').slice(1).join('=');
  if (!token) return null;
  const decoded = await verifyJWT(token);
  return decoded.valid ? decoded : null;
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  if (!await requireAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await request.json();
  const port = await prisma.port.update({
    where: { id: params.id },
    data: {
      ...(body.portCode ? { portCode: body.portCode.trim().toUpperCase() } : {}),
      ...(body.portName !== undefined ? { portName: body.portName || null } : {}),
      ...(body.active !== undefined ? { active: body.active } : {}),
    },
  });
  return NextResponse.json(port);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  if (!await requireAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await prisma.port.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
