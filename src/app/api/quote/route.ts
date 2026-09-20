import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { quoteSchema } from '@/lib/schemas';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = quoteSchema.parse(body);

    await prisma.lead.create({
      data: {
        ...validatedData,
        type: 'quote',
        status: 'New',
      }
    });

    return NextResponse.json({ success: true, message: 'Quote request received. We will contact you within 24 hours.' });
  } catch (error) {
    console.error('Quote Error:', error);
    return NextResponse.json({ error: 'Invalid data or server error' }, { status: 400 });
  }
}
