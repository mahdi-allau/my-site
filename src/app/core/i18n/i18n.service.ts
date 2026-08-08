import { Injectable, computed, signal } from '@angular/core';
import { TRANSLATIONS } from './translations';

export type Lang = 'it' | 'en';

export const LANGUAGES: ReadonlyArray<{ code: Lang; label: string; name: string }> = [
  { code: 'it', label: 'IT', name: 'Italiano' },
  { code: 'en', label: 'EN', name: 'English' },
];

const STORAGE_KEY = 'ma.lang';

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

  readonly lang = this.current.asReadonly();
  readonly isEnglish = computed(() => this.current() === 'en');

  constructor() {
    this.applyToDocument(this.current());
  }

  /** Testo tradotto. Se manca in inglese ricade sull'italiano, poi sulla chiave. */
  t(key: string): string {
    const lang = this.current();
    return TRANSLATIONS[lang][key] ?? TRANSLATIONS.it[key] ?? key;
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

/** Scelta salvata, altrimenti lingua del browser, altrimenti italiano. */
function detectInitialLang(): Lang {
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
