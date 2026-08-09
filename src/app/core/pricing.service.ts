import { Injectable, inject, signal } from '@angular/core';
import { I18nService, Lang } from './i18n/i18n.service';
import { SupabaseService } from './supabase.service';

export interface PricingPackage {
  id: string;
  slug: string;
  nameIt: string;
  nameEn: string;
  audienceIt: string;
  audienceEn: string;
  price: number;
  durationIt: string;
  durationEn: string;
  featuresIt: string[];
  featuresEn: string[];
  discountPercent: number;
  discountLabelIt: string;
  discountLabelEn: string;
  highlight: boolean;
  active: boolean;
  sortOrder: number;
}

/** Pacchetto già risolto nella lingua attiva, pronto per il template. */
export interface PricingView {
  id: string;
  slug: string;
  name: string;
  audience: string;
  duration: string;
  features: string[];
  highlight: boolean;
  /** Prezzo pieno, formattato. Vuoto quando non c'è sconto. */
  fullPrice: string;
  /** Prezzo da pagare, formattato: scontato se c'è uno sconto. */
  price: string;
  discountLabel: string;
  hasDiscount: boolean;
}

export const EMPTY_PACKAGE: Omit<PricingPackage, 'id'> = {
  slug: '',
  nameIt: '',
  nameEn: '',
  audienceIt: '',
  audienceEn: '',
  price: 0,
  durationIt: '',
  durationEn: '',
  featuresIt: [],
  featuresEn: [],
  discountPercent: 0,
  discountLabelIt: '',
  discountLabelEn: '',
  highlight: false,
  active: true,
  sortOrder: 0,
};

/**
 * Pacchetti e prezzi.
 *
 * Il prezzo è un numero e la formattazione la fa il browser secondo la
 * lingua: 1.400 € in italiano, €1,400 in inglese. Prima erano due stringhe
 * separate, e bastava aggiornarne una per lasciare l'altra sbagliata.
 *
 * Lo sconto è una percentuale sul pacchetto: quando c'è, il sito mostra il
 * prezzo pieno barrato accanto a quello da pagare.
 */
@Injectable({ providedIn: 'root' })
export class PricingService {
  private readonly supabase = inject(SupabaseService);
  private readonly i18n = inject(I18nService);

  private readonly packagesSignal = signal<PricingPackage[]>([]);

  readonly packages = this.packagesSignal.asReadonly();

  async load(): Promise<void> {
    if (!this.supabase.isConfigured) {
      return;
    }

    try {
      const client = await this.supabase.getClient();
      const { data, error } = await client
        .from('pricing_packages')
        .select('*')
        .eq('active', true)
        .order('sort_order', { ascending: true });

      if (error || !data) {
        return;
      }
      this.packagesSignal.set((data as Record<string, unknown>[]).map(toPackage));
    } catch {
      // Senza pacchetti la sezione prezzi non compare: meglio del vuoto rotto.
    }
  }

  /** Pacchetti risolti nella lingua attiva, sconto già applicato. */
  view(): PricingView[] {
    const lang = this.i18n.lang();
    return this.packagesSignal().map((p) => resolve(p, lang));
  }

  // ------------------------------------------------------------------
  // Area riservata
  // ------------------------------------------------------------------

  async list(): Promise<PricingPackage[]> {
    const client = await this.supabase.getClient();
    const { data, error } = await client
      .from('pricing_packages')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      throw new Error(error.message);
    }
    return (data as Record<string, unknown>[]).map(toPackage);
  }

  async save(pack: Omit<PricingPackage, 'id'> & { id?: string }): Promise<void> {
    const client = await this.supabase.getClient();
    const payload = {
      slug: pack.slug.trim(),
      name_it: pack.nameIt,
      name_en: pack.nameEn,
      audience_it: pack.audienceIt,
      audience_en: pack.audienceEn,
      price: pack.price,
      duration_it: pack.durationIt,
      duration_en: pack.durationEn,
      features_it: pack.featuresIt,
      features_en: pack.featuresEn,
      discount_percent: pack.discountPercent,
      discount_label_it: pack.discountLabelIt,
      discount_label_en: pack.discountLabelEn,
      highlight: pack.highlight,
      active: pack.active,
      sort_order: pack.sortOrder,
    };

    const { error } = pack.id
      ? await client.from('pricing_packages').update(payload).eq('id', pack.id)
      : await client.from('pricing_packages').insert(payload);

    if (error) {
      throw new Error(error.message);
    }
    await this.load();
  }

  async remove(id: string): Promise<void> {
    const client = await this.supabase.getClient();
    const { error } = await client.from('pricing_packages').delete().eq('id', id);
    if (error) {
      throw new Error(error.message);
    }
    await this.load();
  }
}

// --------------------------------------------------------------------

function resolve(p: PricingPackage, lang: Lang): PricingView {
  const pick = (it: string, en: string) => (lang === 'en' ? en || it : it);
  const discounted = p.discountPercent > 0;
  const finalPrice = discounted ? p.price * (1 - p.discountPercent / 100) : p.price;

  return {
    id: p.id,
    slug: p.slug,
    name: pick(p.nameIt, p.nameEn),
    audience: pick(p.audienceIt, p.audienceEn),
    duration: pick(p.durationIt, p.durationEn),
    features: (lang === 'en' && p.featuresEn.length ? p.featuresEn : p.featuresIt).filter(Boolean),
    highlight: p.highlight,
    fullPrice: discounted ? formatPrice(p.price, lang) : '',
    price: formatPrice(finalPrice, lang),
    discountLabel: discounted ? pick(p.discountLabelIt, p.discountLabelEn) : '',
    hasDiscount: discounted,
  };
}

/**
 * Prezzo formattato secondo la lingua: 2.500 € in italiano, €2,500 in inglese.
 *
 * `useGrouping` va chiesto esplicitamente: con `maximumFractionDigits: 0`
 * l'italiano perde da solo il punto delle migliaia e stampa "2500 €",
 * mentre l'inglese continua a raggruppare. Senza questa riga il difetto
 * si vede in una lingua sola.
 */
export function formatPrice(value: number, lang: Lang): string {
  const whole = value % 1 === 0;
  return new Intl.NumberFormat(lang === 'en' ? 'en-GB' : 'it-IT', {
    style: 'currency',
    currency: 'EUR',
    useGrouping: true,
    minimumFractionDigits: whole ? 0 : 2,
    maximumFractionDigits: whole ? 0 : 2,
  }).format(value);
}

function toPackage(row: Record<string, unknown>): PricingPackage {
  const text = (key: string) => ((row[key] as string | null) ?? '').trim();
  const list = (key: string) => ((row[key] as string[] | null) ?? []).filter(Boolean);

  return {
    id: row['id'] as string,
    slug: text('slug'),
    nameIt: text('name_it'),
    nameEn: text('name_en'),
    audienceIt: text('audience_it'),
    audienceEn: text('audience_en'),
    price: Number(row['price'] ?? 0),
    durationIt: text('duration_it'),
    durationEn: text('duration_en'),
    featuresIt: list('features_it'),
    featuresEn: list('features_en'),
    discountPercent: Number(row['discount_percent'] ?? 0),
    discountLabelIt: text('discount_label_it'),
    discountLabelEn: text('discount_label_en'),
    highlight: !!row['highlight'],
    active: !!row['active'],
    sortOrder: Number(row['sort_order'] ?? 0),
  };
}
