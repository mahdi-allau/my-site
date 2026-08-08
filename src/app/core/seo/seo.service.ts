import { DOCUMENT, Location } from '@angular/common';
import { Injectable, effect, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DEFAULT_LANG, I18nService, LANG_PARAM, Lang } from '../i18n/i18n.service';

/**
 * Testa del documento: titolo, descrizione, canonical, hreflang, anteprima
 * social e dati strutturati.
 *
 * Il nodo del problema è che la lingua vive in un signal, non nel percorso:
 * senza intervento le due versioni avrebbero lo stesso URL e un motore di
 * ricerca ne indicizzerebbe una sola. Qui la lingua viene riportata
 * nell'URL come parametro, così `/services?lang=en` è una pagina distinta,
 * condivisibile e indicizzabile, e le due versioni si dichiarano a vicenda
 * con `hreflang`.
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly doc = inject(DOCUMENT);
  private readonly location = inject(Location);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly i18n = inject(I18nService);

  init(): void {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(() => this.apply());

    // Cambiando lingua si riscrive la testa e si aggiorna il parametro.
    effect(() => {
      const lang = this.i18n.lang();
      this.syncUrl(lang);
      this.apply();
    });

    // La navigazione iniziale può concludersi prima che questo servizio si
    // sia agganciato: senza questa chiamata la prima pagina aperta
    // resterebbe con il titolo della home.
    this.apply();
  }

  // ------------------------------------------------------------------

  /**
   * Porta la lingua nell'URL.
   *
   * Usa `replaceState` e non `router.navigate`: una navigazione relativa
   * alla rotta radice riporterebbe l'utente alla home, e il parametro va
   * aggiunto anche quando la navigazione iniziale non è ancora conclusa —
   * momento in cui lo snapshot dei parametri è ancora vuoto. Il percorso
   * si legge quindi dall'indirizzo vero del browser.
   */
  private syncUrl(lang: Lang): void {
    const url = new URL(this.doc.location.href);
    const current = url.searchParams.get(LANG_PARAM);
    const wanted = lang === DEFAULT_LANG ? null : lang;

    if (current === wanted) {
      return;
    }

    if (wanted) {
      url.searchParams.set(LANG_PARAM, wanted);
    } else {
      url.searchParams.delete(LANG_PARAM);
    }

    // Cambiare lingua non deve lasciare una voce nella cronologia:
    // il tasto "indietro" deve riportare alla pagina precedente.
    this.location.replaceState(url.pathname, url.searchParams.toString(), history.state);
  }

  private apply(): void {
    // Ricavata ogni volta dallo stato del router invece di essere memorizzata
    // al passaggio di navigazione: così non dipende da chi arriva prima.
    const key = this.deepestSeoKey();
    const lang = this.i18n.lang();

    const pageTitle = this.i18n.t(`seo.${key}.title`);
    const description = this.i18n.t(`seo.${key}.description`);
    const siteName = 'SARAH';
    const fullTitle = key === 'home' ? pageTitle : `${pageTitle} · ${siteName}`;

    this.title.setTitle(fullTitle);
    this.meta.updateTag({ name: 'description', content: description });

    const path = this.pathWithoutQuery();
    const origin = this.doc.location.origin;
    const canonical = this.urlFor(origin, path, lang);

    this.setLink('canonical', canonical);
    this.setAlternate('it', this.urlFor(origin, path, 'it'));
    this.setAlternate('en', this.urlFor(origin, path, 'en'));
    this.setAlternate('x-default', this.urlFor(origin, path, DEFAULT_LANG));

    const image = `${origin}/og-cover.png`;

    this.meta.updateTag({ property: 'og:title', content: fullTitle });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:url', content: canonical });
    this.meta.updateTag({ property: 'og:site_name', content: siteName });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:locale', content: lang === 'it' ? 'it_IT' : 'en_GB' });
    this.meta.updateTag({ property: 'og:image', content: image });
    this.meta.updateTag({ property: 'og:image:width', content: '1200' });
    this.meta.updateTag({ property: 'og:image:height', content: '630' });

    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: fullTitle });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    this.meta.updateTag({ name: 'twitter:image', content: image });

    this.setStructuredData(origin, lang, description);
  }

  // ------------------------------------------------------------------

  /** Chiave `seo` della rotta più profonda che ne dichiara una. */
  private deepestSeoKey(): string {
    let node = this.route.snapshot;
    let key = 'home';

    while (node) {
      const value = node.data['seo'];
      if (typeof value === 'string') {
        key = value;
      }
      node = node.firstChild as typeof node;
    }

    return key;
  }

  /** Percorso letto dal browser: `router.url` non conosce le modifiche
   *  fatte con `replaceState`. */
  private pathWithoutQuery(): string {
    return this.doc.location.pathname || '/';
  }

  private urlFor(origin: string, path: string, lang: Lang): string {
    return lang === DEFAULT_LANG
      ? `${origin}${path}`
      : `${origin}${path}?${LANG_PARAM}=${lang}`;
  }

  private setLink(rel: string, href: string): void {
    let link = this.doc.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]:not([hreflang])`);
    if (!link) {
      link = this.doc.createElement('link');
      link.rel = rel;
      this.doc.head.appendChild(link);
    }
    link.href = href;
  }

  private setAlternate(hreflang: string, href: string): void {
    let link = this.doc.head.querySelector<HTMLLinkElement>(
      `link[rel="alternate"][hreflang="${hreflang}"]`,
    );
    if (!link) {
      link = this.doc.createElement('link');
      link.rel = 'alternate';
      link.hreflang = hreflang;
      this.doc.head.appendChild(link);
    }
    link.href = href;
  }

  /**
   * Dati strutturati: è la stessa cosa che promettiamo ai clienti nella
   * sezione "Il ritorno", quindi questo sito deve darne l'esempio.
   *
   * `Organization` e non `Person`: SARAH è uno studio. Il fondatore resta
   * dichiarato, perché è il nome che compare nell'informativa privacy come
   * titolare del trattamento e i due devono coincidere.
   */
  private setStructuredData(origin: string, lang: Lang, description: string): void {
    const graph = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': ['Organization', 'ProfessionalService'],
          '@id': `${origin}/#business`,
          name: 'SARAH',
          alternateName: 'SARAH — sviluppo web su misura',
          description,
          url: origin,
          logo: `${origin}/logo-full.png`,
          image: `${origin}/og-cover.png`,
          email: `mailto:${environment.contactEmail}`,
          areaServed: { '@type': 'Country', name: 'Italia' },
          knowsLanguage: ['it', 'en'],
          founder: { '@type': 'Person', name: 'Mahdi Allau' },
          hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: this.i18n.t('services.eyebrow'),
            itemListElement: [
              'siti-web-moderni',
              'siti-web-per-ristoranti',
              'web-application',
              'dashboard',
              'soluzioni-digitali-personalizzate',
            ].map((slug) => ({
              '@type': 'Offer',
              itemOffered: { '@type': 'Service', name: slug.replace(/-/g, ' ') },
              url: `${origin}/services#${slug}`,
            })),
          },
        },
        {
          '@type': 'WebSite',
          '@id': `${origin}/#website`,
          url: origin,
          name: 'SARAH',
          inLanguage: lang,
          publisher: { '@id': `${origin}/#business` },
        },
      ],
    };

    let script = this.doc.head.querySelector<HTMLScriptElement>('script[data-seo="jsonld"]');
    if (!script) {
      script = this.doc.createElement('script');
      script.type = 'application/ld+json';
      script.dataset['seo'] = 'jsonld';
      this.doc.head.appendChild(script);
    }
    script.textContent = JSON.stringify(graph);
  }
}
