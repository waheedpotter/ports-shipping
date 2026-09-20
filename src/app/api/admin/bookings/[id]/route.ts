import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyJWT, ADMIN_COOKIE } from '@/lib/auth';
import { cookies } from 'next/headers';

async function requireAdmin() {
  const token = cookies().get(ADMIN_COOKIE)?.value;
  if (!token) return null;
  const decoded = await verifyJWT(token);
  return decoded.valid ? decoded : null;
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
  if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const booking = await prisma.booking.findUnique({ where: { id: params.id }, include: { token: true } });
  if (!booking) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  await prisma.$transaction([
    prisma.booking.delete({ where: { id: params.id } }),
    prisma.bookingToken.update({ where: { id: booking.tokenId }, data: { status: 'Unused', usedAt: null } }),
  ]);
  return NextResponse.json({ success: true });
}
