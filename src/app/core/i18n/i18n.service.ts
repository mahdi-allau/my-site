import { Injectable, computed, signal } from '@angular/core';
import { TRANSLATIONS } from './translations';

export type Lang = 'it' | 'en';

export const LANGUAGES: ReadonlyArray<{ code: Lang; label: string; name: string }> = [
  { code: 'it', label: 'IT', name: 'Italiano' },
  { code: 'en', label: 'EN', name: 'English' },
];

const STORAGE_KEY = 'ma.lang';

/** Nome del parametro che porta la lingua nell'URL. */
export const LANG_PARAM = 'lang';

/** Lingua di riferimento: le sue pagine stanno all'URL senza parametro. */
export const DEFAULT_LANG: Lang = 'it';

/**
 * Traduzione a runtime.
 *
 * Non usa l'i18n di Angular apposta: quella richiede una build separata per
 * lingua e un deploy per ciascuna. Qui la lingua è un signal, quindi il
 * cambio è istantaneo e il sito resta un solo pacchetto statico.
 *
 * `t()` legge il signal `lang`, perciò ogni template che la invoca si
 * riaggiorna da solo quando la lingua cambia — anche con OnPush.
 */
@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly current = signal<Lang>(detectInitialLang());

  /**
   * Testi riscritti dall'area riservata, per chiave e per lingua.
   *
   * È un signal, quindi appena arrivano dal database ogni testo della
   * pagina si aggiorna da solo: i template chiamano `t()`, che lo legge.
   */
  private readonly overrides = signal<Record<string, Partial<Record<Lang, string>>>>({});

  readonly lang = this.current.asReadonly();
  readonly isEnglish = computed(() => this.current() === 'en');

  constructor() {
    this.applyToDocument(this.current());
  }

  /**
   * Testo tradotto.
   *
   * Ordine: quello riscritto dall'admin, poi quello del codice nella
   * lingua scelta, poi l'italiano, infine la chiave stessa. Il codice
   * resta la base: l'admin salva solo le voci che cambia, quindi una
   * chiave aggiunta domani funziona subito senza toccare il database.
   */
  t(key: string): string {
    const lang = this.current();
    const custom = this.overrides()[key]?.[lang];
    if (custom) {
      return custom;
    }
    return TRANSLATIONS[lang][key] ?? TRANSLATIONS.it[key] ?? key;
  }

  /** Testo originale del codice, ignorando le riscritture. */
  original(key: string, lang: Lang): string {
    return TRANSLATIONS[lang][key] ?? '';
  }

  /** Elenco completo delle chiavi, per l'editor dell'area riservata. */
  allKeys(): string[] {
    return Object.keys(TRANSLATIONS.it).sort();
  }

  setOverrides(map: Record<string, Partial<Record<Lang, string>>>): void {
    this.overrides.set(map);
  }

  /** Riscrittura di una sola chiave, per vedere subito l'effetto del salvataggio. */
  patchOverride(key: string, values: Partial<Record<Lang, string>> | null): void {
    this.overrides.update((all) => {
      const next = { ...all };
      if (values) {
        next[key] = values;
      } else {
        delete next[key];
      }
      return next;
    });
  }

  setLang(lang: Lang): void {
    if (lang === this.current()) {
      return;
    }

    this.current.set(lang);
    this.applyToDocument(lang);

    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // Navigazione privata o storage pieno: la lingua vale per questa visita.
    }
  }

  private applyToDocument(lang: Lang): void {
    document.documentElement.lang = lang;
  }
}

/**
 * Priorità: parametro nell'URL, poi scelta salvata, poi lingua del browser.
 *
 * L'URL viene per primo perché è quello che rende condivisibile un link:
 * chi riceve `/services?lang=en` deve vedere la pagina in inglese anche se
 * in passato aveva scelto l'italiano su questo sito.
 */
function detectInitialLang(): Lang {
  const fromUrl = new URLSearchParams(location.search).get(LANG_PARAM);
  if (fromUrl === 'it' || fromUrl === 'en') {
    return fromUrl;
  }

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'it' || saved === 'en') {
      return saved;
    }
  } catch {
    // storage non disponibile: si prosegue con il rilevamento
  }

  return navigator.language?.toLowerCase().startsWith('it') ? 'it' : 'en';
}
