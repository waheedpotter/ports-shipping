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

  const lead = await prisma.lead.findUnique({ where: { id: params.id } });
  if (!lead) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ data: lead });
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { status } = await request.json();
    const lead = await prisma.lead.update({
      where: { id: params.id },
      data: { status }
    });
    return NextResponse.json({ success: true, data: lead });
  } catch (error) {
    return NextResponse.json({ error: 'Update failed' }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await prisma.lead.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Delete failed' }, { status: 400 });
  }
}
