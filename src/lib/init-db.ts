import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

let isInitialized = false;

export async function ensureDatabaseReady(prisma: PrismaClient) {
  if (isInitialized) return;

  try {
    // 1. Ensure data directory exists
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // 2. Check if tables exist
    const tables: any[] = await prisma.$queryRawUnsafe(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='BookingToken';"
    );

    if (tables && tables.length > 0) {
      isInitialized = true;
      return;
    }

    console.log('[DB-INIT] First-run detected: Creating all SQLite database tables...');

    // 3. Create all tables
    const tableSqls = [
      `CREATE TABLE IF NOT EXISTS "Shipment" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "blNumber" TEXT NOT NULL UNIQUE,
        "containerNumber" TEXT,
        "shipper" TEXT NOT NULL,
        "consignee" TEXT NOT NULL,
        "commodity" TEXT,
        "originPort" TEXT NOT NULL,
        "destinationPort" TEXT NOT NULL,
        "vesselName" TEXT,
        "voyageNumber" TEXT,
        "etd" DATETIME,
        "eta" DATETIME,
        "currentStatus" TEXT NOT NULL DEFAULT 'Booking Confirmed',
        "milestones" TEXT NOT NULL DEFAULT '[]',
        "notes" TEXT,
        "weight" TEXT,
        "volume" TEXT,
        "packages" INTEGER,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );`,

      `CREATE TABLE IF NOT EXISTS "SeoMeta" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "route" TEXT NOT NULL UNIQUE,
        "title" TEXT NOT NULL,
        "description" TEXT NOT NULL,
        "keywords" TEXT NOT NULL,
        "canonical" TEXT,
        "ogImage" TEXT,
        "robots" TEXT NOT NULL DEFAULT 'index, follow'
      );`,

      `CREATE TABLE IF NOT EXISTS "Lead" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "type" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "phone" TEXT,
        "company" TEXT,
        "origin" TEXT,
        "dest" TEXT,
        "cargo" TEXT,
        "shipType" TEXT,
        "weight" TEXT,
        "message" TEXT,
        "status" TEXT NOT NULL DEFAULT 'New',
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );`,

      `CREATE TABLE IF NOT EXISTS "AdminSession" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "token" TEXT NOT NULL UNIQUE,
        "expiresAt" DATETIME NOT NULL,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );`,

      `CREATE TABLE IF NOT EXISTS "SiteSettings" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "googleVerification" TEXT,
        "analyticsId" TEXT,
        "maintenanceMode" BOOLEAN NOT NULL DEFAULT false,
        "announcementBanner" TEXT,
        "announcementEnabled" BOOLEAN NOT NULL DEFAULT false
      );`,

      `CREATE TABLE IF NOT EXISTS "BookingToken" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "token" TEXT NOT NULL UNIQUE,
        "status" TEXT NOT NULL DEFAULT 'Unused',
        "expiresAt" DATETIME,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "usedAt" DATETIME,
        "notes" TEXT
      );`,

      `CREATE TABLE IF NOT EXISTS "VoyageReference" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "voyageRef" TEXT NOT NULL UNIQUE,
        "active" BOOLEAN NOT NULL DEFAULT true,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );`,

      `CREATE TABLE IF NOT EXISTS "Port" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "portCode" TEXT NOT NULL UNIQUE,
        "portName" TEXT,
        "active" BOOLEAN NOT NULL DEFAULT true,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );`,

      `CREATE TABLE IF NOT EXISTS "BookingCounter" (
        "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
        "current" INTEGER NOT NULL DEFAULT 0
      );`,

      `CREATE TABLE IF NOT EXISTS "Booking" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "confirmationNumber" TEXT NOT NULL UNIQUE,
        "tokenId" TEXT NOT NULL UNIQUE,
        "voyageReferenceId" TEXT NOT NULL,
        "rotationNumber" TEXT NOT NULL,
        "bookingParty" TEXT NOT NULL,
        "bookingPartyEmail" TEXT NOT NULL,
        "status" TEXT NOT NULL DEFAULT 'Confirmed',
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("tokenId") REFERENCES "BookingToken" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
        FOREIGN KEY ("voyageReferenceId") REFERENCES "VoyageReference" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
      );`,

      `CREATE TABLE IF NOT EXISTS "BookingContainer" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "bookingId" TEXT NOT NULL,
        "sortOrder" INTEGER NOT NULL DEFAULT 0,
        "pol" TEXT NOT NULL,
        "pod" TEXT NOT NULL,
        "line" TEXT,
        "containerNumber" TEXT NOT NULL,
        "chk" TEXT,
        "iso" TEXT NOT NULL,
        "podAgentName" TEXT,
        "email" TEXT,
        "mub" TEXT,
        "imco" TEXT,
        "unMo" TEXT,
        "temperature" TEXT,
        "vgmWeight" REAL,
        "uom" TEXT NOT NULL DEFAULT 'KG',
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("bookingId") REFERENCES "Booking" ("id") ON DELETE CASCADE ON UPDATE CASCADE
      );`,
    ];

    for (const sql of tableSqls) {
      await prisma.$executeRawUnsafe(sql);
    }

    // 4. Seed Counter
    await prisma.$executeRawUnsafe(
      `INSERT OR IGNORE INTO "BookingCounter" ("id", "current") VALUES (1, 0);`
    );

    // 5. Seed Ports
    const ports = [
      ['AEJEA', 'Jebel Ali, UAE'],
      ['AESHJ', 'Sharjah, UAE'],
      ['QAHMD', 'Hamad Port, Qatar'],
      ['BHBAH', 'Khalifa Bin Salman, Bahrain'],
      ['SADMM', 'King Abdullah Port, Saudi Arabia'],
      ['KWSWK', 'Shuwaikh, Kuwait'],
      ['AEAUH', 'Abu Dhabi, UAE'],
      ['IQUQR', 'Umm Qasr, Iraq'],
    ];

    for (const [code, name] of ports) {
      const id = 'port_' + code.toLowerCase();
      await prisma.$executeRawUnsafe(
        `INSERT OR IGNORE INTO "Port" ("id", "portCode", "portName", "active", "createdAt") VALUES ('${id}', '${code}', '${name}', 1, CURRENT_TIMESTAMP);`
      );
    }

    // 6. Seed Voyage References
    const refs = ['PS030', 'PS0928', 'PS78093'];
    for (const r of refs) {
      const id = 'vref_' + r.toLowerCase();
      await prisma.$executeRawUnsafe(
        `INSERT OR IGNORE INTO "VoyageReference" ("id", "voyageRef", "active", "createdAt", "updatedAt") VALUES ('${id}', '${r}', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);`
      );
    }

    console.log('[DB-INIT] SQLite database successfully initialized with tables and seed data!');
    isInitialized = true;
  } catch (err) {
    console.error('[DB-INIT] Auto-initialization warning:', err);
  }
}
