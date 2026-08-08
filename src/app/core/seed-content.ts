import { Project, ServiceOffer, SkillGroup } from './models';

/**
 * Contenuti di partenza, presi dal CV.
 *
 * Servono a due cose: il sito è completo e navigabile anche senza Supabase
 * configurato, e `supabase/schema.sql` usa gli stessi record come seed del
 * database, così i due mondi restano allineati.
 */

export const SEED_PROJECTS: Project[] = [
  {
    id: 'seed-dashboard',
    slug: 'dashboard-dati',
    title: 'Dashboard analitica per dati operativi',
    category: 'Data & Business Intelligence',
    summary:
      'Pipeline di raccolta dati e cruscotto di monitoraggio per leggere l’andamento di un’attività senza aprire un foglio di calcolo.',
    description:
      'Un progetto end-to-end sul dato: importazione e pulizia con Python, modellazione su PostgreSQL con query SQL ottimizzate per le aggregazioni ricorrenti, e presentazione in Power BI con indicatori aggiornati. L’obiettivo è ridurre il tempo speso a compilare report manuali e rendere i numeri leggibili anche a chi non è tecnico.',
    technologies: ['Python', 'SQL', 'PostgreSQL', 'Power BI'],
    highlights: [
      'Importazione e normalizzazione dei dati grezzi in Python',
      'Modello relazionale su PostgreSQL con viste per le metriche chiave',
      'Cruscotto Power BI con indicatori e filtri per periodo',
    ],
    imageUrl: null,
    repoUrl: null,
    liveUrl: null,
    year: 2025,
    featured: true,
    sortOrder: 1,
  },
  {
    id: 'seed-iot',
    slug: 'iot-controllo-ambientale',
    title: 'Sistema IoT di controllo temperatura e umidità',
    category: 'IoT & Sistemi embedded',
    summary:
      'Centralina basata su ESP32 che legge i sensori ambientali e mantiene i valori nel range impostato con un regolatore PID.',
    description:
      'Firmware su Arduino/ESP32 per la lettura continua di sensori di temperatura e umidità, con un anello di controllo PID tarato per evitare oscillazioni e sovra-correzioni. I dati vengono esposti in rete per il monitoraggio remoto: la stessa logica è applicabile a celle frigorifere, magazzini e laboratori.',
    technologies: ['Arduino', 'ESP32', 'PID', 'Sensori temperatura/umidità', 'C++'],
    highlights: [
      'Taratura del regolatore PID per una risposta stabile',
      'Lettura periodica dei sensori con filtraggio del rumore',
      'Telemetria via Wi-Fi per il monitoraggio da remoto',
    ],
    imageUrl: null,
    repoUrl: null,
    liveUrl: null,
    year: 2024,
    featured: true,
    sortOrder: 2,
  },
  {
    id: 'seed-webapp',
    slug: 'web-application-gestionale',
    title: 'Web application gestionale',
    category: 'Sviluppo web',
    summary:
      'Applicazione Angular con area riservata, anagrafiche e persistenza su PostgreSQL: la base di un gestionale su misura.',
    description:
      'Single page application in Angular e TypeScript, con routing protetto, form tipizzati e validazione lato client. I dati risiedono su PostgreSQL, con un modello pensato per crescere: ruoli, entità collegate e storico delle modifiche. È il punto di partenza dei gestionali leggeri che realizzo per le piccole attività.',
    technologies: ['Angular', 'TypeScript', 'PostgreSQL'],
    highlights: [
      'Architettura a componenti standalone e routing protetto',
      'Form tipizzati con validazione e feedback immediato',
      'Schema PostgreSQL normalizzato e query parametriche',
    ],
    imageUrl: null,
    repoUrl: null,
    liveUrl: null,
    year: 2025,
    featured: true,
    sortOrder: 3,
  },
];

