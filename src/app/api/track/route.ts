import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

const rateLimit = new Map<string, { count: number; resetTime: number }>();

export async function GET(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
  const now = Date.now();
  
  const record = rateLimit.get(ip) || { count: 0, resetTime: now + 60000 };
  if (now > record.resetTime) {
    record.count = 0;
    record.resetTime = now + 60000;
  }
  record.count++;
  rateLimit.set(ip, record);

  if (record.count > 30) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  if (!q) {
    return NextResponse.json({ error: 'Query parameter q is required' }, { status: 400 });
  }

  try {
    let shipment = await prisma.shipment.findFirst({
      where: { blNumber: { equals: q } }
    });

    if (!shipment) {
      shipment = await prisma.shipment.findFirst({
        where: { containerNumber: { equals: q } }
      });
    }

    if (!shipment) {
      return NextResponse.json({
        error: 'Shipment not found',
        message: 'No shipment found for the provided BL/Container number. Please check and try again or contact us at +971 4 344 7867'
      }, { status: 404 });
    }

    const data = {
      ...shipment,
      milestones: typeof shipment.milestones === 'string' ? JSON.parse(shipment.milestones) : shipment.milestones
    };

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Track Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
