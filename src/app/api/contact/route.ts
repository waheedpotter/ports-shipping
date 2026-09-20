import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { contactSchema } from '@/lib/schemas';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = contactSchema.parse(body);

    await prisma.lead.create({
      data: {
        ...validatedData,
        type: 'contact',
        status: 'New',
      }
    });

    return NextResponse.json({ success: true, message: 'Message received. We will get back to you shortly.' });
  } catch (error) {
    console.error('Contact Error:', error);
    return NextResponse.json({ error: 'Invalid data or server error' }, { status: 400 });
  }
}
