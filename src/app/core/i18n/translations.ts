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
 *
 * Voce: SARAH è uno studio, quindi tutto è in prima persona plurale. L'unica
 * eccezione volontaria è l'informativa privacy, dove il titolare del
 * trattamento è una persona fisica e va nominata come tale.
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
    'nav.about': 'Chi siamo',
    'nav.projects': 'Progetti',
    'nav.services': 'Servizi',
    'nav.contact': 'Contatti',
    'nav.cta': 'Parliamone',
    'nav.role': 'Sviluppo web su misura',
    'nav.logoAlt': 'SARAH — sviluppo web su misura',
    'nav.open': 'Apri il menù',
    'nav.close': 'Chiudi il menù',
    'nav.skip': 'Salta al contenuto',
    'nav.mobileTagline': 'Siti web per ristoranti e piccole aziende',

    'common.loading': 'Caricamento…',
    'common.discover': 'Scopri',
    'common.required': 'I campi con * sono obbligatori.',

    'home.hero.badge': 'Disponibili per nuovi progetti',
    'home.hero.title': 'Siti web su misura per ristoranti e piccole aziende.',
    'home.hero.accent': 'ristoranti',
    'home.hero.subtitle':
      'Siamo SARAH, uno studio di ingegneri. Progettiamo e realizziamo siti, web application e dashboard: dal primo schizzo alla messa online, con un pannello che ti permette di aggiornare i contenuti da solo, quando vuoi.',
    'home.hero.ctaPrimary': 'Richiedi un preventivo',
    'home.hero.ctaSecondary': 'Guarda i progetti',

    // Riga che scorre sotto l'hero: dice cosa c'è dentro un sito, invece
    // di ripetere a chi è rivolto.
    'home.includes.prefix': 'In ogni sito che consegniamo',
    'home.includes.1': 'il menù che aggiorni da solo',
    'home.includes.2': 'le richieste di prenotazione',
    'home.includes.3': 'la galleria del locale',
    'home.includes.4': 'orari, mappa e come arrivare',
    'home.includes.5': 'telefono e WhatsApp a un tocco',
    'home.includes.6': 'il pannello di gestione, tuo',

    'preview.eyebrow': 'Come nasce',
    'preview.title': 'Dal foglio bianco al sito online.',
    'preview.accent': 'sito online',
    'preview.body':
      'Ogni progetto parte dalla struttura, non dalla grafica: prima decidiamo cosa deve trovare il cliente e in che ordine, poi lo vestiamo. Quello che vedi qui accanto è il montaggio di una pagina, passo dopo passo.',
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

    'home.services.eyebrow': 'Cosa facciamo',
    'home.services.titleA': 'Dal sito vetrina',
    'home.services.titleB': 'al',
    'home.services.titleAccent': 'gestionale interno',
    'home.services.link': 'Tutti i servizi',

    'home.projects.eyebrow': 'Portfolio',
    'home.projects.titleA': 'Progetti',
    'home.projects.titleAccent': 'in evidenza',
    'home.projects.link': 'Tutti i progetti',
    'home.projects.empty': 'Nessun progetto pubblicato al momento.',

    'home.process.eyebrow': 'Come lavoriamo',
    'home.process.titleA': 'Quattro passi,',
    'home.process.titleAccent': 'nessuna sorpresa',
    'process.1.title': 'Ascolto',
    'process.1.body':
      'Una chiamata per capire l’attività, chi sono i clienti e cosa deve fare il sito. Senza gergo tecnico.',
    'process.2.title': 'Proposta',
    'process.2.body':
      'Struttura delle pagine, tempi e costo chiaro. Se il progetto non ha senso, te lo diciamo prima di iniziare.',
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
      'Raccontaci cosa ti serve. Ti rispondiamo con una proposta concreta: struttura, tempi e costo, senza impegno.',
    'home.cta.primary': 'Scrivici',
    'home.cta.secondary': 'Vedi i servizi',

    'about.eyebrow': 'Chi siamo',
    'about.title': 'Costruiamo cose che devono funzionare il lunedì mattina.',
    'about.accent': 'il lunedì mattina.',
    'about.p1':
      'SARAH è uno studio di ingegneri. Veniamo da percorsi tecnici diversi che si toccano in tre punti — il web, i dati e i sistemi embedded — e mettiamo insieme queste competenze per costruire siti e strumenti digitali per ristoranti e piccole aziende.',
    'about.p2':
      'Lavorare in più persone cambia una cosa concreta per chi ci commissiona un lavoro: chi scrive l’interfaccia non è chi progetta il database, e ogni parte la segue chi la sa fare meglio. Questo sito è il nostro portfolio ed è costruito con lo stesso stack che usiamo per i clienti.',
    'about.ctaPrimary': 'Lavoriamo insieme',
    'about.ctaSecondary': 'Cosa abbiamo costruito',
    'about.summary': 'In sintesi',
    'about.roleLabel': 'Cosa siamo',
    'about.roleValue': 'Studio di sviluppo web',
    'about.founderLabel': 'Fondatore',
    'about.founderValue': 'Mahdi Allau',
    'about.focusLabel': 'Specializzazione',
    'about.focusValue': 'Siti e web app per ristorazione e piccole imprese',
    'about.stackLabel': 'Stack principale',
    'about.stackValue': 'Angular, TypeScript, Tailwind CSS, Supabase, PostgreSQL',
    'about.otherLabel': 'Altri ambiti',
    'about.otherValue': 'Python e SQL per i dati, Arduino/ESP32 per l’IoT',
    'about.path.eyebrow': 'Le competenze',
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
      'Firmware su Arduino ed ESP32, lettura di sensori e regolazione con controllo PID. È la parte del nostro percorso che ci ha insegnato a lavorare con vincoli stretti e a testare sul campo.',
    'about.method.eyebrow': 'Metodo',
    'about.method.titleA': 'Quattro cose su cui',
    'about.method.titleB': 'non transigiamo.',
    'about.principle1.title': 'Prima il problema, poi la tecnologia',
    'about.principle1.body':
      'Scegliamo lo strumento dopo aver capito cosa serve. A volte la risposta giusta è una pagina statica, non un’applicazione.',
    'about.principle2.title': 'Niente template riadattati',
    'about.principle2.body':
      'Ogni sito viene costruito partendo dal contenuto reale dell’attività. Si vede, e soprattutto si sente nella velocità di caricamento.',
    'about.principle3.title': 'Autonomia dopo la consegna',
    'about.principle3.body':
      'Il pannello di amministrazione fa parte del progetto: menù, foto e testi si aggiornano senza dover chiamare nessuno.',
    'about.principle4.title': 'Parlare chiaro',
    'about.principle4.body':
      'Preventivi leggibili, tempi realistici e nessun gergo inutile. Se qualcosa non conviene farla, te lo diciamo.',
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
      'Una selezione di lavori che raccontano come affrontiamo un problema: dal dato grezzo alla dashboard, dal sensore all’interfaccia, dall’idea al sito online.',
    'projects.filterAll': 'Tutti',
    'projects.filterLabel': 'Filtra i progetti per categoria',
    'projects.emptyCategory': 'Nessun progetto in questa categoria.',
    'projects.credit': 'Seguito da',
    'projects.ctaTitleA': 'Il prossimo progetto',
    'projects.ctaTitleB': 'potrebbe essere il',
    'projects.ctaAccent': 'tuo',
    'projects.ctaBody':
      'Raccontaci cosa ti serve: ti rispondiamo con una proposta chiara su struttura, tempi e costo.',
    'projects.ctaButton': 'Parliamone',
    'projects.viewLive': 'Vedi il progetto',
    'projects.viewCode': 'Codice sorgente',

    'services.eyebrow': 'Servizi',
    'services.title': 'Cosa possiamo costruire per te.',
    'services.accent': 'per te.',
    'services.subtitle':
      'Dal sito vetrina che presenta l’attività fino allo strumento interno che ti fa risparmiare ore ogni settimana. Sempre su misura, mai un tema comprato e riadattato.',
    'services.includes': 'Cosa comprende',
    'services.empty': 'Nessun servizio pubblicato al momento.',

    // --- Pacchetti e prezzi ---
    'pricing.eyebrow': 'Quanto costa',
    'pricing.title': 'Prezzi chiari, prima di iniziare.',
    'pricing.accent': 'prima di iniziare.',
    'pricing.subtitle':
      'Sappiamo che la prima domanda è questa, e capiamo che chiederlo metta a disagio. Ecco gli ordini di grandezza: il preventivo vero arriva dopo che abbiamo parlato, voce per voce, e da lì non si muove.',
    'pricing.from': 'da',
    'pricing.vat': 'IVA esclusa',
    'pricing.popular': 'Il più richiesto',
    'pricing.cta': 'Chiedi un preventivo',

    'pricing.1.name': 'Vetrina',
    'pricing.1.for': 'Per chi non ha ancora un sito',
    'pricing.1.price': '690',
    'pricing.1.time': '2–3 settimane',
    'pricing.1.f1': 'Sito di una pagina, curato nel dettaglio',
    'pricing.1.f2': 'Menù, orari, dove siete e contatti',
    'pricing.1.f3': 'Ottimizzato per il telefono',
    'pricing.1.f4': 'Pubblicazione e configurazione del dominio',

    'pricing.2.name': 'Ristorante',
    'pricing.2.for': 'Per chi vuole gestirlo da solo',
    'pricing.2.price': '1.400',
    'pricing.2.time': '3–5 settimane',
    'pricing.2.f1': 'Tutto quello del pacchetto Vetrina',
    'pricing.2.f2': 'Pannello per cambiare menù e foto da solo',
    'pricing.2.f3': 'Galleria fotografica e pagine multiple',
    'pricing.2.f4': 'Richiesta di prenotazione via modulo e WhatsApp',
    'pricing.2.f5': 'Base SEO locale: farti trovare nella tua zona',

    'pricing.3.name': 'Su misura',
    'pricing.3.for': 'Per chi ha un’esigenza specifica',
    'pricing.3.price': '2.500',
    'pricing.3.time': 'da concordare',
    'pricing.3.f1': 'Web application o gestionale interno',
    'pricing.3.f2': 'Dashboard sui dati che già producete',
    'pricing.3.f3': 'Integrazioni con i sistemi che usate',
    'pricing.3.f4': 'Analisi iniziale e sviluppo per passi',

    'pricing.guarantee.title': 'Il rischio è nostro, non tuo.',
    'pricing.guarantee.body':
      'La prima proposta grafica te la facciamo senza chiederti niente. Se non ti convince, ci salutiamo e non ci devi un euro. Il tempo speso lo paghiamo noi, perché se non siamo capaci di capire cosa vuoi non sei tu a doverlo finanziare.',
    'pricing.note':
      'Sono cifre indicative per orientarti, non un listino. Il dominio e l’hosting si pagano a parte, in genere poche decine di euro l’anno, intestati a te.',

    'services.faq.eyebrow': 'Domande frequenti',
    'services.faq.title': 'Le cose che ci chiedono sempre.',
    'services.faq.body':
      'Se la tua domanda non è qui, scrivici: rispondiamo anche solo per capire se possiamo esserti utili.',
    'services.faq.cta': 'Fai la tua domanda',
    'faq.1.q': 'Quanto costa un sito?',
    'faq.1.a':
      'Dipende da quante pagine servono e da cosa deve fare il sito. Dopo una prima chiacchierata inviamo un preventivo scritto voce per voce, così sai esattamente cosa stai comprando.',
    'faq.2.q': 'Posso aggiornare i contenuti da solo?',
    'faq.2.a':
      'Sì, è il punto. Ogni progetto include un pannello di amministrazione riservato dove modificare testi, foto e — per i ristoranti — il menù, senza toccare il codice.',
    'faq.3.q': 'Vi occupate anche del dominio e dell’hosting?',
    'faq.3.a':
      'Sì. Possiamo registrare il dominio, configurare la pubblicazione e le caselle email, e lasciare tutto intestato a te: gli accessi restano tuoi.',
    'faq.4.q': 'Quanto tempo serve?',
    'faq.4.a':
      'Un sito vetrina ben fatto richiede in genere qualche settimana, una web application di più. I tempi precisi finiscono nel preventivo, non li scopri strada facendo.',

    'contact.eyebrow': 'Contatti',
    'contact.title': 'Raccontaci il tuo progetto.',
    'contact.accent': 'progetto.',
    'contact.subtitle':
      'Bastano due righe per iniziare. Ti rispondiamo con qualche domanda mirata e, se il progetto ha senso, con una proposta chiara su struttura, tempi e costo.',
    'contact.name': 'Nome e cognome *',
    'contact.namePlaceholder': 'Come ti chiami?',
    'contact.nameError': 'Inserisci almeno 2 caratteri.',
    'contact.email': 'Email *',
    'contact.emailPlaceholder': 'dove ti rispondiamo',
    'contact.emailError': 'Controlla l’indirizzo email.',
    'contact.company': 'Attività',
    'contact.companyPlaceholder': 'Nome del locale o dell’azienda',
    'contact.budget': 'Budget indicativo',
    'contact.budgetNone': 'Preferisco non dirlo',
    'contact.message': 'Il progetto *',
    'contact.messagePlaceholder': 'Che attività hai, cosa ti serve e cosa non funziona nel sito attuale.',
    'contact.messageError': 'Scrivi almeno 20 caratteri, così capiamo di cosa si tratta.',
    'contact.submit': 'Invia il messaggio',
    'contact.sending': 'Invio in corso…',
    'contact.sentTitle': 'Messaggio ricevuto.',
    'contact.sentBody': 'Grazie. Ti rispondiamo appena possibile, di solito entro un paio di giorni lavorativi.',
    'contact.sentAgain': 'Invia un altro messaggio',
    'contact.mailtoTitle': 'Stiamo aprendo il tuo client di posta.',
    'contact.mailtoBody': 'Se non si è aperto nulla, scrivici direttamente a',
    'contact.mailtoBack': 'Torna al modulo',
    'contact.errorPrefix': 'Non siamo riusciti a inviare il messaggio:',
    'contact.errorSuffix': 'Puoi scriverci direttamente a',
    'contact.directTitle': 'Scrivici direttamente',

    // --- Guida animata: cosa succede dopo aver scritto ---
    'contact.walk.eyebrow': 'Passo per passo',
    'contact.walk.title': 'Cosa succede dopo che ci hai scritto.',
    'contact.walk.accent': 'dopo che ci hai scritto.',
    'contact.walk.body':
      'Nessun impegno e nessun costo fino al preventivo. Se a quel punto non ti convince, finisce lì.',
    'contact.walk.url': 'sarah.it/contatti',
    'contact.walk.1.label': 'Scrivi due righe',
    'contact.walk.1.caption':
      'Bastano il nome, una email e cosa ti serve. Il resto lo chiediamo noi dopo.',
    'contact.walk.2.label': 'Ti rispondiamo',
    'contact.walk.2.caption':
      'Entro uno o due giorni lavorativi, con qualche domanda per capire meglio il progetto.',
    'contact.walk.3.label': 'Ci sentiamo venti minuti',
    'contact.walk.3.caption':
      'Una chiamata per guardarci in faccia sul progetto. Senza impegno e senza tecnicismi.',
    'contact.walk.4.label': 'Ricevi il preventivo',
    'contact.walk.4.caption':
      'Scritto, voce per voce, con tempi e costo. Da lì il prezzo non si muove.',
    'contact.walk.screen1': 'Il modulo',
    'contact.walk.screen2': 'La risposta',
    'contact.walk.screen3': 'Ci sentiamo',
    'contact.walk.screen4': 'Il preventivo',
    'contact.replyTitle': 'Tempi di risposta',
    'contact.replyBody':
      'Di norma rispondiamo entro uno o due giorni lavorativi. Se hai una scadenza stretta, scrivilo nel messaggio.',
    'contact.budget1': 'Non lo so ancora',
    'contact.budget2': 'Meno di 1.000 €',
    'contact.budget3': '1.000 – 2.500 €',
    'contact.budget4': '2.500 – 5.000 €',
    'contact.budget5': 'Oltre 5.000 €',

    'footer.description':
      'Sviluppiamo siti web, web application e dashboard su misura per ristoranti e piccole aziende. Codice scritto a mano, senza template preconfezionati.',
    'footer.site': 'Il sito',
    'footer.contacts': 'Contatti',
    'footer.quote': 'Richiedi un preventivo',
    'footer.admin': 'Area riservata',
    'footer.rights': 'Tutti i diritti riservati.',
    'footer.builtWith': 'Costruito con Angular, Tailwind CSS e Supabase.',

    // --- Testa del documento ---
    'seo.home.title': 'SARAH — Siti web per ristoranti e piccole aziende',
    'seo.home.description':
      'Siti web, web application e dashboard su misura per ristoranti e piccole aziende. Con un pannello per aggiornare i contenuti da solo, quando vuoi.',
    'seo.about.title': 'Chi siamo',
    'seo.about.description':
      'Studio di ingegneri: sviluppo web, analisi dei dati e sistemi embedded, applicati ai siti per la ristorazione e le piccole imprese.',
    'seo.projects.title': 'Progetti',
    'seo.projects.description':
      'Dashboard analitiche, sistemi IoT su ESP32 e web application in Angular: una selezione di progetti con tecnologie e risultati.',
    'seo.services.title': 'Servizi',
    'seo.services.description':
      'Siti web moderni, siti per ristoranti con menù gestibile, web application e dashboard su misura. Preventivo chiaro, voce per voce.',
    'seo.contact.title': 'Contatti',
    'seo.contact.description':
      'Raccontaci il tuo progetto: rispondiamo entro uno o due giorni lavorativi con una proposta su struttura, tempi e costo.',
    'seo.privacy.title': 'Informativa privacy',
    'seo.privacy.description':
      'Quali dati raccoglie il modulo di contatto di questo sito, perché, dove vengono conservati e come chiederne la cancellazione.',
    'seo.admin.title': 'Area riservata',
    'seo.admin.description': 'Accesso riservato alla gestione dei contenuti del sito.',

    // --- Sito dimostrativo ---
    'demo.banner': 'Progetto dimostrativo: l’Osteria del Tiglio non esiste, è un locale inventato per mostrare come lavoriamo.',
    'demo.back': 'Torna al portfolio',
    'demo.formNotice': 'Questo modulo non invia niente: è una dimostrazione.',
    'demo.footer': 'Sito dimostrativo progettato e sviluppato da',

    'seo.demoTrattoria.title': 'Osteria del Tiglio — sito dimostrativo',
    'seo.demoTrattoria.description':
      'Esempio di sito per un ristorante: menù, storia, orari, galleria e richiesta di prenotazione. Locale inventato, costruito per mostrare il lavoro.',

    'seo.notfound.title': 'Pagina non trovata',
    'seo.notfound.description':
      'La pagina che cercavi non esiste o è stata spostata. Da qui puoi tornare alla home o guardare i progetti realizzati.',

    // --- Privacy ---
    'privacy.eyebrow': 'Informativa',
    'privacy.title': 'Come trattiamo i tuoi dati.',
    'privacy.accent': 'i tuoi dati.',
    'privacy.intro':
      'Questa pagina spiega, senza formule inutili, cosa succede alle informazioni che ci lasci quando scrivi tramite il modulo di contatto.',
    'privacy.updated': 'Ultimo aggiornamento',
    'privacy.1.title': 'Chi tratta i dati',
    'privacy.1.body':
      'SARAH è il nome con cui lavoriamo, ma non è una società registrata: il titolare del trattamento è quindi Mahdi Allau, persona fisica. Per qualsiasi richiesta relativa ai tuoi dati puoi scrivere all’indirizzo email in fondo a questa pagina.',
    'privacy.2.title': 'Quali dati raccogliamo',
    'privacy.2.body':
      'Solo quello che scrivi nel modulo: nome, indirizzo email e, se scegli di indicarli, nome dell’attività e fascia di budget, insieme al testo del messaggio. Non usiamo cookie di profilazione e non ci sono strumenti di analisi o tracciamento pubblicitario su questo sito.',
    'privacy.3.title': 'Perché li raccogliamo',
    'privacy.3.body':
      'Unicamente per risponderti e, se il progetto va avanti, per gestire il rapporto di lavoro. Non inviamo newsletter, non facciamo invii promozionali e non cediamo né vendiamo i dati a nessuno.',
    'privacy.4.title': 'Dove finiscono',
    'privacy.4.body':
      'I messaggi sono salvati su Supabase, il servizio che ospita il database di questo sito, con server nell’Unione Europea. Vi accede solo chi in SARAH gestisce le richieste, tramite un’area protetta da password.',
    'privacy.5.title': 'Per quanto tempo',
    'privacy.5.body':
      'Conserviamo i messaggi finché servono a gestire la richiesta o il lavoro che ne è nato. Se una conversazione non porta a nulla, cancelliamo il messaggio entro un paio d’anni.',
    'privacy.6.title': 'I tuoi diritti',
    'privacy.6.body':
      'Puoi chiederci in qualsiasi momento di vedere i dati che abbiamo su di te, di correggerli o di cancellarli, e puoi opporti al trattamento. Basta una email: provvediamo senza chiedere spiegazioni e ti confermiamo quando è fatto.',
    'privacy.contactTitle': 'Per qualsiasi richiesta',
    'contact.privacyNote': 'Inviando il modulo accetti che usiamo questi dati per risponderti. Nessun altro uso: leggi',
    'contact.privacyLink': 'l’informativa privacy',
    'footer.privacy': 'Privacy',

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
    'nav.about': 'About us',
    'nav.projects': 'Work',
    'nav.services': 'Services',
    'nav.contact': 'Contact',
    'nav.cta': 'Let’s talk',
    'nav.role': 'Bespoke web development',
    'nav.logoAlt': 'SARAH — bespoke web development',
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
      'We’re SARAH, a studio of engineers. We design and build websites, web applications and dashboards — from the first sketch to going live, with a panel that lets you update the content yourself, whenever you want.',
    'home.hero.ctaPrimary': 'Request a quote',
    'home.hero.ctaSecondary': 'See the work',

    // Line that cycles under the hero: what a site contains, rather than
    // repeating who it is for.
    'home.includes.prefix': 'In every site we hand over',
    'home.includes.1': 'a menu you update yourself',
    'home.includes.2': 'booking requests',
    'home.includes.3': 'the venue gallery',
    'home.includes.4': 'hours, map and directions',
    'home.includes.5': 'phone and WhatsApp in one tap',
    'home.includes.6': 'the admin panel, yours',

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

    'home.services.eyebrow': 'What we do',
    'home.services.titleA': 'From the shop window',
    'home.services.titleB': 'to the',
    'home.services.titleAccent': 'tool you run on',
    'home.services.link': 'All services',

    'home.projects.eyebrow': 'Portfolio',
    'home.projects.titleA': 'Selected',
    'home.projects.titleAccent': 'work',
    'home.projects.link': 'All projects',
    'home.projects.empty': 'No projects published yet.',

    'home.process.eyebrow': 'How we work',
    'home.process.titleA': 'Four steps,',
    'home.process.titleAccent': 'no surprises',
    'process.1.title': 'Listening',
    'process.1.body':
      'A call to understand the business, who your customers are and what the site has to do. No technical jargon.',
    'process.2.title': 'Proposal',
    'process.2.body':
      'Page structure, timeline and a clear price. If the project doesn’t make sense, we say so before we start.',
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
      'Tell us what you need. We’ll come back with something concrete: structure, timeline and price, no strings attached.',
    'home.cta.primary': 'Get in touch',
    'home.cta.secondary': 'See the services',

    'about.eyebrow': 'About us',
    'about.title': 'We build things that have to work on Monday morning.',
    'about.accent': 'on Monday morning.',
    'about.p1':
      'SARAH is a studio of engineers. We come from different technical backgrounds that meet at three points — the web, data, and embedded systems — and we bring those together to build websites and digital tools for restaurants and small businesses.',
    'about.p2':
      'Being more than one person changes something concrete for whoever hires us: the person writing the interface isn’t the person designing the database, and each part is handled by whoever does it best. This site is our portfolio, built with the same stack we use for clients.',
    'about.ctaPrimary': 'Let’s work together',
    'about.ctaSecondary': 'What we’ve built',
    'about.summary': 'At a glance',
    'about.roleLabel': 'What we are',
    'about.roleValue': 'A web development studio',
    'about.founderLabel': 'Founder',
    'about.founderValue': 'Mahdi Allau',
    'about.focusLabel': 'Focus',
    'about.focusValue': 'Sites and web apps for hospitality and small business',
    'about.stackLabel': 'Main stack',
    'about.stackValue': 'Angular, TypeScript, Tailwind CSS, Supabase, PostgreSQL',
    'about.otherLabel': 'Also',
    'about.otherValue': 'Python and SQL for data, Arduino/ESP32 for IoT',
    'about.path.eyebrow': 'What we know',
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
      'Firmware on Arduino and ESP32, sensor readings and PID control loops. This is the part of our background that taught us to work under tight constraints and to test in the field.',
    'about.method.eyebrow': 'Method',
    'about.method.titleA': 'Four things we',
    'about.method.titleB': 'won’t compromise on.',
    'about.principle1.title': 'The problem first, the technology after',
    'about.principle1.body':
      'We pick the tool once we understand what’s needed. Sometimes the right answer is a static page, not an application.',
    'about.principle2.title': 'No repurposed templates',
    'about.principle2.body':
      'Every site is built around the real content of the business. You can see it — and above all you can feel it in the loading speed.',
    'about.principle3.title': 'Independence after handover',
    'about.principle3.body':
      'The admin panel is part of the project: menu, photos and text get updated without having to call anyone.',
    'about.principle4.title': 'Plain speaking',
    'about.principle4.body':
      'Readable quotes, realistic timelines and no needless jargon. If something isn’t worth doing, we’ll say so.',
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
      'A selection of projects that show how we approach a problem: from raw data to dashboard, from sensor to interface, from idea to live site.',
    'projects.filterAll': 'All',
    'projects.filterLabel': 'Filter projects by category',
    'projects.emptyCategory': 'No projects in this category.',
    'projects.credit': 'Led by',
    'projects.ctaTitleA': 'The next project',
    'projects.ctaTitleB': 'could be',
    'projects.ctaAccent': 'yours',
    'projects.ctaBody':
      'Tell us what you need: we’ll come back with a clear proposal on structure, timeline and price.',
    'projects.ctaButton': 'Let’s talk',
    'projects.viewLive': 'View the project',
    'projects.viewCode': 'Source code',

    'services.eyebrow': 'Services',
    'services.title': 'What we can build for you.',
    'services.accent': 'for you.',
    'services.subtitle':
      'From the shop-window site that introduces the business to the internal tool that saves you hours every week. Always made to measure, never a bought theme reworked.',
    'services.includes': 'What’s included',
    'services.empty': 'No services published yet.',

    // --- Packages and pricing ---
    'pricing.eyebrow': 'What it costs',
    'pricing.title': 'Clear prices, before we start.',
    'pricing.accent': 'before we start.',
    'pricing.subtitle':
      'We know this is the first question, and we know asking it feels awkward. Here are the orders of magnitude: the real quote comes after we’ve talked, itemised — and it doesn’t move after that.',
    'pricing.from': 'from',
    'pricing.vat': 'excl. VAT',
    'pricing.popular': 'Most requested',
    'pricing.cta': 'Ask for a quote',

    'pricing.1.name': 'Showcase',
    'pricing.1.for': 'For those without a site yet',
    'pricing.1.price': '690',
    'pricing.1.time': '2–3 weeks',
    'pricing.1.f1': 'A single page, carefully made',
    'pricing.1.f2': 'Menu, opening hours, location and contacts',
    'pricing.1.f3': 'Built for the phone first',
    'pricing.1.f4': 'Publishing and domain setup',

    'pricing.2.name': 'Restaurant',
    'pricing.2.for': 'For those who want to run it themselves',
    'pricing.2.price': '1,400',
    'pricing.2.time': '3–5 weeks',
    'pricing.2.f1': 'Everything in the Showcase package',
    'pricing.2.f2': 'A panel to change the menu and photos yourself',
    'pricing.2.f3': 'Photo gallery and multiple pages',
    'pricing.2.f4': 'Booking requests by form and WhatsApp',
    'pricing.2.f5': 'Local SEO groundwork, so people nearby find you',

    'pricing.3.name': 'Bespoke',
    'pricing.3.for': 'For a specific need',
    'pricing.3.price': '2,500',
    'pricing.3.time': 'to be agreed',
    'pricing.3.f1': 'Web application or internal tool',
    'pricing.3.f2': 'Dashboards on the data you already produce',
    'pricing.3.f3': 'Integration with the systems you use',
    'pricing.3.f4': 'Initial analysis and step-by-step delivery',

    'pricing.guarantee.title': 'The risk is ours, not yours.',
    'pricing.guarantee.body':
      'We’ll make you the first design proposal without asking for anything. If it doesn’t convince you, we shake hands and you owe us nothing. We cover the time spent, because if we can’t work out what you want, you shouldn’t be the one paying for it.',
    'pricing.note':
      'These are indicative figures to orient you, not a price list. Domain and hosting are paid separately — usually a few tens of euros a year, registered in your name.',

    'services.faq.eyebrow': 'Frequently asked',
    'services.faq.title': 'The things people always ask.',
    'services.faq.body':
      'If your question isn’t here, write to us: we’ll reply even just to work out whether we can be useful.',
    'services.faq.cta': 'Ask your question',
    'faq.1.q': 'How much does a website cost?',
    'faq.1.a':
      'It depends on how many pages you need and what the site has to do. After a first conversation we send a written quote, itemised, so you know exactly what you’re buying.',
    'faq.2.q': 'Can I update the content myself?',
    'faq.2.a':
      'Yes — that’s the point. Every project includes a private admin panel where you can edit text, photos and, for restaurants, the menu, without touching any code.',
    'faq.3.q': 'Do you handle the domain and hosting too?',
    'faq.3.a':
      'Yes. We can register the domain, set up publishing and email accounts, and leave everything registered in your name: the credentials stay yours.',
    'faq.4.q': 'How long does it take?',
    'faq.4.a':
      'A well-made shop-window site usually takes a few weeks; a web application takes longer. Exact timings go in the quote — you don’t discover them along the way.',

    'contact.eyebrow': 'Contact',
    'contact.title': 'Tell us about your project.',
    'contact.accent': 'project.',
    'contact.subtitle':
      'Two lines are enough to start. We’ll reply with a few pointed questions and, if the project makes sense, a clear proposal on structure, timeline and price.',
    'contact.name': 'Full name *',
    'contact.namePlaceholder': 'What’s your name?',
    'contact.nameError': 'Please enter at least 2 characters.',
    'contact.email': 'Email *',
    'contact.emailPlaceholder': 'where we should reply',
    'contact.emailError': 'Please check the email address.',
    'contact.company': 'Business',
    'contact.companyPlaceholder': 'Name of the venue or company',
    'contact.budget': 'Rough budget',
    'contact.budgetNone': 'I’d rather not say',
    'contact.message': 'The project *',
    'contact.messagePlaceholder': 'What your business is, what you need, and what isn’t working on your current site.',
    'contact.messageError': 'Please write at least 20 characters so we understand what it’s about.',
    'contact.submit': 'Send message',
    'contact.sending': 'Sending…',
    'contact.sentTitle': 'Message received.',
    'contact.sentBody': 'Thank you. We’ll reply as soon as we can, usually within a couple of working days.',
    'contact.sentAgain': 'Send another message',
    'contact.mailtoTitle': 'Opening your email client.',
    'contact.mailtoBody': 'If nothing opened, write to us directly at',
    'contact.mailtoBack': 'Back to the form',
    'contact.errorPrefix': 'We couldn’t send the message:',
    'contact.errorSuffix': 'You can write to us directly at',
    'contact.directTitle': 'Write to us directly',

    // --- Animated walkthrough: what happens after you write ---
    'contact.walk.eyebrow': 'Step by step',
    'contact.walk.title': 'What happens after you write to us.',
    'contact.walk.accent': 'after you write to us.',
    'contact.walk.body':
      'No commitment and no cost until the quote. If it doesn’t convince you at that point, it ends there.',
    'contact.walk.url': 'sarah.it/contact',
    'contact.walk.1.label': 'Write two lines',
    'contact.walk.1.caption':
      'Your name, an email and what you need. We’ll ask for the rest afterwards.',
    'contact.walk.2.label': 'We reply',
    'contact.walk.2.caption':
      'Within one or two working days, with a few questions to understand the project better.',
    'contact.walk.3.label': 'A twenty-minute call',
    'contact.walk.3.caption':
      'A call to look each other in the eye about the project. No obligation, no jargon.',
    'contact.walk.4.label': 'You get the quote',
    'contact.walk.4.caption':
      'Written, itemised, with timeline and price. From there the price doesn’t move.',
    'contact.walk.screen1': 'The form',
    'contact.walk.screen2': 'The reply',
    'contact.walk.screen3': 'The call',
    'contact.walk.screen4': 'The quote',
    'contact.replyTitle': 'Response time',
    'contact.replyBody':
      'We normally reply within one or two working days. If you’re on a tight deadline, say so in the message.',
    'contact.budget1': 'I don’t know yet',
    'contact.budget2': 'Under €1,000',
    'contact.budget3': '€1,000 – 2,500',
    'contact.budget4': '€2,500 – 5,000',
    'contact.budget5': 'Over €5,000',

    'footer.description':
      'We build websites, web applications and dashboards made to measure for restaurants and small businesses. Hand-written code, no off-the-shelf templates.',
    'footer.site': 'The site',
    'footer.contacts': 'Contact',
    'footer.quote': 'Request a quote',
    'footer.admin': 'Admin area',
    'footer.rights': 'All rights reserved.',
    'footer.builtWith': 'Built with Angular, Tailwind CSS and Supabase.',

    // --- Document head ---
    'seo.home.title': 'SARAH — Websites for restaurants and small businesses',
    'seo.home.description':
      'Websites, web applications and dashboards made to measure for restaurants and small businesses. With a panel to update the content yourself, whenever you want.',
    'seo.about.title': 'About us',
    'seo.about.description':
      'A studio of engineers: web development, data analysis and embedded systems, applied to sites for hospitality and small business.',
    'seo.projects.title': 'Work',
    'seo.projects.description':
      'Analytics dashboards, IoT systems on ESP32 and Angular web applications: a selection of projects with the technologies and the results.',
    'seo.services.title': 'Services',
    'seo.services.description':
      'Modern websites, restaurant sites with a self-managed menu, web applications and bespoke dashboards. Clear, itemised quotes.',
    'seo.contact.title': 'Contact',
    'seo.contact.description':
      'Tell us about your project: we reply within one or two working days with a proposal on structure, timeline and price.',
    'seo.privacy.title': 'Privacy notice',
    'seo.privacy.description':
      'What the contact form on this site collects, why, where it is stored and how to ask for it to be deleted.',
    'seo.admin.title': 'Admin area',
    'seo.admin.description': 'Private access for managing the site content.',

    // --- Demo site ---
    'demo.banner': 'Demo project: Osteria del Tiglio doesn’t exist — it’s an invented restaurant, built to show how we work.',
    'demo.back': 'Back to the portfolio',
    'demo.formNotice': 'This form doesn’t send anything: it’s a demonstration.',
    'demo.footer': 'Demo site designed and built by',

    'seo.demoTrattoria.title': 'Osteria del Tiglio — demo site',
    'seo.demoTrattoria.description':
      'An example restaurant site: menu, story, opening hours, gallery and booking request. An invented venue, built to show the work.',

    'seo.notfound.title': 'Page not found',
    'seo.notfound.description':
      'The page you were looking for doesn’t exist or has moved. From here you can go back home or take a look at the work.',

    // --- Privacy ---
    'privacy.eyebrow': 'Notice',
    'privacy.title': 'How we handle your data.',
    'privacy.accent': 'your data.',
    'privacy.intro':
      'This page explains, without needless formulas, what happens to the information you leave when you write through the contact form.',
    'privacy.updated': 'Last updated',
    'privacy.1.title': 'Who handles the data',
    'privacy.1.body':
      'SARAH is the name we work under, but it isn’t a registered company: the data controller is therefore Mahdi Allau, a natural person. For anything concerning your data you can write to the email address at the bottom of this page.',
    'privacy.2.title': 'What we collect',
    'privacy.2.body':
      'Only what you type into the form: name, email address and, if you choose to give them, business name and budget range, along with the text of your message. There are no profiling cookies, and no analytics or advertising trackers on this site.',
    'privacy.3.title': 'Why we collect it',
    'privacy.3.body':
      'Solely to reply to you and, if the project goes ahead, to run the working relationship. We send no newsletters, no promotional mail, and we never share or sell the data to anyone.',
    'privacy.4.title': 'Where it goes',
    'privacy.4.body':
      'Messages are stored on Supabase, the service hosting this site’s database, on servers in the European Union. Only the people at SARAH who handle enquiries can read them, through a password-protected area.',
    'privacy.5.title': 'For how long',
    'privacy.5.body':
      'We keep messages as long as they’re needed to handle the enquiry or the work that came from it. If a conversation leads nowhere, we delete the message within a couple of years.',
    'privacy.6.title': 'Your rights',
    'privacy.6.body':
      'You can ask us at any time to see the data we hold about you, to correct it or to delete it, and you can object to the processing. An email is enough: we act on it without asking why, and confirm when it’s done.',
    'privacy.contactTitle': 'For any request',
    'contact.privacyNote': 'By sending the form you agree that we use this data to reply to you. Nothing else — read',
    'contact.privacyLink': 'the privacy notice',
    'footer.privacy': 'Privacy',

    'notfound.eyebrow': 'Error 404',
    'notfound.titleA': 'This page',
    'notfound.titleAccent': 'doesn’t exist.',
    'notfound.body':
      'Maybe the link is old, or there’s a typo in the address. From here you can go back home or take a look at the work.',
    'notfound.home': 'Back home',
    'notfound.projects': 'See the work',
  },
};
