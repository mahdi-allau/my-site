import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { I18nService } from '../../core/i18n/i18n.service';
import { SiteContentService } from '../../core/site-content.service';

interface Row {
  key: string;
  it: string;
  en: string;
  originalIt: string;
  originalEn: string;
  overridden: boolean;
}

/** Titoli leggibili dei gruppi, ricavati dal prefisso della chiave. */
const GROUP_LABELS: Record<string, string> = {
  nav: 'Barra di navigazione',
  home: 'Home',
  about: 'Chi siamo',
  services: 'Servizi',
  pricing: 'Prezzi e pacchetti',
  faq: 'Domande frequenti',
  projects: 'Progetti',
  contact: 'Contatti',
  privacy: 'Informativa privacy',
  footer: 'Piè di pagina',
  notfound: 'Pagina non trovata',
  demo: 'Progetti dimostrativi',
  seo: 'Titoli per i motori di ricerca',
  common: 'Testi ricorrenti',
  admin: 'Area riservata',
  lang: 'Selettore lingua',
};

@Component({
  selector: 'app-content-editor',
  imports: [FormsModule],
  templateUrl: './content-editor.html',
  styleUrl: './content-editor.css',
})
export class ContentEditor {
  private readonly site = inject(SiteContentService);
  protected readonly i18n = inject(I18nService);

  protected readonly rows = signal<Row[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal('');
  protected readonly savingKey = signal('');
  protected readonly toast = signal('');

  protected readonly search = signal('');
  protected readonly group = signal('home');
  protected readonly onlyChanged = signal(false);

  constructor() {
    void this.load();
  }

  // ------------------------------------------------------------------

  private async load(): Promise<void> {
    this.loading.set(true);
    this.error.set('');

    try {
      const saved = await this.site.listContent();
      const savedByKey = new Map(saved.map((row) => [row.key, row]));

      this.rows.set(
        this.i18n.allKeys().map((key) => {
          const custom = savedByKey.get(key);
          return {
            key,
            it: custom?.valueIt ?? this.i18n.original(key, 'it'),
            en: custom?.valueEn ?? this.i18n.original(key, 'en'),
            originalIt: this.i18n.original(key, 'it'),
            originalEn: this.i18n.original(key, 'en'),
            overridden: !!custom,
          };
        }),
      );
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : String(err));
    } finally {
      this.loading.set(false);
    }
  }

  // ------------------------------------------------------------------
  // Raggruppamento e filtri
  // ------------------------------------------------------------------

  protected readonly groups = computed(() => {
    const found = new Set(this.rows().map((row) => row.key.split('.')[0]));
    return [...found].sort().map((prefix) => ({
      prefix,
      label: GROUP_LABELS[prefix] ?? prefix,
      changed: this.rows().filter((r) => r.key.startsWith(prefix + '.') && r.overridden).length,
    }));
  });

  protected readonly visible = computed(() => {
    const text = this.search().trim().toLowerCase();
    const group = this.group();
    const onlyChanged = this.onlyChanged();

    return this.rows().filter((row) => {
      if (onlyChanged && !row.overridden) {
        return false;
      }
      // Con una ricerca in corso il gruppo non filtra: cercare per parola
      // serve proprio quando non si sa in quale pagina stia il testo.
      if (text) {
        return (
          row.key.toLowerCase().includes(text) ||
          row.it.toLowerCase().includes(text) ||
          row.en.toLowerCase().includes(text)
        );
      }
      return row.key.startsWith(group + '.');
    });
  });

  protected readonly changedCount = computed(() => this.rows().filter((r) => r.overridden).length);

  // ------------------------------------------------------------------
  // Modifica
  // ------------------------------------------------------------------

  protected async save(row: Row): Promise<void> {
    this.savingKey.set(row.key);
    this.error.set('');

    try {
      await this.site.saveContent({ key: row.key, valueIt: row.it, valueEn: row.en });
      this.rows.update((rows) =>
        rows.map((r) => (r.key === row.key ? { ...r, it: row.it, en: row.en, overridden: true } : r)),
      );
      this.flash('Testo salvato');
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : String(err));
    } finally {
      this.savingKey.set('');
    }
  }

  protected async reset(row: Row): Promise<void> {
    this.savingKey.set(row.key);

    try {
      await this.site.resetContent(row.key);
      this.rows.update((rows) =>
        rows.map((r) =>
          r.key === row.key
            ? { ...r, it: r.originalIt, en: r.originalEn, overridden: false }
            : r,
        ),
      );
      this.flash('Testo originale ripristinato');
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : String(err));
    } finally {
      this.savingKey.set('');
    }
  }

  protected setIt(row: Row, value: string): void {
    this.rows.update((rows) => rows.map((r) => (r.key === row.key ? { ...r, it: value } : r)));
  }

  protected setEn(row: Row, value: string): void {
    this.rows.update((rows) => rows.map((r) => (r.key === row.key ? { ...r, en: value } : r)));
  }

  /** Testi lunghi meritano più righe: si stima dalla lunghezza dell'originale. */
  protected linesFor(row: Row): number {
    const length = Math.max(row.originalIt.length, row.originalEn.length);
    if (length > 220) return 5;
    if (length > 90) return 3;
    return 2;
  }

  private flash(message: string): void {
    this.toast.set(message);
    setTimeout(() => this.toast.set(''), 2000);
  }
}
