import { Lang } from './i18n.service';

/**
 * Testi del sito pubblico nelle due lingue.
 *
 * L'area amministrativa resta in italiano: la usa solo chi gestisce il sito.
 *
 * Convenzione delle chiavi: `sezione.blocco.campo`. I titoli che entrano
 * parola per parola sono salvati interi, e la parola da evidenziare sta in
 * una chiave `.accent` separata — così la traduzione può spostarla dove
 * serve nella frase.
 */
export const TRANSLATIONS: Record<Lang, Record<string, string>> = {
  // ==================================================================
  // ITALIANO
  // ==================================================================
  it: {
    'lang.switch': 'Cambia lingua',
    'lang.it': 'Italiano',
    'lang.en': 'Inglese',

    'nav.home': 'Home',
    'nav.about': 'Chi sono',
    'nav.projects': 'Progetti',
    'nav.services': 'Servizi',
    'nav.contact': 'Contatti',
    'nav.cta': 'Parliamone',
    'nav.role': 'Sviluppo web',
    'nav.open': 'Apri il menù',
    'nav.close': 'Chiudi il menù',
    'nav.skip': 'Salta al contenuto',
    'nav.mobileTagline': 'Siti web per ristoranti e piccole aziende',

    'common.loading': 'Caricamento…',
    'common.discover': 'Scopri',
    'common.required': 'I campi con * sono obbligatori.',

    'home.hero.badge': 'Disponibile per nuovi progetti',
    'home.hero.title': 'Siti web su misura per ristoranti e piccole aziende.',
    'home.hero.accent': 'ristoranti',
    'home.hero.subtitle':
      'Sono Mahdi Allau, sviluppatore. Progetto e realizzo siti, web application e dashboard: dal primo schizzo alla messa online, con un pannello che ti permette di aggiornare i contenuti da solo, quando vuoi.',
    'home.hero.ctaPrimary': 'Richiedi un preventivo',
    'home.hero.ctaSecondary': 'Guarda i progetti',
    'home.hero.stat1Label': 'Stack',
    'home.hero.stat1Value': 'Angular · TypeScript · Supabase',
    'home.hero.stat2Label': 'Approccio',
    'home.hero.stat2Value': 'Codice scritto a mano',
    'home.hero.stat3Label': 'Incluso',
    'home.hero.stat3Value': 'Pannello di gestione',

    'preview.eyebrow': 'Come nasce',
    'preview.title': 'Dal foglio bianco al sito online.',
    'preview.accent': 'sito online',
    'preview.body':
      'Ogni progetto parte dalla struttura, non dalla grafica: prima si decide cosa deve trovare il cliente e in che ordine, poi si veste. Quello che vedi qui accanto è il montaggio di una pagina, passo dopo passo.',
    'preview.url': 'iltuoristorante.it',
    'preview.navHome': 'Home',
    'preview.navMenu': 'Menù',
    'preview.navBook': 'Prenota',
    'preview.heroLine': 'La cucina di casa, in centro',
    'preview.dish1': 'Antipasti',
    'preview.dish2': 'Primi',
    'preview.dish3': 'Dolci',
    'preview.cta': 'Prenota un tavolo',
    'preview.caption': 'Anteprima animata · struttura di un sito per ristorante',
    'preview.step1': 'Struttura',
    'preview.step2': 'Contenuti',
    'preview.step3': 'Online',

    'home.services.eyebrow': 'Cosa faccio',
    'home.services.titleA': 'Dal sito vetrina',
    'home.services.titleB': 'al',
    'home.services.titleAccent': 'gestionale interno',
    'home.services.link': 'Tutti i servizi',

    'home.projects.eyebrow': 'Portfolio',
    'home.projects.titleA': 'Progetti',
    'home.projects.titleAccent': 'in evidenza',
    'home.projects.link': 'Tutti i progetti',
    'home.projects.empty': 'Nessun progetto pubblicato al momento.',

    'home.process.eyebrow': 'Come lavoro',
    'home.process.titleA': 'Quattro passi,',
    'home.process.titleAccent': 'nessuna sorpresa',
    'process.1.title': 'Ascolto',
    'process.1.body':
      'Una chiamata per capire l’attività, chi sono i clienti e cosa deve fare il sito. Senza gergo tecnico.',
    'process.2.title': 'Proposta',
    'process.2.body':
      'Struttura delle pagine, tempi e costo chiaro. Se il progetto non ha senso, lo dico prima di iniziare.',
    'process.3.title': 'Costruzione',
    'process.3.body':
      'Sviluppo per passi, con un’anteprima online da vedere e commentare durante il lavoro.',
    'process.4.title': 'Consegna',
    'process.4.body':
      'Pubblicazione, pannello per aggiornare i contenuti in autonomia e assistenza nei primi mesi.',

    'benefits.eyebrow': 'Il ritorno',
    'benefits.titleA': 'Un sito non è una spesa.',
    'benefits.titleB': 'È uno strumento che',
    'benefits.titleAccent': 'lavora per te',
    'benefits.body':
      'Un sito fatto bene non serve a “esserci”. Serve a togliere lavoro a te e a rendere più semplice, per chi ti cerca, arrivare fino al tavolo.',
    'benefits.cta': 'Vediamo cosa serve a te',
    'benefits.1.title': 'Prenotazioni che arrivano dirette',
    'benefits.1.body':
      'Ogni prenotazione che passa dal tuo sito è una commissione in meno lasciata ai portali. Il cliente resta tuo, e anche il suo contatto.',
    'benefits.2.title': 'Ti trovano quando ti cercano',
    'benefits.2.body':
      'Pagine veloci, struttura corretta e dati del locale scritti come Google se li aspetta: è quello che serve per comparire a chi cerca nella tua zona.',
    'benefits.3.title': 'Meno telefonate per le solite domande',
    'benefits.3.body':
      'Orari, menù, allergeni, parcheggio, come arrivare. Scritti bene una volta, rispondono da soli tutti i giorni al posto tuo.',
    'benefits.4.title': 'Aggiorni tutto in due minuti',
    'benefits.4.body':
      'Il menù cambia con la stagione, non con il preventivo dell’agenzia. Entri nel pannello, modifichi, salvi. Nessun costo per ogni ritocco.',

    'home.cta.titleA': 'Hai un’attività e un sito',
    'home.cta.titleB': 'che non ti',
    'home.cta.titleAccent': 'rappresenta',
    'home.cta.body':
      'Raccontami cosa ti serve. Ti rispondo con una proposta concreta: struttura, tempi e costo, senza impegno.',
    'home.cta.primary': 'Scrivimi',
    'home.cta.secondary': 'Vedi i servizi',

    'about.eyebrow': 'Chi sono',
    'about.title': 'Costruisco cose che devono funzionare il lunedì mattina.',
    'about.accent': 'il lunedì mattina.',
    'about.p1':
      'Mi chiamo Mahdi Allau e sviluppo software. Vengo da un percorso tecnico che tocca tre mondi — il web, i dati e i sistemi embedded — e oggi metto insieme queste competenze per costruire siti e strumenti digitali per ristoranti e piccole aziende.',
    'about.p2':
      'Questo sito è insieme il mio portfolio e la vetrina della mia attività: è stato costruito da zero con lo stesso stack che uso per i clienti.',
    'about.ctaPrimary': 'Lavoriamo insieme',
    'about.ctaSecondary': 'Cosa ho costruito',
    'about.summary': 'In sintesi',
    'about.roleLabel': 'Ruolo',
    'about.roleValue': 'Sviluppatore web full-stack',
    'about.focusLabel': 'Specializzazione',
    'about.focusValue': 'Siti e web app per ristorazione e piccole imprese',
    'about.stackLabel': 'Stack principale',
    'about.stackValue': 'Angular, TypeScript, Tailwind CSS, Supabase, PostgreSQL',
    'about.otherLabel': 'Altri ambiti',
    'about.otherValue': 'Python e SQL per i dati, Arduino/ESP32 per l’IoT',
    'about.path.eyebrow': 'Il percorso',
    'about.path.titleA': 'Tre ambiti,',
    'about.path.titleB': 'un modo di ragionare.',
    'about.area1.title': 'Sviluppo web',
    'about.area1.body':
      'Angular e TypeScript per interfacce che restano veloci e ordinate anche quando il progetto cresce. PostgreSQL e Supabase per i dati, l’autenticazione e i file.',
    'about.area2.title': 'Dati e analisi',
    'about.area2.body':
      'Raccolta, pulizia e modellazione dei dati con Python e SQL, per arrivare a dashboard che rispondono alle domande vere di un’attività invece di riempire pagine di grafici.',
    'about.area3.title': 'Sistemi embedded e IoT',
    'about.area3.body':
      'Firmware su Arduino ed ESP32, lettura di sensori e regolazione con controllo PID. È la parte del mio percorso che mi ha insegnato a lavorare con vincoli stretti e a testare sul campo.',
    'about.method.eyebrow': 'Metodo',
    'about.method.titleA': 'Quattro cose su cui',
    'about.method.titleB': 'non transigo.',
    'about.principle1.title': 'Prima il problema, poi la tecnologia',
    'about.principle1.body':
      'Scelgo lo strumento dopo aver capito cosa serve. A volte la risposta giusta è una pagina statica, non un’applicazione.',
    'about.principle2.title': 'Niente template riadattati',
    'about.principle2.body':
      'Ogni sito viene costruito partendo dal contenuto reale dell’attività. Si vede, e soprattutto si sente nella velocità di caricamento.',
    'about.principle3.title': 'Autonomia dopo la consegna',
    'about.principle3.body':
      'Il pannello di amministrazione fa parte del progetto: menù, foto e testi si aggiornano senza dover chiamare nessuno.',
    'about.principle4.title': 'Parlare chiaro',
    'about.principle4.body':
      'Preventivi leggibili, tempi realistici e nessun gergo inutile. Se qualcosa non conviene farla, lo dico.',
    'about.skills.eyebrow': 'Competenze tecniche',
    'about.skills.title': 'Lo strumentario completo.',
    'skills.frontend': 'Frontend',
    'skills.backend': 'Backend e dati',
    'skills.languages': 'Linguaggi',
    'skills.iot': 'IoT e analisi',
    'skills.tools': 'Strumenti',

    'projects.eyebrow': 'Portfolio',
    'projects.title': 'Progetti.',
    'projects.subtitle':
      'Una selezione di lavori che raccontano come affronto un problema: dal dato grezzo alla dashboard, dal sensore all’interfaccia, dall’idea al sito online.',
    'projects.filterAll': 'Tutti',
    'projects.filterLabel': 'Filtra i progetti per categoria',
    'projects.emptyCategory': 'Nessun progetto in questa categoria.',
    'projects.ctaTitleA': 'Il prossimo progetto',
    'projects.ctaTitleB': 'potrebbe essere il',
    'projects.ctaAccent': 'tuo',
    'projects.ctaBody':
      'Raccontami cosa ti serve: ti rispondo con una proposta chiara su struttura, tempi e costo.',
    'projects.ctaButton': 'Parliamone',
    'projects.viewLive': 'Vedi il progetto',
    'projects.viewCode': 'Codice sorgente',

    'services.eyebrow': 'Servizi',
    'services.title': 'Cosa posso costruire per te.',
    'services.accent': 'per te.',
    'services.subtitle':
      'Dal sito vetrina che presenta l’attività fino allo strumento interno che ti fa risparmiare ore ogni settimana. Sempre su misura, mai un tema comprato e riadattato.',
    'services.includes': 'Cosa comprende',
    'services.empty': 'Nessun servizio pubblicato al momento.',
    'services.faq.eyebrow': 'Domande frequenti',
    'services.faq.title': 'Le cose che mi chiedono sempre.',
    'services.faq.body':
      'Se la tua domanda non è qui, scrivimi: rispondo anche solo per capire se posso esserti utile.',
    'services.faq.cta': 'Fai la tua domanda',
    'faq.1.q': 'Quanto costa un sito?',
    'faq.1.a':
      'Dipende da quante pagine servono e da cosa deve fare il sito. Dopo una prima chiacchierata invio un preventivo scritto con voce per voce, così sai esattamente cosa stai comprando.',
    'faq.2.q': 'Posso aggiornare i contenuti da solo?',
    'faq.2.a':
      'Sì, è il punto. Ogni progetto include un pannello di amministrazione riservato dove modificare testi, foto e — per i ristoranti — il menù, senza toccare il codice.',
    'faq.3.q': 'Vi occupate anche del dominio e dell’hosting?',
    'faq.3.a':
      'Sì. Posso registrare il dominio, configurare la pubblicazione e le caselle email, e lasciare tutto intestato a te: gli accessi restano tuoi.',
    'faq.4.q': 'Quanto tempo serve?',
    'faq.4.a':
      'Un sito vetrina ben fatto richiede in genere qualche settimana, una web application di più. I tempi precisi finiscono nel preventivo, non li scopri strada facendo.',

    'contact.eyebrow': 'Contatti',
    'contact.title': 'Raccontami il tuo progetto.',
    'contact.accent': 'progetto.',
    'contact.subtitle':
      'Bastano due righe per iniziare. Ti rispondo con qualche domanda mirata e, se il progetto ha senso, con una proposta chiara su struttura, tempi e costo.',
    'contact.name': 'Nome e cognome *',
    'contact.namePlaceholder': 'Come ti chiami?',
    'contact.nameError': 'Inserisci almeno 2 caratteri.',
    'contact.email': 'Email *',
    'contact.emailPlaceholder': 'dove ti rispondo',
    'contact.emailError': 'Controlla l’indirizzo email.',
    'contact.company': 'Attività',
    'contact.companyPlaceholder': 'Nome del locale o dell’azienda',
    'contact.budget': 'Budget indicativo',
    'contact.budgetNone': 'Preferisco non dirlo',
    'contact.message': 'Il progetto *',
    'contact.messagePlaceholder': 'Che attività hai, cosa ti serve e cosa non funziona nel sito attuale.',
    'contact.messageError': 'Scrivi almeno 20 caratteri, così capisco di cosa si tratta.',
    'contact.submit': 'Invia il messaggio',
    'contact.sending': 'Invio in corso…',
    'contact.sentTitle': 'Messaggio ricevuto.',
    'contact.sentBody': 'Grazie. Ti rispondo appena possibile, di solito entro un paio di giorni lavorativi.',
    'contact.sentAgain': 'Invia un altro messaggio',
    'contact.mailtoTitle': 'Sto aprendo il tuo client di posta.',
    'contact.mailtoBody': 'Se non si è aperto nulla, scrivimi direttamente a',
    'contact.mailtoBack': 'Torna al modulo',
    'contact.errorPrefix': 'Non sono riuscito a inviare il messaggio:',
    'contact.errorSuffix': 'Puoi scrivermi direttamente a',
    'contact.directTitle': 'Scrivimi direttamente',
    'contact.nextTitle': 'Cosa succede dopo',
    'contact.next1': 'Leggo il messaggio e ti rispondo con qualche domanda per capire meglio.',
    'contact.next2': 'Ci sentiamo per una chiamata di venti minuti, senza impegno.',
    'contact.next3': 'Ricevi un preventivo scritto con struttura, tempi e costo voce per voce.',
    'contact.replyTitle': 'Tempi di risposta',
    'contact.replyBody':
      'Di norma rispondo entro uno o due giorni lavorativi. Se hai una scadenza stretta, scrivilo nel messaggio.',
    'contact.budget1': 'Non lo so ancora',
    'contact.budget2': 'Meno di 1.000 €',
    'contact.budget3': '1.000 – 2.500 €',
    'contact.budget4': '2.500 – 5.000 €',
    'contact.budget5': 'Oltre 5.000 €',

    'footer.description':
      'Sviluppo siti web, web application e dashboard su misura per ristoranti e piccole aziende. Codice scritto a mano, senza template preconfezionati.',
    'footer.site': 'Il sito',
    'footer.contacts': 'Contatti',
    'footer.quote': 'Richiedi un preventivo',
    'footer.admin': 'Area riservata',
    'footer.rights': 'Tutti i diritti riservati.',
    'footer.builtWith': 'Costruito con Angular, Tailwind CSS e Supabase.',

    'notfound.eyebrow': 'Errore 404',
    'notfound.titleA': 'Questa pagina',
    'notfound.titleAccent': 'non esiste.',
    'notfound.body':
      'Forse il link è vecchio o c’è un refuso nell’indirizzo. Da qui puoi tornare alla home o guardare i progetti.',
    'notfound.home': 'Torna alla home',
    'notfound.projects': 'Vedi i progetti',
  },

  // ==================================================================
  // ENGLISH
  // ==================================================================
  en: {
    'lang.switch': 'Change language',
    'lang.it': 'Italian',
    'lang.en': 'English',

    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.projects': 'Work',
    'nav.services': 'Services',
    'nav.contact': 'Contact',
    'nav.cta': 'Let’s talk',
    'nav.role': 'Web development',
    'nav.open': 'Open menu',
    'nav.close': 'Close menu',
    'nav.skip': 'Skip to content',
    'nav.mobileTagline': 'Websites for restaurants and small businesses',

    'common.loading': 'Loading…',
    'common.discover': 'Learn more',
    'common.required': 'Fields marked * are required.',

    'home.hero.badge': 'Available for new projects',
    'home.hero.title': 'Websites built to measure for restaurants and small businesses.',
    'home.hero.accent': 'restaurants',
    'home.hero.subtitle':
      'I’m Mahdi Allau, a developer. I design and build websites, web applications and dashboards — from the first sketch to going live, with a panel that lets you update the content yourself, whenever you want.',
    'home.hero.ctaPrimary': 'Request a quote',
    'home.hero.ctaSecondary': 'See the work',
    'home.hero.stat1Label': 'Stack',
    'home.hero.stat1Value': 'Angular · TypeScript · Supabase',
    'home.hero.stat2Label': 'Approach',
    'home.hero.stat2Value': 'Hand-written code',
    'home.hero.stat3Label': 'Included',
    'home.hero.stat3Value': 'Admin panel',

    'preview.eyebrow': 'How it’s made',
    'preview.title': 'From blank page to live site.',
    'preview.accent': 'live site',
    'preview.body':
      'Every project starts with structure, not decoration: first we decide what your customer needs to find and in what order, then we dress it. What you see here is a page being assembled, step by step.',
    'preview.url': 'yourrestaurant.com',
    'preview.navHome': 'Home',
    'preview.navMenu': 'Menu',
    'preview.navBook': 'Book',
    'preview.heroLine': 'Home cooking, in the old town',
    'preview.dish1': 'Starters',
    'preview.dish2': 'Mains',
    'preview.dish3': 'Desserts',
    'preview.cta': 'Book a table',
    'preview.caption': 'Animated preview · structure of a restaurant website',
    'preview.step1': 'Structure',
    'preview.step2': 'Content',
    'preview.step3': 'Live',

    'home.services.eyebrow': 'What I do',
    'home.services.titleA': 'From the shop window',
    'home.services.titleB': 'to the',
    'home.services.titleAccent': 'tool you run on',
    'home.services.link': 'All services',

    'home.projects.eyebrow': 'Portfolio',
    'home.projects.titleA': 'Selected',
    'home.projects.titleAccent': 'work',
    'home.projects.link': 'All projects',
    'home.projects.empty': 'No projects published yet.',

    'home.process.eyebrow': 'How I work',
    'home.process.titleA': 'Four steps,',
    'home.process.titleAccent': 'no surprises',
    'process.1.title': 'Listening',
    'process.1.body':
      'A call to understand the business, who your customers are and what the site has to do. No technical jargon.',
    'process.2.title': 'Proposal',
    'process.2.body':
      'Page structure, timeline and a clear price. If the project doesn’t make sense, I say so before we start.',
    'process.3.title': 'Building',
    'process.3.body':
      'Development in steps, with a live preview you can look at and comment on while the work happens.',
    'process.4.title': 'Handover',
    'process.4.body':
      'Publication, a panel to update the content yourself, and support through the first months.',

    'benefits.eyebrow': 'The return',
    'benefits.titleA': 'A website isn’t a cost.',
    'benefits.titleB': 'It’s a tool that',
    'benefits.titleAccent': 'works for you',
    'benefits.body':
      'A good website isn’t about “being online”. It’s about taking work off your plate and making it effortless, for anyone looking for you, to end up at your table.',
    'benefits.cta': 'Let’s see what you need',
    'benefits.1.title': 'Bookings that come to you directly',
    'benefits.1.body':
      'Every booking made through your own site is a commission you don’t hand to a platform. The customer stays yours — and so does their contact.',
    'benefits.2.title': 'Found when people search',
    'benefits.2.body':
      'Fast pages, correct structure and your venue details written the way Google expects them: that’s what it takes to show up for people searching in your area.',
    'benefits.3.title': 'Fewer calls asking the same things',
    'benefits.3.body':
      'Opening hours, menu, allergens, parking, directions. Written well once, they answer for you every single day.',
    'benefits.4.title': 'Update anything in two minutes',
    'benefits.4.body':
      'The menu changes with the season, not with an agency quote. Log in, edit, save. No fee for every small change.',

    'home.cta.titleA': 'Got a business and a website',
    'home.cta.titleB': 'that doesn’t',
    'home.cta.titleAccent': 'represent you',
    'home.cta.body':
      'Tell me what you need. I’ll come back with something concrete: structure, timeline and price, no strings attached.',
    'home.cta.primary': 'Get in touch',
    'home.cta.secondary': 'See the services',

    'about.eyebrow': 'About',
    'about.title': 'I build things that have to work on Monday morning.',
    'about.accent': 'on Monday morning.',
    'about.p1':
      'My name is Mahdi Allau and I build software. I come from a technical path that spans three worlds — the web, data, and embedded systems — and today I bring those together to build websites and digital tools for restaurants and small businesses.',
    'about.p2':
      'This site is both my portfolio and the shop window for my work: it was built from scratch with the same stack I use for clients.',
    'about.ctaPrimary': 'Let’s work together',
    'about.ctaSecondary': 'What I’ve built',
    'about.summary': 'At a glance',
    'about.roleLabel': 'Role',
    'about.roleValue': 'Full-stack web developer',
    'about.focusLabel': 'Focus',
    'about.focusValue': 'Sites and web apps for hospitality and small business',
    'about.stackLabel': 'Main stack',
    'about.stackValue': 'Angular, TypeScript, Tailwind CSS, Supabase, PostgreSQL',
    'about.otherLabel': 'Also',
    'about.otherValue': 'Python and SQL for data, Arduino/ESP32 for IoT',
    'about.path.eyebrow': 'The path',
    'about.path.titleA': 'Three fields,',
    'about.path.titleB': 'one way of thinking.',
    'about.area1.title': 'Web development',
    'about.area1.body':
      'Angular and TypeScript for interfaces that stay fast and tidy as a project grows. PostgreSQL and Supabase for data, authentication and files.',
    'about.area2.title': 'Data and analysis',
    'about.area2.body':
      'Collecting, cleaning and modelling data with Python and SQL, to reach dashboards that answer a business’s real questions instead of filling pages with charts.',
    'about.area3.title': 'Embedded systems and IoT',
    'about.area3.body':
      'Firmware on Arduino and ESP32, sensor readings and PID control loops. This is the part of my path that taught me to work under tight constraints and to test in the field.',
    'about.method.eyebrow': 'Method',
    'about.method.titleA': 'Four things I',
    'about.method.titleB': 'won’t compromise on.',
    'about.principle1.title': 'The problem first, the technology after',
    'about.principle1.body':
      'I pick the tool once I understand what’s needed. Sometimes the right answer is a static page, not an application.',
    'about.principle2.title': 'No repurposed templates',
    'about.principle2.body':
      'Every site is built around the real content of the business. You can see it — and above all you can feel it in the loading speed.',
    'about.principle3.title': 'Independence after handover',
    'about.principle3.body':
      'The admin panel is part of the project: menu, photos and text get updated without having to call anyone.',
    'about.principle4.title': 'Plain speaking',
    'about.principle4.body':
      'Readable quotes, realistic timelines and no needless jargon. If something isn’t worth doing, I’ll say so.',
    'about.skills.eyebrow': 'Technical skills',
    'about.skills.title': 'The full toolkit.',
    'skills.frontend': 'Frontend',
    'skills.backend': 'Backend and data',
    'skills.languages': 'Languages',
    'skills.iot': 'IoT and analytics',
    'skills.tools': 'Tools',

    'projects.eyebrow': 'Portfolio',
    'projects.title': 'Work.',
    'projects.subtitle':
      'A selection of projects that show how I approach a problem: from raw data to dashboard, from sensor to interface, from idea to live site.',
    'projects.filterAll': 'All',
    'projects.filterLabel': 'Filter projects by category',
    'projects.emptyCategory': 'No projects in this category.',
    'projects.ctaTitleA': 'The next project',
    'projects.ctaTitleB': 'could be',
    'projects.ctaAccent': 'yours',
    'projects.ctaBody':
      'Tell me what you need: I’ll come back with a clear proposal on structure, timeline and price.',
    'projects.ctaButton': 'Let’s talk',
    'projects.viewLive': 'View the project',
    'projects.viewCode': 'Source code',

    'services.eyebrow': 'Services',
    'services.title': 'What I can build for you.',
    'services.accent': 'for you.',
    'services.subtitle':
      'From the shop-window site that introduces the business to the internal tool that saves you hours every week. Always made to measure, never a bought theme reworked.',
    'services.includes': 'What’s included',
    'services.empty': 'No services published yet.',
    'services.faq.eyebrow': 'Frequently asked',
    'services.faq.title': 'The things people always ask.',
    'services.faq.body':
      'If your question isn’t here, write to me: I’ll reply even just to work out whether I can be useful.',
    'services.faq.cta': 'Ask your question',
    'faq.1.q': 'How much does a website cost?',
    'faq.1.a':
      'It depends on how many pages you need and what the site has to do. After a first conversation I send a written quote, itemised, so you know exactly what you’re buying.',
    'faq.2.q': 'Can I update the content myself?',
    'faq.2.a':
      'Yes — that’s the point. Every project includes a private admin panel where you can edit text, photos and, for restaurants, the menu, without touching any code.',
    'faq.3.q': 'Do you handle the domain and hosting too?',
    'faq.3.a':
      'Yes. I can register the domain, set up publishing and email accounts, and leave everything registered in your name: the credentials stay yours.',
    'faq.4.q': 'How long does it take?',
    'faq.4.a':
      'A well-made shop-window site usually takes a few weeks; a web application takes longer. Exact timings go in the quote — you don’t discover them along the way.',

    'contact.eyebrow': 'Contact',
    'contact.title': 'Tell me about your project.',
    'contact.accent': 'project.',
    'contact.subtitle':
      'Two lines are enough to start. I’ll reply with a few pointed questions and, if the project makes sense, a clear proposal on structure, timeline and price.',
    'contact.name': 'Full name *',
    'contact.namePlaceholder': 'What’s your name?',
    'contact.nameError': 'Please enter at least 2 characters.',
    'contact.email': 'Email *',
    'contact.emailPlaceholder': 'where I should reply',
    'contact.emailError': 'Please check the email address.',
    'contact.company': 'Business',
    'contact.companyPlaceholder': 'Name of the venue or company',
    'contact.budget': 'Rough budget',
    'contact.budgetNone': 'I’d rather not say',
    'contact.message': 'The project *',
    'contact.messagePlaceholder': 'What your business is, what you need, and what isn’t working on your current site.',
    'contact.messageError': 'Please write at least 20 characters so I understand what it’s about.',
    'contact.submit': 'Send message',
    'contact.sending': 'Sending…',
    'contact.sentTitle': 'Message received.',
    'contact.sentBody': 'Thank you. I’ll reply as soon as I can, usually within a couple of working days.',
    'contact.sentAgain': 'Send another message',
    'contact.mailtoTitle': 'Opening your email client.',
    'contact.mailtoBody': 'If nothing opened, write to me directly at',
    'contact.mailtoBack': 'Back to the form',
    'contact.errorPrefix': 'I couldn’t send the message:',
    'contact.errorSuffix': 'You can write to me directly at',
    'contact.directTitle': 'Write to me directly',
    'contact.nextTitle': 'What happens next',
    'contact.next1': 'I read your message and reply with a few questions to understand it better.',
    'contact.next2': 'We have a twenty-minute call, no obligation.',
    'contact.next3': 'You get a written quote with structure, timeline and itemised price.',
    'contact.replyTitle': 'Response time',
    'contact.replyBody':
      'I normally reply within one or two working days. If you’re on a tight deadline, say so in the message.',
    'contact.budget1': 'I don’t know yet',
    'contact.budget2': 'Under €1,000',
    'contact.budget3': '€1,000 – 2,500',
    'contact.budget4': '€2,500 – 5,000',
    'contact.budget5': 'Over €5,000',

    'footer.description':
      'I build websites, web applications and dashboards made to measure for restaurants and small businesses. Hand-written code, no off-the-shelf templates.',
    'footer.site': 'The site',
    'footer.contacts': 'Contact',
    'footer.quote': 'Request a quote',
    'footer.admin': 'Admin area',
    'footer.rights': 'All rights reserved.',
    'footer.builtWith': 'Built with Angular, Tailwind CSS and Supabase.',

    'notfound.eyebrow': 'Error 404',
    'notfound.titleA': 'This page',
    'notfound.titleAccent': 'doesn’t exist.',
    'notfound.body':
      'The link may be old, or there’s a typo in the address. From here you can go back home or take a look at the work.',
    'notfound.home': 'Back to home',
    'notfound.projects': 'See the work',
  },
};
