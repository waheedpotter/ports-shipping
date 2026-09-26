/**
 * Ports Shipping LLC — GoDaddy Node.js / cPanel Entry Point
 * Designed for Phusion Passenger & standard Node.js hosting.
 * Directly exposes an http.Server instance that Passenger hooks into.
 */

'use strict';

const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const path = require('path');
const fs = require('fs');

// ─── Environment Configuration ───────────────────────────────────────────────
try { require('dotenv').config({ path: path.join(__dirname, '.env.local') }); } catch (e) {}
try { require('dotenv').config({ path: path.join(__dirname, '.env') }); } catch (e) {}

// Ensure database path points to prisma/dev.db where all seeded data lives
const dbPath = path.join(__dirname, 'prisma', 'dev.db');
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'file:' + dbPath;
}
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'ports-shipping-jwt-secret-2026-godaddy';
}
if (!process.env.ADMIN_USERNAME) process.env.ADMIN_USERNAME = 'admin';
if (!process.env.ADMIN_PASSWORD) process.env.ADMIN_PASSWORD = 'ports@2026!secure';
if (!process.env.NEXT_PUBLIC_SITE_URL) {
  process.env.NEXT_PUBLIC_SITE_URL = 'https://ports-shipping.com';
}
process.env.NODE_ENV = 'production';

// Phusion Passenger automatically assigns PORT / socket path
const port = parseInt(process.env.PORT || '3000', 10);
const hostname = process.env.HOSTNAME || '0.0.0.0';

console.log('[Ports Shipping] Initializing Next.js in production mode...');
console.log('[Ports Shipping] Database location:', process.env.DATABASE_URL);

// Initialize Next.js app using the pre-built .next directory
const app = next({ dev: false, hostname, port, dir: __dirname });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('[Ports Shipping] Request error on', req.url, err);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  });

  server.listen(port, () => {
    console.log(`[Ports Shipping] Ready on port ${port}`);
  });
}).catch((err) => {
  console.error('[Ports Shipping] Failed to prepare Next.js:', err);
  process.exit(1);
});
