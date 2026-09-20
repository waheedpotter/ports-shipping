-- CreateTable
CREATE TABLE "Shipment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "blNumber" TEXT NOT NULL,
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
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "SeoMeta" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "route" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "keywords" TEXT NOT NULL,
    "canonical" TEXT,
    "ogImage" TEXT,
    "robots" TEXT NOT NULL DEFAULT 'index, follow'
);

-- CreateTable
CREATE TABLE "Lead" (
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
);

-- CreateTable
CREATE TABLE "AdminSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "token" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "googleVerification" TEXT,
    "analyticsId" TEXT,
    "maintenanceMode" BOOLEAN NOT NULL DEFAULT false,
    "announcementBanner" TEXT,
    "announcementEnabled" BOOLEAN NOT NULL DEFAULT false
);

-- CreateIndex
CREATE UNIQUE INDEX "Shipment_blNumber_key" ON "Shipment"("blNumber");

-- CreateIndex
CREATE UNIQUE INDEX "SeoMeta_route_key" ON "SeoMeta"("route");

-- CreateIndex
CREATE UNIQUE INDEX "AdminSession_token_key" ON "AdminSession"("token");