export const SEED_SERVICES: ServiceOffer[] = [
  {
    id: 'seed-siti-moderni',
    slug: 'siti-web-moderni',
    title: 'Siti web moderni',
    tagline: 'Veloci, leggibili, curati nel dettaglio.',
    description:
      'Siti costruiti a mano, senza temi preconfezionati: caricamento rapido, struttura semantica, testi leggibili su ogni schermo e attenzione all’accessibilità. Il risultato è un sito che resta gradevole anche fra tre anni.',
    deliverables: [
      'Design su misura, non un template riadattato',
      'Ottimizzazione prestazioni e SEO tecnica di base',
      'Responsive curato da mobile a desktop',
    ],
    icon: 'globe',
    sortOrder: 1,
  },
  {
    id: 'seed-ristoranti',
    slug: 'siti-web-per-ristoranti',
    title: 'Siti web per ristoranti',
    tagline: 'Menù, orari e prenotazioni sempre aggiornati.',
    description:
      'La specializzazione su cui sto costruendo la mia attività. Il sito mette in primo piano quello che i clienti cercano davvero: il menù aggiornato, dove siete, quando siete aperti e come prenotare. Il menù si modifica dal pannello di amministrazione, senza chiamare nessuno.',
    deliverables: [
      'Menù gestibile in autonomia dal pannello admin',
      'Galleria fotografica, orari e mappa integrata',
      'Contatti rapidi: telefono, WhatsApp, richiesta prenotazione',
    ],
    icon: 'restaurant',
    sortOrder: 2,
  },
  {
    id: 'seed-webapp',
    slug: 'web-application',
    title: 'Web application',
    tagline: 'Strumenti interni che sostituiscono i fogli di calcolo.',
    description:
      'Gestionali leggeri e applicazioni su misura per il lavoro quotidiano: anagrafiche, ordini, turni, magazzino. Costruiti in Angular con autenticazione, ruoli e dati al sicuro su PostgreSQL.',
    deliverables: [
      'Autenticazione e gestione dei ruoli',
      'Modello dati progettato sul vostro processo reale',
      'Interfaccia pensata per l’uso quotidiano, non per la demo',
    ],
    icon: 'app',
    sortOrder: 3,
  },
  {
    id: 'seed-dashboard',
    slug: 'dashboard',
    title: 'Dashboard e reportistica',
    tagline: 'I numeri dell’attività, letti in trenta secondi.',
    description:
      'Raccolgo i dati che già producete — incassi, coperti, ordini, consumi — e li trasformo in un cruscotto chiaro. Niente esportazioni manuali ogni lunedì mattina: gli indicatori si aggiornano da soli.',
    deliverables: [
      'Integrazione delle sorgenti dati esistenti',
      'Indicatori e grafici sulle metriche che contano',
      'Aggiornamento automatico e accesso da qualsiasi dispositivo',
    ],
    icon: 'chart',
    sortOrder: 4,
  },
  {
    id: 'seed-custom',
    slug: 'soluzioni-digitali-personalizzate',
    title: 'Soluzioni digitali personalizzate',
    tagline: 'Quando serve qualcosa che non esiste già.',
    description:
      'Automazioni, integrazioni fra sistemi, prototipi hardware/software. Se il problema è specifico, partiamo da un’analisi breve e concreta e costruiamo solo quello che serve davvero.',
    deliverables: [
      'Analisi iniziale e proposta senza impegno',
      'Sviluppo per passi, con qualcosa di utilizzabile presto',
      'Documentazione e passaggio di consegne',
    ],
    icon: 'spark',
    sortOrder: 5,
  },
];

export const SKILL_GROUPS: SkillGroup[] = [
  {
    label: 'Frontend',
    items: ['Angular', 'TypeScript', 'Tailwind CSS', 'HTML5 semantico', 'CSS moderno', 'Vite'],
  },
  {
    label: 'Backend & dati',
    items: ['Supabase', 'Supabase Auth', 'Supabase Storage', 'PostgreSQL', 'SQL', 'Python'],
  },
  {
    label: 'Linguaggi',
    items: ['Java', 'C', 'C++', 'Python', 'TypeScript', 'MATLAB'],
  },
  {
    label: 'IoT & analisi',
    items: ['Arduino', 'ESP32', 'PID', 'Sensori temperatura/umidità', 'Power BI'],
  },
  {
    label: 'Strumenti',
    items: ['Git', 'GitHub', 'Vite', 'Power BI'],
  },
];

/** Fasi mostrate nella sezione "Come lavoro" della home. */
export const WORK_PROCESS = [
  {
    step: '01',
    title: 'Ascolto',
    body: 'Una chiamata per capire l’attività, chi sono i clienti e cosa deve fare il sito. Senza gergo tecnico.',
  },
  {
    step: '02',
    title: 'Proposta',
    body: 'Struttura delle pagine, tempi e costo chiaro. Se il progetto non ha senso, lo dico prima di iniziare.',
  },
  {
    step: '03',
    title: 'Costruzione',
    body: 'Sviluppo per passi, con un’anteprima online da vedere e commentare durante il lavoro.',
  },
  {
    step: '04',
    title: 'Consegna',
    body: 'Pubblicazione, pannello per aggiornare i contenuti in autonomia e assistenza nei primi mesi.',
  },
];
