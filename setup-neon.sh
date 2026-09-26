#!/bin/bash
# ─────────────────────────────────────────────────────────────
# Neon PostgreSQL Setup Script for Ports Shipping
# Run this AFTER setting DATABASE_URL and DIRECT_URL in .env.local
# ─────────────────────────────────────────────────────────────

set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Ports Shipping — Neon PostgreSQL Migration"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check env vars
if grep -q "PASTE_YOUR" .env.local; then
  echo "❌ ERROR: You must replace DATABASE_URL and DIRECT_URL in .env.local first!"
  echo "   Get them from https://console.neon.tech"
  exit 1
fi

echo ""
echo "1️⃣  Generating Prisma client for PostgreSQL..."
npx prisma generate

echo ""
echo "2️⃣  Pushing schema to Neon (creates all tables)..."
npx prisma db push

echo ""
echo "3️⃣  Seeding initial data (ports, voyage refs, shipments)..."
npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed-booking.ts

echo ""
echo "4️⃣  Building the app..."
npm run build

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅  Done! Now add these to Vercel environment variables:"
echo "    DATABASE_URL  = your Neon pooled connection string"
echo "    DIRECT_URL    = your Neon direct connection string"
echo "    (Settings → Environment Variables in Vercel dashboard)"
echo ""
echo "    Then run: npx vercel --prod --yes"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
