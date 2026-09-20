import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const refs = await prisma.voyageReference.findMany({
      where: { active: true },
      orderBy: { voyageRef: 'asc' },
      select: { id: true, voyageRef: true },
    });
    return NextResponse.json(refs);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch voyage references' }, { status: 500 });
  }
}
