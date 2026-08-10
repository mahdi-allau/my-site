/**
 * Controllo automatico del sito.
 *
 *   npm run check                  (con il server di sviluppo acceso)
 *   npm run check -- http://...    (per controllare il sito pubblicato)
 *
 * Apre ogni pagina nelle due lingue e cerca i difetti che sfuggono
 * guardando lo schermo: chiavi di traduzione rimaste a vista, link che
 * non portano da nessuna parte, immagini senza testo alternativo, campi
 * senza etichetta, errori in console, titoli fuori ordine.
 *
 * Esce con codice 1 se trova qualcosa, così si può usare in automatico.
 */
import puppeteer from 'puppeteer-core';
import { existsSync } from 'node:fs';

const BASE = process.argv[2] ?? 'http://localhost:4200';

const CHROME = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  '/usr/bin/google-chrome',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].find((p) => existsSync(p));

if (!CHROME) {
  console.error('Chrome non trovato: il controllo ha bisogno di un browser installato.');
  process.exit(1);
}

/** Percorsi pubblici del sito. Servono anche a validare i link interni. */
const ROUTES = [
  '/',
  '/about',
  '/projects',
  '/services',
  '/contact',
  '/privacy',
  '/demo/trattoria',
  '/demo/dashboard',
  '/demo/gestionale',
  '/demo/iot',
  '/admin/login',
];

/** Prefissi delle chiavi di traduzione: se compaiono a schermo, manca un testo. */
const KEY_PREFIXES = [
  'home.', 'about.', 'services.', 'projects.', 'contact.', 'privacy.', 'nav.',
  'footer.', 'common.', 'faq.', 'pricing.', 'seo.', 'demo.', 'notfound.',
  'admin.', 'announce.', 'team.', 'security.',
];

const problems = [];
const note = (where, what) => problems.push(`${where}: ${what}`);

const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new' });

for (const lang of ['it', 'en']) {
  for (const route of ROUTES) {
    const url = lang === 'it' ? BASE + route : `${BASE}${route}?lang=en`;
    const where = `${lang} ${route}`;

    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    const consoleErrors = [];
    page.on('console', (m) => {
      if (m.type() === 'error') consoleErrors.push(m.text());
    });
    page.on('pageerror', (e) => consoleErrors.push(String(e)));

    try {
      await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
    } catch (err) {
      note(where, `la pagina non si apre (${String(err).slice(0, 60)})`);
      await page.close();
      continue;
    }
    await new Promise((r) => setTimeout(r, 1800));

    const found = await page.evaluate((prefixes) => {
      const visible = (el) => {
        const s = getComputedStyle(el);
        return s.display !== 'none' && s.visibility !== 'hidden' && el.offsetParent !== null;
      };

      // Chiavi di traduzione rimaste a vista
      const rawKeys = new Set();
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let node;
      while ((node = walker.nextNode())) {
        const text = node.textContent.trim();
        if (!text || text.includes(' ') || text.includes('@') || text.includes('/')) continue;
        if (prefixes.some((p) => text.startsWith(p))) rawKeys.add(text);
      }

      // Link interni
      const links = [...document.querySelectorAll('a[href]')]
        .map((a) => a.getAttribute('href'))
        .filter((h) => h && h.startsWith('/'))
        .map((h) => h.split('?')[0].split('#')[0]);

      // Immagini senza testo alternativo
      const imgsNoAlt = [...document.querySelectorAll('img')]
        .filter((i) => !i.hasAttribute('alt'))
        .map((i) => i.getAttribute('src'));

      // Campi senza etichetta
      const namelessFields = [...document.querySelectorAll('input, select, textarea')]
        .filter((el) => el.type !== 'hidden')
        .filter((el) => {
          if (el.getAttribute('aria-label')) return false;
          if (el.id && document.querySelector(`label[for="${CSS.escape(el.id)}"]`)) return false;
          if (el.closest('label')) return false;
          return true;
        })
        .map((el) => el.tagName + (el.id ? '#' + el.id : '') + '[' + (el.type || '') + ']');

      const headings = [...document.querySelectorAll('h1,h2,h3,h4')]
        .filter(visible)
        .map((h) => Number(h.tagName[1]));

      return {
        rawKeys: [...rawKeys],
        links: [...new Set(links)],
        imgsNoAlt,
        namelessFields,
        h1: headings.filter((l) => l === 1).length,
        headings,
        title: document.title,
        lang: document.documentElement.lang,
      };
    }, KEY_PREFIXES);

    if (found.rawKeys.length) note(where, `chiavi non tradotte a schermo: ${found.rawKeys.join(', ')}`);
    if (found.imgsNoAlt.length) note(where, `immagini senza alt: ${found.imgsNoAlt.join(', ')}`);

    // Nome accessibile: chiesto al browser invece di ricostruirlo a mano.
    // Ricavarlo dal DOM porta a falsi allarmi — per esempio un link che
    // contiene due immagini, la prima decorativa con alt vuoto e la
    // seconda con il nome vero.
    const axe = await page.accessibility.snapshot({ interestingOnly: true });
    const nameless = [];
    const walkAx = (node) => {
      if (!node) return;
      const isControl = node.role === 'link' || node.role === 'button';
      if (isControl && !(node.name || '').trim() && !node.disabled) {
        nameless.push(node.role);
      }
      (node.children ?? []).forEach(walkAx);
    };
    walkAx(axe);
    if (nameless.length) {
      note(where, `comandi senza nome accessibile: ${nameless.length} (${[...new Set(nameless)].join(', ')})`);
    }

    if (found.namelessFields.length) {
      note(where, `campi senza etichetta: ${found.namelessFields.join(', ')}`);
    }
    if (found.h1 !== 1) note(where, `titoli h1 visibili: ${found.h1} (deve essere 1)`);
    if (found.lang !== lang) note(where, `attributo lang="${found.lang}"`);

    for (const link of found.links) {
      const known = ROUTES.includes(link) || link === '/admin';
      if (!known) note(where, `link interno verso una rotta inesistente: ${link}`);
    }

    // Salto di livello nei titoli (h2 -> h4 senza h3)
    for (let i = 1; i < found.headings.length; i++) {
      if (found.headings[i] - found.headings[i - 1] > 1) {
        note(where, `salto nei titoli: h${found.headings[i - 1]} seguito da h${found.headings[i]}`);
        break;
      }
    }

    // Scorrimento orizzontale su telefono
    await page.setViewport({ width: 390, height: 844, isMobile: true });
    await new Promise((r) => setTimeout(r, 900));
    const overflow = await page.evaluate(() => {
      const doc = document.documentElement;
      if (doc.scrollWidth <= doc.clientWidth) return null;
      const wide = [...document.querySelectorAll('body *')].find(
        (el) => el.getBoundingClientRect().right > doc.clientWidth + 2,
      );
      return wide ? wide.tagName + '.' + (wide.className || '').toString().slice(0, 50) : 'elemento ignoto';
    });
    if (overflow) note(where, `scorrimento orizzontale su telefono, causato da ${overflow}`);

    const realErrors = consoleErrors.filter(
      (e) => !/favicon|net::ERR_|Failed to load resource/i.test(e),
    );
    if (realErrors.length) note(where, `errori in console: ${realErrors.slice(0, 2).join(' | ')}`);

    await page.close();
    process.stdout.write('.');
  }
}

await browser.close();

console.log('\n');
if (problems.length) {
  console.log(`TROVATI ${problems.length} PROBLEMI\n`);
  problems.forEach((p) => console.log('  - ' + p));
  process.exit(1);
}
console.log('Nessun problema.');
