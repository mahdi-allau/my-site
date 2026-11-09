import { Lang } from './i18n/i18n.service';
import { Project, ServiceOffer } from './models';

/**
 * Contenuti di partenza, presi dal CV, in italiano e in inglese.
 *
 * Servono a due cose: il sito è completo e navigabile anche senza Supabase
 * configurato, e `supabase/schema.sql` usa gli stessi record come seed del
 * database, così i due mondi restano allineati.
 */

type Text = Record<Lang, string>;
type List = Record<Lang, string[]>;

interface SeedProject {
  id: string;
  slug: string;
  title: Text;
  category: Text;
  summary: Text;
  description: Text;
  technologies: List;
  highlights: List;
  year: number;
  sortOrder: number;
  /** Percorso interno del progetto visitabile, quando esiste. */
  liveUrl?: string;
  /** Chi ha seguito il progetto dentro lo studio. */
  credit?: string;
}

interface SeedService {
  id: string;
  slug: string;
  title: Text;
  tagline: Text;
  description: Text;
  deliverables: List;
  icon: ServiceOffer['icon'];
  sortOrder: number;
}

const PROJECTS: SeedProject[] = [
  {
    // Primo della lista di proposito: è l'unico progetto che dimostra
    // esattamente ciò che il sito vende, ed è visitabile.
    id: 'seed-trattoria',
    slug: 'osteria-del-tiglio',
    liveUrl: '/demo/trattoria',
    title: {
      it: 'Osteria del Tiglio — sito per ristorante',
      en: 'Osteria del Tiglio — restaurant website',
    },
    category: {
      it: 'Siti web per ristoranti',
      en: 'Restaurant websites',
    },
    summary: {
      it: 'Sito completo per una trattoria di valle: menù, storia, sale, orari e richiesta di prenotazione. Progetto dimostrativo, visitabile per intero.',
      en: 'A complete site for a valley trattoria: menu, story, rooms, opening hours and booking requests. A demo project you can visit in full.',
    },
    description: {
      it: 'Un locale inventato per mostrare come lavoriamo su un progetto vero, dal marchio alla messa online. Identità visiva costruita apposta — vino e crema, niente a che vedere con questo sito — menù organizzato per portate e leggibile sul telefono, sezione prenotazioni e orari sempre in evidenza. Le illustrazioni sono disegnate a mano in SVG, pensate per essere sostituite dalle fotografie del locale senza rifare il layout.',
      en: 'An invented venue, built to show how we work on a real project, from the brand to going live. A visual identity made for it — wine and cream, nothing like this site — a menu organised by course and readable on a phone, a booking section and opening hours always in view. The illustrations are hand-drawn SVG, made to be swapped for the venue’s own photographs without redoing the layout.',
    },
    technologies: {
      it: ['Angular', 'TypeScript', 'CSS', 'SVG', 'Design responsive'],
      en: ['Angular', 'TypeScript', 'CSS', 'SVG', 'Responsive design'],
    },
    highlights: {
      it: [
        'Identità visiva propria, distinta da quella del portfolio',
        'Menù per portate, leggibile con una mano sul telefono',
        'Prenotazione, orari e indirizzo raggiungibili da ogni punto',
        'Illustrazioni SVG sostituibili con foto vere senza toccare il layout',
      ],
      en: [
        'Its own visual identity, distinct from the portfolio’s',
        'Menu by course, readable one-handed on a phone',
        'Booking, hours and address reachable from anywhere on the page',
        'SVG illustrations swappable for real photos without touching the layout',
      ],
    },
    credit: 'Mahdi Allau',
    year: 2026,
    sortOrder: 0,
  },
  {
    // L'unico cliente vero dell'elenco, e il progetto piu completo: negozio,
    // prodotti, spedizioni, pagine legali.
    // Attenzione al collegamento: finche Simona non apre il negozio, chi clicca
    // trova la richiesta della password di Shopify. E una scelta, non una
    // svista. Quando il negozio apre, qui non c'e niente da cambiare.
    id: 'seed-kokedama',
    slug: 'kokedama-sculture-naturali',
    liveUrl: 'https://kokedamasculture.myshopify.com',
    title: {
      it: 'Kokedama & Sculture Naturali — negozio online',
      en: 'Kokedama & Sculture Naturali — online shop',
    },
    category: {
      it: 'Negozi online',
      en: 'Online shops',
    },
    summary: {
      it: 'Negozio Shopify per un laboratorio artigiano di Ferrara: due linee di vendita con regole diverse, quindici piante a catalogo e la taglia che sceglie il cliente.',
      en: 'A Shopify shop for a craft studio in Ferrara: two product lines with different rules, fifteen plants in the catalogue and a size the customer chooses.',
    },
    description: {
      it: 'Simona fa kokedama a mano dal 2022, in un terrazzo del centro storico di Ferrara. Il negozio doveva tenere insieme due cose che si vendono in modo opposto: le piante vive, che in corriere non ci vanno e si consegnano a mano in città, e le composizioni stabilizzate, che si spediscono in tutta Italia. Da qui due percorsi separati, dalla collezione fino al checkout, e testi che dicono sempre quale delle due si sta comprando — perché il reso più caro è quello di chi credeva di aver comprato altro. Il tema Dawn è stato rifatto nella tipografia, nei colori e nelle sezioni della home; le schede prodotto chiedono la taglia prima del carrello.',
      en: 'Simona has been making kokedama by hand since 2022, on a terrace in the old town of Ferrara. The shop had to hold together two things that sell in opposite ways: living plants, which do not travel by courier and are delivered by hand in town, and preserved arrangements, which ship across Italy. Hence two separate paths, from the collection through to the checkout, and copy that always says which of the two you are buying — the most expensive return is the one from someone who thought they had bought something else. The Dawn theme was rebuilt in its typography, colours and home sections; product pages ask for the size before the cart.',
    },
    technologies: {
      it: ['Shopify', 'Liquid', 'Tema Dawn', 'Node.js', 'CSS', 'Design responsive'],
      en: ['Shopify', 'Liquid', 'Dawn theme', 'Node.js', 'CSS', 'Responsive design'],
    },
    highlights: {
      it: [
        'Due linee con regole diverse: piante vive consegnate a mano a Ferrara, stabilizzate spedite in tutta Italia',
        'Taglia scelta dal cliente su ogni pianta, con il prezzo che cambia di conseguenza',
        'Quindici prodotti a catalogo, ognuno con la sua scheda di cura scritta a mano',
        'Tema generato da script: colori, testi e sezioni si rifanno con un comando, senza rimettere le mani nel codice',
      ],
      en: [
        'Two lines with different rules: living plants delivered by hand in Ferrara, preserved ones shipped across Italy',
        'A size chosen by the customer on every plant, with the price following',
        'Fifteen products in the catalogue, each with its own hand-written care card',
        'A theme generated by scripts: colours, copy and sections are rebuilt with one command, no hand-editing',
      ],
    },
    credit: 'Mahdi Allau',
    year: 2026,
    sortOrder: 1,
  },
  {
    id: 'seed-dashboard',
    slug: 'dashboard-dati',
    liveUrl: '/demo/dashboard',
    title: {
      it: 'Dashboard analitica per dati operativi',
      en: 'Analytics dashboard for operational data',
    },
    category: {
      it: 'Dati & Business Intelligence',
      en: 'Data & Business Intelligence',
    },
    summary: {
      it: 'Pipeline di raccolta dati e cruscotto di monitoraggio per leggere l’andamento di un’attività senza aprire un foglio di calcolo.',
      en: 'A data pipeline and monitoring dashboard to read how a business is doing without opening a spreadsheet.',
    },
    description: {
      it: 'Un progetto end-to-end sul dato: importazione e pulizia con Python, modellazione su PostgreSQL con query SQL ottimizzate per le aggregazioni ricorrenti, e presentazione in Power BI con indicatori aggiornati. L’obiettivo è ridurre il tempo speso a compilare report manuali e rendere i numeri leggibili anche a chi non è tecnico.',
      en: 'An end-to-end data project: ingestion and cleaning in Python, modelling on PostgreSQL with SQL queries tuned for the recurring aggregations, and presentation in Power BI with live indicators. The goal is to cut the time spent compiling manual reports and make the numbers readable for non-technical people too.',
    },
    technologies: {
      it: ['Python', 'SQL', 'PostgreSQL', 'Power BI'],
      en: ['Python', 'SQL', 'PostgreSQL', 'Power BI'],
    },
    highlights: {
      it: [
        'Importazione e normalizzazione dei dati grezzi in Python',
        'Modello relazionale su PostgreSQL con viste per le metriche chiave',
        'Cruscotto Power BI con indicatori e filtri per periodo',
      ],
      en: [
        'Raw data ingestion and normalisation in Python',
        'Relational model on PostgreSQL with views for the key metrics',
        'Power BI dashboard with indicators and period filters',
      ],
    },
    credit: 'Mahdi Allau',
    year: 2025,
    sortOrder: 2,
  },
  {
    id: 'seed-iot',
    slug: 'iot-controllo-ambientale',
    liveUrl: '/demo/iot',
    title: {
      it: 'Sistema IoT di controllo temperatura e umidità',
      en: 'IoT temperature and humidity control system',
    },
    category: {
      it: 'IoT & Sistemi embedded',
      en: 'IoT & Embedded systems',
    },
    summary: {
      it: 'Centralina basata su ESP32 che legge i sensori ambientali e mantiene i valori nel range impostato con un regolatore PID.',
      en: 'An ESP32-based controller that reads environmental sensors and holds the readings within range using a PID loop.',
    },
    description: {
      it: 'Firmware su Arduino/ESP32 per la lettura continua di sensori di temperatura e umidità, con un anello di controllo PID tarato per evitare oscillazioni e sovra-correzioni. I dati vengono esposti in rete per il monitoraggio remoto: la stessa logica è applicabile a celle frigorifere, magazzini e laboratori.',
      en: 'Firmware on Arduino/ESP32 for continuous temperature and humidity readings, with a PID control loop tuned to avoid oscillation and overshoot. The data is exposed over the network for remote monitoring: the same logic applies to cold rooms, warehouses and laboratories.',
    },
    technologies: {
      it: ['Arduino', 'ESP32', 'PID', 'Sensori temperatura/umidità', 'C++'],
      en: ['Arduino', 'ESP32', 'PID', 'Temperature/humidity sensors', 'C++'],
    },
    highlights: {
      it: [
        'Taratura del regolatore PID per una risposta stabile',
        'Lettura periodica dei sensori con filtraggio del rumore',
        'Telemetria via Wi-Fi per il monitoraggio da remoto',
      ],
      en: [
        'PID tuning for a stable response',
        'Periodic sensor sampling with noise filtering',
        'Wi-Fi telemetry for remote monitoring',
      ],
    },
    credit: 'Mahdi Allau',
    year: 2024,
    sortOrder: 3,
  },
  {
    id: 'seed-webapp',
    slug: 'web-application-gestionale',
    liveUrl: '/demo/gestionale',
    title: {
      it: 'Web application gestionale',
      en: 'Business management web application',
    },
    category: {
      it: 'Sviluppo web',
      en: 'Web development',
    },
    summary: {
      it: 'Applicazione Angular con area riservata, anagrafiche e persistenza su PostgreSQL: la base di un gestionale su misura.',
      en: 'An Angular application with a private area, records and PostgreSQL persistence: the base of a bespoke management tool.',
    },
    description: {
      it: 'Single page application in Angular e TypeScript, con routing protetto, form tipizzati e validazione lato client. I dati risiedono su PostgreSQL, con un modello pensato per crescere: ruoli, entità collegate e storico delle modifiche. È il punto di partenza dei gestionali leggeri che realizziamo per le piccole attività.',
      en: 'A single page application in Angular and TypeScript, with guarded routing, typed forms and client-side validation. The data lives on PostgreSQL, with a model built to grow: roles, linked entities and change history. It’s the starting point for the lightweight management tools we build for small businesses.',
    },
    technologies: {
      it: ['Angular', 'TypeScript', 'PostgreSQL'],
      en: ['Angular', 'TypeScript', 'PostgreSQL'],
    },
    highlights: {
      it: [
        'Architettura a componenti standalone e routing protetto',
        'Form tipizzati con validazione e feedback immediato',
        'Schema PostgreSQL normalizzato e query parametriche',
      ],
      en: [
        'Standalone component architecture with guarded routing',
        'Typed forms with validation and immediate feedback',
        'Normalised PostgreSQL schema and parameterised queries',
      ],
    },
    credit: 'Mahdi Allau',
    year: 2025,
    sortOrder: 4,
  },
];

