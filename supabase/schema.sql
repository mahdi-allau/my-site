-- =====================================================================
--  Schema del sito — Mahdi Allau
--  Da eseguire una sola volta nel SQL Editor di Supabase.
--
--  Modello di sicurezza
--  --------------------
--  Il sito non ha un backend proprio: il browser parla direttamente con
--  Supabase usando la anon key. La protezione sta quindi tutta nelle policy
--  RLS qui sotto:
--
--    * chiunque puo` LEGGERE progetti e servizi (sono contenuti pubblici);
--    * chiunque puo` INSERIRE un messaggio dal form contatti, ma nessuno
--      puo` rileggerlo senza essere autenticato;
--    * ogni scrittura sui contenuti richiede un utente autenticato.
--
--  IMPORTANTE: qui "autenticato" equivale ad "amministratore". Perche` questo
--  sia vero devi disattivare le iscrizioni pubbliche in Supabase:
--  Authentication -> Sign In / Providers -> Email -> "Allow new users to sign
--  up" = OFF. L'utente amministratore va creato a mano da
--  Authentication -> Users -> Add user.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. Tabelle
-- ---------------------------------------------------------------------

create table if not exists public.projects (
  id           uuid primary key default gen_random_uuid(),
  slug         text        not null unique,
  title        text        not null,
  category     text        not null default '',
  summary      text        not null default '',
  description  text        not null default '',
  technologies text[]      not null default '{}',
  highlights   text[]      not null default '{}',
  -- Traduzione inglese: se una colonna resta vuota il sito mostra l'italiano
  title_en        text,
  category_en     text,
  summary_en      text,
  description_en  text,
  technologies_en text[],
  highlights_en   text[],
  image_url    text,
  repo_url     text,
  live_url     text,
  year         integer,
  featured     boolean     not null default false,
  sort_order   integer     not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table if not exists public.services (
  id           uuid primary key default gen_random_uuid(),
  slug         text        not null unique,
  title        text        not null,
  tagline      text        not null default '',
  description  text        not null default '',
  deliverables text[]      not null default '{}',
  -- Traduzione inglese, facoltativa come per i progetti
  title_en        text,
  tagline_en      text,
  description_en  text,
  deliverables_en text[],
  icon         text        not null default 'spark',
  sort_order   integer     not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  constraint services_icon_valido
    check (icon in ('globe', 'restaurant', 'app', 'chart', 'spark'))
);

create table if not exists public.contact_messages (
  id         uuid primary key default gen_random_uuid(),
  name       text        not null,
  email      text        not null,
  company    text,
  budget     text,
  message    text        not null,
  handled    boolean     not null default false,
  created_at timestamptz not null default now(),
  constraint contact_messages_name_non_vuoto  check (char_length(trim(name)) between 2 and 120),
  constraint contact_messages_email_plausibile check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  constraint contact_messages_testo_sensato    check (char_length(trim(message)) between 20 and 5000)
);

create index if not exists projects_sort_order_idx        on public.projects (sort_order);
create index if not exists services_sort_order_idx        on public.services (sort_order);
create index if not exists contact_messages_created_idx   on public.contact_messages (created_at desc);

-- ---------------------------------------------------------------------
-- 2. Aggiornamento automatico di updated_at
-- ---------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

drop trigger if exists services_set_updated_at on public.services;
create trigger services_set_updated_at
  before update on public.services
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- 3. Row Level Security
-- ---------------------------------------------------------------------

alter table public.projects         enable row level security;
alter table public.services         enable row level security;
alter table public.contact_messages enable row level security;

-- Progetti: lettura pubblica, scrittura solo da autenticati.
drop policy if exists "progetti leggibili da tutti" on public.projects;
create policy "progetti leggibili da tutti"
  on public.projects for select
  to anon, authenticated
  using (true);

drop policy if exists "progetti scrivibili da admin" on public.projects;
create policy "progetti scrivibili da admin"
  on public.projects for all
  to authenticated
  using (true)
  with check (true);

-- Servizi: stessa logica.
drop policy if exists "servizi leggibili da tutti" on public.services;
create policy "servizi leggibili da tutti"
  on public.services for select
  to anon, authenticated
  using (true);

drop policy if exists "servizi scrivibili da admin" on public.services;
create policy "servizi scrivibili da admin"
  on public.services for all
  to authenticated
  using (true)
  with check (true);

-- Messaggi: chiunque puo` scriverne uno, solo l'admin li legge e li gestisce.
drop policy if exists "chiunque puo inviare un messaggio" on public.contact_messages;
create policy "chiunque puo inviare un messaggio"
  on public.contact_messages for insert
  to anon, authenticated
  with check (true);

drop policy if exists "messaggi leggibili da admin" on public.contact_messages;
create policy "messaggi leggibili da admin"
  on public.contact_messages for select
  to authenticated
  using (true);

drop policy if exists "messaggi aggiornabili da admin" on public.contact_messages;
create policy "messaggi aggiornabili da admin"
  on public.contact_messages for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "messaggi eliminabili da admin" on public.contact_messages;
create policy "messaggi eliminabili da admin"
  on public.contact_messages for delete
  to authenticated
  using (true);

-- ---------------------------------------------------------------------
-- 4. Storage: bucket pubblico per le immagini dei progetti
-- ---------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "media leggibile da tutti" on storage.objects;
create policy "media leggibile da tutti"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'media');

drop policy if exists "media caricabile da admin" on storage.objects;
create policy "media caricabile da admin"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'media');

drop policy if exists "media modificabile da admin" on storage.objects;
create policy "media modificabile da admin"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'media')
  with check (bucket_id = 'media');

drop policy if exists "media eliminabile da admin" on storage.objects;
create policy "media eliminabile da admin"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'media');

-- ---------------------------------------------------------------------
-- 5. Contenuti iniziali
--    Corrispondono a src/app/core/seed-content.ts, cosi` il sito mostra
--    gli stessi contenuti prima e dopo il collegamento al database.
-- ---------------------------------------------------------------------

insert into public.projects
  (slug, title, category, summary, description, technologies, highlights, year, featured, sort_order)
values
  (
    'dashboard-dati',
    'Dashboard analitica per dati operativi',
    'Data & Business Intelligence',
    'Pipeline di raccolta dati e cruscotto di monitoraggio per leggere l’andamento di un’attività senza aprire un foglio di calcolo.',
    'Un progetto end-to-end sul dato: importazione e pulizia con Python, modellazione su PostgreSQL con query SQL ottimizzate per le aggregazioni ricorrenti, e presentazione in Power BI con indicatori aggiornati. L’obiettivo è ridurre il tempo speso a compilare report manuali e rendere i numeri leggibili anche a chi non è tecnico.',
    array['Python', 'SQL', 'PostgreSQL', 'Power BI'],
    array[
      'Importazione e normalizzazione dei dati grezzi in Python',
      'Modello relazionale su PostgreSQL con viste per le metriche chiave',
      'Cruscotto Power BI con indicatori e filtri per periodo'
    ],
    2025, true, 1
  ),
  (
    'iot-controllo-ambientale',
    'Sistema IoT di controllo temperatura e umidità',
    'IoT & Sistemi embedded',
    'Centralina basata su ESP32 che legge i sensori ambientali e mantiene i valori nel range impostato con un regolatore PID.',
    'Firmware su Arduino/ESP32 per la lettura continua di sensori di temperatura e umidità, con un anello di controllo PID tarato per evitare oscillazioni e sovra-correzioni. I dati vengono esposti in rete per il monitoraggio remoto: la stessa logica è applicabile a celle frigorifere, magazzini e laboratori.',
    array['Arduino', 'ESP32', 'PID', 'Sensori temperatura/umidità', 'C++'],
    array[
      'Taratura del regolatore PID per una risposta stabile',
      'Lettura periodica dei sensori con filtraggio del rumore',
      'Telemetria via Wi-Fi per il monitoraggio da remoto'
    ],
    2024, true, 2
  ),
  (
    'web-application-gestionale',
    'Web application gestionale',
    'Sviluppo web',
    'Applicazione Angular con area riservata, anagrafiche e persistenza su PostgreSQL: la base di un gestionale su misura.',
    'Single page application in Angular e TypeScript, con routing protetto, form tipizzati e validazione lato client. I dati risiedono su PostgreSQL, con un modello pensato per crescere: ruoli, entità collegate e storico delle modifiche. È il punto di partenza dei gestionali leggeri che realizzo per le piccole attività.',
    array['Angular', 'TypeScript', 'PostgreSQL'],
    array[
      'Architettura a componenti standalone e routing protetto',
      'Form tipizzati con validazione e feedback immediato',
      'Schema PostgreSQL normalizzato e query parametriche'
    ],
    2025, true, 3
  )
on conflict (slug) do nothing;

insert into public.services (slug, title, tagline, description, deliverables, icon, sort_order)
values
  (
    'siti-web-moderni',
    'Siti web moderni',
    'Veloci, leggibili, curati nel dettaglio.',
    'Siti costruiti a mano, senza temi preconfezionati: caricamento rapido, struttura semantica, testi leggibili su ogni schermo e attenzione all’accessibilità. Il risultato è un sito che resta gradevole anche fra tre anni.',
    array[
      'Design su misura, non un template riadattato',
      'Ottimizzazione prestazioni e SEO tecnica di base',
      'Responsive curato da mobile a desktop'
    ],
    'globe', 1
  ),
  (
    'siti-web-per-ristoranti',
    'Siti web per ristoranti',
    'Menù, orari e prenotazioni sempre aggiornati.',
    'La specializzazione su cui sto costruendo la mia attività. Il sito mette in primo piano quello che i clienti cercano davvero: il menù aggiornato, dove siete, quando siete aperti e come prenotare. Il menù si modifica dal pannello di amministrazione, senza chiamare nessuno.',
    array[
      'Menù gestibile in autonomia dal pannello admin',
      'Galleria fotografica, orari e mappa integrata',
      'Contatti rapidi: telefono, WhatsApp, richiesta prenotazione'
    ],
    'restaurant', 2
  ),
  (
    'web-application',
    'Web application',
    'Strumenti interni che sostituiscono i fogli di calcolo.',
    'Gestionali leggeri e applicazioni su misura per il lavoro quotidiano: anagrafiche, ordini, turni, magazzino. Costruiti in Angular con autenticazione, ruoli e dati al sicuro su PostgreSQL.',
    array[
      'Autenticazione e gestione dei ruoli',
      'Modello dati progettato sul vostro processo reale',
      'Interfaccia pensata per l’uso quotidiano, non per la demo'
    ],
    'app', 3
  ),
  (
    'dashboard',
    'Dashboard e reportistica',
    'I numeri dell’attività, letti in trenta secondi.',
    'Raccolgo i dati che già producete — incassi, coperti, ordini, consumi — e li trasformo in un cruscotto chiaro. Niente esportazioni manuali ogni lunedì mattina: gli indicatori si aggiornano da soli.',
    array[
      'Integrazione delle sorgenti dati esistenti',
      'Indicatori e grafici sulle metriche che contano',
      'Aggiornamento automatico e accesso da qualsiasi dispositivo'
    ],
    'chart', 4
  ),
  (
    'soluzioni-digitali-personalizzate',
    'Soluzioni digitali personalizzate',
    'Quando serve qualcosa che non esiste già.',
    'Automazioni, integrazioni fra sistemi, prototipi hardware/software. Se il problema è specifico, partiamo da un’analisi breve e concreta e costruiamo solo quello che serve davvero.',
    array[
      'Analisi iniziale e proposta senza impegno',
      'Sviluppo per passi, con qualcosa di utilizzabile presto',
      'Documentazione e passaggio di consegne'
    ],
    'spark', 5
  )
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------
-- 6. Traduzione inglese dei contenuti iniziali
--    Corrisponde a src/app/core/seed-content.ts.
-- ---------------------------------------------------------------------

update public.projects set
  title_en = 'Analytics dashboard for operational data',
  category_en = 'Data & Business Intelligence',
  summary_en = 'A data pipeline and monitoring dashboard to read how a business is doing without opening a spreadsheet.',
  description_en = 'An end-to-end data project: ingestion and cleaning in Python, modelling on PostgreSQL with SQL queries tuned for the recurring aggregations, and presentation in Power BI with live indicators.',
  technologies_en = array['Python', 'SQL', 'PostgreSQL', 'Power BI'],
  highlights_en = array[
    'Raw data ingestion and normalisation in Python',
    'Relational model on PostgreSQL with views for the key metrics',
    'Power BI dashboard with indicators and period filters'
  ]
where slug = 'dashboard-dati';

update public.projects set
  title_en = 'IoT temperature and humidity control system',
  category_en = 'IoT & Embedded systems',
  summary_en = 'An ESP32-based controller that reads environmental sensors and holds the readings within range using a PID loop.',
  description_en = 'Firmware on Arduino/ESP32 for continuous temperature and humidity readings, with a PID control loop tuned to avoid oscillation and overshoot.',
  technologies_en = array['Arduino', 'ESP32', 'PID', 'Temperature/humidity sensors', 'C++'],
  highlights_en = array[
    'PID tuning for a stable response',
    'Periodic sensor sampling with noise filtering',
    'Wi-Fi telemetry for remote monitoring'
  ]
where slug = 'iot-controllo-ambientale';

update public.projects set
  title_en = 'Business management web application',
  category_en = 'Web development',
  summary_en = 'An Angular application with a private area, records and PostgreSQL persistence: the base of a bespoke management tool.',
  description_en = 'A single page application in Angular and TypeScript, with guarded routing, typed forms and client-side validation.',
  technologies_en = array['Angular', 'TypeScript', 'PostgreSQL'],
  highlights_en = array[
    'Standalone component architecture with guarded routing',
    'Typed forms with validation and immediate feedback',
    'Normalised PostgreSQL schema and parameterised queries'
  ]
where slug = 'web-application-gestionale';

update public.services set
  title_en = 'Modern websites',
  tagline_en = 'Fast, readable, finished with care.',
  description_en = 'Sites built by hand, with no off-the-shelf theme: fast loading, semantic structure, text that reads well on every screen and real attention to accessibility.',
  deliverables_en = array[
    'Bespoke design, not a reworked template',
    'Performance tuning and technical SEO groundwork',
    'Responsive care from mobile to desktop'
  ]
where slug = 'siti-web-moderni';

update public.services set
  title_en = 'Websites for restaurants',
  tagline_en = 'Menu, opening hours and bookings, always current.',
  description_en = 'The site puts front and centre what customers actually look for: the current menu, where you are, when you are open and how to book.',
  deliverables_en = array[
    'Menu you manage yourself from the admin panel',
    'Photo gallery, opening hours and embedded map',
    'Quick contact: phone, WhatsApp, booking request'
  ]
where slug = 'siti-web-per-ristoranti';

update public.services set
  title_en = 'Web applications',
  tagline_en = 'Internal tools that replace the spreadsheets.',
  description_en = 'Lightweight management tools and bespoke applications for day-to-day work: records, orders, shifts, stock.',
  deliverables_en = array[
    'Authentication and role management',
    'A data model designed around your actual process',
    'An interface built for daily use, not for the demo'
  ]
where slug = 'web-application';

update public.services set
  title_en = 'Dashboards and reporting',
  tagline_en = 'Your numbers, read in thirty seconds.',
  description_en = 'I take the data you already produce and turn it into a clear dashboard. No manual exports every Monday morning.',
  deliverables_en = array[
    'Integration of your existing data sources',
    'Indicators and charts on the metrics that matter',
    'Automatic refresh and access from any device'
  ]
where slug = 'dashboard';

update public.services set
  title_en = 'Custom digital solutions',
  tagline_en = 'For when you need something that does not exist yet.',
  description_en = 'Automations, integrations between systems, hardware/software prototypes. We start with a short, concrete analysis and build only what is genuinely needed.',
  deliverables_en = array[
    'Initial analysis and a no-obligation proposal',
    'Development in steps, with something usable early',
    'Documentation and a proper handover'
  ]
where slug = 'soluzioni-digitali-personalizzate';
