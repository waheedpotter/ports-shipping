import { PrismaClient } from '@prisma/client';
import { ensureDatabaseReady } from './init-db';
import path from 'path';
import fs from 'fs';

// On Vercel: use /tmp (writable). On GoDaddy: use ./data/
const isVercel = !!process.env.VERCEL;
const dataDir = isVercel
  ? '/tmp'
  : path.join(process.cwd(), 'data');

if (!fs.existsSync(dataDir)) {
  try { fs.mkdirSync(dataDir, { recursive: true }); } catch {}
}

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = `file:${path.join(dataDir, 'ports_shipping.db')}`;
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Auto-initialize SQLite tables and default data if running on a fresh host (like GoDaddy)
ensureDatabaseReady(prisma).catch((err) => {
  console.warn('[DB] Auto-init check:', err);
});

