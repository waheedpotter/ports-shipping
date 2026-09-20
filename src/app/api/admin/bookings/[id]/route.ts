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

export async function GET(request: Request, { params }: { params: { id: string } }) {
  if (!await requireAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const booking = await prisma.booking.findUnique({
    where: { id: params.id },
    include: {
      voyageReference: true,
      token: true,
      containers: { orderBy: { sortOrder: 'asc' } },
    },
  });
  if (!booking) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(booking);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  if (!await requireAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const booking = await prisma.booking.findUnique({ where: { id: params.id }, include: { token: true } });
  if (!booking) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  await prisma.$transaction([
    prisma.booking.delete({ where: { id: params.id } }),
    prisma.bookingToken.update({ where: { id: booking.tokenId }, data: { status: 'Unused', usedAt: null } }),
  ]);
  return NextResponse.json({ success: true });
}
