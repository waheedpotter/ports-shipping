import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';
import { sendBookingConfirmation } from '@/lib/email';

const containerSchema = z.object({
  pol: z.string().min(1, 'POL is required'),
  pod: z.string().min(1, 'POD is required'),
  line: z.string().optional().nullable().default(''),
  containerNumber: z.string().min(1, 'Container number is required'),
  chk: z.string().optional().nullable().default(''),
  iso: z.string().min(1, 'ISO is required'),
  podAgentName: z.string().optional().nullable().default(''),
  email: z.string().optional().nullable().default(''),
  mub: z.string().optional().nullable().default(''),
  imco: z.string().optional().nullable().default(''),
  unMo: z.string().optional().nullable().default(''),
  temperature: z.string().optional().nullable().default(''),
  vgmWeight: z
    .union([z.number(), z.string()])
    .optional()
    .nullable()
    .transform((val) => {
      if (val === null || val === undefined || val === '') return null;
      const num = parseFloat(String(val).replace(/,/g, '').trim());
      return isNaN(num) ? null : num;
    }),
  uom: z.string().default('KG'),
});

const submitSchema = z.object({
  tokenId: z.string().trim().min(1, 'Token ID is required'),
  voyageReferenceId: z.string().trim().min(1, 'Voyage reference is required'),
  rotationNumber: z.string().trim().min(1, 'Rotation number is required'),
  bookingParty: z.string().trim().min(1, 'Booking party is required'),
  bookingPartyEmail: z.string().trim().email('Valid booking party email is required'),
  containers: z.array(containerSchema).min(1, 'At least one container is required'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = submitSchema.safeParse(body);

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      const firstError = Object.values(fieldErrors).flat()[0] || 'Invalid booking data';
      return NextResponse.json({ error: String(firstError), details: fieldErrors }, { status: 400 });
    }

    const { tokenId, voyageReferenceId, rotationNumber, bookingParty, bookingPartyEmail, containers } = parsed.data;

    const booking = await prisma.$transaction(async (tx) => {
      // Verify token is still Unused (atomic check)
      const bookingToken = await tx.bookingToken.findUnique({ where: { id: tokenId } });
      if (!bookingToken) throw new Error('TOKEN_NOT_FOUND');
      if (bookingToken.status !== 'Unused') throw new Error('TOKEN_ALREADY_USED');
      if (bookingToken.expiresAt && new Date() > bookingToken.expiresAt) throw new Error('TOKEN_EXPIRED');

      // Verify voyage reference exists and is active
      const voyageRef = await tx.voyageReference.findUnique({ where: { id: voyageReferenceId } });
      if (!voyageRef || !voyageRef.active) throw new Error('INVALID_VOYAGE_REF');

      // Atomically increment counter (using Prisma upsert — works on PostgreSQL & SQLite)
      const counter = await tx.bookingCounter.upsert({
        where: { id: 1 },
        update: { current: { increment: 1 } },
        create: { id: 1, current: 1 },
      });
      const confirmationNumber = `PSBK-${String(counter.current).padStart(6, '0')}`;

      // Create booking with all containers
      const newBooking = await tx.booking.create({
        data: {
          confirmationNumber,
          tokenId,
          voyageReferenceId,
          rotationNumber,
          bookingParty,
          bookingPartyEmail,
          containers: {
            create: containers.map((c, i) => ({
              sortOrder: i,
              pol: c.pol,
              pod: c.pod,
              line: c.line || null,
              containerNumber: c.containerNumber,
              chk: c.chk || null,
              iso: c.iso,
              podAgentName: c.podAgentName || null,
              email: c.email || null,
              mub: c.mub || null,
              imco: c.imco || null,
              unMo: c.unMo || null,
              temperature: c.temperature || null,
              vgmWeight: c.vgmWeight ?? null,
              uom: c.uom,
            })),
          },
        },
        include: { containers: { orderBy: { sortOrder: 'asc' } }, voyageReference: true, token: true },
      });

      // Mark token as used
      await tx.bookingToken.update({
        where: { id: tokenId },
        data: { status: 'Used', usedAt: new Date() },
      });

      return newBooking;
    });

    // Send emails asynchronously with token number included (fire-and-forget)
    sendBookingConfirmation(
      {
        confirmationNumber: booking.confirmationNumber,
        token: booking.token?.token,
        bookingParty: booking.bookingParty,
        bookingPartyEmail: booking.bookingPartyEmail,
        rotationNumber: booking.rotationNumber,
        status: booking.status,
        createdAt: booking.createdAt,
      },
      booking.containers,
      booking.voyageReference,
    ).catch((err) =>
      console.error('Email send failed (non-fatal):', err)
    );

    return NextResponse.json({
      success: true,
      confirmationNumber: booking.confirmationNumber,
      token: booking.token?.token || '',
      bookingId: booking.id,
      createdAt: booking.createdAt,
    });
  } catch (error: any) {
    if (error?.message === 'TOKEN_ALREADY_USED') {
      return NextResponse.json({ error: 'This token has already been used for another booking.' }, { status: 409 });
    }
    if (error?.message === 'TOKEN_EXPIRED') {
      return NextResponse.json({ error: 'This booking token has expired.' }, { status: 410 });
    }
    if (error?.message === 'TOKEN_NOT_FOUND') {
      return NextResponse.json({ error: 'Invalid booking token.' }, { status: 400 });
    }
    if (error?.message === 'INVALID_VOYAGE_REF') {
      return NextResponse.json({ error: 'Selected voyage reference is no longer available.' }, { status: 400 });
    }
    console.error('Booking submit error:', error);
    return NextResponse.json({ error: 'Failed to submit booking. Please try again.' }, { status: 500 });
  }
}
