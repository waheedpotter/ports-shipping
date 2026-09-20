import crypto from 'crypto';

export function generateBookingToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const bytes = crypto.randomBytes(6);
  const token = Array.from(bytes).map((b) => chars[b % chars.length]).join('');
  return `PS-BK-${token}`;
}
