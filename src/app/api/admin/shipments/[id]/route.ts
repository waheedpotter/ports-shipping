import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyJWT, ADMIN_COOKIE } from '@/lib/auth';
import { cookies } from 'next/headers';

async function getAdminSession() {
  const token = cookies().get(ADMIN_COOKIE)?.value;
  if (!token) return null;
  return verifyJWT(token);
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const shipment = await prisma.shipment.findUnique({ where: { id: params.id } });
  if (!shipment) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return NextResponse.json({ data: shipment });
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const shipment = await prisma.shipment.update({
      where: { id: params.id },
      data: {
        ...body,
        milestones: body.milestones ? JSON.stringify(body.milestones) : undefined
      }
    });
    return NextResponse.json({ success: true, data: shipment });
  } catch (error) {
    return NextResponse.json({ error: 'Update failed' }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await prisma.shipment.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Delete failed' }, { status: 400 });
  }
}
