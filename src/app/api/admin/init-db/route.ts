import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { ensureDatabaseReady } from '@/lib/init-db';

export async function GET() {
  try {
    await ensureDatabaseReady(prisma);
    const tokenCount = await prisma.bookingToken.count();
    const portCount = await prisma.port.count();
    const voyageCount = await prisma.voyageReference.count();
    return NextResponse.json({
      success: true,
      message: 'Database initialized and tables verified.',
      counts: { tokens: tokenCount, ports: portCount, voyageRefs: voyageCount },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
