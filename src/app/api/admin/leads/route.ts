import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyJWT, ADMIN_COOKIE } from '@/lib/auth';
import { cookies } from 'next/headers';

async function getAdminSession() {
  const token = cookies().get(ADMIN_COOKIE)?.value;
  if (!token) return null;
  return verifyJWT(token);
}

export async function GET(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || undefined;
  const status = searchParams.get('status') || undefined;

  const leads = await prisma.lead.findMany({
    where: { type, status },
    orderBy: { createdAt: 'desc' }
  });

  return NextResponse.json({ data: leads });
}

export async function PATCH(request: Request) {
  return NextResponse.json({ error: 'Method not allowed on index' }, { status: 405 });
}
