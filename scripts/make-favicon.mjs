/**
 * Genera public/favicon.ico dal marchio SARAH.
 *
 *   npm run favicon
 *
 * Serve perché il .ico rimasto dalla creazione del progetto era quello
 * di Angular: essendo dichiarato per primo in index.html con
 * `sizes="any"`, i browser preferivano lui, e chi riceveva il link del
 * sito vedeva il logo di Angular nella scheda.
 *
 * Il file .ico contiene due immagini PNG, 32 e 64 pixel: il formato lo
 * consente dal 2007 e tutti i browser attuali lo leggono.
 */
import puppeteer from 'puppeteer-core';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const RADICE = join(dirname(fileURLToPath(import.meta.url)), '..');
const SORGENTE = join(RADICE, 'public', 'logo-mark.png');
const DESTINAZIONE = join(RADICE, 'public', 'favicon.ico');
const MISURE = [32, 64];

const CHROME = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  '/usr/bin/google-chrome',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].find((p) => existsSync(p));

if (!CHROME) {
  console.error('Chrome non trovato: serve per ridimensionare il marchio.');
  process.exit(1);
}

const base64 = readFileSync(SORGENTE).toString('base64');
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new' });
const immagini = [];

for (const lato of MISURE) {
  const page = await browser.newPage();
  await page.setViewport({ width: lato, height: lato });
  await page.setContent(`
    <style>
      html, body { margin: 0; width: ${lato}px; height: ${lato}px; }
      img {
        width: 100%; height: 100%; object-fit: contain;
        /* Un margine interno evita che il tratto tocchi il bordo:
           a 32 pixel un marchio a filo sembra tagliato. */
        padding: ${Math.round(lato * 0.08)}px;
        box-sizing: border-box;
      }
    </style>
    <img src="data:image/png;base64,${base64}">
  `);
  await page.evaluate(() => document.querySelector('img').decode());

  const png = await page.screenshot({ omitBackground: true });
  immagini.push({ lato, png: Buffer.from(png) });
  await page.close();
}

await browser.close();

// --- Assemblaggio del contenitore .ico -------------------------------
const intestazione = Buffer.alloc(6);
intestazione.writeUInt16LE(0, 0); // riservato
intestazione.writeUInt16LE(1, 2); // 1 = icona
intestazione.writeUInt16LE(immagini.length, 4);

const voci = [];
let offset = 6 + immagini.length * 16;

for (const { lato, png } of immagini) {
  const voce = Buffer.alloc(16);
  voce.writeUInt8(lato >= 256 ? 0 : lato, 0); // larghezza
  voce.writeUInt8(lato >= 256 ? 0 : lato, 1); // altezza
  voce.writeUInt8(0, 2); // colori nella tavolozza: 0 = colore pieno
  voce.writeUInt8(0, 3); // riservato
  voce.writeUInt16LE(1, 4); // piani
  voce.writeUInt16LE(32, 6); // bit per pixel
  voce.writeUInt32LE(png.length, 8);
  voce.writeUInt32LE(offset, 12);
  voci.push(voce);
  offset += png.length;
}

writeFileSync(
  DESTINAZIONE,
  Buffer.concat([intestazione, ...voci, ...immagini.map((i) => i.png)]),
);

console.log(
  `favicon.ico creato: ${MISURE.join(' e ')} pixel, ` +
    `${readFileSync(DESTINAZIONE).length} byte`,
);
