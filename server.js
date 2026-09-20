// Phusion Passenger / GoDaddy cPanel Node.js entry point

'use strict';

try { require('dotenv').config(); } catch (e) {}

const path = require('path');
const fs = require('fs');

// ─── Auto-set DATABASE_URL if not configured in cPanel ───────────────────────
if (!process.env.DATABASE_URL) {
  const dataDir = path.join(__dirname, 'data');
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  process.env.DATABASE_URL = 'file:' + path.join(dataDir, 'ports_shipping.db');
  console.log('[server] DATABASE_URL auto-set:', process.env.DATABASE_URL);
}

// ─── Auto-set default credentials if not configured in cPanel ────────────────
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'ports-shipping-jwt-secret-2026-godaddy';
  console.log('[server] JWT_SECRET auto-set (default)');
}
if (!process.env.ADMIN_USERNAME) process.env.ADMIN_USERNAME = 'admin';
if (!process.env.ADMIN_PASSWORD) process.env.ADMIN_PASSWORD = 'ports@2026!secure';

// ─── Run Prisma migrate deploy on startup ────────────────────────────────────
const { execSync } = require('child_process');
try {
  console.log('[server] Running prisma migrate deploy...');
  execSync('npx prisma migrate deploy', {
    cwd: __dirname,
    env: { ...process.env },
    stdio: 'pipe',
  });
  console.log('[server] Prisma migration complete.');
} catch (err) {
  console.warn('[server] Prisma migrate warning (may be OK if already migrated):', err.stderr?.toString() || err.message);
}

// ─── Start Next.js ────────────────────────────────────────────────────────────
const { createServer } = require('http');
const { parse } = require('url');

const port = parseInt(process.env.PORT || '3000', 10);
const hostname = process.env.HOSTNAME || '0.0.0.0';
const dev = false;

let nextApp;
try {
  // Try standalone mode first (next build output: 'standalone')
  const nextPath = path.join(__dirname, '.next', 'standalone', 'server.js');
  if (fs.existsSync(nextPath)) {
    console.log('[server] Starting in standalone mode...');
    // Copy static files if not already done
    const publicSrc = path.join(__dirname, 'public');
    const publicDst = path.join(__dirname, '.next', 'standalone', 'public');
    if (fs.existsSync(publicSrc) && !fs.existsSync(publicDst)) {
      fs.cpSync(publicSrc, publicDst, { recursive: true });
    }
    const staticSrc = path.join(__dirname, '.next', 'static');
    const staticDst = path.join(__dirname, '.next', 'standalone', '.next', 'static');
    if (fs.existsSync(staticSrc) && !fs.existsSync(staticDst)) {
      fs.cpSync(staticSrc, staticDst, { recursive: true });
    }
    require(nextPath);
    process.exit(0); // Let standalone server.js take over
  }
} catch (e) {
  console.log('[server] Falling back to next() API mode:', e.message);
}

// Fallback: Use Next.js programmatic API
const next = require('next');
nextApp = next({ dev, hostname, port, dir: __dirname });
const handle = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  }).listen(port, hostname, () => {
    console.log(`> Ports Shipping ready on http://${hostname}:${port}`);
    console.log(`> Environment: ${process.env.NODE_ENV}`);
    console.log(`> DATABASE_URL: ${process.env.DATABASE_URL}`);
  });
});
