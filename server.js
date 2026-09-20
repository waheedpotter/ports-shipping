/**
 * Ports Shipping LLC — GoDaddy Node.js Application Manager Entry Point
 * Supports Phusion Passenger deployment.
 * Auto-builds the Next.js app if .next directory is missing.
 */

'use strict';

const { execSync, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// ─── Load .env if present ─────────────────────────────────────────────────────
try { require('dotenv').config({ path: path.join(__dirname, '.env.local') }); } catch (e) {}
try { require('dotenv').config({ path: path.join(__dirname, '.env') }); } catch (e) {}

// ─── Set default environment variables ───────────────────────────────────────
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  try { fs.mkdirSync(dataDir, { recursive: true }); } catch (e) {}
}

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'file:' + path.join(dataDir, 'ports_shipping.db');
  console.log('[startup] DATABASE_URL =', process.env.DATABASE_URL);
}
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'ports-shipping-jwt-secret-2026-godaddy';
}
if (!process.env.ADMIN_USERNAME) process.env.ADMIN_USERNAME = 'admin';
if (!process.env.ADMIN_PASSWORD) process.env.ADMIN_PASSWORD = 'ports@2026!secure';
if (!process.env.NEXT_PUBLIC_SITE_URL) {
  process.env.NEXT_PUBLIC_SITE_URL = 'https://ports-shipping.com';
}
process.env.NODE_ENV = process.env.NODE_ENV || 'production';

// ─── Run Prisma migrate ───────────────────────────────────────────────────────
console.log('[startup] Running prisma migrate deploy...');
try {
  execSync('npx prisma migrate deploy', {
    cwd: __dirname,
    env: { ...process.env },
    stdio: ['ignore', 'pipe', 'pipe'],
    timeout: 120000,
  });
  console.log('[startup] Prisma migration: OK');
} catch (err) {
  const msg = (err.stderr || err.stdout || '').toString();
  // "already applied" is not an error
  if (!msg.includes('No pending migrations') && !msg.includes('already applied')) {
    console.warn('[startup] Prisma migrate warning:', msg.slice(0, 300));
  } else {
    console.log('[startup] Prisma migration: already up to date');
  }
}

// ─── Auto-build Next.js if .next is missing ──────────────────────────────────
const nextDir = path.join(__dirname, '.next');
const buildRequired = !fs.existsSync(nextDir) || !fs.existsSync(path.join(nextDir, 'BUILD_ID'));

if (buildRequired) {
  console.log('[startup] .next directory not found — running npm run build...');
  console.log('[startup] This may take 2-5 minutes on first deploy. Please wait...');
  try {
    execSync('npm run build', {
      cwd: __dirname,
      env: { ...process.env },
      stdio: 'inherit',
      timeout: 300000, // 5 minutes
    });
    console.log('[startup] Build complete!');
  } catch (err) {
    console.error('[startup] BUILD FAILED:', err.message);
    process.exit(1);
  }
} else {
  console.log('[startup] .next directory found — skipping build.');
}

// ─── Start Next.js production server ─────────────────────────────────────────
const port = process.env.PORT || 3000;
const hostname = process.env.HOSTNAME || '0.0.0.0';

console.log(`[startup] Starting Next.js on ${hostname}:${port}...`);

// Use next start (standard production server)
const nextBin = path.join(__dirname, 'node_modules', '.bin', 'next');
const args = ['start', '--port', String(port), '--hostname', hostname];

const child = spawn(nextBin, args, {
  cwd: __dirname,
  env: { ...process.env },
  stdio: 'inherit',
});

child.on('exit', (code) => {
  console.log('[startup] Next.js process exited with code:', code);
  process.exit(code || 0);
});

child.on('error', (err) => {
  console.error('[startup] Failed to start Next.js:', err);
  process.exit(1);
});

// Forward signals to child
process.on('SIGTERM', () => { child.kill('SIGTERM'); });
process.on('SIGINT', () => { child.kill('SIGINT'); });
