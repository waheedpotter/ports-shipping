// Phusion Passenger / GoDaddy cPanel Node.js entry point
// This wraps Next.js standalone server for deployment

try {
  require('dotenv').config();
} catch (e) {
  // dotenv optional if environment variables are set in cPanel
}

const { createServer } = require('http');
const { parse } = require('url');

const next = require('./.next/standalone/node_modules/next/dist/server/next.js');
const path = require('path');

const port = parseInt(process.env.PORT || '3000', 10);
const hostname = process.env.HOSTNAME || '0.0.0.0';
const dev = process.env.NODE_ENV !== 'production';

const app = next({
  dev,
  hostname,
  port,
  dir: path.join(__dirname, '.next/standalone'),
});

const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  }).listen(port, hostname, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
    console.log(`> Environment: ${process.env.NODE_ENV}`);
  });
});
