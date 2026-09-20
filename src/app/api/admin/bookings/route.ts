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

export async function GET(request: Request) {
  if (!await requireAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const voyageRef = searchParams.get('voyageRef') || '';
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    const skip = parseInt(searchParams.get('skip') || '0');
    const take = parseInt(searchParams.get('take') || '20');
    const statsOnly = searchParams.get('stats') === '1';

    if (statsOnly) {
      const [totalBookings, totalContainers, unusedTokens, usedTokens, activeVoyageRefs] = await Promise.all([
        prisma.booking.count(),
        prisma.bookingContainer.count(),
        prisma.bookingToken.count({ where: { status: 'Unused' } }),
        prisma.bookingToken.count({ where: { status: 'Used' } }),
        prisma.voyageReference.count({ where: { active: true } }),
      ]);
      const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
      const todayBookings = await prisma.booking.count({ where: { createdAt: { gte: todayStart } } });
      return NextResponse.json({ totalBookings, todayBookings, totalContainers, unusedTokens, usedTokens, activeVoyageRefs });
    }

    const where: any = {};
    if (search) {
      where.OR = [
        { confirmationNumber: { contains: search } },
        { rotationNumber: { contains: search } },
        { bookingParty: { contains: search } },
        { bookingPartyEmail: { contains: search } },
        { voyageReference: { voyageRef: { contains: search } } },
        { containers: { some: { containerNumber: { contains: search } } } },
      ];
    }
    if (voyageRef) where.voyageReference = { voyageRef: { contains: voyageRef } };
    if (dateFrom) where.createdAt = { ...where.createdAt, gte: new Date(dateFrom) };
    if (dateTo) { const end = new Date(dateTo); end.setHours(23,59,59,999); where.createdAt = { ...where.createdAt, lte: end }; }

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        include: {
          voyageReference: { select: { voyageRef: true } },
          token: { select: { token: true } },
          _count: { select: { containers: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      prisma.booking.count({ where }),
    ]);

    return NextResponse.json({ data: bookings, total });
  } catch (error: any) {
    console.error('Admin bookings fetch error:', error);
    return NextResponse.json({ error: error?.message || 'Failed to fetch bookings', data: [], total: 0 }, { status: 500 });
  }
}
