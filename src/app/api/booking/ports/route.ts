import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const ports = await prisma.port.findMany({
      where: { active: true },
      orderBy: { portCode: 'asc' },
      select: { id: true, portCode: true, portName: true },
    });
    return NextResponse.json(ports);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch ports' }, { status: 500 });
  }
}
