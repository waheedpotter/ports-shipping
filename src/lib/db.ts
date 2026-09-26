import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';

// Determine the appropriate SQLite database location
function setupDatabaseUrl(): string {
  if (process.env.VERCEL) {
    // Vercel serverless environment: root is read-only, /tmp is writable
    const tmpDbPath = path.join('/tmp', 'dev.db');
    const bundledDbPath = path.join(process.cwd(), 'prisma', 'dev.db');

    try {
      if (!fs.existsSync(tmpDbPath) && fs.existsSync(bundledDbPath)) {
        fs.copyFileSync(bundledDbPath, tmpDbPath);
        console.log('[DB] Seeded database copied to /tmp/dev.db');
      }
    } catch (e) {
      console.warn('[DB] Could not copy database to /tmp:', e);
    }

    const url = `file:${tmpDbPath}`;
    process.env.DATABASE_URL = url;
    return url;
  }

  // Non-Vercel (Localhost, GoDaddy):
  const absoluteDbPath = path.resolve(process.cwd(), 'prisma', 'dev.db');
  process.env.DATABASE_URL = `file:${absoluteDbPath}`;
  return process.env.DATABASE_URL;
}

const dbUrl = setupDatabaseUrl();

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: dbUrl,
      },
    },
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
