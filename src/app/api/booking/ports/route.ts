import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const ports = await prisma.port.findMany({
      where: { active: true },
      orderBy: { portCode: 'asc' },
      select: { id: true, portCode: true, portName: true },
    });
    return NextResponse.json(ports, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'CDN-Cache-Control': 'no-store',
        'Vercel-CDN-Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch ports' }, { status: 500 });
  }
}
