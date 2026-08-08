# Mahdi Allau — sito personale e vetrina

Portfolio personale e sito dell'attività di sviluppo web per ristoranti e piccole aziende.

**Stack:** Angular 20 (standalone, build esbuild/Vite) · TypeScript · Tailwind CSS 4 · Supabase (database, autenticazione, storage).
Nessun backend Node/Express: il browser parla direttamente con Supabase e la sicurezza è affidata alle policy RLS.

---

## Avvio rapido

```bash
npm install
```

```bash
npm start
```

Il sito è su http://localhost:4200. **Funziona già così**, senza database: i contenuti
vengono dai dati statici in `src/app/core/seed-content.ts`.

---

## Struttura

```
src/
├─ app/
│  ├─ core/            servizi, modelli, guard, contenuti statici
│  ├─ layout/          navbar e footer
│  ├─ pages/           home, about, projects, services, contact, 404
│  ├─ admin/           login e dashboard (area riservata)
│  └─ shared/          componenti riutilizzabili (card progetto, icone)
├─ environments/       configurazione Supabase
└─ styles.css          token di design e classi comuni (Tailwind 4)
supabase/schema.sql    schema del database, policy RLS e contenuti iniziali
```

| Rotta           | Pagina                    |
| --------------- | ------------------------- |
| `/`             | Home                      |
| `/about`        | Chi sono                  |
| `/projects`     | Progetti                  |
| `/services`     | Servizi                   |
| `/contact`      | Contatti                  |
| `/admin/login`  | Login amministratore      |
| `/admin`        | Dashboard (protetta)      |

---

## Supabase

Il progetto è **già collegato**: `pujouykvgptcurolpfys` (region `eu-north-1`).
Schema applicato, RLS attiva, contenuti iniziali caricati, bucket `media` creato.

Le credenziali sono in `src/environments/environment.ts` (produzione) e
`environment.development.ts` (`npm start`). La chiave usata è la *publishable key*:
è pubblica per progetto ed è pensata per stare nel bundle del browser.
**La `service_role` key non va mai messa qui.**

Se un giorno serve ricreare il database da zero — nuovo progetto, ambiente di
staging — basta eseguire `supabase/schema.sql` nel SQL Editor e aggiornare i due
file di ambiente.

### Creare l'utente amministratore

> Unico passaggio ancora da fare, ed è obbligatorio per la sicurezza.

1. **Authentication → Sign In / Providers → Email**: imposta
   *Allow new users to sign up* su **OFF**.
   Senza questo, chiunque potrebbe registrarsi e ottenere i permessi di scrittura.
2. **Authentication → Users → Add user**: crea il tuo utente con email e password,
   spuntando *Auto Confirm User*.

Da quel momento `/admin/login` funziona e `/admin` mostra messaggi e progetti.

---

## Lingue

Il sito pubblico è in **italiano e inglese**, con il selettore a bandiere nella
barra in alto. La lingua è un signal, quindi il cambio è istantaneo: niente
build separate, niente ricaricamento della pagina, un solo sito da pubblicare.

Alla prima visita la lingua viene scelta da quella del browser (italiano per i
browser italiani, inglese per tutti gli altri) e da lì in poi vale la scelta
dell'utente, salvata in `localStorage`.

| Dove sta il testo | File |
| ----------------- | ---- |
| Interfaccia e testi fissi | `src/app/core/i18n/translations.ts` |
| Progetti e servizi (senza database) | `src/app/core/seed-content.ts` |
| Progetti e servizi (su Supabase) | colonne `*_en` delle tabelle |

Le colonne inglesi sul database sono **facoltative**: se una resta vuota, la
versione inglese del sito mostra l'italiano invece di una casella vuota.

L'area amministrativa è solo in italiano: la usa una persona sola.

---

## Modello di sicurezza

| Chi                    | Progetti e servizi | Messaggi di contatto        |
| ---------------------- | ------------------ | --------------------------- |
| Visitatore (`anon`)    | sola lettura       | può solo inserire           |
| Amministratore (login) | lettura e scrittura| lettura, modifica, elimina  |

Le regole vivono nel database (RLS), non nel codice Angular: anche chiamando l'API
direttamente non si può scrivere senza essere autenticati.

Il form contatti include un campo trappola nascosto contro i bot, e il database
rifiuta messaggi con email non plausibile o testo troppo corto.

---

## Comandi

| Comando          | Cosa fa                                        |
| ---------------- | ---------------------------------------------- |
| `npm start`      | server di sviluppo su :4200                    |
| `npm run build`  | build di produzione in `dist/my-site/browser`  |
| `npm test`       | unit test (Karma)                              |

---

## Pubblicazione

Il risultato della build è un sito statico: `dist/my-site/browser`.

**Vercel / Netlify / Cloudflare Pages** — build command `npm run build`, output
directory `dist/my-site/browser`.

Trattandosi di una single page application, il server deve reindirizzare tutte le
rotte su `index.html`, altrimenti aprendo direttamente `/projects` si ottiene un 404.
Il file `public/_redirects` (già presente) lo configura per Netlify; Vercel e
Cloudflare Pages lo rilevano in automatico per i progetti Angular.

---

## Da personalizzare

I testi sono una base di partenza scritta sul contenuto del CV. Prima di andare
online vale la pena rivedere:

- **`src/app/pages/about/about.ts`** — percorso personale e principi di lavoro
- **`src/app/pages/services/services.ts`** — le domande frequenti e le risposte
- **`src/app/core/seed-content.ts`** — descrizioni dei progetti e dei servizi
- **`src/environments/`** — indirizzo email di contatto
- **`public/favicon.ico`** — il `.ico` di fallback è ancora quello di Angular
  (`favicon.svg`, usato dai browser moderni, è già personalizzato)

Una volta collegato Supabase, progetti e servizi si modificano dalla dashboard
invece che dal codice.
