/**
 * Scrive il dominio reale dentro robots.txt e sitemap.xml.
 *
 *   npm run seo:url https://iltuodominio.it
 *
 * Esiste perché sitemap e robots hanno bisogno di URL assoluti, ma il
 * dominio non si conosce finché il sito non viene pubblicato. Il
 * segnaposto è volutamente vistoso: se resta, si nota subito.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const PLACEHOLDER = 'https://IL-TUO-DOMINIO.it';
const FILES = ['robots.txt', 'sitemap.xml'];

const raw = process.argv[2];

if (!raw) {
  console.error('Manca il dominio.\nUso: npm run seo:url https://iltuodominio.it');
  process.exit(1);
}

let origin;
try {
  const parsed = new URL(raw);
  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
    throw new Error('protocollo non supportato');
  }
  // Solo lo schema più l'host: gli URL nei file aggiungono già i percorsi.
  origin = parsed.origin;
} catch {
  console.error(`"${raw}" non è un indirizzo valido. Esempio: https://iltuodominio.it`);
  process.exit(1);
}

const publicDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'public');

/**
 * Dominio attualmente scritto nei file, per permettere di rieseguire lo
 * script quando il dominio cambia. Lo ricava dal primo <loc> del sitemap
 * invece di indovinarlo con un'espressione regolare sull'intero file.
 */
function currentOrigin() {
  const sitemap = readFileSync(join(publicDir, 'sitemap.xml'), 'utf8');
  const match = sitemap.match(/<loc>\s*([^<\s]+)\s*<\/loc>/);
  if (!match) {
    return PLACEHOLDER;
  }
  try {
    return new URL(match[1]).origin;
  } catch {
    return PLACEHOLDER;
  }
}

const previous = currentOrigin();

if (previous === origin) {
  console.log(`Il dominio è già ${origin}. Nessuna modifica.`);
  process.exit(0);
}

for (const name of FILES) {
  const path = join(publicDir, name);
  const before = readFileSync(path, 'utf8');
  const after = before
    .replaceAll(previous, origin)
    .replaceAll(PLACEHOLDER, origin)
    .replaceAll(PLACEHOLDER.toLowerCase(), origin);

  writeFileSync(path, after, 'utf8');

  // Confronto senza distinzione fra maiuscole e minuscole: il costruttore
  // URL normalizza l'host, quindi il segnaposto può ripresentarsi minuscolo.
  const left = after.toLowerCase().includes(PLACEHOLDER.toLowerCase());
  console.log(`${name}: ${left ? 'ATTENZIONE — segnaposto ancora presente' : origin}`);
}

console.log(`\nFatto. Ricorda di rifare la build: npm run build`);