const SERVICES: SeedService[] = [
  {
    id: 'seed-siti-moderni',
    slug: 'siti-web-moderni',
    title: { it: 'Siti web moderni', en: 'Modern websites' },
    tagline: {
      it: 'Veloci, leggibili, curati nel dettaglio.',
      en: 'Fast, readable, finished with care.',
    },
    description: {
      it: 'Siti costruiti a mano, senza temi preconfezionati: caricamento rapido, struttura semantica, testi leggibili su ogni schermo e attenzione all’accessibilità. Il risultato è un sito che resta gradevole anche fra tre anni.',
      en: 'Sites built by hand, with no off-the-shelf theme: fast loading, semantic structure, text that reads well on every screen and real attention to accessibility. The result is a site that still looks good in three years.',
    },
    deliverables: {
      it: [
        'Design su misura, non un template riadattato',
        'Ottimizzazione prestazioni e SEO tecnica di base',
        'Responsive curato da mobile a desktop',
      ],
      en: [
        'Bespoke design, not a reworked template',
        'Performance tuning and technical SEO groundwork',
        'Responsive care from mobile to desktop',
      ],
    },
    icon: 'globe',
    sortOrder: 1,
  },
  {
    id: 'seed-ristoranti',
    slug: 'siti-web-per-ristoranti',
    title: { it: 'Siti web per ristoranti', en: 'Websites for restaurants' },
    tagline: {
      it: 'Menù, orari e prenotazioni sempre aggiornati.',
      en: 'Menu, opening hours and bookings, always current.',
    },
    description: {
      it: 'La specializzazione su cui stiamo costruendo la nostra attività. Il sito mette in primo piano quello che i clienti cercano davvero: il menù aggiornato, dove siete, quando siete aperti e come prenotare. Il menù si modifica dal pannello di amministrazione, senza chiamare nessuno.',
      en: 'The specialisation we’re building our business around. The site puts front and centre what customers actually look for: the current menu, where you are, when you’re open and how to book. The menu is edited from the admin panel, without calling anyone.',
    },
    deliverables: {
      it: [
        'Menù gestibile in autonomia dal pannello admin',
        'Galleria fotografica, orari e mappa integrata',
        'Contatti rapidi: telefono, WhatsApp, richiesta prenotazione',
      ],
      en: [
        'Menu you manage yourself from the admin panel',
        'Photo gallery, opening hours and embedded map',
        'Quick contact: phone, WhatsApp, booking request',
      ],
    },
    icon: 'restaurant',
    sortOrder: 2,
  },
  {
    id: 'seed-webapp',
    slug: 'web-application',
    title: { it: 'Web application', en: 'Web applications' },
    tagline: {
      it: 'Strumenti interni che sostituiscono i fogli di calcolo.',
      en: 'Internal tools that replace the spreadsheets.',
    },
    description: {
      it: 'Gestionali leggeri e applicazioni su misura per il lavoro quotidiano: anagrafiche, ordini, turni, magazzino. Costruiti in Angular con autenticazione, ruoli e dati al sicuro su PostgreSQL.',
      en: 'Lightweight management tools and bespoke applications for day-to-day work: records, orders, shifts, stock. Built in Angular with authentication, roles and data kept safe on PostgreSQL.',
    },
    deliverables: {
      it: [
        'Autenticazione e gestione dei ruoli',
        'Modello dati progettato sul vostro processo reale',
        'Interfaccia pensata per l’uso quotidiano, non per la demo',
      ],
      en: [
        'Authentication and role management',
        'A data model designed around your actual process',
        'An interface built for daily use, not for the demo',
      ],
    },
    icon: 'app',
    sortOrder: 3,
  },
  {
    id: 'seed-dashboard',
    slug: 'dashboard',
    title: { it: 'Dashboard e reportistica', en: 'Dashboards and reporting' },
    tagline: {
      it: 'I numeri dell’attività, letti in trenta secondi.',
      en: 'Your numbers, read in thirty seconds.',
    },
    description: {
      it: 'Raccogliamo i dati che già producete — incassi, coperti, ordini, consumi — e li trasformiamo in un cruscotto chiaro. Niente esportazioni manuali ogni lunedì mattina: gli indicatori si aggiornano da soli.',
      en: 'We take the data you already produce — takings, covers, orders, consumption — and turn it into a clear dashboard. No manual exports every Monday morning: the indicators update themselves.',
    },
    deliverables: {
      it: [
        'Integrazione delle sorgenti dati esistenti',
        'Indicatori e grafici sulle metriche che contano',
        'Aggiornamento automatico e accesso da qualsiasi dispositivo',
      ],
      en: [
        'Integration of your existing data sources',
        'Indicators and charts on the metrics that matter',
        'Automatic refresh and access from any device',
      ],
    },
    icon: 'chart',
    sortOrder: 4,
  },
  {
    id: 'seed-custom',
    slug: 'soluzioni-digitali-personalizzate',
    title: { it: 'Soluzioni digitali personalizzate', en: 'Custom digital solutions' },
    tagline: {
      it: 'Quando serve qualcosa che non esiste già.',
      en: 'For when you need something that doesn’t exist yet.',
    },
    description: {
      it: 'Automazioni, integrazioni fra sistemi, prototipi hardware/software. Se il problema è specifico, partiamo da un’analisi breve e concreta e costruiamo solo quello che serve davvero.',
      en: 'Automations, integrations between systems, hardware/software prototypes. If the problem is specific, we start with a short, concrete analysis and build only what’s genuinely needed.',
    },
    deliverables: {
      it: [
        'Analisi iniziale e proposta senza impegno',
        'Sviluppo per passi, con qualcosa di utilizzabile presto',
        'Documentazione e passaggio di consegne',
      ],
      en: [
        'Initial analysis and a no-obligation proposal',
        'Development in steps, with something usable early',
        'Documentation and a proper handover',
      ],
    },
    icon: 'spark',
    sortOrder: 5,
  },
];

export function seedProjects(lang: Lang): Project[] {
  return PROJECTS.map((project) => ({
    id: project.id,
    slug: project.slug,
    title: project.title[lang],
    category: project.category[lang],
    summary: project.summary[lang],
    description: project.description[lang],
    technologies: project.technologies[lang],
    highlights: project.highlights[lang],
    imageUrl: null,
    repoUrl: null,
    liveUrl: project.liveUrl ?? null,
    credit: project.credit ?? null,
    year: project.year,
    featured: true,
    sortOrder: project.sortOrder,
  }));
}

export function seedServices(lang: Lang): ServiceOffer[] {
  return SERVICES.map((service) => ({
    id: service.id,
    slug: service.slug,
    title: service.title[lang],
    tagline: service.tagline[lang],
    description: service.description[lang],
    deliverables: service.deliverables[lang],
    icon: service.icon,
    sortOrder: service.sortOrder,
  }));
}

/* L'elenco completo di linguaggi e strumenti stava qui: è stato tolto
   insieme alla sezione "Lo strumentario completo" di Chi siamo. Un elenco
   di tecnologie invecchia a ogni cambio di stack e non dice niente al
   cliente tipo di questo sito. Le tecnologie restano dove servono
   davvero: sulle schede dei singoli progetti. */
