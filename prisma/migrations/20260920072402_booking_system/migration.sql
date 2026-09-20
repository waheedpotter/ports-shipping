-- CreateTable
CREATE TABLE "BookingToken" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "token" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Unused',
    "expiresAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usedAt" DATETIME,
    "notes" TEXT
);

-- CreateTable
CREATE TABLE "VoyageReference" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "voyageRef" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Port" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "portCode" TEXT NOT NULL,
    "portName" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "BookingCounter" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "current" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "confirmationNumber" TEXT NOT NULL,
    "tokenId" TEXT NOT NULL,
    "voyageReferenceId" TEXT NOT NULL,
    "rotationNumber" TEXT NOT NULL,
    "bookingParty" TEXT NOT NULL,
    "bookingPartyEmail" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Confirmed',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Booking_tokenId_fkey" FOREIGN KEY ("tokenId") REFERENCES "BookingToken" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Booking_voyageReferenceId_fkey" FOREIGN KEY ("voyageReferenceId") REFERENCES "VoyageReference" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BookingContainer" (
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
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "BookingContainer_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "BookingToken_token_key" ON "BookingToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VoyageReference_voyageRef_key" ON "VoyageReference"("voyageRef");

-- CreateIndex
CREATE UNIQUE INDEX "Port_portCode_key" ON "Port"("portCode");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_confirmationNumber_key" ON "Booking"("confirmationNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_tokenId_key" ON "Booking"("tokenId");
