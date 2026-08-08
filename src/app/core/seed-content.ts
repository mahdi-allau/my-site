import { Lang } from './i18n/i18n.service';
import { Project, ServiceOffer, SkillGroup } from './models';

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
    id: 'seed-dashboard',
    slug: 'dashboard-dati',
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
    year: 2025,
    sortOrder: 1,
  },
  {
    id: 'seed-iot',
    slug: 'iot-controllo-ambientale',
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
    year: 2024,
    sortOrder: 2,
  },
  {
    id: 'seed-webapp',
    slug: 'web-application-gestionale',
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
      it: 'Single page application in Angular e TypeScript, con routing protetto, form tipizzati e validazione lato client. I dati risiedono su PostgreSQL, con un modello pensato per crescere: ruoli, entità collegate e storico delle modifiche. È il punto di partenza dei gestionali leggeri che realizzo per le piccole attività.',
      en: 'A single page application in Angular and TypeScript, with guarded routing, typed forms and client-side validation. The data lives on PostgreSQL, with a model built to grow: roles, linked entities and change history. It’s the starting point for the lightweight management tools I build for small businesses.',
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
    year: 2025,
    sortOrder: 3,
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
      it: 'La specializzazione su cui sto costruendo la mia attività. Il sito mette in primo piano quello che i clienti cercano davvero: il menù aggiornato, dove siete, quando siete aperti e come prenotare. Il menù si modifica dal pannello di amministrazione, senza chiamare nessuno.',
      en: 'The specialisation I’m building my business around. The site puts front and centre what customers actually look for: the current menu, where you are, when you’re open and how to book. The menu is edited from the admin panel, without calling anyone.',
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
      it: 'Raccolgo i dati che già producete — incassi, coperti, ordini, consumi — e li trasformo in un cruscotto chiaro. Niente esportazioni manuali ogni lunedì mattina: gli indicatori si aggiornano da soli.',
      en: 'I take the data you already produce — takings, covers, orders, consumption — and turn it into a clear dashboard. No manual exports every Monday morning: the indicators update themselves.',
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
    liveUrl: null,
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

/** Le etichette dei gruppi sono chiavi di traduzione; i nomi degli
 *  strumenti restano invariati nelle due lingue. */
export const SKILL_GROUPS: SkillGroup[] = [
  {
    labelKey: 'skills.frontend',
    items: ['Angular', 'TypeScript', 'Tailwind CSS', 'HTML5', 'CSS', 'Vite'],
  },
  {
    labelKey: 'skills.backend',
    items: ['Supabase', 'Supabase Auth', 'Supabase Storage', 'PostgreSQL', 'SQL', 'Python'],
  },
  {
    labelKey: 'skills.languages',
    items: ['Java', 'C', 'C++', 'Python', 'TypeScript', 'MATLAB'],
  },
  {
    labelKey: 'skills.iot',
    items: ['Arduino', 'ESP32', 'PID', 'Power BI'],
  },
  {
    labelKey: 'skills.tools',
    items: ['Git', 'GitHub', 'Vite', 'Power BI'],
  },
];
