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

## Il controllo automatico

```bash
npm run check
```

Con il server acceso apre ogni pagina in italiano e in inglese e cerca i
difetti che guardando lo schermo non si vedono:

- chiavi di traduzione rimaste a vista (`home.hero.title` invece del testo)
- link interni verso rotte che non esistono
- immagini senza testo alternativo e comandi senza nome accessibile
- campi di modulo senza etichetta
- pagine senza titolo `h1`, o con salti nella gerarchia dei titoli
- scorrimento orizzontale sul telefono, con l'elemento che lo causa
- errori in console

Esce con codice di errore se trova qualcosa, quindi si può agganciare a un
controllo automatico prima di pubblicare. Per controllare il sito già
online: `npm run check -- https://iltuodominio.it`.

---

## Farsi trovare (SEO)

`SeoService` riscrive la testa del documento a ogni cambio di pagina o di
lingua: titolo, descrizione, `canonical`, `hreflang`, Open Graph e dati
strutturati Schema.org (`ProfessionalService`).

**Le due lingue sono pagine distinte.** L'italiano sta all'URL nudo,
l'inglese sullo stesso percorso con `?lang=en`:

```
/services          → italiano
/services?lang=en  → inglese
```

Senza questo, avendo la lingua solo in memoria, Google avrebbe potuto
indicizzarne una sola — e un link condiviso si sarebbe aperto nella lingua
sbagliata.

### Prima di pubblicare

`robots.txt` e `sitemap.xml` hanno bisogno del dominio reale, che finché il
sito non è online non si conosce. C'è un segnaposto vistoso e uno script che
lo sostituisce:

```bash
npm run seo:url https://iltuodominio.it
```

Poi rifai la build. Lo script si può rieseguire se il dominio cambia.

L'immagine di anteprima per social e messaggistica è `public/og-cover.png`.

---

## Privacy

Il modulo di contatto salva nome, email e messaggio su Supabase, quindi il
sito ha un'informativa: pagina `/privacy`, tradotta, con un rimando sotto il
modulo — dove l'informazione va data, non solo in fondo alla pagina.

Il testo descrive la situazione attuale: nessun cookie di profilazione,
nessuno strumento di analisi, dati letti solo da te. **Se aggiungi statistiche,
un pixel pubblicitario o una newsletter, l'informativa va aggiornata** (e in
quel caso serve anche un banner di consenso, che oggi non serve).

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
| `npm run check`  | controllo di tutte le pagine nelle due lingue  |

---

## Pubblicazione su Netlify

Il risultato della build è un sito statico in `dist/my-site/browser`.
`netlify.toml` contiene già tutto: comando di build, cartella da pubblicare,
rimando delle rotte a `index.html` (senza, aprire `/projects` darebbe 404),
intestazioni di sicurezza e regole di cache.

### La via breve, senza account collegati

```bash
npm run build
```

Poi trascina la cartella `dist/my-site/browser` su
[app.netlify.com/drop](https://app.netlify.com/drop). Il sito è online in
pochi secondi su un indirizzo `qualcosa.netlify.app`.

**Attenzione:** con il trascinamento Netlify pubblica solo i file, senza
leggere `netlify.toml`. Il rimando delle rotte funziona lo stesso grazie a
`public/_redirects`, ma le intestazioni di sicurezza no. Per averle serve
collegare il repository.

### La via giusta, con gli aggiornamenti automatici

Metti il progetto su GitHub, poi su Netlify *Add new site → Import an
existing project*. Netlify legge `netlify.toml` e da lì in poi ogni `git
push` ripubblica il sito da solo.

### Provare la build prima di pubblicarla

```bash
npm run build
npm run serve:dist
npm run check -- http://localhost:4300
```

`serve:dist` serve la build applicando le stesse intestazioni di
`netlify.toml`, Content Security Policy compresa. È l'unico modo per
scoprire prima della pubblicazione i problemi che in sviluppo non
esistono: è così che è emerso che l'ottimizzazione del CSS critico di
Angular inseriva un gestore di eventi inline, bloccato dalla CSP, che
avrebbe lasciato il sito quasi senza stili una volta online. Per questo
`inlineCritical` è disattivato in `angular.json`.

### Dopo la prima pubblicazione

Tre cose, nell'ordine:

1. **Scrivi il dominio in sitemap e robots** e rifai la build:
   ```bash
   npm run seo:url https://iltuosito.netlify.app
   ```
2. **Autorizza l'indirizzo su Supabase**: *Authentication → URL
   Configuration*, mettilo in *Site URL* e in *Redirect URLs*. Senza questo
   i link di recupero password non funzionano.
3. **Ricontrolla il sito vero**: `npm run check -- https://iltuosito.netlify.app`

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
