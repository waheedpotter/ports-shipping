import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyJWT, ADMIN_COOKIE } from '@/lib/auth';
import { cookies } from 'next/headers';
import { shipmentCreateSchema } from '@/lib/schemas';

async function getAdminSession() {
  const token = cookies().get(ADMIN_COOKIE)?.value;
  if (!token) return null;
  return verifyJWT(token);
}

export async function GET(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const skip = parseInt(searchParams.get('skip') || '0');
  const take = parseInt(searchParams.get('take') || '50');

  const shipments = await prisma.shipment.findMany({ skip, take, orderBy: { createdAt: 'desc' } });
  const total = await prisma.shipment.count();

  return NextResponse.json({ data: shipments, total });
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const data = shipmentCreateSchema.parse(body);
    const { milestones, etd, eta, ...rest } = data;

    const shipment = await prisma.shipment.create({
      data: {
        ...rest,
        milestones: JSON.stringify(milestones || []),
        etd: etd ? new Date(etd) : null,
        eta: eta ? new Date(eta) : null,
      }
    });
    return NextResponse.json({ success: true, data: shipment });
  } catch (error) {
    console.error('Create shipment error:', error);
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  }
}
