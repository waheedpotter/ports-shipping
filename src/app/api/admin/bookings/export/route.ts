import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyJWT, ADMIN_COOKIE } from '@/lib/auth';
import { cookies } from 'next/headers';
import * as XLSX from 'xlsx';

async function requireAdmin() {
  const token = cookies().get(ADMIN_COOKIE)?.value;
  if (!token) return null;
  const decoded = await verifyJWT(token);
  return decoded.valid ? decoded : null;
}

export async function GET(request: Request) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const search = searchParams.get('search') || '';
  const voyageRef = searchParams.get('voyageRef') || '';
  const dateFrom = searchParams.get('dateFrom');
  const dateTo = searchParams.get('dateTo');

  let bookings;
  if (id) {
    const b = await prisma.booking.findUnique({
      where: { id },
      include: { voyageReference: true, token: true, containers: { orderBy: { sortOrder: 'asc' } } },
    });
    bookings = b ? [b] : [];
  } else {
    const where: any = {};
    if (search) {
      where.OR = [
        { confirmationNumber: { contains: search } },
        { rotationNumber: { contains: search } },
        { bookingParty: { contains: search } },
        { voyageReference: { voyageRef: { contains: search } } },
      ];
    }
    if (voyageRef) where.voyageReference = { voyageRef: { contains: voyageRef } };
    if (dateFrom) where.createdAt = { ...where.createdAt, gte: new Date(dateFrom) };
    if (dateTo) { const end = new Date(dateTo); end.setHours(23,59,59,999); where.createdAt = { ...where.createdAt, lte: end }; }

    bookings = await prisma.booking.findMany({
      where,
      include: { voyageReference: true, token: true, containers: { orderBy: { sortOrder: 'asc' } } },
      orderBy: { createdAt: 'desc' },
      take: 5000,
    });
  }

  // Build rows — one row per container
  const rows: any[] = [];
  for (const booking of bookings) {
    const baseRow = {
      'Booking No.': booking.confirmationNumber,
      'Booking Date': new Date(booking.createdAt).toLocaleString('en-AE', { timeZone: 'Asia/Dubai' }),
      'Voyage Ref': booking.voyageReference.voyageRef,
      'Rotation No.': booking.rotationNumber,
      'Booking Party': booking.bookingParty,
      'Booking Party Email': booking.bookingPartyEmail,
      'Token': booking.token.token,
      'Status': booking.status,
    };
    if (booking.containers.length === 0) {
      rows.push({ ...baseRow, 'Container #': '', 'POL': '', 'POD': '', 'Line': '', 'Container No.': '', 'CHK': '', 'ISO': '', 'POD Agent': '', 'Container Email': '', 'MUB': '', 'IMCO': '', 'UN MO': '', 'Temp': '', 'VGM WT': '', 'UOM': '' });
    } else {
      booking.containers.forEach((c, i) => {
        rows.push({
          ...baseRow,
          'Container #': i + 1,
          'POL': c.pol,
          'POD': c.pod,
          'Line': c.line || '',
          'Container No.': c.containerNumber,
          'CHK': c.chk || '',
          'ISO': c.iso,
          'POD Agent': c.podAgentName || '',
          'Container Email': c.email || '',
          'MUB': c.mub || '',
          'IMCO': c.imco || '',
          'UN MO': c.unMo || '',
          'Temp': c.temperature || '',
          'VGM WT': c.vgmWeight ?? '',
          'UOM': c.uom,
        });
      });
    }
  }

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Bookings');

  // Auto-width columns
  const colWidths = Object.keys(rows[0] || {}).map(key => ({ wch: Math.max(key.length, 12) }));
  ws['!cols'] = colWidths;

  const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
  const filename = id ? `booking-${bookings[0]?.confirmationNumber || id}.xlsx` : `bookings-export-${Date.now()}.xlsx`;

  return new NextResponse(buf, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}
