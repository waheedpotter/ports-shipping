import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const refs = await prisma.voyageReference.findMany({
      where: { active: true },
      orderBy: { voyageRef: 'asc' },
      select: { id: true, voyageRef: true },
    });
    return NextResponse.json(refs, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'CDN-Cache-Control': 'no-store',
        'Vercel-CDN-Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch voyage references' }, { status: 500 });
  }
}
