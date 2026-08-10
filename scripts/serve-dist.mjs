/**
 * Serve la build di produzione come farebbe Netlify.
 *
 *   npm run serve:dist
 *
 * Applica le stesse due cose che in sviluppo non ci sono e che sono la
 * causa più comune di "in locale funzionava": il rimando di ogni percorso
 * a index.html e le intestazioni di sicurezza, compresa la Content
 * Security Policy. Se la CSP è scritta male il sito si rompe solo una
 * volta pubblicato: così lo si scopre prima.
 */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist', 'my-site', 'browser');
const PORT = Number(process.argv[2] ?? 4300);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.woff2': 'font/woff2',
};

/** Le stesse intestazioni dichiarate in netlify.toml. */
const SECURITY = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data:",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; '),
};

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  // normalize + strip di ".." per non uscire dalla cartella pubblicata
  const wanted = normalize(decodeURIComponent(url.pathname)).replace(/^(\.\.[/\\])+/, '');
  let file = join(ROOT, wanted);

  try {
    const info = await stat(file);
    if (info.isDirectory()) {
      file = join(file, 'index.html');
      await stat(file);
    }
  } catch {
    // Percorso senza file corrispondente: è una rotta dell'applicazione.
    file = join(ROOT, 'index.html');
  }

  try {
    const body = await readFile(file);
    const type = TYPES[extname(file)] ?? 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': type, ...SECURITY });
    res.end(body);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('non trovato');
  }
});

server.listen(PORT, () => {
  console.log(`Build di produzione servita su http://localhost:${PORT}`);
  console.log('Le intestazioni sono le stesse di netlify.toml, CSP compresa.');
});
