import { Injectable, computed, inject, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { I18nService, Lang } from './i18n/i18n.service';
import { SupabaseService } from './supabase.service';

export interface SiteSettings {
  companyName: string;
  email: string;
  phone: string;
  whatsapp: string;
  street: string;
  city: string;
  postalCode: string;
  region: string;
  country: string;
  vat: string;
  mapsUrl: string;
}

export interface ContentRow {
  key: string;
  valueIt: string;
  valueEn: string;
}

const EMPTY: SiteSettings = {
  companyName: 'SARAH',
  email: environment.contactEmail,
  phone: '',
  whatsapp: '',
  street: '',
  city: '',
  postalCode: '',
  region: '',
  country: 'IT',
  vat: '',
  mapsUrl: '',
};

/**
 * Contenuti e dati aziendali modificabili dall'area riservata.
 *
 * Il sito parte con i testi del codice e i valori qui sotto: se il
 * database non risponde, o non è ancora configurato, si vede comunque
 * tutto. Quando le righe arrivano, i signal si aggiornano e la pagina si
 * riscrive da sola.
 */
@Injectable({ providedIn: 'root' })
export class SiteContentService {
  private readonly supabase = inject(SupabaseService);
  private readonly i18n = inject(I18nService);

  private readonly settingsSignal = signal<SiteSettings>({ ...EMPTY });
  private loaded = false;

  readonly settings = this.settingsSignal.asReadonly();

  /** Indirizzo su una riga, vuoto finché non viene compilato. */
  readonly addressLine = computed(() => {
    const s = this.settingsSignal();
    return [s.street, [s.postalCode, s.city].filter(Boolean).join(' '), s.region]
      .filter((part) => part.trim().length > 0)
      .join(', ');
  });

  /**
   * Carica testi e impostazioni. Idempotente: la chiamano sia l'avvio del
   * sito sia l'area riservata, e deve costare una sola volta.
   */
  async load(force = false): Promise<void> {
    if (!this.supabase.isConfigured || (this.loaded && !force)) {
      return;
    }
    this.loaded = true;

    try {
      const client = await this.supabase.getClient();

      const [content, settings] = await Promise.all([
        client.from('site_content').select('key, value_it, value_en'),
        client.from('site_settings').select('*').limit(1).maybeSingle(),
      ]);

      if (!content.error && content.data) {
        const map: Record<string, Partial<Record<Lang, string>>> = {};
        for (const row of content.data as { key: string; value_it: string; value_en: string }[]) {
          map[row.key] = {
            it: row.value_it?.trim() || undefined,
            en: row.value_en?.trim() || undefined,
          };
        }
        this.i18n.setOverrides(map);
      }

      if (!settings.error && settings.data) {
        this.settingsSignal.set(toSettings(settings.data));
      }
    } catch {
      // Rete assente o tabelle non ancora create: restano i valori del codice.
    }
  }

  // ------------------------------------------------------------------
  // Scrittura (area riservata)
  // ------------------------------------------------------------------

  async listContent(): Promise<ContentRow[]> {
    const client = await this.supabase.getClient();
    const { data, error } = await client.from('site_content').select('key, value_it, value_en');

    if (error) {
      throw new Error(error.message);
    }

    return (data as { key: string; value_it: string; value_en: string }[]).map((row) => ({
      key: row.key,
      valueIt: row.value_it ?? '',
      valueEn: row.value_en ?? '',
    }));
  }

  async saveContent(row: ContentRow): Promise<void> {
    const client = await this.supabase.getClient();
    const { error } = await client
      .from('site_content')
      .upsert({ key: row.key, value_it: row.valueIt, value_en: row.valueEn }, { onConflict: 'key' });

    if (error) {
      throw new Error(error.message);
    }

    this.i18n.patchOverride(row.key, {
      it: row.valueIt.trim() || undefined,
      en: row.valueEn.trim() || undefined,
    });
  }

  /** Ripristinare l'originale significa togliere la riga, non svuotarla. */
  async resetContent(key: string): Promise<void> {
    const client = await this.supabase.getClient();
    const { error } = await client.from('site_content').delete().eq('key', key);

    if (error) {
      throw new Error(error.message);
    }

    this.i18n.patchOverride(key, null);
  }

  async saveSettings(settings: SiteSettings): Promise<void> {
    const client = await this.supabase.getClient();
    const { error } = await client.from('site_settings').update({
      company_name: settings.companyName,
      email: settings.email,
      phone: settings.phone,
      whatsapp: settings.whatsapp,
      street: settings.street,
      city: settings.city,
      postal_code: settings.postalCode,
      region: settings.region,
      country: settings.country,
      vat: settings.vat,
      maps_url: settings.mapsUrl,
    }).eq('id', true);

    if (error) {
      throw new Error(error.message);
    }

    this.settingsSignal.set(settings);
  }
}

function toSettings(row: Record<string, unknown>): SiteSettings {
  const text = (key: string, fallback = '') => (row[key] as string | null)?.trim() || fallback;

  return {
    companyName: text('company_name', EMPTY.companyName),
    email: text('email', EMPTY.email),
    phone: text('phone'),
    whatsapp: text('whatsapp'),
    street: text('street'),
    city: text('city'),
    postalCode: text('postal_code'),
    region: text('region'),
    country: text('country', 'IT'),
    vat: text('vat'),
    mapsUrl: text('maps_url'),
  };
}
