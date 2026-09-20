import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';

export const ADMIN_COOKIE = 'admin_token';

function getJWTSecret() {
  const secret = process.env.JWT_SECRET || 'ports-shipping-jwt-secret-2026-godaddy';
  return new TextEncoder().encode(secret);
}

export async function signJWT(payload: object, expiresIn: string = '7d'): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(getJWTSecret());
}

export async function verifyJWT(token: string): Promise<{ valid: boolean; payload?: any }> {
  try {
    const { payload } = await jwtVerify(token, getJWTSecret());
    return { valid: true, payload };
  } catch {
    return { valid: false };
  }
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Robust admin JWT extraction — works on GoDaddy Phusion Passenger.
 * Reads cookie from: 1) next/headers cookies(), 2) raw Cookie header from request
 */
export async function getAdminSession(request: Request): Promise<{ valid: boolean; session?: any }> {
  // Method 1: raw Cookie header (most reliable on Phusion Passenger)
  const cookieHeader = request.headers.get('cookie') || '';
  if (cookieHeader) {
    const match = cookieHeader.split(';').map(c => c.trim()).find(c => c.startsWith(`${ADMIN_COOKIE}=`));
    if (match) {
      const token = match.split('=').slice(1).join('=');
      if (token) {
        const result = await verifyJWT(token);
        if (result.valid) return { valid: true, session: result.payload };
      }
    }
  }
  return { valid: false };
}

/**
 * Use this in API Route Handlers (App Router).
 * Reads the JWT from the raw request Cookie header (reliable on GoDaddy).
 */
export async function requireAdminFromRequest(request: Request): Promise<{ valid: boolean; session?: any }> {
  return getAdminSession(request);
}
