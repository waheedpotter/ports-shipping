import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyJWT, ADMIN_COOKIE } from '@/lib/auth';
import { cookies } from 'next/headers';

async function getAdminSession() {
  const token = cookies().get(ADMIN_COOKIE)?.value;
  if (!token) return null;
  return verifyJWT(token);
}

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const seoData = await prisma.seoMeta.findMany();
  return NextResponse.json({ data: seoData });
}

export async function PUT(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const { route, ...data } = body;
    const seoMeta = await prisma.seoMeta.upsert({
      where: { route },
      update: data,
      create: { route, ...data }
    });
    return NextResponse.json({ success: true, data: seoMeta });
  } catch (error) {
    return NextResponse.json({ error: 'Update failed' }, { status: 400 });
  }
}
