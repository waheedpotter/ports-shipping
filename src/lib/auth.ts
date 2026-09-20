import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';

export const ADMIN_COOKIE = 'admin_token';
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';
const secretKey = new TextEncoder().encode(JWT_SECRET);

export async function signJWT(payload: object, expiresIn: string = '24h'): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secretKey);
}

export async function verifyJWT(token: string): Promise<{ valid: boolean; payload?: any }> {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return { valid: true, payload };
  } catch (error) {
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

export async function getAdminSession(request: Request): Promise<{ valid: boolean; session?: any }> {
  const cookieHeader = request.headers.get('cookie');
  if (!cookieHeader) return { valid: false };
  
  const cookies = cookieHeader.split(';').map(c => c.trim());
  const tokenCookie = cookies.find(c => c.startsWith(`${ADMIN_COOKIE}=`));
  if (!tokenCookie) return { valid: false };
  
  const token = tokenCookie.split('=')[1];
  return verifyJWT(token);
}
